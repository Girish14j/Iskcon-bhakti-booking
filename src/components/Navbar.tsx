
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-iskcon-gold/20 bg-background/95 backdrop-blur">
      <div className="iskcon-container">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-iskcon-gold">
              <div className="absolute inset-0 bg-gradient-to-b from-iskcon-saffron to-iskcon-gold opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-cormorant font-bold text-xl">IB</div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-foreground">Iskcon <span className="text-iskcon-saffron">Bliss</span></h1>
              <p className="text-xs text-muted-foreground">Hall Booking Service</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-iskcon-saffron transition-colors">Home</Link>
            <Link to="/halls" className="text-foreground hover:text-iskcon-saffron transition-colors">Our Halls</Link>
            <Link to="/book-now" className="text-foreground hover:text-iskcon-saffron transition-colors">Book Now</Link>
            <Link to="/testimonials" className="text-foreground hover:text-iskcon-saffron transition-colors">Testimonials</Link>
            <Link to="/contact" className="text-foreground hover:text-iskcon-saffron transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full w-10 h-10 p-0">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{profile?.full_name || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="hidden sm:flex bg-iskcon-saffron hover:bg-iskcon-gold text-white" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
            <button
              className="block md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-iskcon-gold/20">
          <nav className="iskcon-container py-4 flex flex-col gap-4">
            <Link to="/" className="text-foreground hover:text-iskcon-saffron transition-colors px-4 py-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/halls" className="text-foreground hover:text-iskcon-saffron transition-colors px-4 py-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>Our Halls</Link>
            <Link to="/book-now" className="text-foreground hover:text-iskcon-saffron transition-colors px-4 py-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
            <Link to="/testimonials" className="text-foreground hover:text-iskcon-saffron transition-colors px-4 py-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>Testimonials</Link>
            <Link to="/contact" className="text-foreground hover:text-iskcon-saffron transition-colors px-4 py-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="text-foreground hover:text-iskcon-saffron transition-colors px-4 py-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
                <Link to="/profile" className="text-foreground hover:text-iskcon-saffron transition-colors px-4 py-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Button variant="destructive" className="mt-2" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <Button className="mt-2 bg-iskcon-saffron hover:bg-iskcon-gold text-white" asChild>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
