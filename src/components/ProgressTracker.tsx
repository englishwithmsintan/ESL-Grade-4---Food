import React from 'react';
import { StudentProgress, ClassroomScores } from '../types';
import { sound } from './SoundManager';
import { Award, BookOpen, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { FLASHCARDS } from '../data/reviewData';
import AnimatedMasteryBar from './AnimatedMasteryBar';

interface ProgressTrackerProps {
  progress: StudentProgress;
  onResetProgress: () => void;
  isTeacherMode: boolean;
  teamScores: ClassroomScores;
  masteryPercentage: number;
}

export default function ProgressTracker({
  progress,
  onResetProgress,
  isTeacherMode,
  teamScores,
  masteryPercentage
}: ProgressTrackerProps) {
  
  const totalVocab = FLASHCARDS.length;
  const masteredVocab = progress.vocabReviewed ? progress.vocabReviewed.length : 0;
  const vocabPct = totalVocab > 0 ? Math.round((masteredVocab / totalVocab) * 100) : 0;

  // Unlocked stickers checklist for Grade 4 Unit 4: Food
  const stickers = [
    {
      id: 'badge-breakfast',
      title: 'Breakfast Explorer 🍳',
      desc: 'Mastered 4+ breakfast foods (cheese, papaya, eggs, orange juice).',
      unlocked: masteredVocab >= 4,
      badgeColor: 'bg-amber-400 text-amber-950 border-amber-600'
    },
    {
      id: 'badge-botanist',
      title: 'Botanist Chef 🌱',
      desc: 'Learned how foods grow (trees, plants, in/on the ground, cotton wool).',
      unlocked: masteredVocab >= 7,
      badgeColor: 'bg-emerald-400 text-emerald-950 border-emerald-600'
    },
    {
      id: 'badge-chocolate',
      title: 'Chocoholic Historian 🍫',
      desc: 'Mastered bean-to-bar chocolate terms & Joseph Fry\'s 1847 invention.',
      unlocked: masteredVocab >= 10,
      badgeColor: 'bg-[#560e51] text-amber-300 border-[#560e51]'
    },
    {
      id: 'badge-grammar',
      title: 'Grammar Detective 🕵️‍♂️',
      desc: 'Practiced Some/Any, Quantifiers, and Process Passives (is/are + V3).',
      unlocked: Object.keys(progress.grammarAccuracy).length > 0,
      badgeColor: 'bg-purple-400 text-purple-950 border-purple-600'
    },
    {
      id: 'badge-poetry',
      title: 'Sensory Poet 🍎',
      desc: 'Mastered 5-senses adjectives (crunchy, juicy, creamy, spiky, salty).',
      unlocked: masteredVocab >= 12,
      badgeColor: 'bg-rose-400 text-rose-950 border-rose-600'
    },
    {
      id: 'badge-charlie',
      title: 'Golden Ticket Winner 🎫',
      desc: 'Explored Roald Dahl\'s Charlie and the Chocolate Factory.',
      unlocked: progress.gamesPlayed.includes('charlie-factory') || masteredVocab >= 14,
      badgeColor: 'bg-yellow-400 text-yellow-950 border-yellow-600'
    },
    {
      id: 'badge-summative',
      title: 'SDIT Auliya Scholar 🏆',
      desc: 'Completed Unit 4 Summative Assessment (50 Marks).',
      unlocked: progress.mockExamCompleted,
      badgeColor: 'bg-[#78c222] text-[#560e51] border-[#560e51]'
    },
    {
      id: 'badge-arcade',
      title: 'Arcade Gourmet 🎮',
      desc: 'Played interactive classroom learning games.',
      unlocked: progress.gamesPlayed.length > 0,
      badgeColor: 'bg-cyan-400 text-cyan-950 border-cyan-600'
    }
  ];

  const totalBadgesEarned = stickers.filter(s => s.unlocked).length;

  return (
    <div className="w-full space-y-6">
      
      {/* Prominent Mastery Bar Card (moved from navbar for a clean, spacious look) */}
      <div className="bg-[#fefaf0] border-3 border-[#560e51] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#560e51] space-y-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-black uppercase font-mono text-[#560e51] flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#78c222]" /> Unit 4 Mastery Level
          </span>
          <span className="text-xs font-bold text-slate-500 font-mono">Real-time Score</span>
        </div>
        <AnimatedMasteryBar masteryPercentage={masteryPercentage} barWidthClass="w-full" showLabel={false} />
        <p className="text-[11px] text-slate-600 font-medium">
          Calculated across Flashcards, Grammar Drills, the 50-mark SDIT Auliya Exam, and Arcade Games.
        </p>
      </div>

      {/* Lesson Progress Breakdown */}
      <div className="space-y-4">
        {/* Unit 4 Vocab bar */}
        <div>
          <div className="flex justify-between text-xs font-black text-slate-900 mb-1">
            <span className="text-[#560e51]">UNIT 4: FOOD VOCABULARY</span>
            <span className="font-mono text-[#9b2c98]">{masteredVocab}/{totalVocab} cards ({vocabPct}%)</span>
          </div>
          <div className="h-3.5 w-full bg-fuchsia-100 border-2 border-[#560e51] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#78c222] to-[#8ae625] border-r-2 border-[#560e51] transition-all duration-700"
              style={{ width: `${vocabPct}%` }}
            />
          </div>
        </div>

        {/* Exam track log */}
        <div className="bg-[#fdf2fe] border-2 border-[#560e51] rounded-xl p-3.5 flex justify-between items-center text-xs shadow-[2px_2px_0px_0px_#560e51]">
          <div>
            <span className="font-black text-[#9b2c98] font-mono text-[10px] block uppercase leading-none">SDIT AULIYA ASSESSMENT LOG</span>
            <span className="font-bold text-[#560e51] mt-1 block leading-none">
              {progress.mockExamCompleted ? `${progress.mockExamScore} / 50 MARKS RECORDED` : 'SUMMATIVE EXAM PENDING'}
            </span>
          </div>
          {progress.mockExamCompleted ? (
            <span className="bg-[#78c222] text-[#560e51] px-2.5 py-1 font-mono font-black border-2 border-[#560e51] rounded text-[10px] uppercase shadow-[1px_1px_0px_0px_#560e51]">
              {Math.round((progress.mockExamScore! / 50) * 100)}% SCORE
            </span>
          ) : (
            <span className="bg-amber-200 text-[#560e51] px-2 py-0.5 font-mono font-black border-2 border-[#560e51] rounded text-[10px]">NOT TAKEN</span>
          )}
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="border-t-2 border-fuchsia-100 pt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black tracking-widest text-[#560e51] uppercase font-mono">
            FOOD MASTERY BADGES ({totalBadgesEarned}/{stickers.length})
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {stickers.map(stamp => {
            return (
              <div 
                key={stamp.id}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all ${
                  stamp.unlocked
                    ? 'bg-[#fefaf0] border-[#560e51] text-slate-900 shadow-[2px_2px_0px_0px_#560e51]'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg border-2 ${stamp.unlocked ? `${stamp.badgeColor} shadow-[1px_1px_0px_0px_#560e51]` : 'bg-slate-200 border-slate-300 text-slate-400'} flex items-center justify-center shrink-0`}>
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black tracking-tight leading-none ${stamp.unlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stamp.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-1 leading-tight font-medium">
                    {stamp.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset progress */}
      <div className="border-t-2 border-fuchsia-100 pt-3 flex justify-end">
        <button
          id="btn-wipe-analytics"
          onClick={() => {
            if (confirm('Are you sure you want to reset your Unit 4 vocabulary progress and assessment records?')) {
              onResetProgress();
              sound.playWrong();
            }
          }}
          className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 text-[10px] font-black uppercase font-mono tracking-tight cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" /> Reset Student Log
        </button>
      </div>

    </div>
  );
}
