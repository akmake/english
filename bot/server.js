import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { UNITS, FREE_TALK } from './public/curriculum.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

// Minimal .env loader (no dependencies)
const envFile = path.join(dir, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const PORT = Number(process.env.PORT) || 3333;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
// Tried in order when the main model is overloaded (503) or rate-limited (429)
const FALLBACK_MODELS = ['gemini-3.5-flash', 'gemini-flash-latest'];
const PUBLIC_DIR = path.join(dir, 'public');
const DATA_DIR = process.env.DATA_DIR || path.join(dir, 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const MAX_BODY = 8 * 1024 * 1024;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

// ---- Progress (single learner, saved on disk so clearing the browser loses nothing) ----

export function readProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeProgress(progress) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${PROGRESS_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(progress, null, 2));
  fs.renameSync(tmp, PROGRESS_FILE);
}

// ---- Tutor prompt ----

const SUPPORT_BY_LEVEL = {
  A0: 'The student knows almost no English. Use very short sentences (3-7 words) and only the most common words. Always fill hebrew_help.',
  A1: 'Use short, simple sentences and common words. Fill hebrew_help when something might be unclear.',
  A2: 'Use simple, natural English. Fill hebrew_help only for corrections or harder words.',
  B1: 'Use natural English at a moderate pace. Fill hebrew_help only when the student is stuck or asks.',
  B2: 'Use natural English. Leave hebrew_help empty unless the student asks in Hebrew.',
};

export function tutorPrompt({ mode, unit, progress }) {
  const profile = progress.profile || {};
  const level = profile.level || 'A0';
  const mistakes = (progress.mistakes || []).slice(-5).map((m) => `- "${m.said}" -> "${m.fixed}"`).join('\n');

  const context =
    mode === 'mission' && unit
      ? `This is the speaking mission of the lesson "${unit.title_en}".
Your role: ${unit.mission.scenario_en}
Stay in your role. Use and recycle the lesson language:
Words: ${unit.words.map((w) => w.en).join(', ')}
Phrases: ${unit.phrases.map((p) => p.en).join(' | ')}
The student's task (in Hebrew): ${unit.mission.task_he}
Set "mission_done" to true once the student has done this task (mistakes are fine).`
      : `Free conversation. Let the student lead. Their reasons for learning English: ${(profile.goals || []).join(', ') || 'not given'}.
"mission_done" is always false.`;

  return `You are a warm, patient English tutor for an Israeli adult whose native language is Hebrew.
Their speaking level is ${level} (CEFR). ${SUPPORT_BY_LEVEL[level] || SUPPORT_BY_LEVEL.A0}
Goal: get them speaking with confidence. Low pressure, lots of encouragement, no lectures.

${context}
${mistakes ? `\nRecent mistakes of this student. When it fits naturally, give them a chance to use the correct form:\n${mistakes}\n` : ''}
Output fields:
- "reply_en": what you say. 1-3 short sentences. Usually end with one easy question.
- "say_it": if the student wrote Hebrew (fully or partly), how to say their message in English. Otherwise "".
- "correction": if their English had a real mistake, their sentence corrected. Otherwise "". Ignore missing punctuation and capital letters (it is often speech).
- "hebrew_help": a short Hebrew explanation (max 2 sentences) per the level rule above.
- "new_words": 0-2 useful words from this turn, {"en","he"}.
- "hint_en": one short, easy sentence the student could say next, in their role.
- "mission_done": see above.`;
}

export const CHAT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply_en: { type: 'STRING' },
    say_it: { type: 'STRING' },
    correction: { type: 'STRING' },
    hebrew_help: { type: 'STRING' },
    new_words: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { en: { type: 'STRING' }, he: { type: 'STRING' } }, required: ['en', 'he'] },
    },
    hint_en: { type: 'STRING' },
    mission_done: { type: 'BOOLEAN' },
  },
  required: ['reply_en', 'say_it', 'correction', 'hebrew_help', 'new_words', 'hint_en', 'mission_done'],
};

