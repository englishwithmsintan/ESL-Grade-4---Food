import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Play, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Award, 
  Maximize2, 
  Minimize2, 
  Menu, 
  X,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { sound } from './SoundManager';

interface HeaderProps {
  isTeacherMode: boolean;
  setIsTeacherMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  masteryPercentage?: number;
  genAlphaMode: boolean;
  setGenAlphaMode: (val: boolean) => void;
  isHeaderCollapsed: boolean;
  setIsHeaderCollapsed: (val: boolean) => void;
}

export default function Header({
  isTeacherMode,
  setIsTeacherMode,
  soundEnabled,
  setSoundEnabled,
  activeTab,
  setActiveTab,
  masteryPercentage,
  genAlphaMode,
  setGenAlphaMode,
  isHeaderCollapsed,
  setIsHeaderCollapsed
}: HeaderProps) {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    sound.enabled = newVal;
    sound.playClick();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard 🏠', icon: GraduationCap },
    { id: 'flashcards', label: 'Food Vocab 🍳', icon: BookOpen },
    { id: 'grammar', label: 'Grammar Labs ⚙️', icon: CheckCircle },
    { id: 'literature', label: 'Charlie & Factory 🍫', icon: Bookmark },
    { id: 'food-origin', label: 'Food Origin Lab 🍊', icon: Award },
    ...(isTeacherMode ? [{ id: 'spelling-bee', label: 'Spelling Bee 🐝', icon: Sparkles }] : []),
    { id: 'arcade', label: 'Classroom Games 🎮', icon: Play },
    { id: 'mock-sat', label: 'Unit 4 Exam 📝', icon: Award }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    sound.playClick();
  };

  return (
    <header className="bg-white text-slate-900 border-b-4 border-[#560e51] sticky top-0 z-50 shadow-[0_4px_0_0_#560e51]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP BRANDING BAR */}
        <div className={`flex items-center justify-between py-3.5 md:py-4.5 ${isHeaderCollapsed ? 'lg:hidden' : 'border-b-2 border-fuchsia-200'}`}>
          <div className="flex items-center space-x-3.5">
            <div className="bg-[#9b2c98] text-white p-3 rounded-2xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-[#78c222] animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#9b2c98] block leading-none font-mono">Unit 4 ESL Grade 4 · Food (SDIT Auliya Semester 1)</span>
              <h1 className="text-lg md:text-2xl font-black font-sans tracking-tight text-slate-950 uppercase flex items-center gap-2 mt-1">
                <span>English Review Terminal</span>
                <span className="hidden sm:inline-block bg-[#78c222] text-[#560e51] text-xs font-black tracking-widest px-3 py-0.5 rounded-full border-2 border-[#560e51] shadow-[1.5px_1.5px_0px_0px_#560e51]">Unit 4: Food</span>
              </h1>
            </div>
          </div>

          {/* Right Action Widgets for Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Mode Switcher */}
            <div className="bg-[#fdf2fe] p-1 rounded-xl border-2 border-[#560e51] flex items-center shadow-[2px_2px_0px_0px_#560e51]">
              <button
                id="btn-student-mode-desktop"
                onClick={() => {
                  setIsTeacherMode(false);
                  sound.playClick();
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${
                  !isTeacherMode
                    ? 'bg-[#78c222] text-[#560e51] border-2 border-[#560e51] shadow-[1px_1px_0px_0px_#560e51]'
                    : 'text-[#9b2c98] hover:text-[#560e51] border-2 border-transparent'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Student</span>
              </button>
              
              <button
                id="btn-teacher-mode-desktop"
                onClick={() => {
                  setIsTeacherMode(true);
                  sound.playClick();
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${
                  isTeacherMode
                    ? 'bg-[#9b2c98] text-white border-2 border-[#560e51] shadow-[1px_1px_0px_0px_#560e51]'
                    : 'text-[#9b2c98] hover:text-[#560e51] border-2 border-transparent'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Teacher</span>
              </button>
            </div>

            {/* Aura Mode Switch */}
            <button
              id="btn-alpha-mode-desktop"
              onClick={() => {
                const newValue = !genAlphaMode;
                setGenAlphaMode(newValue);
                if (newValue) {
                  sound.playCorrect();
                } else {
                  sound.playClick();
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] active:translate-y-[1px] active:shadow-none ${
                genAlphaMode
                  ? 'bg-fuchsia-200 text-[#560e51] font-black animate-pulse'
                  : 'bg-white hover:bg-fuchsia-50 text-[#560e51]'
              }`}
            >
              <span>🧠⚡ Aura</span>
              <span className={`text-[10px] px-1 rounded border border-[#560e51] font-black ${genAlphaMode ? 'bg-white text-[#560e51]' : 'bg-fuchsia-100 text-[#9b2c98]'}`}>
                {genAlphaMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Sound Toggler */}
            <button
              id="btn-sound-toggle-desktop"
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] transition-all cursor-pointer active:translate-y-[1px] active:shadow-none ${
                soundEnabled
                  ? 'bg-[#78c222] hover:bg-[#68ab1c] text-[#560e51]'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
              }`}
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-[#560e51]" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
            </button>
          </div>

          {/* Mobile Controller Triggers */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border-2 border-[#560e51] shadow-[1px_1px_0px_0px_#560e51] transition-all cursor-pointer shrink-0 ${
                soundEnabled ? 'bg-[#78c222] text-[#560e51]' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={() => {
                setIsHeaderCollapsed(!isHeaderCollapsed);
                sound.playClick();
              }}
              className={`p-2 rounded-xl border-2 border-[#560e51] shadow-[1px_1px_0px_0px_#560e51] transition-all cursor-pointer shrink-0 ${
                isHeaderCollapsed ? 'bg-fuchsia-200 text-[#560e51]' : 'bg-[#560e51] text-white'
              }`}
              title="Compact View"
            >
              {isHeaderCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>

            <button
              id="btn-mobile-menu-toggle"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                sound.playClick();
              }}
              className="p-2 rounded-xl border-2 border-[#560e51] bg-fuchsia-100 hover:bg-fuchsia-200 text-[#560e51] shadow-[2px_2px_0px_0px_#560e51] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 stroke-[2.5]" />
              ) : (
                <Menu className="h-5 w-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP TABS BAR */}
        {!isHeaderCollapsed && (
          <div className="hidden lg:block py-2.5">
            <div className="flex items-center justify-between">
              <nav className="flex space-x-3 overflow-x-auto no-scrollbar py-1" aria-label="Tabs">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  let tabBg = 'bg-white border-2 border-[#560e51] text-[#560e51] font-bold shadow-[2px_2px_0px_0px_#560e51] hover:bg-fuchsia-50 hover:translate-y-[-1px]';
                  if (isActive) {
                    tabBg = 'bg-[#9b2c98] text-white font-black border-2 border-[#560e51] shadow-[3px_3px_0px_0px_#78c222] translate-y-[-1px]';
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-tight transition-all duration-150 whitespace-nowrap cursor-pointer ${tabBg}`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => {
                  setIsHeaderCollapsed(!isHeaderCollapsed);
                  sound.playClick();
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-[#560e51] bg-[#560e51] text-[#78c222] shadow-[2px_2px_0px_0px_#560e51] active:translate-y-[1px] active:shadow-none shrink-0"
              >
                <Minimize2 className="h-4 w-4 shrink-0" />
                <span>FOCUS 📺</span>
              </button>
            </div>
          </div>
        )}

        {/* MOBILE NAVIGATION DROPDOWN DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[#560e51] py-4 pb-5 space-y-4 animate-fade-in select-none">
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-[#9b2c98] font-mono pl-1.5">Navigation Menu</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  let tabBg = 'bg-white border-2 border-[#560e51] text-[#560e51] font-extrabold hover:bg-fuchsia-50 shadow-[2px_2px_0px_0px_#560e51]';
                  if (isActive) {
                    tabBg = 'bg-[#9b2c98] text-white border-2 border-[#560e51] font-black shadow-[2px_2px_0px_0px_#78c222]';
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-tight transition-all cursor-pointer w-full text-left ${tabBg}`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-dashed border-fuchsia-300 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-[#9b2c98] font-mono pl-1.5">Classroom & Sync</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-fuchsia-100 p-1.5 rounded-xl border-2 border-[#560e51] flex items-center justify-between flex-1 shadow-[2px_2px_0px_0px_#560e51]">
                  <span className="text-xs uppercase font-mono font-black text-[#560e51] pl-2">Role:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setIsTeacherMode(false);
                        sound.playClick();
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                        !isTeacherMode ? 'bg-[#78c222] text-[#560e51] border border-[#560e51]' : 'text-[#9b2c98]'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      onClick={() => {
                        setIsTeacherMode(true);
                        sound.playClick();
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                        isTeacherMode ? 'bg-[#9b2c98] text-white border border-[#560e51]' : 'text-[#9b2c98]'
                      }`}
                    >
                      Teacher
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const newValue = !genAlphaMode;
                    setGenAlphaMode(newValue);
                    if (newValue) { sound.playCorrect(); } else { sound.playClick(); }
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all border-2 border-[#560e51] shadow-[2px_2px_0px_0px_#560e51] flex-1 ${
                    genAlphaMode ? 'bg-fuchsia-300 text-[#560e51] animate-pulse' : 'bg-white text-[#560e51]'
                  }`}
                >
                  <span>🧠⚡ Toggle Aura Mode</span>
                  <span className="text-xs bg-white px-2 py-0.5 rounded border border-[#560e51] font-black">{genAlphaMode ? "ON" : "OFF"}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </header>
  );
}
