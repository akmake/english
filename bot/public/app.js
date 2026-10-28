import { UNITS, FREE_TALK } from './curriculum.js';
import {
  LEVELS, LEVEL_HE, PLACEMENT_WORDS, today, addDays, addReviewItem, gradeItem, dueKeys,
  bumpStreak, currentStreak, checkAnswer, hintOf, shuffle, vocabLevel, finalLevel,
} from './learning.js';

const app = document.getElementById('app');
const statusEl = document.getElementById('status');
const tabbar = document.getElementById('tabbar');

// ---------- Progress (saved on the server in bot/data/progress.json) ----------

const emptyProgress = () => ({
  profile: {}, units: {}, review: {}, streak: { count: 0, lastDay: null }, mistakes: [], settings: { rate: 0.9 },
});
let P = emptyProgress();
let loaded = false; // never overwrite saved progress with an empty state after a failed load
let saveTimer = null;

async function loadProgress() {
  try {
    const res = await fetch('/api/progress');
    if (!res.ok) throw new Error();
    P = { ...emptyProgress(), ...(await res.json()) };
    loaded = true;
  } catch {
    setStatus('⚠️ לא הצלחתי לטעון את ההתקדמות. בדוק שהשרת פועל ורענן את הדף.', true);
  }
}

function putProgress(keepalive = false) {
  return fetch('/api/progress', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(P), keepalive,
  });
}

function save() {
  if (!loaded) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    try {
      if (!(await putProgress()).ok) throw new Error();
    } catch {
      setStatus('⚠️ ההתקדמות לא נשמרה. בדוק שהשרת פועל.', true);
    }
  }, 300);
}

window.addEventListener('pagehide', () => {
  if (saveTimer) { clearTimeout(saveTimer); putProgress(true); }
});

// ---------- DOM helpers ----------

function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'class') e.className = v;
    else if (k in e) e[k] = v;
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) e.append(c instanceof Node ? c : String(c));
  return e;
}

// Replace the screen; skips the false/null left by `cond && node` (replaceChildren would print them)
function mount(...nodes) {
  app.replaceChildren(...nodes.flat(Infinity).filter((n) => n != null && n !== false));
}

const ICONS = {
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  settings: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  lock: '<rect x="4" y="11" width="16" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  play: '<path d="m7 4 13 8-13 8z" fill="currentColor"/>',
  back: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  next: '<path d="M19 12H5M11 19l-7-7 7-7"/>',
  chevron: '<path d="m15 18-6-6 6-6"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  sparkle: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
};

function icon(name, size = 22) {
  const s = document.createElement('span');
  s.className = 'ic';
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  return s;
}

let statusTimer;
function setStatus(msg, isError = false) {
  clearTimeout(statusTimer);
  statusEl.textContent = msg;
  statusEl.className = msg ? (isError ? 'show error' : 'show') : '';
  if (isError) statusTimer = setTimeout(() => setStatus(''), 7000);
}

async function api(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'שגיאת שרת');
  return data;
}

function isUnlocked(i) {
  return P.profile.unlockAll || i === 0 || !!P.units[UNITS[i - 1].id]?.completed || !!P.units[UNITS[i].id]?.completed;
}

const go = (hash) => { location.hash = hash; };
const btn = (cls, label, onclick, ...extra) => h('button', { type: 'button', class: `btn ${cls}`, onclick }, ...extra, label);

// ---------- Speech: listen (browser), speak (local Kokoro, browser fallback), pronunciation (Gemini) ----------

let voices = [];
if (window.speechSynthesis) {
  const loadVoices = () => { voices = speechSynthesis.getVoices(); };
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

// Natural voice: Kokoro on the local server, one sentence at a time, cached on disk.
const audioCache = new Map(); // "voice|sentence" -> { url: Promise<object URL>, urgent, done }
const prefetchQueue = [];
let prefetching = 0;
let player = null;
let speakToken = 0;
let fallbackNoticed = false;

const VOICE_IDS = ['af_heart', 'af_bella', 'am_michael', 'bf_emma', 'bm_george', 'browser'];
const voiceName = () => (VOICE_IDS.includes(P.settings?.voice) ? P.settings.voice : 'af_heart');

// Short pieces start playing sooner: the first sentence plays while the next one is generated.
const splitSentences = (text) => String(text).match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) || [];

function fetchVoice(sentence, urgent = false) {
  const key = `${voiceName()}|${sentence}`;
  const hit = audioCache.get(key);
  // a pending background request is re-sent as urgent so the server moves it to the front
  if (hit && (hit.done || hit.urgent || !urgent)) return hit.url;
  const entry = { urgent };
  entry.url = fetch('/api/tts', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: sentence, voice: voiceName(), urgent }),
  }).then(async (res) => {
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'tts failed');
    entry.done = true;
    return URL.createObjectURL(await res.blob());
  });
  entry.url.catch(() => audioCache.delete(key)); // let a later click retry
  audioCache.set(key, entry);
  return entry.url;
}

// Generate upcoming sentences in the background so they play instantly.
function prefetch(texts) {
  if (voiceName() === 'browser') return;
  prefetchQueue.push(...texts.filter(Boolean).flatMap(splitSentences));
  pumpPrefetch();
}
function pumpPrefetch() {
  while (prefetching < 2 && prefetchQueue.length) {
    prefetching++;
    fetchVoice(prefetchQueue.shift()).catch(() => {}).finally(() => { prefetching--; pumpPrefetch(); });
  }
}

function stopSpeaking() {
  speakToken++;
  player?.pause();
  window.speechSynthesis?.cancel();
}

function playUrl(url) {
  return new Promise((resolve, reject) => {
    player = new Audio(url);
    player.playbackRate = Number(P.settings?.rate) || 0.9;
    player.onended = resolve;
    player.onerror = () => reject(new Error('audio error'));
    player.play().catch(reject);
  });
}

async function speak(text) {
  if (!text) return;
  stopSpeaking();
  const token = speakToken;
  if (voiceName() !== 'browser') {
    const loading = setTimeout(() => token === speakToken && setStatus('🔊 מכין את הקול...'), 600);
    try {
      // request every sentence now (generated in order), play each as soon as it is ready
      const urls = splitSentences(text).map((s) => fetchVoice(s, true));
      for (const url of urls) {
        const ready = await url;
        clearTimeout(loading);
        if (statusEl.textContent.startsWith('🔊')) setStatus('');
        if (token !== speakToken) return;
        await playUrl(ready);
        if (token !== speakToken) return;
      }
      return;
    } catch (e) {
      if (token !== speakToken || e.name === 'NotAllowedError' || e.name === 'AbortError') return;
      if (!fallbackNoticed) {
        fallbackNoticed = true;
        setStatus('הקול הטבעי לא זמין כרגע, עובר לקול של הדפדפן', true);
      }
    } finally {
      clearTimeout(loading);
      if (statusEl.textContent.startsWith('🔊')) setStatus('');
    }
  }
  browserSpeak(text);
}

function browserSpeak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = Number(P.settings?.rate) || 0.9;
  const voice = voices.find((v) => v.lang === 'en-US' && /natural|online|google/i.test(v.name))
    || voices.find((v) => v.lang.startsWith('en'));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

