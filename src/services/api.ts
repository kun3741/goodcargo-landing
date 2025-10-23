// В режимі розробки використовуємо проксі Vite, в продакшені - повний URL
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production' 
    ? '/api'  // В продакшені API на тому ж домені
    : '/api'  // В розробці використовуємо Vite проксі
);

export const api = {
  // Отримати контент
  async getContent() {
    const response = await fetch(`${API_URL}/content`);
    if (!response.ok) {
      throw new Error('Не вдалося отримати контент');
    }
    return response.json();
  },

  // Оновити контент
  async updateContent(content: any) {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    });
    
    if (!response.ok) {
      throw new Error('Не вдалося оновити контент');
    }
    return response.json();
  },

  // Логін
  async login(password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Невірний пароль');
    }
    return response.json();
  },

  // Перевірка токена
  async verifyToken() {
    const token = localStorage.getItem('adminToken');
    if (!token) return { valid: false };
    
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    } catch {
      return { valid: false };
    }
  },
};

