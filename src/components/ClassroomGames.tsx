import React, { useState } from 'react';
import { sound } from './SoundManager';
import { humanVoice } from '../utils/humanVoice';
import {
  Play,
  Trophy,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClassroomGamesProps {
  isTeacherMode: boolean;
  onGamePlayed: (gameKey: string) => void;
  teamScores: { teamA: number; teamB: number };
  setTeamScores: React.Dispatch<React.SetStateAction<{ teamA: number; teamB: number }>>;
  genAlphaMode?: boolean;
}

export default function ClassroomGames({
  isTeacherMode,
  onGamePlayed,
  teamScores,
  setTeamScores,
  genAlphaMode = false
}: ClassroomGamesProps) {
  const [activeGame, setActiveGame] = useState<'mystery' | 'process' | 'quantifiers' | 'wonka'>('mystery');

  const awardPoint = (team: 'A' | 'B', pts: number) => {
    if (pts > 0) sound.playCorrect();
    else sound.playWrong();
    setTeamScores(prev => ({
      ...prev,
      teamA: team === 'A' ? Math.max(0, prev.teamA + pts) : prev.teamA,
      teamB: team === 'B' ? Math.max(0, prev.teamB + pts) : prev.teamB
    }));
  };

  // ===========================================================================
  // GAME 1: MYSTERY FOOD CLUE HUNT (4 Food Detectives)
  // ===========================================================================
  const mysteryCases = [
    {
      id: 1,
      name: 'Watermelon 🍉',
      clues: [
        'Clue 1 (300 pts): I grow along the ground on creeping leafy vines in warm summer sunshine.',
        'Clue 2 (200 pts): My exterior is thick, hard and striped green, but inside I am bright red.',
        'Clue 3 (100 pts): I am 92% water and taste sweet and refreshing when eaten cold at picnics.'
      ],
      answer: 'Watermelon',
      lesson: 'Lesson 4.1 & 4.4'
    },
    {
      id: 2,
      name: 'Cacao Pod & Beans 🍫',
      clues: [
        'Clue 1 (300 pts): I grow on small tropical trees within 20 degrees of the equator, like in Ghana and Indonesia.',
        'Clue 2 (200 pts): Workers harvest me with big sharp knives called machetes twice a year.',
        'Clue 3 (100 pts): Inside my pod, 30-50 beans are dried in the sun and crushed to make delicious chocolate!'
      ],
      answer: 'Cacao Pod / Cacao Beans',
      lesson: 'Lesson 4.2'
    },
    {
      id: 3,
      name: 'Durian 🍈',
      clues: [
        'Clue 1 (300 pts): I grow high in Southeast Asian rainforest trees and am known as the King of Fruits.',
        'Clue 2 (200 pts): My shell is extremely spiky and sharp, and my smell is so pungent people ban me on trains!',
        'Clue 3 (100 pts): Inside, my yellow flesh feels thick, sweet, and wonderfully creamy.'
      ],
      answer: 'Durian',
      lesson: 'Lesson 4.4 Sensory Adjectives'
    },
    {
      id: 4,
      name: 'Mung Bean Sprouts / Cress 🌱',
      clues: [
        'Clue 1 (300 pts): You can grow me in your classroom inside a clean plastic cup without any dirt or soil!',
        'Clue 2 (200 pts): You just need wet cotton wool, sunlight, and a little water every day.',
        'Clue 3 (100 pts): When my green shoots grow tall, you can eat me as a crunchy salad vegetable!'
      ],
      answer: 'Mung Bean Sprouts (or Cress)',
      lesson: 'Lesson 4.3 Grow Your Own'
    }
  ];
  const [caseIdx, setCaseIdx] = useState(0);
  const [revealedClues, setRevealedClues] = useState<number>(1);
  const [showMysteryAnswer, setShowMysteryAnswer] = useState(false);

  // ===========================================================================
  // GAME 2: FACTORY PROCESS ORDER (From Bean to Bar)
  // ===========================================================================
  const processSteps = [
    { id: 1, step: 'The cacao pods are harvested from trees with machetes.' },
    { id: 2, step: 'The beans are taken out and dried in the hot sun for a week.' },
    { id: 3, step: 'The beans are roasted and crushed into a thick brown paste in factories.' },
    { id: 4, step: 'Plenty of sugar, cocoa butter, and milk are mixed in.' },
    { id: 5, step: 'The smooth liquid chocolate is poured into moulds and cooled into bars!' }
  ];
  const [revealedProcessStep, setRevealedProcessStep] = useState(1);

  // ===========================================================================
  // GAME 3: RAPID FIRE QUANTIFIER BUZZER (Some vs Any, A Few vs A Little)
  // ===========================================================================
  const rapidFireQuestions = [
    { prompt: 'There are ________ bananas on the plate. (+)', ans: 'SOME' },
    { prompt: 'There isn\'t ________ orange juice left. (-)', ans: 'ANY' },
    { prompt: 'Are there ________ apples in the fruit bowl? (?)', ans: 'ANY' },
    { prompt: 'Can I have ________ apples? (Countable plural)', ans: 'A FEW' },
    { prompt: 'Put ________ sugar into the coffee. (Uncountable)', ans: 'A LITTLE' },
    { prompt: 'We cooked ________ pasta for everyone! (Plenty)', ans: 'PLENTY OF' },
    { prompt: 'There aren\'t ________ crisps in the bag. (Countable negative)', ans: 'MANY' }
  ];
  const [rfIdx, setRfIdx] = useState(0);
  const [rfAnswerVisible, setRfAnswerVisible] = useState(false);

  // ===========================================================================
  // GAME 4: WILLY WONKA TRIVIA BATTLE
  // ===========================================================================
  const wonkaTrivia = [
    {
      q: 'What is "swudge" in Willy Wonka\'s chocolate factory?',
      a: 'Edible grass made of soft, minty sugar!'
    },
    {
      q: 'Why did Augustus Gloop get sucked up the glass pipe?',
      a: 'He was greedy, drank directly from the chocolate river with dirty hands, leaned too far out, and fell into the river!'
    },
    {
      q: 'Why does solid chocolate melt in our mouths?',
      a: 'Because cocoa butter melts at 34°C, which is lower than human body temperature (37°C)!'
    },
    {
      q: 'Who invented the very first solid chocolate eating bar in 1847?',
      a: 'Joseph Fry!'
    }
  ];
  const [wonkaIdx, setWonkaIdx] = useState(0);
  const [showWonkaAnswer, setShowWonkaAnswer] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Scoreboard Bar */}
      <div className="bg-[#560e51] text-white p-5 rounded-[28px] border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#78c222] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-7 w-7 text-[#78c222]" />
          <div>
            <span className="text-xs font-mono font-black text-[#78c222] uppercase">Classroom Team Scoreboard</span>
            <h3 className="text-xl font-black uppercase">Unit 4 Food Tournament 🏆</h3>
          </div>
        </div>

        {/* Team Scores */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
            <span className="text-sm font-black text-amber-300">Team A:</span>
            <span className="text-xl font-mono font-black">{teamScores.teamA}</span>
            <button
              onClick={() => awardPoint('A', 100)}
              className="px-2 py-0.5 bg-[#78c222] text-[#560e51] font-black text-xs rounded cursor-pointer ml-1"
            >
              +100
            </button>
            <button
              onClick={() => awardPoint('A', -50)}
              className="px-2 py-0.5 bg-rose-500 text-white font-black text-xs rounded cursor-pointer"
            >
              -50
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
            <span className="text-sm font-black text-cyan-300">Team B:</span>
            <span className="text-xl font-mono font-black">{teamScores.teamB}</span>
            <button
              onClick={() => awardPoint('B', 100)}
              className="px-2 py-0.5 bg-[#78c222] text-[#560e51] font-black text-xs rounded cursor-pointer ml-1"
            >
              +100
            </button>
            <button
              onClick={() => awardPoint('B', -50)}
              className="px-2 py-0.5 bg-rose-500 text-white font-black text-xs rounded cursor-pointer"
            >
              -50
            </button>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'mystery', label: '1. Mystery Food Clues 🕵️', icon: '🍉' },
          { id: 'process', label: '2. Bean to Bar Process 🍫', icon: '⚙️' },
          { id: 'quantifiers', label: '3. Quantifier Buzzer ⚡', icon: '🥛' },
          { id: 'wonka', label: '4. Wonka Factory Trivia 🎫', icon: '🎩' }
        ].map(g => (
          <button
            key={g.id}
            onClick={() => {
              setActiveGame(g.id as any);
              onGamePlayed(g.id);
              sound.playClick();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tight border-3 transition-all cursor-pointer whitespace-nowrap ${
              activeGame === g.id
                ? 'bg-[#560e51] text-white border-[#560e51] shadow-[3px_3px_0px_0px_#78c222]'
                : 'bg-white hover:bg-fuchsia-50 text-slate-700 border-slate-300'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* GAME 1: MYSTERY FOOD */}
      {activeGame === 'mystery' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Case {caseIdx + 1} of {mysteryCases.length} · {mysteryCases[caseIdx].lesson}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Who Am I? (Guess the Food from Clues)
              </h3>
            </div>
            <button
              onClick={() => {
                setCaseIdx((caseIdx + 1) % mysteryCases.length);
                setRevealedClues(1);
                setShowMysteryAnswer(false);
                sound.playClick();
              }}
              className="px-4 py-2 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] font-black text-xs uppercase rounded-xl border border-[#560e51] cursor-pointer"
            >
              Next Food Case →
            </button>
          </div>

          <div className="space-y-4">
            {mysteryCases[caseIdx].clues.slice(0, revealedClues).map((clue, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-[#fefaf0] border-2 border-[#560e51] rounded-2xl shadow-[2px_2px_0px_0px_#560e51] flex items-start gap-3"
              >
                <span className="text-lg">🔍</span>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  {clue}
                </p>
              </motion.div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              {revealedClues < 3 && (
                <button
                  onClick={() => {
                    setRevealedClues(prev => prev + 1);
                    sound.playPop();
                  }}
                  className="px-5 py-2.5 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer"
                >
                  Reveal Next Clue ({revealedClues === 1 ? '200 pts' : '100 pts'})
                </button>
              )}

              <button
                onClick={() => {
                  setShowMysteryAnswer(!showMysteryAnswer);
                  if (!showMysteryAnswer) sound.playFanfare();
                  else sound.playClick();
                }}
                className="px-5 py-2.5 bg-[#560e51] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
              >
                {showMysteryAnswer ? 'Hide Identity' : 'Reveal Identity 💡'}
              </button>
            </div>

            {showMysteryAnswer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-50 border-3 border-emerald-500 rounded-2xl text-center space-y-2"
              >
                <span className="text-xs font-mono font-black text-emerald-900 uppercase">Mystery Solved!</span>
                <h4 className="text-3xl font-black text-[#560e51] uppercase">
                  {mysteryCases[caseIdx].name}
                </h4>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* GAME 2: BEAN TO BAR */}
      {activeGame === 'process' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Lesson 4.2 · Language Focus (is/are + Past Participle)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                From Bean to Bar: Step-by-Step Chocolate Process
              </h3>
            </div>
            <span className="text-2xl">🍫</span>
          </div>

          <div className="space-y-3">
            {processSteps.slice(0, revealedProcessStep).map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#fdf2fe] border-2 border-[#560e51] rounded-2xl flex items-center gap-3 shadow-[2px_2px_0px_0px_#560e51]"
              >
                <div className="w-8 h-8 rounded-full bg-[#78c222] text-[#560e51] font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51]">
                  {idx + 1}
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {step.step}
                </p>
              </motion.div>
            ))}

            <div className="flex gap-3 pt-4">
              {revealedProcessStep < processSteps.length ? (
                <button
                  onClick={() => {
                    setRevealedProcessStep(prev => prev + 1);
                    sound.playPop();
                  }}
                  className="px-6 py-3 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer"
                >
                  Show Next Process Step →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setRevealedProcessStep(1);
                    sound.playClick();
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs uppercase rounded-xl border border-slate-300 cursor-pointer"
                >
                  Restart Process Loop
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: QUANTIFIER BUZZER */}
      {activeGame === 'quantifiers' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Rapid Fire Team Buzzer · Some, Any, Few, Little
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Buzzer Challenge {rfIdx + 1} of {rapidFireQuestions.length}
              </h3>
            </div>
            <button
              onClick={() => {
                setRfIdx((rfIdx + 1) % rapidFireQuestions.length);
                setRfAnswerVisible(false);
                sound.playClick();
              }}
              className="px-4 py-2 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] font-black text-xs uppercase rounded-xl border border-[#560e51] cursor-pointer"
            >
              Next Prompt →
            </button>
          </div>

          <div className="bg-[#fefaf0] p-8 rounded-2xl border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] text-center space-y-6">
            <span className="text-xs font-mono font-black text-[#560e51] uppercase">Fill In The Blank</span>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              "{rapidFireQuestions[rfIdx].prompt}"
            </h4>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setRfAnswerVisible(!rfAnswerVisible);
                  if (!rfAnswerVisible) sound.playCorrect();
                }}
                className="px-6 py-3 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-sm uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer"
              >
                {rfAnswerVisible ? 'Hide Answer' : 'Reveal Answer 🔔'}
              </button>
            </div>

            {rfAnswerVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white border-2 border-[#560e51] rounded-xl inline-block"
              >
                <span className="text-2xl font-mono font-black text-[#560e51]">
                  👉 {rapidFireQuestions[rfIdx].ans}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* GAME 4: WONKA TRIVIA */}
      {activeGame === 'wonka' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Lesson 4.5 Roald Dahl Literature Trivia
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Charlie and the Chocolate Factory Trivia Question {wonkaIdx + 1}
              </h3>
            </div>
            <button
              onClick={() => {
                setWonkaIdx((wonkaIdx + 1) % wonkaTrivia.length);
                setShowWonkaAnswer(false);
                sound.playClick();
              }}
              className="px-4 py-2 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] font-black text-xs uppercase rounded-xl border border-[#560e51] cursor-pointer"
            >
              Next Trivia Question →
            </button>
          </div>

          <div className="p-8 bg-[#fdf2fe] rounded-2xl border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] text-center space-y-4">
            <span className="text-3xl">🎩🍫</span>
            <p className="text-xl sm:text-2xl font-black text-slate-950 leading-relaxed">
              {wonkaTrivia[wonkaIdx].q}
            </p>

            <button
              onClick={() => {
                setShowWonkaAnswer(!showWonkaAnswer);
                if (!showWonkaAnswer) sound.playCorrect();
              }}
              className="px-6 py-2.5 bg-[#560e51] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
            >
              {showWonkaAnswer ? 'Hide Answer' : 'Check Wonka Answer Key'}
            </button>

            {showWonkaAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white border-2 border-[#78c222] rounded-xl text-sm font-bold text-emerald-950 max-w-xl mx-auto"
              >
                {wonkaTrivia[wonkaIdx].a}
              </motion.div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
