import { UNITS, FREE_TALK } from './curriculum.js';
import {
  LEVELS, LEVEL_HE, PLACEMENT_WORDS, today, addReviewItem, gradeItem, dueKeys,
  bumpStreak, currentStreak, checkAnswer, hintOf, shuffle, vocabLevel, finalLevel,
} from './learning.js';

const app = document.getElementById('app');
const statusEl = document.getElementById('status');
const rateEl = document.getElementById('rate');
const voiceEl = document.getElementById('voice');

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

// ---------- Small helpers ----------

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

function progressBar(i, n, label) {
  return h('div', { class: 'progress' },
    h('div', { class: 'bar' }, h('span', { style: `width:${Math.round((i / n) * 100)}%` })),
    h('small', {}, `${label} ${i + 1} מתוך ${n}`));
}

function isUnlocked(i) {
  return P.profile.unlockAll || i === 0 || !!P.units[UNITS[i - 1].id]?.completed || !!P.units[UNITS[i].id]?.completed;
}

// ---------- Speech: listen (browser), speak (Gemini voice, browser fallback), pronunciation (Gemini) ----------

let voices = [];
if (window.speechSynthesis) {
  const loadVoices = () => { voices = speechSynthesis.getVoices(); };
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

// Natural voice comes from the server (generated once per sentence, then cached on disk).
const audioCache = new Map(); // "voice|text" -> Promise<object URL>
const prefetchQueue = [];
let prefetching = 0;
let player = null;
let speakToken = 0;
let fallbackNoticed = false;

const voiceName = () => P.settings?.voice || 'Kore';

function fetchVoice(text) {
  const key = `${voiceName()}|${text}`;
  if (!audioCache.has(key)) {
    const url = fetch('/api/tts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice: voiceName() }),
    }).then(async (res) => {
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'tts failed');
      return URL.createObjectURL(await res.blob());
    });
    url.catch(() => audioCache.delete(key)); // let a later click retry
    audioCache.set(key, url);
  }
  return audioCache.get(key);
}

