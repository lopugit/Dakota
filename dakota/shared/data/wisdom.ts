// Paddock wisdom — reference tables for the Wisdom screen.
import type {
  AgeRow, Breed, ConditionScore, Gait, GlossaryRow, Marking, SignalRow,
} from '../types';

export const BREEDS: Breed[] = [
  { id: 'australian-stock-horse', n: 'Australian Stock Horse', origin: 'Australia', height: '14.2–16.2 hh', temperament: 'Sensible, athletic, tireless', note: 'The breed that carried the Light Horse; equally at home cutting cattle or at pony club.' },
  { id: 'welsh-mountain', n: 'Welsh Mountain Pony', origin: 'Wales', height: 'up to 12.2 hh', temperament: 'Bold, kind, clever', note: 'The classic first pony — hardy enough to live out year round.' },
  { id: 'thoroughbred', n: 'Thoroughbred', origin: 'England', height: '15.2–17 hh', temperament: 'Sensitive, quick, generous', note: 'Bred to race, so off-the-track horses need a patient retraining year — but a good one will give you everything.' },
  { id: 'standardbred', n: 'Standardbred', origin: 'United States', height: '14.2–16 hh', temperament: 'Calm, honest, workmanlike', note: 'The harness racer that retrains into a lovely quiet hack; some pace instead of trot at first, which schooling sorts out.' },
  { id: 'arabian', n: 'Arabian', origin: 'Arabian Peninsula', height: '14.1–15.1 hh', temperament: 'Intelligent, alert, people-oriented', note: 'The oldest of the light breeds and the king of endurance — stamina and soundness in a small, beautiful package.' },
  { id: 'quarter-horse', n: 'Quarter Horse', origin: 'United States', height: '14.3–16 hh', temperament: 'Level-headed, quick off the mark', note: 'Named for the quarter-mile sprint; cow sense is bred in, and the good ones babysit beginners between campdrafts.' },
  { id: 'appaloosa', n: 'Appaloosa', origin: 'United States', height: '14.2–16 hh', temperament: 'Hardy, independent, willing', note: 'The spotted horse of the Nez Perce people; mottled skin, striped hooves and a coat you can spot across the paddock.' },
  { id: 'clydesdale', n: 'Clydesdale', origin: 'Scotland', height: '16–18 hh', temperament: 'Gentle, patient, dependable', note: 'The feathered-legged giant that cleared and ploughed much of rural Australia; a true gentle giant, but budget for big rugs and big feeds.' },
  { id: 'shetland', n: 'Shetland Pony', origin: 'Shetland Isles, Scotland', height: 'up to 10.2 hh', temperament: 'Brave, opinionated, tough as nails', note: 'Pound for pound the strongest of all horses; small does not mean pushover — a well-mannered Shetland is a trained Shetland.' },
  { id: 'connemara', n: 'Connemara Pony', origin: 'Ireland', height: '12.2–14.2 hh', temperament: 'Sensible, brave, athletic', note: 'Ireland’s all-rounder — jumps like a stag, carries kids and light adults, and rarely puts a foot wrong.' },
  { id: 'andalusian', n: 'Andalusian', origin: 'Spain', height: '15–16.2 hh', temperament: 'Noble, willing, expressive', note: 'The classical dressage horse of old Europe; naturally collected movement and a mane worth the extra grooming time.' },
  { id: 'friesian', n: 'Friesian', origin: 'Netherlands', height: '15.3–17 hh', temperament: 'Kind, showy, eager to please', note: 'Jet black with a high knee action and flowing feather — bred for carriages, beloved for how it makes riders feel like royalty.' },
  { id: 'hanoverian', n: 'Hanoverian', origin: 'Germany', height: '15.3–17.1 hh', temperament: 'Trainable, rideable, correct', note: 'The German warmblood you see at the top of dressage and jumping; generations of selection for temperament as much as movement.' },
  { id: 'icelandic', n: 'Icelandic Horse', origin: 'Iceland', height: '13–14 hh', temperament: 'Steady, friendly, tireless', note: 'Small but always called a horse; famous for the tölt, a smooth four-beat gait you could carry a cup of tea through.' },
  { id: 'brumby', n: 'Brumby', origin: 'Australia', height: '13–15 hh', temperament: 'Wary at first, then deeply loyal', note: 'Australia’s wild horse — hardy, sure-footed and clever. Gentling one takes time and quiet hands, and the bond repays it.' },
  { id: 'waler', n: 'Waler', origin: 'Australia', height: '15–16.2 hh', temperament: 'Tough, sensible, enduring', note: 'The remount horse of the Australian Light Horse — bred from station stock to go all day on little feed and still trot home.' },
  { id: 'riding-pony', n: 'Australian Riding Pony', origin: 'Australia (from British lines)', height: '12.2–14.2 hh', temperament: 'Sweet, polished, careful', note: 'The elegant show-ring pony — Welsh and Thoroughbred blood in a child-sized frame, with movement to catch a judge’s eye.' },
  { id: 'percheron', n: 'Percheron', origin: 'France', height: '16–17.2 hh', temperament: 'Calm, willing, intelligent', note: 'The clean-legged French draught, usually grey or black; less feather than the Clydesdale, so easier to keep tidy in wet paddocks.' },
];

