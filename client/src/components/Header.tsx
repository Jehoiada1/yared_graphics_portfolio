import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import YaredLogo from '@assets/images/YaredLogo.png';
// Public assets: reference by URL (served from client/public at project root)
const YaredProfile = '/yared-profile.png';
const YaredModal = '/yared-modal.png';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Gallery", href: "#gallery" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-2.5 md:py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/">
          <a className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <img
              src={YaredLogo}
              alt="Yared Graphics"
              className="h-8 sm:h-10 w-auto"
            />
            <div className="hidden sm:flex items-center gap-3">
              <span className="font-bold text-lg text-foreground">
                Yared.T
              </span>
              <button
                type="button"
                onClick={(e) => {
                  // prevent the parent <a> Link from navigating when avatar is clicked
                  e.preventDefault();
                  e.stopPropagation();
                  setProfileModalOpen(true);
                }}
                className="h-10 w-10 rounded-full border-2 border-primary shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:scale-110 transform overflow-hidden"
                aria-label="Open profile"
              >
                <img
                  src={YaredProfile}
                  alt="Yared Tewodros"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </button>
            </div>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Section - Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-t border-border animate-slideInRight">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Profile Modal */}
      {profileModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeInUp"
          onClick={() => setProfileModalOpen(false)}
        >
          <div
            className="bg-card rounded-3xl p-5 sm:p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border animate-slideInUp relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>

            {/* Profile Image */}
              <div className="flex justify-center mb-6">
              <img
                src={YaredModal}
                alt="Yared Tewodros"
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Yared Tewodros
              </h2>
              <p className="text-lg text-primary font-semibold">
                Graphic Designer & Visual Artist
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed pt-4">
                Based in Addis Ababa, Ethiopia. Passionate about creating meaningful visual experiences through bold and creative design.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
