// חלק 3: הבנת הנקרא - נתונים לקטעים

// קטע רמה 1 - קל
export const passage1 = {
    title: "My Dog Max (Level 1)",
    topic: "General",
    difficulty: 1,
    content: "I have a dog named Max. Max is a Golden Retriever. He has soft, yellow fur and big brown eyes. Max loves to play in the park. Every afternoon, we go to the park near my house. I throw a ball, and Max runs to catch it. He runs very fast! \n\nMax is also a very friendly dog. He likes to meet other dogs and people. Everyone in the neighborhood knows Max. He never bites anyone. At night, Max sleeps in my room on a small rug. He is my best friend."
};

export const q1Data = [
    { q: "What kind of dog is Max?", a: "A Golden Retriever.", w: ["A Poodle.", "A Bulldog.", "A Cat."] },
    { q: "What does Max love to do?", a: "Play in the park.", w: ["Sleep all day.", "Eat fish.", "Watch TV."] },
    { q: "Where does Max sleep?", a: "On a rug in the room.", w: ["Outside.", "In the kitchen.", "On the bed."] },
    { q: "Why do people like Max?", a: "Because he is friendly.", w: ["Because he is scary.", "Because he bites.", "Because he is small."] },
    { q: "What color are Max's eyes?", a: "Brown.", w: ["Blue.", "Green.", "Red."] }
];

// קטע רמה 2 - בינוני
export const passage2 = {
    title: "The History of Chocolate (Level 2)",
    topic: "History",
    difficulty: 2,
    content: "Chocolate has a long and interesting history. It began in ancient Mexico, where the Maya and Aztec people lived. They grew cacao trees and used the seeds to make a bitter drink. They believed this drink gave them strength and wisdom. In fact, cacao beans were so valuable that they were used as money! \n\nWhen Spanish explorers came to America, they tasted the chocolate drink but found it too bitter. They took the cacao beans back to Europe and added sugar and milk. This made the chocolate sweet and delicious. Soon, chocolate became popular all over Europe, especially among the rich. Today, people everywhere enjoy chocolate in candy, cakes, and drinks."
};

export const q2Data = [
    { q: "Where did chocolate originate?", a: "In ancient Mexico.", w: ["In Spain.", "In Europe.", "In the USA."] },
    { q: "How did the Maya use cacao beans?", a: "To make a drink and as money.", w: ["To build houses.", "To feed animals.", "To make clothes."] },
    { q: "Why did the Spanish add sugar to chocolate?", a: "Because the original drink was too bitter.", w: ["Because they had too much sugar.", "To make it healthier.", "To change the color."] },
    { q: "Who enjoyed chocolate in Europe initially?", a: "Mainly the rich people.", w: ["Only the poor.", "Everyone.", "The soldiers."] },
    { q: "The word 'valuable' in the text means:", a: "Worth a lot.", w: ["Useless.", "Cheap.", "Heavy."] }
];

// קטע רמה 3 - אקדמי
export const passage3 = {
    title: "Neuroplasticity (Level 3)",
    topic: "Science",
    difficulty: 3,
    content: "For decades, the prevailing scientific dogma held that the adult human brain was essentially fixed and immutable. It was believed that once development concluded in early adulthood, no new neurons could be generated, and neural pathways were set in stone. However, recent research has revolutionized this view with the concept of neuroplasticity. \n\nNeuroplasticity refers to the brain's ability to reorganize itself by forming new neural connections throughout life. This allows the neurons (nerve cells) in the brain to compensate for injury and disease and to adjust their activities in response to new situations or to changes in their environment. This discovery has profound implications for rehabilitation, suggesting that the brain can essentially 'rewire' itself to bypass damaged areas."
};

export const q3Data = [
    { q: "What was the 'prevailing scientific dogma' mentioned in the text?", a: "That the adult brain could not change or generate new neurons.", w: ["That the brain grows forever.", "That plasticity is dangerous.", "That the brain is made of stone."] },
    { q: "How does the text define 'neuroplasticity'?", a: "The brain's ability to reorganize by forming new connections.", w: ["The hardening of brain tissue.", "The death of neurons.", "A type of brain surgery."] },
    { q: "The word 'immutable' is closest in meaning to:", a: "Unchangeable.", w: ["Weak.", "Flexible.", "Silent."] },
    { q: "What are the implications of this discovery for rehabilitation?", a: "The brain can rewire itself to bypass damage.", w: ["There is no hope for recovery.", "Medicine is useless.", "Brains need to be replaced."] },
    { q: "Which of the following best summarizes the main idea?", a: "The brain is adaptable and can change throughout life.", w: ["Scientists were always right about the brain.", "Injuries are permanent.", "Adults cannot learn new things."] }
];