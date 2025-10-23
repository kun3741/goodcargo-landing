import { AdvantagesSection as AdvantagesSectionType } from "@/hooks/useContentManagement";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import * as LucideIcons from "lucide-react";

interface AdvantagesSectionProps {
  content: AdvantagesSectionType;
}

export const AdvantagesSection = ({ content }: AdvantagesSectionProps) => {
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" /> : null;
  };

  // Безпечна перевірка advantages items
  const safeItems = Array.isArray(content?.items) ? content.items : [];

  return (
    <section 
      className="py-20 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: content.backgroundImage 
          ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${content.backgroundImage})`
          : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(220 15% 20%) 100%)',
      }}
    >
      {/* Фонова анімація для варіанту без зображення */}
      {!content.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="advantage-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <path
              fill="url(#advantage-wave-gradient)"
              d="M0,50 Q250,0 500,50 T1000,50 T1500,50 T2000,50 V100 H0 Z"
              className="animate-wave"
            />
            <path
              fill="url(#advantage-wave-gradient)"
              d="M0,70 Q250,20 500,70 T1000,70 T1500,70 T2000,70 V100 H0 Z"
              className="animate-wave-reverse"
              opacity="0.5"
            />
          </svg>
        </div>
      )}

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 animate-fade-in delay-100">
            {content.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safeItems.map((advantage, index) => (
            <Card 
              key={advantage.id} 
              className="bg-card/95 backdrop-blur animate-scale-in hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center relative">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse-glow">
                  {index + 1}
                </div>
                {advantage.icon && (
                  <div className="mb-4 flex justify-center">
                    {getIcon(advantage.icon)}
                  </div>
                )}
                {advantage.title && (
                  <h3 className="text-xl font-semibold mb-3">
                    {advantage.title}
                  </h3>
                )}
                {advantage.description && (
                  <p className="text-muted-foreground">
                    {advantage.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
