// Macrobiotica prototype seed data. Pure data + tiny pure helpers — no DOM.
// yy scale: -1 = most yin (expansive, cooling) … +1 = most yang (contractive, warming).

export const CATS = ['Grains', 'Vegetables', 'Beans', 'Sea vegetables', 'Fermented', 'Fruit', 'Pantry'];

export const FOODS = [
  { id: 'brown-rice', n: 'Brown rice', cat: 'Grains', yy: 0.15, note: 'The centering staple. Short grain sits closest to the middle of the scale.' },
  { id: 'millet', n: 'Millet', cat: 'Grains', yy: 0.2, note: 'Warming and drying; kind to the stomach and spleen.' },
  { id: 'barley', n: 'Barley', cat: 'Grains', yy: 0.05, note: 'Cooling for summer; softens what is stuck.' },
  { id: 'soba', n: 'Buckwheat (soba)', cat: 'Grains', yy: 0.35, note: 'The most yang grain — strengthening in cold weather.' },
  { id: 'oats', n: 'Whole oats', cat: 'Grains', yy: 0, note: 'Soft, soothing morning grain.' },
  { id: 'mochi', n: 'Sweet rice (mochi)', cat: 'Grains', yy: 0.25, note: 'Strengthening; traditional for stamina and nursing mothers.' },
  { id: 'kabocha', n: 'Kabocha squash', cat: 'Vegetables', yy: 0.25, note: 'Round, sweet and grounding — relaxes the middle.' },
  { id: 'pumpkin', n: 'Pumpkin', cat: 'Vegetables', yy: 0.22, note: 'Sweet autumn flesh; steadies blood sugar and mood.' },
  { id: 'daikon', n: 'Daikon', cat: 'Vegetables', yy: -0.1, note: 'Cooling and dissolving — helps the body let go of fat and heaviness.' },
  { id: 'carrot', n: 'Carrot', cat: 'Vegetables', yy: 0.3, note: 'Steady root energy; sweet when cooked slowly.' },
  { id: 'burdock', n: 'Burdock (gobo)', cat: 'Vegetables', yy: 0.45, note: 'Deeply rooting; the classic strengthening vegetable.' },
  { id: 'shiitake', n: 'Shiitake', cat: 'Vegetables', yy: -0.35, note: 'Expansive; traditionally used to relax excess salt and fat.' },
  { id: 'kale', n: 'Leafy greens', cat: 'Vegetables', yy: -0.15, note: 'Upward, fresh energy — best blanched briefly.' },
  { id: 'cucumber', n: 'Cucumber', cat: 'Vegetables', yy: -0.45, note: 'Very cooling; a summer vegetable to use lightly.' },
  { id: 'onion', n: 'Onion', cat: 'Vegetables', yy: 0.18, note: 'Turns deeply sweet with slow heat.' },
  { id: 'scallion', n: 'Scallion', cat: 'Vegetables', yy: -0.05, note: 'Light, dispersing garnish.' },
  { id: 'lotus', n: 'Lotus root', cat: 'Vegetables', yy: 0.2, note: 'Traditional friend of the lungs.' },
  { id: 'sweet-potato', n: 'Sweet potato', cat: 'Vegetables', yy: 0.15, note: 'Comforting and sweet; heavier than squash.' },
  { id: 'tomato', n: 'Tomato', cat: 'Vegetables', yy: -0.55, note: 'A nightshade — expansive and acidic; used sparingly.' },
  { id: 'eggplant', n: 'Eggplant', cat: 'Vegetables', yy: -0.6, note: 'Strongly yin nightshade; cooling in excess.' },
  { id: 'azuki', n: 'Azuki beans', cat: 'Beans', yy: 0.2, note: 'The most yang bean — small, red, kidney-supporting.' },
  { id: 'tofu', n: 'Tofu', cat: 'Beans', yy: -0.3, note: 'Cooling protein; warming preparations balance it.' },
  { id: 'tempeh', n: 'Tempeh', cat: 'Beans', yy: 0.15, note: 'Fermented and dense; takes well to steam and sauté.' },
  { id: 'chickpea', n: 'Chickpeas', cat: 'Beans', yy: 0.1, note: 'Round, sweet, steady.' },
  { id: 'lentil', n: 'Lentils', cat: 'Beans', yy: 0.12, note: 'Quick, unfussy strength.' },
  { id: 'kombu', n: 'Kombu', cat: 'Sea vegetables', yy: -0.2, note: 'Mineral anchor of stocks; softens beans as they cook.' },
  { id: 'wakame', n: 'Wakame', cat: 'Sea vegetables', yy: -0.25, note: 'Tender sea green for soups and salads.' },
  { id: 'nori', n: 'Nori', cat: 'Sea vegetables', yy: -0.15, note: 'Light, toasted, everyday minerals.' },
  { id: 'hijiki', n: 'Hijiki', cat: 'Sea vegetables', yy: -0.1, note: 'Strong, dark strands — cook with sweet vegetables.' },
  { id: 'miso', n: 'Miso', cat: 'Fermented', yy: 0.4, note: 'Aged, salty, alive. Added off the boil to keep enzymes.' },
  { id: 'shoyu', n: 'Shoyu', cat: 'Fermented', yy: 0.35, note: 'Aged soy seasoning; salt with depth.' },
  { id: 'umeboshi', n: 'Umeboshi', cat: 'Fermented', yy: 0.6, note: 'Salt-pickled plum; strongly contracting and alkalising.' },
  { id: 'natto', n: 'Natto', cat: 'Fermented', yy: 0.1, note: 'Sticky fermented soybeans; lively digestion helper.' },
  { id: 'sauerkraut', n: 'Sauerkraut', cat: 'Fermented', yy: -0.05, note: 'Fresh, sour ferment — a bright teaspoon with meals.' },
  { id: 'takuan', n: 'Pickled daikon (takuan)', cat: 'Fermented', yy: 0.3, note: 'Pressed, aged, deeply savoury.' },
  { id: 'amazake', n: 'Amazake', cat: 'Fermented', yy: -0.3, note: 'Sweet rice ferment; gentle dessert base.' },
  { id: 'apple', n: 'Apple', cat: 'Fruit', yy: -0.25, note: 'The most centred fruit in a temperate kitchen.' },
  { id: 'orange', n: 'Orange', cat: 'Fruit', yy: -0.5, note: 'Cooling citrus; expansive.' },
  { id: 'strawberry', n: 'Strawberry', cat: 'Fruit', yy: -0.35, note: 'Early-summer brightness.' },
  { id: 'raisin', n: 'Raisins', cat: 'Fruit', yy: -0.2, note: 'Dried sweetness — more centred than fresh grapes.' },
  { id: 'banana', n: 'Banana', cat: 'Fruit', yy: -0.7, note: 'Tropical and strongly yin — cooling far from its climate.' },
  { id: 'ginger', n: 'Ginger', cat: 'Pantry', yy: 0.35, note: 'Warming, moves energy outward and up.' },
  { id: 'sesame', n: 'Sesame', cat: 'Pantry', yy: 0.3, note: 'Rich seed; the body of gomashio.' },
  { id: 'kuzu', n: 'Kuzu', cat: 'Pantry', yy: 0.28, note: 'Wild root starch; settles the stomach and intestines.' },
  { id: 'sea-salt', n: 'Sea salt', cat: 'Pantry', yy: 0.75, note: 'The strongest yang in the kitchen. A little decides a lot.' },
  { id: 'rice-syrup', n: 'Rice syrup', cat: 'Pantry', yy: -0.3, note: 'Grain sweetness — softer curve than sugar.' },
  { id: 'kukicha', n: 'Kukicha twig tea', cat: 'Pantry', yy: 0.1, note: 'Roasted twig tea; the everyday cup.' },
  { id: 'green-tea', n: 'Green tea', cat: 'Pantry', yy: -0.2, note: 'Cooling leaf; lighter than it looks.' }
];

