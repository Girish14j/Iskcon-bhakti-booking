
import { Check } from "lucide-react";

const BookingProcess = () => {
  const steps = [
    {
      number: 1,
      title: "Choose Your Hall",
      description: "Browse our selection of halls and pick the one that suits your event needs."
    },
    {
      number: 2,
      title: "Select Date & Time",
      description: "Check availability and reserve your preferred date and time slot."
    },
    {
      number: 3,
      title: "Fill Booking Details",
      description: "Provide event information and your contact details."
    },
    {
      number: 4,
      title: "Pay & Confirm",
      description: "Make the payment to confirm your booking."
    }
  ];

  return (
    <section className="py-16">
      <div className="iskcon-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Simple <span className="text-iskcon-saffron">4-Step</span> Booking Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've made booking our halls as easy as possible with our straightforward process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex flex-col items-center">
                <div className="relative h-20 w-20 flex items-center justify-center bg-iskcon-cream rounded-full border-2 border-iskcon-gold mb-6">
                  <span className="text-3xl font-bold text-iskcon-saffron">{step.number}</span>
                  <div className="absolute -top-2 -right-2 bg-iskcon-green rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-foreground">{step.title}</h3>
                <p className="text-center text-muted-foreground">{step.description}</p>
              </div>
              
              {step.number < steps.length && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-iskcon-gold/30 -z-10">
                  <div className="absolute top-0 right-0 h-2 w-2 bg-iskcon-gold rounded-full transform -translate-y-[3px]"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingProcess;
