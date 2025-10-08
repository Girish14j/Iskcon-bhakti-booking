
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock, ArrowRight, MapPin } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Hall = {
  id: string;
  name: string;
  capacity: number;
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container max-w-5xl mx-auto py-20 px-4 text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
              <div className="grid gap-8 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden border border-iskcon-gold/20">
                    <div className="h-52 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                      <div className="flex justify-between mb-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4">
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container max-w-5xl mx-auto py-16 px-4">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground font-cormorant">
              Sacred <span className="text-iskcon-saffron">Spaces</span> for Your Events
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our selection of beautiful halls for your next spiritual gathering, celebration, or community event
            </p>
            <Separator className="mt-8 max-w-md mx-auto bg-iskcon-gold/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {halls.map((hall) => (
              <Card 
                key={hall.id} 
                className="overflow-hidden border border-iskcon-gold/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card flex flex-col"
              >
                <div className="h-52 relative overflow-hidden">
                  {hall.image_url ? (
                    <img 
                      src={hall.image_url} 
                      alt={hall.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <MapPin className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold mb-2 font-cormorant text-foreground">{hall.name}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {hall.description}
                  </p>
                  <div className="flex flex-col mb-4">
                    <div className="flex items-center font-medium">
                      <Users className="h-4 w-4 mr-2 text-iskcon-saffron" />
                      <span>{hall.capacity} people</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Capacity Usage</span>
                      <span className="font-medium">{hall.capacity} max</span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" />
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/30 p-4 border-t border-border">
                  <Button 
                    className="w-full bg-iskcon-saffron hover:bg-iskcon-gold text-white" 
                    onClick={() => handleSelectHall(hall)}
                  >
                    Select This Hall <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {halls.length === 0 && (
            <div className="text-center py-16 border border-iskcon-gold/20 rounded-lg bg-muted/20 mt-8">
              <h3 className="text-xl font-medium mb-2">No halls available</h3>
              <p className="text-muted-foreground">
                There are currently no active halls. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Halls;
