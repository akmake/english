import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Isolated data dir and fake keys; Gemini itself is replaced by a stub below.
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'english-bot-'));
process.env.DATA_DIR = dataDir;
process.env.GEMINI_API_KEY = 'free-key';
process.env.GEMINI_API_KEY_PAID = 'paid-key';

const realFetch = globalThis.fetch;
let geminiCalls = [];
let geminiReplies = [];
globalThis.fetch = async (url, init) => {
  if (!String(url).includes('generativelanguage.googleapis.com')) return realFetch(url, init);
  geminiCalls.push({ url: String(url), key: init.headers['x-goog-api-key'], body: JSON.parse(init.body) });
  const { status, json, hang } = geminiReplies.shift() ?? { status: 500, json: { error: { message: 'no stub' } } };
  // a key that never answers: only the request timeout ends it
  if (hang) return new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason)));
  return new Response(JSON.stringify(json), { status });
};
const geminiOk = (obj) => ({ status: 200, json: { candidates: [{ content: { parts: [{ text: JSON.stringify(obj) }] } }] } });

const { handler, setSynthesizer, resetCooldowns } = await import('../server.js');

// The Kokoro model is replaced by a stub that records the order of generated sentences.
let synthCalls = [];
let synthDelay = 0;
setSynthesizer(async (text, voice) => {
  synthCalls.push(text);
  await new Promise((r) => setTimeout(r, synthDelay));
  return Buffer.concat([Buffer.from('RIFF'), Buffer.from(`${voice}|${text}`)]);
});
let server;
let base;

before(async () => {
  server = http.createServer(handler);
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});
after(() => {
  server.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});
beforeEach(() => { geminiCalls = []; geminiReplies = []; });

const post = (p, body, method = 'POST') => realFetch(base + p, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('serves the app and its modules', async () => {
  const page = await realFetch(`${base}/`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /app\.js/);
  const js = await realFetch(`${base}/curriculum.js`);
  assert.equal(js.status, 200);
  assert.match(js.headers.get('content-type'), /javascript/);
});

test('does not serve files outside public/', async () => {
  assert.equal((await realFetch(`${base}/%2e%2e/server.js`)).status, 404);
  assert.equal((await realFetch(`${base}/..%2f.env`)).status, 404);
});

test('progress is saved and loaded', async () => {
  const progress = { profile: { level: 'A1', placementDone: true }, units: { 'a1-01': { completed: true } } };
  assert.equal((await post('/api/progress', progress, 'PUT')).status, 200);
  assert.deepEqual(await (await realFetch(`${base}/api/progress`)).json(), progress);
  assert.equal((await post('/api/progress', [1, 2], 'PUT')).status, 400);
});

test('mission chat sends lesson context and the learner level to Gemini', async () => {
  const reply = { reply_en: 'Nice to meet you too!', say_it: '', correction: '', hebrew_help: '', new_words: [], hint_en: 'How are you?', mission_done: true };
  geminiReplies.push(geminiOk(reply));
  const res = await post('/api/chat', { mode: 'mission', unitId: 'a1-01', messages: [{ role: 'bot', text: 'Hi! I am Sam.' }, { role: 'user', text: 'Hi Sam, I am Avi' }] });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), reply);

  const { body } = geminiCalls[0];
  const system = body.systemInstruction.parts[0].text;
  assert.match(system, /level is A1/); // from the saved progress above
  assert.match(system, /Nice to meet you\./); // unit phrases
  assert.equal(body.contents[0].role, 'user'); // Gemini needs the user first
});

test('busy model falls back to the paid key before a weaker model', async () => {
  geminiReplies.push({ status: 503, json: { error: { message: 'busy' } } }, geminiOk({ level: 'A2', feedback_he: 'יפה' }));
  const res = await post('/api/placement', { answer: 'My name is Avi and I live in Tel Aviv.' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).level, 'A2');
  assert.deepEqual(geminiCalls.map((c) => c.key), ['free-key', 'paid-key']);
  assert.equal(new URL(geminiCalls[0].url).pathname, new URL(geminiCalls[1].url).pathname);
});

test('a key that just failed is skipped on the next request', async () => {
  geminiReplies.push(geminiOk({ level: 'A1', feedback_he: 'יפה' }));
  await post('/api/placement', { answer: 'My name is Avi.' });
  assert.deepEqual(geminiCalls.map((c) => c.key), ['paid-key']);
});

const chatReply = { reply_en: 'Hi!', say_it: '', correction: '', hebrew_help: '', new_words: [], hint_en: '', mission_done: false };

