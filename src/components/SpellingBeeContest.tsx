import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Volume2, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Search, 
  Plus, 
  Play, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Eye, 
  EyeOff, 
  UserPlus, 
  Printer, 
  HelpCircle, 
  Star,
  Send,
  FileText,
  Mic,
  Award,
  Check,
  Filter,
  VolumeX,
  Volume1,
  FileCheck2,
  ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { SpellingWord, AuditionCandidate, Finalist, SpellingTopic, SpellingDifficulty } from '../types';
import { SPELLING_BEE_WORDS } from '../data/reviewData';
import { sound } from './SoundManager';
import { humanVoice } from '../utils/humanVoice';

interface SpellingBeeProps {
  isTeacherMode: boolean;
  genAlphaMode: boolean;
}

const DEFAULT_WRITTEN_CANDIDATES: AuditionCandidate[] = [
  { id: 'cand-1', name: 'Aisyah Putri', classroom: '4A - Abu Bakar', score: 15, totalTested: 16, status: 'qualified' },
  { id: 'cand-2', name: 'Fadhil Rahman', classroom: '4A - Abu Bakar', score: 11, totalTested: 16, status: 'pending' },
  { id: 'cand-3', name: 'Muhammad Bilal', classroom: '4B - Umar', score: 16, totalTested: 16, status: 'qualified' },
  { id: 'cand-4', name: 'Nabila Zahra', classroom: '4B - Umar', score: 14, totalTested: 16, status: 'qualified' },
  { id: 'cand-5', name: 'Rafi Alamsyah', classroom: '4C - Utsman', score: 9, totalTested: 16, status: 'eliminated' },
  { id: 'cand-6', name: 'Zafira Khansa', classroom: '4D - Ali', score: 15, totalTested: 16, status: 'qualified' }
];