// speech_detected and heard come first so the model commits to what is audible
// before it sees a reason to "hear" the target sentence.
const PRONOUNCE_SCHEMA = {
  type: 'OBJECT',
  propertyOrdering: ['speech_detected', 'heard', 'score', 'issues', 'summary_he'],
  properties: {
    speech_detected: { type: 'BOOLEAN' },
    heard: { type: 'STRING' },
    score: { type: 'INTEGER' },
    issues: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { word: { type: 'STRING' }, tip_he: { type: 'STRING' } },
        required: ['word', 'tip_he'],
      },
    },
    summary_he: { type: 'STRING' },
  },
  required: ['speech_detected', 'heard', 'score', 'issues', 'summary_he'],
};

function pronouncePrompt(target) {
  return `You are a pronunciation coach for an Israeli beginner whose native language is Hebrew.
Listen to the audio very carefully. Judge the SOUND, not just the words.
${target ? `The student was asked to say: "${target}". They may have said something else, only part of it, or nothing at all.` : 'The student said a free sentence in English.'}

Be strictly honest. NEVER assume the student said the target sentence: report only what is really audible.
- "speech_detected": false if there is no clear human voice (silence, noise, a tone, music, breathing). Then heard is "", score 0, no issues.
- "heard": exactly what you heard, before comparing. If a word was mispronounced, spell it the way it sounded (e.g. "ai vant tu spik"). Words that were not said must not appear.
- "score": 0-100 for how clear and correct the pronunciation was. Missing or different words lower the score a lot.
- "issues": up to 3 words that need the most work. "tip_he" is a short Hebrew tip on HOW to say it: mouth/tongue position, stress, and the sound written in Hebrew letters (e.g. "think" — שימו את הלשון בין השיניים: ת'ינק, לא סינק). Typical Hebrew-speaker problems: th, w vs v, short i vs ee, final sounds, word stress.
- "summary_he": 1-2 encouraging sentences in Hebrew. Mention what was good.
- If the audio is silent, unclear or not English, say so in summary_he, score 0, no issues.`;
}

// Measured: when the coach knows the target it "hears" it even in a pure tone (score 98),
// while a blind transcriber correctly reports no speech but smooths over mispronunciations.
// So both run in parallel: the blind one decides IF there was speech, the coach grades HOW.
const BLIND_SCHEMA = {
  type: 'OBJECT',
  propertyOrdering: ['speech_detected', 'transcript'],
  properties: { speech_detected: { type: 'BOOLEAN' }, transcript: { type: 'STRING' } },
  required: ['speech_detected', 'transcript'],
};
const BLIND_PROMPT = 'Transcribe the human speech in this audio. If there is no human voice (silence, a tone, noise, music, breathing), set speech_detected to false and transcript to "".';

const NO_SPEECH = {
  speech_detected: false, heard: '', score: 0, issues: [],
  summary_he: 'לא שמעתי דיבור בהקלטה. בדוק שהמיקרופון הנכון פעיל, דבר קרוב אליו ונסה שוב.',
};

const PLACEMENT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    level: { type: 'STRING', enum: ['A0', 'A1', 'A2', 'B1', 'B2'] },
    feedback_he: { type: 'STRING' },
  },
  required: ['level', 'feedback_he'],
};

const PLACEMENT_PROMPT = `You assess the English SPEAKING level (CEFR) of an Israeli adult.
They were asked "Tell me about yourself" and answered below (often a speech-recognition transcript, so ignore punctuation and capitalization).
- A0: no answer, only Hebrew, or only isolated words.
- A1: a few short memorized sentences ("My name is... I live in...").
- A2: several simple connected sentences with basic mistakes.
- B1: can talk at length on familiar topics, some errors.
- B2: fluent, varied and mostly accurate.
"feedback_he": 2 warm sentences in Hebrew: what was good, and the one thing to work on first.`;