test('chat uses the fast flash-lite model, without a thinking setting', async () => {
  geminiReplies.push(geminiOk(chatReply));
  await post('/api/chat', { mode: 'free', messages: [{ role: 'user', text: 'hello' }] });
  assert.match(geminiCalls[0].url, /gemini-3\.5-flash-lite:/);
  assert.equal(geminiCalls[0].body.generationConfig.thinkingConfig, undefined);
});

test('a hanging key delays a chat reply by at most ~2.5s, then is skipped', async () => {
  resetCooldowns();
  geminiReplies.push({ hang: true }, geminiOk(chatReply));
  const t = Date.now();
  const res = await post('/api/chat', { mode: 'free', messages: [{ role: 'user', text: 'hello' }] });
  const ms = Date.now() - t;
  assert.equal(res.status, 200);
  assert.ok(ms >= 2400 && ms < 4000, `took ${ms}ms`);
  geminiCalls = [];
  geminiReplies.push(geminiOk(chatReply));
  await post('/api/chat', { mode: 'free', messages: [{ role: 'user', text: 'hello again' }] });
  assert.deepEqual(geminiCalls.map((c) => c.key), ['paid-key']);
});

test('an exhausted free quota is not retried on the next messages', async () => {
  resetCooldowns();
  geminiReplies.push({ status: 429, json: { error: { message: 'You exceeded your current quota, please check your plan' } } }, geminiOk(chatReply));
  await post('/api/chat', { mode: 'free', messages: [{ role: 'user', text: 'hello' }] });
  assert.deepEqual(geminiCalls.map((c) => c.key), ['free-key', 'paid-key']);
  geminiCalls = [];
  geminiReplies.push(geminiOk(chatReply));
  await post('/api/chat', { mode: 'free', messages: [{ role: 'user', text: 'hello again' }] });
  assert.deepEqual(geminiCalls.map((c) => c.key), ['paid-key']); // straight to the working key
});

test('empty placement answer is A0 without calling Gemini', async () => {
  const res = await post('/api/placement', { answer: '' });
  assert.equal((await res.json()).level, 'A0');
  assert.equal(geminiCalls.length, 0);
});

test('pronunciation: no speech in the blind check means score 0, even if the coach "heard" the target', async () => {
  geminiReplies.push(
    geminiOk({ speech_detected: false, transcript: '' }), // blind transcriber
    geminiOk({ speech_detected: true, heard: 'Nice to meet you', score: 98, issues: [], summary_he: 'מצוין' }), // coach
  );
  const r = await (await post('/api/pronounce', { audio: 'AAAA', target: 'Nice to meet you.' })).json();
  assert.equal(r.score, 0);
  assert.equal(r.speech_detected, false);
  assert.equal(geminiCalls.length, 2);
});

test('pronunciation: real speech returns the coach result', async () => {
  const coach = { speech_detected: true, heard: 'ai sink zis', score: 60, issues: [{ word: 'think', tip_he: 'ת׳' }], summary_he: 'יפה' };
  geminiReplies.push(geminiOk({ speech_detected: true, transcript: 'I think this' }), geminiOk(coach));
  const r = await (await post('/api/pronounce', { audio: 'AAAA', target: 'I think this' })).json();
  assert.deepEqual(r, coach);
});

test('voice: local Kokoro, WAV response, repeats served from the disk cache, no Gemini call', async () => {
  synthCalls = [];
  const first = await post('/api/tts', { text: 'Nice to meet you.', voice: 'am_michael' });
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('content-type'), 'audio/wav');
  assert.equal(Buffer.from(await first.arrayBuffer()).toString(), 'RIFFam_michael|Nice to meet you.');
  const again = await post('/api/tts', { text: 'Nice to meet you.', voice: 'am_michael' });
  assert.equal(again.status, 200);
  assert.deepEqual(synthCalls, ['Nice to meet you.']); // generated once
  assert.equal(geminiCalls.length, 0);
  assert.equal((await post('/api/tts', { text: 'Hello', voice: 'Kore' })).status, 400); // old Gemini voice
  assert.equal((await post('/api/tts', { text: '' })).status, 400);
});

test('voice: a sentence the learner is waiting for jumps ahead of background prefetch', async () => {
  synthCalls = [];
  synthDelay = 30;
  const later = ['One.', 'Two.', 'Three.', 'Four.'].map((text) => post('/api/tts', { text, voice: 'af_heart' }));
  await new Promise((r) => setTimeout(r, 10)); // "One." is already being generated
  const urgent = post('/api/tts', { text: 'Four.', voice: 'af_heart', urgent: true }); // was queued last
  await Promise.all([...later, urgent]);
  synthDelay = 0;
  assert.deepEqual(synthCalls, ['One.', 'Four.', 'Two.', 'Three.']);
});

test('pronunciation check requires audio', async () => {
  assert.equal((await post('/api/pronounce', {})).status, 400);
});
