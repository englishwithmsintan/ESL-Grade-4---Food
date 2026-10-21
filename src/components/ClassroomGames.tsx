import React, { useState, useEffect, useRef } from 'react';
import { sound } from './SoundManager';
import { humanVoice } from '../utils/humanVoice';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Users,
  Flame,
  Zap,
  Timer,
  Play,
  Pause,
  Award,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Shuffle,
  ChevronRight,
  ShieldAlert,
  ThumbsUp,
  Eye,
  Crown,
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClassroomGamesProps {
  isTeacherMode: boolean;
  onGamePlayed: (gameKey: string) => void;
  teamScores: { teamA: number; teamB: number };
  setTeamScores: React.Dispatch<React.SetStateAction<{ teamA: number; teamB: number }>>;
  genAlphaMode?: boolean;
}

// =============================================================================
// GAME 1 DATA: MYSTERY FOOD DETECTIVE
// =============================================================================
const MYSTERY_CASES = [
  {
    id: 'case-1',
    name: 'Watermelon',
    emoji: '🍉',
    category: 'On the ground (creeping vines)',
    clues: [
      { text: 'Clue 1 (300 pts): I grow along the warm ground attached to long, creeping leafy vines in hot sunny weather.', pts: 300 },
      { text: 'Clue 2 (200 pts): My outer rind is thick, hard, and striped green, but inside I am bright red with black seeds.', pts: 200 },
      { text: 'Clue 3 (100 pts): I am 92% pure water and taste deliciously sweet, cool, and hydrating at summer picnics.', pts: 100 }
    ],
    funFact: 'Watermelons are botanically both a fruit and a vegetable related to cucumbers and pumpkins!'
  },
  {
    id: 'case-2',
    name: 'Cacao Pod & Beans',
    emoji: '🍫',
    category: 'On a tropical tree trunk',
    clues: [
      { text: 'Clue 1 (300 pts): I grow directly on the trunks and thick branches of small trees within 20 degrees of the equator.', pts: 300 },
      { text: 'Clue 2 (200 pts): Hardworking farmers harvest my colourful football-shaped pods twice a year using sharp machetes.', pts: 200 },
      { text: 'Clue 3 (100 pts): Inside me are 30 to 50 seeds dried under the tropical sun, roasted, and ground into chocolate!', pts: 100 }
    ],
    funFact: 'Ancient Mayans and Aztecs valued cacao beans so highly that they used them as real money!'
  },
  {
    id: 'case-3',
    name: 'Carrot',
    emoji: '🥕',
    category: 'Under the ground (taproot)',
    clues: [
      { text: 'Clue 1 (300 pts): I am a crunchy root vegetable that develops completely buried underneath damp garden soil.', pts: 300 },
      { text: 'Clue 2 (200 pts): Hundreds of years ago I was naturally purple and yellow before orange varieties were cultivated.', pts: 200 },
      { text: 'Clue 3 (100 pts): I am rich in Beta-Carotene (Vitamin A), which helps human eyes see clearly in low light.', pts: 100 }
    ],
    funFact: 'Carrots were originally grown for their fragrant leaves and seeds rather than their sweet roots!'
  },
  {
    id: 'case-4',
    name: 'Tomato',
    emoji: '🍅',
    category: 'On a bush / plant',
    clues: [
      { text: 'Clue 1 (300 pts): I start as a delicate yellow flower on a bushy green plant before swelling into a green berry.', pts: 300 },
      { text: 'Clue 2 (200 pts): Botanically I am a fruit because I contain seeds, but culinary chefs treat me as a savoury vegetable.', pts: 200 },
      { text: 'Clue 3 (100 pts): When ripened by warm sunshine, I turn vibrant red, juicy, slightly acidic, and perfect for pizza.', pts: 100 }
    ],
    funFact: 'There are more than 10,000 distinct varieties of tomatoes grown around the world today!'
  },
  {
    id: 'case-5',
    name: 'Durian',
    emoji: '🍈',
    category: 'On a tall tropical tree',
    clues: [
      { text: 'Clue 1 (300 pts): I grow high in Southeast Asian rainforest canopies and am nicknamed the undisputed King of Fruits.', pts: 300 },
      { text: 'Clue 2 (200 pts): My shell is covered in sharp, lethal thorns, and my smell is so pungent I am banned on trains and hotels!', pts: 200 },
      { text: 'Clue 3 (100 pts): Inside my spiky armour, my rich custard-yellow flesh feels silky, sweet, and buttery smooth.', pts: 100 }
    ],
    funFact: 'Despite its overpowering smell to foreigners, durian is celebrated across Southeast Asia as a luxury delicacy.'
  },
  {
    id: 'case-6',
    name: 'Cress / Mung Sprouts',
    emoji: '🌱',
    category: 'In a cup on damp cotton',
    clues: [
      { text: 'Clue 1 (300 pts): You can grow me right on your classroom windowsill inside a paper cup without needing any dirt or soil!', pts: 300 },
      { text: 'Clue 2 (200 pts): All I need is damp cotton wool, sunlight, room warmth, and a gentle sprinkle of water every morning.', pts: 200 },
      { text: 'Clue 3 (100 pts): Within 4 to 6 days, tiny green shoots grow tall enough to snip with scissors for a crunchy egg salad.', pts: 100 }
    ],
    funFact: 'Sprouting seeds can multiply their vitamin and antioxidant content by up to 400% in a few days!'
  },
  {
    id: 'case-7',
    name: 'Pineapple',
    emoji: '🍍',
    category: 'On the ground (centre of spiky plant)',
    clues: [
      { text: 'Clue 1 (300 pts): Contrary to popular cartoons, I do not grow on tall palm trees, but right in the center of a low spiky bush.', pts: 300 },
      { text: 'Clue 2 (200 pts): It takes nearly two whole years for a single plant to produce just one ripe golden fruit.', pts: 200 },
      { text: 'Clue 3 (100 pts): I have a tough diamond-patterned husk, a spiky green crown, and sweet, tangy golden slices.', pts: 100 }
    ],
    funFact: 'Each pineapple is actually a cluster of dozens of individual flower berries fused together around a central core.'
  },
  {
    id: 'case-8',
    name: 'Onion',
    emoji: '🧅',
    category: 'Under the ground (bulb)',
    clues: [
      { text: 'Clue 1 (300 pts): I form a tight underground bulb beneath the soil while tall hollow green tubular leaves shoot into the air.', pts: 300 },
      { text: 'Clue 2 (200 pts): I have multiple papery skin layers that protect my crisp, white, pungent fleshy rings.', pts: 200 },
      { text: 'Clue 3 (100 pts): When sliced by a kitchen knife, I release a mild sulfur vapour that makes people cry real tears!', pts: 100 }
    ],
    funFact: 'Ancient Egyptian builders were fed onions and garlic to provide strength while constructing the pyramids.'
  }
];

