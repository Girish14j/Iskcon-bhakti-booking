
import { useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useBookings } from "@/hooks/useBookings";
import { BookingsList } from "@/components/admin/BookingsList";
import { BookingDetails } from "@/components/admin/BookingDetails";

const AdminDashboard = () => {
  const { isAuthorized, isLoading } = useProtectedRoute(true);
  
  const {
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
  } = useBookings();

  useEffect(() => {
    if (isAuthorized && !isLoading) {
      fetchBookings();
    }
  }, [isAuthorized, isLoading, fetchBookings]);

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
        
        <BookingsList 
          bookings={bookings}
          isLoading={isLoadingBookings}
          onViewDetails={handleViewDetails}
        />
      </div>

      <BookingDetails
        booking={selectedBooking}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        adminNotes={adminNotes}
        onAdminNotesChange={setAdminNotes}
        onUpdateStatus={updateBookingStatus}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default AdminDashboard;