export const GAITS: Gait[] = [
  { n: 'Walk', beats: '4-beat', speed: '~6 km/h', note: 'The gait that shows tension first — a true walk swings through the whole back and nods the head gently. Ruin the walk with fiddling hands and it is the hardest gait to fix.' },
  { n: 'Trot', beats: '2-beat diagonal', speed: '~13 km/h', note: 'The working gait, and the easiest place to fix rhythm — the diagonal pairs keep an honest metronome. Rise on the correct diagonal and change it when you change rein.' },
  { n: 'Canter', beats: '3-beat + moment of suspension', speed: '~20 km/h', note: 'Leads matter: the inside foreleg reaches furthest on the correct lead, which balances the turn. A good canter feels like a rocking chair, not a runaway.' },
  { n: 'Gallop', beats: '4-beat', speed: '40+ km/h', note: 'The canter’s big sibling — flatter, faster, and the horse needs its head and neck free to balance. Best saved for open ground you have walked first.' },
];

export const MARKINGS: Marking[] = [
  { kind: 'face', n: 'Star', note: 'White patch on the forehead, any shape — from a few white hairs to a big diamond.' },
  { kind: 'face', n: 'Stripe', note: 'Narrow white band running down the nasal bone, no wider than the bone itself.' },
  { kind: 'face', n: 'Snip', note: 'Small white mark between the nostrils, often on pink skin.' },
  { kind: 'face', n: 'Blaze', note: 'Broad white stripe from forehead to muzzle, wider than the nasal bone.' },
  { kind: 'face', n: 'Bald face', note: 'White covering most of the face, often past the eyes; the pink skin sunburns, so keep a fly mask handy in summer.' },
  { kind: 'leg', n: 'Coronet', note: 'A thin ring of white just above the hoof.' },
  { kind: 'leg', n: 'Pastern', note: 'White covering the pastern, stopping below the fetlock.' },
  { kind: 'leg', n: 'Sock', note: 'White to partway up the cannon.' },
  { kind: 'leg', n: 'Stocking', note: 'White reaching the knee or hock; the pale hoof below is no weaker, despite the old saying.' },
  { kind: 'leg', n: 'Ermine spots', note: 'Small dark spots inside a white leg marking, usually near the coronet — like ermine fur.' },
  { kind: 'coat', n: 'Bay', note: 'Brown body with black points — mane, tail and lower legs. Made by black pigment that the agouti gene pushes out to the points, leaving the body red-brown.' },
  { kind: 'coat', n: 'Chestnut', note: 'Red-gold all over with mane and tail the same shade or lighter. Made when a horse carries no black pigment at all, so everything comes out red.' },
  { kind: 'coat', n: 'Grey', note: 'Born another colour and whitens with age; the skin stays dark. Made by a dominant gene that slowly switches pigment off in the coat — many "white" horses are old greys.' },
  { kind: 'coat', n: 'Black', note: 'Black all over with no brown hairs. Made by black pigment with no agouti gene to restrict it — and many true blacks still fade rusty in the Australian sun.' },
  { kind: 'coat', n: 'Palomino', note: 'Golden body with a white or flaxen mane and tail. Made by one cream gene diluting a chestnut coat — two cream genes make a cremello instead.' },
  { kind: 'coat', n: 'Buckskin', note: 'Tan or gold body with black points. Made by one cream gene diluting a bay coat — the black points stay because cream barely touches black pigment.' },
];

