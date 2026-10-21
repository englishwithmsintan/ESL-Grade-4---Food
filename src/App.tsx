import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FlashcardModule from './components/FlashcardModule';
import GrammarPractice from './components/GrammarPractice';
import ClassroomGames from './components/ClassroomGames';
import SATMockExam from './components/SATMockExam';
import SpellingBeeContest from './components/SpellingBeeContest';
import ProgressTracker from './components/ProgressTracker';
import DreamHomeLab from './components/DreamHomeLab';
import UnitSummaryGuide from './components/UnitSummaryGuide';
import LiteratureStudy from './components/LiteratureStudy';
import AnimatedMasteryBar from './components/AnimatedMasteryBar';
import { StudentProgress, ClassroomScores, FoodProjectData } from './types';
import { FLASHCARDS, MOCK_SAT_QUESTIONS } from './data/reviewData';
import { sound } from './components/SoundManager';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  GraduationCap, 
  Play, 
  Bookmark,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_PROGRESS: StudentProgress = {
  vocabReviewed: [],
  grammarAccuracy: {},
  mockExamScore: null,
  mockExamCompleted: false,
  gamesPlayed: [],
  unlockedBadges: [],
  projectSaved: false
};

const INITIAL_SCORES: ClassroomScores = {
  teamA: 0,
  teamB: 0
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [genAlphaMode, setGenAlphaMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);

  // Student progress state with LocalStorage persistence
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = localStorage.getItem('sdit_auliya_unit4_progress') || localStorage.getItem('sdit_auliya_unit3_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROGRESS,
          ...parsed
        };
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
    return INITIAL_PROGRESS;
  });

  // Team scores state with LocalStorage persistence
  const [teamScores, setTeamScores] = useState<ClassroomScores>(() => {
    const saved = localStorage.getItem('sdit_auliya_unit4_scores') || localStorage.getItem('sdit_auliya_unit3_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved scores', e);
      }
    }
    return INITIAL_SCORES;
  });

  // Food Origin Project Data State (Lesson 4.6 Project Challenge)
  const [foodProjectData, setFoodProjectData] = useState<FoodProjectData>(() => {
    const saved = localStorage.getItem('sdit_auliya_unit4_food');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse food project data', e);
      }
    }
    return {
      foodName: 'Golden Sunrise Orange Juice',
      foodType: 'Fresh Citrus Drink',
      originCountry: 'Indonesia (West Java Groves)',
      climateNeeded: 'Warm tropical sunshine with plenty of rain',
      growthType: 'On a tree',
      ingredients: ['Freshly squeezed oranges', 'A little natural honey', 'Filtered spring water', 'Vitamin C'],
      sensoryAdjectives: {
        sight: 'bright vivid orange with fresh pulp',
        touch: 'cool and smooth carton packaging',
        smell: 'fragrant, sweet, and zesty citrus aroma',
        taste: 'sweet, tangy, and refreshingly juicy',
        sound: 'refreshing gentle splash when poured'
      },
      processSteps: {
        step1: 'First, ripe juicy oranges are picked by farmers from orchard trees.',
        step2: 'Then, the oranges are washed in fresh water and squeezed in clean pressers.',
        step3: 'A little natural honey is mixed in to give smooth sweetness.',
        step4: 'Finally, the fresh juice is poured into recyclable paper cartons and cooled.'
      },
      packagingDescription: 'Eco-friendly cardboard carton with bright orange illustrations and nutrition facts.',
      healthFunFact: 'Contains 100% of your daily Vitamin C requirement in every cold glass!',
      whyILoveIt: 'It tastes deliciously sweet and juicy, giving me lots of energy for school sports.'
    };
  });

  useEffect(() => {
    localStorage.setItem('sdit_auliya_unit4_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('sdit_auliya_unit4_scores', JSON.stringify(teamScores));
  }, [teamScores]);

  useEffect(() => {
    localStorage.setItem('sdit_auliya_unit4_food', JSON.stringify(foodProjectData));
  }, [foodProjectData]);

  // Calculate comprehensive mastery percentage across Unit 4 activities (Vocab, Grammar, Mock SAT, Games)
  const totalVocab = FLASHCARDS.length;
  const vocabReviewedCount = progress.vocabReviewed?.length || 0;
  const vocabScore = totalVocab > 0 ? (vocabReviewedCount / totalVocab) * 25 : 0;
  const examScore = progress.mockExamScore !== null ? (progress.mockExamScore / 50) * 45 : 0;
  const grammarEntries = Object.values(progress.grammarAccuracy || {}) as number[];
  const grammarAvg = grammarEntries.length > 0
    ? grammarEntries.reduce((a, b) => a + b, 0) / grammarEntries.length
    : 0;
  const grammarScore = (grammarAvg / 100) * 15;
  const gamesScore = Math.min(progress.gamesPlayed.length * 5, 15);
  const masteryPercentage = Math.min(100, Math.round(vocabScore + examScore + grammarScore + gamesScore));

  const handleMarkVocabReviewed = (id: string, mastered: boolean) => {
    setProgress(prev => {
      const current = prev.vocabReviewed || [];
      const updated = mastered
        ? Array.from(new Set([...current, id]))
        : current.filter(x => x !== id);
      return { ...prev, vocabReviewed: updated };
    });
  };

  const handleUpdateGrammarAccuracy = (category: string, accuracy: number) => {
    setProgress(prev => ({
      ...prev,
      grammarAccuracy: {
        ...prev.grammarAccuracy,
        [category]: accuracy
      }
    }));
  };

  const handleSaveMockScore = (score: number) => {
    setProgress(prev => ({
      ...prev,
      mockExamScore: score,
      mockExamCompleted: true
    }));
  };

  const handleGamePlayed = (gameKey: string) => {
    setProgress(prev => ({
      ...prev,
      gamesPlayed: Array.from(new Set([...prev.gamesPlayed, gameKey]))
    }));
  };

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    setTeamScores(INITIAL_SCORES);
    localStorage.removeItem('sdit_auliya_unit4_progress');
    localStorage.removeItem('sdit_auliya_unit4_scores');
    localStorage.removeItem('sdit_auliya_unit4_food');
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-slate-900 flex flex-col font-sans selection:bg-[#78c222] selection:text-[#560e51]">
      
      {/* Universal Sticky App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTeacherMode={isTeacherMode}
        setIsTeacherMode={setIsTeacherMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        masteryPercentage={masteryPercentage}
        genAlphaMode={genAlphaMode}
        setGenAlphaMode={setGenAlphaMode}
        isHeaderCollapsed={isHeaderCollapsed}
        setIsHeaderCollapsed={setIsHeaderCollapsed}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Aura Slang Mode Alert Banner */}
        {genAlphaMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-[#560e51] text-white border-3 border-[#78c222] shadow-[4px_4px_0px_0px_#78c222] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡🍫</span>
              <div>
                <p className="text-xs font-black uppercase font-mono text-[#78c222] tracking-wider">
                  MASTER GOURMET & CHOCOLATE AURA MODE ACTIVE! (+9999 Aura)
                </p>
                <p className="text-xs font-bold text-fuchsia-100">
                  Unit 4 Food vocabulary and process passives explained with certified gourmet slang, bean-to-bar rizz, and Willy Wonka factory lore!
                </p>
              </div>
            </div>
            <button
              onClick={() => setGenAlphaMode(false)}
              className="px-3 py-1.5 bg-[#78c222] text-[#560e51] font-black text-xs rounded-xl uppercase tracking-tight border-2 border-white/30 cursor-pointer shrink-0"
            >
              Exit Aura
            </button>
          </motion.div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="view-dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Hero Banner */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 md:p-10 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left max-w-2xl">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="text-xs font-black uppercase tracking-widest text-[#560e51] font-mono bg-[#fdf2fe] px-4 py-1.5 rounded-full border-2 border-[#560e51] inline-block shadow-[2px_2px_0px_0px_#560e51]">
                    Grade 4 ESL · Unit 4: Food
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-[#43780a] font-mono bg-lime-100 px-3.5 py-1.5 rounded-full border-2 border-lime-500 inline-block shadow-[2px_2px_0px_0px_#43780a]">
                    SDIT Auliya Summative Exam Ready 📝
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  Food Around the World & Chocolate Science 🍊🍫
                </h2>
                <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
                  Welcome to the Cambridge Primary ESL Grade 4 review terminal for <strong>Unit 4: Food</strong>! 
                  Discover global breakfasts, explore how plants grow, trace chocolate from bean to bar with passive voice, read sensory fruit poems, and dive into Roald Dahl's <em>Charlie and the Chocolate Factory</em>.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                  <button
                    onClick={() => {
                      setActiveTab('mock-sat');
                      sound.playClick();
                    }}
                    className="px-6 py-3 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] cursor-pointer flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" /> Start 50-Mark Summative Exam 📝
                  </button>
                  <button
                    onClick={() => {
                      setShowProgressModal(true);
                      sound.playClick();
                    }}
                    className="px-6 py-3 bg-[#fdf2fe] hover:bg-fuchsia-100 text-[#560e51] font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-[#9b2c98]" /> View My Badges 🎖️
                  </button>
                </div>
              </div>

              {/* Stats Card with Integrated Animated Mastery Bar */}
              <div className="w-full md:w-80 bg-[#fefaf0] border-3 border-[#560e51] p-5 rounded-2xl shadow-[4px_4px_0px_0px_#560e51] space-y-3 shrink-0">
                <div className="flex justify-between items-center border-b-2 border-[#560e51]/20 pb-2">
                  <span className="text-xs font-black uppercase font-mono text-[#560e51]">Overall Unit Mastery</span>
                  <span className="text-lg font-black font-mono text-[#9b2c98]">{masteryPercentage}%</span>
                </div>
                
                {/* Embedded Animated Mastery Bar inside the Stats Card */}
                <div className="py-0.5">
                  <AnimatedMasteryBar masteryPercentage={masteryPercentage} barWidthClass="w-full" showLabel={false} />
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-800">
                  <div className="flex justify-between">
                    <span>Vocab Mastered:</span>
                    <span className="font-mono font-black text-[#560e51]">{vocabReviewedCount}/{totalVocab}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Summative Exam:</span>
                    <span className="font-mono font-black text-[#560e51]">
                      {progress.mockExamCompleted ? `${progress.mockExamScore} / 50 Marks` : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Games Completed:</span>
                    <span className="font-mono font-black text-[#560e51]">{progress.gamesPlayed.length} modes</span>
                  </div>
                </div>
                <div className="pt-2 border-t-2 border-[#560e51]/20">
                  <span className="text-[10px] uppercase font-mono font-black text-[#9b2c98] block">CLASSROOM SCOREBOARD:</span>
                  <div className="flex justify-between mt-1 text-xs font-black">
                    <span className="text-emerald-700">Team A: {teamScores.teamA} pts</span>
                    <span className="text-indigo-700">Team B: {teamScores.teamB} pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIT 4 CURRICULUM BLUEPRINT & EXAM MATRIX */}
            <UnitSummaryGuide
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                sound.playClick();
              }}
              genAlphaMode={genAlphaMode}
            />

            {/* Quick Navigation Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Card 1: Flashcards */}
              <div 
                onClick={() => {
                  setActiveTab('flashcards');
                  sound.playClick();
                }}
                className="bg-white hover:bg-fuchsia-50/50 p-6 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-fuchsia-100 rounded-2xl flex items-center justify-center border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] mb-3">
                    <BookOpen className="h-6 w-6 text-[#9b2c98]" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-[#9b2c98]">Lessons 4.1 – 4.5</span>
                  <h3 className="text-xl font-black text-[#560e51] uppercase tracking-tight">Food Vocab & Growth Deck 🍳</h3>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed mt-1">
                    Breakfast foods, plant growth locations (trees, plants, underground), cacao terms, sensory adjectives, and Wonka vocabulary!
                  </p>
                </div>
                <span className="text-xs font-black text-[#560e51] uppercase flex items-center gap-1 font-mono pt-2">
                  Open Flashcards <ChevronRight className="h-4 w-4" />
                </span>
              </div>

              {/* Card 2: Grammar */}
              <div 
                onClick={() => {
                  setActiveTab('grammar');
                  sound.playClick();
                }}
                className="bg-white hover:bg-lime-50/50 p-6 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] mb-3">
                    <CheckCircle2 className="h-6 w-6 text-[#43780a]" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-[#43780a]">Lessons 4.1 – 4.3</span>
                  <h3 className="text-xl font-black text-[#560e51] uppercase tracking-tight">Grammar Labs ⚙️</h3>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed mt-1">
                    Master Some & Any, Quantifiers (a lot of, plenty of, few/little), Process Passives (is/are + V3), and Time Connectives!
                  </p>
                </div>
                <span className="text-xs font-black text-[#560e51] uppercase flex items-center gap-1 font-mono pt-2">
                  Open Grammar Lab <ChevronRight className="h-4 w-4" />
                </span>
              </div>

              {/* Card 3: Literature Study (Lesson 4.5) */}
              <div 
                onClick={() => {
                  setActiveTab('literature');
                  sound.playClick();
                }}
                className="bg-white hover:bg-purple-50/50 p-6 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] mb-3">
                    <Bookmark className="h-6 w-6 text-purple-700" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-purple-700">Lesson 4.5 Classic</span>
                  <h3 className="text-xl font-black text-[#560e51] uppercase tracking-tight mt-1">Charlie & Factory 🍫</h3>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed mt-1">
                    Roald Dahl's classic story, Willy Wonka's churning chocolate waterfall, edible swudge grass, Augustus Gloop's accident, and generosity values!
                  </p>
                </div>
                <span className="text-xs font-black text-[#560e51] uppercase flex items-center gap-1 font-mono pt-2">
                  Open Wonka Lounge <ChevronRight className="h-4 w-4" />
                </span>
              </div>

              {/* Card 4: Food Origin & Packaging Studio */}
              <div 
                onClick={() => {
                  setActiveTab('food-origin');
                  sound.playClick();
                }}
                className="bg-white hover:bg-amber-50/50 p-6 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] mb-3">
                    <Package className="h-6 w-6 text-amber-700" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-amber-800">Lesson 4.6 Project</span>
                  <h3 className="text-xl font-black text-[#560e51] uppercase tracking-tight">Food Origin Lab 🍊</h3>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed mt-1">
                    Design custom food packaging, trace agricultural origins, write manufacturing sentences, and generate your spoken product pitch!
                  </p>
                </div>
                <span className="text-xs font-black text-[#560e51] uppercase flex items-center gap-1 font-mono pt-2">
                  Launch Food Studio <ChevronRight className="h-4 w-4" />
                </span>
              </div>

              {/* Card 5: Classroom Arcade */}
              <div 
                onClick={() => {
                  setActiveTab('arcade');
                  sound.playClick();
                }}
                className="bg-white hover:bg-sky-50/50 p-6 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] mb-3">
                    <Play className="h-6 w-6 text-sky-700" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-sky-700">Team Arcade</span>
                  <h3 className="text-xl font-black text-[#560e51] uppercase tracking-tight">Classroom Games 🎮</h3>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed mt-1">
                    Play Mystery Food Clues, Bean to Bar Process Sorter, Rapid Fire Quantifier Buzzer, and Wonka Trivia in Team mode!
                  </p>
                </div>
                <span className="text-xs font-black text-[#560e51] uppercase flex items-center gap-1 font-mono pt-2">
                  Play Arcade <ChevronRight className="h-4 w-4" />
                </span>
              </div>

              {/* Card 6: Summative Assessment */}
              <div 
                onClick={() => {
                  setActiveTab('mock-sat');
                  sound.playClick();
                }}
                className="bg-white hover:bg-rose-50/50 p-6 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] mb-3">
                    <Award className="h-6 w-6 text-rose-700" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-rose-700">Official 50 Marks</span>
                  <h3 className="text-xl font-black text-[#560e51] uppercase tracking-tight mt-1">Summative Exam 📝</h3>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed mt-1">
                    Official 50-mark SDIT Auliya exam replica: Part 1 Listening (Mung bean sprouts), Part 2 Vocab & Anagrams, Part 3 Grammar, Part 4 Cocoa Reading, and Part 5 Writing!
                  </p>
                </div>
                <span className="text-xs font-black text-[#560e51] uppercase flex items-center gap-1 font-mono pt-2">
                  Open Exam Terminal <ChevronRight className="h-4 w-4" />
                </span>
              </div>

            </div>

          </motion.div>
        )}

        {/* --- VIEW TABS --- */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <motion.div
              key="view-flashcards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <FlashcardModule
                progress={progress}
                onMarkReviewed={handleMarkVocabReviewed}
                isTeacherMode={isTeacherMode}
                genAlphaMode={genAlphaMode}
              />
            </motion.div>
          )}

          {/* TAB 2: GRAMMAR LAB */}
          {activeTab === 'grammar' && (
            <motion.div
              key="view-grammar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <GrammarPractice
                progress={progress}
                onUpdateAccuracy={handleUpdateGrammarAccuracy}
                isTeacherMode={isTeacherMode}
                genAlphaMode={genAlphaMode}
              />
            </motion.div>
          )}

          {/* TAB 3: LITERATURE STUDY (LESSON 4.5) */}
          {activeTab === 'literature' && (
            <motion.div
              key="view-literature"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <LiteratureStudy
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  sound.playClick();
                }}
                genAlphaMode={genAlphaMode}
              />
            </motion.div>
          )}

          {/* TAB 4: FOOD ORIGIN LAB (LESSON 4.6) */}
          {(activeTab === 'food-origin' || activeTab === 'dream-home') && (
            <motion.div
              key="view-food-origin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <DreamHomeLab
                initialData={foodProjectData}
                onSave={(data) => setFoodProjectData(data)}
                genAlphaMode={genAlphaMode}
              />
            </motion.div>
          )}

          {/* TAB 5: CLASSROOM GAMES */}
          {activeTab === 'arcade' && (
            <motion.div
              key="view-games"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ClassroomGames
                isTeacherMode={isTeacherMode}
                onGamePlayed={handleGamePlayed}
                teamScores={teamScores}
                setTeamScores={setTeamScores}
                genAlphaMode={genAlphaMode}
              />
            </motion.div>
          )}

          {/* TAB 6: SPELLING BEE (TEACHER ACCESS ONLY) */}
          {activeTab === 'spelling-bee' && (
            <motion.div
              key="spelling-bee"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {isTeacherMode ? (
                <SpellingBeeContest
                  isTeacherMode={isTeacherMode}
                  genAlphaMode={genAlphaMode}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-slate-500">Teacher mode required to access Spelling Bee.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 7: SUMMATIVE ASSESSMENT */}
          {activeTab === 'mock-sat' && (
            <motion.div
              key="view-mock-sat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <SATMockExam
                progress={progress}
                onSaveMockScore={handleSaveMockScore}
                isTeacherMode={isTeacherMode}
                genAlphaMode={genAlphaMode}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Progress & Stamps Modal with AnimatedMasteryBar */}
      <AnimatePresence>
        {showProgressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] p-6 max-w-lg w-full relative"
            >
              <div className="flex justify-between items-center pb-3 border-b-2 border-fuchsia-100 mb-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#9b2c98]" />
                  <h3 className="text-base font-black text-[#560e51] uppercase tracking-tight">Student Progress & Stamps</h3>
                </div>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="p-1.5 bg-fuchsia-50 hover:bg-fuchsia-100 text-[#560e51] rounded-full border-2 border-[#560e51] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ProgressTracker
                progress={progress}
                onResetProgress={handleResetProgress}
                isTeacherMode={isTeacherMode}
                teamScores={teamScores}
                masteryPercentage={masteryPercentage}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#560e51]/20 bg-white py-4 px-6 mt-12 text-center text-xs text-[#560e51] font-bold">
        <p>Grade 4 ESL · Unit 4: Food · Cambridge Primary English Review Suite (SDIT Auliya)</p>
      </footer>

    </div>
  );
}
