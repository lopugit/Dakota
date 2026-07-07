// Feed room reference. `heat`: -1 cooling/low-energy … +1 heating/fizz-making.
import type { FeedItem } from '../types';

export const FEED_CATS: string[] = [
  'Forage', 'Grains', 'Fibre & mash', 'Oils & extras', 'Supplements', 'Treats',
];

export const FEEDS: FeedItem[] = [
  // ---- Forage ----
  { id: 'pasture', n: 'Pasture', cat: 'Forage', heat: 0.2, note: 'The best feed there is, but spring grass runs high in sugar — restrict grazing for good doers and anything laminitis-prone.' },
  { id: 'grass-hay', n: 'Grass hay', cat: 'Forage', heat: -0.1, note: 'The safe backbone of every diet. Feed by weight, not by biscuit.' },
  { id: 'meadow-hay', n: 'Meadow hay', cat: 'Forage', heat: -0.1, note: 'Mixed-species and softer in the mouth; a steady, forgiving chew for horses that hold their weight.' },
  { id: 'lucerne-hay', n: 'Lucerne hay', cat: 'Forage', heat: 0.2, note: 'Rich in protein and calcium and mildly heating — a biscuit goes a long way for most horses.' },
  { id: 'oaten-hay', n: 'Oaten hay', cat: 'Forage', heat: 0.1, note: 'Palatable and easy to find in Australia, but it can run sugary — soak or test it before feeding a laminitis-prone horse.' },
  { id: 'haylage', n: 'Haylage', cat: 'Forage', heat: 0.1, note: 'Sealed and dust-free, which suits the coughers; once a bale is open, use it within a few days.' },
  { id: 'steamed-hay', n: 'Steamed hay', cat: 'Forage', heat: -0.1, note: 'Steaming kills the mould spores while keeping most of the goodness — the kind option for a horse with breathing trouble.' },

  // ---- Grains ----
  { id: 'oats', n: 'Oats', cat: 'Grains', heat: 0.6, note: 'The classic heating grain — quick energy that can put fizz in a fresh horse.' },
  { id: 'barley', n: 'Barley', cat: 'Grains', heat: 0.4, note: 'Slower burning than oats and better for condition; feed it cracked, boiled or micronised so the horse can actually digest it.' },
  { id: 'corn', n: 'Corn (maize)', cat: 'Grains', heat: 0.7, note: 'The hottest of the grains — dense energy in a small scoop, and too much tends to go straight to the horse\'s head.' },
  { id: 'pellets', n: 'Pellets', cat: 'Grains', heat: 0.2, note: 'Convenient and consistent, but read the bag — "cool" on the label does not always mean low starch.' },
  { id: 'sweet-feed', n: 'Sweet feed', cat: 'Grains', heat: 0.5, note: 'Molasses makes it tasty and fizzy in equal measure — steer clear for good doers and any horse with a laminitis history.' },
  { id: 'ration-balancer', n: 'Ration balancer', cat: 'Grains', heat: 0, note: 'A small scoop of vitamins, minerals and protein that fills the gaps when hay and grass are the whole diet.' },

  // ---- Fibre & mash ----
  { id: 'beet-pulp', n: 'Beet pulp', cat: 'Fibre & mash', heat: -0.2, note: 'Soaked cool fibre; good doer-friendly calories without the sparkle.' },
  { id: 'lucerne-chaff', n: 'Lucerne chaff', cat: 'Fibre & mash', heat: 0.1, note: 'Adds chew time and a little protein to the hard feed; handy for slowing a horse that bolts its dinner.' },
  { id: 'oaten-chaff', n: 'Oaten chaff', cat: 'Fibre & mash', heat: 0, note: 'Plain, bulky and cheap — the default carrier that stops a greedy horse inhaling its feed.' },
  { id: 'soy-hulls', n: 'Soy hulls', cat: 'Fibre & mash', heat: -0.2, note: 'A super-fibre in the beet pulp family; cool calories for horses that need condition without the fizz.' },
  { id: 'bran-mash', n: 'Bran mash', cat: 'Fibre & mash', heat: 0, note: 'A warm old-fashioned comfort feed — fine now and then, but fed daily it unbalances calcium and phosphorus.' },

  // ---- Oils & extras ----
  { id: 'linseed-oil', n: 'Linseed oil', cat: 'Oils & extras', heat: -0.2, note: 'Slow, cool energy and a gleaming coat; start with a splash and build up over a fortnight.' },
  { id: 'canola-oil', n: 'Canola oil', cat: 'Oils & extras', heat: -0.2, note: 'The budget oil that does the same quiet job — calories without starch, added gradually so the gut keeps up.' },
  { id: 'copra-meal', n: 'Copra meal', cat: 'Oils & extras', heat: -0.1, note: 'Coconut meal that puts cool condition on without lighting the fuse; soak it into a crumbly mash before feeding.' },
  { id: 'sunflower-seeds', n: 'Black sunflower seeds', cat: 'Oils & extras', heat: 0, note: 'A small handful for coat shine — think of them as a garnish, not a meal.' },

  // ---- Supplements ----
  { id: 'salt-lick', n: 'Salt lick', cat: 'Supplements', heat: 0, note: 'Every paddock deserves one — horses dose their own salt better than we can measure it.' },
  { id: 'electrolytes', n: 'Electrolytes', cat: 'Supplements', heat: 0, note: 'For hard sweat days, hot floats and summer work — not everyday feeding, and always with plenty of water on offer.' },
  { id: 'biotin', n: 'Biotin', cat: 'Supplements', heat: 0, note: 'Can grow better hoof horn, but new hoof takes the best part of a year — commit before you judge it.' },
  { id: 'joint-support', n: 'Joint support', cat: 'Supplements', heat: 0, note: 'Worth a try on the older campaigners; give it eight weeks and watch how the horse trots up, not the label claims.' },
  { id: 'gut-balancer', n: 'Gut balancer', cat: 'Supplements', heat: 0, note: 'Useful around feed changes, travel and antibiotics — a settled hindgut shows up in the manure and the mood.' },

  // ---- Treats ----
  { id: 'carrots', n: 'Carrots', cat: 'Treats', heat: 0, note: 'The classic — slice them lengthways so a round chunk cannot lodge in the throat.' },
  { id: 'apples', n: 'Apples', cat: 'Treats', heat: 0, note: 'Fine in halves or quarters, but go easy for laminitis-prone horses because sugar is still sugar.' },
  { id: 'commercial-treats', n: 'Commercial treats', cat: 'Treats', heat: 0.1, note: 'Handy for pockets and training rewards; feed from a flat palm and ration the enthusiasm.' },
];
