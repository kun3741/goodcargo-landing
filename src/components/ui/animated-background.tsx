import { ReactNode } from "react";

interface AnimatedBackgroundProps {
  children: ReactNode;
  variant?: "dots" | "gradient" | "waves" | "particles";
  className?: string;
}

export const AnimatedBackground = ({ 
  children, 
  variant = "gradient",
  className = "" 
}: AnimatedBackgroundProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Фонові анімації */}
      {variant === "dots" && (
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute w-full h-full animate-float-slow">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-secondary rounded-full animate-pulse delay-100" />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-pulse delay-200" />
            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-primary rounded-full animate-pulse delay-300" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse delay-400" />
          </div>
        </div>
      )}

      {variant === "gradient" && (
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-accent/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      )}

      {variant === "waves" && (
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave-gradient)"
              d="M0,50 Q250,0 500,50 T1000,50 T1500,50 T2000,50 V100 H0 Z"
              className="animate-wave"
            />
            <path
              fill="url(#wave-gradient)"
              d="M0,70 Q250,20 500,70 T1000,70 T1500,70 T2000,70 V100 H0 Z"
              className="animate-wave-reverse"
              opacity="0.5"
            />
          </svg>
        </div>
      )}

      {variant === "particles" && (
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

