import mongoose from 'mongoose';

const readingPassageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // הטקסט המלא
  topic: { type: String, default: 'General' },
  difficulty: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 3 
  }
}, { timestamps: true });

export default mongoose.model('ReadingPassage', readingPassageSchema);