// Generate the next sentences in the background, two at a time, so they play instantly.
function prefetch(texts) {
  if (voiceName() === 'browser') return;
  prefetchQueue.push(...texts.filter(Boolean));
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

async function speak(text) {
  if (!text) return;
  stopSpeaking();
  const token = speakToken;
  if (voiceName() !== 'browser') {
    const loading = setTimeout(() => token === speakToken && setStatus('🔊 מכין את הקול...'), 400);
    try {
      const url = await fetchVoice(text);
      if (token !== speakToken) return;
      player = new Audio(url);
      player.playbackRate = Number(P.settings?.rate) || 0.9;
      await player.play();
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

function speakBtn(text) {
  return h('button', { type: 'button', class: 'icon', title: 'להשמיע', 'aria-label': 'להשמיע', onclick: () => speak(text) }, '🔊');
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function listen(lang, btn) {
  return new Promise((resolve, reject) => {
    if (!SR) return reject(new Error('דיבור למיקרופון עובד רק ב-Chrome או Edge. אפשר לכתוב במקום.'));
    stopSpeaking();
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    let done = false;
    const finish = (fn, value) => {
      if (done) return;
      done = true;
      btn?.classList.remove('listening');
      setStatus('');
      fn(value);
    };
    rec.onresult = (e) => finish(resolve, e.results[0][0].transcript);
    rec.onerror = (e) => finish(reject, new Error(
      e.error === 'no-speech' ? 'לא שמעתי כלום, נסה שוב'
        : e.error === 'not-allowed' ? 'צריך לאשר גישה למיקרופון בדפדפן'
          : `שגיאת מיקרופון: ${e.error}`));
    rec.onend = () => finish(reject, new Error('לא שמעתי כלום, נסה שוב'));
    btn?.classList.add('listening');
    setStatus(lang === 'he-IL' ? '🎤 מקשיב... דבר בעברית' : '🎤 מקשיב... דבר באנגלית');
    rec.start();
  });
}

let recorder = null;

function pronounceBtn(target, onResult) {
  const btn = h('button', { type: 'button', class: 'icon', title: 'חזור אחריי: בדיקת הגייה', 'aria-label': 'בדיקת הגייה' }, '🎙️');
  btn.onclick = () => toggleRecord(target, btn, onResult);
  return btn;
}

async function toggleRecord(target, btn, onResult) {
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
  rec.ondataavailable = (e) => chunks.push(e.data);
  const timer = setTimeout(() => rec.state === 'recording' && rec.stop(), 15000);
  rec.onstop = async () => {
    clearTimeout(timer);
    stream.getTracks().forEach((t) => t.stop());
    recorder = null;
    btn.classList.remove('recording');
    setStatus('בודק הגייה... ⏳');
    try {
      const audio = await toWavBase64(new Blob(chunks, { type: chunks[0]?.type }));
      onResult(pronunciationCard(await api('/api/pronounce', { audio, mimeType: 'audio/wav', target }), target));
      setStatus('');
    } catch (e) {
      setStatus(`⚠️ ${e.message === 'EncodingError' || /decode/i.test(e.message) ? 'ההקלטה קצרה מדי, נסה שוב' : e.message}`, true);
    }
  };
  btn.classList.add('recording');
  setStatus(target ? `🔴 מקליט... תגיד: "${target}" ולחץ שוב על 🎙️ לסיום` : '🔴 מקליט... לחץ שוב על 🎙️ לסיום');
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

function pronunciationCard(r, target) {
  const cls = r.score >= 80 ? 'score-good' : r.score >= 50 ? 'score-mid' : 'score-bad';
  return h('div', { class: 'msg bot' },
    h('div', { class: 'pron-title' }, '🗣️ בדיקת הגייה: ', h('span', { class: cls }, `${r.score}/100`)),
    target && h('div', { class: 'label' }, 'המשפט:'),
    target && h('div', { class: 'en' }, speakBtn(target), h('span', {}, target)),
    h('div', { class: 'label' }, 'מה שמעתי:'),
    h('div', { class: 'en' }, r.heard),
    (r.issues || []).map((x) => h('div', { class: 'issue' }, speakBtn(x.word), ' ', h('b', {}, x.word), h('div', { class: 'he' }, x.tip_he))),
    r.summary_he && h('div', { class: 'he' }, `💡 ${r.summary_he}`));
}

// Text box + English microphone; speech goes straight to checking.
function answerInput({ onSubmit, placeholder = 'כתוב באנגלית...' }) {
  const input = h('input', { type: 'text', placeholder, dir: 'ltr', autocomplete: 'off', spellcheck: false, 'aria-label': 'התשובה שלך' });
  const mic = h('button', { type: 'button', class: 'mic', title: 'להגיד באנגלית' }, '🎤 להגיד');
  mic.onclick = async () => {
    try {
      const text = await listen('en-US', mic);
      input.value = text;
      onSubmit(text);
    } catch (e) {
      setStatus(`⚠️ ${e.message}`, true);
    }
  };
  return h('form', {
    class: 'answer',
    onsubmit: (e) => { e.preventDefault(); if (input.value.trim()) onSubmit(input.value.trim()); },
  }, mic, input, h('button', { type: 'submit', class: 'primary' }, 'בדוק'));
}

// ---------- Conversation with the AI tutor (lesson mission or free talk) ----------

function createChat({ mode, unit, onDone }) {
  const opener = mode === 'mission' ? unit.mission.opener_en : FREE_TALK.opener_en;
  const history = [{ role: 'bot', text: opener }];
  let hint = mode === 'mission' ? unit.mission.hint_en : FREE_TALK.hint_en;
  let busy = false;
  let doneShown = false;

  const list = h('div', { class: 'chat', 'aria-live': 'polite' });
  const input = h('input', { type: 'text', placeholder: 'כתוב כאן, בעברית או באנגלית...', autocomplete: 'off', 'aria-label': 'הודעה' });
  const micEn = h('button', { type: 'button', class: 'mic' }, '🎤 באנגלית');
  const micHe = h('button', { type: 'button', class: 'mic he' }, '🎤 בעברית');
  const hintBtn = h('button', { type: 'button', class: 'secondary' }, '💡 רמז');
  const form = h('form', { class: 'answer' }, input, h('button', { type: 'submit', class: 'primary' }, 'שלח'));
  const el = h('div', { class: 'chat-wrap' }, list, h('div', { class: 'composer' }, micEn, micHe, hintBtn, form));

  const scroll = () => list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  const add = (node) => { list.append(node); scroll(); return node; };

  function englishRow(label, text, cls = '') {
    return [
      h('div', { class: 'label' }, label),
      h('div', { class: `en ${cls}` }, speakBtn(text), pronounceBtn(text, add), h('span', {}, text)),
    ];
  }

  function addBot(r) {
    add(h('div', { class: 'msg bot' },
      r.say_it && englishRow('ככה אומרים את זה באנגלית:', r.say_it, 'say'),
      r.correction && englishRow('תיקון קטן:', r.correction, 'fix'),
      englishRow('המורה:', r.reply_en),
      r.hebrew_help && h('div', { class: 'he' }, `💡 ${r.hebrew_help}`),
      r.new_words?.length && h('div', { class: 'words' }, r.new_words.map((w) => h('span', { class: 'word' }, `${w.en} = ${w.he}`)))));
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    const bubble = add(h('div', { class: 'msg user', dir: 'auto' }, text));
    history.push({ role: 'user', text });
    setStatus('המורה חושב... ⏳');
    try {
      const data = await api('/api/chat', { messages: history, mode, unitId: unit?.id });
      history.push({ role: 'bot', text: data.reply_en });
      hint = data.hint_en || hint;
      addBot(data);
      setStatus('');
      speak(data.reply_en);
      const day = today();
      if (data.correction) P.mistakes = [...(P.mistakes || []), { said: text, fixed: data.correction, day }].slice(-30);
      for (const w of data.new_words || []) addReviewItem(P.review, { en: w.en, he: w.he, type: 'word' }, day);
      P.streak = bumpStreak(P.streak, day);
      save();
      if (data.mission_done && !doneShown) {
        doneShown = true;
        add(h('div', { class: 'msg done' }, '✅ השלמת את המשימה! אפשר להמשיך לדבר, או ללחוץ "סיום המשימה".'));
        onDone?.();
      }
    } catch (e) {
      history.pop();
      bubble.remove();
      input.value = text;
      setStatus(`⚠️ ${e.message}`, true);
    } finally {
      busy = false;
    }
  }

  form.onsubmit = (e) => { e.preventDefault(); const t = input.value; input.value = ''; send(t); };
  micEn.onclick = async () => { try { send(await listen('en-US', micEn)); } catch (e) { setStatus(`⚠️ ${e.message}`, true); } };
  micHe.onclick = async () => { try { send(await listen('he-IL', micHe)); } catch (e) { setStatus(`⚠️ ${e.message}`, true); } };
  hintBtn.onclick = () => add(h('div', { class: 'msg hint' }, '💡 אפשר להגיד:', h('div', { class: 'en' }, speakBtn(hint), h('span', {}, hint))));

  addBot({
    reply_en: opener,
    hebrew_help: mode === 'free' ? 'אפשר לדבר איתי על כל נושא, בעברית או באנגלית. אם נתקעים, לוחצים 💡 רמז.' : '',
  });
  speak(opener);
  return { el };
}

// ---------- Screens ----------

function bigLink(href, icon, title, sub) {
  return h('a', { class: 'big-link', href }, h('span', { class: 'icon-big' }, icon), h('span', {}, h('b', {}, title), h('small', {}, sub)));
}

function stat(icon, value, label) {
  return h('div', { class: 'stat' }, h('b', {}, `${icon} ${value}`), h('small', {}, label));
}

function renderHome() {
  const day = today();
  const due = dueKeys(P.review, day).length;
  const nextIdx = UNITS.findIndex((u, i) => !P.units[u.id]?.completed && isUnlocked(i));
  const doneCount = UNITS.filter((u) => P.units[u.id]?.completed).length;
  const level = P.profile.level;

  const todayCards = [];
  if (!P.profile.placementDone) {
    todayCards.push(bigLink('#/placement', '🧭', 'מתחילים: אבחון קצר', 'כ-5 דקות. נבין מאיפה אתה מתחיל.'));
  } else {
    if (due) todayCards.push(bigLink('#/review', '🔁', `חזרה: ${due} מילים ומשפטים`, `כ-${Math.max(2, Math.ceil(due / 4))} דקות. ככה זוכרים לאורך זמן.`));
    if (nextIdx >= 0) {
      const u = UNITS[nextIdx];
      todayCards.push(bigLink(`#/unit/${u.id}`, '📘', `שיעור ${nextIdx + 1}: ${u.title_he}`, `כ-15 דקות. בסוף תוכל ${u.goal_he}.`));
    } else {
      todayCards.push(h('div', { class: 'card done' }, '🎉 סיימת את כל 10 היחידות של רמה A1! המשך עם חזרה ושיחה חופשית. השלב הבא בדרך.'));
    }
  }

  mount(
    h('h1', {}, 'שלום! 👋'),
    h('div', { class: 'stats' },
      stat('🔥', currentStreak(P.streak, day), 'ימים ברצף'),
      stat('📘', `${doneCount}/${UNITS.length}`, 'שיעורים'),
      stat('🧠', Object.keys(P.review).length, 'מילים ומשפטים'),
      level && stat('📊', level, LEVEL_HE[level])),
    h('h2', {}, 'מה עושים היום'),
    todayCards,
    h('h2', {}, 'המסלול: רמה A1'),
    h('ol', { class: 'units' }, UNITS.map((u, i) => {
      const done = P.units[u.id]?.completed;
      const label = [h('span', { class: 'num' }, done ? '✅' : `${i + 1}.`), h('span', {}, u.title_he)];
      return h('li', {}, isUnlocked(i)
        ? h('a', { href: `#/unit/${u.id}` }, label)
        : h('span', { class: 'locked', title: 'נפתח אחרי השיעור הקודם' }, h('span', { class: 'num' }, '🔒'), h('span', {}, u.title_he)));
    })),
    h('h2', {}, 'עוד'),
    bigLink('#/talk', '💬', 'שיחה חופשית', 'מדברים על מה שבא לך. המורה מתקן ועוזר.'),
    h('div', { class: 'footer-links' },
      P.profile.placementDone && h('a', { href: '#/placement' }, 'לעשות שוב את האבחון'),
      h('button', { class: 'link', onclick: resetProgress }, 'איפוס כל ההתקדמות')),
  );
}

function resetProgress() {
  if (!confirm('בטוח? כל ההתקדמות, המחברת והרצף יימחקו.')) return;
  P = { ...emptyProgress(), settings: P.settings };
  save();
  location.hash = '#/placement';
}

const GOALS = ['טיולים בחו"ל', 'עבודה', 'לימודים', 'סרטים וסדרות', 'שיחות עם אנשים', 'ביטחון עצמי'];
const LEVEL_EXPLAIN = {
  A0: 'מתחילים מהבסיס: מילים ומשפטים ראשונים. המורה ידבר איתך לאט ויסביר הכול בעברית.',
  A1: 'אתה מכיר מילים בסיסיות. נבנה מהן משפטים ושיחות קצרות.',
  A2: 'יש לך בסיס טוב. עכשיו בעיקר צריך לדבר, הרבה.',
  B1: 'אתה מסתדר. נעבוד על שטף ועל דיוק.',
  B2: 'רמה גבוהה. נעבוד על דיוק וביטחון.',
};

function renderPlacement() {
  const items = ['A1', 'A2', 'B1']
    .flatMap((band) => shuffle(PLACEMENT_WORDS.filter((w) => w.band === band)))
    .map((w) => ({ ...w, options: shuffle([w.he, ...shuffle(PLACEMENT_WORDS.filter((x) => x !== w)).slice(0, 3).map((x) => x.he)]) }));
  const S = { step: 'goals', goals: new Set(P.profile.goals || []), i: 0, results: [], result: null };
  prefetch([...items.map((w) => w.en), 'Tell me about yourself.']);
  const draw = () => { mount(view()); window.scrollTo(0, 0); };

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
      return [
        h('h1', {}, 'בוא נכיר 🧭'),
        h('p', {}, 'כמה דקות, ונדע מאיפה מתחילים. אין ציון ואין "נכשלת". זה רק כדי להתאים לך את המסלול.'),
        h('h3', {}, 'בשביל מה אתה רוצה אנגלית? (אפשר לבחור כמה)'),
        h('div', { class: 'chips' }, GOALS.map((g) => h('button', {
          type: 'button', class: `chip${S.goals.has(g) ? ' on' : ''}`, 'aria-pressed': String(S.goals.has(g)),
          onclick: () => { S.goals.has(g) ? S.goals.delete(g) : S.goals.add(g); draw(); },
        }, g))),
        h('div', { class: 'actions' },
          h('button', { class: 'primary', onclick: () => { S.step = 'vocab'; draw(); } }, 'המשך ←'),
          h('button', { class: 'secondary', onclick: () => finish('A0', 'A0', 'מתחילים מאפס, וזה בדיוק המקום הנכון. נלך צעד אחרי צעד.') }, 'דלג, אני מתחיל מאפס')),
      ];
    }
    if (S.step === 'vocab') {
      const it = items[S.i];
      const answer = (correct) => {
        S.results.push({ band: it.band, correct });
        if (S.i < items.length - 1) S.i++;
        else S.step = 'speak';
        draw();
      };
      return [
        progressBar(S.i, items.length, 'מילה'),
        h('p', { class: 'muted' }, 'מה פירוש המילה? אם לא יודעים, לוחצים "לא יודע". זה עוזר לא פחות מתשובה נכונה.'),
        h('div', { class: 'card' }, h('div', { class: 'big-en' }, it.en), h('div', { class: 'row-btns' }, speakBtn(it.en))),
        h('div', { class: 'options' },
          it.options.map((o) => h('button', { class: 'option', onclick: () => answer(o === it.he) }, o)),
          h('button', { class: 'option dont-know', onclick: () => answer(false) }, 'לא יודע 🤷')),
      ];
    }
    if (S.step === 'speak') {
      return [
        h('h1', {}, 'עכשיו קצת לדבר 🎤'),
        h('p', {}, 'ספר על עצמך באנגלית: איך קוראים לך, מאיפה אתה, מה אתה עושה. גם משפט אחד זה מצוין.'),
        h('div', { class: 'card' }, h('div', { class: 'answer-line' }, speakBtn('Tell me about yourself.'), h('b', {}, 'Tell me about yourself.'))),
        answerInput({ onSubmit: submitSpeaking, placeholder: 'My name is...' }),
        h('button', { class: 'secondary', onclick: () => submitSpeaking('') }, 'אני עוד לא יכול, דלג'),
      ];
    }
    if (S.step === 'checking') return [h('div', { class: 'card center' }, 'בודק... ⏳')];
    const { level, feedback } = S.result;
    return [
      h('h1', {}, `הרמה שלך: ${LEVEL_HE[level]} (${level})`),
      h('p', {}, LEVEL_EXPLAIN[level]),
      feedback && h('div', { class: 'card' }, `💬 ${feedback}`),
      h('h3', {}, 'מה עכשיו?'),
      h('p', {}, P.profile.unlockAll
        ? 'אתה כבר מעבר לבסיס של A1, אז כל השיעורים פתוחים לך. כדאי לעבור עליהם מהר כחזרה. השלב הבא יביא תוכן ברמה שלך.'
        : 'מתחילים משיעור 1. כל שיעור לוקח כ-15 דקות, ובסופו נפתח השיעור הבא. הכי חשוב: קצת כל יום.'),
      h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: () => { location.hash = '#/home'; } }, 'בוא נתחיל ←')),
    ];
  }

  draw();
}

const STEPS = [['intro', 'פתיחה'], ['words', 'מילים'], ['phrases', 'משפטים'], ['quiz', 'בדיקה'], ['practice', 'תרגול'], ['mission', 'משימה'], ['summary', 'סיכום']];

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
  const idx = UNITS.findIndex((u) => u.id === id);
  const unit = UNITS[idx];
  if (!unit || !isUnlocked(idx)) { location.hash = '#/home'; return; }

  const L = { step: 0, i: 0, quiz: buildQuiz(unit), quizRight: 0, practiceRight: 0, answered: null, result: null, tried: false, hint: false, missed: new Set(), missionDone: false, chat: null, saved: false };
  prefetch([
    ...unit.words.flatMap((w) => [w.en, w.ex_en]), ...unit.phrases.map((p) => p.en),
    ...unit.practice.map((p) => p.en), unit.mission.opener_en,
  ]);
  const draw = () => mount(head(), body());
  const next = () => { Object.assign(L, { step: L.step + 1, i: 0, answered: null, result: null, tried: false, hint: false }); draw(); window.scrollTo(0, 0); };
  const advance = (count) => { if (L.i < count - 1) { L.i++; draw(); } else next(); };

  function head() {
    return h('div', { class: 'lesson-head' },
      h('a', { href: '#/home', class: 'back' }, '→ יציאה (ההתקדמות בשיעור לא נשמרת)'),
      h('div', { class: 'lesson-title' }, `שיעור ${idx + 1}: ${unit.title_he}`),
      h('ol', { class: 'steps' }, STEPS.map(([, label], n) => h('li', { class: n < L.step ? 'done' : n === L.step ? 'now' : '' }, label))));
  }

  function cards(items, withExample, label) {
    const it = items[L.i];
    const pron = h('div');
    setTimeout(() => speak(it.en), 150);
    return [
      progressBar(L.i, items.length, label),
      h('p', { class: 'muted' }, 'שמע 🔊, חזור בקול, ולחץ 🎙️ כדי לבדוק את ההגייה.'),
      h('div', { class: 'card' },
        h('div', { class: 'big-en' }, it.en),
        h('div', { class: 'row-btns' }, speakBtn(it.en), pronounceBtn(it.en, (c) => pron.replaceChildren(c))),
        h('div', { class: 'big-he' }, it.he),
        withExample && h('div', { class: 'example' },
          h('div', { dir: 'ltr' }, speakBtn(it.ex_en), ' ', it.ex_en),
          h('div', { class: 'muted' }, it.ex_he))),
      pron,
      h('div', { class: 'actions' },
        L.i > 0 && h('button', { class: 'secondary', onclick: () => { L.i--; draw(); } }, '→ הקודם'),
        h('button', { class: 'primary', onclick: () => advance(items.length) }, L.i < items.length - 1 ? 'הבא ←' : 'סיימתי, הלאה ←')),
    ];
  }

  function quiz() {
    const q = L.quiz[L.i];
    const listenQ = q.kind === 'listen';
    if (listenQ && !L.answered) setTimeout(() => speak(q.en), 200);
    const right = L.answered === q.answer;
    return [
      progressBar(L.i, L.quiz.length, 'שאלה'),
      h('p', { class: 'muted' }, listenQ ? 'הקשב: מה פירוש המשפט? (אפשר לשמוע שוב)' : 'איך אומרים את זה באנגלית?'),
      h('div', { class: 'card' }, listenQ
        ? h('div', { class: 'row-btns' }, h('button', { class: 'primary', onclick: () => speak(q.en) }, '🔊 השמע שוב'))
        : h('div', { class: 'big-he' }, q.prompt)),
      h('div', { class: 'options', dir: listenQ ? 'rtl' : 'ltr' }, q.options.map((o) => h('button', {
        class: `option${L.answered ? (o === q.answer ? ' right' : o === L.answered ? ' wrong' : '') : ''}`,
        disabled: !!L.answered,
        onclick: () => {
          L.answered = o;
          if (o === q.answer) L.quizRight++;
          else L.missed.add(q.en);
          draw();
        },
      }, o))),
      L.answered && h('div', { class: `feedback ${right ? 'ok' : 'bad'}` },
        right ? '✅ נכון!' : `❌ התשובה הנכונה: ${q.answer}`,
        h('div', { class: 'answer-line' }, speakBtn(q.en), q.en)),
      L.answered && h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: () => { L.answered = null; advance(L.quiz.length); } }, 'הבא ←')),
    ];
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
    return [
      progressBar(L.i, unit.practice.length, 'משפט'),
      h('p', { class: 'muted' }, 'איך אומרים את זה באנגלית? אפשר להגיד במיקרופון או לכתוב.'),
      h('div', { class: 'card' }, h('div', { class: 'big-he' }, p.he)),
      !L.result?.correct && answerInput({ onSubmit }),
      !L.result && h('div', { class: 'actions' },
        h('button', { class: 'secondary', onclick: () => { L.hint = true; draw(); } }, '💡 רמז'),
        h('button', {
          class: 'secondary',
          onclick: () => {
            if (!L.tried) { L.tried = true; L.missed.add(p.en); }
            L.result = { correct: false, shown: true };
            draw();
          },
        }, 'הראה תשובה')),
      L.hint && !L.result && h('div', { class: 'hint' }, hintOf(p.en)),
      L.result && h('div', { class: `feedback ${L.result.correct ? 'ok' : 'bad'}` },
        L.result.correct ? '✅ מצוין!' : L.result.shown ? 'התשובה:' : `❌ עוד לא. אמרת: "${L.result.text}". התשובה:`,
        h('div', { class: 'answer-line' }, speakBtn(p.en), pronounceBtn(p.en, (c) => pron.replaceChildren(c)), p.en),
        !L.result.correct && h('div', { class: 'muted' }, 'שמע, חזור בקול, ונסה שוב למעלה. או המשך הלאה.')),
      pron,
      L.result && h('div', { class: 'actions' },
        h('button', { class: 'primary', onclick: () => { Object.assign(L, { result: null, tried: false, hint: false }); advance(unit.practice.length); } }, 'הבא ←')),
    ];
  }

  function mission() {
    if (!L.chat) L.chat = createChat({ mode: 'mission', unit, onDone: () => { L.missionDone = true; } });
    return [
      h('div', { class: 'card task' },
        h('b', {}, '🎯 המשימה: '), unit.mission.task_he,
        h('div', { class: 'muted' }, 'דבר בקול או כתוב. מותר לערבב עברית. נתקעת? לחץ 💡 רמז.')),
      L.chat.el,
      h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: next }, 'סיום המשימה ←')),
    ];
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
    return [
      h('h1', {}, '🎉 כל הכבוד! סיימת את השיעור'),
      h('div', { class: 'card done' }, `עכשיו אתה יכול ${unit.goal_he}.`),
      h('div', { class: 'stats' },
        stat('❓', `${L.quizRight}/${L.quiz.length}`, 'בבדיקה'),
        stat('🗣️', `${L.practiceRight}/${unit.practice.length}`, 'בתרגול, בניסיון ראשון'),
        stat('🎯', L.missionDone ? 'הושלמה' : 'חלקית', 'משימה')),
      L.missed.size > 0 && h('div', { class: 'card' },
        h('b', {}, 'שווה לחזור על אלה:'),
        h('ul', {}, [...L.missed].map((en) => h('li', { dir: 'ltr' }, speakBtn(en), ' ', en)))),
      h('p', {}, 'כל המילים והמשפטים של השיעור נכנסו למחברת החזרה. הם יחזרו אליך מחר, ואחר כך בהפרשים הולכים וגדלים. ככה זה נשאר בזיכרון.'),
      h('div', { class: 'actions' },
        h('button', { class: 'primary', onclick: () => { location.hash = '#/home'; } }, 'למסך הבית ←'),
        nextUnit && h('button', { class: 'secondary', onclick: () => { location.hash = `#/unit/${nextUnit.id}`; } }, 'יש לי כוח, לשיעור הבא')),
    ];
  }

  function body() {
    switch (STEPS[L.step][0]) {
      case 'intro':
        return [h('div', { class: 'card' },
          h('h1', {}, unit.title_he),
          h('div', { class: 'muted', dir: 'ltr' }, unit.title_en),
          h('h3', {}, 'בסוף השיעור תוכל:'),
          h('p', {}, `${unit.goal_he}.`),
          h('h3', {}, 'מה יהיה בשיעור (כ-15 דקות):'),
          h('ul', {},
            h('li', {}, `${unit.words.length} מילים חדשות עם דוגמאות`),
            h('li', {}, `${unit.phrases.length} משפטים מוכנים לשימוש`),
            h('li', {}, 'בדיקה קצרה: לזהות ולהבין בשמיעה'),
            h('li', {}, 'תרגול: להגיד בעצמך באנגלית'),
            h('li', {}, 'משימה: שיחה אמיתית עם המורה'))),
        h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: next }, 'מוכן? בוא נתחיל ←'))];
      case 'words': return cards(unit.words, true, 'מילה');
      case 'phrases': return cards(unit.phrases, false, 'משפט');
      case 'quiz': return quiz();
      case 'practice': return practice();
      case 'mission': return mission();
      default: return summary();
    }
  }

  draw();
}