function speakBtn(text, size = '') {
  return h('button', {
    type: 'button', class: `icon-btn ${size}`, title: 'להשמיע', 'aria-label': `להשמיע: ${text}`, onclick: () => speak(text),
  }, icon('volume', size === 'lg' ? 28 : size === 'sm' ? 18 : 20));
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

// Tap to start, tap again to finish — only the learner ends the recording. A beginner pauses to
// think mid-sentence; silence timers cut them off. Chrome also ends a session on its own after a
// pause, so it is restarted and the text so far is kept.
const MAX_RECORDING_MS = 2 * 60 * 1000;
let activeRec = null; // { stop() } for the recording in progress

function listen(lang, btnEl) {
  return new Promise((resolve, reject) => {
    if (!SR) return reject(new Error('דיבור למיקרופון עובד רק ב-Chrome או Edge. אפשר להקליד במקום.'));
    stopSpeaking();
    let finished = false;
    let finalText = '';
    let interim = '';
    let failed = null;
    let rec = null;
    const prompt = lang === 'he-IL' ? 'דבר בעברית' : 'דבר באנגלית';
    const show = () => setStatus(`🎤 ${(finalText + interim).trim() || `מקשיב... ${prompt}`} …  (לחץ שוב כשסיימת)`);

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(maxTimer);
      activeRec = null;
      btnEl?.classList.remove('listening');
      setStatus('');
      const text = (finalText + interim).replace(/\s+/g, ' ').trim();
      if (text) return resolve(text);
      reject(new Error(failed === 'not-allowed' ? 'צריך לאשר גישה למיקרופון בדפדפן'
        : failed ? `שגיאת מיקרופון: ${failed}` : 'לא שמעתי כלום, נסה שוב'));
    };

    const startSession = () => {
      rec = new SR();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e) => {
        interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += `${e.results[i][0].transcript} `;
          else interim += e.results[i][0].transcript;
        }
        show();
      };
      rec.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') failed = e.error; };
      rec.onend = () => {
        if (finished) return;
        // ended by the browser, not by the learner: keep what was said and listen on
        finalText += interim ? `${interim} ` : '';
        interim = '';
        if (activeRec?.stopping || failed) return finish();
        try { startSession(); } catch { finish(); }
      };
      rec.start();
    };

    activeRec = { stopping: false, stop() { this.stopping = true; rec?.stop(); }, abort() { finished = true; clearTimeout(maxTimer); rec?.abort(); } };
    const maxTimer = setTimeout(() => activeRec?.stop(), MAX_RECORDING_MS);
    btnEl?.classList.add('listening');
    show();
    startSession();
  });
}

// Mic button handler: the first tap starts listening, a second tap finishes.
async function voiceInput(lang, btnEl, onText) {
  if (activeRec) { activeRec.stop(); return; }
  try {
    onText(await listen(lang, btnEl));
  } catch (e) {
    setStatus(`⚠️ ${e.message}`, true);
  }
}

let recorder = null;

function pronounceBtn(target, onResult, size = '') {
  const b = h('button', { type: 'button', class: `icon-btn ${size}`, title: 'חזור אחריי: בדיקת הגייה', 'aria-label': 'בדיקת הגייה' }, icon('mic', size === 'sm' ? 18 : 20));
  b.onclick = () => toggleRecord(target, b, onResult);
  return b;
}

async function toggleRecord(target, b, onResult) {
  if (recorder) { recorder.stop(); return; }
  if (!window.MediaRecorder || !navigator.mediaDevices) return setStatus('הקלטה עובדת רק ב-Chrome או Edge', true);
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return setStatus('⚠️ צריך לאשר גישה למיקרופון בדפדפן', true);
  }
  stopSpeaking();
  const chunks = [];
  const rec = new MediaRecorder(stream);
  recorder = rec;
  const idle = b.firstChild;
  rec.ondataavailable = (e) => chunks.push(e.data);
  const timer = setTimeout(() => rec.state === 'recording' && rec.stop(), 15000);
  rec.onstop = async () => {
    clearTimeout(timer);
    stream.getTracks().forEach((t) => t.stop());
    recorder = null;
    b.classList.remove('recording');
    b.replaceChildren(idle);
    setStatus('בודק את ההגייה... ⏳');
    try {
      const audio = await toWavBase64(new Blob(chunks, { type: chunks[0]?.type }));
      onResult(pronunciationCard(await api('/api/pronounce', { audio, mimeType: 'audio/wav', target }), target));
      setStatus('');
    } catch (e) {
      setStatus(`⚠️ ${e.message === 'EncodingError' || /decode/i.test(e.message) ? 'ההקלטה קצרה מדי, נסה שוב' : e.message}`, true);
    }
  };
  b.classList.add('recording');
  b.replaceChildren(icon('stop', 16));
  setStatus(target ? `🔴 מקליט... תגיד: "${target}" ולחץ שוב לסיום` : '🔴 מקליט... לחץ שוב לסיום');
  rec.start();
}

// Gemini accepts WAV; Chrome records webm, so convert to 16kHz mono 16-bit WAV.
async function toWavBase64(blob) {
  const ctx = new AudioContext();
  const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
  ctx.close();
  const rate = 16000;
  const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * rate), rate);
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination);
  src.start();
  const pcm = (await off.startRendering()).getChannelData(0);
  const v = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + pcm.length * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, pcm.length * 2, true);
  pcm.forEach((s, i) => v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s)) * 0x7fff, true));
  const bytes = new Uint8Array(v.buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function pronunciationCard(r) {
  const score = Number(r.score) || 0;
  const color = score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warn)' : 'var(--danger)';
  const title = r.speech_detected === false ? 'לא שמעתי דיבור' : score >= 80 ? 'מצוין!' : score >= 50 ? 'כמעט שם' : 'בוא ננסה שוב';
  return h('div', { class: 'card pron' },
    h('div', { class: 'pron-head' },
      h('div', { class: 'ring', style: `--p:${score};--c:${color}`, role: 'img', 'aria-label': `ציון ${score} מתוך 100` }, h('b', {}, score)),
      h('div', {}, h('div', { class: 'eyebrow' }, 'בדיקת הגייה'), h('div', { class: 'pron-title' }, title))),
    r.heard && h('div', { class: 'pron-heard' }, h('span', { class: 'muted' }, 'מה ששמעתי: '), h('span', { class: 'en' }, r.heard)),
    (r.issues || []).map((x) => h('div', { class: 'issue' },
      speakBtn(x.word, 'sm'),
      h('div', { class: 'grow' }, h('b', { class: 'en' }, x.word), h('div', { class: 'muted' }, x.tip_he)))),
    r.summary_he && h('p', { class: 'small' }, r.summary_he));
}

// Voice first (like Speak/Duolingo): a big mic, typing is the secondary path.
// confirmVoice: show what was heard and wait for "send" (open answers that get graded once).
function answerInput({ onSubmit, placeholder = 'כתוב באנגלית...', micLabel = 'לחץ, דבר, ולחץ שוב כשסיימת', confirmVoice = false, submitLabel = 'בדוק' }) {
  const input = h('input', { type: 'text', class: 'text-input', placeholder, dir: 'ltr', autocomplete: 'off', 'aria-label': 'התשובה שלך' });
  const heardNote = h('p', { class: 'muted small', hidden: true }, 'זה מה ששמעתי. אפשר לתקן, ואז ללחוץ על "שלח". או להקליט שוב.');
  const form = h('form', {
    class: 'type-row', hidden: !!SR,
    onsubmit: (e) => { e.preventDefault(); if (input.value.trim()) onSubmit(input.value.trim()); },
  }, input, h('button', { type: 'submit', class: 'btn btn-primary btn-sm' }, submitLabel));
  const mic = h('button', { type: 'button', class: 'mic-big', 'aria-label': micLabel, disabled: !SR }, icon('mic', 32));
  mic.onclick = () => voiceInput('en-US', mic, (text) => {
    input.value = text;
    if (!confirmVoice) return onSubmit(text);
    form.hidden = false;
    heardNote.hidden = false;
  });
  const toggleText = h('span', {}, 'להקליד במקום');
  const toggle = h('button', { type: 'button', class: 'btn btn-ghost', hidden: !SR }, icon('keyboard', 18), toggleText);
  toggle.onclick = () => {
    form.hidden = !form.hidden;
    toggleText.textContent = form.hidden ? 'להקליד במקום' : 'להסתיר מקלדת';
    if (!form.hidden) input.focus();
  };
  return h('div', { class: 'answer-box' }, SR && mic, SR && h('div', { class: 'mic-label' }, micLabel), toggle, heardNote, form);
}

