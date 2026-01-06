import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sentence_completion', 'restatement', 'reading_comprehension'],
    required: true
  },
  difficulty: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 3 
  },
  content: { type: String, required: true }, // גוף השאלה
  
  // רלוונטי רק להבנת הנקרא:
  relatedPassage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReadingPassage',
    default: null
  },

  answers: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);