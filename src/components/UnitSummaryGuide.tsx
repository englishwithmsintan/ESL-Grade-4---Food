import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Award, Volume2, Sparkles, HelpCircle, FileText, ChevronRight, ChevronDown, Check, ShieldCheck, Heart } from 'lucide-react';
import { sound } from './SoundManager';

interface UnitSummaryGuideProps {
  onNavigateTab: (tabId: string) => void;
  genAlphaMode?: boolean;
}

export default function UnitSummaryGuide({ onNavigateTab, genAlphaMode = false }: UnitSummaryGuideProps) {
  const [activeSection, setActiveSection] = useState<'curriculum' | 'test-matrix' | 'values'>('curriculum');
  const [expandedLesson, setExpandedLesson] = useState<number | null>(1);

  const toggleLesson = (num: number) => {
    sound.playClick();
    setExpandedLesson(prev => prev === num ? null : num);
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-fuchsia-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#9b2c98] font-mono bg-[#fdf2fe] px-3.5 py-1 rounded-full border border-[#9b2c98]">
              Curriculum & Assessment Blueprint
            </span>
            <span className="text-xs font-mono font-black text-[#43780a] bg-lime-100 px-3 py-1 rounded-full border border-lime-400">
              SDIT Auliya Semester 1
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#560e51] uppercase tracking-tight mt-2 flex items-center gap-2">
            <span>Unit 4: Food — Comprehensive Study Guide 🍊</span>
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
            Aligned directly with the Cambridge Primary Global English Grade 4 Learner's Book, Activity Book, and the 50-mark Summative Assessment.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 bg-[#fdf2fe] p-1.5 rounded-2xl border-2 border-[#560e51] shrink-0 self-start md:self-auto">
          <button
            onClick={() => {
              setActiveSection('curriculum');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight cursor-pointer transition ${
              activeSection === 'curriculum'
                ? 'bg-[#560e51] text-white shadow-[2px_2px_0px_0px_#78c222]'
                : 'text-[#560e51] hover:bg-fuchsia-50'
            }`}
          >
            Curriculum Map 🗺️
          </button>
          <button
            onClick={() => {
              setActiveSection('test-matrix');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight cursor-pointer transition ${
              activeSection === 'test-matrix'
                ? 'bg-[#560e51] text-white shadow-[2px_2px_0px_0px_#78c222]'
                : 'text-[#560e51] hover:bg-fuchsia-50'
            }`}
          >
            50-Mark Exam Grid 📋
          </button>
          <button
            onClick={() => {
              setActiveSection('values');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight cursor-pointer transition ${
              activeSection === 'values'
                ? 'bg-[#560e51] text-white shadow-[2px_2px_0px_0px_#78c222]'
                : 'text-[#560e51] hover:bg-fuchsia-50'
            }`}
          >
            Values & Character 💖
          </button>
        </div>
      </div>

      {/* SECTION 1: CURRICULUM LESSON BREAKDOWN (4.1 to 4.6) */}
      {activeSection === 'curriculum' && (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-650">
            Click any lesson below to view its key vocabulary, grammar rules, learning objectives, and Cambridge Learner's Book pages:
          </p>

          {/* Lesson 4.1 */}
          <div className="border-2 border-[#560e51] rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_#560e51]">
            <button
              onClick={() => toggleLesson(1)}
              className="w-full p-4 bg-[#fefaf0] hover:bg-amber-50 flex items-center justify-between text-left cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#78c222] text-[#560e51] font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51]">
                  4.1
                </span>
                <div>
                  <h4 className="font-black text-[#560e51] text-sm uppercase">
                    Do We All Eat the Same Breakfast? (Pages 62-63)
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold">
                    Global breakfast foods, plant growth locations, and Some vs Any
                  </span>
                </div>
              </div>
              {expandedLesson === 1 ? <ChevronDown className="h-5 w-5 text-[#560e51]" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
            </button>
            {expandedLesson === 1 && (
              <div className="p-4 bg-white border-t-2 border-fuchsia-100 text-xs space-y-2 font-sans">
                <div><strong>• Vocabulary:</strong> cheese, bread, banana, orange juice, chicken, onions, mushrooms, tomatoes, egg, papaya.</div>
                <div><strong>• How Food Grows:</strong> On a tree (bananas, papayas), On a plant (tomatoes), In the ground (onions, carrots), On the ground (mushrooms, watermelons).</div>
                <div><strong>• Grammar:</strong> Some in positive statements (<em>"There is some jam"</em>), Any in negatives & questions (<em>"There isn't any soup / Is there any bread?"</em>).</div>
              </div>
            )}
          </div>

          {/* Lesson 4.2 */}
          <div className="border-2 border-[#560e51] rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_#560e51]">
            <button
              onClick={() => toggleLesson(2)}
              className="w-full p-4 bg-[#fefaf0] hover:bg-amber-50 flex items-center justify-between text-left cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#560e51] text-white font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51]">
                  4.2
                </span>
                <div>
                  <h4 className="font-black text-[#560e51] text-sm uppercase">
                    All About Chocolate! (Pages 64-65)
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold">
                    Cacao pods, Joseph Fry 1847, quantifiers & passive processes
                  </span>
                </div>
              </div>
              {expandedLesson === 2 ? <ChevronDown className="h-5 w-5 text-[#560e51]" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
            </button>
            {expandedLesson === 2 && (
              <div className="p-4 bg-white border-t-2 border-fuchsia-100 text-xs space-y-2 font-sans">
                <div><strong>• Geography & History:</strong> Cacao trees grow near the equator. Joseph Fry invented the first solid chocolate bar in 1847. Melting point of cocoa butter is 34°C (lower than body temp 37°C).</div>
                <div><strong>• Passive Process:</strong> <em>"Chocolate is made from cacao beans." / "The beans are dried in the sun."</em> (is/are + V3).</div>
                <div><strong>• Quantifiers:</strong> a lot of / plenty of (both), a few / many (countable), a little / much (uncountable).</div>
              </div>
            )}
          </div>

          {/* Lesson 4.3 */}
          <div className="border-2 border-[#560e51] rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_#560e51]">
            <button
              onClick={() => toggleLesson(3)}
              className="w-full p-4 bg-[#fefaf0] hover:bg-amber-50 flex items-center justify-between text-left cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-lime-400 text-[#560e51] font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51]">
                  4.3
                </span>
                <div>
                  <h4 className="font-black text-[#560e51] text-sm uppercase">
                    Grow Your Own! (Pages 66-67)
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold">
                    Sprouting cress and mung beans without soil using sequence connectives
                  </span>
                </div>
              </div>
              {expandedLesson === 3 ? <ChevronDown className="h-5 w-5 text-[#560e51]" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
            </button>
            {expandedLesson === 3 && (
              <div className="p-4 bg-white border-t-2 border-fuchsia-100 text-xs space-y-2 font-sans">
                <div><strong>• Sequence Connectives:</strong> <em>Before you start</em>, <em>Then</em>, <em>After that</em>, <em>When</em>, <em>Finally</em>.</div>
                <div><strong>• Steps:</strong> Clean plastic pot &rarr; Draw smiley face &rarr; Put cotton wool inside &rarr; Put seeds on cotton with water &rarr; Put outside in sun &rarr; Eat sprouts!</div>
              </div>
            )}
          </div>

          {/* Lesson 4.4 */}
          <div className="border-2 border-[#560e51] rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_#560e51]">
            <button
              onClick={() => toggleLesson(4)}
              className="w-full p-4 bg-[#fefaf0] hover:bg-amber-50 flex items-center justify-between text-left cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-400 text-white font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51]">
                  4.4
                </span>
                <div>
                  <h4 className="font-black text-[#560e51] text-sm uppercase">
                    A Fruit Poem & Sensory Adjectives (Pages 68-69)
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold">
                    5-senses adjectives, rhyming pairs, and poetry writing
                  </span>
                </div>
              </div>
              {expandedLesson === 4 ? <ChevronDown className="h-5 w-5 text-[#560e51]" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
            </button>
            {expandedLesson === 4 && (
              <div className="p-4 bg-white border-t-2 border-fuchsia-100 text-xs space-y-2 font-sans">
                <div><strong>• 5 Senses:</strong> Sight (shiny, colourful), Touch (smooth, spiky, sticky), Smell (sweet, rich), Taste (sweet, creamy, salty, bitter, juicy), Sound (crunchy, snaps).</div>
                <div><strong>• Rhymes:</strong> ground/round, sweet/treat, see/me, hands/lands.</div>
              </div>
            )}
          </div>

          {/* Lesson 4.5 */}
          <div className="border-2 border-[#560e51] rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_#560e51]">
            <button
              onClick={() => toggleLesson(5)}
              className="w-full p-4 bg-[#fefaf0] hover:bg-amber-50 flex items-center justify-between text-left cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-400 text-purple-950 font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51]">
                  4.5
                </span>
                <div>
                  <h4 className="font-black text-[#560e51] text-sm uppercase">
                    Charlie and the Chocolate Factory (Pages 70-73)
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold">
                    Roald Dahl literature, Willy Wonka, swudge, generous vs greedy
                  </span>
                </div>
              </div>
              {expandedLesson === 5 ? <ChevronDown className="h-5 w-5 text-[#560e51]" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
            </button>
            {expandedLesson === 5 && (
              <div className="p-4 bg-white border-t-2 border-fuchsia-100 text-xs space-y-2 font-sans">
                <div><strong>• Story Extracts:</strong> Charlie Bucket's poor family, the Chocolate Room with churning waterfall, Augustus Gloop's greedy fall into the river.</div>
                <div><strong>• Vocabulary:</strong> margarine, valley, froth, swudge, buttercup, cane, churn, enormous, tremendous.</div>
                <div><strong>• Moral Character:</strong> Being generous and helpful (Charlie) vs greedy and selfish (Augustus).</div>
              </div>
            )}
          </div>

          {/* Lesson 4.6 */}
          <div className="border-2 border-[#560e51] rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_#560e51]">
            <button
              onClick={() => toggleLesson(6)}
              className="w-full p-4 bg-[#fefaf0] hover:bg-amber-50 flex items-center justify-between text-left cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-cyan-400 text-cyan-950 font-mono font-black flex items-center justify-center shrink-0 border border-[#560e51]">
                  4.6
                </span>
                <div>
                  <h4 className="font-black text-[#560e51] text-sm uppercase">
                    Project Challenge & Food Origins (Pages 74-75)
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold">
                    Packaging design, origin tracing, and nutrition information
                  </span>
                </div>
              </div>
              {expandedLesson === 6 ? <ChevronDown className="h-5 w-5 text-[#560e51]" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
            </button>
            {expandedLesson === 6 && (
              <div className="p-4 bg-white border-t-2 border-fuchsia-100 text-xs space-y-2 font-sans">
                <div><strong>• Project Challenge:</strong> Draw/photograph food packaging, find where it comes from, explain the process with <em>is / are + past participle</em>.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: 50-MARK EXAM GRID */}
      {activeSection === 'test-matrix' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-300 rounded-xl overflow-hidden">
              <thead className="bg-[#560e51] text-white uppercase font-mono">
                <tr>
                  <th className="p-3">Part</th>
                  <th className="p-3">Focus Topic</th>
                  <th className="p-3">Tasks / Items</th>
                  <th className="p-3">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold font-mono">Part 1</td>
                  <td className="p-3">Listening Comprehension</td>
                  <td className="p-3">Growing mung bean sprouts (numbering steps 2-6)</td>
                  <td className="p-3 font-mono font-bold text-[#560e51]">5 Marks</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold font-mono">Part 2</td>
                  <td className="p-3">Vocabulary & Anagrams</td>
                  <td className="p-3">Picture matching (5 pts) + Sensory anagrams (5 pts)</td>
                  <td className="p-3 font-mono font-bold text-[#560e51]">10 Marks</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold font-mono">Part 3</td>
                  <td className="p-3">Grammar & Quantifiers</td>
                  <td className="p-3">Lake picnic Some/Any (5 pts) + Quantifiers (5 pts)</td>
                  <td className="p-3 font-mono font-bold text-[#560e51]">10 Marks</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold font-mono">Part 4</td>
                  <td className="p-3">Reading Comprehension</td>
                  <td className="p-3">"From Cocoa to Chocolate" text & Chocolate Poem</td>
                  <td className="p-3 font-mono font-bold text-[#560e51]">10 Marks</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold font-mono">Part 5</td>
                  <td className="p-3">Guided Writing</td>
                  <td className="p-3">80-word composition on food origins & processes</td>
                  <td className="p-3 font-mono font-bold text-[#560e51]">15 Marks</td>
                </tr>
                <tr className="bg-lime-50 font-black text-sm">
                  <td colSpan={3} className="p-3 text-right uppercase font-mono text-[#560e51]">Total Assessment Marks:</td>
                  <td className="p-3 font-mono text-emerald-800">50 Marks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: VALUES & CHARACTER */}
      {activeSection === 'values' && (
        <div className="space-y-4">
          <div className="p-5 bg-[#fefaf0] border-2 border-[#560e51] rounded-2xl space-y-3">
            <h4 className="text-base font-black uppercase text-[#560e51] flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              Moral Character & Generosity in Food
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              In Unit 4 Lesson 4.5, students learn the contrast between being <strong>generous</strong> (sharing special treats with family and helping friends) and being <strong>greedy</strong> (grabbing things just for oneself, like Augustus Gloop). In Islamic teachings (Halalan Thayyiban), eating moderate, wholesome food and sharing meals with neighbors and loved ones brings immense blessings and gratitude to Allah SWT!
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
