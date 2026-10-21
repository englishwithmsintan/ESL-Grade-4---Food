import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  Award, 
  Bookmark, 
  Heart,
  Quote,
  Eye
} from 'lucide-react';
import { STORIES } from '../data/reviewData';
import { sound } from './SoundManager';
import { humanVoice, isAbortError } from '../utils/humanVoice';
import { motion, AnimatePresence } from 'motion/react';

interface LiteratureStudyProps {
  onNavigateTab?: (tabId: string) => void;
  genAlphaMode?: boolean;
}

export default function LiteratureStudy({ onNavigateTab, genAlphaMode = false }: LiteratureStudyProps) {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [selectedGlossaryWord, setSelectedGlossaryWord] = useState<string | null>(null);

  const currentStory = STORIES[activeStoryIndex] || STORIES[0];

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      humanVoice.stop();
      setIsPlayingAudio(false);
      sound.playClick();
      return;
    }

    sound.playClick();
    humanVoice.speak(currentStory.content, {
      rate: audioSpeed,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleStopAudio = () => {
    humanVoice.stop();
    setIsPlayingAudio(false);
    sound.playClick();
  };

  useEffect(() => {
    return () => {
      humanVoice.stop();
    };
  }, [activeStoryIndex]);

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
    sound.playClick();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Title & Header Banner */}
      <div className="bg-gradient-to-r from-[#560e51] via-[#751b6f] to-[#560e51] text-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#78c222] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#78c222] text-[#560e51] text-xs font-black uppercase font-mono px-3 py-1 rounded-full border border-white/20">
                Lesson 4.5 Literature Study
              </span>
              <span className="bg-white/20 text-white text-xs font-bold font-mono px-3 py-1 rounded-full">
                By Roald Dahl
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>🍫</span> Charlie and the Chocolate Factory
            </h2>
            <p className="text-sm font-semibold text-fuchsia-100 max-w-2xl leading-relaxed">
              Explore the magical extracts from Roald Dahl's classic masterpiece: Willy Wonka's enormous factory, the churning chocolate waterfall, edible "swudge" grass, and Augustus Gloop's greedy accident!
            </p>
          </div>

          {/* Audio Controls Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border-2 border-white/20 flex flex-col items-center gap-3 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest font-mono text-[#78c222]">
              Narrator Voice
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudio}
                className="px-4 py-2.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-white shadow-[2px_2px_0px_0px_#560e51] cursor-pointer flex items-center gap-2 transition-all active:scale-95"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" /> Listen to Extract
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white font-mono">
              <span>Speed:</span>
              {[0.8, 1.0, 1.2].map(speed => (
                <button
                  key={speed}
                  onClick={() => {
                    setAudioSpeed(speed);
                    sound.playClick();
                  }}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    audioSpeed === speed ? 'bg-white text-[#560e51] font-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Story Extract Selector Tabs */}
      <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
        {STORIES.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => {
              setActiveStoryIndex(idx);
              setRevealedAnswers({});
              setSelectedGlossaryWord(null);
              if (isPlayingAudio) humanVoice.stop();
              setIsPlayingAudio(false);
              sound.playClick();
            }}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tight whitespace-nowrap border-3 transition-all cursor-pointer flex items-center gap-2 ${
              activeStoryIndex === idx
                ? 'bg-[#560e51] text-white border-[#560e51] shadow-[4px_4px_0px_0px_#78c222]'
                : 'bg-white hover:bg-fuchsia-50 text-slate-700 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${activeStoryIndex === idx ? 'text-[#78c222]' : 'text-[#9b2c98]'}`} />
            <span>Extract {idx + 1}: {story.title}</span>
          </button>
        ))}
      </div>

      {/* Main Reading View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Story Text */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-6">
          <div className="border-b-2 border-fuchsia-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                {currentStory.audioTitle}
              </span>
              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight mt-0.5">
                {currentStory.title}
              </h3>
            </div>
            <span className="text-2xl">📖</span>
          </div>

          {/* Story Paragraphs */}
          <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-serif">
            {currentStory.content.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed first-letter:text-2xl first-letter:font-black first-letter:text-[#560e51]">
                {para}
              </p>
            ))}
          </div>

          {/* Moral Values Card: Generous vs Greedy */}
          <div className="bg-[#fefaf0] border-2 border-[#560e51] rounded-2xl p-5 shadow-[3px_3px_0px_0px_#560e51] space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              <h4 className="text-sm font-black uppercase text-[#560e51] tracking-wide font-sans">
                Character Values: Generous vs Greedy (Activity 6 & 9)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 bg-emerald-50 border border-emerald-400 rounded-xl space-y-1">
                <span className="font-black text-emerald-900 uppercase block">Positive Traits (Charlie) 🌟</span>
                <p className="text-emerald-800">
                  <strong>Generous, helpful, kind:</strong> Charlie loves his family, shares his birthday chocolate bar with his grandparents, and thinks of others first.
                </p>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-400 rounded-xl space-y-1">
                <span className="font-black text-rose-900 uppercase block">Negative Traits (Augustus) ⚠️</span>
                <p className="text-rose-800">
                  <strong>Greedy, selfish, mean:</strong> Augustus only thinks of his stomach, refuses to share, ignores Mr Wonka, and contaminates the chocolate river.
                </p>
              </div>
            </div>
          </div>

          {/* Comprehension Questions */}
          <div className="space-y-4 border-t-2 border-fuchsia-100 pt-5 font-sans">
            <h4 className="text-base font-black uppercase text-slate-950 flex items-center gap-2">
              <span>❓</span> Check Your Understanding
            </h4>
            <div className="space-y-3">
              {currentStory.comprehension.map((q, idx) => {
                const isRevealed = revealedAnswers[idx];
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-[#fdf2fe] border-2 border-[#560e51] space-y-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      <strong>Q{idx + 1}:</strong> {q.question}
                    </p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => toggleAnswer(idx)}
                        className="text-xs font-black uppercase tracking-tight text-[#9b2c98] hover:text-[#560e51] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isRevealed ? 'Hide Answer' : 'Reveal Answer Key'}</span>
                      </button>
                    </div>
                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white p-3 rounded-xl border border-[#78c222] text-xs font-bold text-emerald-950"
                      >
                        <strong className="text-[#560e51]">Answer: </strong>
                        {q.answer}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: Story Glossary & Wonka Vocabulary */}
        <div className="space-y-6">
          <div className="bg-[#fefaf0] rounded-[32px] p-6 border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-4">
            <div className="border-b-2 border-[#560e51]/20 pb-2 flex items-center justify-between">
              <h4 className="text-sm font-black uppercase font-mono text-[#560e51] flex items-center gap-1.5">
                <span>📚</span> Wonka Glossary
              </h4>
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                {currentStory.glossary.length} key words
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-700">
              Click any word below to hear pronunciation and explore its definition:
            </p>

            <div className="space-y-2.5">
              {currentStory.glossary.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedGlossaryWord(item.word);
                    sound.playPop();
                    humanVoice.speak(item.word);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedGlossaryWord === item.word
                      ? 'bg-[#78c222] border-[#560e51] text-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
                      : 'bg-white hover:bg-fuchsia-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase font-mono tracking-wide">
                      {item.word}
                    </span>
                    <Volume2 className="h-3.5 w-3.5 opacity-60" />
                  </div>
                  <p className="text-[11px] font-medium text-slate-700 mt-1 leading-snug">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz Card */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#560e51] shadow-[4px_4px_0px_0px_#560e51] space-y-3">
            <span className="text-xs font-black uppercase font-mono text-[#9b2c98] block">
              💡 Cambridge Word Study (Activity 4)
            </span>
            <p className="text-xs text-slate-700 font-bold">
              Find words in the box that mean:
            </p>
            <div className="bg-fuchsia-50 p-3 rounded-xl border border-fuchsia-200 text-xs space-y-1.5 font-bold">
              <div>• <em>very surprising:</em> <span className="font-black text-[#560e51]">amazing / astonishing</span></div>
              <div>• <em>very big:</em> <span className="font-black text-[#560e51]">enormous / tremendous</span></div>
              <div>• <em>moving in a smooth way:</em> <span className="font-black text-[#560e51]">graceful</span></div>
              <div>• <em>sweet minty edible grass:</em> <span className="font-black text-[#560e51]">swudge</span></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
