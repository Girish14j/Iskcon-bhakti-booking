import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Adjust this threshold to match when your hero section ends
      const heroHeight = window.innerHeight * 0.85;
      setIsScrolled(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-background/98 backdrop-blur-md border-b border-iskcon-gold/20 shadow-sm"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="iskcon-container">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-iskcon-gold shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-iskcon-saffron to-iskcon-gold opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-cormorant font-bold text-xl">
                IB
              </div>
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-2xl font-bold transition-colors duration-500 ${
                  isScrolled ? "text-foreground" : "text-white drop-shadow-lg"
                }`}
              >
                Iskcon{" "}
                <span className="text-iskcon-saffron drop-shadow-sm">Bliss</span>
              </h1>
              <p
                className={`text-xs transition-colors duration-500 ${
                  isScrolled ? "text-muted-foreground" : "text-white/70"
                }`}
              >
                Hall Booking Service
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {["Home", "Our Halls", "Book Now", "Testimonials", "Contact"].map(
              (label, i) => {
                const paths = ["/", "/halls", "/book-now", "/testimonials", "/contact"];
                return (
                  <Link
                    key={label}
                    to={paths[i]}
                    className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-iskcon-saffron relative group ${
                      isScrolled ? "text-foreground" : "text-white/90 drop-shadow"
                    }`}
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-iskcon-saffron transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              }
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`rounded-full w-10 h-10 p-0 transition-all duration-500 ${
                      isScrolled
                        ? "border-border bg-background"
                        : "border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {profile?.full_name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className={`hidden sm:flex transition-all duration-500 ${
                  isScrolled
                    ? "bg-iskcon-saffron hover:bg-iskcon-gold text-white"
                    : "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm shadow-lg"
                }`}
                asChild
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            <button
              className={`block md:hidden transition-colors duration-500 ${
                isScrolled ? "text-foreground" : "text-white drop-shadow"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          className={`md:hidden border-t transition-all duration-500 ${
            isScrolled
              ? "border-iskcon-gold/20 bg-background/98 backdrop-blur-md"
              : "border-white/10 bg-black/50 backdrop-blur-md"
          }`}
        >
          <nav className="iskcon-container py-4 flex flex-col gap-1">
            {[
              { label: "Home", path: "/" },
              { label: "Our Halls", path: "/halls" },
              { label: "Book Now", path: "/book-now" },
              { label: "Testimonials", path: "/testimonials" },
              { label: "Contact", path: "/contact" },
            ].map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className={`transition-colors px-4 py-2.5 rounded-md text-sm font-medium ${
                  isScrolled
                    ? "text-foreground hover:text-iskcon-saffron hover:bg-muted"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`transition-colors px-4 py-2.5 rounded-md text-sm font-medium ${
                    isScrolled
                      ? "text-foreground hover:text-iskcon-saffron hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className={`transition-colors px-4 py-2.5 rounded-md text-sm font-medium ${
                    isScrolled
                      ? "text-foreground hover:text-iskcon-saffron hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="destructive"
                  className="mt-2"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <Button
                className="mt-2 bg-iskcon-saffron hover:bg-iskcon-gold text-white"
                asChild
              >
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;