function focusTop({ onClose, progress, label }) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return h('div', { class: 'focus-top' },
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'יציאה', onclick: onClose }, icon('x')),
    h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct) },
      h('span', { style: `width:${Math.max(3, pct)}%` })),
    label && h('span', { class: 'focus-label' }, label));
}

const dock = (...kids) => h('div', { class: 'dock' }, ...kids);
const dockRow = (...kids) => h('div', { class: 'dock-row' }, ...kids);

function sheet(kind, title, ...kids) {
  return h('div', { class: `sheet ${kind}`, role: 'status' },
    h('div', { class: 'sheet-title' }, icon(kind === 'ok' ? 'checkCircle' : kind === 'bad' ? 'xCircle' : 'eye', 24), title), ...kids);
}

function answerLine(text, pronSlot) {
  return h('div', { class: 'answer-line' },
    speakBtn(text, 'sm'),
    pronSlot && pronounceBtn(text, (c) => pronSlot.replaceChildren(c), 'sm'),
    h('span', { class: 'en' }, text));
}

// Bottom tabs are hidden while a lesson/review/placement is running (focus mode).
const TABS = [['home', 'בית', 'home'], ['review', 'חזרה', 'repeat'], ['talk', 'שיחה', 'chat'], ['settings', 'הגדרות', 'settings']];
function setChrome(tab) {
  document.body.classList.toggle('focus', !tab);
  for (const a of tabbar.querySelectorAll('.tab')) {
    const on = a.dataset.tab === tab;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  const due = dueKeys(P.review, today()).length;
  const badge = tabbar.querySelector('.badge');
  if (badge) { badge.textContent = due > 99 ? '99+' : String(due); badge.hidden = !due; }
}

// ---------- Conversation with the AI tutor (lesson mission or free talk) ----------

function createChat({ mode, unit, onFinish }) {
  const opener = mode === 'mission' ? unit.mission.opener_en : FREE_TALK.opener_en;
  const history = [{ role: 'bot', text: opener }];
  let hint = mode === 'mission' ? unit.mission.hint_en : FREE_TALK.hint_en;
  let busy = false;
  let doneShown = false;

  const list = h('div', { class: 'chat', 'aria-live': 'polite' });
  const input = h('input', { type: 'text', class: 'text-input', placeholder: 'כתוב בעברית או באנגלית...', autocomplete: 'off', dir: 'auto', 'aria-label': 'הודעה' });
  const form = h('form', { class: 'type-row', hidden: !!SR }, input, h('button', { type: 'submit', class: 'icon-btn lg', 'aria-label': 'שלח' }, icon('send', 22)));
  const micEn = h('button', { type: 'button', class: 'mic-big small', 'aria-label': 'לדבר באנגלית', disabled: !SR }, icon('mic', 28));
  const hintBtn = h('button', { type: 'button', class: 'side-btn' }, icon('bulb', 20), 'רמז');
  const kbBtn = h('button', { type: 'button', class: 'side-btn' }, icon('keyboard', 20), 'מקלדת');
  const heBtn = h('button', { type: 'button' }, 'דבר בעברית');
  const composer = h('div', { class: 'composer' },
    SR && h('div', { class: 'composer-main' }, hintBtn, micEn, kbBtn),
    SR && h('div', { class: 'mic-label' }, 'לחץ, דבר באנגלית, ולחץ שוב כשסיימת · או ', heBtn),
    form,
    !SR && h('div', { class: 'helpers' }, hintBtn));
  const el = h('div', { class: 'chat-wrap screen-body', style: 'padding-bottom:0' }, list, composer);

  const scroll = () => list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const add = (node) => { list.append(node); scroll(); return node; };
  const tutorMsg = (...kids) => h('div', { class: 'msg tutor' }, h('div', { class: 'avatar' }, icon('sparkle', 16)), h('div', { class: 'bubble' }, ...kids));

  function enRow(text, tag = 'p') {
    return h('div', { class: 'en-row' },
      h(tag, { class: 'en' }, text),
      h('div', { class: 'row-actions' }, speakBtn(text, 'sm'), pronounceBtn(text, add, 'sm')));
  }

  function addBot(r) {
    add(tutorMsg(
      r.say_it && h('div', { class: 'block say' }, h('div', { class: 'label' }, 'ככה אומרים את זה באנגלית'), enRow(r.say_it)),
      r.correction && h('div', { class: 'block fix' }, h('div', { class: 'label' }, 'תיקון קטן'), enRow(r.correction)),
      enRow(r.reply_en),
      r.hebrew_help && h('div', { class: 'he-help' }, icon('bulb', 16), h('span', {}, r.hebrew_help)),
      r.new_words?.length && h('div', { class: 'words' }, r.new_words.map((w) => h('span', { class: 'word-chip' }, h('span', { class: 'en' }, w.en), ` · ${w.he}`)))));
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    const bubble = add(h('div', { class: 'msg user' }, h('div', { class: 'bubble', dir: 'auto' }, text)));
    const typing = add(h('div', { class: 'msg tutor typing', 'aria-label': 'המורה כותב' }, h('div', { class: 'avatar' }, icon('sparkle', 16)), h('div', { class: 'bubble' }, h('i'), h('i'), h('i'))));
    history.push({ role: 'user', text });
    try {
      const data = await api('/api/chat', { messages: history, mode, unitId: unit?.id });
      typing.remove();
      history.push({ role: 'bot', text: data.reply_en });
      hint = data.hint_en || hint;
      addBot(data);
      speak(data.reply_en);
      const day = today();
      if (data.correction) P.mistakes = [...(P.mistakes || []), { said: text, fixed: data.correction, day }].slice(-30);
      for (const w of data.new_words || []) addReviewItem(P.review, { en: w.en, he: w.he, type: 'word' }, day);
      P.streak = bumpStreak(P.streak, day);
      save();
      if (data.mission_done && !doneShown && onFinish) {
        doneShown = true;
        add(h('div', { class: 'card done-card' },
          icon('trophy', 28), h('b', {}, 'השלמת את המשימה!'),
          h('span', { class: 'small' }, 'אפשר להמשיך לדבר, או לסיים את השיעור.'),
          btn('btn-success btn-block', 'לסיכום השיעור', onFinish)));
      }
    } catch (e) {
      typing.remove();
      history.pop();
      bubble.remove();
      input.value = text;
      form.hidden = false;
      setStatus(`⚠️ ${e.message}`, true);
    } finally {
      busy = false;
    }
  }

  form.onsubmit = (e) => { e.preventDefault(); const t = input.value; input.value = ''; send(t); };
  micEn.onclick = () => voiceInput('en-US', micEn, send);
  heBtn.onclick = () => voiceInput('he-IL', micEn, send);
  kbBtn.onclick = () => { form.hidden = !form.hidden; if (!form.hidden) input.focus(); };
  hintBtn.onclick = () => add(tutorMsg(h('div', { class: 'label eyebrow' }, 'רמז: אפשר להגיד'), enRow(hint)));

  addBot({
    reply_en: opener,
    hebrew_help: mode === 'free' ? 'אפשר לדבר איתי על כל נושא, בעברית או באנגלית. נתקעת? לחץ על "רמז".' : '',
  });
  speak(opener);
  return { el };
}

// ---------- Home ----------

const DAY_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

function weekStrip(day) {
  const active = new Set();
  if (currentStreak(P.streak, day)) for (let k = 0; k < P.streak.count; k++) active.add(addDays(P.streak.lastDay, -k));
  const days = Array.from({ length: 7 }, (_, i) => addDays(day, i - 6));
  return h('div', { class: 'card week', 'aria-label': 'הפעילות השבוע' }, days.map((d) => {
    const [y, m, dd] = d.split('-').map(Number);
    return h('div', { class: `day${active.has(d) ? ' on' : ''}${d === day ? ' today' : ''}` },
      h('span', { class: 'dot' }, icon('flame', 18)), DAY_LETTERS[new Date(y, m - 1, dd).getDay()]);
  }));
}

function renderHome() {
  setChrome('home');
  const day = today();
  const due = dueKeys(P.review, day).length;
  const nextIdx = UNITS.findIndex((u, i) => !P.units[u.id]?.completed && isUnlocked(i));
  const doneCount = UNITS.filter((u) => P.units[u.id]?.completed).length;
  const streak = currentStreak(P.streak, day);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';
  const level = P.profile.level;

  let hero;
  if (!P.profile.placementDone) {
    hero = h('section', { class: 'hero' },
      h('span', { class: 'eyebrow' }, 'צעד ראשון · כ-5 דקות'),
      h('h2', {}, 'בוא נכיר ונמצא את הרמה שלך'),
      h('p', {}, 'כמה מילים ומשפט קצר בדיבור. אין ציון ואין "נכשלת".'),
      btn('btn-block', 'להתחיל', () => go('#/placement')));
  } else if (nextIdx >= 0) {
    const u = UNITS[nextIdx];
    hero = h('section', { class: 'hero' },
      h('span', { class: 'eyebrow' }, `השיעור הבא · ${nextIdx + 1} מתוך ${UNITS.length}`),
      h('h2', {}, u.title_he),
      h('p', {}, `בסוף תוכל ${u.goal_he}.`),
      h('div', { class: 'meta' }, h('span', {}, 'כ-15 דק׳'), h('span', {}, `${u.words.length} מילים`), h('span', {}, 'שיחה עם המורה')),
      btn('btn-block', doneCount ? 'המשך ללמוד' : 'התחל שיעור', () => go(`#/unit/${u.id}`)));
  } else {
    hero = h('section', { class: 'hero done' },
      h('span', { class: 'eyebrow' }, 'רמה A1 הושלמה'),
      h('h2', {}, 'סיימת את כל 10 השיעורים! 🎉'),
      h('p', {}, 'המשך עם חזרה יומית ושיחה חופשית. השלב הבא בדרך.'),
      btn('btn-block', 'לשיחה חופשית', () => go('#/talk')));
  }

  mount(h('section', { class: 'screen-body' },
    h('header', { class: 'home-top' },
      h('div', {}, h('div', { class: 'eyebrow' }, greeting), h('h1', {}, 'מה לומדים היום?')),
      h('div', { class: 'pills' },
        h('span', { class: 'pill flame', title: 'ימים ברצף' }, icon('flame', 18), streak),
        level && h('span', { class: 'pill', title: LEVEL_HE[level] }, level))),
    weekStrip(day),
    hero,
    P.profile.placementDone && due > 0 && h('a', { class: 'card card-tight link-card', href: '#/review' },
      h('span', { class: 'tile-icon orange' }, icon('repeat')),
      h('span', { class: 'grow' }, h('b', {}, 'חזרה יומית'), h('span', { class: 'muted small' }, `${due} מילים ומשפטים · כ-${Math.max(2, Math.ceil(due / 4))} דק׳`)),
      h('span', { class: 'go' }, 'התחל')),
    h('div', { class: 'section-head' }, h('h2', {}, 'המסלול שלך'), h('span', { class: 'muted small' }, `רמה A1 · ${doneCount}/${UNITS.length}`)),
    h('ol', { class: 'path' }, UNITS.map((u, i) => {
      const done = P.units[u.id]?.completed;
      const open = isUnlocked(i);
      const current = i === nextIdx && P.profile.placementDone;
      const state = done ? 'done' : current ? 'current' : open ? 'open' : 'locked';
      const inner = [
        h('span', { class: 't' }, h('b', {}, u.title_he), h('small', {}, u.goal_he)),
        current ? h('span', { class: 'go' }, 'התחל') : !open ? icon('lock', 18) : null,
      ];
      return h('li', { class: state },
        h('span', { class: 'node' }, done ? icon('check', 20) : i + 1),
        open ? h('a', { class: 'step', href: `#/unit/${u.id}` }, inner) : h('span', { class: 'step', 'aria-disabled': 'true', title: 'נפתח אחרי השיעור הקודם' }, inner));
    })),
    h('a', { class: 'card card-tight link-card', href: '#/talk' },
      h('span', { class: 'tile-icon blue' }, icon('chat')),
      h('span', { class: 'grow' }, h('b', {}, 'שיחה חופשית'), h('span', { class: 'muted small' }, 'מדברים על מה שבא לך. המורה מתקן ועוזר.')),
      h('span', { class: 'chev' }, icon('chevron', 20)))));
}

// ---------- Placement ----------

const GOALS = ['טיולים בחו"ל', 'עבודה', 'לימודים', 'סרטים וסדרות', 'שיחות עם אנשים', 'ביטחון עצמי'];
const LEVEL_EXPLAIN = {
  A0: 'מתחילים מהבסיס: מילים ומשפטים ראשונים. המורה ידבר איתך לאט ויסביר הכול בעברית.',
  A1: 'אתה מכיר מילים בסיסיות. נבנה מהן משפטים ושיחות קצרות.',
  A2: 'יש לך בסיס טוב. עכשיו בעיקר צריך לדבר, הרבה.',
  B1: 'אתה מסתדר. נעבוד על שטף ועל דיוק.',
  B2: 'רמה גבוהה. נעבוד על דיוק וביטחון.',
};

function renderPlacement() {
  setChrome(null);
  const items = ['A1', 'A2', 'B1']
    .flatMap((band) => shuffle(PLACEMENT_WORDS.filter((w) => w.band === band)))
    .map((w) => ({ ...w, options: shuffle([w.he, ...shuffle(PLACEMENT_WORDS.filter((x) => x !== w)).slice(0, 3).map((x) => x.he)]) }));
  const S = { step: 'goals', goals: new Set(P.profile.goals || []), i: 0, results: [], result: null };
  prefetch([...items.map((w) => w.en), 'Tell me about yourself.']);
  const total = items.length + 2;
  const progress = () => (S.step === 'goals' ? 0 : S.step === 'vocab' ? (1 + S.i) / total : S.step === 'result' ? 1 : (total - 1) / total);
  const draw = () => {
    const [content, actions = []] = view();
    mount(S.step !== 'result' && focusTop({ onClose: () => go('#/home'), progress: progress() }),
      h('section', { class: 'screen-body' }, content), actions.length > 0 && dock(actions));
    window.scrollTo(0, 0);
  };

  function finish(vocab, speaking, feedback) {
    const level = finalLevel(vocab, speaking);
    P.profile = {
      ...P.profile, placementDone: true, level, vocabLevel: vocab, speakLevel: speaking,
      goals: [...S.goals], unlockAll: LEVELS.indexOf(level) >= 2, placedOn: today(),
    };
    save();
    S.result = { level, feedback };
    S.step = 'result';
    draw();
  }

  async function submitSpeaking(text) {
    S.answer = text;
    const vocab = vocabLevel(S.results);
    S.step = 'checking';
    draw();
    try {
      const r = await api('/api/placement', { answer: text });
      finish(vocab, r.level, r.feedback_he);
    } catch (e) {
      setStatus(`⚠️ ${e.message}`, true);
      finish(vocab, 'A1', 'לא הצלחתי לבדוק את הדיבור כרגע, אז קבעתי רמה לפי המילים. אפשר לעשות את האבחון שוב מאוחר יותר.');
    }
  }

  function view() {
    if (S.step === 'goals') {
      return [[
        h('div', { class: 'eyebrow' }, 'בוא נכיר'),
        h('h1', {}, 'בשביל מה אתה רוצה אנגלית?'),
        h('p', { class: 'muted' }, 'אפשר לבחור כמה. המורה ישתמש בזה כדי להתאים לך את השיחות.'),
        h('div', { class: 'goal-grid' }, GOALS.map((g) => h('button', {
          type: 'button', class: `goal-opt${S.goals.has(g) ? ' on' : ''}`, 'aria-pressed': String(S.goals.has(g)),
          onclick: () => { S.goals.has(g) ? S.goals.delete(g) : S.goals.add(g); draw(); },
        }, g, h('span', { class: 'check' }, icon('check', 14))))),
      ], [
        btn('btn-primary btn-block', 'המשך', () => { S.step = 'vocab'; draw(); }),
        btn('btn-ghost', 'אני מתחיל מאפס, דלג', () => finish('A0', 'A0', 'מתחילים מאפס, וזה בדיוק המקום הנכון. נלך צעד אחרי צעד.')),
      ]];
    }
    if (S.step === 'vocab') {
      const it = items[S.i];
      const answer = (correct) => {
        S.results.push({ band: it.band, correct });
        if (S.i < items.length - 1) S.i++;
        else S.step = 'speak';
        draw();
      };
      return [[
        h('div', { class: 'eyebrow' }, `מילה ${S.i + 1} מתוך ${items.length}`),
        h('h1', {}, 'מה פירוש המילה?'),
        h('div', { class: 'card word-card' }, speakBtn(it.en, 'lg'), h('div', { class: 'word en' }, it.en)),
        h('div', { class: 'options' },
          it.options.map((o) => h('button', { type: 'button', class: 'option', onclick: () => answer(o === it.he) }, o)),
          h('button', { type: 'button', class: 'option dont-know', onclick: () => answer(false) }, 'לא יודע, וזה בסדר')),
      ]];
    }
    if (S.step === 'speak') {
      return [[
        h('div', { class: 'eyebrow' }, 'כמעט סיימנו'),
        h('h1', {}, 'ספר קצת על עצמך באנגלית'),
        h('p', { class: 'muted' }, 'איך קוראים לך, מאיפה אתה, מה אתה עושה. גם משפט אחד זה מצוין.'),
        h('div', { class: 'card card-tight' }, answerLine('Tell me about yourself.')),
        answerInput({ onSubmit: submitSpeaking, placeholder: 'My name is...', confirmVoice: true, submitLabel: 'שלח' }),
      ], [btn('btn-ghost', 'אני עוד לא יכול, דלג', () => submitSpeaking(''))]];
    }
    if (S.step === 'checking') {
      return [[h('div', { class: 'center-screen' }, h('span', { class: 'spinner' }), h('p', { class: 'muted' }, 'בודק את הרמה שלך...'))]];
    }
    const { level, feedback } = S.result;
    return [[
      h('div', { class: 'center-screen' },
        h('div', { class: 'result-badge level' }, level),
        h('div', { class: 'eyebrow' }, 'הרמה שלך'),
        h('h1', {}, LEVEL_HE[level]),
        h('p', { class: 'muted' }, LEVEL_EXPLAIN[level])),
      feedback && h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' },
        S.answer && h('div', {}, h('div', { class: 'eyebrow' }, 'מה שאמרת'), h('p', { class: 'en', style: 'text-align:left' }, `"${S.answer}"`)),
        h('p', { class: 'quote' }, feedback)),
      h('div', { class: 'card goal' },
        h('span', { class: 'tile-icon blue' }, icon('compass')),
        h('div', {}, h('b', {}, 'מה עכשיו?'), h('p', { class: 'muted small' }, P.profile.unlockAll
          ? 'אתה כבר מעבר לבסיס של A1, אז כל השיעורים פתוחים לך. כדאי לעבור עליהם מהר כחזרה.'
          : 'מתחילים משיעור 1. כל שיעור כ-15 דקות, ובסופו נפתח הבא. הכי חשוב: קצת כל יום.'))),
    ], [btn('btn-primary btn-block', 'בוא נתחיל', () => go('#/home'))]];
  }

  draw();
}