// How preparation moves a food along the scale (applied as +shift).
export const COOK_METHODS = [
  { m: 'Raw', shift: 0, note: 'As it comes — full expansive quality.' },
  { m: 'Blanched', shift: 0.05, note: 'Seconds of heat; keeps the lift, removes the chill.' },
  { m: 'Steamed', shift: 0.1, note: 'Gentle contraction, nothing lost.' },
  { m: 'Sautéed', shift: 0.15, note: 'Oil and flame add warmth and drive.' },
  { m: 'Long-simmered', shift: 0.2, note: 'Nishime-style; deep, calm, grounding.' },
  { m: 'Pressure-cooked', shift: 0.25, note: 'Concentrated and strengthening.' },
  { m: 'Pickled', shift: 0.15, note: 'Salt and time contract and preserve.' },
  { m: 'Roasted', shift: 0.3, note: 'Dry heat — the most contracting everyday method.' }
];

export const MEALS = [
  {
    id: 'pumpkin-soup', n: 'Pumpkin soup', yy: 0.18, time: '35 min', season: 'Autumn / late summer',
    desc: 'Sweet, round and settling. Kombu stock underneath, miso stirred in off the boil.',
    ingredients: [
      { n: 'Pumpkin', ref: 'pumpkin', amt: '400 g', yy: 0.22, note: 'The sweet centre of the bowl.' },
      { n: 'Onion', ref: 'onion', amt: '1', yy: 0.18, note: 'Sweated first for depth.' },
      { n: 'Kombu stock', ref: 'kombu', amt: '700 ml', yy: -0.2, note: 'Mineral base; keeps the soup light.' },
      { n: 'Miso', ref: 'miso', amt: '1 tbsp', yy: 0.4, note: 'Stirred in at the end, never boiled.' },
      { n: 'Ginger', ref: 'ginger', amt: 'to finish', yy: 0.35, note: 'A few drops of juice, optional in summer.' }
    ],
    process: [
      { s: 'Sweat the onion slowly in a dry, heavy pot', e: 0.06, note: 'Slow dry heat concentrates sweetness — the first move toward yang.' },
      { s: 'Add pumpkin and kombu stock; simmer 20 minutes', e: 0.1, note: 'A long, quiet simmer grounds the sweetness rather than boiling it away.' },
      { s: 'Blend, then dissolve miso in off the boil', e: 0.04, note: 'Boiled miso turns sharp and flat; added late it stays alive and rounds the salt.' },
      { s: 'Finish with grated ginger juice', e: 0.02, note: 'Lifts the finish. Skip in high summer.' }
    ],
    comments: [
      { who: 'Aki', t: 'Pressure-cooked the pumpkin once — noticeably heavier bowl. Simmering keeps it lighter.' },
      { who: 'Mei', t: 'Order matters: miso before blending made mine bitter. Off the boil, at the end, every time.' }
    ]
  },
  {
    id: 'miso-soup', n: 'Morning miso soup with wakame', yy: 0.15, time: '15 min', season: 'All year',
    desc: 'The daily opener — wakame, seasonal vegetables, miso to taste.',
    ingredients: [
      { n: 'Kombu stock', ref: 'kombu', amt: '500 ml', yy: -0.2 },
      { n: 'Wakame', ref: 'wakame', amt: '1 tbsp', yy: -0.25, note: 'Soaked 5 minutes first.' },
      { n: 'Daikon', ref: 'daikon', amt: '5 cm', yy: -0.1, note: 'Half-moons, simmered soft.' },
      { n: 'Miso', ref: 'miso', amt: '1 tbsp', yy: 0.4, note: 'Off the boil.' },
      { n: 'Scallion', ref: 'scallion', amt: '1', yy: -0.05, note: 'Fresh lift on top.' }
    ],
    process: [
      { s: 'Simmer daikon in stock until translucent', e: 0.06, note: 'Soft vegetables read as calm in the body.' },
      { s: 'Add wakame for the last two minutes', e: 0.02, note: 'Overcooked wakame goes slippery and loses its lift.' },
      { s: 'Dissolve miso off the boil; garnish', e: 0.04, note: 'Aroma is the point — steam, not boil.' }
    ],
    comments: [
      { who: 'Marco', t: 'Three weeks of this every morning. Steadier until lunch, no snack needed.' }
    ]
  },
  {
    id: 'kinpira', n: 'Kinpira gobo', yy: 0.4, time: '20 min', season: 'Autumn / winter',
    desc: 'Burdock and carrot matchsticks, sautéed then braised with shoyu. Strengthening.',
    ingredients: [
      { n: 'Burdock', ref: 'burdock', amt: '1 root', yy: 0.45, note: 'Scrubbed, not peeled.' },
      { n: 'Carrot', ref: 'carrot', amt: '1', yy: 0.3 },
      { n: 'Sesame oil', ref: 'sesame', amt: '1 tsp', yy: 0.3 },
      { n: 'Shoyu', ref: 'shoyu', amt: '2 tsp', yy: 0.35, note: 'Added near the end.' }
    ],
    process: [
      { s: 'Cut fine matchsticks', e: 0.02, note: 'Thin cuts take heat evenly — the dish cooks calmer.' },
      { s: 'Sauté burdock first, then carrot', e: 0.12, note: 'Burdock needs the head start; order keeps both lively, not soggy.' },
      { s: 'Braise with a splash of water, lid on', e: 0.1, note: 'Contained steam drives the energy inward.' },
      { s: 'Season with shoyu, cook off uncovered', e: 0.08, note: 'Late salt contracts the dish; early salt would toughen the roots.' }
    ],
    comments: [
      { who: 'Ana', t: 'Cut proper matchsticks for once — it really does cook differently. Sweeter, less chewy.' }
    ]
  },
  {
    id: 'rice-bowl', n: 'Brown rice bowl with gomashio', yy: 0.2, time: '50 min', season: 'All year',
    desc: 'Pressure-cooked short grain with sesame-salt condiment.',
    ingredients: [
      { n: 'Brown rice', ref: 'brown-rice', amt: '1 cup', yy: 0.15, note: 'Soaked 6–8 hours.' },
      { n: 'Sea salt', ref: 'sea-salt', amt: 'pinch', yy: 0.75 },
      { n: 'Gomashio', ref: 'sesame', amt: '1 tsp', yy: 0.3, note: '16:1 sesame to salt.' }
    ],
    process: [
      { s: 'Soak the rice overnight', e: -0.05, note: 'Soaking softens and slightly relaxes the grain — easier digestion.' },
      { s: 'Pressure-cook with a pinch of salt', e: 0.2, note: 'Pressure concentrates; the same rice boiled is a lighter meal.' },
      { s: 'Rest ten minutes before opening', e: 0.02, note: 'The grain settles and finishes itself.' }
    ],
    comments: [
      { who: 'Dev', t: 'Overnight soak changed everything. What else should I be soaking?' }
    ]
  },
  {
    id: 'nishime', n: 'Nishime root vegetables', yy: 0.3, time: '45 min', season: 'Winter',
    desc: 'Big pieces, little water, low flame, patience. Deeply calming.',
    ingredients: [
      { n: 'Kombu', ref: 'kombu', amt: '5 cm', yy: -0.2, note: 'Lays the bottom of the pot.' },
      { n: 'Carrot', ref: 'carrot', amt: '1', yy: 0.3 },
      { n: 'Lotus root', ref: 'lotus', amt: '1 section', yy: 0.2 },
      { n: 'Kabocha', ref: 'kabocha', amt: '¼', yy: 0.25 },
      { n: 'Shoyu', ref: 'shoyu', amt: '1 tsp', yy: 0.35 }
    ],
    process: [
      { s: 'Layer kombu, then vegetables in big chunks', e: 0.05, note: 'Large cuts hold their energy through the long cook.' },
      { s: 'Two fingers of water, lid on, low flame 35 min', e: 0.2, note: 'The waterless braise — vegetables cook in their own steam.' },
      { s: 'Season lightly, rest off the flame', e: 0.05, note: 'Resting lets flavours contract back into the pieces.' }
    ],
    comments: [
      { who: 'Yuki', t: 'The house smells like my grandmother’s kitchen. Best on a rainy day.' }
    ]
  },
  {
    id: 'azuki-kabocha', n: 'Azuki beans with kabocha', yy: 0.25, time: '60 min', season: 'Late summer',
    desc: 'The classic sweet-and-strengthening pair for kidneys and blood sugar.',
    ingredients: [
      { n: 'Azuki beans', ref: 'azuki', amt: '1 cup', yy: 0.2, note: 'Soaked with the kombu.' },
      { n: 'Kabocha', ref: 'kabocha', amt: '¼', yy: 0.25 },
      { n: 'Kombu', ref: 'kombu', amt: '5 cm', yy: -0.2 },
      { n: 'Sea salt', ref: 'sea-salt', amt: 'pinch', yy: 0.75, note: 'Only when beans are soft.' }
    ],
    process: [
      { s: 'Simmer soaked beans with kombu until nearly soft', e: 0.1, note: 'Kombu softens the beans and adds minerals.' },
      { s: 'Add kabocha on top; don’t stir', e: 0.08, note: 'Squash steams above the beans and keeps its shape.' },
      { s: 'Salt at the very end', e: 0.07, note: 'Salting early would keep the beans hard forever.' }
    ],
    comments: [
      { who: 'Mei', t: 'My afternoon sugar dips stopped within a week of eating this at lunch.' }
    ]
  },
  {
    id: 'soba-bowl', n: 'Soba in broth with scallion', yy: 0.1, time: '20 min', season: 'All year',
    desc: 'Buckwheat noodles in kombu–shoyu broth; quick strength on a busy day.',
    ingredients: [
      { n: 'Soba', ref: 'soba', amt: '90 g', yy: 0.35 },
      { n: 'Kombu stock', ref: 'kombu', amt: '400 ml', yy: -0.2 },
      { n: 'Shoyu', ref: 'shoyu', amt: '1 tbsp', yy: 0.35 },
      { n: 'Scallion', ref: 'scallion', amt: '2', yy: -0.05, note: 'A generous handful.' },
      { n: 'Nori', ref: 'nori', amt: '½ sheet', yy: -0.15 }
    ],
    process: [
      { s: 'Cook noodles separately; rinse well', e: -0.04, note: 'Rinsing removes the sticky surface starch — a lighter bowl.' },
      { s: 'Heat broth; season with shoyu', e: 0.08 },
      { s: 'Assemble hot, garnish generously', e: 0.02, note: 'Scallion and nori keep the yang noodle from feeling heavy.' }
    ],
    comments: []
  },
  {
    id: 'apple-kuzu', n: 'Apple kuzu pudding', yy: -0.12, time: '15 min', season: 'All year',
    desc: 'Juice-stewed apple thickened with kuzu — dessert that settles rather than spikes.',
    ingredients: [
      { n: 'Apple', ref: 'apple', amt: '2', yy: -0.25 },
      { n: 'Kuzu', ref: 'kuzu', amt: '1 tbsp', yy: 0.28, note: 'Dissolved cold before it meets heat.' },
      { n: 'Sea salt', ref: 'sea-salt', amt: 'a few grains', yy: 0.75, note: 'Sharpens the sweetness.' }
    ],
    process: [
      { s: 'Stew apples gently until soft', e: 0.08, note: 'Cooked fruit is kinder to digestion than raw.' },
      { s: 'Stir in dissolved kuzu until glossy', e: 0.06, note: 'Kuzu pulls the cooling fruit back toward centre.' },
      { s: 'A few grains of salt', e: 0.02, note: 'Salt makes sweet taste sweeter — contraction defining expansion.' }
    ],
    comments: [
      { who: 'Aki', t: 'Serving this warm vs cold is two different desserts. Warm settles me for sleep.' }
    ]
  },
  {
    id: 'pressed-salad', n: 'Quick-pressed cucumber salad', yy: -0.25, time: '30 min', season: 'Summer',
    desc: 'Salt-pressed cucumber and wakame — raw energy, tamed.',
    ingredients: [
      { n: 'Cucumber', ref: 'cucumber', amt: '1', yy: -0.45 },
      { n: 'Wakame', ref: 'wakame', amt: '1 tbsp', yy: -0.25 },
      { n: 'Sea salt', ref: 'sea-salt', amt: '½ tsp', yy: 0.75, note: 'Does the pressing.' },
      { n: 'Ginger', ref: 'ginger', amt: 'a little', yy: 0.35 }
    ],
    process: [
      { s: 'Slice thin, toss with salt, press 30 min', e: 0.12, note: 'Pressing is cooking without fire — salt and weight contract the cucumber.' },
      { s: 'Squeeze out the water; dress', e: 0.05, note: 'The squeezed-out liquid carries the excess yin away with it.' }
    ],
    comments: [
      { who: 'Yuki', t: 'Salad that doesn’t make me cold. Press it properly — limp is the point.' }
    ]
  }
];

