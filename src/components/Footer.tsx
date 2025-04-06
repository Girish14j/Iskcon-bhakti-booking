
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-iskcon-cream/50 border-t border-iskcon-gold/20">
      <div className="iskcon-container pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-iskcon-gold">
                <div className="absolute inset-0 bg-gradient-to-b from-iskcon-saffron to-iskcon-gold opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-cormorant font-bold text-lg">IB</div>
              </div>
              <h3 className="text-xl font-bold">Iskcon Bliss</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Providing sacred spaces for your spiritual and cultural events within 
              our beautiful temple complex.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-iskcon-saffron hover:text-iskcon-gold" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-iskcon-saffron hover:text-iskcon-gold" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-iskcon-saffron hover:text-iskcon-gold" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/halls" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Our Halls
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Halls</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/halls/1" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Krishna Hall
                </Link>
              </li>
              <li>
                <Link to="/halls/2" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Radha Hall
                </Link>
              </li>
              <li>
                <Link to="/halls/3" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
                  Govinda Hall
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-iskcon-saffron mr-2 mt-0.5" />
                <span className="text-muted-foreground">
                  ISKCON Temple Complex, <br />
                  Hare Krishna Hill, <br />
                  East of Kailash, <br />
                  New Delhi - 110065
                </span>
              </li>
              <li className="flex items-center">
                <Calendar className="h-5 w-5 text-iskcon-saffron mr-2" />
                <span className="text-muted-foreground">
                  Open Daily: 4:30 AM to 9:00 PM
                </span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-iskcon-saffron mr-2" />
                <span className="text-muted-foreground">
                  Booking Office: 9:00 AM to 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-iskcon-gold/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Iskcon Bliss Hall Booking. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/faq" className="text-muted-foreground hover:text-iskcon-saffron transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
