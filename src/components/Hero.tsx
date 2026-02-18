
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const heroImages = [
  {
    url: "https://i.pinimg.com/736x/0a/d4/78/0ad478609ed4e2479f860588708800a4.jpg",
    alt: "Beautifully decorated Iskcon temple hall",
  },
  {
    url: "https://i.pinimg.com/1200x/b7/42/75/b742754bb04f95fccfd0ba26c953a1c6.jpg",
    alt: "Traditional Indian ceremony in hall",
  },
  {
    url: "https://i.pinimg.com/736x/79/8f/74/798f7455e2d57e79cd35039ff71a6d61.jpg",
    alt: "Community gathering in large temple hall",
  },
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen h-[70vh] sm:h-[80vh] overflow-hidden">
      {/* Hero Image Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-lg">
            <span className="text-iskcon-saffron">Sacred Spaces</span> for Your Special Events
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Book beautiful halls at our Iskcon Temple for your spiritual gatherings, 
            ceremonies, and cultural celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-iskcon-saffron hover:bg-iskcon-gold text-white text-lg px-8 py-6">
              <Link to="/book-now">Book Now</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-black hover:bg-white/10 text-lg px-8 py-6">
              <Link to="/halls">Explore Halls</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default Hero;
