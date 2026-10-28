import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDays, addReviewItem, gradeItem, dueKeys, bumpStreak, currentStreak,
  checkAnswer, vocabLevel, finalLevel, PLACEMENT_WORDS,
} from '../public/learning.js';
import { UNITS } from '../public/curriculum.js';

test('answer check accepts speech/typing variants of the right answer', () => {
  const ok = (answer, target) => assert.ok(checkAnswer(answer, [target]).correct, `${answer} ~ ${target}`);
  ok("It's 7:00", "It's seven o'clock.".replace(" o'clock", '')); // speech recognition writes digits
  ok('it is seven', "It's seven.");
  ok('i dont understand', "I don't understand.");
  ok('im lost', "I'm lost.");
  ok('Nice to meet yuo', 'Nice to meet you.'); // small typo
  ok('how much is this', 'How much is this?');
});

test('answer check rejects wrong meaning', () => {
  const bad = (answer, target) => assert.ok(!checkAnswer(answer, [target]).correct, `${answer} !~ ${target}`);
  bad('I like sport', "I don't like sport.");
  bad('I live in Haifa', 'I live in Jerusalem.');
  bad('', 'Me too!');
  bad('we are busy', "We're busy.".replace("We're", 'were'));
});

test('spaced repetition: new item due tomorrow, correct moves up, wrong resets', () => {
  const review = {};
  const day = '2026-10-28';
  const key = addReviewItem(review, { en: 'hello', he: 'שלום', type: 'word' }, day);
  assert.equal(review[key].due, '2026-10-29');
  assert.deepEqual(dueKeys(review, day), []);
  assert.deepEqual(dueKeys(review, '2026-10-29'), [key]);

  gradeItem(review, key, true, '2026-10-29');
  assert.equal(review[key].box, 2);
  assert.equal(review[key].due, '2026-11-01');

  gradeItem(review, key, false, '2026-11-01');
  assert.equal(review[key].box, 1);
  assert.equal(review[key].lapses, 1);
  assert.equal(review[key].due, '2026-11-02');

  // adding the same text again keeps its history
  addReviewItem(review, { en: 'Hello', he: 'שלום', type: 'word' }, '2026-11-05');
  assert.equal(review[key].lapses, 1);
});

test('dates cross month and year boundaries', () => {
  assert.equal(addDays('2026-01-31', 1), '2026-02-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
});

test('streak counts consecutive days and resets after a gap', () => {
  let s = bumpStreak(undefined, '2026-10-01');
  assert.equal(s.count, 1);
  s = bumpStreak(s, '2026-10-01');
  assert.equal(s.count, 1);
  s = bumpStreak(s, '2026-10-02');
  assert.equal(s.count, 2);
  assert.equal(currentStreak(s, '2026-10-03'), 2); // still alive until the day ends
  assert.equal(currentStreak(s, '2026-10-04'), 0);
  assert.equal(bumpStreak(s, '2026-10-05').count, 1);
});

test('placement level from vocabulary and speaking', () => {
  const results = (a1, a2, b1) => PLACEMENT_WORDS.map((w, i) => ({
    band: w.band, correct: i % 4 < { A1: a1, A2: a2, B1: b1 }[w.band],
  }));
  assert.equal(vocabLevel(results(1, 0, 0)), 'A0');
  assert.equal(vocabLevel(results(4, 2, 0)), 'A1');
  assert.equal(vocabLevel(results(4, 3, 1)), 'A2');
  assert.equal(vocabLevel(results(4, 4, 3)), 'B1');
  assert.equal(finalLevel('B1', 'A1'), 'A1'); // knows words but cannot speak yet
  assert.equal(finalLevel('A1', 'B1'), 'A1');
});

test('curriculum is complete and consistent', () => {
  assert.equal(UNITS.length, 10);
  assert.equal(new Set(UNITS.map((u) => u.id)).size, UNITS.length);
  for (const u of UNITS) {
    const where = u.id;
    for (const f of ['title_he', 'title_en', 'goal_he']) assert.ok(u[f], `${where} ${f}`);
    assert.equal(u.words.length, 10, `${where} words`);
    assert.equal(u.phrases.length, 6, `${where} phrases`);
    assert.equal(u.practice.length, 4, `${where} practice`);
    for (const w of u.words) for (const f of ['en', 'he', 'ex_en', 'ex_he']) assert.ok(w[f], `${where} word ${w.en} ${f}`);
    for (const f of ['scenario_en', 'task_he', 'opener_en', 'hint_en']) assert.ok(u.mission[f], `${where} mission ${f}`);
    // quiz options must be distinguishable
    assert.equal(new Set(u.words.map((w) => w.en)).size, 10, `${where} duplicate word`);
    assert.equal(new Set(u.phrases.map((p) => p.he)).size, 6, `${where} duplicate phrase meaning`);
    for (const p of u.practice) assert.ok(checkAnswer(p.en, [p.en, ...(p.alt || [])]).correct, `${where} ${p.en}`);
  }
});
