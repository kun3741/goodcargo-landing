import { useContentManagement } from "@/hooks/useContentManagement";
import { HeroSection } from "@/components/HeroSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { AdvantagesSection } from "@/components/AdvantagesSection";
import { DocumentsSection } from "@/components/DocumentsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const { content } = useContentManagement();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <HeroSection content={content.hero} onCtaClick={scrollToContact} />
      <TestimonialsSection title={content.testimonials.title} testimonials={content.testimonials.items} />
      <AdvantagesSection content={content.advantages} />
      <DocumentsSection title={content.documents.title} documents={content.documents.items} />
      <ContactSection 
        telegramUsername={content.contact.telegram}
      />
      <Footer contact={content.contact} />
    </div>
  );
};

export default Index;
