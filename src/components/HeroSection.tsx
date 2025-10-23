import { Button } from "@/components/ui/button";
import { HeroContent } from "@/hooks/useContentManagement";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  content: HeroContent;
  onCtaClick: () => void;
}

export const HeroSection = ({ content, onCtaClick }: HeroSectionProps) => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: content.backgroundImage 
          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${content.backgroundImage})`
          : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
      }}
    >
      {/* Анімований фон для випадку без зображення */}
      {!content.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/30 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
      )}

      <div className="container px-4 md:px-6 text-center text-white relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in drop-shadow-2xl">
          {content.title}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in delay-200 drop-shadow-lg">
          {content.description}
        </p>
        {content.buttonVisible && (
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-110 text-lg px-8 py-6 animate-scale-in delay-400 shadow-2xl transition-all"
          >
            {content.buttonText}
          </Button>
        )}
      </div>

      {/* Анімована стрілка вниз */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-8 h-8 text-white opacity-70" />
      </div>
    </section>
  );
};
