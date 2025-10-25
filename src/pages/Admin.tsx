import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useContentManagement, Content } from "@/hooks/useContentManagement";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, LogOut } from "lucide-react";
import { api } from "@/services/api";

const Admin = () => {
  const navigate = useNavigate();
  const { content, updateContent, loading } = useContentManagement();
  const { toast } = useToast();
  const [localContent, setLocalContent] = useState<Content>(content);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const { valid } = await api.verifyToken();
        setIsAuthenticated(valid);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await api.login(password);
      localStorage.setItem("adminToken", response.token);
      setIsAuthenticated(true);
      toast({
        title: "Успішний вхід",
        description: "Ласкаво просимо до панелі адміністратора",
      });
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message || "Невірний пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleSave = async () => {
    const result = await updateContent(localContent);
    if (result.success) {
      toast({
        title: "Збережено!",
        description: "Зміни успішно збережені в базі даних",
      });
    } else {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти зміни",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Вхід до панелі адміністратора</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Вхід..." : "Увійти"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Панель адміністратора</h1>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="lg">
              Зберегти зміни
            </Button>
            <Button onClick={handleLogout} variant="outline" size="lg">
              <LogOut className="w-4 h-4 mr-2" />
              Вийти
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Герой</TabsTrigger>
            <TabsTrigger value="testimonials">Відгуки</TabsTrigger>
            <TabsTrigger value="advantages">Переваги</TabsTrigger>
            <TabsTrigger value="documents">Документи</TabsTrigger>
            <TabsTrigger value="contacts">Контакти</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Головна секція</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    value={localContent.hero.title}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        hero: { ...localContent.hero, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Опис</Label>
                  <Textarea
                    value={localContent.hero.description}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        hero: { ...localContent.hero, description: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Текст кнопки</Label>
                  <Input
                    value={localContent.hero.buttonText}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        hero: { ...localContent.hero, buttonText: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>URL фонового зображення</Label>
                  <Input
                    value={localContent.hero.backgroundImage}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        hero: { ...localContent.hero, backgroundImage: e.target.value },
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={localContent.hero.buttonVisible}
                    onCheckedChange={(checked) =>
                      setLocalContent({
                        ...localContent,
                        hero: { ...localContent.hero, buttonVisible: checked },
                      })
                    }
                  />
                  <Label>Показувати кнопку</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Відгуки волонтерів</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок секції</Label>
                  <Input
                    value={localContent.testimonials.title}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        testimonials: { ...localContent.testimonials, title: e.target.value },
                      })
                    }
                  />
                </div>
                {localContent.testimonials.items.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Відгук #{index + 1}</Label>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const items = localContent.testimonials.items.filter((_, i) => i !== index);
                            setLocalContent({
                              ...localContent,
                              testimonials: { ...localContent.testimonials, items },
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="URL фото"
                        value={item.photo}
                        onChange={(e) => {
                          const items = [...localContent.testimonials.items];
                          items[index] = { ...items[index], photo: e.target.value };
                          setLocalContent({
                            ...localContent,
                            testimonials: { ...localContent.testimonials, items },
                          });
                        }}
                      />
                      <Input
                        placeholder="Ім'я"
                        value={item.title}
                        onChange={(e) => {
                          const items = [...localContent.testimonials.items];
                          items[index] = { ...items[index], title: e.target.value };
                          setLocalContent({
                            ...localContent,
                            testimonials: { ...localContent.testimonials, items },
                          });
                        }}
                      />
                      <Textarea
                        placeholder="Текст відгуку"
                        value={item.description}
                        onChange={(e) => {
                          const items = [...localContent.testimonials.items];
                          items[index] = { ...items[index], description: e.target.value };
                          setLocalContent({
                            ...localContent,
                            testimonials: { ...localContent.testimonials, items },
                          });
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={() => {
                    const newItem = {
                      id: Date.now().toString(),
                      photo: "",
                      title: "",
                      description: "",
                    };
                    setLocalContent({
                      ...localContent,
                      testimonials: {
                        ...localContent.testimonials,
                        items: [...localContent.testimonials.items, newItem],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Додати відгук
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advantages">
            <Card>
              <CardHeader>
                <CardTitle>Переваги</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    value={localContent.advantages.title}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        advantages: { ...localContent.advantages, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Опис</Label>
                  <Textarea
                    value={localContent.advantages.description}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        advantages: { ...localContent.advantages, description: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>URL фонового зображення</Label>
                  <Input
                    value={localContent.advantages.backgroundImage}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        advantages: { ...localContent.advantages, backgroundImage: e.target.value },
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
                {localContent.advantages.items.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Перевага #{index + 1}</Label>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const items = localContent.advantages.items.filter((_, i) => i !== index);
                            setLocalContent({
                              ...localContent,
                              advantages: { ...localContent.advantages, items },
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Назва іконки (напр. Users, Shield)"
                        value={item.icon}
                        onChange={(e) => {
                          const items = [...localContent.advantages.items];
                          items[index] = { ...items[index], icon: e.target.value };
                          setLocalContent({
                            ...localContent,
                            advantages: { ...localContent.advantages, items },
                          });
                        }}
                      />
                      <Input
                        placeholder="Заголовок"
                        value={item.title}
                        onChange={(e) => {
                          const items = [...localContent.advantages.items];
                          items[index] = { ...items[index], title: e.target.value };
                          setLocalContent({
                            ...localContent,
                            advantages: { ...localContent.advantages, items },
                          });
                        }}
                      />
                      <Textarea
                        placeholder="Опис"
                        value={item.description}
                        onChange={(e) => {
                          const items = [...localContent.advantages.items];
                          items[index] = { ...items[index], description: e.target.value };
                          setLocalContent({
                            ...localContent,
                            advantages: { ...localContent.advantages, items },
                          });
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={() => {
                    const newItem = {
                      id: Date.now().toString(),
                      icon: "",
                      title: "",
                      description: "",
                    };
                    setLocalContent({
                      ...localContent,
                      advantages: {
                        ...localContent.advantages,
                        items: [...localContent.advantages.items, newItem],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Додати перевагу
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Документи</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок секції</Label>
                  <Input
                    value={localContent.documents.title}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        documents: { ...localContent.documents, title: e.target.value },
                      })
                    }
                  />
                </div>
                {localContent.documents.items.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Документ #{index + 1}</Label>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const items = localContent.documents.items.filter((_, i) => i !== index);
                            setLocalContent({
                              ...localContent,
                              documents: { ...localContent.documents, items },
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Назва документа</Label>
                        <Input
                          placeholder="Назва документа"
                          value={item.title}
                          onChange={(e) => {
                            const items = [...localContent.documents.items];
                            items[index] = { ...items[index], title: e.target.value };
                            setLocalContent({
                              ...localContent,
                              documents: { ...localContent.documents, items },
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Файл документа</Label>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Перевірка розміру (макс 10MB)
                              if (file.size > 10 * 1024 * 1024) {
                                toast({
                                  title: "Помилка",
                                  description: "Файл занадто великий. Максимальний розмір: 10MB",
                                  variant: "destructive",
                                });
                                return;
                              }
                              
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const items = [...localContent.documents.items];
                                items[index] = {
                                  ...items[index],
                                  fileName: file.name,
                                  fileData: event.target?.result as string,
                                  fileType: file.type,
                                  fileUrl: '', // Очищаємо старий URL
                                };
                                setLocalContent({
                                  ...localContent,
                                  documents: { ...localContent.documents, items },
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="cursor-pointer"
                        />
                        {item.fileName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            📎 {item.fileName}
                          </p>
                        )}
                        {item.fileUrl && !item.fileName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            🔗 Посилання: {item.fileUrl}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={() => {
                    const newItem = {
                      id: Date.now().toString(),
                      title: "",
                      fileUrl: "",
                    };
                    setLocalContent({
                      ...localContent,
                      documents: {
                        ...localContent.documents,
                        items: [...localContent.documents.items, newItem],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Додати документ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Контактна інформація</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Адреса</Label>
                    <Input
                      value={localContent.contact.address}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, address: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Телефон</Label>
                    <Input
                      value={localContent.contact.phone}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={localContent.contact.email}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, email: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Telegram (@username)</Label>
                    <Input
                      value={localContent.contact.telegram}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, telegram: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      value={localContent.contact.facebook}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, facebook: e.target.value },
                        })
                      }
                      placeholder="facebook.com/username"
                    />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <Input
                      value={localContent.contact.instagram}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, instagram: e.target.value },
                        })
                      }
                      placeholder="instagram.com/username"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Налаштування Telegram</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      ℹ️ Telegram Bot Token та Chat ID налаштовуються через змінні середовища на сервері для безпеки.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Змінні на сервері:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-2">
                      <li>TELEGRAM_BOT_TOKEN</li>
                      <li>TELEGRAM_CHAT_ID</li>
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Для налаштування зверніться до адміністратора сервера або змініть змінні середовища в Render Dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