export default function SpellingBeeContest({ isTeacherMode, genAlphaMode }: SpellingBeeProps) {
  // Main Sub-tabs: 'written' | 'spoken' | 'wordbank' | 'rules'
  const [activeSubTab, setActiveSubTab] = useState<'written' | 'spoken' | 'wordbank' | 'rules'>('written');

  // Words State
  const [wordBank, setWordBank] = useState<SpellingWord[]>(() => {
    const saved = localStorage.getItem('sdit_auliya_unit3_spelling_words');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved spelling words', e);
      }
    }
    return SPELLING_BEE_WORDS;
  });

  useEffect(() => {
    localStorage.setItem('sdit_auliya_unit3_spelling_words', JSON.stringify(wordBank));
  }, [wordBank]);

  // Candidates for Written Round
  const [candidates, setCandidates] = useState<AuditionCandidate[]>(() => {
    const saved = localStorage.getItem('sdit_auliya_unit3_spelling_candidates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse candidates', e);
      }
    }
    return DEFAULT_WRITTEN_CANDIDATES;
  });

  useEffect(() => {
    localStorage.setItem('sdit_auliya_unit3_spelling_candidates', JSON.stringify(candidates));
  }, [candidates]);

  // Finalists for Spoken Championship Stage
  const [finalists, setFinalists] = useState<Finalist[]>(() => {
    const saved = localStorage.getItem('sdit_auliya_unit3_spelling_finalists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse finalists', e);
      }
    }
    return [
      { id: 'fin-1', name: 'Muhammad Bilal', classroom: '4B - Umar', score: 0, strikes: 0, isEliminated: false, wordsHistory: [] },
      { id: 'fin-2', name: 'Aisyah Putri', classroom: '4A - Abu Bakar', score: 0, strikes: 0, isEliminated: false, wordsHistory: [] },
      { id: 'fin-3', name: 'Zafira Khansa', classroom: '4D - Ali', score: 0, strikes: 0, isEliminated: false, wordsHistory: [] },
      { id: 'fin-4', name: 'Nabila Zahra', classroom: '4B - Umar', score: 0, strikes: 0, isEliminated: false, wordsHistory: [] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sdit_auliya_unit3_spelling_finalists', JSON.stringify(finalists));
  }, [finalists]);

  // Human Voice TTS Helper with natural pitch & rate
  const speakText = (text: string, rate: number = 0.85) => {
    humanVoice.speak(text, { rate });
  };

  // =========================================================================
  // 1. ROUND 1: WRITTEN ROUND STATE & HANDLERS
  // =========================================================================
  const [writtenSubView, setWrittenSubView] = useState<'dictation' | 'roster' | 'digital-test' | 'print-sheet'>('dictation');
  const [dictationWordIdx, setDictationWordIdx] = useState<number>(0);
  const [dictationWordCount, setDictationWordCount] = useState<number>(16);
  const [revealDictationWord, setRevealDictationWord] = useState<boolean>(false);
  const [passingScoreCutoff, setPassingScoreCutoff] = useState<number>(13); // Min score to qualify

  // Filter words for written exam (default: official 16 contest words)
  const writtenTestWords = wordBank.filter(w => w.isFromOfficialList).slice(0, dictationWordCount);
  const currentDictationWord = writtenTestWords[dictationWordIdx] || writtenTestWords[0] || wordBank[0];

  // Roster New Student Form
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentClass, setNewStudentClass] = useState<string>('4A - Abu Bakar');
  const [newStudentScore, setNewStudentScore] = useState<number>(14);

  const handleAddStudentScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const scoreVal = Math.min(dictationWordCount, Math.max(0, newStudentScore));
    const statusVal: 'qualified' | 'pending' | 'eliminated' = 
      scoreVal >= passingScoreCutoff ? 'qualified' : (scoreVal >= passingScoreCutoff - 3 ? 'pending' : 'eliminated');

    const newCandidate: AuditionCandidate = {
      id: `cand-${Date.now()}`,
      name: newStudentName.trim(),
      classroom: newStudentClass,
      score: scoreVal,
      totalTested: dictationWordCount,
      status: statusVal
    };

    setCandidates(prev => [newCandidate, ...prev]);
    setNewStudentName('');
    setNewStudentScore(14);
    sound.playCorrect();
  };

  const handleUpdateStudentScore = (id: string, newScore: number) => {
    setCandidates(prev => prev.map(c => {
      if (c.id !== id) return c;
      const score = Math.min(dictationWordCount, Math.max(0, newScore));
      const status: 'qualified' | 'pending' | 'eliminated' = 
        score >= passingScoreCutoff ? 'qualified' : (score >= passingScoreCutoff - 3 ? 'pending' : 'eliminated');
      return { ...c, score, status, totalTested: dictationWordCount };
    }));
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    sound.playClick();
  };

  // Transfer Qualifiers from Written Round to Spoken Finals
  const handleAdvanceQualifiersToSpokenFinals = () => {
    const qualifiedList = candidates.filter(c => c.status === 'qualified');
    if (qualifiedList.length === 0) {
      alert('No students meet the qualification cutoff yet! Adjust the cutoff or enter more scores.');
      return;
    }

    const newFinalistsList: Finalist[] = qualifiedList.map(c => ({
      id: `fin-${c.id}`,
      name: c.name,
      classroom: c.classroom,
      score: 0,
      strikes: 0,
      isEliminated: false,
      wordsHistory: []
    }));

    setFinalists(newFinalistsList);
    setActiveSubTab('spoken');
    sound.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // Digital Written Test Student Practice
  const [digitalAnswers, setDigitalAnswers] = useState<{ [index: number]: string }>({});
  const [digitalSubmitted, setDigitalSubmitted] = useState<boolean>(false);

  const handleDigitalAnswerChange = (index: number, val: string) => {
    setDigitalAnswers(prev => ({ ...prev, [index]: val }));
  };

  const handleDigitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDigitalSubmitted(true);
    sound.playFanfare();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const handleResetDigitalTest = () => {
    setDigitalAnswers({});
    setDigitalSubmitted(false);
    sound.playClick();
  };

  const calculateDigitalScore = () => {
    let correct = 0;
    writtenTestWords.forEach((word, idx) => {
      const userAns = (digitalAnswers[idx] || '').trim().toLowerCase();
      if (userAns === word.word.toLowerCase()) {
        correct++;
      }
    });
    return correct;
  };

  // =========================================================================
  // 2. ROUND 2: SPOKEN FINAL STAGE STATE & HANDLERS
  // =========================================================================
  const [finalistActiveIdx, setFinalistActiveIdx] = useState<number>(0);
  const [finalWordIdx, setFinalWordIdx] = useState<number>(0);
  const [finalTopicFilter, setFinalTopicFilter] = useState<'All' | 'Community' | 'Space'>('All');
  const [finalDifficultyFilter, setFinalDifficultyFilter] = useState<string>('All');
  const [revealFinalWord, setRevealFinalWord] = useState<boolean>(false);
  const [finalTimer, setFinalTimer] = useState<number>(30);
  const [isFinalTimerRunning, setIsFinalTimerRunning] = useState<boolean>(false);
  const [maxStrikes, setMaxStrikes] = useState<number>(2); // 1 = sudden death, 2 = standard, 3 = forgiving
  const [champion, setChampion] = useState<Finalist | null>(null);
  const [currentRoundNumber, setCurrentRoundNumber] = useState<number>(1);

  const filteredFinalWords = wordBank.filter(w => {
    if (finalTopicFilter !== 'All' && w.topic !== finalTopicFilter) return false;
    if (finalDifficultyFilter !== 'All' && w.difficulty !== finalDifficultyFilter) return false;
    return true;
  });
  const currentFinalWord = filteredFinalWords[finalWordIdx] || wordBank[0];

  const activeFinalists = finalists.filter(f => !f.isEliminated);
  const currentSpeller = activeFinalists[finalistActiveIdx] || activeFinalists[0] || finalists[0];

  // Final Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (isFinalTimerRunning && finalTimer > 0) {
      interval = setInterval(() => {
        setFinalTimer(prev => {
          if (prev <= 1) {
            setIsFinalTimerRunning(false);
            sound.playBuzzer();
            return 0;
          }
          if (prev <= 5) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFinalTimerRunning, finalTimer]);

  const handleStartFinalTimer = (seconds: number = 30) => {
    setFinalTimer(seconds);
    setIsFinalTimerRunning(true);
    sound.playClick();
  };

  const handleFinalJudgeScore = (isCorrect: boolean) => {
    if (!currentSpeller) return;

    if (isCorrect) {
      sound.playBell();
    } else {
      sound.playBuzzer();
    }

    const updatedFinalists = finalists.map(f => {
      if (f.id !== currentSpeller.id) return f;
      const newScore = isCorrect ? f.score + 10 : f.score;
      const newStrikes = isCorrect ? f.strikes : f.strikes + 1;
      const isEliminated = newStrikes >= maxStrikes;

      return {
        ...f,
        score: newScore,
        strikes: newStrikes,
        isEliminated,
        wordsHistory: [
          ...f.wordsHistory,
          { word: currentFinalWord.word, isCorrect }
        ]
      };
    });

    setFinalists(updatedFinalists);

    // Check if only 1 finalist remains
    const remaining = updatedFinalists.filter(f => !f.isEliminated);
    if (remaining.length === 1 && updatedFinalists.length > 1) {
      setChampion(remaining[0]);
      sound.playFanfare();
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => {
        confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
      }, 350);
    }

    // Advance to next word & next speller
    const nextWordIdx = (finalWordIdx + 1) % filteredFinalWords.length;
    setFinalWordIdx(nextWordIdx);
    setRevealFinalWord(false);
    setFinalTimer(30);
    setIsFinalTimerRunning(false);

    // Move to next active speller
    const nextSpellerIdx = remaining.length > 0 ? (finalistActiveIdx + 1) % remaining.length : 0;
    setFinalistActiveIdx(nextSpellerIdx);
  };

  const handleResetTournament = () => {
    if (confirm('Reset the championship tournament scores and strikes?')) {
      setFinalists(prev => prev.map(f => ({ ...f, score: 0, strikes: 0, isEliminated: false, wordsHistory: [] })));
      setChampion(null);
      setFinalistActiveIdx(0);
      setFinalWordIdx(0);
      setCurrentRoundNumber(1);
      sound.playClick();
    }
  };

  // =========================================================================
  // 3. WORD BANK & CUSTOM WORDS STATE
  // =========================================================================
  const [bankTopicFilter, setBankTopicFilter] = useState<'All' | 'Community' | 'Space' | 'School & Science'>('All');
  const [bankSearch, setBankSearch] = useState<string>('');
  const [showAddWordModal, setShowAddWordModal] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>('');
  const [newTopic, setNewTopic] = useState<SpellingTopic>('Community');
  const [newSentence, setNewSentence] = useState<string>('');
  const [newTranslation, setNewTranslation] = useState<string>('');
  const [newDefinition, setNewDefinition] = useState<string>('');
  const [newSyllables, setNewSyllables] = useState<string>('');
  const [newDifficulty, setNewDifficulty] = useState<SpellingDifficulty>('Medium');

  const filteredBankWords = wordBank.filter(w => {
    if (bankTopicFilter !== 'All' && w.topic !== bankTopicFilter) return false;
    if (bankSearch.trim()) {
      const q = bankSearch.toLowerCase();
      return (
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        w.sentence.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newSentence.trim()) return;

    const createdWord: SpellingWord = {
      id: `sb-custom-${Date.now()}`,
      word: newWord.trim(),
      topic: newTopic,
      sentence: newSentence.trim(),
      translation: newTranslation.trim() || 'Kosakata Lomba',
      definition: newDefinition.trim() || 'Spelling bee competition word',
      syllables: newSyllables.trim() || newWord.trim(),
      difficulty: newDifficulty,
      isFromOfficialList: false
    };

    setWordBank(prev => [createdWord, ...prev]);
    setShowAddWordModal(false);
    setNewWord('');
    setNewSentence('');
    setNewTranslation('');
    setNewDefinition('');
    setNewSyllables('');
    sound.playCorrect();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Hero */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#560e51] font-mono bg-[#fdf2fe] px-3.5 py-1 rounded-full border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]">
                Grade 4 Contest Arena 🏆
              </span>
              <span className="text-xs font-black uppercase font-mono bg-[#78c222] text-[#560e51] px-3 py-1 rounded-full border-2 border-[#560e51] shadow-[1.5px_1.5px_0px_0px_#560e51]">
                2-Round Structure
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
              <span>Spelling Bee Tournament</span>
              <span className="text-3xl sm:text-4xl">🐝</span>
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-2xl leading-relaxed">
              2-stage tournament format: <strong>Round 1 is a Written Dictation Exam (Babak Tes Tulis)</strong> to screen all class candidates, followed by <strong>Round 2: Spoken Championship Final (Babak Final Lisan di Panggung)</strong> at the live microphone!
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-[#fefaf0] border-3 border-[#560e51] p-4 rounded-2xl shadow-[4px_4px_0px_0px_#560e51] shrink-0 space-y-2 text-xs font-bold text-slate-800">
            <div className="flex justify-between gap-4">
              <span>Contest Word Bank:</span>
              <span className="font-mono font-black text-[#9b2c98]">{wordBank.length} words</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Written Candidates:</span>
              <span className="font-mono font-black text-[#560e51]">{candidates.length} students</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Spoken Finalists:</span>
              <span className="font-mono font-black text-emerald-700">{finalists.length} spellers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        <button
          id="tab-written-round"
          onClick={() => {
            setActiveSubTab('written');
            sound.playClick();
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-tight border-3 border-[#560e51] transition-all cursor-pointer whitespace-nowrap shadow-[3px_3px_0px_0px_#560e51] active:translate-y-[1px] ${
            activeSubTab === 'written'
              ? 'bg-[#9b2c98] text-white'
              : 'bg-white hover:bg-fuchsia-50 text-[#560e51]'
          }`}
        >
          <FileText className="h-4.5 w-4.5" />
          <span>Round 1: Written Round (Tes Tulis) 📝</span>
        </button>

        <button
          id="tab-spoken-finals"
          onClick={() => {
            setActiveSubTab('spoken');
            sound.playClick();
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-tight border-3 border-[#560e51] transition-all cursor-pointer whitespace-nowrap shadow-[3px_3px_0px_0px_#560e51] active:translate-y-[1px] ${
            activeSubTab === 'spoken'
              ? 'bg-[#78c222] text-[#560e51]'
              : 'bg-white hover:bg-lime-50 text-[#560e51]'
          }`}
        >
          <Mic className="h-4.5 w-4.5" />
          <span>Round 2: Spoken Finals (Lisan di Mic) 🎙️🏆</span>
        </button>

        <button
          id="tab-wordbank"
          onClick={() => {
            setActiveSubTab('wordbank');
            sound.playClick();
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-tight border-3 border-[#560e51] transition-all cursor-pointer whitespace-nowrap shadow-[3px_3px_0px_0px_#560e51] active:translate-y-[1px] ${
            activeSubTab === 'wordbank'
              ? 'bg-[#560e51] text-white'
              : 'bg-white hover:bg-slate-50 text-[#560e51]'
          }`}
        >
          <BookOpen className="h-4.5 w-4.5" />
          <span>Contest Word Bank ({wordBank.length}) 📖</span>
        </button>

        <button
          id="tab-rules"
          onClick={() => {
            setActiveSubTab('rules');
            sound.playClick();
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-tight border-3 border-[#560e51] transition-all cursor-pointer whitespace-nowrap shadow-[3px_3px_0px_0px_#560e51] active:translate-y-[1px] ${
            activeSubTab === 'rules'
              ? 'bg-amber-400 text-[#560e51]'
              : 'bg-white hover:bg-amber-50 text-[#560e51]'
          }`}
        >
          <HelpCircle className="h-4.5 w-4.5" />
          <span>Contest Rules & Protocol 📜</span>
        </button>
      </div>

      {/* =====================================================================
          SUB-TAB 1: ROUND 1 WRITTEN ROUND (BABAK 1: TES TULIS)
          ===================================================================== */}
      {activeSubTab === 'written' && (
        <motion.div
          key="written-tab"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Sub-view Navigation Bar for Written Round */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase font-mono text-[#560e51]">Written Round Tools:</span>
              <div className="bg-fuchsia-50 p-1 rounded-xl border-2 border-[#560e51] flex flex-wrap gap-1 shadow-[1.5px_1.5px_0px_0px_#560e51]">
                <button
                  onClick={() => {
                    setWrittenSubView('dictation');
                    sound.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight cursor-pointer ${
                    writtenSubView === 'dictation'
                      ? 'bg-[#9b2c98] text-white shadow-[1px_1px_0px_0px_#560e51]'
                      : 'text-[#560e51] hover:bg-fuchsia-100'
                  }`}
                >
                  📢 Teacher Dictation Station
                </button>
                <button
                  onClick={() => {
                    setWrittenSubView('roster');
                    sound.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight cursor-pointer ${
                    writtenSubView === 'roster'
                      ? 'bg-[#78c222] text-[#560e51] shadow-[1px_1px_0px_0px_#560e51]'
                      : 'text-[#560e51] hover:bg-lime-100'
                  }`}
                >
                  📊 Class Scores & Qualifiers ({candidates.length})
                </button>
                <button
                  onClick={() => {
                    setWrittenSubView('digital-test');
                    sound.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight cursor-pointer ${
                    writtenSubView === 'digital-test'
                      ? 'bg-[#560e51] text-white shadow-[1px_1px_0px_0px_#560e51]'
                      : 'text-[#560e51] hover:bg-fuchsia-100'
                  }`}
                >
                  💻 Student Digital Exam
                </button>
                <button
                  onClick={() => {
                    setWrittenSubView('print-sheet');
                    sound.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight cursor-pointer ${
                    writtenSubView === 'print-sheet'
                      ? 'bg-amber-400 text-[#560e51] shadow-[1px_1px_0px_0px_#560e51]'
                      : 'text-[#560e51] hover:bg-amber-100'
                  }`}
                >
                  🖨️ Printable Worksheets
                </button>
              </div>
            </div>

            <button
              onClick={handleAdvanceQualifiersToSpokenFinals}
              className="px-4 py-2 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[2.5px_2.5px_0px_0px_#560e51] flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Trophy className="h-4 w-4" />
              <span>Advance {candidates.filter(c => c.status === 'qualified').length} Qualifiers to Spoken Finals 🚀</span>
            </button>
          </div>

          {/* VIEW 1: TEACHER DICTATION STATION (FOR WRITTEN EXAM) */}
          {writtenSubView === 'dictation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Dictation Broadcast Console (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
                  
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-fuchsia-100 pb-4">
                    <div>
                      <span className="text-xs font-mono font-black uppercase text-[#9b2c98]">
                        BABAK 1: DIKTE TULIS KELAS (CLASSROOM WRITTEN DICTATION)
                      </span>
                      <h3 className="text-2xl font-black text-[#560e51] uppercase tracking-tight flex items-center gap-2">
                        <span>Dictation Broadcast Station</span>
                        <span className="text-xl">📢</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Exam Length:</span>
                      <select
                        value={dictationWordCount}
                        onChange={(e) => {
                          setDictationWordCount(Number(e.target.value));
                          setDictationWordIdx(0);
                          sound.playClick();
                        }}
                        className="p-1.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-black text-slate-900 shadow-[1.5px_1.5px_0px_0px_#560e51]"
                      >
                        <option value={10}>10 Words (Standard)</option>
                        <option value={16}>16 Words (Full Word List)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dictation Word Card */}
                  <div className="bg-[#fefaf0] rounded-[28px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-5 text-center">
                    
                    {/* Word Counter & Judge Toggle */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-black uppercase text-[#560e51] bg-white px-3.5 py-1 rounded-full border-2 border-[#560e51] shadow-[1.5px_1.5px_0px_0px_#560e51]">
                        Dictation Item #{dictationWordIdx + 1} of {writtenTestWords.length} · Topic: {currentDictationWord.topic}
                      </span>

                      <button
                        onClick={() => setRevealDictationWord(!revealDictationWord)}
                        className="px-3 py-1 bg-white hover:bg-fuchsia-50 text-[#560e51] text-xs font-black rounded-lg border-2 border-[#560e51] flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#560e51] cursor-pointer"
                      >
                        {revealDictationWord ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>{revealDictationWord ? 'Hide Spelling' : 'Teacher View (Show Word)'}</span>
                      </button>
                    </div>

                    {/* Word Display / Hidden Dots for Class Projection */}
                    <div className="py-4">
                      {revealDictationWord ? (
                        <div className="space-y-1">
                          <h3 className="text-4xl sm:text-5xl font-black text-[#560e51] tracking-wide uppercase font-mono">
                            {currentDictationWord.word}
                          </h3>
                          <p className="text-sm font-bold text-[#9b2c98] font-mono">
                            Syllables: <span className="underline decoration-2">{currentDictationWord.syllables}</span> {currentDictationWord.phoneticHint && `· ${currentDictationWord.phoneticHint}`}
                          </p>
                        </div>
                      ) : (
                        <div className="py-2 space-y-2">
                          <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#560e51]/40 select-none">
                            ITEM #{dictationWordIdx + 1} &nbsp; [ • • • • • • • ]
                          </span>
                          <p className="text-xs font-bold text-slate-500">
                            (Students: Listen to the teacher/speaker and write the spelling on line #{dictationWordIdx + 1} of your paper)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Audio Broadcast Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => {
                          speakText(currentDictationWord.word, 0.82);
                          sound.playClick();
                        }}
                        className="p-3.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span>1. Broadcast Word 🔊</span>
                      </button>

                      <button
                        onClick={() => {
                          speakText(currentDictationWord.sentence, 0.88);
                          sound.playClick();
                        }}
                        className="p-3.5 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4 text-[#9b2c98]" />
                        <span>2. Read Sentence 🗣️</span>
                      </button>

                      <button
                        onClick={() => {
                          speakText(`${currentDictationWord.word}. Definition: ${currentDictationWord.definition}`, 0.88);
                          sound.playClick();
                        }}
                        className="p-3.5 bg-amber-100 hover:bg-amber-200 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <HelpCircle className="h-4 w-4 text-amber-700" />
                        <span>3. Read Meaning 💡</span>
                      </button>
                    </div>

                    {/* Sentence Context Display */}
                    <div className="bg-white p-4 rounded-xl border-2 border-[#560e51] text-left space-y-1">
                      <span className="text-[10px] font-mono font-black uppercase text-[#9b2c98] block">Context Sentence:</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 italic">
                        "{currentDictationWord.sentence}"
                      </p>
                      <p className="text-[11px] font-medium text-slate-600 pt-1 border-t border-slate-100">
                        🇮🇩 <strong>Arti:</strong> {currentDictationWord.translation} · <em>{currentDictationWord.definition}</em>
                      </p>
                    </div>

                    {/* Navigation Controls */}
                    <div className="pt-3 border-t-2 border-[#560e51]/20 flex items-center justify-between gap-3">
                      <button
                        disabled={dictationWordIdx === 0}
                        onClick={() => {
                          setDictationWordIdx(prev => Math.max(0, prev - 1));
                          sound.playClick();
                        }}
                        className="px-4 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[1.5px_1.5px_0px_0px_#560e51] cursor-pointer flex items-center gap-1.5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous Word</span>
                      </button>

                      <span className="text-xs font-mono font-black text-[#560e51]">
                        {dictationWordIdx + 1} / {writtenTestWords.length}
                      </span>

                      <button
                        disabled={dictationWordIdx === writtenTestWords.length - 1}
                        onClick={() => {
                          setDictationWordIdx(prev => Math.min(writtenTestWords.length - 1, prev + 1));
                          sound.playClick();
                        }}
                        className="px-4 py-2 bg-[#78c222] hover:bg-[#68ab1c] disabled:opacity-40 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[1.5px_1.5px_0px_0px_#560e51] cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Next Word</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>

              {/* Right Column: Full Dictation Sequence List (1 col) */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-3">
                  <div className="flex justify-between items-center border-b-2 border-fuchsia-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-tight text-[#560e51] flex items-center gap-1.5">
                      <ListOrdered className="h-4 w-4" />
                      <span>Exam Word Order ({writtenTestWords.length})</span>
                    </span>
                    <button
                      onClick={() => {
                        speakText(`Starting written spelling test. There are ${writtenTestWords.length} words. Please prepare your pencils and answer sheets.`);
                        sound.playBell();
                      }}
                      className="text-[10px] font-black uppercase px-2 py-1 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] rounded-lg border border-[#560e51]"
                    >
                      Announce Start 🔔
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {writtenTestWords.map((word, idx) => {
                      const isCurrent = idx === dictationWordIdx;
                      return (
                        <div
                          key={word.id}
                          onClick={() => {
                            setDictationWordIdx(idx);
                            sound.playClick();
                          }}
                          className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-fuchsia-100 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
                              : 'bg-[#fefaf0] border-[#560e51]/30 hover:border-[#560e51]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-white border border-[#560e51] flex items-center justify-center text-xs font-mono font-black text-[#560e51]">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-xs font-black text-slate-900">
                                {revealDictationWord ? word.word : `Word #${idx + 1}`}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">{word.topic}</p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(word.word, 0.82);
                              sound.playClick();
                            }}
                            className="p-1.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] rounded-lg border border-[#560e51] shadow-[1px_1px_0px_0px_#560e51]"
                            title="Play audio"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: CLASS SCORES & QUALIFIER ROSTER */}
          {writtenSubView === 'roster' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Candidate Scores Table */}
              <div className="lg:col-span-2 bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-fuchsia-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-black uppercase text-[#9b2c98]">
                      ROUND 1 WRITTEN EXAM ROSTER
                    </span>
                    <h3 className="text-2xl font-black text-[#560e51] uppercase tracking-tight">
                      Class Written Score Sheet 📊
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Qualify Cutoff:</span>
                    <select
                      value={passingScoreCutoff}
                      onChange={(e) => {
                        const cutoff = Number(e.target.value);
                        setPassingScoreCutoff(cutoff);
                        // Recompute status
                        setCandidates(prev => prev.map(c => ({
                          ...c,
                          status: c.score >= cutoff ? 'qualified' : (c.score >= cutoff - 3 ? 'pending' : 'eliminated')
                        })));
                        sound.playClick();
                      }}
                      className="p-1.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-black text-slate-900 shadow-[1.5px_1.5px_0px_0px_#560e51]"
                    >
                      <option value={15}>Score ≥ 15 (Top Tier)</option>
                      <option value={14}>Score ≥ 14 (Standard)</option>
                      <option value={13}>Score ≥ 13 (Recommended)</option>
                      <option value={12}>Score ≥ 12 (Forgiving)</option>
                      <option value={10}>Score ≥ 10 (Open)</option>
                    </select>
                  </div>
                </div>

                {/* Score Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#560e51] bg-[#fefaf0] text-[11px] font-black uppercase font-mono text-[#560e51]">
                        <th className="p-3">#</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class</th>
                        <th className="p-3 text-center">Score (/{dictationWordCount})</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fuchsia-100 text-xs">
                      {candidates.map((cand, idx) => (
                        <tr key={cand.id} className="hover:bg-fuchsia-50/50">
                          <td className="p-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-black text-slate-950">{cand.name}</td>
                          <td className="p-3 font-semibold text-slate-600 font-mono">{cand.classroom}</td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={dictationWordCount}
                              value={cand.score}
                              onChange={(e) => handleUpdateStudentScore(cand.id, Number(e.target.value))}
                              className="w-16 p-1 text-center font-mono font-black text-slate-900 bg-[#fefaf0] border-2 border-[#560e51] rounded-lg shadow-[1px_1px_0px_0px_#560e51]"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
                              cand.status === 'qualified'
                                ? 'bg-[#78c222] text-[#560e51] border-[#560e51]'
                                : cand.status === 'eliminated'
                                ? 'bg-rose-100 text-rose-700 border-rose-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}>
                              {cand.status === 'qualified' ? '🏆 Qualified' : cand.status === 'eliminated' ? '❌ Out' : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteCandidate(cand.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete entry"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-fuchsia-100 text-xs font-bold text-slate-700">
                  <span>
                    Qualifiers: <strong className="text-[#560e51] font-mono">{candidates.filter(c => c.status === 'qualified').length}</strong> of {candidates.length} students
                  </span>

                  <button
                    onClick={handleAdvanceQualifiersToSpokenFinals}
                    className="px-5 py-2.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black uppercase rounded-xl border-2 border-[#560e51] shadow-[2.5px_2.5px_0px_0px_#560e51] cursor-pointer flex items-center gap-2"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Send Qualifiers to Spoken Stage 🚀</span>
                  </button>
                </div>

              </div>

              {/* Right Col: Add New Candidate Score */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-4">
                  <h4 className="text-base font-black text-[#560e51] uppercase tracking-tight flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Enter Written Score</span>
                  </h4>
                  <form onSubmit={handleAddStudentScore} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase font-mono text-[#560e51] mb-1">
                        Student Full Name:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Khadijah Azzahra"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full p-2.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold text-slate-950 focus:outline-none shadow-[1.5px_1.5px_0px_0px_#560e51]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase font-mono text-[#560e51] mb-1">
                        Classroom:
                      </label>
                      <select
                        value={newStudentClass}
                        onChange={(e) => setNewStudentClass(e.target.value)}
                        className="w-full p-2.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold text-slate-950 focus:outline-none"
                      >
                        <option value="4A - Abu Bakar">4A - Abu Bakar</option>
                        <option value="4B - Umar">4B - Umar</option>
                        <option value="4C - Utsman">4C - Utsman</option>
                        <option value="4D - Ali">4D - Ali</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase font-mono text-[#560e51] mb-1">
                        Written Test Score (Out of {dictationWordCount}):
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={dictationWordCount}
                        value={newStudentScore}
                        onChange={(e) => setNewStudentScore(Number(e.target.value))}
                        className="w-full p-2.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold text-slate-950 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[2.5px_2.5px_0px_0px_#560e51] cursor-pointer mt-2"
                    >
                      + Add Student Score
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 3: STUDENT DIGITAL EXAM (SELF-WRITTEN DICTATION) */}
          {writtenSubView === 'digital-test' && (
            <div className="max-w-3xl mx-auto bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
              
              <div className="text-center space-y-2 border-b-2 border-fuchsia-100 pb-4">
                <span className="text-xs font-mono font-black uppercase text-[#9b2c98] bg-fuchsia-100 px-3 py-1 rounded-full border border-[#560e51]">
                  Student Digital Written Exam Mode 💻
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#560e51] uppercase tracking-tight">
                  Written Spelling Bee Exam
                </h3>
                <p className="text-xs font-bold text-slate-600 max-w-lg mx-auto">
                  Listen to each numbered word and sentence, then type your spelling in the corresponding line. When finished, submit your exam for auto-grading!
                </p>
              </div>

              {digitalSubmitted && (
                <div className="bg-amber-50 p-6 rounded-2xl border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] text-center space-y-2 animate-fade-in">
                  <div className="text-4xl">📝✨</div>
                  <h4 className="text-xl font-black text-[#560e51] uppercase">Exam Graded!</h4>
                  <p className="text-2xl font-black font-mono text-[#78c222]">
                    Score: {calculateDigitalScore()} / {writtenTestWords.length} ({Math.round((calculateDigitalScore() / writtenTestWords.length) * 100)}%)
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {calculateDigitalScore() >= passingScoreCutoff ? '🏆 Qualified for Round 2 (Spoken Finals)!' : 'Keep practicing to master all contest words!'}
                  </p>
                  <button
                    onClick={handleResetDigitalTest}
                    className="mt-2 px-4 py-2 bg-white text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]"
                  >
                    Retake Digital Exam 🔄
                  </button>
                </div>
              )}

              <form onSubmit={handleDigitalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {writtenTestWords.map((word, idx) => {
                    const userAns = (digitalAnswers[idx] || '').trim();
                    const isCorrect = userAns.toLowerCase() === word.word.toLowerCase();
                    return (
                      <div
                        key={word.id}
                        className={`p-3.5 rounded-2xl border-2 space-y-2 ${
                          digitalSubmitted
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-600'
                              : 'bg-rose-50 border-rose-600'
                            : 'bg-[#fefaf0] border-[#560e51]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-black text-[#560e51] bg-white px-2.5 py-0.5 rounded border border-[#560e51]">
                            Word #{idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => speakText(word.word, 0.82)}
                              className="px-2.5 py-1 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] text-[11px] font-black uppercase rounded-lg border border-[#560e51] flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 className="h-3 w-3" />
                              <span>Say</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => speakText(word.sentence, 0.88)}
                              className="px-2.5 py-1 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] text-[11px] font-black uppercase rounded-lg border border-[#560e51] flex items-center gap-1 cursor-pointer"
                            >
                              <BookOpen className="h-3 w-3 text-[#9b2c98]" />
                              <span>Sentence</span>
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          disabled={digitalSubmitted}
                          placeholder={`Type spelling for #${idx + 1}...`}
                          value={digitalAnswers[idx] || ''}
                          onChange={(e) => handleDigitalAnswerChange(idx, e.target.value)}
                          className="w-full p-2.5 bg-white border-2 border-[#560e51] rounded-xl text-sm font-black font-mono uppercase tracking-wider text-slate-900 focus:outline-none shadow-[1.5px_1.5px_0px_0px_#560e51]"
                        />

                        {digitalSubmitted && (
                          <div className="text-[11px] font-mono pt-1">
                            {isCorrect ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Correct!
                              </span>
                            ) : (
                              <div className="text-rose-700 space-y-0.5">
                                <p className="font-bold flex items-center gap-1">
                                  <XCircle className="h-3.5 w-3.5" /> Incorrect
                                </p>
                                <p className="text-slate-800">
                                  Correct: <strong>{word.word}</strong> ({word.syllables})
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!digitalSubmitted && (
                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#560e51] hover:bg-[#430a3e] text-white font-black text-sm uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#78c222] cursor-pointer"
                    >
                      Submit Written Exam 🚀
                    </button>
                  </div>
                )}
              </form>

            </div>
          )}

          {/* VIEW 4: PRINTABLE WORKSHEETS & ANSWER KEYS */}
          {writtenSubView === 'print-sheet' && (
            <div className="max-w-3xl mx-auto bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-fuchsia-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-black uppercase text-[#9b2c98]">
                    STUDENT EXAMINATION WORKSHEET
                  </span>
                  <h3 className="text-2xl font-black text-[#560e51] uppercase tracking-tight">
                    Printable Answer Sheet 🖨️
                  </h3>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Worksheet (PDF)</span>
                </button>
              </div>

              {/* Formatted Printable Preview Box */}
              <div className="bg-[#fefaf0] p-6 sm:p-8 rounded-[24px] border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] space-y-6 text-slate-900">
                
                <div className="text-center border-b-2 border-[#560e51] pb-4 space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#560e51]">
                    Grade 4 English Spelling Bee
                  </h2>
                  <p className="text-xs font-black uppercase tracking-widest text-[#9b2c98] font-mono">
                    Round 1: Written Dictation Examination (Babak Penyisihan Tulis)
                  </p>
                </div>

                {/* Student Header Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                  <div className="border-b border-slate-400 pb-1">
                    <span>Name: ______________________</span>
                  </div>
                  <div className="border-b border-slate-400 pb-1">
                    <span>Class: 4 ___ (Abu Bakar/Umar/Utsman/Ali)</span>
                  </div>
                  <div className="border-b border-slate-400 pb-1">
                    <span>Score: ______ / 16</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-3 bg-white rounded-xl border border-[#560e51]/30 text-xs space-y-1">
                  <p className="font-bold text-[#560e51]">Instructions for Students:</p>
                  <p className="text-slate-700">1. Listen attentively to the teacher pronouncing the word and reading the example sentence.</p>
                  <p className="text-slate-700">2. Write the correct spelling clearly on each numbered blank line below in neat English handwriting.</p>
                </div>

                {/* 16 Numbered Lined Blanks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2">
                  {Array.from({ length: 16 }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3 border-b-2 border-dashed border-slate-400 pb-1 text-sm font-mono">
                      <span className="w-7 font-black text-[#560e51] text-xs">#{idx + 1}.</span>
                      <span className="text-slate-300 select-none">_____________________________</span>
                    </div>
                  ))}
                </div>

                {/* Footer Signature */}
                <div className="flex justify-between items-end pt-6 border-t border-slate-300 text-xs font-semibold text-slate-600">
                  <span>Proctor / Teacher Signature: _______________</span>
                  <span>Qualification Result: [ &nbsp; ] QUALIFIED &nbsp; [ &nbsp; ] NOT QUALIFIED</span>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      )}

      {/* =====================================================================
          SUB-TAB 2: ROUND 2 SPOKEN FINAL STAGE (BABAK 2: FINAL LISAN DI MIC)
          ===================================================================== */}
      {activeSubTab === 'spoken' && (
        <motion.div
          key="spoken-tab"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Championship Crown Announcement (if champion decided) */}
          {champion && (
            <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] text-center space-y-4 animate-fade-in">
              <div className="text-5xl animate-bounce">👑🏆👑</div>
              <span className="text-xs font-black uppercase tracking-widest text-[#560e51] font-mono bg-white px-4 py-1.5 rounded-full border-2 border-[#560e51] inline-block shadow-[2px_2px_0px_0px_#560e51]">
                Grand Champion 2026
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#560e51] uppercase tracking-tight">
                {champion.name} ({champion.classroom})
              </h2>
              <p className="text-sm font-bold text-amber-950 max-w-md mx-auto">
                Congratulations! You have mastered the vocabulary of Community and Earth & Beyond to win the Spoken Grand Championship!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playFanfare();
                    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                  }}
                  className="px-6 py-3 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Confetti Blast! 🎉</span>
                </button>
                <button
                  onClick={handleResetTournament}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] cursor-pointer"
                >
                  Restart Final Stage 🔄
                </button>
              </div>
            </div>
          )}

          {/* Championship Stage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Stage Arena Podium (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
                
                {/* Stage Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-fuchsia-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-black uppercase text-[#9b2c98]">
                      ROUND 2: GRAND FINAL SPOKEN CHAMPIONSHIP
                    </span>
                    <h3 className="text-2xl font-black text-[#560e51] uppercase tracking-tight flex items-center gap-2">
                      <span>Live Stage Microphone Arena</span>
                      <span className="text-xl">🎙️</span>
                    </h3>
                  </div>

                  {/* Stage Settings: Rule Strike Mode */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase font-mono text-[#560e51]">Rules:</span>
                    <select
                      value={maxStrikes}
                      onChange={(e) => setMaxStrikes(Number(e.target.value))}
                      className="p-1.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-lg text-xs font-bold text-slate-900"
                    >
                      <option value={1}>1 Strike (Sudden Death 💀)</option>
                      <option value={2}>2 Strikes (Standard ⚖️)</option>
                      <option value={3}>3 Strikes (Forgiving ❤️)</option>
                    </select>
                  </div>
                </div>

                {/* Speller in the Spotlight Card */}
                {currentSpeller ? (
                  <div className="bg-[#fefaf0] rounded-[28px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-6 text-center">
                    
                    {/* Contestant Spotlight Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] shrink-0">
                          <Mic className="h-6 w-6 text-[#560e51]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-[#9b2c98]">Speller at Stage Microphone</span>
                          <h4 className="text-lg font-black text-[#560e51] uppercase">{currentSpeller.name}</h4>
                          <p className="text-[11px] font-semibold text-slate-600 font-mono">{currentSpeller.classroom}</p>
                        </div>
                      </div>

                      {/* Strikes & Score Badge */}
                      <div className="flex items-center gap-3">
                        <div className="text-center px-3 py-1 bg-fuchsia-50 rounded-xl border border-[#560e51]">
                          <span className="text-[10px] font-mono font-black uppercase text-[#9b2c98] block">Points</span>
                          <span className="text-sm font-black font-mono text-[#560e51]">{currentSpeller.score}</span>
                        </div>
                        <div className="text-center px-3 py-1 bg-rose-50 rounded-xl border border-rose-400">
                          <span className="text-[10px] font-mono font-black uppercase text-rose-700 block">Strikes</span>
                          <span className="text-sm font-black text-rose-700">
                            {Array.from({ length: currentSpeller.strikes }).map((_, i) => '❌').join('') || 'None'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Word Card with Judge Reveal */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-black uppercase text-[#560e51] bg-white px-3 py-1 rounded-full border-2 border-[#560e51]">
                          Championship Word #{finalWordIdx + 1} · {currentFinalWord.topic} · {currentFinalWord.difficulty}
                        </span>

                        <button
                          onClick={() => setRevealFinalWord(!revealFinalWord)}
                          className="px-3 py-1 bg-white hover:bg-fuchsia-50 text-[#560e51] text-xs font-black rounded-lg border-2 border-[#560e51] flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#560e51] cursor-pointer"
                        >
                          {revealFinalWord ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          <span>{revealFinalWord ? 'Hide Word' : 'Reveal Word (Judge View)'}</span>
                        </button>
                      </div>

                      <div className="py-4">
                        {revealFinalWord ? (
                          <div className="space-y-1">
                            <h3 className="text-4xl sm:text-5xl font-black text-[#560e51] tracking-wide uppercase font-mono">
                              {currentFinalWord.word}
                            </h3>
                            <p className="text-xs font-bold text-[#9b2c98] font-mono">
                              Syllables: <span className="underline decoration-2">{currentFinalWord.syllables}</span> {currentFinalWord.phoneticHint && `· ${currentFinalWord.phoneticHint}`}
                            </p>
                          </div>
                        ) : (
                          <div className="py-3">
                            <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#560e51]/40 select-none">
                              {currentFinalWord.word.split('').map(() => '•').join(' ')}
                            </span>
                            <p className="text-xs font-bold text-slate-500 mt-2">
                              (Spoken stage: Speller must listen to the judge and spell letter-by-letter aloud)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pronouncer Audio Triggers */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          onClick={() => {
                            speakText(currentFinalWord.word, 0.82);
                            sound.playClick();
                          }}
                          className="p-3 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Volume2 className="h-4 w-4" />
                          <span>1. Pronounce Word 🔊</span>
                        </button>

                        <button
                          onClick={() => {
                            speakText(currentFinalWord.sentence, 0.88);
                            sound.playClick();
                          }}
                          className="p-3 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <BookOpen className="h-4 w-4 text-[#9b2c98]" />
                          <span>2. Say in Sentence 🗣️</span>
                        </button>

                        <button
                          onClick={() => {
                            speakText(`${currentFinalWord.word}. Definition: ${currentFinalWord.definition}`, 0.88);
                            sound.playClick();
                          }}
                          className="p-3 bg-amber-100 hover:bg-amber-200 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <HelpCircle className="h-4 w-4 text-amber-700" />
                          <span>3. Give Definition 💡</span>
                        </button>
                      </div>

                      {/* Example Sentence Display */}
                      <div className="bg-white p-4 rounded-xl border-2 border-[#560e51] text-left space-y-1">
                        <span className="text-[10px] font-mono font-black uppercase text-[#9b2c98] block">Example Sentence:</span>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 italic">
                          "{currentFinalWord.sentence}"
                        </p>
                      </div>

                    </div>

                    {/* Timer & Judge Score Action */}
                    <div className="pt-3 border-t-2 border-[#560e51]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* Timer */}
                      <div className="flex items-center gap-2">
                        <div className={`px-4 py-2 rounded-2xl border-3 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] flex items-center gap-2 ${
                          finalTimer <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-[#560e51]'
                        }`}>
                          <Clock className="h-5 w-5" />
                          <span className="text-xl font-black font-mono">{finalTimer}s</span>
                        </div>
                        <button
                          onClick={() => handleStartFinalTimer(30)}
                          className="p-2.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer"
                          title="Start 30s Countdown"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Judge Pass / Strike Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleFinalJudgeScore(false)}
                          className="px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] flex items-center gap-2 cursor-pointer active:translate-y-[1px]"
                        >
                          <XCircle className="h-5 w-5" />
                          <span>Incorrect (Strike) ❌</span>
                        </button>

                        <button
                          onClick={() => handleFinalJudgeScore(true)}
                          className="px-6 py-3 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] flex items-center gap-2 cursor-pointer active:translate-y-[1px]"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Correct! (+10 pts) ✅</span>
                        </button>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="p-8 bg-[#fefaf0] rounded-2xl border-2 border-dashed border-[#560e51] text-center space-y-2">
                    <p className="text-sm font-bold text-slate-700">No active finalists remaining!</p>
                    <button
                      onClick={handleResetTournament}
                      className="px-4 py-2 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51]"
                    >
                      Reset Tournament
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Right Column: Finalists Bracket & Elimination Board (1 col) */}
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-4">
                
                <div className="flex justify-between items-center border-b-2 border-fuchsia-100 pb-2">
                  <span className="text-xs font-black uppercase tracking-tight text-[#560e51]">
                    Finalist Bracket ({activeFinalists.length} Active)
                  </span>
                  <button
                    onClick={handleResetTournament}
                    className="p-1 text-slate-500 hover:text-rose-600 text-xs font-bold"
                    title="Reset All"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Finalists Cards */}
                <div className="space-y-2.5">
                  {finalists.map((finalist) => {
                    const isCurrent = finalist.id === currentSpeller?.id;
                    return (
                      <div
                        key={finalist.id}
                        className={`p-3.5 rounded-2xl border-3 transition-all ${
                          finalist.isEliminated
                            ? 'bg-slate-100 border-slate-300 opacity-60'
                            : isCurrent
                            ? 'bg-amber-100 border-[#560e51] shadow-[3px_3px_0px_0px_#560e51]'
                            : 'bg-[#fefaf0] border-[#560e51]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900">{finalist.name}</span>
                              {isCurrent && <span className="text-xs animate-bounce">🎙️</span>}
                            </div>
                            <p className="text-[10px] font-semibold text-slate-600 font-mono">{finalist.classroom}</p>
                          </div>

                          <div className="text-right space-y-1">
                            <span className="text-xs font-mono font-black text-[#560e51] block">{finalist.score} pts</span>
                            <div className="flex items-center gap-1 justify-end">
                              {finalist.isEliminated ? (
                                <span className="text-[10px] font-black uppercase bg-rose-200 text-rose-800 px-2 py-0.5 rounded border border-rose-400">
                                  ELIMINATED
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-700">
                                  Strikes: {finalist.strikes}/{maxStrikes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

          </div>

        </motion.div>
      )}

      {/* =====================================================================
          SUB-TAB 3: CONTEST WORD BANK & CUSTOM WORD MANAGER
          ===================================================================== */}
      {activeSubTab === 'wordbank' && (
        <motion.div
          key="wordbank-tab"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search, Filter & Add Custom Word Bar */}
          <div className="bg-white p-5 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-4">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#560e51]" />
                <input
                  type="text"
                  placeholder="Search word, meaning, or sentence..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#560e51]"
                />
              </div>

              {/* Topic Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(['All', 'Community', 'Space', 'School & Science'] as const).map(topic => (
                  <button
                    key={topic}
                    onClick={() => {
                      setBankTopicFilter(topic);
                      sound.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight border-2 border-[#560e51] transition-all cursor-pointer ${
                      bankTopicFilter === topic
                        ? 'bg-[#9b2c98] text-white shadow-[2px_2px_0px_0px_#560e51]'
                        : 'bg-white hover:bg-fuchsia-50 text-[#560e51]'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Add Custom Word Button */}
              <button
                onClick={() => setShowAddWordModal(true)}
                className="px-4 py-2.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase tracking-wide rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Contest Word</span>
              </button>

            </div>

          </div>

          {/* Words Grid Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBankWords.map((word) => (
              <div
                key={word.id}
                className="bg-white p-5 rounded-[24px] border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md border ${
                      word.topic === 'Community'
                        ? 'bg-sky-100 text-sky-800 border-sky-300'
                        : word.topic === 'Space'
                        ? 'bg-fuchsia-100 text-[#560e51] border-fuchsia-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {word.topic} {word.isFromOfficialList && '· Core Bank'}
                    </span>

                    <button
                      onClick={() => speakText(word.word, 0.82)}
                      className="p-1.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] rounded-lg border border-[#560e51] shadow-[1px_1px_0px_0px_#560e51] cursor-pointer"
                      title="Pronounce Word"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xl font-black text-[#560e51] uppercase font-mono tracking-tight">
                    {word.word}
                  </h4>
                  <p className="text-xs font-mono font-semibold text-[#9b2c98]">
                    {word.syllables} {word.phoneticHint && `· ${word.phoneticHint}`}
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-2 italic bg-[#fefaf0] p-2.5 rounded-xl border border-[#560e51]/20">
                    "{word.sentence}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#560e51]/20 text-[11px] text-slate-700">
                  <p className="font-semibold">🇮🇩 <strong>Arti:</strong> {word.translation}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{word.definition}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Word Modal */}
          {showAddWordModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-[32px] border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] p-6 max-w-lg w-full space-y-4">
                <div className="flex justify-between items-center pb-2 border-b-2 border-fuchsia-100">
                  <h3 className="text-base font-black text-[#560e51] uppercase tracking-tight">
                    Add New Spelling Bee Word
                  </h3>
                  <button
                    onClick={() => setShowAddWordModal(false)}
                    className="p-1 text-slate-500 hover:text-slate-900"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddCustomWord} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black uppercase font-mono text-[#560e51] mb-1">Word:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Atmosphere"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="w-full p-2.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold text-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-black uppercase font-mono text-[#560e51] mb-1">Topic:</label>
                      <select
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value as any)}
                        className="w-full p-2 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold"
                      >
                        <option value="Community">Community</option>
                        <option value="Space">Space</option>
                        <option value="School & Science">School & Science</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase font-mono text-[#560e51] mb-1">Syllables:</label>
                      <input
                        type="text"
                        placeholder="at · mos · phere"
                        value={newSyllables}
                        onChange={(e) => setNewSyllables(e.target.value)}
                        className="w-full p-2 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase font-mono text-[#560e51] mb-1">Example Sentence to Read:</label>
                    <input
                      type="text"
                      required
                      placeholder="Venus is very hot because of its thick atmosphere."
                      value={newSentence}
                      onChange={(e) => setNewSentence(e.target.value)}
                      className="w-full p-2.5 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-black uppercase font-mono text-[#560e51] mb-1">Indonesian Translation:</label>
                      <input
                        type="text"
                        placeholder="Lapisan atmosfer"
                        value={newTranslation}
                        onChange={(e) => setNewTranslation(e.target.value)}
                        className="w-full p-2 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase font-mono text-[#560e51] mb-1">Difficulty:</label>
                      <select
                        value={newDifficulty}
                        onChange={(e) => setNewDifficulty(e.target.value as any)}
                        className="w-full p-2 bg-[#fefaf0] border-2 border-[#560e51] rounded-xl text-xs font-bold"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Championship">Championship</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddWordModal(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]"
                    >
                      Save Word
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </motion.div>
      )}

      {/* =====================================================================
          SUB-TAB 4: CONTEST RULES & PROTOCOL
          ===================================================================== */}
      {activeSubTab === 'rules' && (
        <motion.div
          key="rules-tab"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Rules Card */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
            
            <div className="border-b-2 border-fuchsia-100 pb-4">
              <span className="text-xs font-mono font-black uppercase text-[#9b2c98]">
                GRADE 4 TOURNAMENT STRUCTURE & RULES
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#560e51] uppercase tracking-tight mt-1">
                2-Round Tournament Guidelines 📋
              </h3>
            </div>

            {/* 2-Round Structure Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#fefaf0] border-3 border-[#560e51] rounded-2xl shadow-[3px_3px_0px_0px_#560e51] space-y-2">
                <span className="text-xs font-black uppercase font-mono bg-[#9b2c98] text-white px-3 py-1 rounded-full border border-[#560e51]">
                  Round 1: Written Round (Babak Tes Tulis) 📝
                </span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed pt-1">
                  All contestants take a dictation spelling test simultaneously on paper or digital terminals. The teacher pronounces each word and reads the sentence. Only contestants who reach the passing cutoff qualify for the next round.
                </p>
              </div>

              <div className="p-5 bg-[#fefaf0] border-3 border-[#560e51] rounded-2xl shadow-[3px_3px_0px_0px_#560e51] space-y-2">
                <span className="text-xs font-black uppercase font-mono bg-[#78c222] text-[#560e51] px-3 py-1 rounded-full border border-[#560e51]">
                  Round 2: Spoken Finals (Babak Lisan di Mic) 🎙️
                </span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed pt-1">
                  Qualifiers take the stage individually at the microphone before the judges and audience. Spellers must follow the 3-step oral spelling protocol within a 30-second countdown until the Grand Champion is crowned!
                </p>
              </div>
            </div>

            {/* 3 Step Protocol for Spoken Round */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-black text-[#560e51] uppercase tracking-tight">
                Round 2 Spoken Stage 3-Step Protocol:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-fuchsia-50 border-2 border-[#560e51] rounded-2xl space-y-1 text-center">
                  <span className="text-xs font-black uppercase font-mono text-[#9b2c98]">1. Pronounce</span>
                  <p className="text-[11px] font-bold text-slate-800">
                    Speller repeats the word clearly into the microphone to confirm understanding.
                  </p>
                </div>

                <div className="p-4 bg-lime-50 border-2 border-[#560e51] rounded-2xl space-y-1 text-center">
                  <span className="text-xs font-black uppercase font-mono text-lime-800">2. Spell Aloud</span>
                  <p className="text-[11px] font-bold text-slate-800">
                    Speller articulates each letter clearly without backtracking or restarting from a different letter.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border-2 border-[#560e51] rounded-2xl space-y-1 text-center">
                  <span className="text-xs font-black uppercase font-mono text-amber-800">3. Conclude</span>
                  <p className="text-[11px] font-bold text-slate-800">
                    Speller says the full word one more time to signal completion and waits for the judge's chime.
                  </p>
                </div>
              </div>
            </div>

            {/* Questions Speller May Ask */}
            <div className="bg-sky-50 p-5 rounded-2xl border-2 border-sky-300 space-y-2">
              <h4 className="text-sm font-black text-sky-950 uppercase tracking-tight flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-sky-700" />
                <span>Permissible Questions for the Spoken Round:</span>
              </h4>
              <ul className="text-xs font-bold text-sky-900 list-disc list-inside space-y-1.5">
                <li><em>"Could you please repeat the word?"</em></li>
                <li><em>"Could you please use the word in a sentence?"</em></li>
                <li><em>"Could you please provide the definition of the word?"</em></li>
              </ul>
            </div>

            {/* Islamic Values Connection */}
            <div className="bg-emerald-50 rounded-2xl p-5 border-3 border-emerald-700 shadow-[3px_3px_0px_0px_#047857] space-y-2">
              <h4 className="text-sm font-black text-emerald-950 uppercase tracking-tight flex items-center gap-2">
                <span>☪️</span>
                <span>Adab of Seeking Knowledge & Good Sportsmanship:</span>
              </h4>
              <p className="text-xs sm:text-sm font-bold italic text-emerald-900 leading-relaxed">
                "And say: 'My Lord, increase me in knowledge.' (Surah Taha [20:114])"
              </p>
              <p className="text-xs font-semibold text-emerald-950">
                In our learning community, every participant is a winner through their sincere effort, courage to speak before an audience, and brotherhood in learning.
              </p>
            </div>

          </div>

        </motion.div>
      )}

    </div>
  );
}
