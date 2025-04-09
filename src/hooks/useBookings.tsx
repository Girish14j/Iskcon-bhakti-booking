
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
        description: `The booking has been ${status} successfully.`,
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
  }, [adminNotes, toast]);

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
