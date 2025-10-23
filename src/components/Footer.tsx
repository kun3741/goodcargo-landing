import { ContactInfo } from "@/hooks/useContentManagement";
import { MapPin, Phone, Mail, Facebook, Instagram, Heart } from "lucide-react";

interface FooterProps {
  contact: ContactInfo;
}

export const Footer = ({ contact }: FooterProps) => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
      {/* Фонова анімація */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-secondary rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 animate-pulse-glow" />
              Добрий Вантаж
            </h3>
            <p className="opacity-90">
              Волонтерська організація, що допомагає доставити необхідні речі туди, де вони потрібні
            </p>
          </div>
          <div className="animate-fade-in delay-100">
            <h4 className="text-lg font-semibold mb-4">Контакти</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <MapPin className="w-4 h-4" />
                <span className="text-sm opacity-90">{contact.address}</span>
              </div>
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <Phone className="w-4 h-4" />
                <span className="text-sm opacity-90">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <Mail className="w-4 h-4" />
                <span className="text-sm opacity-90">{contact.email}</span>
              </div>
            </div>
          </div>
          <div className="animate-fade-in delay-200">
            <h4 className="text-lg font-semibold mb-4">Соціальні мережі</h4>
            <div className="space-y-2">
              {contact.facebook && (
                <a
                  href={`https://${contact.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 hover:translate-x-1 transition-all"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Facebook</span>
                </a>
              )}
              {contact.instagram && (
                <a
                  href={`https://${contact.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 hover:translate-x-1 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="text-sm">Instagram</span>
                </a>
              )}
            </div>
          </div>
          <div className="animate-fade-in delay-300">
            <h4 className="text-lg font-semibold mb-4">Telegram</h4>
            <a
              href={`https://t.me/${contact.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-90 hover:opacity-100 hover:scale-105 inline-block transition-all"
            >
              {contact.telegram}
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center animate-fade-in delay-400">
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} Добрий Вантаж. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
};