export const AILMENT_SYSTEMS = ['All', 'Digestion', 'Energy', 'Sleep', 'Circulation', 'Skin', 'Mind', 'Cycles'];

export const AILMENTS = [
  {
    id: 'cold-hands', n: 'Cold hands and feet', system: 'Circulation', pattern: 'More yin',
    signs: ['Chilly extremities, warm core', 'Worse after raw or sweet food', 'Pale complexion'],
    eat: [
      { n: 'Kinpira gobo', ref: 'kinpira', why: 'Root strength moves warmth outward.' },
      { n: 'Miso soup, daily', ref: 'miso-soup', why: 'Warm, salty opener for circulation.' },
      { n: 'Ginger', why: 'A little, cooked into dishes.' }
    ],
    remedies: [
      { n: 'Ginger compress', how: 'Hot ginger towel over the lower back, 10 minutes.' },
      { n: 'Ume-sho-bancha', how: 'Umeboshi + drops of shoyu in hot twig tea.' }
    ],
    practices: ['body-rub', 'walk-after'],
    avoid: ['Iced drinks', 'Raw salads in cold weather', 'Tropical fruit'],
    note: 'Warmth is built meal by meal, not forced.'
  },
  {
    id: 'low-energy', n: 'Low energy, no appetite', system: 'Energy', pattern: 'More yin',
    signs: ['Heavy mornings', 'Craving stimulants', 'Thin, watery digestion'],
    eat: [
      { n: 'Soft rice porridge', ref: 'rice-bowl', why: 'Long-cooked grain is pre-digested strength.' },
      { n: 'Azuki with kabocha', ref: 'azuki-kabocha', why: 'Steadies blood sugar through the afternoon.' },
      { n: 'Mochi', why: 'Traditional stamina food, grilled into soup.' }
    ],
    remedies: [
      { n: 'Ume-sho-kuzu', how: 'Kuzu cream with umeboshi and shoyu, sipped warm.' }
    ],
    practices: ['chewing', 'early-dinner'],
    avoid: ['Sugar for lift', 'Skipping breakfast', 'Cold smoothies'],
    note: 'Appetite returns when meals become regular and warm.'
  },
  {
    id: 'insomnia', n: 'Restless sleep', system: 'Sleep', pattern: 'Excess yang, scattered yin',
    signs: ['Wired at midnight', 'Waking 1–3 am', 'Dreams that feel like work'],
    eat: [
      { n: 'Lighter, earlier dinners', why: 'A full stomach keeps the body on duty.' },
      { n: 'Blanched leafy greens', why: 'Gentle upward energy releases the day’s contraction.' },
      { n: 'Apple kuzu, warm', ref: 'apple-kuzu', why: 'Settling evening sweetness.' }
    ],
    remedies: [
      { n: 'Warm amazake', how: 'Small cup, diluted, an hour before bed.' },
      { n: 'Foot soak', how: 'Hot water to the ankles, 10 minutes, then straight to bed.' }
    ],
    practices: ['quiet-meals', 'early-dinner'],
    avoid: ['Late salty snacks', 'Baked flour in the evening', 'Screens at the table'],
    note: 'Waking at the same hour nightly is worth noting in your diary — patterns teach.'
  },
  {
    id: 'bloating', n: 'Bloating after meals', system: 'Digestion', pattern: 'Mixed',
    signs: ['Fullness out of proportion to the meal', 'Better with warmth', 'Irregular eating times'],
    eat: [
      { n: 'Well-cooked grains', ref: 'rice-bowl', why: 'Soft, warm, thoroughly chewed.' },
      { n: 'Miso soup before the meal', ref: 'miso-soup', why: 'Wakes digestion gently.' },
      { n: 'A teaspoon of pickles', why: 'Ferments help the gut do its work.' }
    ],
    remedies: [
      { n: 'Kukicha after meals', how: 'Plain twig tea instead of dessert.' }
    ],
    practices: ['chewing', 'quiet-meals'],
    avoid: ['Cold drinks with food', 'Raw fruit straight after meals', 'Eating standing up'],
    note: 'Fifty chews per mouthful is the strongest medicine on this page.'
  },
  {
    id: 'constipation', n: 'Constipation, dry type', system: 'Digestion', pattern: 'More yang',
    signs: ['Dry, slow movements', 'Thirst', 'Often with excess salt or baking'],
    eat: [
      { n: 'Blanched greens daily', why: 'Moist, upward, moving.' },
      { n: 'Sea vegetables', why: 'Minerals draw water into the intestines.' },
      { n: 'Stewed apple with kuzu', ref: 'apple-kuzu', why: 'Gentle moistening sweetness.' }
    ],
    remedies: [
      { n: 'Morning water', how: 'A cup of warm water before anything else.' }
    ],
    practices: ['walk-after', 'soaking'],
    avoid: ['Dry baked goods', 'Extra salt', 'Long sitting'],
    note: 'Ease the salt for a week and watch what changes.'
  },
  {
    id: 'headache', n: 'Headache', system: 'Mind', pattern: 'Location tells the story',
    signs: ['Front of head: yin — sweets, liquids, lack of salt', 'Back of head: yang — excess salt, dryness, tension', 'Temples: often mixed'],
    eat: [
      { n: 'For frontal: miso soup', ref: 'miso-soup', why: 'A little good salt contracts the expansion.' },
      { n: 'For occipital: green tea, fruit', why: 'Gentle yin releases the grip.' },
      { n: 'Kuzu drink', why: 'Settles either type via the gut.' }
    ],
    remedies: [
      { n: 'Cool cloth (front) / warm cloth (back)', how: 'Match the compress to the pattern.' }
    ],
    practices: ['quiet-meals'],
    avoid: ['Guessing — check what the last two meals were'],
    note: 'Note headaches in the diary with what preceded them; the pattern usually shows within a month.'
  },
  {
    id: 'sugar-cravings', n: 'Sugar cravings', system: 'Energy', pattern: 'Often too much yang',
    signs: ['Strongest after salty or dense meals', 'Afternoon slumps', 'All-or-nothing snacking'],
    eat: [
      { n: 'Sweet vegetable drink', why: 'Onion, carrot, cabbage, squash — sweetness without the spike.' },
      { n: 'Azuki with kabocha', ref: 'azuki-kabocha', why: 'Round sweetness, slow release.' },
      { n: 'Amazake, small amounts', why: 'A honest dessert while the craving fades.' }
    ],
    remedies: [
      { n: 'Check the salt', how: 'Cravings often mirror the previous meal’s contraction.' }
    ],
    practices: ['chewing'],
    avoid: ['Fighting it with willpower alone', 'Artificial sweeteners'],
    note: 'The craving is information, not a failing.'
  },
  {
    id: 'dry-skin', n: 'Dry skin', system: 'Skin', pattern: 'More yang / dry',
    signs: ['Tightness after washing', 'Worse in wind and heating season'],
    eat: [
      { n: 'Sesame, daily', why: 'Good oil from the inside.' },
      { n: 'Leafy greens and wakame', why: 'Moist, mineral-rich.' },
      { n: 'Soups over crackers', why: 'Hydration through food, not just water.' }
    ],
    remedies: [
      { n: 'Body rub', how: 'Hot damp towel, whole body, morning or night.' }
    ],
    practices: ['body-rub'],
    avoid: ['Excess baked flour', 'Very long baths'],
    note: 'Skin follows the intestines by about a month.'
  },
  {
    id: 'anxious-mind', n: 'Anxious, scattered mind', system: 'Mind', pattern: 'More yin',
    signs: ['Racing thoughts', 'Snacking instead of meals', 'Cold hands with a busy head'],
    eat: [
      { n: 'Root vegetables', ref: 'nishime', why: 'Downward, settling energy.' },
      { n: 'Whole grains at every meal', ref: 'rice-bowl', why: 'The centre of the plate becomes the centre of the day.' },
      { n: 'Miso soup', ref: 'miso-soup', why: 'Warm minerals for the nerves.' }
    ],
    remedies: [
      { n: 'Kukicha, sipped slowly', how: 'A tea ceremony of one, twice a day.' }
    ],
    practices: ['chewing', 'quiet-meals', 'walk-after'],
    avoid: ['Caffeine on an empty stomach', 'Sugar', 'Eating while working'],
    note: 'Ground the meals and the mind tends to follow.'
  },
  {
    id: 'cramps', n: 'Menstrual cramps', system: 'Cycles', pattern: 'Cold + stagnation',
    signs: ['Better with warmth and pressure', 'Worse after cold or raw food in the prior week'],
    eat: [
      { n: 'Warm, cooked meals all week before', why: 'The week before matters more than the day of.' },
      { n: 'Azuki beans', ref: 'azuki-kabocha', why: 'Traditional support for the kidneys and blood.' },
      { n: 'Ginger in cooking', why: 'Moves what is stuck.' }
    ],
    remedies: [
      { n: 'Ginger compress', how: 'Over the lower abdomen, low and slow warmth.' }
    ],
    practices: ['body-rub', 'early-dinner'],
    avoid: ['Ice cream and iced drinks', 'Raw salads that week'],
    note: 'Persistent or severe pain deserves a practitioner’s care.'
  }
];

