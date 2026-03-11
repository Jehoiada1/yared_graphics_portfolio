import { Button } from "@/components/ui/button";

export default function About() {
  const scrollToGallery = () => {
    const element = document.querySelector("#gallery");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Yared
            </h2>
          </div>

          {/* About Content */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-md border border-border/50 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            <p className="text-lg md:text-xl leading-relaxed text-foreground mb-6">
              I'm Yared, a freelance graphic designer based in Addis Ababa, Ethiopia. 
              With a passion for creating meaningful visual experiences, I specialize in branding, 
              logo design, and digital artwork that resonates with audiences.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-foreground mb-8">
              My work blends creativity with clarity — I believe great design speaks before words do. 
              Whether it's a complete brand identity, a striking logo, or engaging motion graphics, 
              I'm committed to delivering visuals that not only look beautiful but also communicate 
              your message effectively.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                onClick={scrollToGallery}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-lg font-semibold hover-glow transition-all"
              >
                View My Work
              </Button>
              <Button
                onClick={scrollToContact}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 px-8 py-6 rounded-lg font-semibold transition-all"
              >
                Let's Work Together
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