// ---------- Lesson ----------

const STEPS = ['intro', 'words', 'phrases', 'quiz', 'practice', 'mission', 'summary'];

function buildQuiz(unit) {
  const meaning = shuffle(unit.words).slice(0, 5).map((w) => ({
    kind: 'meaning', prompt: w.he, answer: w.en, en: w.en,
    options: shuffle([w.en, ...shuffle(unit.words.filter((x) => x !== w)).slice(0, 3).map((x) => x.en)]),
  }));
  const listening = shuffle(unit.phrases).slice(0, 3).map((p) => ({
    kind: 'listen', answer: p.he, en: p.en,
    options: shuffle([p.he, ...shuffle(unit.phrases.filter((x) => x !== p)).slice(0, 3).map((x) => x.he)]),
  }));
  return shuffle([...meaning, ...listening]);
}

function renderUnit(id) {
  setChrome(null);
  const idx = UNITS.findIndex((u) => u.id === id);
  const unit = UNITS[idx];
  if (!unit || !isUnlocked(idx)) { go('#/home'); return; }

  const L = { step: 0, i: 0, quiz: buildQuiz(unit), quizRight: 0, practiceRight: 0, answered: null, result: null, tried: false, hint: false, missed: new Set(), missionDone: false, chat: null, saved: false };
  prefetch([
    ...unit.words.flatMap((w) => [w.en, w.ex_en]), ...unit.phrases.map((p) => p.en),
    ...unit.practice.map((p) => p.en), unit.mission.opener_en,
  ]);
  const counts = { words: unit.words.length, phrases: unit.phrases.length, quiz: L.quiz.length, practice: unit.practice.length };
  const stepName = () => STEPS[L.step];
  const progress = () => (L.step + (counts[stepName()] ? L.i / counts[stepName()] : 0)) / (STEPS.length - 1);

  const close = () => {
    if (L.step > 0 && stepName() !== 'summary' && !confirm('לצאת מהשיעור? ההתקדמות בשיעור הזה לא תישמר.')) return;
    go('#/home');
  };
  const draw = () => {
    const [content, actions = []] = body();
    mount(stepName() !== 'summary' && focusTop({ onClose: close, progress: progress(), label: counts[stepName()] ? `${L.i + 1}/${counts[stepName()]}` : '' }),
      h('section', { class: 'screen-body', style: stepName() === 'mission' ? 'padding-bottom:0' : null }, content),
      actions.length > 0 && dock(actions));
  };
  const next = () => { Object.assign(L, { step: L.step + 1, i: 0, answered: null, result: null, tried: false, hint: false }); draw(); window.scrollTo(0, 0); };
  const advance = (count) => { if (L.i < count - 1) { L.i++; draw(); window.scrollTo(0, 0); } else next(); };

  function intro() {
    const part = (ic, color, text) => h('li', {}, h('span', { class: `tile-icon ${color}` }, icon(ic, 20)), h('span', {}, text));
    return [[
      h('div', { class: 'center-screen', style: 'padding-bottom:0' },
        h('div', { class: 'intro-badge' }, icon('book', 38)),
        h('div', { class: 'eyebrow' }, `שיעור ${idx + 1} · רמה A1`),
        h('h1', {}, unit.title_he),
        h('p', { class: 'muted en' }, unit.title_en)),
      h('div', { class: 'card goal' },
        h('span', { class: 'tile-icon green' }, icon('target')),
        h('div', {}, h('b', {}, 'בסוף השיעור תוכל'), h('p', { class: 'muted' }, `${unit.goal_he}.`))),
      h('div', { class: 'card' }, h('ul', { class: 'parts' },
        part('book', 'blue', `${unit.words.length} מילים חדשות עם דוגמאות`),
        part('chat', 'blue', `${unit.phrases.length} משפטים מוכנים לשימוש`),
        part('volume', 'blue', 'בדיקה קצרה, כולל הבנה בשמיעה'),
        part('mic', 'orange', 'תרגול: להגיד בעצמך באנגלית'),
        part('sparkle', 'green', 'משימה: שיחה אמיתית עם המורה'))),
    ], [btn('btn-primary btn-block', 'בוא נתחיל', next)]];
  }

  function cards(items, isWords) {
    const it = items[L.i];
    const pron = h('div');
    setTimeout(() => speak(it.en), 150);
    return [[
      h('div', { class: 'eyebrow' }, isWords ? 'מילה חדשה' : 'משפט שימושי'),
      h('div', { class: 'card word-card' },
        speakBtn(it.en, 'lg'),
        h('div', { class: `${isWords ? 'word' : 'phrase'} en` }, it.en),
        h('div', { class: 'translation' }, it.he),
        isWords && h('div', { class: 'example' },
          speakBtn(it.ex_en, 'sm'),
          h('div', { class: 'grow' }, h('div', { class: 'en' }, it.ex_en), h('div', {}, it.ex_he)))),
      h('div', { class: 'repeat-row' },
        pronounceBtn(it.en, (c) => pron.replaceChildren(c)),
        h('div', {}, h('b', {}, 'חזור אחריי בקול'), h('div', { class: 'muted small' }, 'לחץ, תגיד, ולחץ שוב. תקבל ציון וטיפים.'))),
      pron,
    ], [dockRow(
      L.i > 0 && h('button', { type: 'button', class: 'icon-btn lg', 'aria-label': 'הקודם', onclick: () => { L.i--; draw(); } }, icon('back', 24)),
      btn('btn-primary', L.i < items.length - 1 ? 'המשך' : 'סיימתי, הלאה', () => advance(items.length)))]];
  }

  function quiz() {
    const q = L.quiz[L.i];
    const listenQ = q.kind === 'listen';
    if (listenQ && !L.answered) setTimeout(() => speak(q.en), 200);
    const right = L.answered === q.answer;
    return [[
      h('div', { class: 'eyebrow' }, 'בדיקה'),
      h('h1', {}, listenQ ? 'מה פירוש מה ששמעת?' : 'איך אומרים את זה באנגלית?'),
      listenQ
        ? h('div', { class: 'card word-card' }, h('button', { type: 'button', class: 'mic-big', 'aria-label': 'השמע שוב', onclick: () => speak(q.en) }, icon('volume', 34)), h('div', { class: 'muted small' }, 'לחץ כדי לשמוע שוב'))
        : h('div', { class: 'card prompt-he' }, q.prompt),
      h('div', { class: 'options' }, q.options.map((o) => h('button', {
        type: 'button',
        class: `option${listenQ ? '' : ' en'}${L.answered ? (o === q.answer ? ' right' : o === L.answered ? ' wrong' : ' faded') : ''}`,
        disabled: !!L.answered,
        onclick: () => {
          L.answered = o;
          if (o === q.answer) L.quizRight++;
          else L.missed.add(q.en);
          draw();
        },
      }, o))),
    ], L.answered ? [
      sheet(right ? 'ok' : 'bad', right ? 'נכון!' : 'לא בדיוק',
        !right && listenQ && h('p', {}, `התשובה הנכונה: ${q.answer}`),
        answerLine(q.en)),
      btn(`${right ? 'btn-success' : 'btn-danger'} btn-block`, 'המשך', () => { L.answered = null; advance(L.quiz.length); }),
    ] : []];
  }

  function practice() {
    const p = unit.practice[L.i];
    const pron = h('div');
    const onSubmit = (text) => {
      const { correct } = checkAnswer(text, [p.en, ...(p.alt || [])]);
      if (!L.tried) {
        L.tried = true;
        if (correct) L.practiceRight++;
        else L.missed.add(p.en);
      }
      L.result = { correct, text };
      draw();
    };
    const r = L.result;
    return [[
      h('div', { class: 'eyebrow' }, 'תרגול דיבור'),
      h('h1', {}, 'איך אומרים את זה באנגלית?'),
      h('div', { class: 'card prompt-he' }, p.he),
      !r && answerInput({ onSubmit }),
      !r && L.hint && h('div', { class: 'hint en' }, hintOf(p.en)),
      !r && h('div', { class: 'helpers' },
        h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => { L.hint = true; draw(); } }, icon('bulb', 18), 'רמז'),
        h('button', {
          type: 'button', class: 'btn btn-ghost',
          onclick: () => {
            if (!L.tried) { L.tried = true; L.missed.add(p.en); }
            L.result = { correct: false, shown: true };
            draw();
          },
        }, icon('eye', 18), 'הראה תשובה')),
      pron,
    ], r ? [
      sheet(r.correct ? 'ok' : r.shown ? 'info' : 'bad', r.correct ? 'מצוין!' : r.shown ? 'התשובה' : 'עוד לא',
        !r.correct && !r.shown && h('p', {}, 'אמרת: ', h('span', { class: 'en' }, `"${r.text}"`)),
        answerLine(p.en, pron),
        !r.correct && h('p', { class: 'small' }, 'שמע, חזור בקול, ונסה שוב.')),
      dockRow(
        !r.correct && btn('btn-secondary', 'לנסות שוב', () => { L.result = null; draw(); }),
        btn(r.correct ? 'btn-success' : 'btn-primary', 'המשך', () => { Object.assign(L, { result: null, tried: false, hint: false }); advance(unit.practice.length); })),
    ] : []];
  }

  function mission() {
    if (!L.chat) L.chat = createChat({ mode: 'mission', unit, onFinish: () => { L.missionDone = true; next(); } });
    return [[
      h('div', { class: 'card card-tight task' },
        h('span', { class: 'tile-icon green' }, icon('target', 20)),
        h('div', { class: 'grow' },
          h('div', { class: 'eyebrow' }, 'המשימה שלך'),
          h('p', {}, unit.mission.task_he),
          h('button', { type: 'button', class: 'btn btn-ghost', style: 'padding:0;min-height:36px', onclick: next }, 'סיימתי, לסיכום'))),
      L.chat.el,
    ]];
  }

  function summary() {
    if (!L.saved) {
      L.saved = true;
      const day = today();
      for (const w of unit.words) addReviewItem(P.review, { en: w.en, he: w.he, type: 'word' }, day);
      for (const p of [...unit.phrases, ...unit.practice]) addReviewItem(P.review, { en: p.en, he: p.he, type: 'phrase' }, day);
      P.units[unit.id] = {
        completed: true, day, quiz: `${L.quizRight}/${L.quiz.length}`,
        practice: `${L.practiceRight}/${unit.practice.length}`, mission: L.missionDone,
      };
      P.streak = bumpStreak(P.streak, day);
      save();
    }
    const nextUnit = UNITS[idx + 1];
    const stat = (ic, value, label) => h('div', { class: 'stat' }, icon(ic, 20), h('b', {}, value), h('small', {}, label));
    return [[
      h('div', { class: 'center-screen', style: 'padding-bottom:0' },
        h('div', { class: 'result-badge success' }, icon('check', 44)),
        h('h1', {}, 'כל הכבוד! סיימת את השיעור'),
        h('p', { class: 'muted' }, `עכשיו אתה יכול ${unit.goal_he}.`)),
      h('div', { class: 'stats' },
        stat('volume', `${L.quizRight}/${L.quiz.length}`, 'בבדיקה'),
        stat('mic', `${L.practiceRight}/${unit.practice.length}`, 'בתרגול'),
        stat('sparkle', L.missionDone ? '✓' : '—', 'משימה')),
      L.missed.size > 0 && h('div', { class: 'card' },
        h('b', {}, 'שווה לחזור על אלה'),
        h('div', { class: 'chips', style: 'margin-top:10px' }, [...L.missed].map((en) => h('button', { type: 'button', class: 'chip', onclick: () => speak(en) }, icon('volume', 16), h('span', { class: 'en' }, en))))),
      h('p', { class: 'muted small' }, 'כל המילים והמשפטים של השיעור נכנסו למחברת החזרה. הם יחזרו אליך מחר, ואחר כך בהפרשים הולכים וגדלים.'),
    ], [
      btn('btn-primary btn-block', 'סיום', () => go('#/home')),
      nextUnit && btn('btn-ghost', 'יש לי כוח, לשיעור הבא', () => go(`#/unit/${nextUnit.id}`)),
    ]];
  }

  const body = () => ({ intro, words: () => cards(unit.words, true), phrases: () => cards(unit.phrases, false), quiz, practice, mission, summary })[stepName()]();
  draw();
}