export const AGES: AgeRow[] = [
  { horse: 1, human: 6, stage: 'Foal to yearling — everything is new' },
  { horse: 3, human: 18, stage: 'Teenager — big ideas, body still growing' },
  { horse: 5, human: 23, stage: 'Young adult — body finished, mind catching up' },
  { horse: 10, human: 35, stage: 'Established — knows the job and mostly does it' },
  { horse: 15, human: 47, stage: 'Prime — a made horse at the top of its powers' },
  { horse: 20, human: 60, stage: 'Older and wiser — still working, worth a longer warm-up' },
  { horse: 25, human: 70, stage: 'Senior — earned the good paddock' },
  { horse: 30, human: 85, stage: 'Grand old age — comfort is the job now, and a scratch never goes astray' },
];

export const SIGNALS: SignalRow[] = [
  { part: 'Ears', signal: 'Pinned flat back', meaning: 'Anger, pain, or a firm boundary — give space and look for a cause.' },
  { part: 'Ears', signal: 'Pricked hard forward', meaning: 'Full attention on something ahead — often the thing about to cause a spook, so notice it before the horse acts on it.' },
  { part: 'Ears', signal: 'One ear flicked back to you', meaning: 'Listening to the rider — a lovely sign under saddle that the horse is with you, not just underneath you.' },
  { part: 'Eyes', signal: 'Soft eye, slow blinking', meaning: 'Relaxed and content; the look you want during groundwork and grooming.' },
  { part: 'Eyes', signal: 'Wide eye with white showing, head high', meaning: 'Alarm — the horse is deciding whether to flee. Breathe, drop your energy, give it a moment to think.' },
  { part: 'Tail', signal: 'Clamped down', meaning: 'Fear or cold; a tense back usually comes with it.' },
  { part: 'Tail', signal: 'Hard, repeated swishing', meaning: 'Irritation — flies, an aid that nagged, or discomfort under the saddle. If it happens at the same moment every ride, investigate.' },
  { part: 'Tail', signal: 'Carried high like a flag', meaning: 'Fresh and excited — common on cold mornings and in Arabians. Expect extra bounce for the first ten minutes.' },
  { part: 'Mouth', signal: 'Licking and chewing', meaning: 'Processing and letting go of tension — often seen just after the horse works something out.' },
  { part: 'Muzzle', signal: 'Tight, wrinkled nostrils and chin', meaning: 'Worry or low-grade pain; a soft, floppy lower lip is the opposite and means all is well.' },
  { part: 'Legs', signal: 'Resting one hind leg, hip dropped', meaning: 'Normal dozing — but a horse pointing or resting a front leg is telling you it hurts. Fronts are never rested for comfort.' },
  { part: 'Legs', signal: 'Pawing the ground', meaning: 'Impatience or frustration — but paired with looking at the belly or wanting to roll, think colic and ring the vet.' },
  { part: 'Posture', signal: 'Rocked back with front feet camped out ahead', meaning: 'The classic laminitis stance — the horse is trying to unload sore front feet. This is a vet call today, not a watch-and-wait.' },
  { part: 'Voice', signal: 'Low, soft nicker', meaning: 'A friendly greeting — usually aimed at you, the feed bucket, or ideally both.' },
];