function renderReview() {
  const day = today();
  const R = { queue: dueKeys(P.review, day).slice(0, 20), i: 0, result: null, graded: new Set(), requeued: new Set(), right: 0, finished: false };
  prefetch(R.queue.map((k) => P.review[k].en));
  const draw = () => mount(view());

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
  const nextCard = () => { R.i++; R.result = null; draw(); };

  function view() {
    if (!R.queue.length) {
      return [h('h1', {}, 'אין מה לחזור היום 🎉'), h('p', {}, 'כל מה שלמדת עדיין טרי. נתראה מחר.'),
        h('button', { class: 'primary', onclick: () => { location.hash = '#/home'; } }, 'למסך הבית')];
    }
    if (R.i >= R.queue.length) {
      if (!R.finished) { R.finished = true; P.streak = bumpStreak(P.streak, day); save(); }
      return [
        h('h1', {}, '✅ סיימת את החזרה'),
        h('p', {}, `חזרת על ${R.graded.size} פריטים וידעת ${R.right} מהם בפעם הראשונה.`),
        h('p', { class: 'muted' }, 'מה שידעת יחזור בעוד כמה ימים. מה שלא ידעת יחזור כבר מחר.'),
        h('button', { class: 'primary', onclick: () => { location.hash = '#/home'; } }, 'למסך הבית ←'),
      ];
    }
    const key = R.queue[R.i];
    const item = P.review[key];
    const pron = h('div');
    const onSubmit = (text) => {
      const { correct } = checkAnswer(text, [item.en]);
      R.result = { correct, text };
      grade(key, correct);
      draw();
    };
    return [
      h('h1', {}, '🔁 חזרה'),
      progressBar(R.i, R.queue.length, 'פריט'),
      h('p', { class: 'muted' }, 'איך אומרים את זה באנגלית? תגיד בקול או כתוב. לא בטוח? לחץ "הצג תשובה".'),
      h('div', { class: 'card' }, h('div', { class: 'big-he' }, item.he), h('div', { class: 'muted center' }, item.type === 'word' ? 'מילה' : 'משפט')),
      !R.result && answerInput({ onSubmit }),
      !R.result && h('div', { class: 'actions' }, h('button', { class: 'secondary', onclick: () => { R.result = { revealed: true }; draw(); } }, 'הצג תשובה')),
      R.result && h('div', { class: `feedback ${R.result.correct ? 'ok' : R.result.revealed ? '' : 'bad'}` },
        R.result.correct ? '✅ נכון!' : R.result.revealed ? 'התשובה:' : `❌ אמרת: "${R.result.text}". התשובה:`,
        h('div', { class: 'answer-line' }, speakBtn(item.en), pronounceBtn(item.en, (c) => pron.replaceChildren(c)), item.en)),
      pron,
      R.result?.revealed && h('div', { class: 'actions' },
        h('button', { class: 'primary', onclick: () => { grade(key, true); nextCard(); } }, 'ידעתי ✅'),
        h('button', { class: 'secondary', onclick: () => { grade(key, false); nextCard(); } }, 'לא ידעתי ❌')),
      R.result && !R.result.revealed && h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: nextCard }, 'הבא ←')),
    ];
  }

  draw();
}