// ---------- Review ----------

function renderReview() {
  const day = today();
  const R = { queue: dueKeys(P.review, day).slice(0, 20), i: 0, result: null, graded: new Set(), requeued: new Set(), right: 0, finished: false };
  prefetch(R.queue.map((k) => P.review[k].en));

  function grade(key, correct) {
    if (!R.graded.has(key)) {
      R.graded.add(key);
      gradeItem(P.review, key, correct, day);
      if (correct) R.right++;
      save();
    }
    // a missed item comes back once more at the end of this session
    if (!correct && !R.requeued.has(key)) { R.requeued.add(key); R.queue.push(key); }
  }
  const nextCard = () => { R.i++; R.result = null; draw(); window.scrollTo(0, 0); };

  function draw() {
    if (!R.queue.length) {
      setChrome('review');
      const total = Object.keys(P.review).length;
      return mount(h('section', { class: 'screen-body' },
        h('h1', {}, 'חזרה'),
        h('div', { class: 'center-screen' },
          h('div', { class: 'result-badge success' }, icon('check', 44)),
          h('h1', {}, total ? 'אין מה לחזור היום' : 'המחברת עוד ריקה'),
          h('p', { class: 'muted' }, total
            ? `יש לך ${total} מילים ומשפטים במחברת, וכולם עדיין טריים. נתראה מחר.`
            : 'אחרי השיעור הראשון, המילים והמשפטים יחזרו אליך כאן בזמן הנכון.'),
          btn('btn-primary', total ? 'למסך הבית' : 'לשיעור הראשון', () => go('#/home')))));
    }
    setChrome(null);
    if (R.i >= R.queue.length) {
      if (!R.finished) { R.finished = true; P.streak = bumpStreak(P.streak, day); save(); }
      return mount(h('section', { class: 'screen-body' },
        h('div', { class: 'center-screen' },
          h('div', { class: 'result-badge success' }, icon('check', 44)),
          h('h1', {}, 'סיימת את החזרה'),
          h('p', { class: 'muted' }, `חזרת על ${R.graded.size} פריטים וידעת ${R.right} מהם בפעם הראשונה.`),
          h('p', { class: 'muted small' }, 'מה שידעת יחזור בעוד כמה ימים. מה שלא ידעת יחזור כבר מחר.'))),
      dock(btn('btn-primary btn-block', 'למסך הבית', () => go('#/home'))));
    }
    const key = R.queue[R.i];
    const item = P.review[key];
    const pron = h('div');
    const r = R.result;
    const onSubmit = (text) => {
      const { correct } = checkAnswer(text, [item.en]);
      R.result = { correct, text };
      grade(key, correct);
      draw();
    };
    mount(
      focusTop({ onClose: () => go('#/home'), progress: R.i / R.queue.length, label: `${R.i + 1}/${R.queue.length}` }),
      h('section', { class: 'screen-body' },
        h('div', { class: 'eyebrow' }, `חזרה · ${item.type === 'word' ? 'מילה' : 'משפט'}`),
        h('h1', {}, 'איך אומרים את זה באנגלית?'),
        h('div', { class: 'card prompt-he' }, item.he),
        !r && answerInput({ onSubmit }),
        !r && h('div', { class: 'helpers' }, h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => { R.result = { revealed: true }; draw(); } }, icon('eye', 18), 'הצג תשובה')),
        pron),
      r && dock(
        sheet(r.correct ? 'ok' : r.revealed ? 'info' : 'bad', r.correct ? 'נכון!' : r.revealed ? 'התשובה' : 'לא בדיוק',
          !r.correct && !r.revealed && h('p', {}, 'אמרת: ', h('span', { class: 'en' }, `"${r.text}"`)),
          answerLine(item.en, pron)),
        r.revealed
          ? dockRow(btn('btn-success', 'ידעתי', () => { grade(key, true); nextCard(); }), btn('btn-secondary', 'לא ידעתי', () => { grade(key, false); nextCard(); }))
          : btn(`${r.correct ? 'btn-success' : 'btn-danger'} btn-block`, 'המשך', nextCard)));
  }

  draw();
}