const FOOD_SUSPECTS = [
  { name: 'Watermelon', emoji: '🍉' },
  { name: 'Cacao Pod & Beans', emoji: '🍫' },
  { name: 'Carrot', emoji: '🥕' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Durian', emoji: '🍈' },
  { name: 'Cress / Mung Sprouts', emoji: '🌱' },
  { name: 'Pineapple', emoji: '🍍' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Papaya', emoji: '🥭' },
  { name: 'Mushroom', emoji: '🍄' },
  { name: 'Honeycomb', emoji: '🍯' }
];

// =============================================================================
// GAME 2 DATA: BEAN TO BAR CONVEYOR SCRAMBLE
// =============================================================================
const FACTORY_STEPS_CORRECT = [
  {
    id: 1,
    title: 'Harvesting the Pods',
    text: 'Cacao pods are carefully sliced from tree trunks and branches using sharp machetes.',
    icon: '🌳'
  },
  {
    id: 2,
    title: 'Fermenting the Beans',
    text: 'Pods are cut open, and the white pulp with 30-50 beans is scooped into boxes and fermented under banana leaves.',
    icon: '🍃'
  },
  {
    id: 3,
    title: 'Sun-Drying the Beans',
    text: 'Fermented beans are spread across wide wooden trays and dried under the hot tropical sun for 7 days.',
    icon: '☀️'
  },
  {
    id: 4,
    title: 'Roasting & Winnowing',
    text: 'Beans are shipped to factories, roasted in giant rotating ovens, and cracked to remove dry outer husks.',
    icon: '🔥'
  },
  {
    id: 5,
    title: 'Grinding into Cocoa Liquor',
    text: 'Heavy granite rollers crush the cacao nibs into a thick, glossy dark brown paste called cocoa liquor.',
    icon: '⚙️'
  },
  {
    id: 6,
    title: 'Mixing & Conching',
    text: 'Sugar, creamy milk, and extra cocoa butter are stirred in and smoothed continuously for hours.',
    icon: '🥛'
  },
  {
    id: 7,
    title: 'Tempering & Moulding',
    text: 'Warm chocolate is tempered at precise temperatures, poured into shiny bar moulds, and cooled to snap!',
    icon: '🍫'
  }
];

// =============================================================================
// GAME 3 DATA: RAPID-FIRE QUANTIFIER BUZZER
// =============================================================================
const QUANTIFIER_QUESTIONS = [
  {
    prompt: 'There are ________ ripe bananas on the kitchen table. (+ affirmative countable)',
    options: ['some', 'any', 'much', 'a little'],
    correct: 'some',
    explanation: 'Use "some" for plural countable nouns in positive affirmative statements!'
  },
  {
    prompt: 'Is there ________ orange juice left in the glass jug? (? question uncountable)',
    options: ['any', 'some', 'many', 'a few'],
    correct: 'any',
    explanation: 'Use "any" in general questions asking if an uncountable item exists!'
  },
  {
    prompt: 'We do not have ________ cheese for the breakfast sandwich. (- negative uncountable)',
    options: ['any', 'some', 'many', 'a few'],
    correct: 'any',
    explanation: 'Use "any" in negative sentences with negative verbs (do not have, isn\'t)!'
  },
  {
    prompt: 'Can you pour ________ milk into my morning tea? (uncountable polite request)',
    options: ['a little', 'a few', 'many', 'any'],
    correct: 'a little',
    explanation: 'Use "a little" for a small quantity of an uncountable liquid or substance!'
  },
  {
    prompt: 'May I take ________ sweet strawberries from the basket? (plural countable)',
    options: ['a few', 'a little', 'much', 'any'],
    correct: 'a few',
    explanation: 'Use "a few" for a small countable number of objects (strawberries)!'
  },
  {
    prompt: 'The farmers gathered ________ ripe watermelons for the harvest feast. (large quantity)',
    options: ['plenty of', 'a little', 'much', 'any'],
    correct: 'plenty of',
    explanation: '"Plenty of" means more than enough, used for both countable and uncountable!'
  },
  {
    prompt: 'There aren\'t ________ crunchy crisps remaining in the bag. (- negative countable)',
    options: ['many', 'much', 'a little', 'some'],
    correct: 'many',
    explanation: 'Use "many" for plural countable nouns in negative sentences!'
  },
  {
    prompt: 'How ________ sugar does Willy Wonka dissolve into the swudge grass? (uncountable question)',
    options: ['much', 'many', 'a few', 'any'],
    correct: 'much',
    explanation: 'Use "How much" when asking about uncountable amounts (sugar, water, money)!'
  },
  {
    prompt: 'How ________ cacao beans grow inside one single pod? (plural countable question)',
    options: ['many', 'much', 'a little', 'any'],
    correct: 'many',
    explanation: 'Use "How many" when asking about plural countable nouns (beans, days, students)!'
  },
  {
    prompt: 'Chocolate contains ________ cocoa butter which melts at body temperature. (+ uncountable)',
    options: ['plenty of', 'many', 'a few', 'any'],
    correct: 'plenty of',
    explanation: '"Plenty of" naturally fits uncountable substances like butter, oil, and water!'
  },
  {
    prompt: 'We only need ________ minutes to melt the dark chocolate chips. (plural countable time)',
    options: ['a few', 'a little', 'much', 'any'],
    correct: 'a few',
    explanation: 'Minutes are countable! So we say "a few minutes", never "a little minutes".'
  },
  {
    prompt: 'There isn\'t ________ salt in this mild tomato sauce. (- negative uncountable)',
    options: ['much', 'many', 'a few', 'some'],
    correct: 'much',
    explanation: 'Use "much" for uncountable nouns in negative sentences (isn\'t much salt)!'
  }
];

// =============================================================================
// GAME 4 DATA: "HOW DOES IT GROW?" ARCADE SPEED SORTER
// =============================================================================
const GROW_ITEMS = [
  { name: 'Papaya', emoji: '🥭', zone: 'tree', label: 'On a Tree' },
  { name: 'Carrot', emoji: '🥕', zone: 'underground', label: 'Under the Ground' },
  { name: 'Watermelon', emoji: '🍉', zone: 'ground', label: 'On the Ground (Vines)' },
  { name: 'Tomato', emoji: '🍅', zone: 'bush', label: 'On a Bush / Plant' },
  { name: 'Onion', emoji: '🧅', zone: 'underground', label: 'Under the Ground' },
  { name: 'Banana', emoji: '🍌', zone: 'tree', label: 'On a Tree' },
  { name: 'Pineapple', emoji: '🍍', zone: 'ground', label: 'On the Ground (Spiky Bush)' },
  { name: 'Chili Pepper', emoji: '🌶️', zone: 'bush', label: 'On a Bush / Plant' },
  { name: 'Potato', emoji: '🥔', zone: 'underground', label: 'Under the Ground' },
  { name: 'Cacao Pod', emoji: '🍫', zone: 'tree', label: 'On a Tree Trunk' },
  { name: 'Pumpkin', emoji: '🎃', zone: 'ground', label: 'On the Ground (Vines)' },
  { name: 'Blueberry', emoji: '🫐', zone: 'bush', label: 'On a Bush / Plant' },
  { name: 'Coconut', emoji: '🥥', zone: 'tree', label: 'On a Tree' },
  { name: 'Radish', emoji: '🌱', zone: 'underground', label: 'Under the Ground' },
  { name: 'Strawberry', emoji: '🍓', zone: 'ground', label: 'On the Ground' },
  { name: 'Eggplant', emoji: '🍆', zone: 'bush', label: 'On a Bush / Plant' }
];

// =============================================================================
// GAME 5 DATA: WILLY WONKA TRIVIA & GOLDEN TICKET WHEEL
// =============================================================================
const WONKA_QUESTIONS = [
  {
    q: 'What is the magical "swudge" invented by Willy Wonka in the Chocolate Factory?',
    options: [
      'Edible grass made of soft, minty spun sugar!',
      'Fizzy lifting drinks that make you float into the ceiling',
      'Giant marshmallows used as soft sofa cushions',
      'Lickable wallpaper with fruit-flavoured patterns'
    ],
    correctIdx: 0,
    scienceFact: 'Swudge is the sweet, edible minty grass that Charlie and the children taste in the Chocolate Room.'
  },
  {
    q: 'Why did greedy Augustus Gloop get sucked up into the great glass pipe?',
    options: [
      'He leaned too far over the chocolate river with dirty hands and fell in!',
      'He tried to chew experimental chewing gum before it was finished',
      'He touched a golden egg laid by a giant goose',
      'He pressed the red eject button inside the Great Glass Elevator'
    ],
    correctIdx: 0,
    scienceFact: 'Wonka warned Augustus not to pollute the pure river, but his greed caused him to tumble head-first!'
  },
  {
    q: 'Why does solid chocolate melt so delightfully in our mouths?',
    options: [
      'Cocoa butter melts at 34°C, which is lower than human body temperature (37°C)!',
      'Because our saliva is made of boiling acid',
      'Because sugar turns to gas when we breathe',
      'Because teeth friction creates 100°C steam heat'
    ],
    correctIdx: 0,
    scienceFact: 'Cocoa butter is unique in nature: solid and snap-crisp at room temperature (20°C), yet silky liquid at 34°C!'
  },
  {
    q: 'Who invented the very first solid chocolate eating bar in Bristol, England in 1847?',
    options: [
      'Joseph Fry (J.S. Fry & Sons)',
      'Willy Wonka',
      'Roald Dahl',
      'Henri Nestlé'
    ],
    correctIdx: 0,
    scienceFact: 'Before 1847, chocolate was exclusively consumed as a warm, bitter liquid beverage for thousands of years!'
  },
  {
    q: 'What happens to gum-obsessed Violet Beauregarde after chewing the 3-course dinner gum?',
    options: [
      'She swells up into an enormous, round, juicy blue-purple blueberry!',
      'Her hair turns into rainbow strawberry laces',
      'Her teeth turn permanently into hard rock candy',
      'She shrinks down to the size of a chocolate coin'
    ],
    correctIdx: 0,
    scienceFact: 'The gum’s third course, blueberry pie and cream, was not yet perfected, causing her to inflate!'
  },
  {
    q: 'Why can cacao trees ONLY grow within 20 degrees North and South of the Equator?',
    options: [
      'They require intense tropical warmth, high humidity, and steady rainfall all year.',
      'They need freezing mountain snow to activate their seeds.',
      'They only sprout in dry desert sand dunes.',
      'They can only be pollinated by polar bears.'
    ],
    correctIdx: 0,
    scienceFact: 'Cacao trees are delicate tropical understory trees that perish if the temperature drops below 15°C.'
  },
  {
    q: 'What moral lesson do the singing Oompa Loompas teach after each child’s downfall?',
    options: [
      'Greed, selfishness, laziness, and bad manners always lead to disaster!',
      'Eating candy 24 hours a day makes you super healthy.',
      'Children should never listen to their parents or teachers.',
      'Watching television 12 hours a day makes you wise.'
    ],
    correctIdx: 0,
    scienceFact: 'Roald Dahl used the Oompa Loompa songs as clever poetic satires warning against modern childhood vices.'
  },
  {
    q: 'In Lesson 4.4, which senses does the poet rely on to describe "crunchy, snappy crisps"?',
    options: [
      'Sound (Hearing the snap) & Touch (Feeling the crunchy texture)',
      'Smell only',
      'Sight only',
      'Magnetic sense'
    ],
    correctIdx: 0,
    scienceFact: 'Sensory adjectives describe sight, sound, smell, taste, and touch to paint vivid pictures in the reader’s mind!'
  }
];

export default function ClassroomGames({
  isTeacherMode,
  onGamePlayed,
  teamScores,
  setTeamScores,
  genAlphaMode = false
}: ClassroomGamesProps) {
  // Navigation & Active Game
  const [activeGame, setActiveGame] = useState<'mystery' | 'process' | 'quantifiers' | 'sorter' | 'wonka'>('mystery');

  // Custom Team Names
  const [teamAName, setTeamAName] = useState('🦁 Team A · Golden Lions');
  const [teamBName, setTeamBName] = useState('🦅 Team B · Emerald Falcons');
  const [isEditingNames, setIsEditingNames] = useState(false);

  // Active Buzzer State (Key A / Key L or Screen Buzzers)
  const [buzzedTeam, setBuzzedTeam] = useState<'A' | 'B' | null>(null);
  const [buzzerTimer, setBuzzerTimer] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [lastScorer, setLastScorer] = useState<'A' | 'B' | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Show Champion Celebration Modal
  const [showChampionModal, setShowChampionModal] = useState(false);

  // Keyboard shortcut listener for classroom smartboards / laptops
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'a' || e.key === 'A') {
        triggerBuzz('A');
      } else if (e.key === 'l' || e.key === 'L') {
        triggerBuzz('B');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buzzedTeam]);

  // Buzzer countdown timer
  useEffect(() => {
    if (buzzerTimer === null) return;
    if (buzzerTimer <= 0) {
      sound.playWrong();
      setBuzzerTimer(null);
      setBuzzedTeam(null);
      return;
    }
    const timer = setTimeout(() => {
      sound.playTick();
      setBuzzerTimer(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [buzzerTimer]);

  const triggerBuzz = (team: 'A' | 'B') => {
    if (buzzedTeam !== null) return; // Already buzzed
    sound.playBuzzer();
    setBuzzedTeam(team);
    setBuzzerTimer(7); // 7-second countdown
  };

  const clearBuzz = () => {
    setBuzzedTeam(null);
    setBuzzerTimer(null);
  };

  const awardPoints = (team: 'A' | 'B', pts: number, reason?: string) => {
    if (pts > 0) {
      sound.playCorrect();
      // Calculate streak
      if (lastScorer === team) {
        setStreakCount(prev => prev + 1);
        if (streakCount >= 2) {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        }
      } else {
        setStreakCount(1);
        setLastScorer(team);
      }
    } else {
      sound.playWrong();
      setStreakCount(0);
      setLastScorer(null);
    }

    setTeamScores(prev => ({
      ...prev,
      teamA: team === 'A' ? Math.max(0, prev.teamA + pts) : prev.teamA,
      teamB: team === 'B' ? Math.max(0, prev.teamB + pts) : prev.teamB
    }));

    clearBuzz();
  };

  const celebrateVictory = () => {
    sound.playFanfare();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
    setShowChampionModal(true);
  };

  // ===========================================================================
  // GAME 1: MYSTERY FOOD DETECTIVE STATE
  // ===========================================================================
  const [caseIdx, setCaseIdx] = useState(0);
  const [revealedClues, setRevealedClues] = useState<number>(1);
  const [showMysteryAnswer, setShowMysteryAnswer] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [suspectFeedback, setSuspectFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const currentCase = MYSTERY_CASES[caseIdx];

  const handleNextCase = () => {
    setCaseIdx((caseIdx + 1) % MYSTERY_CASES.length);
    setRevealedClues(1);
    setShowMysteryAnswer(false);
    setSelectedSuspect(null);
    setSuspectFeedback(null);
    sound.playClick();
  };

  const handleGuessSuspect = (suspectName: string) => {
    setSelectedSuspect(suspectName);
    const isCorrect = suspectName.toLowerCase().includes(currentCase.name.toLowerCase().split(' ')[0]);

    if (isCorrect) {
      sound.playFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setShowMysteryAnswer(true);
      const earnedPts = currentCase.clues[revealedClues - 1]?.pts || 100;
      setSuspectFeedback({
        isCorrect: true,
        msg: `🎉 Brilliant Detective Work! It is indeed ${currentCase.name}! (+${earnedPts} pts)`
      });
      if (buzzedTeam) {
        awardPoints(buzzedTeam, earnedPts);
      }
    } else {
      sound.playWrong();
      setSuspectFeedback({
        isCorrect: false,
        msg: `❌ Not ${suspectName}! Reveal the next clue or let the other team steal!`
      });
    }
  };

  // ===========================================================================
  // GAME 2: FACTORY PROCESS CONVEYOR SCRAMBLE STATE
  // ===========================================================================
  const [scrambledSteps, setScrambledSteps] = useState(() => {
    return [...FACTORY_STEPS_CORRECT].sort(() => Math.random() - 0.5);
  });
  const [conveyorRunning, setConveyorRunning] = useState(false);
  const [conveyorResult, setConveyorResult] = useState<{ success: boolean; errors: number } | null>(null);

  const shuffleConveyor = () => {
    setScrambledSteps([...FACTORY_STEPS_CORRECT].sort(() => Math.random() - 0.5));
    setConveyorResult(null);
    setConveyorRunning(false);
    sound.playClick();
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === scrambledSteps.length - 1) return;
    sound.playPop();

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...scrambledSteps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setScrambledSteps(updated);
    setConveyorResult(null);
  };

  const testConveyorBelt = () => {
    setConveyorRunning(true);
    sound.playKahootBeep();

    setTimeout(() => {
      setConveyorRunning(false);
      let errors = 0;
      scrambledSteps.forEach((step, idx) => {
        if (step.id !== FACTORY_STEPS_CORRECT[idx].id) {
          errors++;
        }
      });

      if (errors === 0) {
        sound.playFanfare();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setConveyorResult({ success: true, errors: 0 });
        if (buzzedTeam) {
          awardPoints(buzzedTeam, 300);
        }
      } else {
        sound.playWrong();
        setConveyorResult({ success: false, errors });
      }
    }, 1200);
  };

  // ===========================================================================
  // GAME 3: RAPID-FIRE QUANTIFIER BUZZER STATE
  // ===========================================================================
  const [qIdx, setQIdx] = useState(0);
  const [qSelectedOption, setQSelectedOption] = useState<string | null>(null);
  const [qRevealed, setQRevealed] = useState(false);
  const [qTimer, setQTimer] = useState<number>(15);
  const [qTimerActive, setQTimerActive] = useState<boolean>(false);

  const currentQ = QUANTIFIER_QUESTIONS[qIdx];

  useEffect(() => {
    if (!qTimerActive || qRevealed) return;
    if (qTimer <= 0) {
      sound.playWrong();
      setQRevealed(true);
      setQTimerActive(false);
      return;
    }
    const t = setInterval(() => {
      setQTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [qTimerActive, qTimer, qRevealed]);

  const handleStartQRound = () => {
    setQSelectedOption(null);
    setQRevealed(false);
    setQTimer(15);
    setQTimerActive(true);
    clearBuzz();
    sound.playKahootBeep();
  };

  const handleAnswerQuantifier = (option: string) => {
    if (qRevealed) return;
    setQSelectedOption(option);
    setQRevealed(true);
    setQTimerActive(false);

    if (option.toLowerCase() === currentQ.correct.toLowerCase()) {
      sound.playCorrect();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      const pts = qTimer > 7 ? 150 : 100;
      if (buzzedTeam) {
        awardPoints(buzzedTeam, pts);
      }
    } else {
      sound.playWrong();
      if (buzzedTeam) {
        awardPoints(buzzedTeam, -50);
      }
    }
  };

  const handleNextQ = () => {
    setQIdx((qIdx + 1) % QUANTIFIER_QUESTIONS.length);
    handleStartQRound();
  };

  // ===========================================================================
  // GAME 4: "HOW DOES IT GROW?" ARCADE SPEED SORTER STATE
  // ===========================================================================
  const [sorterScore, setSorterScore] = useState(0);
  const [sorterStreak, setSorterStreak] = useState(0);
  const [sorterIdx, setSorterIdx] = useState(0);
  const [sorterActive, setSorterActive] = useState(false);
  const [sorterFeedback, setSorterFeedback] = useState<{ isCorrect: boolean; item: string; correctZone: string } | null>(null);
  const [shuffledGrowItems, setShuffledGrowItems] = useState(() => [...GROW_ITEMS].sort(() => Math.random() - 0.5));

  const currentGrowItem = shuffledGrowItems[sorterIdx % shuffledGrowItems.length];

  const handleStartSorter = () => {
    setSorterScore(0);
    setSorterStreak(0);
    setSorterIdx(0);
    setSorterActive(true);
    setSorterFeedback(null);
    setShuffledGrowItems([...GROW_ITEMS].sort(() => Math.random() - 0.5));
    sound.playKahootBeep();
  };

  const handleSortItem = (selectedZone: 'tree' | 'bush' | 'ground' | 'underground') => {
    if (!sorterActive) return;

    if (selectedZone === currentGrowItem.zone) {
      sound.playCorrect();
      const points = 50 + sorterStreak * 10;
      setSorterScore(prev => prev + points);
      setSorterStreak(prev => prev + 1);
      setSorterFeedback({ isCorrect: true, item: currentGrowItem.name, correctZone: currentGrowItem.label });

      if (buzzedTeam) {
        awardPoints(buzzedTeam, points);
      }
    } else {
      sound.playWrong();
      setSorterStreak(0);
      setSorterFeedback({ isCorrect: false, item: currentGrowItem.name, correctZone: currentGrowItem.label });
    }

    // Advance to next item
    if (sorterIdx + 1 >= shuffledGrowItems.length) {
      sound.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      setSorterActive(false);
    } else {
      setSorterIdx(prev => prev + 1);
    }
  };

  // ===========================================================================
  // GAME 5: WILLY WONKA TRIVIA STATE
  // ===========================================================================
  const [wonkaIdx, setWonkaIdx] = useState(0);
  const [wonkaSelected, setWonkaSelected] = useState<number | null>(null);
  const [wonkaRevealed, setWonkaRevealed] = useState(false);
  const [goldenTicketMultiplier, setGoldenTicketMultiplier] = useState<number>(1);

  const currentWonka = WONKA_QUESTIONS[wonkaIdx];

  const handleSpinGoldenTicket = () => {
    sound.playBell();
    const multipliers = [1, 2, 2, 3];
    const picked = multipliers[Math.floor(Math.random() * multipliers.length)];
    setGoldenTicketMultiplier(picked);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleAnswerWonka = (choiceIdx: number) => {
    if (wonkaRevealed) return;
    setWonkaSelected(choiceIdx);
    setWonkaRevealed(true);

    if (choiceIdx === currentWonka.correctIdx) {
      sound.playFanfare();
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      const pts = 150 * goldenTicketMultiplier;
      if (buzzedTeam) {
        awardPoints(buzzedTeam, pts);
      }
    } else {
      sound.playWrong();
      if (buzzedTeam) {
        awardPoints(buzzedTeam, -50);
      }
    }
  };

  const handleNextWonka = () => {
    setWonkaIdx((wonkaIdx + 1) % WONKA_QUESTIONS.length);
    setWonkaSelected(null);
    setWonkaRevealed(false);
    setGoldenTicketMultiplier(1);
    clearBuzz();
    sound.playClick();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2 px-2 sm:px-4">
      
      {/* ===================================================================== */}
      {/* TOP ARENA HEADER & BUZZER HUD */}
      {/* ===================================================================== */}
      <div className="bg-[#560e51] text-white p-5 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#78c222] space-y-4">
        
        {/* Header Title & Tournament Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fuchsia-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#78c222] text-[#560e51] flex items-center justify-center font-black shadow-inner">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-[#78c222] uppercase tracking-wider">
                  Classroom Tournament Arena
                </span>
                {streakCount > 1 && (
                  <span className="text-xs font-mono font-black text-amber-300 flex items-center gap-1 animate-pulse">
                    <Flame className="w-3.5 h-3.5" /> {streakCount}X STREAK!
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                Unit 4 Food Championship 🏆
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingNames(!isEditingNames)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl border border-white/20 cursor-pointer flex items-center gap-1.5 transition-colors"
              title="Edit Team Names"
            >
              <Users className="w-3.5 h-3.5 text-[#78c222]" />
              {isEditingNames ? 'Done Editing' : 'Edit Teams'}
            </button>

            <button
              onClick={celebrateVictory}
              className="px-3 py-1.5 bg-[#78c222] hover:bg-[#69b01a] text-[#560e51] text-xs font-black uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer flex items-center gap-1 transition-transform active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              Crown Winner!
            </button>
          </div>
        </div>

        {/* Team Name Inputs if Editing */}
        {isEditingNames && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/20 p-3 rounded-2xl border border-white/10"
          >
            <div>
              <label className="text-[11px] font-mono text-amber-300 uppercase">Team A Name:</label>
              <input
                type="text"
                value={teamAName}
                onChange={e => setTeamAName(e.target.value)}
                className="w-full bg-white/10 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-white/20 outline-none focus:border-[#78c222]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-cyan-300 uppercase">Team B Name:</label>
              <input
                type="text"
                value={teamBName}
                onChange={e => setTeamBName(e.target.value)}
                className="w-full bg-white/10 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-white/20 outline-none focus:border-[#78c222]"
              />
            </div>
          </motion.div>
        )}

        {/* DUAL INTERACTIVE TEAM BUZZER PODS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* TEAM A POD */}
          <div
            className={`p-4 rounded-2xl border-3 transition-all relative overflow-hidden ${
              buzzedTeam === 'A'
                ? 'bg-amber-500/30 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] ring-4 ring-amber-300'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-amber-300 truncate max-w-[180px]">
                {teamAName}
              </span>
              <span className="text-2xl font-mono font-black text-white">
                {teamScores.teamA} pts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerBuzz('A')}
                disabled={buzzedTeam !== null}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wide border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  buzzedTeam === 'A'
                    ? 'bg-amber-400 text-slate-950 border-white shadow-[0_4px_0_#b45309] animate-bounce'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-[0_3px_0_#92400e] active:translate-y-1'
                } ${buzzedTeam !== null && buzzedTeam !== 'A' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Zap className="w-4 h-4 fill-current" />
                BUZZ IN! (Key 'A')
              </button>

              <div className="flex gap-1">
                <button
                  onClick={() => awardPoints('A', 100, 'Correct Answer')}
                  className="px-2.5 py-2 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs rounded-xl border border-white/20 cursor-pointer"
                  title="Award 100 pts"
                >
                  +100
                </button>
                <button
                  onClick={() => awardPoints('A', 50, 'Quick Answer')}
                  className="px-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border border-white/20 cursor-pointer"
                  title="Award 50 pts"
                >
                  +50
                </button>
                <button
                  onClick={() => awardPoints('A', -50, 'Wrong Guess')}
                  className="px-2 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl border border-white/20 cursor-pointer"
                  title="Deduct 50 pts"
                >
                  -50
                </button>
              </div>
            </div>
          </div>

          {/* TEAM B POD */}
          <div
            className={`p-4 rounded-2xl border-3 transition-all relative overflow-hidden ${
              buzzedTeam === 'B'
                ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] ring-4 ring-cyan-300'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-cyan-300 truncate max-w-[180px]">
                {teamBName}
              </span>
              <span className="text-2xl font-mono font-black text-white">
                {teamScores.teamB} pts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerBuzz('B')}
                disabled={buzzedTeam !== null}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wide border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  buzzedTeam === 'B'
                    ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_4px_0_#0e7490] animate-bounce'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_3px_0_#155e75] active:translate-y-1'
                } ${buzzedTeam !== null && buzzedTeam !== 'B' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Zap className="w-4 h-4 fill-current" />
                BUZZ IN! (Key 'L')
              </button>

              <div className="flex gap-1">
                <button
                  onClick={() => awardPoints('B', 100, 'Correct Answer')}
                  className="px-2.5 py-2 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs rounded-xl border border-white/20 cursor-pointer"
                  title="Award 100 pts"
                >
                  +100
                </button>
                <button
                  onClick={() => awardPoints('B', 50, 'Quick Answer')}
                  className="px-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border border-white/20 cursor-pointer"
                  title="Award 50 pts"
                >
                  +50
                </button>
                <button
                  onClick={() => awardPoints('B', -50, 'Wrong Guess')}
                  className="px-2 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl border border-white/20 cursor-pointer"
                  title="Deduct 50 pts"
                >
                  -50
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BUZZER LOCKOUT NOTIFICATION BAR */}
        {buzzedTeam && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white text-slate-950 p-3 rounded-2xl flex items-center justify-between border-2 border-[#78c222] shadow-[3px_3px_0px_0px_#78c222]"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-spin">⚡</span>
              <div>
                <p className="text-xs font-mono font-black text-[#560e51] uppercase">
                  First to Buzz In:
                </p>
                <p className="text-sm font-black text-slate-900">
                  {buzzedTeam === 'A' ? teamAName : teamBName} has the floor to answer!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-rose-100 text-rose-800 font-mono font-black px-3 py-1.5 rounded-xl border border-rose-300">
                <Timer className="w-4 h-4 text-rose-600 animate-spin" />
                <span className="text-base">{buzzerTimer}s</span>
              </div>
              <button
                onClick={clearBuzz}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 cursor-pointer"
              >
                Reset Buzzer
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 5-GAME NAVIGATION BAR */}
      {/* ===================================================================== */}
      <div className="flex justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'mystery', label: '1. Food Detective 🕵️', desc: 'Clue Hunt' },
          { id: 'process', label: '2. Bean to Bar 🍫', desc: 'Conveyor Run' },
          { id: 'quantifiers', label: '3. Quantifier Rush ⚡', desc: 'Speed Buzzer' },
          { id: 'sorter', label: '4. Grow Sorter 🌱', desc: 'Arcade Sprint' },
          { id: 'wonka', label: '5. Wonka Trivia 🎩', desc: 'Golden Ticket' }
        ].map(g => (
          <button
            key={g.id}
            onClick={() => {
              setActiveGame(g.id as any);
              onGamePlayed(g.id);
              sound.playClick();
            }}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tight border-3 transition-all cursor-pointer whitespace-nowrap text-left ${
              activeGame === g.id
                ? 'bg-[#560e51] text-white border-[#560e51] shadow-[3px_3px_0px_0px_#78c222] translate-y-[-2px]'
                : 'bg-white hover:bg-fuchsia-50 text-slate-700 border-slate-300 shadow-[2px_2px_0px_0px_#cbd5e1]'
            }`}
          >
            <div>{g.label}</div>
          </button>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* GAME 1: MYSTERY FOOD DETECTIVE */}
      {/* ===================================================================== */}
      {activeGame === 'mystery' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          
          {/* Header */}
          <div className="border-b-2 border-fuchsia-100 pb-3 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                  Mystery File {caseIdx + 1} of {MYSTERY_CASES.length} · How Food Grows & Senses
                </span>
                <span className="text-xs bg-[#78c222]/20 text-[#560e51] px-2 py-0.5 rounded font-black font-mono">
                  {currentCase.clues[revealedClues - 1]?.pts || 100} PTS VALUE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Who Am I? (Classroom Clue Mystery)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const speech = currentCase.clues.slice(0, revealedClues).map(c => c.text).join(' ');
                  humanVoice.speak(speech);
                }}
                className="p-2.5 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] rounded-xl border border-[#560e51] cursor-pointer"
                title="Read Clues Aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextCase}
                className="px-4 py-2 bg-[#560e51] hover:bg-[#43093f] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
              >
                Next Mystery Case →
              </button>
            </div>
          </div>

          {/* Clues Discovered Container */}
          <div className="space-y-3">
            {currentCase.clues.slice(0, revealedClues).map((clue, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-[#fefaf0] border-2 border-[#560e51] rounded-2xl shadow-[3px_3px_0px_0px_#560e51] flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#78c222] text-[#560e51] font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51] shadow-inner text-xs">
                  #{idx + 1}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                    {clue.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Clue Controls */}
            <div className="flex flex-wrap gap-3 pt-2">
              {revealedClues < 3 && (
                <button
                  onClick={() => {
                    setRevealedClues(prev => prev + 1);
                    sound.playPop();
                  }}
                  className="px-5 py-2.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlock Clue #{revealedClues + 1} ({revealedClues === 1 ? '200 pts' : '100 pts'})
                </button>
              )}

              <button
                onClick={() => {
                  setShowMysteryAnswer(!showMysteryAnswer);
                  if (!showMysteryAnswer) sound.playFanfare();
                  else sound.playClick();
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase rounded-xl border-2 border-slate-400 cursor-pointer"
              >
                {showMysteryAnswer ? 'Hide Identity' : 'Teacher Reveal 💡'}
              </button>
            </div>
          </div>

          {/* Interactive Food Suspect Lineup */}
          <div className="border-t-2 border-fuchsia-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-[#560e51] uppercase tracking-wider">
                Suspect Lineup · Click to Lock In Team Guess
              </span>
              <span className="text-xs text-slate-500 font-bold">
                {FOOD_SUSPECTS.length} Suspects in Lineup
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {FOOD_SUSPECTS.map(suspect => (
                <button
                  key={suspect.name}
                  onClick={() => handleGuessSuspect(suspect.name)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    selectedSuspect === suspect.name
                      ? 'bg-fuchsia-100 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] scale-105'
                      : 'bg-white hover:bg-fuchsia-50/60 border-slate-200 hover:border-[#560e51]'
                  }`}
                >
                  <span className="text-2xl">{suspect.emoji}</span>
                  <span className="text-xs font-black text-slate-900 leading-tight">
                    {suspect.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Guess Result Feedback */}
            {suspectFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-between gap-3 ${
                  suspectFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-rose-50 border-rose-400 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  {suspectFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span>{suspectFeedback.msg}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Answer Card if Revealed */}
          {showMysteryAnswer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-3 border-emerald-500 rounded-3xl text-center space-y-2 shadow-[4px_4px_0px_0px_#10b981]"
            >
              <span className="text-xs font-mono font-black text-emerald-800 uppercase tracking-widest">
                Case Solved! Authentic Cambridge ESL Target
              </span>
              <div className="text-5xl my-1">{currentCase.emoji}</div>
              <h4 className="text-3xl font-black text-[#560e51] uppercase">
                {currentCase.name}
              </h4>
              <p className="text-xs font-mono font-bold text-slate-600">
                Grows: {currentCase.category}
              </p>
              <p className="text-xs font-medium text-slate-700 max-w-lg mx-auto pt-1 italic">
                "{currentCase.funFact}"
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* GAME 2: FACTORY PROCESS CONVEYOR SCRAMBLE */}
      {/* ===================================================================== */}
      {activeGame === 'process' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          
          <div className="border-b-2 border-fuchsia-100 pb-3 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Lesson 4.2 · Passive Voice (is/are + Past Participle)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                From Bean to Bar: Chocolate Factory Conveyor Run 🍫
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={shuffleConveyor}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase rounded-xl border border-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Scramble Steps
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <span>
              <strong>Challenge:</strong> The factory conveyor belt had a power surge and mixed up all 7 chocolate steps! Reorder them from first harvest to final chocolate bar, then test the belt!
            </span>
          </div>

          {/* Interactive Steps List with Up / Down Controls */}
          <div className="space-y-2.5">
            {scrambledSteps.map((step, idx) => (
              <motion.div
                key={step.id}
                layout
                className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#560e51] transition-all ${
                  conveyorResult
                    ? step.id === FACTORY_STEPS_CORRECT[idx].id
                      ? 'bg-emerald-50 border-emerald-500'
                      : 'bg-rose-50 border-rose-400'
                    : 'bg-[#fdf2fe] border-[#560e51]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#78c222] text-[#560e51] font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51] text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <h5 className="text-xs font-mono font-black text-[#560e51] uppercase">
                      {step.title}
                    </h5>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.text}
                    </p>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === scrambledSteps.length - 1}
                    className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Test Conveyor Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={testConveyorBelt}
              disabled={conveyorRunning}
              className="px-6 py-3 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-sm uppercase rounded-2xl border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] cursor-pointer flex items-center gap-2 transition-transform active:scale-95"
            >
              <Play className={`w-4 h-4 ${conveyorRunning ? 'animate-spin' : ''}`} />
              {conveyorRunning ? 'Powering Conveyor Gears...' : 'Start Conveyor & Test Order (300 pts) 🚀'}
            </button>

            {conveyorResult && (
              <div className="flex items-center gap-2">
                {conveyorResult.success ? (
                  <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 100% Correct Sequence! The Chocolate Factory is Operational!
                  </span>
                ) : (
                  <span className="text-sm font-black text-rose-700 bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> {conveyorResult.errors} steps are out of order! Keep adjusting!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GAME 3: RAPID-FIRE QUANTIFIER BUZZER SHOWDOWN */}
      {/* ===================================================================== */}
      {activeGame === 'quantifiers' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          
          <div className="border-b-2 border-fuchsia-100 pb-3 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Challenge {qIdx + 1} of {QUANTIFIER_QUESTIONS.length} · Cambridge Grammar Focus
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Quantifier Buzzer Rush: Some, Any, Few, Little, Much, Many ⚡
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => humanVoice.speak(currentQ.prompt)}
                className="p-2.5 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] rounded-xl border border-[#560e51] cursor-pointer"
                title="Read Prompt"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextQ}
                className="px-4 py-2 bg-[#560e51] hover:bg-[#43093f] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
              >
                Next Prompt →
              </button>
            </div>
          </div>

          {/* Question Card & Countdown Timer */}
          <div className="bg-[#fefaf0] p-6 sm:p-8 rounded-3xl border-3 border-[#560e51] shadow-[5px_5px_0px_0px_#560e51] space-y-6 relative overflow-hidden">
            
            {/* Top Timer Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-[#560e51] uppercase">
                {buzzedTeam ? `${buzzedTeam === 'A' ? teamAName : teamBName} Answer Locked In!` : 'Teams Ready... Buzz In!'}
              </span>

              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-300">
                <Timer className="w-4 h-4 text-amber-600" />
                <span className="font-mono font-black text-slate-900 text-sm">
                  {qTimer}s remaining
                </span>
              </div>
            </div>

            <div className="text-center py-4">
              <h4 className="text-2xl sm:text-3xl font-black text-slate-950 leading-snug max-w-2xl mx-auto">
                "{currentQ.prompt}"
              </h4>
            </div>

            {/* 4 Interactive Choice Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isCorrect = opt.toLowerCase() === currentQ.correct.toLowerCase();
                const isSelected = qSelectedOption === opt;
                
                let btnStyle = 'bg-white hover:bg-fuchsia-50 border-slate-300 text-slate-900';
                if (qRevealed) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-[3px_3px_0px_0px_#065f46]';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-[3px_3px_0px_0px_#881337]';
                  } else {
                    btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerQuantifier(opt)}
                    disabled={qRevealed}
                    className={`p-4 rounded-2xl border-3 font-black text-lg uppercase transition-all cursor-pointer flex items-center justify-between shadow-[2px_2px_0px_0px_#560e51] ${btnStyle} active:scale-98`}
                  >
                    <span>{opt}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/10">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation Card */}
            {qRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white rounded-2xl border-2 border-[#78c222] shadow-[3px_3px_0px_0px_#78c222] space-y-1"
              >
                <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase font-mono">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Correct Answer: "{currentQ.correct.toUpperCase()}"
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700">
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GAME 4: "HOW DOES IT GROW?" ARCADE SPEED SORTER */}
      {/* ===================================================================== */}
      {activeGame === 'sorter' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          
          <div className="border-b-2 border-fuchsia-100 pb-3 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Lesson 4.1 Core Assessment Objective · Fast-Action Arcade
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                "How Does It Grow?" Speed Sorter 🧺
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-fuchsia-100 px-3 py-1.5 rounded-xl border border-[#560e51] font-mono font-black text-xs text-[#560e51]">
                Score: {sorterScore} pts
              </div>
              <button
                onClick={handleStartSorter}
                className="px-4 py-2 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {sorterActive ? 'Restart Arcade' : 'Start Sorter Run'}
              </button>
            </div>
          </div>

          {/* Current Food Flying Card */}
          <div className="p-8 bg-[#fdf2fe] rounded-3xl border-3 border-[#560e51] shadow-[5px_5px_0px_0px_#560e51] text-center space-y-3 relative overflow-hidden">
            <span className="text-xs font-mono font-black text-[#560e51] uppercase tracking-wider">
              Item {sorterIdx + 1} of {shuffledGrowItems.length}
            </span>

            <motion.div
              key={currentGrowItem.name}
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <div className="text-6xl">{currentGrowItem.emoji}</div>
              <h4 className="text-3xl font-black text-slate-950 uppercase tracking-tight">
                {currentGrowItem.name}
              </h4>
              <p className="text-xs font-mono text-slate-500 font-bold">
                Where does this food grow? Tap the basket!
              </p>
            </motion.div>

            {sorterFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs font-mono font-black px-3 py-1 rounded-full inline-block ${
                  sorterFeedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {sorterFeedback.isCorrect
                  ? `✅ Correct! ${sorterFeedback.item} grows ${sorterFeedback.correctZone}!`
                  : `❌ Wrong! ${sorterFeedback.item} actually grows ${sorterFeedback.correctZone}!`}
              </motion.div>
            )}
          </div>

          {/* 4 BASKET TARGETS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'tree', label: 'On a Tree', icon: '🌳', hint: 'Banana, Papaya, Cacao, Coconut', color: 'hover:bg-emerald-50 border-emerald-500' },
              { id: 'bush', label: 'On a Bush / Plant', icon: '🌿', hint: 'Tomato, Chili, Blueberry', color: 'hover:bg-teal-50 border-teal-500' },
              { id: 'ground', label: 'On the Ground (Vines)', icon: '🍉', hint: 'Watermelon, Pumpkin, Pineapple', color: 'hover:bg-amber-50 border-amber-500' },
              { id: 'underground', label: 'Under the Ground', icon: '🥕', hint: 'Carrot, Onion, Potato', color: 'hover:bg-orange-50 border-orange-500' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => handleSortItem(b.id as any)}
                className={`p-4 bg-white rounded-2xl border-3 text-center space-y-1.5 transition-all cursor-pointer shadow-[3px_3px_0px_0px_#560e51] active:translate-y-1 ${b.color}`}
              >
                <div className="text-3xl">{b.icon}</div>
                <h5 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                  {b.label}
                </h5>
                <p className="text-[10px] text-slate-500 font-mono">
                  {b.hint}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GAME 5: WILLY WONKA TRIVIA & GOLDEN TICKET WHEEL */}
      {/* ===================================================================== */}
      {activeGame === 'wonka' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          
          <div className="border-b-2 border-fuchsia-100 pb-3 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Lesson 4.5 Roald Dahl Literature & Chocolate Science
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Charlie and the Chocolate Factory Trivia 🎩🎫
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpinGoldenTicket}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase rounded-xl border-2 border-amber-600 shadow-[2px_2px_0px_0px_#b45309] cursor-pointer flex items-center gap-1.5"
                title="Spin Golden Ticket Multiplier"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Golden Ticket: {goldenTicketMultiplier}X PTS!
              </button>

              <button
                onClick={handleNextWonka}
                className="px-4 py-2 bg-[#560e51] hover:bg-[#43093f] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
              >
                Next Wonka Card →
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#fdf2fe] to-amber-50/50 rounded-3xl border-3 border-[#560e51] shadow-[5px_5px_0px_0px_#560e51] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-[#560e51] uppercase">
                Trivia Question {wonkaIdx + 1} of {WONKA_QUESTIONS.length}
              </span>
              <span className="text-2xl">🎩🍫</span>
            </div>

            <p className="text-xl sm:text-2xl font-black text-slate-950 leading-relaxed">
              {currentWonka.q}
            </p>

            {/* 4 Trivia Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentWonka.options.map((opt, idx) => {
                const isCorrect = idx === currentWonka.correctIdx;
                const isSelected = wonkaSelected === idx;

                let optStyle = 'bg-white hover:bg-fuchsia-50 border-slate-300 text-slate-900';
                if (wonkaRevealed) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-[3px_3px_0px_0px_#065f46]';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-500 text-white border-rose-600 shadow-[3px_3px_0px_0px_#881337]';
                  } else {
                    optStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerWonka(idx)}
                    disabled={wonkaRevealed}
                    className={`p-4 rounded-2xl border-3 font-bold text-sm text-left transition-all cursor-pointer shadow-[2px_2px_0px_0px_#560e51] ${optStyle}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-black/10 font-mono font-black flex items-center justify-center shrink-0 text-xs">
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Wonka Science Fact Card */}
            {wonkaRevealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white rounded-2xl border-2 border-amber-400 shadow-[3px_3px_0px_0px_#f59e0b] space-y-1"
              >
                <div className="flex items-center gap-1.5 text-amber-800 font-mono font-black text-xs uppercase">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Willy Wonka Fact & Cambridge Science Key:
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700">
                  {currentWonka.scienceFact}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CHAMPION CELEBRATION MODAL */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showChampionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#78c222] text-center space-y-5"
            >
              <div className="text-6xl animate-bounce">🏆</div>
              <div>
                <span className="text-xs font-mono font-black text-[#78c222] uppercase tracking-widest bg-[#560e51] px-3 py-1 rounded-full">
                  Grand Tournament Victory!
                </span>
                <h3 className="text-2xl font-black text-slate-950 uppercase mt-3">
                  {teamScores.teamA > teamScores.teamB
                    ? `${teamAName} WINS!`
                    : teamScores.teamB > teamScores.teamA
                    ? `${teamBName} WINS!`
                    : 'IT IS A DEADLOCK TIE!'}
                </h3>
                <p className="text-sm font-bold text-slate-600 mt-1">
                  Final Score: {teamScores.teamA} pts vs {teamScores.teamB} pts
                </p>
              </div>

              <div className="bg-[#fdf2fe] p-4 rounded-2xl border-2 border-[#560e51] text-xs font-bold text-slate-800 leading-relaxed">
                Maha Suci Allah, exceptional dedication from both teams mastering Grade 4 Unit 4 Food, how plants grow, and chocolate science!
              </div>

              <button
                onClick={() => setShowChampionModal(false)}
                className="w-full py-3 bg-[#560e51] hover:bg-[#43093f] text-white font-black text-sm uppercase rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#78c222] cursor-pointer"
              >
                Close Victory Stage
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
