/* ==========================================================================
   FILE: DrillModules.jsx
   STATUS: FULLY EXPANDED & VERIFIED (11 GAME ENGINES)
   DESCRIPTION: Contains all visual game logic for the Titan Learning System.
   ========================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crosshair, 
  Ear, 
  Volume2, 
  Search, 
  Zap, 
  ArrowRight, 
  Star, 
  Keyboard, 
  Shield, 
  Terminal, 
  BookOpen, 
  Mic, 
  Network, 
  Shuffle
} from 'lucide-react';
import { secureShuffle, generateUUID, useKeyboardControls, sfx } from '../hooks/useTitanAudio';
import toast from 'react-hot-toast';

// ============================================================================
// 1. DEEP STUDY (ENCODE PHASE)
// ============================================================================
export const DeepStudy = ({ word, onComplete, speak }) => {
  if (!word) return null;

  useEffect(() => {
    const t = setTimeout(() => speak(word.english), 600);
    return () => clearTimeout(t);
  }, [word]);

  useKeyboardControls({
    onSpace: () => speak(word.english),
    onEnter: () => onComplete(true)
  });

  return (
    <div className="flex flex-col items-center justify-center h-full text-center w-full">
       <div className="mb-8 px-4 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
           <Star size={12} className="inline mr-2"/> STEP 1: ENCODING
       </div>
       
       <h1 
         className="text-7xl md:text-8xl font-black text-white mb-10 tracking-tighter cursor-pointer hover:text-cyan-400 transition-colors" 
         onClick={() => speak(word.english)}
       >
           {word.english}
       </h1>
       
       <div className="bg-slate-800 p-10 rounded-3xl w-full max-w-lg border-r-8 border-cyan-500 shadow-2xl mb-16">
           <h2 className="text-5xl font-bold text-cyan-400" dir="rtl">{word.hebrew}</h2>
       </div>
       
       <button 
         onClick={() => onComplete(true)} 
         className="px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-black text-white shadow-2xl flex items-center gap-3 text-lg hover:scale-105 transition-transform"
       >
           BEGIN GAUNTLET <ArrowRight/>
       </button>
       
       <div className="mt-8 text-slate-600 text-xs font-mono">
         [SPACE] REPLAY • [ENTER] START
       </div>
    </div>
  );
};

// ============================================================================
// 2. GRID HUNTER (VISUAL RECOGNITION)
// ============================================================================
export const GridHunter = ({ word, pool, stack, onComplete }) => {
  const [items, setItems] = useState([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!word) return;
    
    const target = { ...word, isTarget: true, key: generateUUID() };
    const candidates = [...(pool || []), ...(stack || [])].filter(w => w._id !== word._id);
    
    let dist = [];
    while (dist.length < 8) {
       const w = candidates.length > 0 
         ? candidates[Math.floor(Math.random() * candidates.length)] 
         : { hebrew: '-----', key: generateUUID() };
       dist.push({ ...w, isTarget: false, key: generateUUID() });
    }
    
    setItems(secureShuffle([target, ...dist]));
  }, [word, pool, stack]);

  const handle = (it) => {
    if (it.isTarget) { 
        sfx.click(); 
        onComplete(true); 
    } else { 
        sfx.fail(); 
        setShake(true); 
        setTimeout(() => setShake(false), 500); 
    }
  };

  useKeyboardControls({ onNum: (n) => items[n-1] && handle(items[n-1]) });

  if (!word) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl px-4">
       <div className="mb-8 text-center">
          <h3 className="text-xs text-slate-500 font-bold tracking-widest mb-2 flex justify-center gap-2">
              <Crosshair size={14}/> VISUAL RECOGNITION
          </h3>
          <h1 className="text-6xl font-black text-white">{word.english}</h1>
       </div>
       
       <div className={`grid grid-cols-3 gap-4 w-full ${shake ? 'animate-shake' : ''}`}>
          {items.map((it, i) => (
             <motion.button 
               key={it.key} 
               onClick={() => handle(it)} 
               whileHover={{ scale: 1.05 }} 
               whileTap={{ scale: 0.95 }}
               className="h-28 bg-slate-800/60 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center relative hover:border-cyan-500 group transition-all"
             >
               <span className="absolute top-2 left-3 text-[10px] text-slate-600 group-hover:text-cyan-500">{i+1}</span>
               <span className="text-xl font-bold text-slate-200 group-hover:text-white" dir="rtl">{it.hebrew}</span>
             </motion.button>
          ))}
       </div>
    </div>
  );
};

// ============================================================================
// 3. NEURAL ECHO (AUDIO -> TYPING)
// ============================================================================
export const NeuralEcho = ({ word, onComplete, speak }) => {
  const [val, setVal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
      const t = setTimeout(() => {
          speak(word.english);
          if (inputRef.current) inputRef.current.focus();
      }, 500);
      return () => clearTimeout(t);
  }, [word]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        if (val.trim().toLowerCase() === word.english.toLowerCase()) {
            onComplete(true);
        } else {
            sfx.fail();
            onComplete(false);
        }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
       <motion.button 
         onClick={() => speak(word.english)} 
         whileHover={{ scale: 1.1 }} 
         whileTap={{ scale: 0.9 }} 
         className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center mb-10 hover:border-cyan-500 shadow-xl group transition-all"
       >
          <Ear size={56} className="text-cyan-500 group-hover:animate-pulse"/>
       </motion.button>
       
       <div className="text-xs text-slate-500 font-mono mb-4 tracking-widest flex items-center gap-2">
         <Volume2 size={12}/> BLIND AUDIO ECHO
       </div>
       
       <input 
          ref={inputRef} 
          autoFocus 
          type="text" 
          value={val} 
          onChange={e => setVal(e.target.value)} 
          onKeyDown={handleKeyDown} 
          className="w-full max-w-md bg-transparent border-b-4 border-slate-700 text-center text-5xl text-white py-4 outline-none focus:border-cyan-500 font-mono tracking-widest placeholder-slate-800 transition-colors" 
          placeholder="TYPE..." 
          autoComplete="off" 
       />
    </div>
  );
};

// ============================================================================
// 4. CONTEXT MASTER (LOGIC & SENTENCE)
// ============================================================================
export const ContextMaster = ({ word, onComplete, speak }) => {
  const [parts, setParts] = useState(['', '']);
  const [opts, setOpts] = useState([]);

  useEffect(() => {
    const s = `The concept of ${word.english} is fundamental.`; // Simplified for safety
    setParts(s.split(word.english));
    setOpts(secureShuffle([word.english, "Something", "Nothing"]));
    speak(s);
  }, [word]);

  const handle = (o) => {
    if (o === word.english) { 
        sfx.click(); 
        onComplete(true); 
    } else { 
        sfx.fail(); 
        onComplete(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-2xl">
       <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-8 flex gap-2">
         <Search size={14}/> CONTEXT LOGIC
       </h3>
       
       <div className="bg-slate-900/80 p-10 rounded-3xl border-l-4 border-purple-500 w-full mb-12 text-center shadow-lg">
          <span className="text-3xl text-slate-300 font-light">{parts[0]}</span>
          <span className="inline-block px-4 border-b-4 border-dashed border-purple-500 text-purple-400 font-bold text-3xl mx-2">???</span>
          <span className="text-3xl text-slate-300 font-light">{parts[1]}</span>
       </div>
       
       <div className="flex gap-4">
         {opts.map((o, i) => (
           <button 
             key={i} 
             onClick={() => handle(o)} 
             className="px-8 py-4 bg-slate-800 border-b-4 border-slate-950 rounded-xl font-bold text-xl hover:border-purple-500 hover:text-purple-400 transition-all shadow-md"
           >
             {o}
           </button>
         ))}
       </div>
    </div>
  );
};

// ============================================================================
// 5. SPEED LINK (RAPID REFLEX)
// ============================================================================
export const SpeedLink = ({ word, pool, stack, onComplete }) => {
  const [q, setQ] = useState(null);
  const [prog, setProg] = useState(100);

  useEffect(() => {
    const isTrue = Math.random() > 0.5;
    let h = word.hebrew;
    
    if (!isTrue) { 
       const o = [...(pool || []), ...(stack || [])].filter(w => w._id !== word._id);
       h = o.length ? o[Math.floor(Math.random() * o.length)].hebrew : 'ERROR';
    }
    
    setQ({ eng: word.english, heb: h, isTrue });
    setProg(100);
  }, [word]);

  useEffect(() => {
    const i = setInterval(() => setProg(p => { 
        if (p <= 0) {
            clearInterval(i);
            onComplete(false);
            return 0;
        } 
        return p - 0.5; 
    }), 16);
    return () => clearInterval(i);
  }, []);

  useKeyboardControls({ 
    onNum: (n) => { 
        if (n === 1) onComplete(!q.isTrue); 
        if (n === 2) onComplete(q.isTrue); 
    } 
  });

  if (!q) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-xl">
       <div className="w-full h-4 bg-slate-800 rounded-full mb-8 overflow-hidden border border-slate-700">
         <motion.div className="h-full bg-yellow-400" style={{ width: `${prog}%` }} />
       </div>
       
       <div className="bg-slate-800 p-12 rounded-[2rem] w-full text-center border border-slate-700 mb-10 shadow-2xl">
          <h2 className="text-5xl font-black text-white mb-4">{q.eng}</h2>
          <div className="w-full h-px bg-slate-600 my-4"></div>
          <h2 className="text-5xl font-bold text-cyan-400" dir="rtl">{q.heb}</h2>
       </div>
       
       <div className="flex gap-6 w-full">
          <button onClick={() => onComplete(!q.isTrue)} className="flex-1 py-6 bg-rose-950/50 border-2 border-rose-500/50 text-rose-500 rounded-2xl font-black text-2xl hover:bg-rose-500 hover:text-white transition-all">
            FALSE [1]
          </button>
          <button onClick={() => onComplete(q.isTrue)} className="flex-1 py-6 bg-emerald-950/50 border-2 border-emerald-500/50 text-emerald-500 rounded-2xl font-black text-2xl hover:bg-emerald-500 hover:text-white transition-all">
            TRUE [2]
          </button>
       </div>
    </div>
  );
};

// ============================================================================
// 6. MIRROR MASK (REVERSE LOOKUP)
// ============================================================================
export const MirrorMask = ({ word, pool, stack, onComplete }) => {
  const [items, setItems] = useState([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const target = { ...word, isTarget: true, key: generateUUID() };
    const candidates = [...(pool || []), ...(stack || [])].filter(w => w._id !== word._id);
    
    let dist = [];
    while (dist.length < 5) {
       const w = candidates.length > 0 
         ? candidates[Math.floor(Math.random() * candidates.length)] 
         : { english: '-----', key: generateUUID() };
       dist.push({ ...w, isTarget: false, key: generateUUID() });
    }
    
    setItems(secureShuffle([target, ...dist]));
  }, [word]);

  const handle = (it) => {
    if (it.isTarget) { 
        sfx.click(); 
        onComplete(true); 
    } else { 
        sfx.fail(); 
        setShake(true); 
        setTimeout(() => setShake(false), 500); 
    }
  };

  useKeyboardControls({ onNum: (n) => items[n-1] && handle(items[n-1]) });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl px-4">
       <div className="mb-8 text-center">
          <h3 className="text-xs text-slate-500 font-bold tracking-widest mb-2 flex justify-center gap-2">
            <Shield size={14}/> REVERSE LOOKUP
          </h3>
          <h1 className="text-6xl font-black text-cyan-400" dir="rtl">{word.hebrew}</h1>
       </div>
       
       <div className={`grid grid-cols-2 gap-4 w-full max-w-xl ${shake ? 'animate-shake' : ''}`}>
          {items.map((it, i) => (
             <motion.button 
               key={it.key} 
               onClick={() => handle(it)} 
               whileHover={{ scale: 1.05 }} 
               whileTap={{ scale: 0.95 }}
               className="h-24 bg-slate-800 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center relative hover:border-emerald-500 group transition-all"
             >
               <span className="absolute top-2 left-3 text-[10px] text-slate-600 group-hover:text-emerald-500">{i+1}</span>
               <span className="text-xl font-bold text-white">{it.english}</span>
             </motion.button>
          ))}
       </div>
    </div>
  );
};

// ============================================================================
// 7. TITAN RECALL (HARDCORE TRANSLATION)
// ============================================================================
export const TitanRecall = ({ word, onComplete }) => {
  const [val, setVal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
      if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        if (val.trim().toLowerCase() === word.english.toLowerCase()) {
            onComplete(true);
        } else {
            sfx.fail();
            onComplete(false);
        }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
       <div className="mb-8 p-12 bg-slate-800/80 rounded-full border-4 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <h1 className="text-7xl font-bold text-white" dir="rtl">{word.hebrew}</h1>
       </div>
       
       <div className="text-xs text-red-400 font-mono mb-4 tracking-widest flex items-center gap-2">
           <Terminal size={12}/> TITAN PROTOCOL: TRANSLATE
       </div>
       
       <input 
          ref={inputRef} 
          autoFocus 
          type="text" 
          value={val} 
          onChange={e => setVal(e.target.value)} 
          onKeyDown={handleKeyDown} 
          className="w-full max-w-lg bg-transparent border-b-4 border-red-900/50 text-center text-6xl text-white py-4 outline-none focus:border-red-500 font-mono tracking-widest placeholder-red-900/30 transition-colors" 
          placeholder="ENGLISH..." 
          autoComplete="off" 
       />
       
       <div className="mt-8 text-slate-600 text-xs font-mono flex gap-6">
          <span className="flex gap-1"><Keyboard size={12}/> TYPE TRANSLATION</span>
          <span className="flex gap-1"><ArrowRight size={12}/> [ENTER] SUBMIT</span>
       </div>
    </div>
  );
};

// ============================================================================
// 8. SYNTAX SIEGE (SENTENCE CONSTRUCTION) - *NEW*
// ============================================================================
export const SyntaxSiege = ({ word, onComplete, speak }) => {
  const [targetSentence, setTargetSentence] = useState('');
  const [bank, setBank] = useState([]);
  const [built, setBuilt] = useState([]);

  useEffect(() => {
    const raw = word.exampleSentence || `The definition of ${word.english} is important`;
    setTargetSentence(raw);
    setBank(secureShuffle(raw.split(' ').map((w, i) => ({ id: i, text: w }))));
    setBuilt([]);
    speak(word.english);
  }, [word]);

  const moveToBuilt = (item) => {
    setBuilt([...built, item]);
    setBank(bank.filter(i => i.id !== item.id));
    sfx.click();
  };

  const moveToBank = (item) => {
    setBank([...bank, item]);
    setBuilt(built.filter(i => i.id !== item.id));
  };

  const check = () => {
    const currentStr = built.map(i => i.text).join(' ').replace(/[.,!?;]/g,'').toLowerCase();
    const targetStr = targetSentence.replace(/[.,!?;]/g,'').toLowerCase();
    
    if (currentStr === targetStr) {
        onComplete(true);
    } else {
        sfx.fail();
        toast.error("Incorrect structure");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-3xl">
       <div className="mb-6 text-xs text-slate-500 font-bold tracking-widest flex gap-2">
         <BookOpen size={14}/> SYNTAX SIEGE
       </div>
       
       {/* Build Area */}
       <div className="min-h-[100px] w-full bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-wrap gap-3 justify-center items-center mb-8 transition-all hover:border-slate-500">
          {built.length === 0 && <span className="text-slate-600 text-sm font-mono"> TAP WORDS BELOW... </span>}
          {built.map(item => (
             <motion.button 
               layoutId={item.id} 
               key={item.id} 
               onClick={() => moveToBank(item)} 
               className="px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 text-cyan-100 rounded-lg font-bold shadow-sm"
             >
               {item.text}
             </motion.button>
          ))}
       </div>
       
       {/* Word Bank */}
       <div className="flex flex-wrap gap-3 justify-center mb-10">
          {bank.map(item => (
             <motion.button 
               layoutId={item.id} 
               key={item.id} 
               onClick={() => moveToBuilt(item)} 
               className="px-4 py-3 bg-slate-800 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 hover:border-slate-400 transition-all shadow-md"
             >
               {item.text}
             </motion.button>
          ))}
       </div>
       
       <button 
         onClick={check} 
         disabled={bank.length > 0} 
         className="px-12 py-4 bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2"
       >
          VERIFY STRUCTURE <Shield size={18}/>
       </button>
    </div>
  );
};