export const PRACTICES = [
  { id: 'chewing', n: 'Chewing well', icon: 'wheat', tag: 'Every meal', desc: 'Fifty chews per mouthful. Digestion begins in the mouth; so does calm.',
    steps: ['Put the chopsticks down between bites', 'Count fifty on one mouthful, then stop counting', 'Let liquid food be chewed too'],
    why: 'Grain sugars only release with saliva. The pace changes the meal — and the meeting after it.' },
  { id: 'soaking', n: 'Soaking grains and beans', icon: 'droplets', tag: 'Kitchen', desc: 'Six to eight hours of water does half the cooking for you.',
    steps: ['Rinse until the water runs clear', 'Cover well — grains drink more than you think', 'Soak beans with their kombu'],
    why: 'Soaking softens phytic acid and shortens cooking; the grain digests as food, not work.' },
  { id: 'slow-cooking', n: 'Slow cooking', icon: 'flame', tag: 'Kitchen', desc: 'Low flame, heavy pot, time. Nishime is the teacher.',
    steps: ['Use the heaviest pot you own', 'Flame low enough to hear nothing', 'Resist the lid for the last ten minutes'],
    why: 'Slow heat builds calm, grounded energy in the dish — hurry cooks hurry into the food.' },
  { id: 'pickling', n: 'Home pickling', icon: 'leaf', tag: 'Weekly', desc: 'A pressed jar on the counter is a living pantry.',
    steps: ['Slice thin, salt lightly, press with a weight', 'Start with cabbage or daikon', 'A teaspoon with meals, not a bowlful'],
    why: 'Ferments bring live enzymes to every meal and teach patience by the jar.' },
  { id: 'body-rub', n: 'Hot towel body rub', icon: 'heart', tag: 'Daily', desc: 'A damp hot towel over every inch of skin, morning or night.',
    steps: ['Wring a towel out of very hot water', 'Rub until the skin pinks — two minutes', 'Hands, feet and face get extra attention'],
    why: 'Moves circulation to the surface and makes the skin an organ of discharge again.' },
  { id: 'early-dinner', n: 'Early, lighter dinner', icon: 'moon', tag: 'Daily', desc: 'Finish eating three hours before sleep.',
    steps: ['Front-load the day: real breakfast, real lunch', 'Soup-and-grain evenings on busy days', 'Tea, not snacks, after eight'],
    why: 'Sleep is for repair, not digestion. Mornings arrive lighter.' },
  { id: 'quiet-meals', n: 'Quiet meals', icon: 'sprout', tag: 'Every meal', desc: 'No screens, no reading, no standing. Just the meal.',
    steps: ['Sit down, even for tea', 'One breath before the first bite', 'Notice one flavour you would have missed'],
    why: 'Attention is a digestif. Food eaten in a hurry arrives in a hurry.' },
  { id: 'walk-after', n: 'Walking after meals', icon: 'sun', tag: 'Daily', desc: 'Ten slow minutes outside after lunch or dinner.',
    steps: ['Slow is the point — this is not exercise', 'Outside if at all possible', 'Let the mind chew the day'],
    why: 'Gentle movement settles blood sugar and the meal both.' },
  { id: 'seasonal-shopping', n: 'Shopping in season', icon: 'carrot', tag: 'Weekly', desc: 'Let the market decide the menu, not the recipe.',
    steps: ['Buy what is abundant and cheap — that is the season talking', 'One new vegetable a week', 'Ask the grower how they cook it'],
    why: 'Seasonal food carries the energy the season asks of us.' }
];

