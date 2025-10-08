import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingWithDetails } from "@/components/admin/BookingsList";

export const useBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      // First get all bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;
      
      // Then fetch profile data for each booking
      const bookingsWithDetails: BookingWithDetails[] = [];
      
      for (const booking of bookingsData) {
        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("full_name, phone_number")
          .eq("id", booking.user_id)
          .single();
        
        // Get hall data
        const { data: hallData, error: hallError } = await supabase
          .from("halls")
          .select("name, capacity")
          .eq("id", booking.hall_id)
          .single();
        
        // Make sure we cast the status to the correct type
        const typedStatus = booking.status as BookingWithDetails["status"];
        
        bookingsWithDetails.push({
          ...booking,
          status: typedStatus,
          user_name: userData?.full_name || null,
          user_phone: userData?.phone_number || null,
          hall_name: hallData?.name || null,
          hall_capacity: hallData?.capacity || null
        });
      }
      
      setBookings(bookingsWithDetails);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingBookings(false);
    }
  }, [toast]);

  const handleViewDetails = useCallback((booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.admin_notes || "");
    setIsSheetOpen(true);
  }, []);

  const sendApprovalEmail = async (booking: BookingWithDetails, status: 'approved' | 'rejected') => {
    try {
      // Get user email from auth
      const { data: authUser } = await supabase.auth.admin.getUserById(booking.user_id);
      
      if (!authUser.user?.email) {
        console.error('No email found for user');
        return;
      }

      const emailData = {
        bookingId: booking.id,
        userEmail: authUser.user.email,
        userName: booking.user_name || authUser.user.email,
        hallName: booking.hall_name || 'Hall',
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        startTime: booking.start_time,
        endTime: booking.end_time,
        purpose: booking.purpose,
        emailType: status,
        adminNotes: adminNotes
      };

      const response = await fetch("https://zpqvsedngdmzaeuorhxt.supabase.co/functions/v1/send-booking-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcXZzZWRuZ2RtemFldW9yaHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjc4NDIsImV4cCI6MjA1OTYwMzg0Mn0.nt406oPtuPc5AF3gUsAgn3AzrdvTv8Ba6M8EKwRhNos`,
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to send email");
      }

      console.log(`${status} email sent successfully`);
    } catch (error) {
      console.error(`Error sending ${status} email:`, error);
      // Don't throw error here to prevent blocking the booking update
    }
  };

  const updateBookingStatus = useCallback(async (bookingId: string, status: BookingWithDetails["status"]) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId);
        
      if (error) throw error;
      
      // Find the booking to send email
      const booking = bookings.find(b => b.id === bookingId);
      if (booking && (status === 'approved' || status === 'rejected')) {
        // Send approval/rejection email
        await sendApprovalEmail(booking, status);
      }
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status, admin_notes: adminNotes } 
            : booking
        )
      );
      
      toast({
        title: `Booking ${status}`,
        description: `The booking has been ${status} successfully. ${status === 'approved' || status === 'rejected' ? 'Confirmation email sent to user.' : ''}`,
      });
      
      // Close the sheet
      setIsSheetOpen(false);
      setSelectedBooking(null);
    } catch (error: any) {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [adminNotes, toast, bookings]);

  return {
    bookings,
    isLoadingBookings,
    selectedBooking,
    adminNotes,
    isUpdating,
    isSheetOpen,
    setAdminNotes,
    setIsSheetOpen,
    fetchBookings,
    handleViewDetails,
    updateBookingStatus
  };
};