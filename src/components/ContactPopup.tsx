import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Phone, Mail, User, X, Sparkles } from "lucide-react";

interface ContactPopupProps {
  telegramUsername: string;
}

export const ContactPopup = ({ telegramUsername }: ContactPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Показати pop-up через 20 секунд
  useEffect(() => {
    // Перевіряємо localStorage, чи вже показували pop-up
    const hasSeenPopup = localStorage.getItem("hasSeenContactPopup");
    
    if (!hasSeenPopup && !hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem("hasSeenContactPopup", "true");
      }, 20000); // 20 секунд

      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/telegram/send-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "🎉 Успіх!",
          description: "Ваша заявка надіслана. Ми зв'яжемося з вами найближчим часом.",
        });
        setName("");
        setPhone("");
        setEmail("");
        setIsOpen(false);
      } else {
        toast({
          title: "Помилка",
          description: data.message || "Не вдалося надіслати заявку. Спробуйте пізніше.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося надіслати заявку. Спробуйте пізніше.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramClick = () => {
    window.open(`https://t.me/${telegramUsername.replace('@', '')}`, '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto p-0 border-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Декоративні елементи */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse animation-delay-1000" />
        
        {/* Заголовок з градієнтом */}
        <div className="relative bg-gradient-to-r from-primary to-accent p-4 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <DialogHeader className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <DialogTitle className="text-xl font-bold">
                Станьте частиною команди!
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/90 text-sm">
              Приєднуйтесь до волонтерів "Добрий Вантаж" та робіть внесок у перемогу
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Контент з формою */}
        <div className="p-5 space-y-5">
          {/* Швидкий зв'язок через Telegram */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Найшвидший спосіб зв'язатися
            </p>
            <Button
              size="lg"
              onClick={handleTelegramClick}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Написати в Telegram
            </Button>
          </div>

          {/* Розділювач */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">або</span>
            </div>
          </div>

          {/* Форма заявки */}
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Залиште заявку, і ми зв'яжемося з вами
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="popup-name" className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  Ім'я *
                </Label>
                <Input
                  id="popup-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ваше ім'я"
                  className="transition-all focus:scale-[1.02] focus:shadow-md"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="popup-phone" className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  Телефон *
                </Label>
                <Input
                  id="popup-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+380..."
                  className="transition-all focus:scale-[1.02] focus:shadow-md"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="popup-email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  Email *
                </Label>
                <Input
                  id="popup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="transition-all focus:scale-[1.02] focus:shadow-md"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-xl py-5 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Надсилання...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Надіслати заявку
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

