import Cert1 from '@assets/images/Certfications/Cert1.jpg';
import Cert2 from '@assets/images/Certfications/Cert2.jpg';

export default function Certifications() {
  // Use bundled assets from @assets so Vite includes and optimizes them
  const certs = [
    { id: "cert1", src: Cert1, alt: "Certificate 1" },
    { id: "cert2", src: Cert2, alt: "Certificate 2" },
  ];

  return (
    <section id="certifications" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Certification and Experience</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certificates and training completed to support my design expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 items-start">
          {certs.map((c, i) => (
            <div
              key={c.id}
              className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-4 flex items-center justify-center"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <img
                src={c.src}
                alt={c.alt}
                className="w-full h-auto max-h-80 object-contain rounded-lg"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
