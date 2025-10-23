import { useRef } from "react";
import { Testimonial } from "@/hooks/useContentManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AnimatedBackground } from "@/components/ui/animated-background";
import Autoplay from "embla-carousel-autoplay";

interface TestimonialsSectionProps {
  title: string;
  testimonials: Testimonial[];
}

export const TestimonialsSection = ({ title, testimonials }: TestimonialsSectionProps) => {
  const autoplayRef = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

  // Безпечна перевірка testimonials
  const safeTestimonials = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : [];
  
  // Дублюємо відгуки для безперервного зациклювання
  const duplicatedTestimonials = safeTestimonials.length > 0 
    ? [...safeTestimonials, ...safeTestimonials, ...safeTestimonials]
    : [];

  return (
    <AnimatedBackground variant="dots" className="py-20 bg-muted">
      <section>
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            {title}
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
            }}
            plugins={[autoplayRef.current]}
            className="w-full max-w-6xl mx-auto"
            onMouseEnter={() => autoplayRef.current.stop()}
            onMouseLeave={() => autoplayRef.current.play()}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {duplicatedTestimonials.map((testimonial, index) => (
                <CarouselItem 
                  key={`${testimonial.id}-${index}`} 
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6 flex flex-col items-center">
                      {testimonial.photo && (
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/10 ring-2 ring-primary/5 hover:ring-primary/20 transition-all">
                          <img
                            src={testimonial.photo}
                            alt={testimonial.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-center mb-3">
                        {testimonial.title}
                      </h3>
                      <p className="text-muted-foreground text-center text-sm leading-relaxed">
                        {testimonial.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </div>
          </Carousel>
        </div>
      </section>
    </AnimatedBackground>
  );
};
