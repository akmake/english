/* ==========================================================================
   FILE: useTitanAudio.js
   DESCRIPTION: Audio Synthesis, SFX, and Input Managers
   ========================================================================== */

import { useEffect, useCallback, useState } from 'react';

// --- UTILS ---
export const secureShuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const generateUUID = () => 'uid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

// --- SFX ENGINE (WebAudio API) ---
class SFXGenerator {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type, duration, vol = 0.1, delay = 0) {
    if (!this.enabled) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }

  // --- PRESETS ---
  win() {
    // Victory Chord (Major)
    this.playTone(523.25, 'sine', 0.4, 0.2, 0); 
    this.playTone(659.25, 'sine', 0.4, 0.2, 0.1); 
    this.playTone(783.99, 'square', 0.6, 0.1, 0.2);
  }

  fail() {
    // Failure (Dissonant)
    this.playTone(150, 'sawtooth', 0.4, 0.3, 0);
    this.playTone(144, 'sawtooth', 0.4, 0.3, 0);
  }

  click() {
    this.playTone(1200, 'triangle', 0.05, 0.05, 0);
  }
  
  levelUp() {
    // Fanfare
    [440, 554, 659, 880].forEach((f, i) => this.playTone(f, 'square', 0.3, 0.1, i * 0.1));
  }

  toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
  }
}

export const sfx = new SFXGenerator();

// --- TTS HOOK ---
export const useTextToSpeech = () => {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; 
    u.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google US') || v.name.includes('Samantha'));
    if (preferred) u.voice = preferred;
    
    window.speechSynthesis.speak(u);
  }, []);
  return { speak };
};

// --- KEYBOARD HOOK ---
export const useKeyboardControls = (handlers = {}, deps = []) => {
  useEffect(() => {
    const handler = (e) => {
      // Allow specific overrides for inputs (like Enter to submit)
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      
      if (isInput) {
          if (e.code === 'Enter' && handlers.onEnterInput) handlers.onEnterInput();
          return;
      }

      switch(e.code) {
        case 'Space': e.preventDefault(); handlers.onSpace && handlers.onSpace(); break;
        case 'Enter': handlers.onEnter && handlers.onEnter(); break;
        case 'Digit1': handlers.onNum && handlers.onNum(1); break;
        case 'Digit2': handlers.onNum && handlers.onNum(2); break;
        case 'Digit3': handlers.onNum && handlers.onNum(3); break;
        case 'Digit4': handlers.onNum && handlers.onNum(4); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, deps);
};