export const COURSES = [
  { id: 'fob', title: 'Foundations of Balance', lessons: [
    { id: 'fob-1', t: 'Why balance', min: 4, done: true },
    { id: 'fob-2', t: 'Yin and yang in the kitchen', min: 6, done: true },
    { id: 'fob-3', t: 'The spiral of change', min: 5, done: true },
    { id: 'fob-4', t: 'The energy of cooking', min: 7, done: false },
    { id: 'fob-5', t: 'Chewing well', min: 5, done: false },
    { id: 'fob-6', t: 'Salt and oil', min: 6, done: false },
    { id: 'fob-7', t: 'Cutting styles', min: 4, done: false },
    { id: 'fob-8', t: 'Fire and time', min: 6, done: false },
    { id: 'fob-9', t: 'A balanced day', min: 8, done: false }
  ]},
  { id: 'plate', title: 'The Standard Plate', lessons: [
    { id: 'plate-1', t: 'The plate at a glance', min: 3, done: true },
    { id: 'plate-2', t: 'Whole grains at the centre', min: 6, done: false },
    { id: 'plate-3', t: 'Vegetables three ways', min: 5, done: false },
    { id: 'plate-4', t: 'Beans and sea vegetables', min: 6, done: false },
    { id: 'plate-5', t: 'Soup every day', min: 4, done: false },
    { id: 'plate-6', t: 'Pickles and condiments', min: 5, done: false },
    { id: 'plate-7', t: 'Putting it together', min: 7, done: false }
  ]},
  { id: 'seasonal', title: 'Seasonal Cooking', lessons: [
    { id: 'sea-1', t: 'Eating with the seasons', min: 5, done: false },
    { id: 'sea-2', t: 'Spring — rising energy', min: 6, done: false },
    { id: 'sea-3', t: 'Summer — fire and lightness', min: 6, done: false },
    { id: 'sea-4', t: 'Late summer — the sweet centre', min: 5, done: false },
    { id: 'sea-5', t: 'Autumn — gathering in', min: 6, done: false },
    { id: 'sea-6', t: 'Winter — storing deep', min: 6, done: false }
  ]},
  { id: 'care', title: 'Cooking for Others', lessons: [
    { id: 'care-1', t: 'Cooking as care', min: 4, done: false },
    { id: 'care-2', t: 'Reading another’s condition', min: 7, done: false },
    { id: 'care-3', t: 'Children', min: 5, done: false },
    { id: 'care-4', t: 'Elders', min: 5, done: false },
    { id: 'care-5', t: 'Illness and recovery', min: 8, done: false },
    { id: 'care-6', t: 'Pregnancy', min: 6, done: false },
    { id: 'care-7', t: 'The busy household', min: 5, done: false },
    { id: 'care-8', t: 'Feeding sceptics', min: 4, done: false }
  ]}
];

