
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  },
  {
    name: "Priyanka Gupta",
    role: "Devotee",
    testimonial: "I've been coming to the Iskcon temple for years and hosting my spiritual gatherings in their halls. The divine vibrations and serene atmosphere truly enhance our spiritual experience.",
    image: "https://randomuser.me/api/portraits/women/42.jpg"
  },
  {
    name: "Mohan Das",
    role: "Cultural Program Coordinator",
    testimonial: "The Iskcon halls are perfect for our cultural programs. The stage setup, sound system, and overall ambiance help create memorable events for our community.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  }
];

const TestimonialsPage = () => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-iskcon-cream/30">
          <div className="iskcon-container">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-foreground font-cormorant">
                What Our <span className="text-iskcon-saffron">Devotees</span> Say
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Read testimonials from people who have experienced our hall booking service
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden border border-iskcon-gold/30 bg-card/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="relative mb-6">
                      <Quote className="h-8 w-8 text-iskcon-gold opacity-20 absolute -top-4 -left-4" />
                      <p className="text-md text-foreground italic pl-4 pr-4 min-h-[120px]">
                        "{testimonial.testimonial}"
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between pt-0 pb-6 px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
              <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear about your experience with our hall booking service. Please reach out to us if you'd like to share your testimonial.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-iskcon-saffron hover:bg-iskcon-gold text-white rounded-md transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
