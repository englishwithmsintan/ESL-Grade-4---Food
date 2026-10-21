import React, { useState } from 'react';
import { FoodProjectData } from '../types';
import { sound } from './SoundManager';
import { humanVoice } from '../utils/humanVoice';
import { Award, Sparkles, Volume2, Printer, CheckCircle2, Heart, Layers, MapPin, Package, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface FoodOriginLabProps {
  initialData?: FoodProjectData;
  onSave?: (data: FoodProjectData) => void;
  genAlphaMode?: boolean;
}

const DEFAULT_FOOD_DATA: FoodProjectData = {
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

export default function DreamHomeLab({
  initialData,
  onSave,
  genAlphaMode = false
}: FoodOriginLabProps) {
  const [data, setData] = useState<FoodProjectData>(initialData || DEFAULT_FOOD_DATA);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [isSpeakingPitch, setIsSpeakingPitch] = useState(false);

  const handleSpeech = () => {
    if (isSpeakingPitch) {
      humanVoice.stop();
      setIsSpeakingPitch(false);
      return;
    }

    const pitchText = 
      `Welcome to my Lesson 4.6 Food Project: ${data.foodName}! ` +
      `This is a ${data.foodType} from ${data.originCountry}. ` +
      `It is grown ${data.growthType} in ${data.climateNeeded}. ` +
      `How is it made? ${data.processSteps.step1} ${data.processSteps.step2} ${data.processSteps.step3} ${data.processSteps.step4} ` +
      `It looks ${data.sensoryAdjectives.sight}, feels ${data.sensoryAdjectives.touch}, and tastes ${data.sensoryAdjectives.taste}! ` +
      `Why do I love it? ${data.whyILoveIt}`;

    sound.playPop();
    humanVoice.speak(pitchText, {
      rate: 0.95,
      onStart: () => setIsSpeakingPitch(true),
      onEnd: () => setIsSpeakingPitch(false)
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#78c222] text-[#560e51] font-mono font-black text-xs uppercase px-3 py-1 rounded-full border border-[#560e51]">
              Lesson 4.6 Project Challenge
            </span>
            <span className="text-xs font-mono font-bold text-[#9b2c98]">
              Project B: Find out where food comes from
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
            <span>🍊</span> Food Origin & Packaging Studio
          </h2>
          <p className="text-sm font-semibold text-slate-650 max-w-2xl leading-relaxed">
            Design your favourite food or drink packaging, explain its climate and origin, and write step-by-step manufacturing sentences using <em>is / are + past participle</em>!
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#fefaf0] p-1.5 rounded-2xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] shrink-0">
          <button
            onClick={() => {
              setActiveTab('preview');
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#560e51] text-white shadow-[1px_1px_0px_0px_#78c222]'
                : 'text-[#560e51] hover:bg-fuchsia-50'
            }`}
          >
            Packaging Preview 📦
          </button>
          <button
            onClick={() => {
              setActiveTab('editor');
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-[#560e51] text-white shadow-[1px_1px_0px_0px_#78c222]'
                : 'text-[#560e51] hover:bg-fuchsia-50'
            }`}
          >
            Edit Food Data ✏️
          </button>
        </div>
      </div>

      {/* PREVIEW VIEW: MOCK PACKAGING & PRODUCT POSTER */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          
          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSpeech}
              className="px-5 py-2.5 bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              <span>{isSpeakingPitch ? 'Stop Reading' : 'Listen to Product Pitch'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print Food Poster
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 1 Col: Simulated Carton Packaging Graphic */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-[32px] p-6 border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] flex flex-col justify-between text-center relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-[10px] font-black font-mono uppercase bg-white/80 px-2.5 py-0.5 rounded-full border border-[#560e51] text-[#560e51]">
                  100% Pure & Fresh
                </span>
                <h3 className="text-2xl font-black uppercase text-[#560e51] tracking-tight leading-tight">
                  {data.foodName}
                </h3>
                <p className="text-xs font-bold text-orange-900">{data.foodType}</p>
              </div>

              {/* Big Icon graphic */}
              <div className="my-6 text-7xl animate-bounce">
                🍊
              </div>

              {/* Nutrition Facts Table */}
              <div className="bg-white/95 p-3.5 rounded-2xl border-2 border-[#560e51] text-left text-[11px] font-mono space-y-1">
                <div className="font-black border-b border-slate-900 pb-1 text-xs">
                  Nutrition Facts (Page 75 Model)
                </div>
                <div className="flex justify-between"><span>Serving size</span><span>1 Glass (250ml)</span></div>
                <div className="flex justify-between font-bold"><span>Energy</span><span>120 kcal</span></div>
                <div className="flex justify-between"><span>Natural Sugars</span><span>18g</span></div>
                <div className="flex justify-between font-black text-emerald-700"><span>Vitamin C</span><span>100% DV</span></div>
              </div>

              <div className="pt-3">
                <span className="text-[10px] font-bold text-slate-600 block">
                  Product of {data.originCountry}
                </span>
              </div>
            </div>

            {/* Right 2 Cols: Origin & Manufacturing Details */}
            <div className="md:col-span-2 bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[6px_6px_0px_0px_#560e51] space-y-6">
              
              {/* Origin Section */}
              <div className="space-y-2 border-b-2 border-fuchsia-100 pb-4">
                <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                  1. Agricultural Origin & Growth Location
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#fefaf0] border border-[#560e51] rounded-xl">
                    <strong className="text-[#560e51] block uppercase font-mono text-[10px]">Grown Location:</strong>
                    <span className="font-bold text-slate-800">{data.growthType}</span>
                  </div>
                  <div className="p-3 bg-[#fefaf0] border border-[#560e51] rounded-xl">
                    <strong className="text-[#560e51] block uppercase font-mono text-[10px]">Climate Needed:</strong>
                    <span className="font-bold text-slate-800">{data.climateNeeded}</span>
                  </div>
                </div>
              </div>

              {/* Process Sentences (is / are + past participle) */}
              <div className="space-y-3 border-b-2 border-fuchsia-100 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                    2. Process Sentences (is / are + V3)
                  </span>
                  <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400">
                    Grammar Focus
                  </span>
                </div>
                <div className="space-y-2 text-xs font-medium">
                  <div className="p-2.5 bg-lime-50 border border-lime-400 rounded-xl">
                    <strong>Step 1:</strong> {data.processSteps.step1}
                  </div>
                  <div className="p-2.5 bg-lime-50 border border-lime-400 rounded-xl">
                    <strong>Step 2:</strong> {data.processSteps.step2}
                  </div>
                  <div className="p-2.5 bg-lime-50 border border-lime-400 rounded-xl">
                    <strong>Step 3:</strong> {data.processSteps.step3}
                  </div>
                  <div className="p-2.5 bg-lime-50 border border-lime-400 rounded-xl">
                    <strong>Step 4:</strong> {data.processSteps.step4}
                  </div>
                </div>
              </div>

              {/* Sensory Adjectives Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-black text-[#9b2c98] uppercase">
                  3. Sensory 5-Senses Profile (Lesson 4.4)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-fuchsia-50 border border-fuchsia-200 rounded-xl">
                    <span className="font-bold text-[#560e51] block text-[10px] uppercase">👀 Sight:</span>
                    <span className="font-medium text-slate-800">{data.sensoryAdjectives.sight}</span>
                  </div>
                  <div className="p-2 bg-fuchsia-50 border border-fuchsia-200 rounded-xl">
                    <span className="font-bold text-[#560e51] block text-[10px] uppercase">✋ Touch:</span>
                    <span className="font-medium text-slate-800">{data.sensoryAdjectives.touch}</span>
                  </div>
                  <div className="p-2 bg-fuchsia-50 border border-fuchsia-200 rounded-xl">
                    <span className="font-bold text-[#560e51] block text-[10px] uppercase">👃 Smell:</span>
                    <span className="font-medium text-slate-800">{data.sensoryAdjectives.smell}</span>
                  </div>
                  <div className="p-2 bg-fuchsia-50 border border-fuchsia-200 rounded-xl">
                    <span className="font-bold text-[#560e51] block text-[10px] uppercase">👅 Taste:</span>
                    <span className="font-medium text-slate-800">{data.sensoryAdjectives.taste}</span>
                  </div>
                  <div className="p-2 bg-fuchsia-50 border border-fuchsia-200 rounded-xl col-span-2 sm:col-span-1">
                    <span className="font-bold text-[#560e51] block text-[10px] uppercase">👂 Sound:</span>
                    <span className="font-medium text-slate-800">{data.sensoryAdjectives.sound}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* EDITOR VIEW */}
      {activeTab === 'editor' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#560e51] shadow-[8px_8px_0px_0px_#560e51] space-y-6">
          <h3 className="text-xl font-black uppercase text-slate-950">
            Customize Your Food Project Data
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-800">
            <div>
              <label className="block text-[#560e51] uppercase mb-1">Food Name:</label>
              <input
                type="text"
                value={data.foodName}
                onChange={(e) => setData({ ...data, foodName: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-[#560e51] font-sans"
              />
            </div>

            <div>
              <label className="block text-[#560e51] uppercase mb-1">Food Category / Type:</label>
              <input
                type="text"
                value={data.foodType}
                onChange={(e) => setData({ ...data, foodType: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-[#560e51] font-sans"
              />
            </div>

            <div>
              <label className="block text-[#560e51] uppercase mb-1">Country of Origin:</label>
              <input
                type="text"
                value={data.originCountry}
                onChange={(e) => setData({ ...data, originCountry: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-[#560e51] font-sans"
              />
            </div>

            <div>
              <label className="block text-[#560e51] uppercase mb-1">How it Grows:</label>
              <select
                value={data.growthType}
                onChange={(e) => setData({ ...data, growthType: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-[#560e51] font-sans"
              >
                <option value="On a tree">On a tree (bananas, papayas, oranges, apples)</option>
                <option value="On a plant">On a plant (tomatoes, strawberries, okra)</option>
                <option value="In the ground">In the ground / underground (carrots, onions, potatoes)</option>
                <option value="On the ground">On top of the ground (watermelons, mushrooms, cabbages)</option>
                <option value="Without soil">Without soil / on damp cotton wool (cress, mung bean sprouts)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase text-[#560e51] block font-mono">
              Manufacturing Process Sentences (is / are + past participle):
            </span>
            <input
              type="text"
              value={data.processSteps.step1}
              onChange={(e) => setData({ ...data, processSteps: { ...data.processSteps, step1: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-[#560e51] text-xs font-medium"
              placeholder="Step 1..."
            />
            <input
              type="text"
              value={data.processSteps.step2}
              onChange={(e) => setData({ ...data, processSteps: { ...data.processSteps, step2: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-[#560e51] text-xs font-medium"
              placeholder="Step 2..."
            />
            <input
              type="text"
              value={data.processSteps.step3}
              onChange={(e) => setData({ ...data, processSteps: { ...data.processSteps, step3: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-[#560e51] text-xs font-medium"
              placeholder="Step 3..."
            />
            <input
              type="text"
              value={data.processSteps.step4}
              onChange={(e) => setData({ ...data, processSteps: { ...data.processSteps, step4: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-[#560e51] text-xs font-medium"
              placeholder="Step 4..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-fuchsia-100">
            <button
              onClick={() => {
                setData(DEFAULT_FOOD_DATA);
                sound.playClick();
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs uppercase rounded-xl border border-slate-300 cursor-pointer"
            >
              Reset to Sample
            </button>
            <button
              onClick={() => {
                setActiveTab('preview');
                if (onSave) onSave(data);
                sound.playCorrect();
              }}
              className="px-6 py-2.5 bg-[#78c222] text-[#560e51] font-black text-xs uppercase rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] cursor-pointer"
            >
              Save & View Packaging →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