// Rich lesson articles. Block types: h (heading), p, quote, list, aside.
export const ARTICLES = {
  'fob-4': [
    { t: 'p', x: 'Take one carrot. Eat it raw and it is crisp, cool, a little sharp — its energy moves outward. Steam it and it softens toward sweetness. Simmer it for forty minutes in a heavy pot and it becomes something else entirely: dense, warm, settling. Same carrot. Three foods.' },
    { t: 'h', x: 'Fire is an ingredient' },
    { t: 'p', x: 'Cooking is the art of moving food along the yin–yang scale on purpose. Heat, pressure, salt and time all contract; water, oil-free rawness and short cooking preserve expansion. A skilled cook reads what the eater needs — lighter or more grounded — and chooses the method before the ingredient.' },
    { t: 'quote', x: 'You are not just choosing what to eat. You are choosing what the food has become by the time it reaches the table.' },
    { t: 'h', x: 'The order of operations' },
    { t: 'p', x: 'Sequence matters as much as method. Onions sweated before liquid arrives turn sweet and rich; boiled from cold they stay watery. Miso stirred into simmering soup keeps its aroma and enzymes; boiled, it turns flat and sharp. Salt added early toughens beans; added late, it defines them.' },
    { t: 'list', x: ['Sweat aromatics first — sweetness is built, not added', 'Salt beans and roots near the end of cooking', 'Miso and fresh garnishes go in off the boil', 'Rest long-cooked dishes before serving; they finish themselves'] },
    { t: 'p', x: 'This is why the meal log in this app records not just ingredients but process. Two bowls of pumpkin soup with identical shopping lists can sit in different places on the scale — the pot decides.' },
    { t: 'aside', x: 'Try it: cook the same vegetable two ways this week and note both in your diary. Your body will tell you the difference by mid-afternoon.' }
  ],
  'fob-5': [
    { t: 'p', x: 'Digestion begins in the mouth, and for grain it very nearly ends there too. The sugars in rice, millet and barley only unlock with saliva. Swallow early and the stomach receives work it cannot do; chew well and it receives food.' },
    { t: 'h', x: 'Fifty times' },
    { t: 'p', x: 'The traditional counsel is fifty chews per mouthful — a number chosen less for chemistry than for what it does to the eater. At fifty chews you cannot rush. You put the chopsticks down. The meal slows to the speed of a conversation.' },
    { t: 'quote', x: 'Chew your drink and drink your food.' },
    { t: 'p', x: 'Count for the first week. After that the counting falls away and the pace remains. People report the same sequence: meals shrink slightly, afternoon slumps soften, and food begins to taste of more than its first three seconds.' },
    { t: 'list', x: ['Week one: count fifty on the first mouthful of each meal', 'Week two: first three mouthfuls', 'After: keep only the pause between bites'] },
    { t: 'aside', x: 'Mark this practice done on the days you manage it — the streak is a gentler teacher than guilt.' }
  ],
  'plate-2': [
    { t: 'p', x: 'Half the plate, at least half the days, is whole grain: brown rice most often, with millet, barley and oats in rotation. Not as a side — as the centre the rest of the meal arranges itself around.' },
    { t: 'h', x: 'Why grain holds the centre' },
    { t: 'p', x: 'Whole grain sits near the middle of the yin–yang scale. Build the meal on the middle and the accompaniments can afford to be more expressive — pickles sharply salty, greens barely cooked, a sweet squash dish. The centre absorbs the edges.' },
    { t: 'list', x: ['Short-grain brown rice: the everyday centre', 'Millet: warming, for weak digestion', 'Barley: cooling, for summer', 'Soba: strengthening, for cold days and hard work'] },
    { t: 'aside', x: 'Soak, salt lightly, cook with calm heat. The Foods tab lists how each preparation moves the grain.' }
  ],
  'sea-1': [
    { t: 'p', x: 'A cucumber in August is refreshment; the same cucumber in January is a small argument with the weather. Seasonal eating is not nostalgia — it is using food energy that agrees with the moment.' },
    { t: 'h', x: 'The year as a spiral' },
    { t: 'p', x: 'Spring asks for rising, fresh energy: quick greens, sprouted things, lighter ferments. High summer is fire — big leaves, cooling fruit, pressed salads. Late summer sweetens into squash and round vegetables. Autumn gathers down into roots. Winter stores deep: long cooking, more salt, more oil, more time.' },
    { t: 'list', x: ['Spring: blanched greens, wild shoots, light miso', 'Summer: pressed salads, barley, a little raw', 'Late summer: kabocha, millet, sweet vegetable dishes', 'Autumn: lotus root, returning warmth, longer sautés', 'Winter: nishime, soba, pressure-cooked grain'] },
    { t: 'quote', x: 'The market, not the recipe, is the menu.' }
  ]
};

