
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Booking = {
  id: string;
  hall_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
};

const DateTimeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const hallData = location.state?.hallData;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [duration, setDuration] = useState<number>(1);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [timeConflict, setTimeConflict] = useState(false);
  
  // Calculate end time based on start time and duration
  const calculateEndTime = (start: string, durationHours: number) => {
    const [hours, minutes] = start.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationHours * 60;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
  };
  
  const endTime = calculateEndTime(startTime, duration);
  
  // Generate time options (30-minute intervals)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  // Fetch existing bookings for this hall when date changes
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate || !hallData) return;
      
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const { data, error } = await supabase
          .from("bookings")
          .select("id, hall_id, booking_date, start_time, end_time")
          .eq("hall_id", hallData.id)
          .eq("booking_date", formattedDate)
          .in("status", ["pending", "approved"]);
        
        if (error) throw error;
        setExistingBookings(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching existing bookings",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    fetchBookings();
  }, [selectedDate, hallData, toast]);

  // Check for time conflicts when start time, duration or date changes
  useEffect(() => {
    if (!selectedDate || existingBookings.length === 0) {
      setTimeConflict(false);
      return;
    }
    
    const hasConflict = existingBookings.some(booking => {
      // Convert times to minutes for easier comparison
      const bookingStart = booking.start_time.split(":").map(Number);
      const bookingEnd = booking.end_time.split(":").map(Number);
      const bookingStartMinutes = bookingStart[0] * 60 + bookingStart[1];
      const bookingEndMinutes = bookingEnd[0] * 60 + bookingEnd[1];
      
      const newStart = startTime.split(":").map(Number);
      const newStartMinutes = newStart[0] * 60 + newStart[1];
      const newEndMinutes = newStartMinutes + duration * 60;
      
      // Check for overlap
      return (
        (newStartMinutes >= bookingStartMinutes && newStartMinutes < bookingEndMinutes) ||
        (newEndMinutes > bookingStartMinutes && newEndMinutes <= bookingEndMinutes) ||
        (newStartMinutes <= bookingStartMinutes && newEndMinutes >= bookingEndMinutes)
      );
    });
    
    setTimeConflict(hasConflict);
  }, [selectedDate, startTime, duration, existingBookings]);
  
  const handleContinue = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a date to continue",
        variant: "destructive",
      });
      return;
    }

    if (timeConflict) {
      toast({
        title: "Time conflict detected",
        description: "This time slot is already booked. Please select a different time or date.",
        variant: "destructive",
      });
      return;
    }

    const bookingDetails = {
      hallData: hallData,
      date: selectedDate,
      startTime,
      endTime,
      duration,
    };
    
    navigate("/booking-details", { state: bookingDetails });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container max-w-4xl mx-auto py-10 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Select Date & Time</h1>
            <p className="text-muted-foreground">
              Choose your preferred date and time for your event
            </p>
            {hallData && (
              <div className="mt-2 p-4 bg-muted rounded-lg">
                <p className="font-semibold">{hallData.name}</p>
                <p className="text-sm text-muted-foreground">Capacity: {hallData.capacity} people</p>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-lg font-medium">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time Selection */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-medium">Select Start Time</label>
                <Select
                  value={startTime}
                  onValueChange={(value) => setStartTime(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-lg font-medium">Duration (hours)</label>
                  <span className="font-medium">{duration} {duration === 1 ? "hour" : "hours"}</span>
                </div>
                <Slider
                  value={[duration]}
                  min={1}
                  max={8}
                  step={0.5}
                  onValueChange={(values) => setDuration(values[0])}
                  className="py-4"
                />
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Booking Summary</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Start Time:</div>
                  <div className="font-medium">{startTime}</div>
                  <div>End Time:</div>
                  <div className="font-medium">{endTime}</div>
                  <div>Duration:</div>
                  <div className="font-medium">{duration} {duration === 1 ? "hour" : "hours"}</div>
                </div>
              </div>

              {timeConflict && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Time Conflict</AlertTitle>
                  <AlertDescription>
                    This time slot is already booked. Please select a different time or date.
                  </AlertDescription>
                </Alert>
              )}

              {existingBookings.length > 0 && !timeConflict && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Other Bookings on This Date</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2">
                      <p className="mb-2">There are other bookings on this date:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {existingBookings.map((booking, index) => (
                          <li key={index}>
                            {booking.start_time} - {booking.end_time}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button onClick={handleContinue} disabled={timeConflict}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DateTimeSelection;
