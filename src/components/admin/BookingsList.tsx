
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BookingStatus, getStatusBadge } from "./BookingStatusBadge";

export interface BookingWithDetails {
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

interface BookingsListProps {
  bookings: BookingWithDetails[];
  isLoading: boolean;
  onViewDetails: (booking: BookingWithDetails) => void;
}

export const BookingsList = ({ bookings, isLoading, onViewDetails }: BookingsListProps) => {
  return (
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
        {isLoading ? (
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
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(booking)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