// ---- Gemini ----

// A key/model that was busy, rate-limited or hung is skipped for a while,
// so only one message pays for discovering it (the free key sometimes hangs without an error).
const ATTEMPT_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 15000;
const COOLDOWN_MS = 5 * 60 * 1000;
const QUOTA_COOLDOWN_MS = 60 * 60 * 1000; // an exhausted daily quota will not come back in 5 minutes
const HANG_COOLDOWN_MS = 30 * 60 * 1000; // measured: the free key sometimes hangs with no answer at all
const coolingUntil = new Map();
export const resetCooldowns = () => coolingUntil.clear(); // tests start each case with fresh keys

// Conversation needs speed. Measured on the same prompts: flash-lite answers in ~1.3s vs ~3.5s for
// gemini-3.8-flash, with the same corrections (past tense, he likes/doesn't, Hebrew -> English).
const CHAT_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', MODEL];
// flash-lite normally answers in ~1.3s: after 2.5s the next key/model is tried instead of waiting
// (only the last attempt gets the full timeout, so the conversation never fails just for being slow)
const CHAT_TIMEOUT_MS = 2500;

async function postGemini(model, key, payload, thinking, timeoutMs = ATTEMPT_TIMEOUT_MS) {
  // lite models answer directly; the thinking setting is only for the full models
  const level = model.includes('lite') ? null : thinking;
  const generationConfig = { ...payload.generationConfig, ...(level ? { thinkingConfig: { thinkingLevel: level } } : {}) };
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({ ...payload, generationConfig }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const data = await res.json();
  // a fallback model may not support the thinking setting: retry it without
  if (res.status === 400 && level && /thinking/i.test(data?.error?.message || '')) return postGemini(model, key, payload, null, timeoutMs);
  return { res, data };
}

// thinking: 'low' for fast turns on the full models; null = model default
async function callGemini({ system, contents, schema, temperature = 0.7, thinking = null, models, timeoutMs }) {
  const data = await geminiRequest({
    models: models || [MODEL, ...FALLBACK_MODELS.filter((m) => m !== MODEL)],
    payload: {
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature },
    },
    thinking,
    timeoutMs,
  });
  return JSON.parse(data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '{}');
}

// Returns Gemini's raw response. Tries the best model with every key before a weaker model.
async function geminiRequest({ models, payload, thinking = null, timeoutMs }) {
  // Free key first; the paid key is spent only when the free one fails
  const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_PAID].filter(Boolean);
  if (!keys.length) throw Object.assign(new Error('חסר GEMINI_API_KEY בקובץ bot/.env'), { status: 500 });

  const all = models.flatMap((model) => keys.map((key, k) => ({ model, key, label: `${model} (key ${k + 1})` })));
  const ready = all.filter((a) => !(coolingUntil.get(a.label) > Date.now()));
  const attempts = ready.length ? ready : all;

  for (const [i, { model, key, label }] of attempts.entries()) {
    let res;
    let data;
    try {
      const last = i === attempts.length - 1;
      ({ res, data } = await postGemini(model, key, payload, thinking, last ? ATTEMPT_TIMEOUT_MS : timeoutMs));
    } catch (err) {
      res = { ok: false, status: 504 }; // timeout or network error
      data = { error: { message: err.name } };
    }
    if (res.ok) return data;
    const busy = [429, 503, 504].includes(res.status);
    const quotaGone = res.status === 429 && /quota/i.test(data?.error?.message || '');
    if (busy) coolingUntil.set(label, Date.now() + (quotaGone ? QUOTA_COOLDOWN_MS : res.status === 504 ? HANG_COOLDOWN_MS : COOLDOWN_MS));
    const retryable = busy || res.status === 401 || res.status === 403;
    if (retryable && i < attempts.length - 1) {
      console.warn(`${label} failed (${res.status}), trying ${attempts[i + 1].label}`);
      continue;
    }
    const msg = busy ? 'השרתים של Gemini עמוסים כרגע. נסה שוב בעוד דקה.' : data?.error?.message || 'Gemini error';
    throw Object.assign(new Error(msg), { status: busy ? 503 : res.status });
  }
}

