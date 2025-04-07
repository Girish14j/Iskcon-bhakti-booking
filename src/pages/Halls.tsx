
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock, ArrowRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Hall = {
  id: string;
  name: string;
  capacity: number;
  hourly_rate: number;
  description: string;
  image_url: string | null;
  is_active: boolean;
};

const Halls = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const { data, error } = await supabase
          .from("halls")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setHalls(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching halls",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, [toast]);

  const handleSelectHall = (hall: Hall) => {
    navigate("/date-time", { state: { hallData: hall } });
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Select a Hall</h1>
        <p className="text-muted-foreground">
          Choose a hall that fits your event requirements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="border rounded-lg overflow-hidden group hover:border-primary transition-colors">
            <div className="h-48 bg-muted relative overflow-hidden">
              {hall.image_url ? (
                <img 
                  src={hall.image_url} 
                  alt={hall.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{hall.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {hall.description}
              </p>
              <div className="flex justify-between mb-4">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{hall.capacity} people</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>₹{hall.hourly_rate}/hour</span>
                </div>
              </div>
              <Button 
                className="w-full group-hover:bg-primary/90" 
                onClick={() => handleSelectHall(hall)}
              >
                Select <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {halls.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No halls available</h3>
          <p className="text-muted-foreground">
            There are currently no active halls. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Halls;
