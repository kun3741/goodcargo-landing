import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  id: String,
  photo: String,
  title: String,
  description: String
});

const advantageSchema = new mongoose.Schema({
  id: String,
  icon: String,
  title: String,
  description: String
});

const documentSchema = new mongoose.Schema({
  id: String,
  title: String,
  fileUrl: String,
  fileName: String,    // Ім'я файлу
  fileData: String,    // Base64 дані файлу
  fileType: String     // MIME тип файлу
});

const contentSchema = new mongoose.Schema({
  hero: {
    title: String,
    description: String,
    buttonText: String,
    buttonVisible: Boolean,
    backgroundImage: String
  },
  testimonials: {
    title: String,
    items: [testimonialSchema]
  },
  advantages: {
    title: String,
    description: String,
    backgroundImage: String,
    items: [advantageSchema]
  },
  documents: {
    title: String,
    items: [documentSchema]
  },
  contact: {
    address: String,
    phone: String,
    email: String,
    telegram: String,
    facebook: String,
    instagram: String
  },
  telegram: {
    botToken: String,
    chatId: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Content', contentSchema);