export const POSTS = [
  { id: 'p1', who: 'Yuki', initials: 'YK', time: '2 h', text: 'First pumpkin soup of the season — sweet enough without a grain of sugar. Sweated the onions a full ten minutes and it shows.', meal: 'pumpkin-soup', likes: 12,
    comments: [ { who: 'Marco', t: 'That colour. Saving this for Sunday.' }, { who: 'Ana', t: 'Ten minutes on the onions is the whole secret.' } ] },
  { id: 'p2', who: 'Marco', initials: 'MA', time: '5 h', text: 'Day 21 of morning miso soup. Sleeping through the night again and the 4pm biscuit hour has quietly disappeared.', meal: 'miso-soup', likes: 18,
    comments: [ { who: 'Mei', t: 'The biscuit hour — I know it well. Encouraging.' } ] },
  { id: 'p3', who: 'Ana', initials: 'AN', time: 'Yesterday', text: 'Cut proper matchsticks for kinpira for once instead of lazy diagonals. It cooks completely differently — sweeter, evenly tender. Knife work is cooking.', meal: 'kinpira', likes: 9,
    comments: [] },
  { id: 'p4', who: 'Dev', initials: 'DE', time: 'Yesterday', text: 'Soaked my rice overnight for the first time and it is a different grain. What else should I be soaking? Beans? Oats? Everything?', likes: 6,
    comments: [ { who: 'Yuki', t: 'Beans always — with their kombu. Oats too if you like them creamy.' }, { who: 'Aki', t: 'There is a Soaking practice card in the app with the times.' } ] },
  { id: 'p5', who: 'Mei', initials: 'ME', time: '2 d', text: 'Checked in at +0.4 after a week of deadlines and takeaway — most yang I have been all month. Back to the kitchen tonight: soup, grain, greens. Practice, not perfection.', likes: 21,
    comments: [ { who: 'Marco', t: 'The check-in graph does not lie. Good luck tonight.' } ] },
  { id: 'p6', who: 'Aki', initials: 'AK', time: '3 d', text: 'Warm apple kuzu before bed instead of doomscrolling. Small trade, big difference.', meal: 'apple-kuzu', likes: 14,
    comments: [] }
];

export const FRIENDS = [
  { id: 'yuki', n: 'Yuki', initials: 'YK', relation: 'Partner', constitution: 'Leans yin', bal: -0.2,
    trend: [-0.3, -0.25, -0.1, -0.2, -0.35, -0.15, -0.2],
    cooking: 'Runs cold in the evenings — favour warm, longer-cooked dinners. No raw fruit after dark.',
    note: 'Three weeks into the morning miso habit. Mood noticeably steadier.' },
  { id: 'marco', n: 'Marco', initials: 'MA', relation: 'Friend', constitution: 'Leans yang', bal: 0.3,
    trend: [0.45, 0.4, 0.35, 0.3, 0.4, 0.3, 0.3],
    cooking: 'Salt-heavy palate from restaurant years — season his portions last. More greens than he asks for.',
    note: 'Training for a cycling event; needs volume, not heaviness.' },
  { id: 'ana', n: 'Ana', initials: 'AN', relation: 'Friend', constitution: 'Near centre', bal: 0.05,
    trend: [0, 0.1, -0.05, 0.1, 0, 0.05, 0.05],
    cooking: 'Adventurous — good person to test new dishes on. Mild nightshade sensitivity.',
    note: 'Learning knife work; send her the cutting-styles lesson.' },
  { id: 'mei', n: 'Mei', initials: 'ME', relation: 'Client', constitution: 'Recovering — keep it gentle', bal: 0.15,
    trend: [0.5, 0.45, 0.4, 0.3, 0.25, 0.2, 0.15],
    cooking: 'Coming back from burnout. Soft textures, small portions, nothing extreme in either direction.',
    note: 'Weekly cook-drop on Sundays. She reheats; keep dishes that hold.' },
  { id: 'aki', n: 'Aki', initials: 'AK', relation: 'Friend', constitution: 'Leans yin', bal: -0.15,
    trend: [-0.1, -0.2, -0.25, -0.1, -0.15, -0.2, -0.15],
    cooking: 'Sweet tooth in the evenings — keep apple kuzu ingredients stocked when visiting.',
    note: 'New to all of this; answers questions with more questions. Keep it light.' }
];

export const ELEMENTS = [
  { el: 'Wood', organ: 'Liver · Gallbladder', season: 'Spring', taste: 'Sour', emotion: 'Anger → kindness', colorVar: '--chakra-heart', foods: 'Sprouts, greens, sour ferments' },
  { el: 'Fire', organ: 'Heart · Small intestine', season: 'Summer', taste: 'Bitter', emotion: 'Mania → joy', colorVar: '--chakra-root', foods: 'Big leafy greens, bitter herbs' },
  { el: 'Earth', organ: 'Spleen · Stomach', season: 'Late summer', taste: 'Sweet', emotion: 'Worry → empathy', colorVar: '--chakra-solar', foods: 'Round sweet vegetables, millet' },
  { el: 'Metal', organ: 'Lungs · Large intestine', season: 'Autumn', taste: 'Pungent', emotion: 'Grief → openness', colorVar: '--chakra-throat', foods: 'Rice, daikon, lotus root' },
  { el: 'Water', organ: 'Kidneys · Bladder', season: 'Winter', taste: 'Salty', emotion: 'Fear → will', colorVar: '--chakra-third-eye', foods: 'Beans, sea vegetables, buckwheat' }
];

