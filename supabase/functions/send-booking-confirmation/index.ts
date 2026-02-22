import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Deno } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

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
  emailType?: 'confirmation' | 'approved' | 'rejected';
  adminNotes?: string;
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
    const { 
      bookingId, 
      userEmail, 
      userName, 
      hallName, 
      bookingDate, 
      startTime, 
      endTime, 
      purpose,
      emailType = 'confirmation',
      adminNotes
    } = await req.json() as BookingEmailRequest;

    if (!bookingId || !userEmail) {
      throw new Error("Missing required fields");
    }

    let subject = "";
    let bodyContent = "";

    switch (emailType) {
      case 'approved':
        subject = "🎉 Your Hall Booking has been APPROVED!";
        bodyContent = `
          <p>Great news ${userName}!</p>
          
          <p><strong>Your hall booking has been APPROVED!</strong> We're excited to host your event.</p>
          
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
            <p><strong>✅ BOOKING CONFIRMED</strong></p>
            <p><strong>Hall:</strong> ${hallName}</p>
            <p><strong>Date:</strong> ${bookingDate}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">APPROVED</span></p>
          </div>
          
          ${adminNotes ? `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Admin Notes:</strong></p>
            <p>${adminNotes}</p>
          </div>
          ` : ''}
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Your booking is now confirmed for the specified date and time</li>
            <li>Please arrive 15 minutes early for setup</li>
            <li>Contact us if you need any special arrangements</li>
          </ul>
          
          <p>We look forward to hosting your event!</p>
        `;
        break;
        
      case 'rejected':
        subject = "Booking Update - Hall Booking Request";
        bodyContent = `
          <p>Dear ${userName},</p>
          
          <p>Thank you for your interest in booking our hall. Unfortunately, we are unable to approve your booking request at this time.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
            <p><strong>Booking Details:</strong></p>
            <p><strong>Hall:</strong> ${hallName}</p>
            <p><strong>Date:</strong> ${bookingDate}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">Not Approved</span></p>
          </div>
          
          ${adminNotes ? `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Reason:</strong></p>
            <p>${adminNotes}</p>
          </div>
          ` : ''}
          
          <p>Please feel free to:</p>
          <ul>
            <li>Submit a new booking request for different dates</li>
            <li>Contact us to discuss alternative options</li>
            <li>Reply to this email if you have any questions</li>
          </ul>
          
          <p>We appreciate your understanding.</p>
        `;
        break;
        
      default: // confirmation
        subject = "Your Hall Booking Confirmation";
        bodyContent = `
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
        `;
    }

    // Send email using Supabase Auth email service
    const { error } = await supabase.auth.admin.sendRawEmail({
      email: userEmail,
      subject: subject,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #F9A825;">Iskcon Bliss Hall Booking</h1>
            <p style="font-size: 18px;">${emailType === 'approved' ? 'Booking Approved!' : emailType === 'rejected' ? 'Booking Update' : 'Booking Confirmation'}</p>
          </div>
          
          ${bodyContent}
          
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

    console.log("Email sent successfully");

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
