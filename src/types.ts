export type FlashcardCategory =
  | 'breakfast-foods'
  | 'how-food-grows'
  | 'chocolate-process'
  | 'gardening-plants'
  | 'sensory-adjectives'
  | 'charlie-chocolate'
  | 'quantifiers-food';

export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  category: FlashcardCategory;
  example: string;
  lesson: '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6';
  funFact?: string;
  imageUrl?: string;
}

export interface MatchPair {
  id: string;
  food: string;
  growthLocation: string; // e.g. "on a tree", "on a plant", "in the ground", "on the ground"
  type: string;
}

export interface ProcessStep {
  id: string;
  stepNumber: number;
  action: string;
  connector: string;
  details: string;
}

export interface RhymePair {
  id: string;
  word1: string;
  word2: string;
  verse?: number;
}

export type QuestionCategory = 
  | 'listening'
  | 'vocabulary' 
  | 'grammar' 
  | 'reading' 
  | 'writing';

export interface SATQuestion {
  id: number;
  number: number;
  category: QuestionCategory;
  part: 1 | 2 | 3 | 4 | 5;
  points: number;
  question: string;
  options?: string[]; // Multiple choice options
  correctAnswer: string | boolean; // Option text, word, or true/false
  explanation: string;
  hint: string;
  matchLetter?: string; // For Part 2 matching letter A-F
  adjective?: string; // For sensory adjectives
  anagramLetters?: string[]; // For word anagram cards
  blankWordOptions?: string[]; // For fill in the blanks
  audioPrompt?: string; // Text spoken for listening
  stepOrderNumber?: number; // For Part 1 sequence steps (2-6)
}

export interface StudentProgress {
  vocabReviewed: string[]; // Set of Flashcard IDs
  grammarAccuracy: { [key: string]: number }; // Practice category -> percentage
  mockExamScore: number | null;
  mockExamCompleted: boolean;
  gamesPlayed: string[]; // Set of game keys
  unlockedBadges: string[];
  projectSaved?: boolean;
}

export interface ClassroomScores {
  teamA: number;
  teamB: number;
}

export interface FoodProjectData {
  foodName: string;
  foodType: string; // e.g. 'Fresh Fruit Drink', 'Chocolate Snack', 'Sprout Salad', 'Breakfast Pastry'
  originCountry: string;
  climateNeeded: string;
  growthType: string; // 'On a tree', 'On a plant', 'In the ground', 'Without soil'
  ingredients: string[];
  sensoryAdjectives: {
    sight: string;
    touch: string;
    smell: string;
    taste: string;
    sound: string;
  };
  processSteps: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  packagingDescription: string;
  healthFunFact: string;
  whyILoveIt: string;
}

// Backward compatibility alias during transition
export type DreamHomeProjectData = FoodProjectData;
export type ShuttleProjectData = FoodProjectData;

// =============================================================================
// SPELLING BEE CONTEST TYPES
// =============================================================================
export type SpellingTopic = 
  | 'Breakfast & Food' 
  | 'Sensory Adjectives' 
  | 'Chocolate & Science' 
  | 'Gardening & Growth' 
  | 'Charlie & Factory' 
  | 'Custom';

export type SpellingDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Championship';

export interface SpellingWord {
  id: string;
  word: string;
  topic: SpellingTopic;
  sentence: string;
  translation: string;
  definition: string;
  syllables: string;
  difficulty: SpellingDifficulty;
  phoneticHint?: string;
  isFromOfficialList?: boolean;
}

export interface AuditionCandidate {
  id: string;
  name: string;
  classroom: string;
  score: number;
  totalTested: number;
  status: 'pending' | 'qualified' | 'eliminated';
  notes?: string;
  wordsHistory?: {
    word: string;
    isCorrect: boolean;
    timestamp: number;
  }[];
}

export interface Finalist {
  id: string;
  name: string;
  classroom: string;
  score: number;
  strikes: number;
  isEliminated: boolean;
  stageRank?: number;
  wordsHistory: {
    word: string;
    isCorrect: boolean;
  }[];
}
