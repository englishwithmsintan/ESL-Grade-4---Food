import React, { useState } from 'react';
import { FLASHCARDS } from '../data/reviewData';
import { Flashcard, FlashcardCategory } from '../types';
import { sound } from './SoundManager';
import { humanVoice } from '../utils/humanVoice';
import { ChevronLeft, ChevronRight, RefreshCw, CheckCircle2, Circle, Eye, BookOpen, Layers, Volume2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ALPHAZ_FOOD_LINGO: { [word: string]: { slang: string, desc: string, eg: string } } = {
  'Cheese': {
    slang: 'Gourmet Calcium Curd 🧀',
    desc: 'Savory dairy delicacy sliced onto breakfast toast with olives and tea.',
    eg: 'Breakfast with warm Turkish cheese gives you infinite energy aura!'
  },
  'Papaya': {
    slang: 'Tropical Tree Gem 🌴',
    desc: 'Sweet orange melon-like fruit growing high in tropical trees near the equator.',
    eg: 'That ripe papaya is dripping with sweet natural tropical juice.'
  },
  'Mushroom': {
    slang: 'Forest Canopy Fungi 🍄',
    desc: 'Grows on the forest floor without soil or sunlight like an underground mystery.',
    eg: 'Mushrooms grow on top of the damp ground overnight.'
  },
  'Onion': {
    slang: 'Underground Flavor Root 🧅',
    desc: 'Grows hidden deep under the soil, brings savory depth to omelettes.',
    eg: 'Onions grow in the ground and pack savory flavor.'
  },
  'Watermelon': {
    slang: 'Hydration Giant Melon 🍉',
    desc: 'Massive vine fruit lying on top of the ground with 92% pure refreshing water.',
    eg: 'Cold watermelon on a picnic hits with +1000 summer freshness.'
  },
  'Cacao beans': {
    slang: 'Food of the Gods Beans 🍫',
    desc: 'Magical beans inside tree pods harvested to create chocolate worldwide.',
    eg: 'From bean to bar, cacao beans are roasted and crushed into liquid gold.'
  },
  'Joseph Fry': {
    slang: 'The 1847 Chocolate Pioneer 🎩',
    desc: 'The legendary British creator who invented the first solid eating chocolate bar.',
    eg: 'Joseph Fry revolutionized desserts forever back in 1847!'
  },
  'Cocoa butter': {
    slang: 'Silk-Melt Melting Point 🧈',
    desc: 'Natural cacao fat that melts at 34°C, lower than human body temperature!',
    eg: 'Cocoa butter melts instantly on your tongue because of your 37°C body heat.'
  },
  'Crunchy': {
    slang: 'Crispy ASMR Soundwave 🔊',
    desc: 'The crisp, satisfying audio crackle when you bite into fresh apples or toast.',
    eg: 'That golden toasted bread is certified crunchy.'
  },
  'Juicy': {
    slang: 'Bursting Sweet Nectar 🍊',
    desc: 'Packed with succulent liquid that bursts into delicious flavor.',
    eg: 'Biting an orange releases a tidal wave of juicy sweetness.'
  },
  'Swudge': {
    slang: 'Edible Minty Sugar Lawn 🌱',
    desc: 'Willy Wonka’s edible soft grass made of sweet minty sugar.',
    eg: 'Willy Wonka made a whole meadow out of swudge!'
  },
  'Augustus Gloop': {
    slang: 'The Greedy River Fiend 🏊',
    desc: 'The boy who ignored Mr Wonka and fell straight into the chocolate waterfall river.',
    eg: 'Bro tried to drink the whole river and got sucked up into the glass pipes.'
  },
  'Generous': {
    slang: 'Pure Heart Sharing Aura 💖',
    desc: 'Happily sharing food and treats with your friends and family.',
    eg: 'Being generous to others gives you max good karma and warmth.'
  }
};

interface FlashcardModuleProps {
  progress: { vocabReviewed: string[] };
  onMarkReviewed: (id: string, mastered: boolean) => void;
  isTeacherMode: boolean;
  genAlphaMode?: boolean;
  forceCategory?: FlashcardCategory;
}

export default function FlashcardModule({
  progress,
  onMarkReviewed,
  isTeacherMode,
  genAlphaMode = false,
  forceCategory
}: FlashcardModuleProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(forceCategory || 'all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter cards
  const filteredCards = FLASHCARDS.filter(card => {
    return selectedCategory === 'all' || card.category === selectedCategory;
  });

  const activeCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleNext = () => {
    sound.playClick();
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    sound.playClick();
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1); // Loop to end
    }
  };

  const handleFlip = () => {
    sound.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleSpeech = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playPop();
    humanVoice.speak(text, { rate: 0.9 });
  };

  const categories = [
    { id: 'all', label: 'All Unit 4 Cards 🍳' },
    { id: 'breakfast-foods', label: 'Breakfast Foods (4.1) 🥐' },
    { id: 'how-food-grows', label: 'How Food Grows (4.1) 🌱' },
    { id: 'chocolate-process', label: 'Chocolate Process (4.2) 🍫' },
    { id: 'quantifiers-food', label: 'Quantifiers (4.2 & 4.3) 📊' },
    { id: 'gardening-plants', label: 'Grow Your Own (4.3) 🌿' },
    { id: 'sensory-adjectives', label: 'Sensory Adjectives (4.4) 🍎' },
    { id: 'charlie-chocolate', label: 'Charlie & Factory (4.5) 🎫' }
  ];

  const getCategoryThemeClass = (cat: string) => {
    switch (cat) {
      case 'breakfast-foods': return 'bg-amber-100 text-amber-800 border-amber-400';
      case 'how-food-grows': return 'bg-emerald-100 text-emerald-800 border-emerald-400';
      case 'chocolate-process': return 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-400';
      case 'quantifiers-food': return 'bg-cyan-100 text-cyan-800 border-cyan-400';
      case 'gardening-plants': return 'bg-lime-100 text-lime-800 border-lime-400';
      case 'sensory-adjectives': return 'bg-rose-100 text-rose-800 border-rose-400';
      case 'charlie-chocolate': return 'bg-purple-100 text-purple-800 border-purple-400';
      default: return 'bg-slate-100 text-slate-700 border-slate-400';
    }
  };

  const isCurrentMastered = activeCard 
    ? progress.vocabReviewed.includes(activeCard.id)
    : false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      
      {/* Intro section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-950 flex items-center justify-center gap-2 uppercase tracking-tight">
          <span>🍳</span> Unit 4: Food Vocabulary & Concept Deck
        </h2>
        <p className="text-sm font-semibold text-slate-650 mt-1">
          Master breakfast foods, how plants grow, chocolate making from bean to bar, sensory words, and Charlie & the Chocolate Factory!
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-[28px] p-5 shadow-[4px_4px_0px_0px_#560e51] border-3 border-[#560e51] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-fuchsia-100 pb-3 mb-3 gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#9b2c98] flex items-center gap-1.5 font-mono">
            <Layers className="h-4 w-4 text-[#9b2c98]" /> Lesson Categories
          </span>
          <span className="text-xs font-bold font-mono text-[#560e51]">
            {filteredCards.length} Words in Selected Deck
          </span>
        </div>

        {/* Category Scroll Filter */}
        <div className="flex space-x-2 overflow-x-auto py-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
                setIsFlipped(false);
                sound.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-tight uppercase whitespace-nowrap border-2 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#560e51] text-white border-[#560e51] shadow-[2px_2px_0px_0px_#78c222]'
                  : 'bg-[#fefaf0] hover:bg-fuchsia-50 text-slate-700 border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Card Viewer */}
      {activeCard ? (
        <div className="space-y-6">
          
          {/* 3D Flip Card Container */}
          <div 
            onClick={handleFlip}
            className="w-full min-h-[380px] sm:min-h-[420px] bg-white rounded-[32px] border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] p-6 sm:p-8 flex flex-col justify-between cursor-pointer relative overflow-hidden transition-all hover:translate-y-[-2px]"
          >
            {/* Top Card Bar */}
            <div className="flex justify-between items-center border-b-2 border-fuchsia-100 pb-3">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wide border font-mono ${getCategoryThemeClass(activeCard.category)}`}>
                Lesson {activeCard.lesson} · {activeCard.category.replace('-', ' ')}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkReviewed(activeCard.id, !isCurrentMastered);
                    if (!isCurrentMastered) sound.playCorrect();
                    else sound.playClick();
                  }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    isCurrentMastered
                      ? 'bg-[#78c222] text-[#560e51] border-[#560e51] shadow-[1px_1px_0px_0px_#560e51]'
                      : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isCurrentMastered ? 'Mastered!' : 'Mark Mastered'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSpeech(activeCard.word, e)}
                  title="Pronounce word"
                  className="p-2 bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] border-2 border-[#560e51] rounded-xl shadow-[1px_1px_0px_0px_#560e51] cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Content: Front vs Back */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                // FRONT SIDE: ENGLISH WORD & PRONUNCIATION
                <div className="text-center space-y-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#9b2c98] font-mono">
                    English Term (Click to Flip)
                  </span>
                  
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                    {activeCard.word}
                  </h3>

                  {genAlphaMode && ALPHAZ_FOOD_LINGO[activeCard.word] && (
                    <div className="mt-4 p-3 bg-fuchsia-50 border-2 border-[#9b2c98] rounded-xl inline-block max-w-lg">
                      <span className="text-xs font-black text-[#560e51] block uppercase font-mono">
                        ⚡ Food Aura: {ALPHAZ_FOOD_LINGO[activeCard.word].slang}
                      </span>
                      <p className="text-xs text-slate-700 font-bold mt-0.5">
                        {ALPHAZ_FOOD_LINGO[activeCard.word].desc}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                      <Eye className="h-3.5 w-3.5" /> Tap card or press space to see Indonesian translation & example
                    </span>
                  </div>
                </div>
              ) : (
                // BACK SIDE: INDONESIAN TRANSLATION & EXAMPLE
                <div className="space-y-4 text-left">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#9b2c98] font-mono block">
                      Indonesian Translation
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black text-[#560e51] mt-0.5">
                      {activeCard.translation}
                    </h4>
                  </div>

                  <div className="bg-[#fefaf0] p-4 rounded-2xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-[#9b2c98] font-mono">
                        Sentence Example in Context
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleSpeech(activeCard.example, e)}
                        className="text-xs text-[#560e51] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="h-3 w-3" /> Read aloud
                      </button>
                    </div>
                    <p className="text-sm font-bold text-slate-800 italic">
                      "{activeCard.example}"
                    </p>
                  </div>

                  {activeCard.funFact && (
                    <div className="bg-lime-50 p-3 rounded-xl border border-lime-500 text-xs font-medium text-emerald-950 flex items-start gap-2">
                      <span className="text-base shrink-0">💡</span>
                      <div>
                        <strong className="font-black text-emerald-900">Food Fact: </strong>
                        <span>{activeCard.funFact}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between border-t-2 border-fuchsia-100 pt-4">
              <span className="text-xs font-mono font-black text-slate-500">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="px-5 py-2 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer flex items-center gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Nav thumbnail dots */}
          <div className="flex justify-center flex-wrap gap-1.5 pt-2">
            {filteredCards.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentIndex(i);
                  setIsFlipped(false);
                  sound.playClick();
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  i === currentIndex
                    ? 'w-8 bg-[#560e51]'
                    : progress.vocabReviewed.includes(c.id)
                    ? 'w-2.5 bg-[#78c222]'
                    : 'w-2.5 bg-slate-300'
                }`}
                title={`${i + 1}. ${c.word}`}
              />
            ))}
          </div>

        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8">
          <p className="text-slate-500 font-bold">No cards found in this category.</p>
        </div>
      )}

    </div>
  );
}
