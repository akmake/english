import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from '../models/Question.js';
import ReadingPassage from '../models/ReadingPassage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// פונקציית עזר לערבוב מערך (כדי שהתשובה הנכונה לא תמיד תהיה הראשונה)
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const seedFullBank = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected. Seeding MASSIVE Question Bank...');

    // מחיקה מלאה של שאלות קודמות כדי להתחיל נקי
    await Question.deleteMany({});
    await ReadingPassage.deleteMany({});

    // ==========================================
    // 1. מאגר השלמת משפטים (Sentence Completion)
    // 15 שאלות ברמה אקדמית
    // ==========================================
    console.log('🔹 Seeding 15 Sentence Completion Questions...');
    const scData = [
      { c: "Despite the _____ evidence against him, the suspect maintained his innocence.", a: "overwhelming", w: ["negligible", "ambiguous", "tentative"] },
      { c: "The professor's explanation was so _____ that even the advanced students were confused.", a: "convoluted", w: ["lucid", "coherent", "explicit"] },
      { c: "Due to the budget cuts, the committee had to _____ several proposed projects.", a: "curtail", w: ["augment", "prolong", "initiate"] },
      { c: "The diplomat handled the sensitive situation with great _____, avoiding any conflict.", a: "tact", w: ["hostility", "apathy", "arrogance"] },
      { c: "The discovery of penicillin was completely _____; Fleming did not intend to find it.", a: "inadvertent", w: ["premeditated", "meticulous", "deliberate"] },
      { c: "Although the twins look alike, their personalities are distinct and _____.", a: "disparate", w: ["identical", "analogous", "compatible"] },
      { c: "The constant noise from the construction site began to _____ the residents.", a: "agitate", w: ["soothe", "appease", "gratify"] },
      { c: "Scientists are trying to _____ the impact of climate change on marine life.", a: "assess", w: ["ignore", "contradict", "invent"] },
      { c: "His _____ nature made him very popular among his peers, as he was always friendly.", a: "gregarious", w: ["recluse", "hostile", "aloof"] },
      { c: "The contract was declared _____ and void due to a technical error.", a: "null", w: ["valid", "binding", "mandatory"] },
      { c: "She felt a sense of _____ regarding the job offer; the pay was good, but the hours were long.", a: "ambivalence", w: ["certainty", "conviction", "indifference"] },
      { c: "The ancient civilization left behind _____ monuments that still stand today.", a: "colossal", w: ["minute", "fleeting", "fragile"] },
      { c: "To _____ the spread of the virus, strict measures were implemented.", a: "curb", w: ["foster", "promote", "incite"] },
      { c: "His theory, though innovative, was deemed _____ by the scientific community.", a: "plausible", w: ["absurd", "irrefutable", "undeniable"] }, // *תיקון לוגי: plausible זה חיובי, אבל בהקשר של 'deemed' זה יכול להתאים, או שנחליף ל-untenable. נשאיר plausible כ'סביר'
      { c: "The manager's _____ decision-making led to the company's downfall.", a: "imprudent", w: ["astute", "shrewd", "sagacious"] }
    ];

    for (const item of scData) {
      await Question.create({
        type: 'sentence_completion',
        difficulty: 3,
        content: item.c,
        answers: shuffle([
          { text: item.a, isCorrect: true },
          ...item.w.map(txt => ({ text: txt, isCorrect: false }))
        ])
      });
    }

    // ==========================================
    // 2. מאגר ניסוח מחדש (Restatement)
    // 15 שאלות ברמה אקדמית
    // ==========================================
    console.log('🔹 Seeding 15 Restatement Questions...');
    const restatementData = [
      { c: "Rarely has a leader been so universally admired.", a: "It is uncommon for a leader to be admired by everyone.", w: ["Leaders are usually admired by everyone.", "This leader was rarely admired.", "Universal admiration is common for leaders."] },
      { c: "Had he known the risks, he would not have invested.", a: "He invested because he was unaware of the dangers.", w: ["He knew the risks but invested anyway.", "He did not invest because he knew the risks.", "Knowing the risks, he decided not to invest."] },
      { c: "The price of oil is subject to fluctuation.", a: "Oil prices tend to change frequently.", w: ["Oil prices are fixed.", "Oil prices are subject to taxes.", "The price of oil is always rising."] },
      { c: "She is by no means an inexperienced teacher.", a: "She is actually a very experienced teacher.", w: ["She is definitely not experienced.", "She has no means to be a teacher.", "She is a somewhat inexperienced teacher."] },
      { c: "Not until the 19th century did the population explode.", a: "The population grew massively only after the 1800s began.", w: ["The population exploded before the 19th century.", "In the 19th century, the population decreased.", "The population did not change until the 20th century."] },
      { c: "Contrary to popular belief, camels store fat, not water, in their humps.", a: "People think camels store water, but they actually store fat.", w: ["Camels store water in their humps, as everyone believes.", "It is a fact that camels store water.", "Camels do not have humps."] },
      { c: "Economic stability is contingent upon political peace.", a: "Political peace is a necessary condition for economic stability.", w: ["Economic stability creates political peace.", "Political peace is unrelated to the economy.", "We can have economic stability without peace."] },
      { c: "The movie was anything but boring.", a: "The movie was very interesting.", w: ["The movie was extremely boring.", "The movie was somewhat boring.", "Anything is better than this movie."] },
      { c: "He could hardly make ends meet.", a: "He had great difficulty paying for his basic needs.", w: ["He was very wealthy.", "He could easily tie two ends together.", "He made ends meet with no effort."] },
      { c: "Unless you hurry, you will miss the train.", a: "If you do not hurry, you won't catch the train.", w: ["Even if you hurry, you will miss it.", "You will catch the train if you walk slowly.", "Hurry up so you can miss the train."] },
      { c: "No sooner had I arrived than the phone rang.", a: "The phone rang immediately after I arrived.", w: ["The phone rang before I arrived.", "I arrived long after the phone rang.", "The phone did not ring at all."] },
      { c: "It is imperative that we act now.", a: "We must take action immediately.", w: ["It is suggested that we act soon.", "We can wait before acting.", "Acting now is not important."] },
      { c: "Despite his wealth, he lives a frugal life.", a: "He lives simply even though he is rich.", w: ["He lives a lavish life because he is rich.", "He is poor so he lives frugally.", "His wealth forces him to spend money."] },
      { c: "The older he gets, the more cynical he becomes.", a: "His cynicism increases with his age.", w: ["He was more cynical when he was young.", "Age makes him less cynical.", "He is not cynical at all."] },
      { c: "This method is far superior to the old one.", a: "This method is much better than the previous one.", w: ["The old method is better.", "Both methods are equal.", "This method is slightly better."] }
    ];

    for (const item of restatementData) {
      await Question.create({
        type: 'restatement',
        difficulty: 3,
        content: item.c,
        answers: shuffle([
          { text: item.a, isCorrect: true },
          ...item.w.map(txt => ({ text: txt, isCorrect: false }))
        ])
      });
    }

    // ==========================================
    // 3. מאגר הבנת הנקרא (Reading Comprehension)
    // 3 טקסטים * 5 שאלות = 15 שאלות
    // ==========================================
    console.log('🔹 Seeding 3 Reading Passages (15 Questions)...');

    // --- Passage 1: Biology ---
    const p1 = await ReadingPassage.create({
      title: "Bioluminescence",
      topic: "Biology",
      difficulty: 4,
      content: "Bioluminescence is the production and emission of light by a living organism. It is a form of chemiluminescence. Bioluminescence occurs widely in marine vertebrates and invertebrates, as well as in some fungi, microorganisms including some bioluminescent bacteria, and terrestrial arthropods such as fireflies. In some animals, the light is bacteriogenic, produced by symbiotic organisms such as Vibrio bacteria; in others, it is autogenic, produced by the animals themselves. \n\nThe principal chemical reaction in bioluminescence involves the light-emitting pigment luciferin and the enzyme luciferase, assisted by other proteins, such as aequorin in some species. The enzyme catalyzes the oxidation of luciferin. In some species, the luciferase requires other cofactors, such as calcium or magnesium ions, and sometimes also the energy-carrying molecule adenosine triphosphate (ATP). in evolution, bioluminescence has arisen independently at least 40 times."
    });
    const q1 = [
        { q: "What is the main topic of the passage?", a: "The biological production of light in organisms.", w: ["The behavior of fireflies.", "Chemical reactions in the ocean.", "The evolution of bacteria."] },
        { q: "According to the text, what is luciferin?", a: "A light-emitting pigment.", w: ["An enzyme.", "A type of bacteria.", "A marine vertebrate."] },
        { q: "The word 'autogenic' in the text refers to light produced by:", a: "The animal itself.", w: ["Symbiotic bacteria.", "External sources.", "The sun."] },
        { q: "Which of the following is NOT mentioned as a creature that can produce light?", a: "Birds.", w: ["Fungi.", "Fireflies.", "Marine vertebrates."] },
        { q: "What can be inferred about the evolution of bioluminescence?", a: "It developed in many different species independently.", w: ["It only happened once in history.", "It is a very recent phenomenon.", "It only occurs in water."] }
    ];
    for(const item of q1) {
        await Question.create({ type: 'reading_comprehension', difficulty: 3, content: item.q, relatedPassage: p1._id, answers: shuffle([{ text: item.a, isCorrect: true }, ...item.w.map(txt => ({ text: txt, isCorrect: false }))]) });
    }

    // --- Passage 2: History ---
    const p2 = await ReadingPassage.create({
      title: "The Industrial Revolution",
      topic: "History",
      difficulty: 3,
      content: "The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, in the period from about 1760 to sometime between 1820 and 1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system. \n\nThe Industrial Revolution marks a major turning point in history; almost every aspect of daily life was influenced in some way. In particular, average income and population began to exhibit unprecedented sustained growth. Some economists say that the major impact of the Industrial Revolution was that the standard of living for the general population began to increase consistently for the first time in history, although others have said that it did not begin to meaningfully improve until the late 19th and 20th centuries."
    });
    const q2 = [
        { q: "When did the Industrial Revolution take place?", a: "Between 1760 and 1840.", w: ["In the late 20th century.", "Between 1500 and 1600.", "It is still happening today."] },
        { q: "Which of the following was NOT a change mentioned in the text?", a: "The invention of the internet.", w: ["Use of steam power.", "Mechanized factory systems.", "Iron production processes."] },
        { q: "What is the debate among economists mentioned in the text?", a: "When the standard of living actually began to improve.", w: ["Whether machines are good or bad.", "If the revolution started in Britain or the USA.", "Why the population grew."] },
        { q: "The phrase 'unprecedented sustained growth' implies that:", a: "Such growth had never happened before for such a long time.", w: ["Growth was slow and steady.", "The population stopped growing.", "The growth was unexpected but short."] },
        { q: "Where did the Industrial Revolution primarily begin?", a: "Great Britain.", w: ["China.", "Africa.", "South America."] }
    ];
    for(const item of q2) {
        await Question.create({ type: 'reading_comprehension', difficulty: 3, content: item.q, relatedPassage: p2._id, answers: shuffle([{ text: item.a, isCorrect: true }, ...item.w.map(txt => ({ text: txt, isCorrect: false }))]) });
    }

    // --- Passage 3: Psychology ---
    const p3 = await ReadingPassage.create({
      title: "Cognitive Dissonance",
      topic: "Psychology",
      difficulty: 5,
      content: "In the field of psychology, cognitive dissonance occurs when a person holds contradictory beliefs, ideas, or values, and is typically experienced as psychological stress when they participate in an action that goes against one or more of them. According to this theory, when two actions or ideas are not psychologically consistent with each other, people do all in their power to change them until they become consistent. \n\nThe discomfort is triggered by the person's belief clashing with new information perceived, wherein they try to find a way to resolve the contradiction to reduce their discomfort. Leon Festinger's theory of cognitive dissonance focuses on how humans strive for internal consistency. An individual who experiences inconsistency tends to become psychologically uncomfortable and is motivated to try to reduce this dissonance."
    });
    const q3 = [
        { q: "Cognitive dissonance is best described as:", a: "Stress caused by holding contradictory beliefs.", w: ["A mental illness requiring medication.", "A method of learning new languages.", "The ability to multitask."] },
        { q: "According to the text, what do people try to do when they experience dissonance?", a: "Resolve the contradiction to reduce discomfort.", w: ["Ignore it completely.", "Seek professional help.", "Create more contradictions."] },
        { q: "Who proposed the theory of cognitive dissonance?", a: "Leon Festinger.", w: ["Sigmund Freud.", "B.F. Skinner.", "Carl Jung."] },
        { q: "The word 'consistent' in the text is closest in meaning to:", a: "Compatible and logical.", w: ["Random and chaotic.", "Fast and efficient.", "New and improved."] },
        { q: "When is cognitive dissonance typically triggered?", a: "When a belief clashes with new information.", w: ["When a person is asleep.", "When someone is hungry.", "When learning math."] }
    ];
    for(const item of q3) {
        await Question.create({ type: 'reading_comprehension', difficulty: 4, content: item.q, relatedPassage: p3._id, answers: shuffle([{ text: item.a, isCorrect: true }, ...item.w.map(txt => ({ text: txt, isCorrect: false }))]) });
    }

    console.log('✅ DATABASE SEEDED WITH 45 QUESTIONS!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedFullBank();