import { ContactInfo } from "@/hooks/useContentManagement";
import { MapPin, Phone, Mail, Facebook, Instagram, Heart } from "lucide-react";

interface FooterProps {
  contact: ContactInfo;
}

export const Footer = ({ contact }: FooterProps) => {
  // Перевірка чи є контактна інформація
  const hasContacts = contact.address || contact.phone || contact.email;
  const hasSocial = contact.facebook || contact.instagram;
  const hasTelegram = contact.telegram && contact.telegram.trim() !== '';

  // Підрахунок видимих блоків (перший блок завжди видимий)
  const visibleSections = 1 + (hasContacts ? 1 : 0) + (hasSocial ? 1 : 0) + (hasTelegram ? 1 : 0);
  
  // Динамічні класи для grid
  const gridClass = `grid grid-cols-1 md:grid-cols-2 ${
    visibleSections === 4 ? 'lg:grid-cols-4' :
    visibleSections === 3 ? 'lg:grid-cols-3' :
    visibleSections === 2 ? 'lg:grid-cols-2' :
    'lg:grid-cols-1'
  } gap-8 ${visibleSections < 4 ? 'justify-items-center' : ''}`;

  return (
    <footer className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
      {/* Фонова анімація */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-secondary rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className={gridClass}>
          {/* Блок "Добрий Вантаж" - завжди показується */}
          <div className="animate-fade-in max-w-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 animate-pulse-glow" />
              Добрий Вантаж
            </h3>
            <p className="opacity-90">
              Волонтерська організація, що допомагає доставити необхідні речі туди, де вони потрібні
            </p>
          </div>

          {/* Блок "Контакти" - тільки якщо є хоч одне поле */}
          {hasContacts && (
            <div className="animate-fade-in delay-100 max-w-sm">
              <h4 className="text-lg font-semibold mb-4">Контакти</h4>
              <div className="space-y-2">
                {contact.address && (
                  <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm opacity-90">{contact.address}</span>
                  </div>
                )}
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 hover:translate-x-1 transition-transform hover:opacity-80"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm opacity-90">{contact.phone}</span>
                  </a>
                )}
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 hover:translate-x-1 transition-transform hover:opacity-80"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm opacity-90">{contact.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Блок "Соціальні мережі" - тільки якщо є Facebook або Instagram */}
          {hasSocial && (
            <div className="animate-fade-in delay-200 max-w-sm">
              <h4 className="text-lg font-semibold mb-4">Соціальні мережі</h4>
              <div className="space-y-2">
                {contact.facebook && (
                  <a
                    href={`https://${contact.facebook.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80 hover:translate-x-1 transition-all"
                  >
                    <Facebook className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Facebook</span>
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={`https://${contact.instagram.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80 hover:translate-x-1 transition-all"
                  >
                    <Instagram className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Instagram</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Блок "Telegram" - тільки якщо заповнений */}
          {hasTelegram && (
            <div className="animate-fade-in delay-300 max-w-sm">
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
          )}
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
