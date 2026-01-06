import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // למשל: "Amirnet Simulation #1"
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  // זמן מוקצב למבחן בדקות (בד"כ פרק הוא 20-25 דקות)
  durationMinutes: {
    type: Number,
    default: 20
  },
  // מערך של ID של שאלות שמרכיבות את המבחן הזה
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);