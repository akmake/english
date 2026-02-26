// src/utils/gameUtils.js

/**
 * מערבב מערך בצורה אקראית (Fisher-Yates Shuffle)
 * מבטיח שהסדר יהיה שונה בכל פעם
 */
export const shuffleArray = (array) => {
  if (!array || !Array.isArray(array)) return [];
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

/**
 * מייצר מסיחים למקרה שאין כאלו מהשרת
 * לוקח מילים אקראיות אחרות מהסשן הנוכחי
 */
export const generateFallbacks = (targetWord, allCards, count = 3) => {
  const others = allCards.filter(c => c._id !== targetWord._id);
  const shuffled = shuffleArray(others);
  return shuffled.slice(0, count).map(c => c.hebrew); // מניח שהתשובה היא בעברית
};