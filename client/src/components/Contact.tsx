import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
// Public assets: reference by URL (served from client/public at project root)
const ToolsHand = '/tools-hand.png';
const AdobePs = '/adobe-ps.png';
const AdobeAe = '/adobe-ae.png';
const AdobeId = '/adobe-id.png';
const AdobeAi = '/adobe-ai.png';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prefer EmailJS if configured via Vite env vars so the form can send directly from the browser.
      // Set these env vars in your .env: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        try {
          const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: "yaredtewodros23@gmail.com",
          };

          const result = await emailjs.send(
            emailjsServiceId,
            emailjsTemplateId,
            templateParams,
            emailjsPublicKey
          );

          if ((result as any).status === 200) {
            setSubmitted(true);
            setFormData({ name: "", email: "", message: "" });
            setTimeout(() => setSubmitted(false), 5000);
            return;
          } else {
            console.error("EmailJS send error:", result);
            // fallback to Formspree below
          }
        } catch (err) {
          console.error("EmailJS error:", err);
          // fallback to Formspree below
        }
      }

      // Fallback: Using Formspree for form submission.
      const formId = import.meta.env.VITE_FORMSPREE_FORM_ID as string | undefined;
      const endpointFromEnv = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;
      const endpoint = endpointFromEnv ?? (formId ? `https://formspree.io/f/${formId}` : undefined) ?? "https://formspree.io/f/xyzqwvpd";

      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: `Website contact from ${formData.name}`,
        _replyto: formData.email,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const text = await response.text();
        console.error("Formspree error:", response.status, text);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const skills = [
    { name: "Photoshop", level: 94, icon: AdobePs },
    { name: "After Effects", level: 96, icon: AdobeAe },
    { name: "InDesign", level: 95, icon: AdobeId },
    { name: "Illustrator", level: 98, icon: AdobeAi },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contact
          </h2>
          <p className="text-lg text-muted-foreground">
            Let's create something amazing together
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-slideInLeft">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Yared Tewodros
              </h3>
              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:yaredtewodros23@gmail.com"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span>yaredtewodros23@gmail.com</span>
                </a>

                {/* Phone Numbers */}
                <a
                  href="tel:+251947399079"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
                >
                  <Phone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span>+251 94 739 9079</span>
                </a>

                <a
                  href="tel:+251962488810"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
                >
                  <Phone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span>+251 96 248 8810</span>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/jared_jesus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
                >
                  <svg className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.042 0-.085 0-.127-.01l-.209-3.03 5.541-5.009c.242-.213-.054-.336-.375-.123L6.546 13.52l-2.968-.924c-.644-.203-.658-.643.136-.953l11.585-4.468c.537-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>@jared_jesus</span>
                </a>
              </div>
            </div>

            {/* Tools Section with Floating Icons */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm font-semibold text-muted-foreground mb-8">
                Tools I Use
              </p>
              <div className="relative h-40 flex items-center justify-center">
                {/* Hand with floating tools */}
                <img
                  src={ToolsHand}
                  alt="Design Tools"
                  className="h-40 w-auto animate-float object-contain z-10"
                />
                
                {/* Floating Photoshop Icon */}
                <img
                  src={AdobePs}
                  alt="Photoshop"
                  className="absolute top-2 right-32 h-14 w-14 animate-float object-contain"
                  style={{ animationDelay: "0.1s" }}
                />
                
                {/* Floating After Effects Icon */}
                <img
                  src={AdobeAe}
                  alt="After Effects"
                  className="absolute top-12 right-8 h-12 w-12 animate-float object-contain"
                  style={{ animationDelay: "0.2s" }}
                />
                
                {/* Floating InDesign Icon */}
                <img
                  src={AdobeId}
                  alt="InDesign"
                  className="absolute bottom-8 right-24 h-12 w-12 animate-float object-contain"
                  style={{ animationDelay: "0.3s" }}
                />
                
                {/* Floating Illustrator Icon */}
                <img
                  src={AdobeAi}
                  alt="Illustrator"
                  className="absolute bottom-2 left-12 h-14 w-14 animate-float object-contain"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>

              {/* Skill Bars */}
              <div className="mt-12 space-y-6">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2 animate-fadeInUp">
                    <div className="flex items-center gap-3">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="h-6 w-6 object-contain"
                      />
                      <span className="text-sm font-semibold text-foreground flex-1">
                        {skill.name}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slideInRight">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold hover-glow transition-all"
              >
                Send Message
              </Button>

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center animate-fadeInUp">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
