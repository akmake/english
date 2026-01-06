// server/models/Story.js
import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  level: { type: String, default: 'intermediate' },
  type: { type: String, enum: ['story', 'article', 'news'], default: 'story' },
  // המילים שהסיפור הזה בא ללמד אותנו
  targetWords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }],
  // תרגום למילים קשות ספציפית בתוך הסיפור הזה
  glossary: [{
    word: String,
    translation: String
  }]
}, { timestamps: true });

export default mongoose.model('Story', storySchema);