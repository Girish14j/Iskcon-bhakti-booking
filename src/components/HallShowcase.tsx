
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const halls = [
  {
    id: 1,
    name: "Krishna Hall",
    description: "Our largest hall, perfect for weddings and major celebrations with grand decorations and stage.",
    image: "https://images.unsplash.com/photo-1594552072238-5b0d587cbb6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    capacity: 500,
    pricePerHour: 10000,
    amenities: ["Stage", "Sound System", "Kitchen Access", "Decoration Allowance", "Cooling System"],
    bestFor: ["Weddings", "Cultural Programs"]
  },
  {
    id: 2,
    name: "Radha Hall",
    description: "Mid-sized elegant hall ideal for cultural programs and community gatherings.",
    image: "https://images.unsplash.com/photo-1604014056465-9e2a301e9564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    capacity: 250,
    pricePerHour: 6000,
    amenities: ["Sound System", "Kitchen Access", "Cooling System"],
    bestFor: ["Religious Ceremonies", "Community Gatherings"]
  },
  {
    id: 3,
    name: "Govinda Hall",
    description: "Intimate hall for small gatherings, lectures, and spiritual discussions.",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    capacity: 100,
    pricePerHour: 3000,
    amenities: ["Projector", "Sound System", "Cooling System"],
    bestFor: ["Lectures", "Workshops", "Small Ceremonies"]
  }
];

const HallShowcase = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="iskcon-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Our <span className="text-iskcon-saffron">Beautiful</span> Halls
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of halls designed to accommodate various events and gatherings in a spiritually uplifting atmosphere.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {halls.map((hall) => (
            <Card key={hall.id} className="overflow-hidden border border-iskcon-gold/30 hover:shadow-lg transition-all duration-300">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={hall.image} 
                  alt={hall.name} 
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{hall.name}</CardTitle>
                  <Badge className="bg-iskcon-saffron text-white">
                    <Users className="h-3 w-3 mr-1" />
                    {hall.capacity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{hall.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hall.bestFor.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-iskcon-gold text-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-iskcon-green font-semibold">
                  ₹{hall.pricePerHour.toLocaleString()} per hour
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/halls/${hall.id}`}>View Details</Link>
                </Button>
                <Button className="bg-iskcon-saffron hover:bg-iskcon-gold text-white" asChild>
                  <Link to='/book-now'>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-iskcon-gold text-foreground hover:bg-iskcon-cream/50">
            <Link to="/halls">View All Halls</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HallShowcase;