export const CLOCK = [
  { h: 3, label: '3–5', organ: 'Lungs', note: 'Deepest breath of sleep; grief processes here.' },
  { h: 5, label: '5–7', organ: 'Large intestine', note: 'Letting go — warm water, morning movement.' },
  { h: 7, label: '7–9', organ: 'Stomach', note: 'Strongest digestion of the day. Eat breakfast.' },
  { h: 9, label: '9–11', organ: 'Spleen', note: 'Transforming food to energy; best focused work.' },
  { h: 11, label: '11–13', organ: 'Heart', note: 'Connection hour — lunch with company.' },
  { h: 13, label: '13–15', organ: 'Small intestine', note: 'Sorting — a short walk helps the meal settle.' },
  { h: 15, label: '15–17', organ: 'Bladder', note: 'The afternoon dip; tea, not sugar.' },
  { h: 17, label: '17–19', organ: 'Kidneys', note: 'Reserves restore — a good hour for dinner.' },
  { h: 19, label: '19–21', organ: 'Pericardium', note: 'Warmth and lightness; the day softens.' },
  { h: 21, label: '21–23', organ: 'Triple burner', note: 'Systems power down. Screens off helps.' },
  { h: 23, label: '23–1', organ: 'Gallbladder', note: 'Decisions rest; be asleep.' },
  { h: 1, label: '1–3', organ: 'Liver', note: 'Blood cleans and plans renew — the deep hours.' }
];

export const ANIMALS = [
  { n: 'Rat', note: 'Quick, resourceful, saves for winter.' },
  { n: 'Ox', note: 'Patient strength; the long furrow.' },
  { n: 'Tiger', note: 'Brave, restless, all-in.' },
  { n: 'Rabbit', note: 'Gentle, diplomatic, home-loving.' },
  { n: 'Dragon', note: 'Vital, theatrical, weather-making.' },
  { n: 'Snake', note: 'Wise, private, precise.' },
  { n: 'Horse', note: 'Free-moving, warm, hard to fence.' },
  { n: 'Goat', note: 'Artistic, kind, needs green pasture.' },
  { n: 'Monkey', note: 'Inventive, playful, slippery.' },
  { n: 'Rooster', note: 'Exact, proud, up at dawn.' },
  { n: 'Dog', note: 'Loyal, fair, keeps the gate.' },
  { n: 'Pig', note: 'Honest, generous, enjoys the table.' }
];

export const ZODIAC_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export const GLOSSARY = [
  { term: 'Qi', def: 'The animating energy of body and food. Fresh, well-cooked food carries lively qi; stale or over-processed food has spent it.' },
  { term: 'Jing', def: 'Deep constitutional reserve — the inheritance you spend slowly. Guarded by sleep, warm food and not burning both ends.' },
  { term: 'Shen', def: 'Spirit-mind; the brightness behind the eyes. Settled by regular meals and a calm stomach.' },
  { term: 'Yin deficiency', def: 'Not enough cooling, moistening reserve — night heat, dryness, restlessness. Softened with soups, grains, gentle sweetness.' },
  { term: 'Yang deficiency', def: 'Not enough warming fire — cold limbs, low drive, watery digestion. Built with cooked roots, warming methods, modest good salt.' },
  { term: 'Dampness', def: 'Heaviness and fog from more richness than the body can transform. Cleared by millet, azuki, daikon and less snacking.' },
  { term: 'Wind', def: 'Change that moves around the body — twitches, wandering aches, sudden sneezes. Steadied by regularity in meals and sleep.' },
  { term: 'The five flavours', def: 'Sour, bitter, sweet, pungent, salty — each feeds one element. A balanced day touches all five, gently.' }
];

// ---- helpers (pure) ----

export function dateKey(d) {
  const p = (x) => String(x).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

export function valNote(v) {
  if (v <= -0.5) return 'Strongly yin — expansive and cooling';
  if (v <= -0.2) return 'More yin — light and cooling';
  if (v < -0.05) return 'A little yin of centre';
  if (v <= 0.05) return 'Near centre — balanced';
  if (v < 0.2) return 'A little yang of centre';
  if (v < 0.5) return 'More yang — warming and grounding';
  return 'Strongly yang — contractive';
}

export function signed(v) {
  const r = Math.round(v * 100) / 100;
  return (r > 0 ? '+' : r < 0 ? '−' : '±') + Math.abs(r).toFixed(2).replace(/0$/, '');
}

export function zodiacFor(year) {
  const y = Number(year);
  if (!y || y < 1900 || y > 2100) return null;
  const animal = ANIMALS[(y - 4) % 12];
  const el = ZODIAC_ELEMENTS[Math.floor(((y - 4) % 10) / 2)];
  const polarity = (y % 2 === 0) ? 'Yang 陽' : 'Yin 陰';
  return { animal: animal.n, note: animal.note, element: el, polarity };
}

// Deterministic seeded diary for the last ~24 days (plus today’s starter entries).
export function seedLog(now) {
  const log = {};
  const mealIds = MEALS.map((m) => m.id);
  for (let i = 24; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const k = dateKey(d);
    const r = (d.getDate() * 7 + d.getMonth() * 3) % 9;
    const meals = [];
    meals.push({ id: 'miso-soup', t: '08:0' + (r % 5) });
    if (r % 3 !== 0) meals.push({ id: mealIds[(r + i) % mealIds.length], t: '13:1' + (r % 6) });
    if (r % 4 !== 1) meals.push({ id: mealIds[(r * 2 + i) % mealIds.length], t: '19:2' + (r % 4) });
    const checkins = [];
    const base = ((r % 5) - 2) * 0.15;
    checkins.push({ t: '09:30', v: Math.round(base * 10) / 10, note: i % 5 === 0 ? 'Slow start' : '' });
    if (r % 2 === 0) checkins.push({ t: '15:00', v: Math.round((base + 0.15) * 10) / 10, note: i % 7 === 0 ? 'Post-lunch heaviness' : '' });
    const practices = [];
    if (r % 2 === 0) practices.push('chewing');
    if (r % 3 === 0) practices.push('quiet-meals');
    if (r % 4 === 0) practices.push('walk-after');
    if (i === 0) {
      // Today starts with a morning entry only; the rest is the user’s.
      log[k] = { meals: [{ id: 'miso-soup', t: '08:05' }], checkins: [{ t: '08:20', v: 0.1, note: 'Slept well, clear morning' }], practices: ['chewing'] };
    } else {
      log[k] = { meals, checkins, practices };
    }
  }
  return log;
}
