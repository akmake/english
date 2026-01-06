import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  term: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true 
  },
  translation: { 
    type: String, 
    required: true 
  },
  definition: { 
    type: String 
  }, 
  level: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced', 'expert', 'academic'], 
    default: 'intermediate'
  },
  // --- זה החלק הקריטי למשפט הקסום ---
  sentenceParts: [{
    en: { type: String, required: true },
    he: { type: String, required: true }
  }]
});

export default mongoose.model('Word', wordSchema);