// ---- Voice: Kokoro (open source, Apache-2.0) running locally — free, offline, no network wait.
// Measured on this machine: model loads in ~0.6s once downloaded, a short sentence takes ~0.8s.
// Every sentence is cached on disk, so lesson sentences are generated only once.

export const VOICES = ['af_heart', 'af_bella', 'am_michael', 'bf_emma', 'bm_george'];
const KOKORO_MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const TTS_DIR = path.join(DATA_DIR, 'tts');

let kokoro = null;
function loadKokoro() {
  if (!kokoro) {
    // imported lazily: the model runtime is heavy and tests never need it
    kokoro = import('kokoro-js').then(({ KokoroTTS }) => KokoroTTS.from_pretrained(KOKORO_MODEL, { dtype: 'q8', device: 'cpu' }));
    kokoro.catch(() => { kokoro = null; });
  }
  return kokoro;
}

let synthesize = async (text, voice) => Buffer.from((await (await loadKokoro()).generate(text, { voice })).toWav());
export function setSynthesizer(fn) { synthesize = fn; } // tests replace the model

// One sentence at a time (parallel runs only fight over the CPU). A sentence the learner is waiting
// to hear ("urgent") jumps ahead of background prefetching, so a click never waits behind a lesson.
const ttsQueue = { urgent: [], later: [] };
const ttsJobs = new Map(); // cache file -> queued/running job
let ttsBusy = false;

async function pumpTts() {
  if (ttsBusy) return;
  const job = ttsQueue.urgent.shift() || ttsQueue.later.shift();
  if (!job) return;
  ttsBusy = true;
  try {
    const wav = await synthesize(job.text, job.voice);
    fs.mkdirSync(TTS_DIR, { recursive: true });
    fs.writeFileSync(job.file, wav);
    job.resolve(wav);
  } catch (err) {
    job.reject(Object.assign(err, { status: 502 }));
  } finally {
    ttsJobs.delete(job.file);
    ttsBusy = false;
    pumpTts();
  }
}

async function tts({ text = '', voice = VOICES[0], urgent = false }) {
  text = String(text).trim();
  if (!text || text.length > 600) throw Object.assign(new Error('Invalid text'), { status: 400 });
  if (!VOICES.includes(voice)) throw Object.assign(new Error('Unknown voice'), { status: 400 });
  const file = path.join(TTS_DIR, `${createHash('sha1').update(`kokoro|${voice}|${text}`).digest('hex')}.wav`);
  if (fs.existsSync(file)) return fs.readFileSync(file);
  let job = ttsJobs.get(file);
  if (!job) {
    job = { file, text, voice };
    job.promise = new Promise((resolve, reject) => Object.assign(job, { resolve, reject }));
    ttsJobs.set(file, job);
    (urgent ? ttsQueue.urgent : ttsQueue.later).push(job);
  } else if (urgent && ttsQueue.later.includes(job)) {
    // was only prefetched, now someone is waiting for it
    ttsQueue.later.splice(ttsQueue.later.indexOf(job), 1);
    ttsQueue.urgent.push(job);
  }
  pumpTts();
  return job.promise;
}

function chat({ messages = [], mode = 'free', unitId }) {
  const unit = UNITS.find((u) => u.id === unitId);
  const opener = mode === 'mission' && unit ? unit.mission.opener_en : FREE_TALK.opener_en;
  const contents = messages.slice(-20).map((m) => ({
    role: m.role === 'bot' ? 'model' : 'user',
    parts: [{ text: String(m.text || '') }],
  }));
  // Gemini expects the conversation to start with the user
  if (contents[0]?.role !== 'user') contents.unshift({ role: 'user', parts: [{ text: '(The student opened the conversation screen.)' }] });
  if (contents.length === 1) contents.push({ role: 'model', parts: [{ text: opener }] });
  return callGemini({
    system: tutorPrompt({ mode, unit, progress: readProgress() }), contents, schema: CHAT_SCHEMA,
    models: CHAT_MODELS, thinking: 'low', timeoutMs: CHAT_TIMEOUT_MS,
  });
}