// ---------- Free talk, settings, help ----------

function renderTalk() {
  setChrome('talk');
  const chat = createChat({ mode: 'free' });
  mount(h('section', { class: 'screen-body', style: 'padding-bottom:0;gap:12px' },
    h('div', {}, h('h1', {}, 'שיחה חופשית'), h('p', { class: 'muted small' }, 'מדברים על מה שבא לך. תיקונים ומילים חדשות נכנסים למחברת החזרה.')),
    chat.el));
}

const VOICE_OPTIONS = [
  ['af_heart', 'Heart', 'אישה, מבטא אמריקאי. הכי טבעי'],
  ['af_bella', 'Bella', 'אישה, מבטא אמריקאי'],
  ['am_michael', 'Michael', 'גבר, מבטא אמריקאי'],
  ['bf_emma', 'Emma', 'אישה, מבטא בריטי'],
  ['bm_george', 'George', 'גבר, מבטא בריטי'],
  ['browser', 'קול הדפדפן', 'גיבוי. רובוטי'],
];
const RATES = [['0.7', 'איטי מאוד'], ['0.85', 'איטי'], ['0.9', 'רגיל-איטי'], ['1', 'רגיל']];

function renderSettings() {
  setChrome('settings');
  const draw = () => mount(h('section', { class: 'screen-body' },
    h('h1', {}, 'הגדרות'),
    h('h2', {}, 'הקול של המורה'),
    h('div', { class: 'card list', style: 'padding:0' }, VOICE_OPTIONS.map(([id, name, desc]) => h('button', {
      type: 'button', class: `list-row${voiceName() === id ? ' on' : ''}`, role: 'radio', 'aria-checked': String(voiceName() === id),
      onclick: () => {
        P.settings = { ...P.settings, voice: id };
        save();
        draw();
        speak("Hi! I'm your English teacher. Nice to meet you.");
      },
    }, h('span', { class: 'radio' }), h('span', { class: 'grow' }, h('b', { class: 'en' }, name), h('div', { class: 'muted small' }, desc))))),
    h('h2', {}, 'מהירות דיבור'),
    h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': 'מהירות דיבור' }, RATES.map(([v, label]) => h('button', {
      type: 'button', class: String(P.settings?.rate ?? 0.9) === v ? 'on' : '', role: 'radio', 'aria-checked': String(String(P.settings?.rate ?? 0.9) === v),
      onclick: () => { P.settings = { ...P.settings, rate: Number(v) }; save(); draw(); speak('This is my speaking speed.'); },
    }, label))),
    h('h2', {}, 'עוד'),
    h('div', { class: 'card list', style: 'padding:0' },
      h('a', { class: 'list-row', href: '#/help' }, icon('help'), h('span', { class: 'grow' }, 'איך זה עובד'), icon('chevron', 18)),
      h('a', { class: 'list-row', href: '#/placement' }, icon('compass'), h('span', { class: 'grow' }, P.profile.placementDone ? 'לעשות שוב את האבחון' : 'לעשות את האבחון'), icon('chevron', 18)),
      h('button', { type: 'button', class: 'list-row danger-link', onclick: resetProgress }, icon('trash'), h('span', { class: 'grow' }, 'איפוס כל ההתקדמות'))),
  ));
  draw();
}

