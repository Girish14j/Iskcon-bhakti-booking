
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  bookingId: string;
  userEmail: string;
  userName: string;
  hallName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the booking data from request
    const { bookingId, userEmail, userName, hallName, bookingDate, startTime, endTime, purpose } = await req.json() as BookingEmailRequest;

    if (!bookingId || !userEmail) {
      throw new Error("Missing required fields");
    }

    // Send email using Supabase Auth email service
    const { error } = await supabase.auth.admin.sendRawEmail({
      email: userEmail,
      subject: "Your Hall Booking Confirmation",
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #F9A825;">Iskcon Bliss Hall Booking</h1>
            <p style="font-size: 18px;">Booking Confirmation</p>
          </div>
          
          <p>Dear ${userName},</p>
          
          <p>Your hall booking has been successfully submitted and is now pending approval. Here are the details of your booking:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Hall:</strong> ${hallName}</p>
            <p><strong>Date:</strong> ${bookingDate}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Status:</strong> Pending Approval</p>
          </div>
          
          <p>Our team will review your booking shortly. You will receive another email once your booking has been approved.</p>
          
          <p>If you have any questions or need to make changes to your booking, please reply to this email or contact us at bookings@iskconbliss.org.</p>
          
          <p>Thank you for choosing Iskcon Bliss for your event.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #888888;">
            <p>ISKCON Temple Complex, Hare Krishna Hill, East of Kailash, New Delhi - 110065</p>
            <p>Phone: +91 11 2647 5961 | Email: info@iskconbliss.org</p>
          </div>
        </div>
      `,
      captchaToken: null,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