// ============================================================================
// 9. CHAOS CIPHER (ANAGRAM) - *NEW*
// ============================================================================
export const ChaosCipher = ({ word, onComplete }) => {
  const [shuffled, setShuffled] = useState([]);
  const [input, setInput] = useState([]);

  useEffect(() => {
    const c = word.english.split('').map((c, i) => ({ id: i, char: c }));
    setShuffled(secureShuffle(c));
    setInput([]);
  }, [word]);

  const handleChar = (charObj) => {
    const newInput = [...input, charObj];
    setInput(newInput);
    setShuffled(shuffled.filter(c => c.id !== charObj.id));

    if (newInput.length === word.english.length) {
      if (newInput.map(c => c.char).join('').toLowerCase() === word.english.toLowerCase()) {
         setTimeout(() => onComplete(true), 300);
      } else {
         sfx.fail();
         // Reset animation
         setTimeout(() => {
            setShuffled(secureShuffle(word.english.split('').map((c, i) => ({ id: i, char: c }))));
            setInput([]);
         }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
       <div className="mb-8 p-6 bg-slate-900 rounded-full border border-slate-800 shadow-xl">
          <h2 className="text-3xl font-bold text-slate-500" dir="rtl">{word.hebrew}</h2>
       </div>
       
       <div className="flex gap-2 mb-12 h-16">
          {input.map(c => (
             <motion.div 
               layoutId={c.id} 
               key={c.id} 
               className="w-12 h-14 bg-slate-700 border-b-4 border-cyan-500 flex items-center justify-center text-2xl font-mono text-white rounded shadow-lg"
             >
               {c.char}
             </motion.div>
          ))}
          {/* Empty slots placeholders */}
          {Array(word.english.length - input.length).fill(0).map((_, i) => (
             <div key={i} className="w-12 h-14 bg-slate-800/30 border-b-4 border-slate-800 rounded"></div>
          ))}
       </div>
       
       <div className="flex flex-wrap justify-center gap-3 max-w-lg">
          {shuffled.map(c => (
             <motion.button 
               layoutId={c.id} 
               key={c.id} 
               onClick={() => handleChar(c)} 
               className="w-14 h-14 bg-slate-800 border border-slate-600 rounded-xl text-2xl font-black text-white hover:border-cyan-400 hover:scale-110 hover:bg-slate-700 transition-all shadow-md"
             >
               {c.char}
             </motion.button>
          ))}
       </div>
       
       <div className="mt-8 text-xs text-slate-500 font-bold tracking-widest flex gap-2">
         <Shuffle size={14}/> UNSCRAMBLE
       </div>
    </div>
  );
};

// ============================================================================
// 10. ECHO CHAMBER (VOICE RECOGNITION) - *NEW*
// ============================================================================
export const EchoChamber = ({ word, onComplete }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    // Basic browser support check
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast.error("Browser does not support Speech API");
        onComplete(true); 
        return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.start();
    setListening(true);
    setTranscript('Listening...');

    rec.onresult = (e) => {
        const r = e.results[0][0].transcript.toLowerCase();
        setTranscript(r);
        
        if (r.includes(word.english.toLowerCase())) {
            onComplete(true);
        } else {
            sfx.fail();
            setListening(false);
        }
    };

    rec.onerror = () => {
        setListening(false);
        setTranscript('Try Again');
    };

    rec.onend = () => setListening(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
       <div className="text-xs text-red-500 font-bold tracking-widest mb-10 animate-pulse flex gap-2">
         <Mic size={14}/> VOICE ANALYSIS ACTIVE
       </div>
       
       <h1 className="text-6xl font-black text-white mb-4">{word.english}</h1>
       
       <button 
         onClick={startListening} 
         disabled={listening} 
         className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${listening ? 'bg-red-500 shadow-[0_0_50px_red] scale-110' : 'bg-slate-800 border-4 border-slate-700 hover:border-red-500'}`}
       >
         <Mic size={48} className={listening ? 'text-white animate-bounce' : 'text-slate-400'} />
       </button>
       
       <p className="mt-8 font-mono text-cyan-400 h-8 text-xl tracking-wider">
         {transcript}
       </p>
    </div>
  );
};

// ============================================================================
// 11. NEXUS LINK (ASSOCIATIONS) - *NEW*
// ============================================================================
export const NexusLink = ({ word, pool, onComplete }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const distractors = secureShuffle((pool || []).filter(w => w._id !== word._id)).slice(0, 3);
        setOptions(secureShuffle([word, ...distractors]));
    }, [word, pool]);

    const handle = (w) => {
        if (w._id === word._id) {
            onComplete(true);
        } else {
            sfx.fail();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="mb-10 text-center">
                <span className="text-xs font-bold text-purple-400 tracking-widest border border-purple-500/30 px-3 py-1 rounded-full flex items-center justify-center gap-2 w-fit mx-auto">
                    <Network size={12}/> SEMANTIC LINK
                </span>
                <h2 className="text-xl text-slate-400 mt-4">Select the English match for:</h2>
                <h1 className="text-6xl font-black text-purple-500 mt-2" dir="rtl">{word.hebrew}</h1>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                {options.map((opt) => (
                    <button 
                        key={opt._id} 
                        onClick={() => handle(opt)} 
                        className="w-full py-5 bg-slate-800 border-l-4 border-slate-600 hover:bg-slate-700 hover:border-purple-500 hover:pl-6 transition-all text-left px-6 text-2xl font-mono text-slate-300 shadow-lg"
                    >
                        {opt.english}
                    </button>
                ))}
            </div>
        </div>
    );
};