function resetProgress() {
  if (!confirm('בטוח? כל ההתקדמות, המחברת והרצף יימחקו.')) return;
  P = { ...emptyProgress(), settings: P.settings };
  save();
  go('#/placement');
}

function renderHelp() {
  setChrome('settings');
  const li = (...c) => h('li', {}, ...c);
  const section = (ic, title, ...kids) => h('div', { class: 'card' },
    h('div', { class: 'row', style: 'margin-bottom:10px' }, h('span', { class: 'tile-icon blue' }, icon(ic, 20)), h('h2', {}, title)), ...kids);
  mount(h('section', { class: 'screen-body' },
    h('div', { class: 'row' }, h('a', { class: 'icon-btn', href: '#/settings', 'aria-label': 'חזרה להגדרות' }, icon('back')), h('h1', {}, 'איך זה עובד')),
    section('flame', 'השגרה המומלצת: 15-20 דקות ביום',
      h('ol', { class: 'help-list' },
        li('קודם ', h('b', {}, 'החזרה היומית'), ' (אם יש).'),
        li('אחר כך ', h('b', {}, 'שיעור אחד'), '. עדיף קצת כל יום מהרבה פעם בשבוע.'),
        li('יש עוד כוח? ', h('b', {}, 'שיחה חופשית'), ' עם המורה.'))),
    section('book', 'מה יש בכל שיעור',
      h('ol', { class: 'help-list' },
        li(h('b', {}, 'מילים ומשפטים: '), 'שומעים, חוזרים בקול ובודקים הגייה.'),
        li(h('b', {}, 'בדיקה: '), 'לזהות מילים ולהבין משפטים בשמיעה.'),
        li(h('b', {}, 'תרגול: '), 'רואים משפט בעברית ואומרים אותו באנגלית.'),
        li(h('b', {}, 'משימה: '), 'שיחה אמיתית עם המורה, למשל להזמין בבית קפה.'),
        li(h('b', {}, 'סיכום: '), 'כל מה שלמדת נכנס למחברת החזרה.'))),
    section('mic', 'הכפתורים',
      h('ul', { class: 'help-list' },
        li(h('b', {}, 'רמקול: '), 'משמיע. את הקול והמהירות משנים בהגדרות.'),
        li(h('b', {}, 'מיקרופון קטן: '), 'בדיקת הגייה. לוחצים, אומרים, ולוחצים שוב.'),
        li(h('b', {}, 'מיקרופון גדול: '), 'עונים בדיבור. אפשר גם להקליד.'),
        li(h('b', {}, 'רמז: '), 'כשנתקעים.'))),
    section('repeat', 'איך עובדת החזרה',
      h('p', {}, 'כל מילה ומשפט חוזרים אליך בזמן הנכון: אחרי יום, אחרי 3 ימים, אחרי שבוע, ואחר כך פחות ופחות. אם לא ידעת, הם חוזרים כבר מחר.')),
    section('help', 'חשוב לדעת',
      h('ul', { class: 'help-list' },
        li('המיקרופון עובד ב-Chrome או Edge. בפעם הראשונה צריך לאשר גישה.'),
        li('בדיקת ההגייה נעשית על ידי AI. היא מאמן טוב, לא ציון מדויק.'),
        li('השיחות ובדיקות ההגייה נשלחות ל-Google Gemini. הקול של המורה נוצר אצלך במחשב, וההתקדמות נשמרת רק אצלך.')))));
}

// ---------- Routing ----------

const ROUTES = { home: renderHome, placement: renderPlacement, unit: renderUnit, review: renderReview, talk: renderTalk, settings: renderSettings, help: renderHelp };

function route() {
  stopSpeaking();
  prefetchQueue.length = 0;
  if (activeRec) { activeRec.abort(); activeRec = null; }
  if (recorder) {
    // leaving the screen mid-recording: discard it instead of sending it for a check
    recorder.onstop = null;
    recorder.stream.getTracks().forEach((t) => t.stop());
    recorder.stop();
    recorder = null;
  }
  setStatus('');
  const [, name = 'home', arg] = location.hash.split('/');
  (ROUTES[name] || renderHome)(arg);
  window.scrollTo(0, 0);
}

(async function init() {
  tabbar.replaceChildren(...TABS.map(([id, label, ic]) => h('a', { href: `#/${id}`, class: 'tab', 'data-tab': id },
    icon(ic, 24), h('span', {}, label), id === 'review' && h('span', { class: 'badge', hidden: true }))));
  await loadProgress();
  window.addEventListener('hashchange', route);
  if (!location.hash && loaded && !P.profile.placementDone) go('#/placement');
  else route();
})();
