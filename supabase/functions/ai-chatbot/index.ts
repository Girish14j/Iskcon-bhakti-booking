import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// -------- Helper: Get free slots in a day --------
function getAvailableSlots(bookingsForHall: any[]) {
  const dayStart = "08:00";
  const dayEnd = "22:00";

  if (!bookingsForHall.length) {
    return [`${dayStart} - ${dayEnd}`];
  }

  const sorted = bookingsForHall.sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  const slots: string[] = [];
  let currentStart = dayStart;

  for (const b of sorted) {
    if (currentStart < b.start_time) {
      slots.push(`${currentStart} - ${b.start_time}`);
    }
    currentStart = b.end_time;
  }

  if (currentStart < dayEnd) {
    slots.push(`${currentStart} - ${dayEnd}`);
  }

  return slots;
}

// -------- Helper: Next available date --------
function findNextAvailableDate(
  halls: any[],
  bookings: any[],
  people: number,
  startDate: string
) {
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + i);
    const dateStr = nextDate.toISOString().split("T")[0];

    const available = halls.filter((hall) => {
      if (people && hall.capacity < people) return false;

      const conflict = bookings.some(
        (b) => b.hall_id === hall.id && b.booking_date === dateStr
      );

      return !conflict;
    });

    if (available.length > 0) {
      return { date: dateStr, halls: available };
    }
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OpenAI key missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // -------- Fetch Data --------
    const { data: halls } = await supabase
      .from("halls")
      .select("*")
      .eq("is_active", true);

    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .in("status", ["pending", "approved"]);

    // -------- 1. Intent Detection --------
    const intentResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `
Extract intent and return JSON only.

{
  "intent": "check_availability | create_booking | general",
  "date": "YYYY-MM-DD or null",
  "start_time": "HH:MM or null",
  "end_time": "HH:MM or null",
  "people": number or null,
  "hall_name": "string or null"
}
              `,
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const intentData = await intentResponse.json();
    const extracted = JSON.parse(intentData.choices[0].message.content);

    const { intent, date, start_time, end_time, people, hall_name } =
      extracted;

  
    //  CHECK AVAILABILITY 

    if (intent === "check_availability") {
      if (!date) {
        return new Response(
          JSON.stringify({
            response: "Please provide a date.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let availableHalls = halls?.filter((hall) => {
        if (people && hall.capacity < people) return false;

        const conflict = bookings?.some((b) => {
          if (b.hall_id !== hall.id) return false;
          if (b.booking_date !== date) return false;

          if (start_time && end_time) {
            return start_time < b.end_time && end_time > b.start_time;
          }

          return true;
        });

        return !conflict;
      });

      if (!availableHalls || availableHalls.length === 0) {
        const next = findNextAvailableDate(
          halls || [],
          bookings || [],
          people,
          date
        );

        if (next) {
          return new Response(
            JSON.stringify({
              response: `No halls available on ${date}.

Next availability on ${next.date}:
${next.halls
  .map((h) => `• ${h.name} (${h.capacity})`)
  .join("\n")}`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            response: `No halls available for the next few days.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // -------- Best-fit recommendation --------
      if (people) {
        availableHalls.sort((a, b) => a.capacity - b.capacity);
        const best = availableHalls[0];

        return new Response(
          JSON.stringify({
            response: `Best hall for ${people} people on ${date}:

${best.name} (Capacity: ${best.capacity})

Other available halls:
${availableHalls
  .slice(1)
  .map((h) => `• ${h.name} (${h.capacity})`)
  .join("\n") || "None"}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          response: `Available halls on ${date}:

${availableHalls
  .map((h) => `• ${h.name} (${h.capacity})`)
  .join("\n")}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    
    // 3. CREATE BOOKING
    
    if (intent === "create_booking") {
      if (!hall_name || !date || !start_time || !end_time || !people) {
        return new Response(
          JSON.stringify({
            response:
              "Please provide hall name, date, time and number of attendees.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const hall = halls?.find(
        (h) => h.name.toLowerCase() === hall_name.toLowerCase()
      );

      if (!hall) {
        return new Response(
          JSON.stringify({
            response: `Hall "${hall_name}" not found.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Capacity check + alternatives
      if (people > hall.capacity) {
        const alternatives = halls
          ?.filter((h) => h.capacity >= people)
          .sort((a, b) => a.capacity - b.capacity);

        return new Response(
          JSON.stringify({
            response: `${hall.name} capacity is ${hall.capacity}.

Better options:
${alternatives
  ?.map((h) => `• ${h.name} (${h.capacity})`)
  .join("\n")}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Conflict check
      const conflicts = bookings?.filter(
        (b) =>
          b.hall_id === hall.id &&
          b.booking_date === date &&
          start_time < b.end_time &&
          end_time > b.start_time
      );

      if (conflicts && conflicts.length > 0) {
        const hallBookings = bookings?.filter(
          (b) => b.hall_id === hall.id && b.booking_date === date
        );

        const freeSlots = getAvailableSlots(hallBookings || []);

        return new Response(
          JSON.stringify({
            response: `${hall.name} is booked at that time.

Available slots:
${freeSlots.map((s) => `• ${s}`).join("\n")}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create booking
      const { error } = await supabase.from("bookings").insert({
        hall_id: hall.id,
        booking_date: date,
        start_time,
        end_time,
        attendees: people,
        status: "pending",
      });

      if (error) {
        return new Response(
          JSON.stringify({
            response: "Error creating booking.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          response: `Booking created for ${hall.name} on ${date} from ${start_time} to ${end_time}. Status: Pending approval.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // =====================================================
    // 4. GENERAL CHAT
    // =====================================================
    const chatResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
              {
                role: "system",
                content: `
            You are an assistant for ISKCON hall booking.
            
            Rules:
            - Respond in plain text only.
            - Do NOT use markdown.
            - Do NOT use *, **, bullet points, or numbering.
            - Do NOT use bold or special formatting.
            - Write simple sentences.
            - Ask details one by one in normal sentences.
            Example:
            "Please tell me the hall name."
            "Please provide the date."

            `,
              },
              { role: "user", content: message },
            ],
        }),
      }
    );

    const chatData = await chatResponse.json();
    let text =
  chatData.choices?.[0]?.message?.content ||
  "Sorry, I couldn't understand.";

// Remove markdown formatting
text = text
  .replace(/\*\*/g, "")
  .replace(/\*/g, "")
  .replace(/^\d+\.\s/gm, "")   // removes numbered lists like "1. "
  .replace(/-/g, "");

    return new Response(JSON.stringify({ response: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        response: "Server error. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});