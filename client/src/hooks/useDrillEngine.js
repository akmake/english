/* ==========================================================================
   FILE: useDrillEngine.js
   STATUS: PRODUCTION READY (ALL 11 MODES INTEGRATED)
   ========================================================================== */

import { useReducer, useEffect } from 'react';
import axios from 'axios';
// הנחה: secureShuffle קיים אצלך ב-useTitanAudio. אם לא, תעתיק את פונקציית הערבוב הפשוטה שהבאתי קודם.
import { secureShuffle } from './useTitanAudio'; 

const CONFIG = {
  BATCH_SIZE: 5,
  MASTERY_GOAL: 100,
  MASTERY_INC: 25,
  XP_BASE: 20
};

const initialState = {
  status: 'BOOTING',
  wordPool: [],       
  stack: [],          
  drillQueue: [],     
  masteryMap: {},     
  currentWord: null,
  phase: 'IDLE',      
  gameMode: 'DEEP_STUDY',
  xp: 0,
  streak: 0,
  feedback: null,     
  msg: ''
};

function reducer(state, action) {
  const safe = (newState) => ({
      ...newState,
      drillQueue: Array.isArray(newState.drillQueue) ? newState.drillQueue : [],
      wordPool: Array.isArray(newState.wordPool) ? newState.wordPool : [],
      stack: Array.isArray(newState.stack) ? newState.stack : []
  });

  switch (action.type) {
    case 'INIT':
      const shuffledPool = secureShuffle(action.payload || []);
      return safe({
          ...state,
          wordPool: shuffledPool,
          status: (shuffledPool.length > 0) ? 'IDLE' : 'VICTORY'
      });

    case 'ERROR': return { ...state, status: 'ERROR' };

    case 'START_SESSION': {
      if (!state.wordPool || state.wordPool.length === 0) return { ...state, status: 'VICTORY' };
      const [head, ...tail] = state.wordPool;
      return safe({
        ...state,
        status: 'RUNNING',
        wordPool: tail,
        currentWord: head,
        phase: 'INTRO',
        gameMode: 'DEEP_STUDY',
        drillQueue: [],
        masteryMap: {}
      });
    }

    case 'INTRO_DONE':
      return { ...state, phase: 'ANCHOR', gameMode: 'GRID_HUNTER' };

    case 'ANCHOR_SUCCESS': {
      const newStack = [...state.stack, state.currentWord];
      const history = secureShuffle(newStack).slice(0, CONFIG.BATCH_SIZE - 1);
      const newQueue = secureShuffle([state.currentWord, ...history]);
      const newMastery = {};
      newQueue.forEach(w => newMastery[w._id] = 0);

      return safe({
        ...state,
        stack: newStack,
        drillQueue: newQueue,
        masteryMap: newMastery,
        phase: 'DRILL',
        currentWord: newQueue[0],
        gameMode: pickGame(),
        xp: state.xp + CONFIG.XP_BASE,
        streak: state.streak + 1,
        feedback: 'CORRECT',
        msg: 'ANCHORED!'
      });
    }

    case 'ANCHOR_FAIL':
      return { ...state, streak: 0, feedback: 'WRONG', msg: 'RE-ENCODE' };

    case 'DRILL_SUCCESS': {
      const wId = state.currentWord._id;
      const currentScore = state.masteryMap[wId] || 0;
      const newScore = Math.min(currentScore + CONFIG.MASTERY_INC, 100);
      const updatedMastery = { ...state.masteryMap, [wId]: newScore };
      let nextQueue = [...state.drillQueue];
      let msg = `${newScore}%`;

      if (newScore >= CONFIG.MASTERY_GOAL) {
          nextQueue = nextQueue.filter(w => w._id !== wId);
          msg = "MASTERED!";
      } else {
          if (nextQueue.length > 0) {
              const [h, ...t] = nextQueue;
              nextQueue = [...t, h];
          }
      }

      return safe({
        ...state,
        drillQueue: nextQueue,
        masteryMap: updatedMastery,
        currentWord: nextQueue.length > 0 ? nextQueue[0] : state.currentWord,
        gameMode: nextQueue.length > 0 ? pickGame() : state.gameMode,
        xp: state.xp + CONFIG.XP_BASE,
        streak: state.streak + 1,
        feedback: 'CORRECT',
        msg
      });
    }

    case 'DRILL_FAIL': {
      const wId = state.currentWord._id;
      const updatedMastery = { ...state.masteryMap, [wId]: 0 };
      let nextQueue = [...state.drillQueue];
      if (nextQueue.length > 0) {
          const [h, ...t] = nextQueue;
          nextQueue = [...t, h];
      }
      return safe({
        ...state,
        drillQueue: nextQueue,
        masteryMap: updatedMastery,
        currentWord: nextQueue[0],
        gameMode: pickGame(),
        streak: 0,
        feedback: 'WRONG',
        msg: 'RESET 0%'
      });
    }

    case 'NEXT_WORD': {
      if (state.wordPool.length === 0) return { ...state, status: 'VICTORY' };
      const [next, ...pool] = state.wordPool;
      return safe({ ...state, wordPool: pool, currentWord: next, phase: 'INTRO', gameMode: 'DEEP_STUDY' });
    }

    case 'RESET_TO_INTRO': return { ...state, phase: 'INTRO', gameMode: 'DEEP_STUDY' };
    case 'CLEAR_FEEDBACK': return { ...state, feedback: null };
    default: return state;
  }
}

// --- GAME SELECTOR (UPDATED FOR 11 GAMES) ---
const pickGame = () => {
  const r = Math.random();
  if (r < 0.09) return 'GRID_HUNTER';     
  if (r < 0.18) return 'MIRROR_MASK';     
  if (r < 0.27) return 'SPEED_LINK';      
  if (r < 0.36) return 'NEURAL_ECHO';     
  if (r < 0.45) return 'CONTEXT_MASTER';  
  if (r < 0.54) return 'TITAN_RECALL';    
  if (r < 0.63) return 'CHAOS_CIPHER';   // NEW
  if (r < 0.72) return 'SYNTAX_SIEGE';   // NEW
  if (r < 0.81) return 'NEXUS_LINK';     // NEW
  if (r < 0.90) return 'ECHO_CHAMBER';   // NEW
  return 'TITAN_RECALL'; // ברירת מחדל קשה
};

export const useDrillEngine = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/v1/learn/personal-drill', { withCredentials: true });
        const data = Array.isArray(res.data) ? res.data : [];
        dispatch({ type: 'INIT', payload: data });
      } catch (e) {
        console.error("Drill Init Failed", e);
        dispatch({ type: 'ERROR' });
      }
    };
    load();
  }, []);

  return { state, dispatch };
};