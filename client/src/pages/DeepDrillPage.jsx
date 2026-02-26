import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Loader2, Trophy, GraduationCap, Activity, Flame,
  BookOpen, Shield, Sword, Check, X, Command, Keyboard as KeyboardIcon
} from 'lucide-react';
import { useDrillEngine } from '../hooks/useDrillEngine';
import { useTextToSpeech, sfx } from '../hooks/useTitanAudio';
// ייבוא כל 11 המודולים
import {
  GridHunter, NeuralEcho, ContextMaster, SpeedLink, DeepStudy, MirrorMask, TitanRecall,
  SyntaxSiege, ChaosCipher, EchoChamber, NexusLink
} from '../components/DrillModules';

const DeepDrillPage = () => {
  const { state, dispatch } = useDrillEngine();
  const { speak } = useTextToSpeech();
  const [turnKey, setTurnKey] = useState(0);

  const drillQueue = state.drillQueue || [];
  const wordPool = state.wordPool || [];
  const stack = state.stack || [];
  const queueLen = drillQueue.length;

  useEffect(() => {
    if (state.status === 'IDLE') { const t = setTimeout(() => dispatch({ type: 'START_SESSION' }), 800); return () => clearTimeout(t); }
  }, [state.status, dispatch]);

  useEffect(() => {
    if (state.feedback) {
        if (state.feedback === 'CORRECT') {
            sfx.win();
            if (state.phase === 'DRILL' && queueLen === 0) confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        } else { sfx.fail(); }

        const t = setTimeout(() => {
            dispatch({ type: 'CLEAR_FEEDBACK' });
            if (state.feedback === 'CORRECT') {
                if (state.phase === 'INTRO') dispatch({ type: 'INTRO_DONE' });
                else if (state.phase === 'DRILL' && queueLen === 0) dispatch({ type: 'NEXT_WORD' });
            } else if (state.phase === 'ANCHOR') dispatch({ type: 'RESET_TO_INTRO' });
            setTurnKey(k => k + 1);
        }, 1200);
        return () => clearTimeout(t);
    }
  }, [state.feedback, state.phase, queueLen, dispatch]);

  const handleComplete = (success) => {
      if (state.phase === 'INTRO') dispatch({ type: 'INTRO_DONE' });
      else if (state.phase === 'ANCHOR') success ? dispatch({ type: 'ANCHOR_SUCCESS' }) : dispatch({ type: 'ANCHOR_FAIL' });
      else if (state.phase === 'DRILL') success ? dispatch({ type: 'DRILL_SUCCESS' }) : dispatch({ type: 'DRILL_FAIL' });
  };

  const currentMastery = state.currentWord ? (state.masteryMap?.[state.currentWord._id] || 0) : 0;

  if (state.status === 'BOOTING') return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-500"><Loader2 className="w-16 h-16 animate-spin mb-4"/><span className="tracking-widest">LOADING TITAN ENGINE</span></div>;
  if (state.status === 'VICTORY') return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white"><Trophy size={120} className="text-yellow-400 mb-6"/><h1 className="text-6xl font-black">MISSION COMPLETE</h1></div>;
  if (state.status === 'ERROR') return <div className="h-screen bg-slate-950 flex items-center justify-center text-red-500">SYSTEM FAILURE</div>;

  return (
    <div className={`min-h-screen font-sans overflow-hidden transition-colors duration-500 ease-out relative ${state.feedback === 'CORRECT' ? 'bg-emerald-950' : state.feedback === 'WRONG' ? 'bg-rose-950' : 'bg-slate-950'}`}>
        <header className="fixed top-0 w-full h-24 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50 px-8 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-lg"><GraduationCap className="text-white w-8 h-8" /></div>
                <div><div className="text-lg font-black uppercase tracking-widest text-slate-400">OPERATOR</div><div className="text-slate-500 font-mono text-sm flex items-center gap-3 mt-1"><span className="flex items-center gap-1"><Activity size={14} /> {state.xp} XP</span></div></div>
            </div>
            <div className="hidden lg:flex items-center gap-4"><div className={`px-6 py-2 rounded-lg border bg-slate-900/80 backdrop-blur text-sm font-bold flex items-center gap-3 shadow-inner transition-colors duration-500 ${state.phase === 'INTRO' ? 'border-blue-500/50 text-blue-400' : ''} ${state.phase === 'ANCHOR' ? 'border-yellow-500/50 text-yellow-400' : ''} ${state.phase === 'DRILL' ? 'border-green-500/50 text-green-400' : ''}`}>{state.phase === 'INTRO' && <BookOpen size={16} />}{state.phase === 'ANCHOR' && <Shield size={16} />}{state.phase === 'DRILL' && <Sword size={16} />}<span className="tracking-widest">{state.phase} PHASE</span></div></div>
            <div className="flex items-center gap-3"><div className={`px-5 py-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center gap-2 font-black text-lg ${state.streak > 5 ? 'text-orange-500 animate-pulse border-orange-900/50' : 'text-slate-500'}`}><Flame size={20} fill="currentColor" /> {state.streak}</div></div>
        </header>

        <main className="pt-32 pb-10 px-6 h-screen flex flex-col max-w-5xl mx-auto">
            <div className="w-full flex justify-between text-xs font-mono text-slate-500 mb-2 px-1 tracking-wider"><span>MASTERED: {stack.length}</span><span>QUEUE: {wordPool.length}</span></div>
            <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 mb-10 overflow-hidden relative"><motion.div className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 shadow-[0_0_20px_cyan]" initial={{ width: 0 }} animate={{ width: `${(stack.length / (stack.length + wordPool.length || 1)) * 100}%` }} transition={{ duration: 1 }} /></div>

            <div className="flex-1 relative flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div key={`${state.currentWord?._id}-${state.gameMode}-${turnKey}`} initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} transition={{ duration: 0.4 }} className="w-full h-[600px] bg-slate-900/60 backdrop-blur-3xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12">
                        <div className="absolute top-0 left-0 px-8 py-3 bg-slate-800/80 backdrop-blur border-r border-b border-slate-700 rounded-br-3xl text-xs font-bold tracking-[0.25em] text-slate-400 uppercase flex items-center gap-3 shadow-lg z-20">{state.gameMode.replace('_', ' ')}</div>
                        {state.phase === 'DRILL' && state.currentWord && (
                            <div className="absolute top-6 right-8 flex flex-col items-end z-20"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">DRILL MASTERY</span><div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700"><motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: `${currentMastery}%` }} /></div></div>
                        )}
                        <div className="relative z-10 w-full h-full flex flex-col">
                            {state.currentWord && (
                                <>
                                    {state.gameMode === 'DEEP_STUDY' && <DeepStudy word={state.currentWord} onComplete={handleComplete} speak={speak} />}
                                    {state.gameMode === 'GRID_HUNTER' && <GridHunter word={state.currentWord} pool={wordPool} stack={stack} onComplete={handleComplete} />}
                                    {state.gameMode === 'NEURAL_ECHO' && <NeuralEcho word={state.currentWord} onComplete={handleComplete} speak={speak} />}
                                    {state.gameMode === 'SPEED_LINK' && <SpeedLink word={state.currentWord} pool={wordPool} stack={stack} onComplete={handleComplete} />}
                                    {state.gameMode === 'CONTEXT_MASTER' && <ContextMaster word={state.currentWord} onComplete={handleComplete} speak={speak} />}
                                    {state.gameMode === 'TITAN_RECALL' && <TitanRecall word={state.currentWord} onComplete={handleComplete} speak={speak} />}
                                    {state.gameMode === 'MIRROR_MASK' && <MirrorMask word={state.currentWord} pool={wordPool} stack={stack} onComplete={handleComplete} />}
                                    
                                    {/* 4 החדשים */}
                                    {state.gameMode === 'SYNTAX_SIEGE' && <SyntaxSiege word={state.currentWord} onComplete={handleComplete} speak={speak} />}
                                    {state.gameMode === 'CHAOS_CIPHER' && <ChaosCipher word={state.currentWord} onComplete={handleComplete} />}
                                    {state.gameMode === 'ECHO_CHAMBER' && <EchoChamber word={state.currentWord} onComplete={handleComplete} />}
                                    {state.gameMode === 'NEXUS_LINK' && <NexusLink word={state.currentWord} pool={wordPool} onComplete={handleComplete} />}
                                </>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                    {state.feedback && (
                        <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(5px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }} className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                            <div className={`p-12 rounded-[3rem] bg-slate-900 border-4 shadow-2xl flex flex-col items-center ${state.feedback === 'CORRECT' ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                {state.feedback === 'CORRECT' ? (<><div className="bg-emerald-500/20 p-6 rounded-full mb-6"><Check size={80} className="text-emerald-400" strokeWidth={4} /></div><h2 className="text-5xl font-black text-emerald-100 tracking-tighter uppercase">{state.msg}</h2></>) : (<><div className="bg-rose-500/20 p-6 rounded-full mb-6"><X size={80} className="text-rose-400" strokeWidth={4} /></div><h2 className="text-5xl font-black text-rose-100 tracking-tighter uppercase">{state.msg}</h2></>)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity"><div className="inline-flex gap-6 text-[10px] font-mono uppercase tracking-widest text-slate-500 border border-slate-800 px-4 py-2 rounded-full bg-slate-900/50"><span className="flex items-center gap-1"><Command size={10} /> TITAN V7</span><span className="flex items-center gap-1"><KeyboardIcon size={10} /> KEYBOARD ACTIVE</span></div></div>
        </main>
    </div>
  );
};
export default DeepDrillPage;