export const GLOSSARY: GlossaryRow[] = [
  { term: 'On the bit', def: 'The horse carries itself softly into the rein contact, poll the highest point, nose just in front of the vertical.' },
  { term: 'Behind the leg', def: 'The horse is not answering forward aids promptly — the rider works harder than the horse.' },
  { term: 'Half-halt', def: 'A brief, almost invisible rebalancing aid — a moment of seat, leg and closed hand that says "wait, rebalance" without ever stopping.' },
  { term: 'Inside leg to outside rein', def: 'The classic connection: the inside leg creates bend and energy, and the outside rein catches and channels it. Most schooling problems trace back to this.' },
  { term: 'On the forehand', def: 'Too much weight on the front legs — the horse pulls itself along instead of pushing from behind, and feels like riding downhill.' },
  { term: 'Engagement', def: 'The hind legs stepping further under the body and carrying more weight, which lightens the front end. The engine moving to the back where it belongs.' },
  { term: 'Cadence', def: 'Rhythm with expression — marked, springy beats inside a steady tempo. A trot with cadence looks like it has time to spare.' },
  { term: 'Contact', def: 'The elastic connection between your hand and the horse’s mouth — steady and alive, never strong. The horse should seek it, not lean on it.' },
  { term: 'Flexion', def: 'A small, soft yielding at the poll — to the left, to the right, or at the jaw. Measured in millimetres, not the whole neck.' },
  { term: 'Bend', def: 'The horse curved evenly through its whole body along the line of a turn or circle, not just craning its neck.' },
  { term: 'Counter-canter', def: 'Cantering deliberately on the outside lead — a balance and obedience exercise, not a mistake, once it is on purpose.' },
  { term: 'Diagonal', def: 'In rising trot, the pair of diagonal legs you rise with. Rise with the outside shoulder, and change your diagonal when you change rein.' },
  { term: 'Lead', def: 'Which foreleg reaches furthest in canter. The inside lead balances a turn — the wrong lead feels lopsided long before you look down.' },
  { term: 'Transition', def: 'Any change of gait, or of stride within a gait. Where most of the actual training happens — ride a hundred good ones a week.' },
  { term: 'Forward', def: 'Prompt, willing energy the moment the leg asks. An attitude, not a speed — a horse can be forward at walk and lazy at gallop.' },
  { term: 'Crookedness', def: 'The hind feet not following the tracks of the front feet. Every horse has a stiff side and a hollow side; straightness is trained, not born.' },
  { term: 'Nappy', def: 'Reluctant to leave home, the gate, or a friend — planting, spinning or backing towards where it would rather be. A confidence gap, best fixed in small, winnable steps.' },
  { term: 'Green', def: 'Early in its education — honest but not yet reliable. Green horse plus green rider is the combination every instructor tries to avoid.' },
  { term: 'Bombproof', def: 'As spook-resistant as a horse gets — traffic, dogs, flapping tarps. A claim to verify with your own eyes, never to take from an ad.' },
  { term: 'Good doer', def: 'A horse that thrives on next to nothing. A blessing on the feed bill and a laminitis risk on spring grass — watch the waistline.' },
  { term: 'Hard keeper', def: 'A horse that struggles to hold weight even on good feed. Check teeth, worming and workload before simply adding more hard feed.' },
  { term: 'Colicky', def: 'Showing belly-pain signs — pawing, looking at the flanks, wanting to roll, off feed. Colic is a vet call the moment you suspect it, never a wait-and-see.' },
  { term: 'Sound / unsound', def: 'Sound means moving evenly on all four legs with nothing hurting. Unsound means something is wrong — find out what before you keep working.' },
  { term: 'Agistment', def: 'Paying to keep your horse on someone else’s land — Australia’s word for what the British call livery. Ranges from a bare paddock to full care.' },
  { term: 'Float', def: 'The towed trailer a horse travels in — and the verb for loading. Good floating manners are trained in quiet sessions at home, not discovered at 5 am on show day.' },
  { term: 'Hands', def: 'The unit of horse height: one hand is four inches, measured at the top of the wither. 15.2 hh means 15 hands and 2 inches — about 157 cm.' },
];

export const CONDITION: ConditionScore[] = [
  { score: 0, label: 'Emaciated', note: 'All bones prominent; urgent vet and feeding plan.' },
  { score: 1, label: 'Poor', note: 'Ribs, spine and hip bones easily seen; no fat cover.' },
  { score: 2, label: 'Moderate', note: 'Ribs just visible; neck and quarters lean but muscled.' },
  { score: 3, label: 'Good', note: 'Ribs felt but not seen; round quarters — the working ideal.' },
  { score: 4, label: 'Fat', note: 'Ribs hard to feel; gutter along the back; crest hardening.' },
  { score: 5, label: 'Obese', note: 'Bulging fat, deep gutter, hard crest — laminitis territory.' },
];
