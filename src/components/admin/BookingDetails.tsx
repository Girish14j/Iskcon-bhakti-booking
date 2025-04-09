
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BookingWithDetails } from "./BookingsList";
import { getStatusBadge } from "./BookingStatusBadge";

interface BookingDetailsProps {
  booking: BookingWithDetails | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  adminNotes: string;
  onAdminNotesChange: (notes: string) => void;
  onUpdateStatus: (bookingId: string, status: "approved" | "rejected") => void;
  isUpdating: boolean;
}

export const BookingDetails = ({ 
  booking, 
  isOpen, 
  onOpenChange,
  adminNotes,
  onAdminNotesChange,
  onUpdateStatus,
  isUpdating 
}: BookingDetailsProps) => {
  if (!booking) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto max-h-screen pb-20">
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
                <p className="font-medium">{booking.hall_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{format(new Date(booking.booking_date), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{booking.start_time} - {booking.end_time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p>{getStatusBadge(booking.status)}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">User</p>
              <p className="font-medium">{booking.user_name || "Unknown"}</p>
              {booking.user_phone && (
                <p className="text-sm">{booking.user_phone}</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Purpose</h4>
            <div className="p-3 bg-muted/50 rounded-md">
              {booking.purpose}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Event Details</h4>
            <div className="p-3 bg-muted/50 rounded-md">
              <p>Expected Attendees: {booking.attendees} people</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Admin Notes</h4>
            <Textarea
              value={adminNotes}
              onChange={(e) => onAdminNotesChange(e.target.value)}
              placeholder="Add notes about this booking"
              className="min-h-[100px]"
            />
          </div>
          
          {booking.status === "pending" && (
            <div className="flex gap-2 pt-4 pb-10">
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={() => onUpdateStatus(booking.id, "rejected")}
                disabled={isUpdating}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => onUpdateStatus(booking.id, "approved")}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
