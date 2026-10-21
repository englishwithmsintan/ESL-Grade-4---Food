import React, { useState, useEffect, useRef } from 'react';
import { MOCK_SAT_QUESTIONS } from '../data/reviewData';
import { SATQuestion } from '../types';
import { sound } from './SoundManager';
import { humanVoice, isAbortError } from '../utils/humanVoice';
import { 
  Award, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Copy, 
  RefreshCw,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SIMPLE_FOOD_ESSAY =
  'My favourite food is delicious milk chocolate. ' +
  'It is made from cacao beans that grow on trees near the equator in hot, sunny countries. ' +
  'First, the ripe pods are harvested by workers. ' +
  'Then, the beans are dried in the sun and crushed into a brown paste in factories. ' +
  'Plenty of sugar and a little milk are mixed together with cocoa butter. ' +
  'It looks shiny brown, smells rich, and tastes sweet and creamy. ' +
  'I eat a little chocolate every weekend because it makes me happy!';

const EASY_FOOD_TEMPLATE =
  'My favourite [food / drink] is [chocolate / fresh orange juice / strawberry cake]. ' +
  'It is [grown / made] in [hot countries / Indonesia / local farms]. ' +
  'First, the [cacao beans / oranges / strawberries] are [harvested / picked / cleaned]. ' +
  'Then, they are [dried in the sun / crushed into paste / mixed with milk and sugar]. ' +
  'It tastes [sweet, creamy, and delicious / juicy and refreshing]. ' +
  'I eat [a little / a few / plenty of] it because [it gives me energy and tastes amazing].';

const ESL_FOOD_WRITING_CHIPS = {
  foods: ['milk chocolate', 'fresh orange juice', 'mung bean sprouts', 'strawberry cake', 'warm vegetable soup'],
  processes: ['is made from', 'are harvested by workers', 'are dried in the sun', 'are crushed into paste', 'is mixed with milk and sugar'],
  sensory: ['sweet', 'creamy', 'crunchy', 'juicy', 'delicious', 'shiny brown', 'fragrant'],
  quantifiers: ['a little', 'a few', 'plenty of', 'a lot of']
};

interface SATMockExamProps {
  progress: { mockExamScore: number | null; mockExamCompleted: boolean };
  onSaveMockScore: (score: number) => void;
  isTeacherMode: boolean;
  genAlphaMode?: boolean;
}

export default function SATMockExam({
  progress,
  onSaveMockScore,
  isTeacherMode,
  genAlphaMode = false
}: SATMockExamProps) {
  const [examMode, setExamMode] = useState<'practice' | 'exam' | 'paper' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qNum: number]: string | boolean }>({});
  const [textAnswers, setTextAnswers] = useState<{ [qNum: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(2400); // 40 minutes for 50-mark exam
  const [timerActive, setTimerActive] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [isPlayingListeningAudio, setIsPlayingListeningAudio] = useState(false);
  const [candidateName, setCandidateName] = useState('Grade 4 Student');
  const [candidateClass, setCandidateClass] = useState('Class 4');

  // Essay writing state for Part 5
  const [essayText, setEssayText] = useState(SIMPLE_FOOD_ESSAY);
  const [showEslTips, setShowEslTips] = useState(false);
  const [showModelText, setShowModelText] = useState(false);
  const [isSpeakingModel, setIsSpeakingModel] = useState(false);

  // Active filter for question navigation
  const [navPartFilter, setNavPartFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');

  const questions = MOCK_SAT_QUESTIONS;
  const currentQ = questions[currentQuestionIndex];

  // Timer logic for Exam mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && countdown > 0 && !submitted) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, countdown, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (mode: 'practice' | 'exam' | 'paper') => {
    setExamMode(mode);
    setSubmitted(false);
    setExamFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTextAnswers({});
    if (mode === 'exam') {
      setCountdown(2400);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
    sound.playClick();
  };

  const handleSelectAnswer = (qNumber: number, answer: string | boolean) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qNumber]: answer
    }));
    sound.playClick();
  };

  // Play audio for Part 1 Listening (Mung bean sprouts)
  const handlePlayListeningAudio = () => {
    if (isPlayingListeningAudio) {
      humanVoice.stop();
      setIsPlayingListeningAudio(false);
      return;
    }

    const audioScript = 
      "Welcome to SDIT Auliya English Summative Assessment Unit 4: Food. " +
      "Part 1: Listening. Listen to the audio explaining how to grow mung bean sprouts. " +
      "Number the steps 2 to 6 in the order you hear them. " +
      "Step 1 is done for you: Clean a plastic cup with water. " +
      "Step 2: Put some cotton in the cup. " +
      "Step 3: Put the beans on the cotton and add some water. " +
      "Step 4: Put the cup outside in the sun. " +
      "Step 5: Add a little water every day. " +
      "Step 6: When green sprouts grow, eat the sprouts!";

    sound.playPop();
    humanVoice.speak(audioScript, {
      rate: 0.9,
      onStart: () => setIsPlayingListeningAudio(true),
      onEnd: () => setIsPlayingListeningAudio(false)
    });
  };

  const speakModelEssay = () => {
    if (isSpeakingModel) {
      humanVoice.stop();
      setIsSpeakingModel(false);
      return;
    }
    sound.playPop();
    humanVoice.speak(SIMPLE_FOOD_ESSAY, {
      rate: 0.95,
      onStart: () => setIsSpeakingModel(true),
      onEnd: () => setIsSpeakingModel(false)
    });
  };

  const calculateAutoScore = () => {
    let score = 0;
    // Auto-grade Q1 through Q35 (35 marks)
    questions.slice(0, 35).forEach(q => {
      const studentAns = selectedAnswers[q.number];
      if (studentAns !== undefined && studentAns === q.correctAnswer) {
        score += q.points;
      }
    });

    // Grade Part 5 Essay (15 points based on word count & key ingredients)
    const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
    let essayPoints = 0;
    if (wordCount >= 40) essayPoints += 5;
    if (wordCount >= 70) essayPoints += 5;
    const lower = essayText.toLowerCase();
    if (lower.includes('made') || lower.includes('grown') || lower.includes('is') || lower.includes('are')) essayPoints += 2;
    if (lower.includes('sweet') || lower.includes('crunchy') || lower.includes('creamy') || lower.includes('juicy')) essayPoints += 2;
    if (lower.includes('little') || lower.includes('few') || lower.includes('plenty') || lower.includes('lot')) essayPoints += 1;
    score += Math.min(essayPoints, 15);

    return Math.min(50, score);
  };

  const handleSubmitExam = () => {
    setSubmitted(true);
    setTimerActive(false);
    const finalScore = calculateAutoScore();
    onSaveMockScore(finalScore);
    if (finalScore >= 40) {
      sound.playFanfare();
    } else {
      sound.playCorrect();
    }
  };

  const handleAutoSubmit = () => {
    setSubmitted(true);
    setTimerActive(false);
    const finalScore = calculateAutoScore();
    onSaveMockScore(finalScore);
    sound.playWrong();
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter questions for navigation
  const filteredQuestions = navPartFilter === 'all'
    ? questions
    : questions.filter(q => q.part === navPartFilter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Intro / Mode Selection Screen */}
      {!examMode && (
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fdf2fe] border-2 border-[#560e51] text-xs font-black uppercase text-[#560e51] font-mono">
              SDIT Auliya · Semester 1 Summative Assessment
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
              Grade 4 ESL Unit 4: Food (50 Marks) 📝
            </h2>
            <p className="text-sm font-semibold text-slate-650 max-w-2xl mx-auto leading-relaxed">
              Complete the exact 5-part summative assessment from the SDIT Auliya Curriculum.
              Covers Listening (mung beans), Vocabulary (fruit & sensory anagrams), Grammar (some/any & quantifiers), Reading ("From Cocoa to Chocolate" & Poem), and Guided Food Writing!
            </p>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            
            {/* Practice Mode */}
            <div 
              onClick={() => handleStartExam('practice')}
              className="bg-[#fefaf0] hover:bg-lime-50 p-6 rounded-[28px] border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl">🌱</span>
                <h3 className="text-lg font-black uppercase text-slate-950 mt-2">Practice Mode</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Untimed, self-paced exploration with instant hints, pronunciation read-aloud, and rule explanations.
                </p>
              </div>
              <button className="w-full py-2.5 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]">
                Start Practice →
              </button>
            </div>

            {/* Official Exam Simulation */}
            <div 
              onClick={() => handleStartExam('exam')}
              className="bg-[#fdf2fe] hover:bg-fuchsia-100 p-6 rounded-[28px] border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl">⏱️</span>
                <h3 className="text-lg font-black uppercase text-slate-950 mt-2">Summative Exam (Timed)</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Official 40-minute simulated test conditions. Auto-calculates your 50-mark score and records progress.
                </p>
              </div>
              <button className="w-full py-2.5 bg-[#560e51] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222]">
                Begin 50-Mark Exam →
              </button>
            </div>

            {/* Printable Paper Format */}
            <div 
              onClick={() => handleStartExam('paper')}
              className="bg-white hover:bg-slate-50 p-6 rounded-[28px] border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl">📄</span>
                <h3 className="text-lg font-black uppercase text-slate-950 mt-2">Printable Paper Test</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Exact replica of the 5-page SDIT Auliya classroom examination paper. Perfect for classroom printing!
                </p>
              </div>
              <button className="w-full py-2.5 bg-slate-100 text-slate-800 font-black text-xs uppercase rounded-xl border-2 border-slate-300">
                View Paper Format →
              </button>
            </div>

          </div>

          {/* Past Result Badge */}
          {progress.mockExamCompleted && (
            <div className="bg-lime-50 border-2 border-lime-500 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-[#78c222]" />
                <div>
                  <span className="text-xs font-black uppercase text-emerald-950 font-mono">Last Completed Exam Result</span>
                  <p className="text-sm font-black text-[#560e51]">
                    Score: {progress.mockExamScore} / 50 Marks ({Math.round((progress.mockExamScore! / 50) * 100)}%)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#78c222] text-[#560e51] font-mono font-black text-xs rounded-lg border border-[#560e51]">
                Completed
              </span>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* EXAM / PRACTICE ACTIVE VIEW */}
      {/* ===================================================================== */}
      {(examMode === 'practice' || examMode === 'exam') && (
        <div className="space-y-6">
          
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl p-4 border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setExamMode(null);
                  sound.playClick();
                }}
                className="px-3 py-1.5 rounded-xl border-2 border-[#560e51] text-xs font-black uppercase text-[#560e51] hover:bg-slate-50 cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                {examMode === 'exam' ? '⏱️ Timed Summative Exam' : '🌱 Practice Mode'}
              </span>
            </div>

            {/* Countdown timer */}
            {examMode === 'exam' && (
              <div className="flex items-center gap-2 bg-[#560e51] text-white px-4 py-1.5 rounded-xl border-2 border-[#78c222] font-mono font-black text-sm">
                <Clock className="h-4 w-4 text-[#78c222] animate-spin" />
                <span>{formatTime(countdown)}</span>
              </div>
            )}

            {/* Submit button */}
            {!submitted ? (
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer"
              >
                Submit All Answers 📝
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-[#560e51] bg-lime-100 px-3 py-1 rounded-lg border border-lime-500">
                  Total: {calculateAutoScore()} / 50 Marks
                </span>
                <button
                  onClick={() => handleStartExam(examMode)}
                  className="px-3 py-1.5 bg-fuchsia-100 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] cursor-pointer"
                >
                  Retake Exam
                </button>
              </div>
            )}
          </div>

          {/* Part Filter Bar */}
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All (1-36)' },
              { id: 1, label: 'Part 1: Listening (1-5)' },
              { id: 2, label: 'Part 2: Vocabulary (6-15)' },
              { id: 3, label: 'Part 3: Grammar (16-25)' },
              { id: 4, label: 'Part 4: Reading (26-35)' },
              { id: 5, label: 'Part 5: Writing (36)' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setNavPartFilter(p.id as any);
                  const firstOfPart = p.id === 'all' ? 0 : questions.findIndex(q => q.part === p.id);
                  if (firstOfPart !== -1) setCurrentQuestionIndex(firstOfPart);
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase whitespace-nowrap border-2 cursor-pointer ${
                  navPartFilter === p.id
                    ? 'bg-[#560e51] text-white border-[#560e51] shadow-[2px_2px_0px_0px_#78c222]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Active Question Box */}
          {currentQ && (
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-6">
              
              {/* Question Header */}
              <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
                <span className="text-xs font-black uppercase text-[#9b2c98] font-mono">
                  Part {currentQ.part} · Question {currentQ.number} of {questions.length} ({currentQ.points} {currentQ.points === 1 ? 'Point' : 'Points'})
                </span>

                {/* Part 1 Audio Button */}
                {currentQ.part === 1 && (
                  <button
                    onClick={handlePlayListeningAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[1px_1px_0px_0px_#560e51] cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>{isPlayingListeningAudio ? 'Playing Audio...' : 'Play Listening Audio 🎧'}</span>
                  </button>
                )}
              </div>

              {/* Special Part Passage Displays */}
              {currentQ.part === 3 && (
                <div className="bg-[#fefaf0] p-4 rounded-2xl border-2 border-[#560e51] space-y-1">
                  <span className="text-[10px] font-black uppercase font-mono text-[#9b2c98]">Context Passage</span>
                  <p className="text-xs font-bold text-slate-800">
                    🧺 <em>"It's Sunday. A family is having a picnic by the lake."</em>
                  </p>
                </div>
              )}

              {currentQ.part === 4 && (
                <div className="bg-[#fdf2fe] p-4 rounded-2xl border-2 border-[#560e51] space-y-2">
                  <span className="text-[10px] font-black uppercase font-mono text-[#9b2c98]">Reading Comprehension Passage</span>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">
                    <strong>(A)</strong> Cacao trees grow in hot, wet countries near the equator, like Indonesia and Ghana. The trees are small, and the beans grow inside big pods. A lot of rain and sunshine is needed.<br />
                    <strong>(B)</strong> When the pods are ripe, they are picked by workers. The beans are taken out and dried in the sun. Then they are sent to factories, where they are roasted and crushed into a brown paste. A little sugar is added, and for milk chocolate, some milk is mixed in too. Finally, the chocolate is poured into moulds and cooled.<br />
                    <strong>(C)</strong> People all over the world love chocolate. Some chocolate is sweet and creamy, and some is dark and bitter. There are plenty of ways to eat it: in bars, cakes, drinks and ice cream.
                  </p>
                </div>
              )}

              {/* Question Text */}
              <p className="text-lg sm:text-xl font-black text-slate-950 leading-relaxed">
                {currentQ.question}
              </p>

              {/* Options (Multiple choice or true/false) */}
              {currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQ.number] === opt;
                    const isCorrect = opt === currentQ.correctAnswer;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(currentQ.number, opt)}
                        className={`p-4 rounded-2xl text-sm sm:text-base font-black font-mono border-3 transition-all cursor-pointer text-left ${
                          isSelected
                            ? submitted
                              ? isCorrect
                                ? 'bg-[#78c222] text-[#560e51] border-[#560e51]'
                                : 'bg-rose-400 text-white border-[#560e51]'
                              : 'bg-[#560e51] text-white border-[#560e51] shadow-[2px_2px_0px_0px_#78c222]'
                            : submitted && isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                            : 'bg-white hover:bg-fuchsia-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Part 5: Guided Writing Box */}
              {currentQ.part === 5 && (
                <div className="space-y-4">
                  <div className="p-4 bg-fuchsia-50 border-2 border-fuchsia-300 rounded-2xl text-xs space-y-2">
                    <span className="font-black text-[#560e51] uppercase block">Writing Checklist & Sentence Starters:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 font-semibold">
                      <li>What is your favourite food? (<em>"My favourite food is..."</em>)</li>
                      <li>Where is it grown or made? (<em>"It is grown in..." / "It is made in..."</em>)</li>
                      <li>How is it made? (<em>"First, it is harvested... Then it is mixed with..."</em>)</li>
                      <li>Sensory words: (<em>sweet, juicy, creamy, crunchy, spicy, salty</em>)</li>
                      <li>Quantifiers: (<em>a lot of, plenty of, a little, a few</em>)</li>
                    </ul>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setShowModelText(!showModelText)}
                      className="px-3 py-1.5 bg-[#fefaf0] hover:bg-amber-100 text-[#560e51] font-bold text-xs rounded-xl border border-[#560e51] cursor-pointer"
                    >
                      {showModelText ? 'Hide Sample Model' : 'Show Sample Model Essay (80 words)'}
                    </button>
                    <button
                      onClick={speakModelEssay}
                      className="px-3 py-1.5 bg-[#78c222] text-[#560e51] font-bold text-xs rounded-xl border border-[#560e51] cursor-pointer flex items-center gap-1"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isSpeakingModel ? 'Stop Audio' : 'Listen to Model'}</span>
                    </button>
                  </div>

                  {showModelText && (
                    <div className="p-4 bg-white border-2 border-[#78c222] rounded-xl text-xs font-serif leading-relaxed text-slate-800 italic">
                      "{SIMPLE_FOOD_ESSAY}"
                    </div>
                  )}

                  <textarea
                    rows={6}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Write your paragraph here (about 80 words)..."
                    className="w-full p-4 rounded-2xl border-2 border-[#560e51] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#78c222]"
                  />
                  <div className="flex justify-between text-xs font-mono font-bold text-slate-500">
                    <span>Word count: {essayText.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <span>Target: ~80 words (Pass mark: 15 points)</span>
                  </div>
                </div>
              )}

              {/* Explanations (revealed in Practice mode or after Submit) */}
              {(examMode === 'practice' || submitted) && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-xs space-y-1">
                  <span className="font-black text-emerald-950 uppercase block font-mono">
                    Official Answer & Explanation:
                  </span>
                  <p className="text-emerald-900 font-bold">
                    <strong>Correct:</strong> {String(currentQ.correctAnswer)}
                  </p>
                  <p className="text-emerald-800 font-medium">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Nav Buttons */}
              <div className="flex justify-between items-center border-t-2 border-fuchsia-100 pt-4">
                <button
                  onClick={() => {
                    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
                    sound.playClick();
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] cursor-pointer disabled:opacity-40"
                >
                  ← Prev
                </button>

                <div className="text-xs font-mono font-bold text-slate-500">
                  {currentQuestionIndex + 1} of {questions.length}
                </div>

                <button
                  onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
                    sound.playClick();
                  }}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-5 py-2 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] cursor-pointer disabled:opacity-40"
                >
                  Next →
                </button>
              </div>

            </div>
          )}

          {/* Quick Navigator Question Grid */}
          <div className="bg-white rounded-2xl p-4 border-2 border-[#560e51] space-y-2">
            <span className="text-[10px] font-black uppercase font-mono text-[#560e51] block">
              Quick Question Jump:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.number] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.number}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      sound.playClick();
                    }}
                    className={`h-7 w-7 rounded-lg text-xs font-black font-mono border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#560e51] text-white border-[#560e51]'
                        : isAnswered
                        ? 'bg-[#78c222] text-[#560e51] border-[#560e51]'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* PRINTABLE PAPER TEST REPLICA (SDIT AULIYA SEMESTER 1 FORMAT) */}
      {/* ===================================================================== */}
      {examMode === 'paper' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-[#560e51]">
            <button
              onClick={() => setExamMode(null)}
              className="px-4 py-2 border-2 border-[#560e51] rounded-xl text-xs font-black uppercase text-[#560e51] cursor-pointer"
            >
              ← Back to Modes
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" /> Print Assessment Paper
            </button>
          </div>

          {/* Paper Sheet Preview */}
          <div className="bg-white p-8 sm:p-12 rounded-[24px] border-2 border-slate-300 shadow-xl space-y-8 font-serif text-slate-900 print:border-none print:shadow-none print:p-0">
            {/* Paper Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h2 className="text-xl font-bold tracking-tight uppercase">ENGLISH SUMMATIVE ASSESSMENT</h2>
              <h3 className="text-lg font-bold uppercase">UNIT 4: FOOD</h3>
              <p className="text-sm font-semibold">SDIT AULIYA SEMESTER 1, S.Y 2026-2027</p>
              <div className="flex justify-between pt-4 text-sm font-sans font-bold">
                <div>Name: _______________________________</div>
                <div>Class 4: _________________</div>
              </div>
            </div>

            {/* Part 1 */}
            <div className="space-y-3 font-sans">
              <div className="bg-slate-100 p-2 font-bold text-sm border-l-4 border-slate-800">
                PART 1: Listening [Total: 5 points]
              </div>
              <p className="text-xs italic text-slate-700">
                Listen to the audio explaining how to grow mung bean sprouts. Number the steps 2-6 in the order you hear them. Step 1 is done for you.
              </p>
              <div className="space-y-2 text-xs font-medium border border-slate-300 p-4 rounded">
                <div className="flex items-center gap-3"><span className="w-8 h-6 border border-slate-400 text-center font-bold"></span> <span>Eat the sprouts.</span></div>
                <div className="flex items-center gap-3"><span className="w-8 h-6 border border-slate-400 text-center font-bold"></span> <span>Put the cup outside in the sun.</span></div>
                <div className="flex items-center gap-3"><span className="w-8 h-6 border border-slate-400 text-center font-bold">1</span> <span>Clean a plastic cup with water. (example)</span></div>
                <div className="flex items-center gap-3"><span className="w-8 h-6 border border-slate-400 text-center font-bold"></span> <span>Add a little water every day.</span></div>
                <div className="flex items-center gap-3"><span className="w-8 h-6 border border-slate-400 text-center font-bold"></span> <span>Put some cotton in the cup.</span></div>
                <div className="flex items-center gap-3"><span className="w-8 h-6 border border-slate-400 text-center font-bold"></span> <span>Put the beans on the cotton and add some water.</span></div>
              </div>
            </div>

            {/* Part 2 */}
            <div className="space-y-4 font-sans">
              <div className="bg-slate-100 p-2 font-bold text-sm border-l-4 border-slate-800">
                PART 2: Vocabulary [Total: 10 points]
              </div>
              <p className="text-xs font-bold">A. Match the pictures to the words. Draw a line to connect them. (5 points)</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>0. strawberry [ A ]</div>
                  <div>1. carrot [ _____ ]</div>
                  <div>2. mushroom [ _____ ]</div>
                  <div>3. watermelon [ _____ ]</div>
                  <div>4. onion [ _____ ]</div>
                  <div>5. pineapple [ _____ ]</div>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>A. 🍓 Strawberry</div>
                  <div>B. 🍄 Mushroom</div>
                  <div>C. 🍍 Pineapple</div>
                  <div>D. 🧅 Onion</div>
                  <div>E. 🍉 Watermelon</div>
                  <div>F. 🥕 Carrot</div>
                </div>
              </div>

              <p className="text-xs font-bold pt-2">B. Read and write the words. Use the letters to help you. (5 points)</p>
              <div className="space-y-2 text-xs">
                <div>0. <strong>e e w s t</strong> &nbsp; A strawberry tastes <u>sweet</u>.</div>
                <div>6. <strong>c y j u i</strong> &nbsp; An orange tastes ____________________.</div>
                <div>7. <strong>y t l a s</strong> &nbsp; French fries taste ____________________.</div>
                <div>8. <strong>m a r c y e</strong> &nbsp; Ice cream tastes ____________________.</div>
                <div>9. <strong>c i s y p</strong> &nbsp; Chilli sauce tastes ____________________.</div>
                <div>10. <strong>u n c h c r y</strong> &nbsp; Toast sounds ____________________ when you bite it.</div>
              </div>
            </div>

            {/* Part 3 */}
            <div className="space-y-4 font-sans">
              <div className="bg-slate-100 p-2 font-bold text-sm border-l-4 border-slate-800">
                PART 3: Grammar [Total: 10 points]
              </div>
              <p className="text-xs italic">It's Sunday. A family is having a picnic by the lake.</p>
              <p className="text-xs font-bold">A. Complete the sentences with some or any. (5 points)</p>
              <div className="space-y-1.5 text-xs">
                <div>0. Example: There is <u>some</u> chocolate cake.</div>
                <div>1. There are ____________________ sandwiches on the plate.</div>
                <div>2. There is ____________________ orange juice in the bottle.</div>
                <div>3. Are there ____________________ bananas?</div>
                <div>4. There aren't ____________________ grapes.</div>
                <div>5. There isn't ____________________ ice cream.</div>
              </div>

              <p className="text-xs font-bold pt-2">B. Circle the correct word for each space. (5 points)</p>
              <div className="space-y-2 text-xs">
                <div>1. There are <strong>[ a little / a few ]</strong> apples on the plate.</div>
                <div>2. There is <strong>[ plenty of / a few ]</strong> orange juice in the bottle. We can all have a glass!</div>
                <div>3. Ben isn't very hungry. He only wants <strong>[ a lot of / a little ]</strong> cake.</div>
                <div>4. There is <strong>[ a few / a lot of ]</strong> water in the lake. You can't see the end of it!</div>
                <div>5. There are only <strong>[ a few / a little ]</strong> strawberries on the cake.</div>
              </div>
            </div>

            {/* Part 4 */}
            <div className="space-y-4 font-sans">
              <div className="bg-slate-100 p-2 font-bold text-sm border-l-4 border-slate-800">
                PART 4: Reading Comprehension [Total: 10 points]
              </div>
              <div className="p-4 bg-slate-50 border border-slate-300 text-xs leading-relaxed space-y-2 font-serif">
                <p className="font-bold text-center">FROM COCOA TO CHOCOLATE</p>
                <p><strong>(A)</strong> Cacao trees grow in hot, wet countries near the equator, like Indonesia and Ghana. The trees are small, and the beans grow inside big pods. A lot of rain and sunshine is needed.</p>
                <p><strong>(B)</strong> When the pods are ripe, they are picked by workers. The beans are taken out and dried in the sun. Then they are sent to factories, where they are roasted and crushed into a brown paste. A little sugar is added, and for milk chocolate, some milk is mixed in too. Finally, the chocolate is poured into moulds and cooled.</p>
                <p><strong>(C)</strong> People all over the world love chocolate. Some chocolate is sweet and creamy, and some is dark and bitter. There are plenty of ways to eat it: in bars, cakes, drinks and ice cream.</p>
              </div>

              <p className="text-xs font-bold">A. Match each paragraph to its heading: <em>Making chocolate / Eating chocolate / Growing the beans</em></p>
              <div className="text-xs space-y-1">
                <div>1. Paragraph A: _____________________________________________________________</div>
                <div>2. Paragraph B: _____________________________________________________________</div>
                <div>3. Paragraph C: _____________________________________________________________</div>
              </div>

              <p className="text-xs font-bold pt-2">B. Circle true or false:</p>
              <div className="text-xs space-y-1">
                <div>4. Cacao trees grow in cold countries. &nbsp;&nbsp; <strong>true / false</strong></div>
                <div>5. The beans are dried in the sun. &nbsp;&nbsp; <strong>true / false</strong></div>
                <div>6. Milk is mixed in to make milk chocolate. &nbsp;&nbsp; <strong>true / false</strong></div>
                <div>7. Chocolate is only eaten in bars. &nbsp;&nbsp; <strong>true / false</strong></div>
              </div>
            </div>

            {/* Part 5 */}
            <div className="space-y-3 font-sans">
              <div className="bg-slate-100 p-2 font-bold text-sm border-l-4 border-slate-800">
                PART 5: Writing [Total: 15 points]
              </div>
              <p className="text-xs leading-relaxed">
                Where does your favourite food or drink come from? Write a paragraph of about 80 words. Use the questions to help you plan: What is your favourite food? Where is it grown or made? How is it made (is/are + past participle)? What does it taste like? How much do you eat?
              </p>
              <div className="border border-slate-300 h-40 rounded"></div>
              <p className="text-center text-xs font-bold italic pt-4">-- Good Luck --</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
