
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Check, X, Clock, Filter, Eye } from "lucide-react";

import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { supabase } from "@/integrations/supabase/client";

type BookingStatus = "pending" | "approved" | "rejected";

interface BookingWithDetails {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  attendees: number;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string | null;
  user_id: string;
  hall_id: string;
  user_name: string | null;
  user_phone: string | null;
  hall_name: string | null;
  hall_capacity: number | null;
}

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const AdminDashboard = () => {
  const { isAuthorized, isLoading } = useProtectedRoute(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchBookings = async () => {
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
        const typedStatus = booking.status as BookingStatus;
        
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
  };

  useEffect(() => {
    if (isAuthorized && !isLoading) {
      fetchBookings();
    }
  }, [isAuthorized, isLoading]);

  const handleViewDetails = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.admin_notes || "");
    setIsSheetOpen(true);
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
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
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // useProtectedRoute will handle redirection
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking Requests</h1>
        <p className="text-muted-foreground">
          Manage hall booking requests
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Bookings</h2>
          <Button variant="outline" size="sm" onClick={fetchBookings} disabled={isLoadingBookings}>
            <Filter className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Hall</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingBookings ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">Loading bookings...</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">No booking requests found</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{format(new Date(booking.booking_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{booking.start_time} - {booking.end_time}</TableCell>
                  <TableCell>{booking.hall_name || "Unknown"}</TableCell>
                  <TableCell>{booking.user_name || "Unknown"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{booking.purpose}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Separate sheet component instead of nesting in map */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle>Booking Details</SheetTitle>
                <SheetDescription>
                  Review and manage the booking request
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Hall</p>
                      <p className="font-medium">{selectedBooking.hall_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{format(new Date(selectedBooking.booking_date), "PPP")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{selectedBooking.start_time} - {selectedBooking.end_time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p>{getStatusBadge(selectedBooking.status)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium">{selectedBooking.user_name || "Unknown"}</p>
                    {selectedBooking.user_phone && (
                      <p className="text-sm">{selectedBooking.user_phone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Purpose</h4>
                  <div className="p-3 bg-muted/50 rounded-md">
                    {selectedBooking.purpose}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Event Details</h4>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p>Expected Attendees: {selectedBooking.attendees} people</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Admin Notes</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this booking"
                    className="min-h-[100px]"
                  />
                </div>
                
                {selectedBooking.status === "pending" && (
                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1" 
                      variant="outline" 
                      onClick={() => updateBookingStatus(selectedBooking.id, "rejected")}
                      disabled={isUpdating}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={() => updateBookingStatus(selectedBooking.id, "approved")}
                      disabled={isUpdating}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;
