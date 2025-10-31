import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface ContactSectionProps {
  telegramUsername: string;
}

export const ContactSection = ({ telegramUsername }: ContactSectionProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const { toast } = useToast();

  const validate = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();
    const phoneTrimmed = phone.trim();

    const nameRegex = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]{2,}$/u;
    if (!nameRegex.test(nameTrimmed) || nameTrimmed.length > 30) {
      newErrors.name = "Введіть реальне ім'я (мін. 2 літери)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(emailTrimmed) || emailTrimmed.length > 60) {
      newErrors.email = "Введіть коректний email";
    }

    const uaPhoneRegex = /^\+380\d{9}$/;
    if (!uaPhoneRegex.test(phoneTrimmed)) {
      newErrors.phone = "Телефон у форматі +380XXXXXXXXX";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Перевірте поля",
        description: "Заповніть форму коректними даними",
        variant: "destructive",
      });
      return;
    }
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
          title: "Успіх!",
          description: "Ваша заявка надіслана. Ми зв'яжемося з вами найближчим часом.",
        });
        setName("");
        setPhone("");
        setEmail("");
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

  return (
    <AnimatedBackground variant="particles" className="py-20 bg-muted">
      <section id="contact">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            Зв'язатися з нами
          </h2>
          <Card className="max-w-2xl mx-auto animate-scale-in shadow-xl">
            <CardContent className="p-6">
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">Написати</TabsTrigger>
                  <TabsTrigger value="request">Залишити заявку</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="py-6">
                  <div className="text-center animate-fade-in">
                    <p className="text-muted-foreground mb-6">
                      Напишіть нам у Telegram для швидкого зв'язку
                    </p>
                    <Button
                      size="lg"
                      onClick={() => window.open(`https://t.me/${telegramUsername.replace('@', '')}`, '_blank')}
                      className="gap-2 hover:scale-105 transition-transform"
                    >
                      <Send className="w-5 h-5" />
                      Написати в Telegram
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="request" className="py-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="animate-slide-in-left">
                      <Label htmlFor="name">Ім'я *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={30}
                        required
                        placeholder="Ваше ім'я"
                        className="transition-all focus:scale-105"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div className="animate-slide-in-left delay-100">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        pattern="\+380\d{9}"
                        maxLength={13}
                        required
                        placeholder="+380..."
                        className="transition-all focus:scale-105"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div className="animate-slide-in-left delay-200">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={60}
                        required
                        placeholder="your@email.com"
                        className="transition-all focus:scale-105"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full animate-scale-in delay-300 hover:scale-105 transition-transform" 
                      disabled={loading}
                    >
                      {loading ? "Надсилання..." : "Надіслати заявку"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </AnimatedBackground>
  );
};
