import React, { useState } from 'react';
import { sound } from './SoundManager';
import { Award, CheckCircle, AlertTriangle, RefreshCw, Sparkles, BookOpen, HelpCircle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GrammarPracticeProps {
  progress: { grammarAccuracy: { [key: string]: number } };
  onUpdateAccuracy: (category: string, accuracy: number) => void;
  isTeacherMode: boolean;
  genAlphaMode?: boolean;
}

export default function GrammarPractice({
  progress,
  onUpdateAccuracy,
  isTeacherMode,
  genAlphaMode = false
}: GrammarPracticeProps) {
  const [activeSubTab, setActiveSubTab] = useState<'someAny' | 'quantifiers' | 'passiveProcess' | 'connectives'>('someAny');

  // ===========================================================================
  // 1. SOME AND ANY (Lessons 4.1 & 4.2)
  // ===========================================================================
  const someAnyQuestions = [
    {
      sentence: 'There are ____________ bananas for breakfast – help yourself!',
      options: ['some', 'any'],
      correct: 'some',
      rule: 'Use "some" in positive affirmative sentences with plural countable nouns.'
    },
    {
      sentence: 'Are there ____________ onions in the omelette?',
      options: ['some', 'any'],
      correct: 'any',
      rule: 'Use "any" in questions when asking if an ingredient is present.'
    },
    {
      sentence: 'We’d like ____________ chocolate sauce on our ice creams, please.',
      options: ['some', 'any'],
      correct: 'some',
      rule: 'Use "some" when making a polite request or positive statement with uncountable nouns.'
    },
    {
      sentence: 'Have you got ____________ cheese in the fridge?',
      options: ['some', 'any'],
      correct: 'any',
      rule: 'Use "any" in questions with uncountable food items.'
    },
    {
      sentence: 'I need ____________ tomatoes for the pasta sauce.',
      options: ['some', 'any'],
      correct: 'some',
      rule: 'Use "some" in positive statements ("I need some tomatoes").'
    },
    {
      sentence: 'We don’t have ____________ mushrooms for the pizza.',
      options: ['some', 'any'],
      correct: 'any',
      rule: 'Use "any" in negative sentences with don’t / doesn’t / aren’t.'
    },
    {
      sentence: 'Why isn’t there ____________ bread left for toast?',
      options: ['some', 'any'],
      correct: 'any',
      rule: 'Use "any" in negative questions ("Why isn’t there any...").'
    },
    {
      sentence: 'There is ____________ delicious homemade jam on the table.',
      options: ['some', 'any'],
      correct: 'some',
      rule: 'Use "some" in positive sentences describing food that is available.'
    }
  ];
  const [someAnyIdx, setSomeAnyIdx] = useState(0);
  const [someAnySelected, setSomeAnySelected] = useState<string | null>(null);
  const [someAnyScore, setSomeAnyScore] = useState(0);
  const [someAnyCount, setSomeAnyCount] = useState(0);

  // ===========================================================================
  // 2. QUANTIFIERS (Lessons 4.2 & 4.3)
  // ===========================================================================
  const quantifierQuestions = [
    {
      sentence: 'There aren’t ____________ crisps left in this packet.',
      options: ['many', 'much'],
      correct: 'many',
      rule: 'Crisps are countable ("one crisp, two crisps"), so use "many" in negatives.'
    },
    {
      sentence: 'Can I have ____________ vegetables with my chicken?',
      options: ['a few', 'a little'],
      correct: 'a few',
      rule: '"Vegetables" is plural countable, so we use "a few".'
    },
    {
      sentence: 'There isn’t ____________ fruit – can you buy some at the supermarket?',
      options: ['much', 'many'],
      correct: 'much',
      rule: '"Fruit" is used as an uncountable noun here, so use "much" with negative isn’t.'
    },
    {
      sentence: 'We cooked ____________ pasta for everyone at the party. Nobody is hungry!',
      options: ['plenty of', 'a few'],
      correct: 'plenty of',
      rule: '"Plenty of" works with uncountable pasta and means more than enough.'
    },
    {
      sentence: 'There were some sandwiches, but ____________ sweets left at the end.',
      options: ['few', 'little'],
      correct: 'few',
      rule: '"Sweets" is countable plural, so we use "few" (not many).'
    },
    {
      sentence: 'There is only ____________ rice left in the bowl – would you like some?',
      options: ['a little', 'a few'],
      correct: 'a little',
      rule: '"Rice" is an uncountable grain, so we use "a little".'
    },
    {
      sentence: 'Did you know there are ____________ varieties of chocolate in the world?',
      options: ['a lot of', 'a little'],
      correct: 'a lot of',
      rule: 'Varieties is countable plural, so we use "a lot of".'
    }
  ];
  const [quantIdx, setQuantIdx] = useState(0);
  const [quantSelected, setQuantSelected] = useState<string | null>(null);
  const [quantScore, setQuantScore] = useState(0);
  const [quantCount, setQuantCount] = useState(0);

  // ===========================================================================
  // 3. PASSIVE PROCESS (is / are + Past Participle)
  // ===========================================================================
  const passiveQuestions = [
    {
      sentence: 'Chocolate ____________ from cacao beans grown on tropical trees.',
      options: ['is made', 'are made', 'is make', 'are making'],
      correct: 'is made',
      rule: 'Chocolate is uncountable singular -> "is made" (make -> made).'
    },
    {
      sentence: 'The cacao pods ____________ by plantation workers twice a year.',
      options: ['are harvested', 'is harvested', 'harvested', 'are harvest'],
      correct: 'are harvested',
      rule: 'Pods is plural -> "are harvested" (harvest -> harvested).'
    },
    {
      sentence: 'The cacao beans ____________ in the bright sunshine for one week.',
      options: ['are dried', 'is dried', 'are drying', 'dried'],
      correct: 'are dried',
      rule: 'Beans is plural -> "are dried" (dry -> dried).'
    },
    {
      sentence: 'In factories, the beans ____________ and crushed into a brown paste.',
      options: ['are roasted', 'is roasted', 'roast', 'are roasting'],
      correct: 'are roasted',
      rule: 'Plural beans -> "are roasted and crushed".'
    },
    {
      sentence: 'A little vanilla and sugar ____________ to make the chocolate sweet.',
      options: ['is mixed in', 'are mixed in', 'mixes', 'mixing'],
      correct: 'is mixed in',
      rule: 'Vanilla and sugar treated as an ingredient mixture -> "is mixed in".'
    },
    {
      sentence: 'Finally, the melted liquid ____________ into shiny plastic moulds.',
      options: ['is poured', 'are poured', 'poured', 'is pour'],
      correct: 'is poured',
      rule: 'Liquid is uncountable singular -> "is poured".'
    }
  ];
  const [passiveIdx, setPassiveIdx] = useState(0);
  const [passiveSelected, setPassiveSelected] = useState<string | null>(null);
  const [passiveScore, setPassiveScore] = useState(0);
  const [passiveCount, setPassiveCount] = useState(0);

  // ===========================================================================
  // 4. TIME CONNECTIVES (before, then, after that, when, finally)
  // ===========================================================================
  const connectiveQuestions = [
    {
      sentence: '____________ you start planting, clean a recycled plastic container with water.',
      options: ['Before', 'When', 'Finally', 'After'],
      correct: 'Before',
      rule: '"Before you start" introduces the very first preparation step.'
    },
    {
      sentence: 'First put cotton in the cup. ____________, add the seeds and a little water.',
      options: ['Then', 'Before', 'Until', 'Because'],
      correct: 'Then',
      rule: '"Then" indicates the immediate next action in the recipe/guide.'
    },
    {
      sentence: 'Put the seeds on the cotton. ____________, place the cup in the warm sunlight.',
      options: ['After that', 'Before', 'Since', 'Although'],
      correct: 'After that',
      rule: '"After that" smoothly links intermediate procedural steps.'
    },
    {
      sentence: '____________ there are green leaves on your cress plant, you can eat them!',
      options: ['When', 'Before', 'Finally', 'So'],
      correct: 'When',
      rule: '"When" indicates the exact condition or time when something is ready.'
    },
    {
      sentence: '____________, harvest the fresh crunchy sprouts and enjoy your healthy salad!',
      options: ['Finally', 'Before', 'When', 'While'],
      correct: 'Finally',
      rule: '"Finally" marks the concluding final step of the process.'
    }
  ];
  const [connIdx, setConnIdx] = useState(0);
  const [connSelected, setConnSelected] = useState<string | null>(null);
  const [connScore, setConnScore] = useState(0);
  const [connCount, setConnCount] = useState(0);

  // Handler for Some/Any
  const handleAnswerSomeAny = (opt: string) => {
    if (someAnySelected) return;
    setSomeAnySelected(opt);
    const q = someAnyQuestions[someAnyIdx];
    const isCorrect = opt === q.correct;
    if (isCorrect) {
      sound.playCorrect();
      setSomeAnyScore(prev => prev + 1);
    } else {
      sound.playWrong();
    }
    const newCount = someAnyCount + 1;
    setSomeAnyCount(newCount);
    const accuracy = Math.round(((isCorrect ? someAnyScore + 1 : someAnyScore) / newCount) * 100);
    onUpdateAccuracy('someAny', accuracy);
  };

  const nextSomeAny = () => {
    setSomeAnySelected(null);
    setSomeAnyIdx((someAnyIdx + 1) % someAnyQuestions.length);
    sound.playClick();
  };

  // Handler for Quantifiers
  const handleAnswerQuant = (opt: string) => {
    if (quantSelected) return;
    setQuantSelected(opt);
    const q = quantifierQuestions[quantIdx];
    const isCorrect = opt === q.correct;
    if (isCorrect) {
      sound.playCorrect();
      setQuantScore(prev => prev + 1);
    } else {
      sound.playWrong();
    }
    const newCount = quantCount + 1;
    setQuantCount(newCount);
    const accuracy = Math.round(((isCorrect ? quantScore + 1 : quantScore) / newCount) * 100);
    onUpdateAccuracy('quantifiers', accuracy);
  };

  const nextQuant = () => {
    setQuantSelected(null);
    setQuantIdx((quantIdx + 1) % quantifierQuestions.length);
    sound.playClick();
  };

  // Handler for Passive Process
  const handleAnswerPassive = (opt: string) => {
    if (passiveSelected) return;
    setPassiveSelected(opt);
    const q = passiveQuestions[passiveIdx];
    const isCorrect = opt === q.correct;
    if (isCorrect) {
      sound.playCorrect();
      setPassiveScore(prev => prev + 1);
    } else {
      sound.playWrong();
    }
    const newCount = passiveCount + 1;
    setPassiveCount(newCount);
    const accuracy = Math.round(((isCorrect ? passiveScore + 1 : passiveScore) / newCount) * 100);
    onUpdateAccuracy('passiveProcess', accuracy);
  };

  const nextPassive = () => {
    setPassiveSelected(null);
    setPassiveIdx((passiveIdx + 1) % passiveQuestions.length);
    sound.playClick();
  };

  // Handler for Connectives
  const handleAnswerConn = (opt: string) => {
    if (connSelected) return;
    setConnSelected(opt);
    const q = connectiveQuestions[connIdx];
    const isCorrect = opt === q.correct;
    if (isCorrect) {
      sound.playCorrect();
      setConnScore(prev => prev + 1);
    } else {
      sound.playWrong();
    }
    const newCount = connCount + 1;
    setConnCount(newCount);
    const accuracy = Math.round(((isCorrect ? connScore + 1 : connScore) / newCount) * 100);
    onUpdateAccuracy('connectives', accuracy);
  };

  const nextConn = () => {
    setConnSelected(null);
    setConnIdx((connIdx + 1) % connectiveQuestions.length);
    sound.playClick();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight flex items-center justify-center gap-2">
          <span>⚙️</span> Unit 4 Grammar Interactive Labs
        </h2>
        <p className="text-sm font-semibold text-slate-650 max-w-xl mx-auto">
          Interactive drills targeting the exact grammar from Cambridge Primary Grade 4 Unit 4 & the SDIT Auliya Summative Assessment.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => {
            setActiveSubTab('someAny');
            sound.playClick();
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tight border-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'someAny'
              ? 'bg-[#560e51] text-white border-[#560e51] shadow-[3px_3px_0px_0px_#78c222]'
              : 'bg-white hover:bg-fuchsia-50 text-slate-700 border-slate-300'
          }`}
        >
          1. Some & Any (4.1) 🥛
        </button>

        <button
          onClick={() => {
            setActiveSubTab('quantifiers');
            sound.playClick();
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tight border-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'quantifiers'
              ? 'bg-[#560e51] text-white border-[#560e51] shadow-[3px_3px_0px_0px_#78c222]'
              : 'bg-white hover:bg-fuchsia-50 text-slate-700 border-slate-300'
          }`}
        >
          2. Quantifiers (4.2) 📊
        </button>

        <button
          onClick={() => {
            setActiveSubTab('passiveProcess');
            sound.playClick();
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tight border-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'passiveProcess'
              ? 'bg-[#560e51] text-white border-[#560e51] shadow-[3px_3px_0px_0px_#78c222]'
              : 'bg-white hover:bg-fuchsia-50 text-slate-700 border-slate-300'
          }`}
        >
          3. Process Passive (is/are + V3) 🍫
        </button>

        <button
          onClick={() => {
            setActiveSubTab('connectives');
            sound.playClick();
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tight border-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'connectives'
              ? 'bg-[#560e51] text-white border-[#560e51] shadow-[3px_3px_0px_0px_#78c222]'
              : 'bg-white hover:bg-fuchsia-50 text-slate-700 border-slate-300'
          }`}
        >
          4. Time Connectives (4.3) 🌱
        </button>
      </div>

      {/* SUB-TAB 1: SOME AND ANY */}
      {activeSubTab === 'someAny' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Language Detective · Some and Any Rule
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Positive sentences (+) vs Negatives (-) & Questions (?)
              </h3>
            </div>
            <span className="px-3 py-1 bg-lime-100 border border-lime-500 rounded-full text-xs font-black text-emerald-950 font-mono">
              Score: {someAnyScore}/{someAnyCount}
            </span>
          </div>

          {/* Quick Rule Cheat Sheet Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
            <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-1">
              <span className="font-black text-emerald-900 uppercase block">Positive (+)</span>
              <p className="font-bold text-emerald-800">Use <strong>SOME</strong></p>
              <p className="text-[11px] text-emerald-700 italic">"There is some jam." / "There are some oranges."</p>
            </div>
            <div className="p-3 bg-rose-50 border-2 border-rose-400 rounded-2xl space-y-1">
              <span className="font-black text-rose-900 uppercase block">Negative (-)</span>
              <p className="font-bold text-rose-800">Use <strong>ANY</strong></p>
              <p className="text-[11px] text-rose-700 italic">"There isn't any soup." / "There aren't any vegetables."</p>
            </div>
            <div className="p-3 bg-purple-50 border-2 border-purple-400 rounded-2xl space-y-1">
              <span className="font-black text-purple-900 uppercase block">Questions (?)</span>
              <p className="font-bold text-purple-800">Use <strong>ANY</strong></p>
              <p className="text-[11px] text-purple-700 italic">"Is there any bread?" / "Are there any grapes?"</p>
            </div>
          </div>

          {/* Drill Question Card */}
          <div className="bg-[#fefaf0] border-3 border-[#560e51] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#560e51] space-y-4">
            <span className="text-xs font-mono font-black text-[#560e51] uppercase">
              Question {someAnyIdx + 1} of {someAnyQuestions.length}
            </span>

            <p className="text-lg sm:text-xl font-black text-slate-950 leading-relaxed">
              {someAnyQuestions[someAnyIdx].sentence}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {someAnyQuestions[someAnyIdx].options.map((opt) => {
                const isSelected = someAnySelected === opt;
                const isCorrect = opt === someAnyQuestions[someAnyIdx].correct;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerSomeAny(opt)}
                    disabled={!!someAnySelected}
                    className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-black uppercase font-mono border-3 transition-all cursor-pointer ${
                      someAnySelected
                        ? isCorrect
                          ? 'bg-[#78c222] text-[#560e51] border-[#560e51] shadow-[3px_3px_0px_0px_#560e51]'
                          : isSelected
                          ? 'bg-rose-400 text-white border-[#560e51]'
                          : 'bg-white opacity-50 border-slate-300'
                        : 'bg-white hover:bg-fuchsia-50 text-[#560e51] border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] active:translate-y-1 active:shadow-none'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {someAnySelected && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-2"
              >
                <div className={`p-4 rounded-xl border-2 text-xs font-bold ${
                  someAnySelected === someAnyQuestions[someAnyIdx].correct
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-rose-50 border-rose-500 text-rose-950'
                }`}>
                  <strong>{someAnySelected === someAnyQuestions[someAnyIdx].correct ? '🎉 Correct!' : '❌ Not quite!'}</strong>{' '}
                  {someAnyQuestions[someAnyIdx].rule}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={nextSomeAny}
                    className="px-6 py-2.5 bg-[#560e51] hover:bg-[#751b6f] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
                  >
                    Next Question →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: QUANTIFIERS */}
      {activeSubTab === 'quantifiers' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Countable vs Uncountable Quantifiers (4.2 & 4.3)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Many, Much, A Few, A Little, Plenty of
              </h3>
            </div>
            <span className="px-3 py-1 bg-lime-100 border border-lime-500 rounded-full text-xs font-black text-emerald-950 font-mono">
              Score: {quantScore}/{quantCount}
            </span>
          </div>

          {/* Drill Question Card */}
          <div className="bg-[#fefaf0] border-3 border-[#560e51] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#560e51] space-y-4">
            <span className="text-xs font-mono font-black text-[#560e51] uppercase">
              Question {quantIdx + 1} of {quantifierQuestions.length}
            </span>

            <p className="text-lg sm:text-xl font-black text-slate-950 leading-relaxed">
              {quantifierQuestions[quantIdx].sentence}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {quantifierQuestions[quantIdx].options.map((opt) => {
                const isSelected = quantSelected === opt;
                const isCorrect = opt === quantifierQuestions[quantIdx].correct;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerQuant(opt)}
                    disabled={!!quantSelected}
                    className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-black uppercase font-mono border-3 transition-all cursor-pointer ${
                      quantSelected
                        ? isCorrect
                          ? 'bg-[#78c222] text-[#560e51] border-[#560e51] shadow-[3px_3px_0px_0px_#560e51]'
                          : isSelected
                          ? 'bg-rose-400 text-white border-[#560e51]'
                          : 'bg-white opacity-50 border-slate-300'
                        : 'bg-white hover:bg-fuchsia-50 text-[#560e51] border-[#560e51] shadow-[3px_3px_0px_0px_#560e51] active:translate-y-1 active:shadow-none'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quantSelected && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-2"
              >
                <div className={`p-4 rounded-xl border-2 text-xs font-bold ${
                  quantSelected === quantifierQuestions[quantIdx].correct
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-rose-50 border-rose-500 text-rose-950'
                }`}>
                  <strong>{quantSelected === quantifierQuestions[quantIdx].correct ? '🎉 Correct!' : '❌ Incorrect!'}</strong>{' '}
                  {quantifierQuestions[quantIdx].rule}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={nextQuant}
                    className="px-6 py-2.5 bg-[#560e51] hover:bg-[#751b6f] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
                  >
                    Next Question →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROCESS PASSIVE */}
      {activeSubTab === 'passiveProcess' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Language Focus · Passive Voice for Processes (4.2)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                is / are + Past Participle (From Bean to Bar)
              </h3>
            </div>
            <span className="px-3 py-1 bg-lime-100 border border-lime-500 rounded-full text-xs font-black text-emerald-950 font-mono">
              Score: {passiveScore}/{passiveCount}
            </span>
          </div>

          {/* Drill Question Card */}
          <div className="bg-[#fefaf0] border-3 border-[#560e51] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#560e51] space-y-4">
            <span className="text-xs font-mono font-black text-[#560e51] uppercase">
              Question {passiveIdx + 1} of {passiveQuestions.length}
            </span>

            <p className="text-lg sm:text-xl font-black text-slate-950 leading-relaxed">
              {passiveQuestions[passiveIdx].sentence}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {passiveQuestions[passiveIdx].options.map((opt) => {
                const isSelected = passiveSelected === opt;
                const isCorrect = opt === passiveQuestions[passiveIdx].correct;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerPassive(opt)}
                    disabled={!!passiveSelected}
                    className={`py-3.5 px-5 rounded-2xl text-sm sm:text-base font-black font-mono border-3 transition-all cursor-pointer text-left ${
                      passiveSelected
                        ? isCorrect
                          ? 'bg-[#78c222] text-[#560e51] border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
                          : isSelected
                          ? 'bg-rose-400 text-white border-[#560e51]'
                          : 'bg-white opacity-50 border-slate-300'
                        : 'bg-white hover:bg-fuchsia-50 text-[#560e51] border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {passiveSelected && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-2"
              >
                <div className={`p-4 rounded-xl border-2 text-xs font-bold ${
                  passiveSelected === passiveQuestions[passiveIdx].correct
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-rose-50 border-rose-500 text-rose-950'
                }`}>
                  <strong>{passiveSelected === passiveQuestions[passiveIdx].correct ? '🎉 Correct!' : '❌ Review rule!'}</strong>{' '}
                  {passiveQuestions[passiveIdx].rule}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={nextPassive}
                    className="px-6 py-2.5 bg-[#560e51] hover:bg-[#751b6f] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
                  >
                    Next Process Step →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TIME CONNECTIVES */}
      {activeSubTab === 'connectives' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                Language Focus · Sequence Connectors (4.3)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase mt-0.5">
                Before, When, Then, After that, Finally
              </h3>
            </div>
            <span className="px-3 py-1 bg-lime-100 border border-lime-500 rounded-full text-xs font-black text-emerald-950 font-mono">
              Score: {connScore}/{connCount}
            </span>
          </div>

          {/* Drill Question Card */}
          <div className="bg-[#fefaf0] border-3 border-[#560e51] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#560e51] space-y-4">
            <span className="text-xs font-mono font-black text-[#560e51] uppercase">
              Question {connIdx + 1} of {connectiveQuestions.length}
            </span>

            <p className="text-lg sm:text-xl font-black text-slate-950 leading-relaxed">
              {connectiveQuestions[connIdx].sentence}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {connectiveQuestions[connIdx].options.map((opt) => {
                const isSelected = connSelected === opt;
                const isCorrect = opt === connectiveQuestions[connIdx].correct;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerConn(opt)}
                    disabled={!!connSelected}
                    className={`py-3.5 px-4 rounded-2xl text-sm sm:text-base font-black font-mono border-3 transition-all cursor-pointer ${
                      connSelected
                        ? isCorrect
                          ? 'bg-[#78c222] text-[#560e51] border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
                          : isSelected
                          ? 'bg-rose-400 text-white border-[#560e51]'
                          : 'bg-white opacity-50 border-slate-300'
                        : 'bg-white hover:bg-fuchsia-50 text-[#560e51] border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {connSelected && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-2"
              >
                <div className={`p-4 rounded-xl border-2 text-xs font-bold ${
                  connSelected === connectiveQuestions[connIdx].correct
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-rose-50 border-rose-500 text-rose-950'
                }`}>
                  <strong>{connSelected === connectiveQuestions[connIdx].correct ? '🎉 Correct!' : '❌ Check connection!'}</strong>{' '}
                  {connectiveQuestions[connIdx].rule}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={nextConn}
                    className="px-6 py-2.5 bg-[#560e51] hover:bg-[#751b6f] text-white font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#78c222] cursor-pointer"
                  >
                    Next Connector →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
