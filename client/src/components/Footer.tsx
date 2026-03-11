import { Dribbble } from "lucide-react";
import YaredLogo from '@assets/images/YaredLogo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-foreground/5 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={YaredLogo}
              alt="Yared Graphics"
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-muted-foreground">
              © Copyright {currentYear} Yared Graphics / Yared Tewodros
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <div className="flex flex-col gap-2 text-center">
              <button
                onClick={() => scrollToSection("#about")}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("#gallery")}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection("#services")}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("#contact")}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h3 className="font-semibold text-foreground">Follow</h3>
            <div className="flex gap-4">
              <a
                href="https://t.me/jared_jesus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.042 0-.085 0-.127-.01l-.209-3.03 5.541-5.009c.242-.213-.054-.336-.375-.123L6.546 13.52l-2.968-.924c-.644-.203-.658-.643.136-.953l11.585-4.468c.537-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform"
              >
                <Dribbble className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Links */}
        <div className="flex flex-col md:flex-row justify-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <span className="hidden md:inline">•</span>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <span className="hidden md:inline">•</span>
          <a href="#" className="hover:text-primary transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