function renderTalk() {
  const chat = createChat({ mode: 'free' });
  mount(
    h('h1', {}, '💬 שיחה חופשית'),
    h('p', { class: 'muted' }, 'מדברים על מה שבא לך. המורה מתקן בעדינות, ומילים חדשות נכנסות למחברת החזרה.'),
    chat.el);
}

function renderHelp() {
  const li = (...c) => h('li', {}, ...c);
  mount(
    h('h1', {}, '❔ איך זה עובד'),
    h('div', { class: 'card help' },
      h('h3', {}, 'השגרה המומלצת: 15-20 דקות ביום'),
      h('ol', {},
        li('נכנסים למסך הבית ועושים קודם את ', h('b', {}, 'החזרה'), ' (אם יש).'),
        li('אחר כך ', h('b', {}, 'שיעור אחד'), '. אחד ביום זה מצוין. עדיף קצת כל יום מהרבה פעם בשבוע.'),
        li('יש עוד כוח? ', h('b', {}, 'שיחה חופשית'), ' עם המורה.'))),
    h('div', { class: 'card help' },
      h('h3', {}, 'מה יש בכל שיעור'),
      h('ol', {},
        li(h('b', {}, 'מילים ומשפטים: '), 'שומעים, חוזרים בקול ובודקים הגייה.'),
        li(h('b', {}, 'בדיקה: '), 'לזהות מילים ולהבין משפטים בשמיעה.'),
        li(h('b', {}, 'תרגול: '), 'רואים משפט בעברית ואומרים אותו באנגלית.'),
        li(h('b', {}, 'משימה: '), 'שיחה אמיתית עם המורה, למשל להזמין בבית קפה.'),
        li(h('b', {}, 'סיכום: '), 'כל מה שלמדת נכנס למחברת החזרה.'))),
    h('div', { class: 'card help' },
      h('h3', {}, 'הכפתורים'),
      h('ul', {},
        li('🔊 משמיע את המילה או המשפט. את המהירות משנים למעלה.'),
        li('🎙️ ', h('b', {}, 'בדיקת הגייה: '), 'לוחצים, אומרים, ולוחצים שוב. מקבלים ציון וטיפים בעברית.'),
        li('🎤 מדברים במקום לכתוב. באנגלית או בעברית.'),
        li('💡 רמז, כשנתקעים.'))),
    h('div', { class: 'card help' },
      h('h3', {}, 'איך עובדת החזרה'),
      h('p', {}, 'כל מילה ומשפט חוזרים אליך בזמן הנכון: אחרי יום, אחרי 3 ימים, אחרי שבוע, ואחר כך פחות ופחות. אם לא ידעת, הם חוזרים כבר מחר. ככה הם עוברים לזיכרון ארוך-טווח.')),
    h('div', { class: 'card help' },
      h('h3', {}, 'חשוב לדעת'),
      h('ul', {},
        li('המיקרופון עובד ב-Chrome או Edge. בפעם הראשונה צריך לאשר גישה.'),
        li('בדיקת ההגייה נעשית על ידי AI. היא טובה, אבל לא מושלמת. תתייחס אליה כאל מאמן, לא כאל ציון.'),
        li('ההקלטות והשיחות נשלחות ל-Google Gemini לניתוח. ההתקדמות נשמרת רק אצלך במחשב, בקובץ bot/data/progress.json.'))),
    h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: () => { location.hash = '#/home'; } }, 'למסך הבית ←')),
  );
}

// ---------- Routing ----------

const ROUTES = { home: renderHome, placement: renderPlacement, unit: renderUnit, review: renderReview, talk: renderTalk, help: renderHelp };

function route() {
  stopSpeaking();
  prefetchQueue.length = 0;
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
  await loadProgress();
  rateEl.value = String(P.settings?.rate ?? 0.9);
  rateEl.onchange = () => {
    P.settings = { ...P.settings, rate: Number(rateEl.value) };
    save();
    speak('This is my speaking speed.');
  };
  voiceEl.value = voiceName();
  voiceEl.onchange = () => {
    P.settings = { ...P.settings, voice: voiceEl.value };
    save();
    speak("Hi! I'm your English teacher. Nice to meet you.");
  };
  window.addEventListener('hashchange', route);
  if (!location.hash && loaded && !P.profile.placementDone) location.hash = '#/placement';
  else route();
})();
