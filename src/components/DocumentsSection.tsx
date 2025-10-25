import { Document } from "@/hooks/useContentManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FileText, Download } from "lucide-react";

interface DocumentsSectionProps {
  title: string;
  documents: Document[];
}

export const DocumentsSection = ({ title, documents }: DocumentsSectionProps) => {
  // Безпечна перевірка documents
  const safeDocuments = Array.isArray(documents) ? documents : [];
  
  // Функція для завантаження файлу
  const handleDownload = (doc: Document) => {
    if (doc.fileData) {
      // Якщо є завантажений файл (base64)
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName || `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (doc.fileUrl) {
      // Якщо є посилання
      window.open(doc.fileUrl, '_blank');
    }
  };
  
  return (
    <AnimatedBackground variant="gradient" className="py-20 bg-background">
      <section>
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            {title}
          </h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {safeDocuments.map((doc, index) => (
              <Card 
                key={doc.id} 
                className="hover:shadow-xl hover:scale-105 transition-all duration-300 animate-scale-in group w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <FileText className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <Download className="w-3 h-3 text-secondary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                  {doc.fileName && (
                    <p className="text-xs text-muted-foreground mb-4">📎 {doc.fileName}</p>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(doc)}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Завантажити
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AnimatedBackground>
  );
};