async function checkPronunciation({ audio, mimeType = 'audio/wav', target = '' }) {
  if (!audio) throw Object.assign(new Error('לא התקבלה הקלטה'), { status: 400 });
  const audioPart = { inlineData: { mimeType, data: audio } };
  const [blind, coach] = await Promise.allSettled([
    callGemini({ system: BLIND_PROMPT, contents: [{ role: 'user', parts: [audioPart] }], schema: BLIND_SCHEMA, temperature: 0, thinking: 'low' }),
    callGemini({
      system: pronouncePrompt(target),
      contents: [{ role: 'user', parts: [audioPart, { text: 'Check my pronunciation.' }] }],
      schema: PRONOUNCE_SCHEMA,
      temperature: 0.2, // full thinking on purpose: 'low' was measured to miss errors (58 -> 92 on a wrong recording)
    }),
  ]);
  if (coach.status === 'rejected') throw coach.reason;
  const result = coach.value;
  const blindSilent = blind.status === 'fulfilled' && (blind.value.speech_detected === false || !String(blind.value.transcript || '').trim());
  // never show a score for a recording without speech, whatever the coach says
  return blindSilent || result.speech_detected === false || !String(result.heard || '').trim() ? NO_SPEECH : result;
}

function placement({ answer = '' }) {
  if (!answer.trim()) return { level: 'A0', feedback_he: 'זה בסדר גמור להתחיל מאפס. נבנה את זה יחד, צעד אחרי צעד.' };
  return callGemini({
    system: PLACEMENT_PROMPT,
    contents: [{ role: 'user', parts: [{ text: answer.slice(0, 2000) }] }],
    schema: PLACEMENT_SCHEMA,
    temperature: 0.2,
    thinking: 'low',
  });
}

// ---- HTTP ----

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw Object.assign(new Error('הבקשה גדולה מדי'), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    throw Object.assign(new Error('Invalid JSON'), { status: 400 });
  }
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

const API = {
  'GET /api/progress': () => readProgress(),
  'PUT /api/progress': (input) => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw Object.assign(new Error('Invalid progress'), { status: 400 });
    writeProgress(input);
    return { ok: true };
  },
  'POST /api/chat': chat,
  'POST /api/pronounce': checkPronunciation,
  'POST /api/placement': placement,
  'POST /api/tts': tts,
};

export async function handler(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');
  const api = API[`${req.method} ${pathname}`];
  if (api) {
    try {
      const input = req.method === 'GET' ? {} : await readJson(req);
      const result = await api(input);
      return Buffer.isBuffer(result) ? send(res, 200, result, 'audio/wav') : send(res, 200, result);
    } catch (err) {
      console.error(err.message);
      return send(res, err.status || 500, { error: err.message });
    }
  }
  if (req.method === 'GET') {
    const file = path.resolve(PUBLIC_DIR, `.${pathname === '/' ? '/index.html' : decodeURIComponent(pathname)}`);
    if (file.startsWith(PUBLIC_DIR + path.sep) && TYPES[path.extname(file)] && fs.existsSync(file)) {
      return send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)]);
    }
  }
  send(res, 404, { error: 'Not found' });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  http.createServer(handler).listen(PORT, () => console.log(`English bot: http://localhost:${PORT}`));
  // warm the voice up so the first sentence is not slow (the first run also downloads the model, ~90MB)
  loadKokoro()
    .then((model) => model.generate('Hi.', { voice: VOICES[0] }))
    .then(() => console.log('Voice ready'))
    .catch((err) => console.error('Voice failed to load, the browser voice will be used:', err.message));
}
