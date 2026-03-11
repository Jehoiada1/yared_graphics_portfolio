import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import YaredLogo from '@assets/images/YaredLogo.png';

export default function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen py-16 md:py-0 bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 animate-fadeInUp">
          {/* Large Hero Logo */}
            <div className="animate-float animate-glow">
              <img
                src={YaredLogo}
                alt="Yared Graphics"
                className="h-24 sm:h-32 w-auto md:h-48 mx-auto drop-shadow-lg animate-float"
                style={{ willChange: 'transform' }}
              />
            </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight px-2">
              Yared Graphics
            </h1>
            <p className="tagline text-2xl sm:text-3xl md:text-5xl text-primary font-light text-glow px-2">
              Creative. Minimal. Impactful.
            </p>
          </div>

          {/* Speech Bubble Card */}
          <div className="max-w-2xl mx-auto animate-slideInLeft" style={{ animationDelay: "0.2s" }}>
            <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-border/50 hover-lift">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                Hi, I'm Yared — a passionate graphic designer who turns ideas into visuals that inspire. 
                Specializing in branding, logo design, and motion graphics.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-slideInRight" style={{ animationDelay: "0.4s" }}>
            <Button
              onClick={scrollToContact}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-5 md:py-6 rounded-full text-base md:text-lg font-semibold group hover-glow transition-all"
            >
              Contact Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-10 md:mt-16 animate-bounce">
            <svg
              className="w-6 h-6 text-primary mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
