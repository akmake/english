import React, { useState } from 'react';
import { Volume2, X, PlusCircle, Save } from 'lucide-react';
import axios from 'axios';

const TextReaderWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // --- מצבים להוספת מילה ---
  const [mode, setMode] = useState('READ'); // 'READ' or 'ADD'
  const [newWord, setNewWord] = useState({ english: '', hebrew: '' });

  const handleSpeak = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleAddWord = async () => {
    if (!newWord.english || !newWord.hebrew) return alert('נא למלא את שני השדות');
    try {
      await axios.post('/api/v1/learn/add-personal-word', newWord, { withCredentials: true });
      alert('המילה נוספה למאגר בהצלחה!');
      setNewWord({ english: '', hebrew: '' });
    } catch (error) {
      console.error(error);
      alert('שגיאה בהוספת מילה (אולי היא כבר קיימת?)');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        <Volume2 size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
      {/* כותרת וטאבים */}
      <div className="bg-blue-600 p-3 flex justify-between items-center text-white">
        <div className="flex gap-4 text-sm font-bold">
            <button 
                onClick={() => setMode('READ')} 
                className={`${mode === 'READ' ? 'underline' : 'opacity-70'}`}>
                הקראה
            </button>
            <button 
                onClick={() => setMode('ADD')} 
                className={`${mode === 'ADD' ? 'underline' : 'opacity-70'}`}>
                הוספה למאגר
            </button>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      {/* תוכן הווידג'ט */}
      <div className="p-4">
        {mode === 'READ' ? (
            <>
                <textarea
                className="w-full h-32 p-2 border rounded mb-2 text-left resize-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste English text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                dir="ltr"
                />
                <button
                onClick={handleSpeak}
                disabled={isSpeaking || !text}
                className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                >
                <Volume2 size={18} />
                {isSpeaking ? 'Speaking...' : 'Read Aloud'}
                </button>
            </>
        ) : (
            <div className="flex flex-col gap-3">
                <div className="text-xs text-gray-500 mb-1">הכנס מילה ל"חפירה" אישית:</div>
                <input 
                    type="text" 
                    placeholder="English Word"
                    className="p-2 border rounded text-left"
                    value={newWord.english}
                    onChange={e => setNewWord({...newWord, english: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder="תרגום לעברית"
                    className="p-2 border rounded text-right"
                    value={newWord.hebrew}
                    onChange={e => setNewWord({...newWord, hebrew: e.target.value})}
                />
                <button 
                    onClick={handleAddWord}
                    className="w-full bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700"
                >
                    <Save size={18} />
                    שמור במאגר
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default TextReaderWidget;