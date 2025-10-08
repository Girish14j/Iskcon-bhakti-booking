
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HallFeatures = () => {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-iskcon-saffron" />,
      title: "Flexible Booking",
      description: "Book halls for hours or days, with easy rescheduling options for your convenience."
    },
    {
      icon: <MapPin className="h-10 w-10 text-iskcon-saffron" />,
      title: "Prime Location",
      description: "Our halls are located within the serene temple complex with ample parking and accessibility."
    },
    {
      icon: <Users className="h-10 w-10 text-iskcon-saffron" />,
      title: "Various Capacities",
      description: "From intimate gatherings of 50 to grand celebrations for 500+ people, we have hall options for all."
    },
    {
      icon: <Clock className="h-10 w-10 text-iskcon-saffron" />,
      title: "24/7 Support",
      description: "Our dedicated staff is available round the clock to assist with your event needs."
    }
  ];

  return (
    <section className="iskcon-container">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Why Choose Our <span className="text-iskcon-saffron">Hall Booking</span> Service?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the perfect blend of spiritual ambiance, modern amenities, and exceptional service for your special events.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border border-iskcon-gold/30 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">{feature.icon}</div>
              <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-muted-foreground">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HallFeatures;
