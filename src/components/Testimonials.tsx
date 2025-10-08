
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Radha Sharma",
    role: "Bride",
    testimonial: "We had our wedding ceremony at Krishna Hall and it was absolutely perfect. The staff were incredibly helpful and the ambiance was divine. Couldn't have asked for a better venue!",
    image: "https://randomuser.me/api/portraits/women/63.jpg"
  },
  {
    name: "Arjun Patel",
    role: "Event Organizer",
    testimonial: "I've organized multiple cultural events at Iskcon halls. The booking process is smooth, the halls are well-maintained, and the spiritual atmosphere adds a special touch to all our programs.",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    name: "Meena Trivedi",
    role: "Community Leader",
    testimonial: "The Govinda Hall is perfect for our weekly satsang gatherings. The intimate setting creates a wonderful atmosphere for spiritual discussions and bhajans.",
    image: "https://randomuser.me/api/portraits/women/26.jpg"
  },
  {
    name: "Rahul Verma",
    role: "Corporate Trainer",
    testimonial: "We conducted a mindfulness workshop for our company in Radha Hall. The peaceful environment and helpful staff made our event a great success. Will definitely book again!",
    image: "https://randomuser.me/api/portraits/men/59.jpg"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 bg-iskcon-cream/30">
      <div className="iskcon-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            What Our <span className="text-iskcon-saffron">Guests</span> Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from people who have experienced our hall booking service.
          </p>
        </div>
        
        <div className="relative max-w-3xl mx-auto">
          <Card className="border border-iskcon-gold/30 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="relative mb-6">
                <Quote className="h-12 w-12 text-iskcon-gold opacity-20 absolute -top-6 -left-6" />
                <p className="text-lg text-foreground italic pl-6 pr-6">
                  "{testimonials[currentIndex].testimonial}"
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-center sm:justify-between pt-0 pb-6 px-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={prevTestimonial}
                  className="h-10 w-10 rounded-full border border-iskcon-gold/50 flex items-center justify-center text-iskcon-saffron hover:bg-iskcon-cream transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="h-10 w-10 rounded-full border border-iskcon-gold/50 flex items-center justify-center text-iskcon-saffron hover:bg-iskcon-cream transition-colors"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentIndex ? "bg-iskcon-gold" : "bg-iskcon-gold/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
