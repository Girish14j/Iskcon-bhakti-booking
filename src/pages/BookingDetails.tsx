import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Check, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const bookingData = location.state;
  
  const [purpose, setPurpose] = useState("");
  const [attendees, setAttendees] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!bookingData || !bookingData.hallData) {
    navigate("/book-now");
    return null;
  }
  
  const handleSubmit = async () => {
    if (!purpose) {
      toast({
        title: "Missing information",
        description: "Please enter the purpose of your booking",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to complete your booking",
        variant: "destructive",
      });
      navigate("/auth", { state: { returnTo: location.pathname, bookingData } });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert booking into database
      const { data: bookingResult, error } = await supabase.from("bookings").insert({
        user_id: user.id,
        hall_id: bookingData.hallData.id,
        booking_date: format(bookingData.date, "yyyy-MM-dd"),
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        purpose,
        attendees,
      }).select().single();
      
      if (error) throw error;
      
      // Get user details for email
      const { data: userData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      // Send confirmation email
      const emailData = {
        bookingId: bookingResult.id,
        userEmail: user.email,
        userName: userData?.full_name || user.email,
        hallName: bookingData.hallData.name,
        bookingDate: format(bookingData.date, "PPP"),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        purpose,
      };
      
      // Call the edge function to send email
      await sendBookingConfirmation(emailData.bookingId, emailData.hallName, emailData.bookingDate, emailData.startTime, emailData.endTime, emailData.purpose);
      
      toast({
        title: "Booking submitted successfully",
        description: "Your booking request has been submitted and is pending approval. A confirmation email has been sent to your email address.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error submitting booking",
        description: error.message || "There was an error submitting your booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const sendBookingConfirmation = async (bookingId: string, hallName: string, bookingDate: string, startTime: string, endTime: string, purpose: string) => {
    const userName = user?.email || "";
    const userEmail = user?.email || "";
    
    try {
      const response = await fetch("/api/sendBookingEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userEmail,
          subject: 'Your booking request has been submitted',
          html: `<p>Dear ${userName},</p>
            <p>Your booking for <strong>${hallName}</strong> on <strong>${bookingDate}</strong> from <strong>${startTime}</strong> to <strong>${endTime}</strong> has been submitted and is pending approval.</p>
            <p>Purpose: ${purpose}</p>`
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to send confirmation");
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Error sending confirmation:", error);
      return { success: false, error: error.message };
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container max-w-4xl mx-auto py-10 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
            <p className="text-muted-foreground">
              Complete your booking information
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="p-6 border rounded-xl bg-muted/20">
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hall</p>
                  <p className="font-medium">{bookingData.hallData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(bookingData.date, "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{bookingData.startTime} - {bookingData.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{bookingData.duration} {bookingData.duration === 1 ? "hour" : "hours"}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Event Details</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Purpose of event</label>
                <Input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe the purpose of your event"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Expected Attendees</label>
                  <span className="text-sm">{attendees} people</span>
                </div>
                <Slider
                  value={[attendees]}
                  min={1}
                  max={bookingData.hallData.capacity}
                  step={1}
                  onValueChange={(values) => setAttendees(values[0])}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum capacity: {bookingData.hallData.capacity} people
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Available for your selected date and time</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Your booking will be pending until approved by an administrator. You will receive
                a notification once your booking has been reviewed.
              </p>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetails;
