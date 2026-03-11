import { useState } from "react";
import Graph1 from '@assets/images/graphic_design/Graph1.png';
import Graph3 from '@assets/images/graphic_design/Graph3.png';
import Graph4 from '@assets/images/graphic_design/Graph4.png';
import Graph5 from '@assets/images/graphic_design/Graph5.png';
import Logo1 from '@assets/images/logo_design/Logo1.png';
import Logo2 from '@assets/images/logo_design/Logo2.png';
import Logo3 from '@assets/images/logo_design/Logo3.png';
import Logo4 from '@assets/images/logo_design/Logo4.png';
import Logo5 from '@assets/images/logo_design/Logo5.png';

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  description: string;
  category: "graphic" | "logo";
}

const galleryItems: GalleryItem[] = [
  // Graphic Design Works
  {
    id: "graph1",
    title: "Graphic Design 1",
  image: Graph1,
    description: "Creative graphic design work",
    category: "graphic",
  },
  {
    id: "graph3",
    title: "Graphic Design 2",
  image: Graph3,
    description: "Professional design piece",
    category: "graphic",
  },
  {
    id: "graph4",
    title: "Graphic Design 3",
  image: Graph4,
    description: "Innovative visual concept",
    category: "graphic",
  },
  {
    id: "graph5",
    title: "Graphic Design 4",
  image: Graph5,
    description: "Bold and impactful design",
    category: "graphic",
  },
  // Logo Designs
  {
    id: "logo1",
    title: "Logo Design 1",
  image: Logo1,
    description: "Modern brand identity",
    category: "logo",
  },
  {
    id: "logo2",
    title: "Logo Design 2",
  image: Logo2,
    description: "Creative logo concept",
    category: "logo",
  },
  {
    id: "logo3",
    title: "Logo Design 3",
  image: Logo3,
    description: "Unique brand mark",
    category: "logo",
  },
  {
    id: "logo4",
    title: "Logo Design 4",
  image: Logo4,
    description: "Professional branding",
    category: "logo",
  },
  {
    id: "logo5",
    title: "Logo Design 5",
  image: Logo5,
    description: "Distinctive visual identity",
    category: "logo",
  },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<"all" | "graphic" | "logo">("graphic");

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My Work
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore my portfolio of graphic design and logo creations
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12 animate-fadeInUp flex-wrap" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setActiveFilter("graphic")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeFilter === "graphic"
                ? "bg-primary text-primary-foreground shadow-lg hover-glow"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            Graphic Design
          </button>
          <button
            onClick={() => setActiveFilter("logo")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeFilter === "logo"
                ? "bg-primary text-primary-foreground shadow-lg hover-glow"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            Logo Design
          </button>
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-lg hover-glow"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            All Works
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group animate-fadeInUp hover-lift"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative bg-secondary rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                {/* Image Container */}
                <div className="relative w-full h-64 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width="400"
                    height="256"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <p className="font-semibold text-lg">View Project</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                  {/* SEO: Portfolio structured data for each item */}
                  <script type="application/ld+json">
                    {JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'CreativeWork',
                      'name': item.title,
                      'image': item.image,
                      'description': item.description,
                      'author': {
                        '@type': 'Person',
                        'name': 'Yared Tewodros'
                      }
                    })}
                  </script>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motion Graphics Mention */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Motion Graphics
          </h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Beyond static designs, I also create engaging motion graphics and animations that bring your brand to life. 
            From animated logos to promotional videos, I combine creativity with technical expertise to deliver compelling visual stories.
          </p>
        </div>
      </div>
    </section>
  );
}
