import { Badge } from "@/components/ui/badge";

export type BookingStatus = "pending" | "approved" | "rejected";

export const getStatusBadge = (status: BookingStatus) => {
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
