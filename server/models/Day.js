import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  dayNumber: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  // רשימת המילים ששייכות ליום הזה
  words: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Word' 
  }]
});

export default mongoose.model('Day', daySchema);