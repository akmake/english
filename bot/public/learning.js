// Pure learning logic shared by the browser and the tests (no DOM, no network).

export const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2'];
export const LEVEL_HE = { A0: 'מתחיל מאפס', A1: 'מתחיל', A2: 'בסיסי', B1: 'עצמאי', B2: 'שוטף' };

// ---- Dates (local calendar days as YYYY-MM-DD) ----

export function today(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  return today(new Date(y, m - 1, d + n));
}

// ---- Spaced repetition (Leitner boxes) ----
// Box N waits INTERVALS[N] days. A correct answer moves up a box, a wrong one
// goes back to box 1 (tomorrow), so weak items come back often.

export const INTERVALS = [0, 1, 3, 7, 14, 30, 60];

export function addReviewItem(review, { en, he, type }, day) {
  const key = normalize(en);
  if (!review[key]) review[key] = { en, he, type, box: 1, due: addDays(day, INTERVALS[1]), lapses: 0 };
  return key;
}

export function gradeItem(review, key, correct, day) {
  const item = review[key];
  if (!item) return;
  item.box = correct ? Math.min(item.box + 1, INTERVALS.length - 1) : 1;
  if (!correct) item.lapses += 1;
  item.due = addDays(day, INTERVALS[item.box]);
}

export function dueKeys(review, day) {
  return Object.keys(review)
    .filter((k) => review[k].due <= day)
    .sort((a, b) => review[a].due.localeCompare(review[b].due) || review[b].lapses - review[a].lapses);
}

// ---- Daily streak ----

export function bumpStreak(streak, day) {
  const s = streak || { count: 0, lastDay: null };
  if (s.lastDay === day) return s;
  return { count: s.lastDay === addDays(day, -1) ? s.count + 1 : 1, lastDay: day };
}

export function currentStreak(streak, day) {
  if (!streak?.lastDay) return 0;
  return streak.lastDay === day || streak.lastDay === addDays(day, -1) ? streak.count : 0;
}

// ---- Answer checking (typed or from speech recognition) ----

const CONTRACTIONS = {
  "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is',
  "that's": 'that is', "what's": 'what is', "where's": 'where is', "we're": 'we are',
  "they're": 'they are', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
  "can't": 'cannot', "won't": 'will not', "isn't": 'is not', "aren't": 'are not',
  "i'd": 'i would', "i'll": 'i will', "let's": 'let us', "we've": 'we have',
};
// without the apostrophe these are real words ("were", "ill", "lets")
const APOSTROPHE_REQUIRED = new Set(["we're", "i'll", "let's"]);
const NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

export function normalize(text) {
  let t = String(text).toLowerCase().replace(/[’‘`]/g, "'");
  t = t.replace(/\b(\d{1,2}):00\b/g, '$1'); // speech recognition writes "7:00"
  t = t.replace(/\b\d{1,2}\b/g, (n) => NUMBERS[Number(n)] ?? n);
  for (const [short, long] of Object.entries(CONTRACTIONS)) {
    // learners often type "dont" / "im" without the apostrophe
    const pattern = APOSTROPHE_REQUIRED.has(short) ? short : short.replace("'", "'?");
    t = t.replace(new RegExp(`\\b${pattern}(?![a-z])`, 'g'), long);
  }
  return t.replace(/'/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function levenshtein(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

export function similarity(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x && !y) return 1;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

// Small slips (a missing letter, "a"/"the") still count; wrong words do not.
export const PASS_SIMILARITY = 0.85;

export function checkAnswer(answer, targets) {
  const best = Math.max(...targets.map((t) => similarity(answer, t)));
  return { correct: best >= PASS_SIMILARITY, score: best };
}

export function hintOf(en) {
  const words = en.split(' ');
  return words.length <= 2 ? `${en[0]}...` : `${words.slice(0, 2).join(' ')} ...`;
}

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- Placement ----
// 4 words per band. A band counts as known with 3 of 4 right.

export const PLACEMENT_WORDS = [
  { en: 'house', he: 'בית', band: 'A1' },
  { en: 'eat', he: 'לאכול', band: 'A1' },
  { en: 'big', he: 'גדול', band: 'A1' },
  { en: 'yesterday', he: 'אתמול', band: 'A1' },
  { en: 'borrow', he: 'לשאול (חפץ), לקחת בהשאלה', band: 'A2' },
  { en: 'already', he: 'כבר', band: 'A2' },
  { en: 'journey', he: 'מסע, נסיעה', band: 'A2' },
  { en: 'improve', he: 'לשפר', band: 'A2' },
  { en: 'although', he: 'למרות ש־', band: 'B1' },
  { en: 'achieve', he: 'להשיג', band: 'B1' },
  { en: 'opinion', he: 'דעה', band: 'B1' },
  { en: 'suggest', he: 'להציע', band: 'B1' },
];

export function vocabLevel(results) {
  const known = (band) => results.filter((r) => r.band === band && r.correct).length >= 3;
  if (!known('A1')) return 'A0';
  if (!known('A2')) return 'A1';
  if (!known('B1')) return 'A2';
  return 'B1';
}

// Speaking is what this app trains, so the start level never goes above it.
export function finalLevel(vocab, speaking) {
  return LEVELS[Math.min(LEVELS.indexOf(vocab), LEVELS.indexOf(speaking))];
}
