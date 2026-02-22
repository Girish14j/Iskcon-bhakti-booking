
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HallFeatures from "@/components/HallFeatures";
import HallShowcase from "@/components/HallShowcase";
import BookingProcess from "@/components/BookingProcess";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/chatbot/ChatWidget";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="py-16">
          <HallFeatures />
        </div>
        <HallShowcase />
        <BookingProcess />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
