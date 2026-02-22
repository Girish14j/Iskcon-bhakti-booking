import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: WelcomeEmailRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = "Welcome to ISKCON Bliss!";
    const name = fullName || email.split("@")[0];

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="margin: 0; color: #0f172a;">Hare Krishna, ${name}!</h1>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Thank you for creating an account with ISKCON Bliss. We're delighted to have you with us.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #334155;">You can now book halls, track your bookings, and receive updates on approvals directly via email.</p>
        </div>
        <p style="color: #334155; font-size: 14px;">If you didn’t create this account, please ignore this message.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">ISKCON Temple Complex, Hare Krishna Hill, East of Kailash, New Delhi - 110065</p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "ISKCON Bliss <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
