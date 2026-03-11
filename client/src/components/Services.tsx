import Certifications from "./Certifications";

export default function Services() {
  const services = [
    "Logo & Brand Identity",
    "Poster & Flyer Design",
    "Packaging Design",
    "Social Media Design",
    "Illustration",
    "Motion Graphics",
  ];

  return (
    <>
      <Certifications />

      <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Services
          </h2>
        </div>

        {/* Services Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-primary/20 hover-lift animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            {/* Services List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
              {services.map((service, index) => (
                <div
                  key={service}
                  className="flex items-center gap-4 animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <p className="text-lg font-medium text-foreground">{service}</p>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="border-t border-border pt-8">
              <p className="text-center text-lg md:text-xl leading-relaxed text-foreground italic">
                "At Yared Graphics, I help businesses and individuals bring their vision to life 
                through bold and meaningful design. Whether you need a full brand identity or a 
                single poster, I deliver visuals that connect and communicate."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
