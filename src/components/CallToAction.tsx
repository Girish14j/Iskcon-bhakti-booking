
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Decorative background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-iskcon-blue/70 backdrop-blur-sm"></div>
      </div>
      
      <div className="iskcon-container relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Book Your <span className="text-iskcon-gold">Special Event</span>?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Our halls are available for religious ceremonies, cultural programs, weddings, conferences, 
            and more. Book now to secure your preferred date and location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-iskcon-saffron hover:bg-iskcon-gold text-white">
              <Link to="/book-now">Book A Hall Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
