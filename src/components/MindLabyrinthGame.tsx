import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  Compass, 
  Heart, 
  Lock, 
  ChevronRight, 
  Users, 
  ArrowLeft, 
  Volume2, 
  VolumeX,
  List,
  Award, 
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';

import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charBojunImg from '../assets/images/characters/char_bojun.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from '../assets/images/characters/char_xiaoping.jpg';

interface MindLabyrinthGameProps {
  currentStudent?: any;
  onSaveQuest?: (studentId: string, questType: string, data: any) => void;
  onClose?: () => void;
}

export default function MindLabyrinthGame({
  currentStudent,
  onSaveQuest,
  onClose
}: MindLabyrinthGameProps) {
  // Game Flow State
  const [gameState, setGameState] = useState<'lobby' | 'playing'>('lobby');
  const [activeInfoTab, setActiveInfoTab] = useState<'story' | 'gameplay' | 'values' | null>(null);

  // Chapter Progression State
  const [currentChapter, setCurrentChapter] = useState<number>(0); // 0: Prologue, 1: Chap 1, 2: Chap 2, 3: Chap 3, 4: Chap 4
  const [unlockedChapterMax, setUnlockedChapterMax] = useState<number>(0);

  // Gameplay choices state
  const [chosenPersonalityTrait, setChosenPersonalityTrait] = useState<string | null>(null);
  const [empathyScore, setEmpathyScore] = useState<number>(85);
  const [courageChoice, setCourageChoice] = useState<string | null>(null);
  const [lifePledgeText, setLifePledgeText] = useState<string>('用同理心看待身邊每個人，勇於追尋自己熱愛的使命！');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Chapter Choices
  const [chap1Choice, setChap1Choice] = useState<number | null>(null);
  const [chap2Choice, setChap2Choice] = useState<number | null>(null);
  const [chap3Choice, setChap3Choice] = useState<number | null>(null);

  // Modals
  const [showRolesModal, setShowRolesModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showChapterModal, setShowChapterModal] = useState<boolean>(false);

  // Handle Completing a Chapter
  const handleChapterComplete = (completedChapterIndex: number) => {
    if (completedChapterIndex + 1 > unlockedChapterMax) {
      setUnlockedChapterMax(completedChapterIndex + 1);
    }
    if (completedChapterIndex < 4) {
      setCurrentChapter(completedChapterIndex + 1);
    } else {
      if (currentStudent?.studentId && onSaveQuest) {
        onSaveQuest(currentStudent.studentId, 'mind_labyrinth_quest', {
          chosenTrait: chosenPersonalityTrait,
          empathyScore,
          courageChoice,
          lifePledgeText,
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#070919] text-white rounded-3xl p-4 md:p-8 font-sans border-2 border-indigo-500/50 shadow-2xl relative select-none">
      
      {/* Cosmic Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/50 via-[#0B0F28] to-[#040612] pointer-events-none rounded-3xl" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Navigation Bar */}
      <div className="relative z-30 flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b-2 border-indigo-800/60">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-cyan-200 rounded-2xl text-sm font-black border-2 border-indigo-700/80 flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-400" />
              <span>返回任務大廳</span>
            </button>
          )}

          {/* Auto-Sync / Live Update Status Badge */}
          <div className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-300" style={{ animationDuration: '6s' }} />
            <span>最新更新 2026：自動即時同步運作中</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-indigo-950 hover:bg-indigo-900 text-cyan-300 rounded-2xl cursor-pointer border-2 border-indigo-700/80 shadow-md"
            title="音效切換"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-300" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('lobby')}
              className="px-5 py-2.5 bg-indigo-900/90 hover:bg-indigo-800 text-white rounded-2xl text-sm font-black border-2 border-indigo-600 cursor-pointer shadow-lg active:scale-95"
            >
              🏠 返回迷宮大廳
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOBBY VIEW (Generous spacing, Large legible text, All photos visible)     */}
      {/* ========================================================================= */}
      {gameState === 'lobby' && (
        <div className="relative z-20 space-y-8 w-full">
          
          {/* Main Title Header */}
          <div className="text-left space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-100 to-purple-200 flex items-center gap-3 drop-shadow-[0_4px_12px_rgba(168,85,247,0.6)]">
              <span>生命教育：心靈迷宮</span>
              <Sparkles className="w-10 h-10 text-cyan-300 animate-pulse" />
            </h1>
            <p className="text-sm md:text-base font-bold text-cyan-200/90">
              探索自我、同理共好與生命價值的沉浸式心靈解密體驗
            </p>
          </div>

          {/* Hero Showcase Frame */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-indigo-500/50 bg-[#0B0F2B] p-6 md:p-10 shadow-2xl">
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* LEFT CARD: 故事背景 */}
              <div className="lg:col-span-5 bg-slate-950/90 border-2 border-indigo-500/50 rounded-3xl p-6 md:p-8 text-left space-y-6 shadow-2xl backdrop-blur-lg">
                <div className="flex items-center gap-3 text-cyan-300 font-black text-lg md:text-xl border-b-2 border-indigo-800/80 pb-3">
                  <BookOpen className="w-6 h-6 text-cyan-400 shrink-0" />
                  <span>故事背景</span>
                </div>
                
                <p className="text-sm md:text-base text-slate-100 leading-relaxed font-semibold">
                  你是一名平凡的高中生，在一次意外後，進入了一座神秘的心靈迷宮。在這裡，你將面對各種關於自我、他人與生命的課題，透過選擇與行動，找到屬於自己的出口，也更認識真正的自己。
                </p>

                {/* Primary Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setGameState('playing');
                      setCurrentChapter(0);
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.6)] border-2 border-cyan-300/60 transition-all cursor-pointer active:scale-95 group"
                  >
                    <span className="text-2xl group-hover:rotate-12 transition-transform">🌀</span>
                    <span>開始遊戲探索</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setShowGuideModal(true)}
                    className="w-full py-3 px-6 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-cyan-200 border-2 border-indigo-700/80 text-sm md:text-base font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <span>遊戲玩法說明</span>
                  </button>
                </div>
              </div>

              {/* CENTER DISPLAY: Doorway Portal & Character Art Showcase */}
              <div className="lg:col-span-3 flex flex-col items-center justify-center py-4">
                
                {/* Visual Doorway Frame */}
                <div className="relative w-64 md:w-72 h-[340px] md:h-[380px] border-4 border-cyan-300/60 rounded-t-full bg-gradient-to-b from-cyan-300/30 via-indigo-900/80 to-slate-950 p-4 shadow-[0_0_60px_rgba(34,211,238,0.4)] flex flex-col items-center justify-between text-center">
                  
                  <div className="pt-4 space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-full bg-cyan-400/20 border-2 border-cyan-300 flex items-center justify-center text-4xl shadow-inner animate-spin" style={{ animationDuration: '15s' }}>
                      🌀
                    </div>
                    <span className="text-xs font-black text-cyan-200 tracking-widest uppercase block">
                      Portal of Consciousness
                    </span>
                  </div>

                  {/* Character Portraits Preview inside Portal */}
                  <div className="flex items-end justify-center gap-4 w-full pb-2">
                    <div className="text-center">
                      <img src={charKehuaImg} alt="Lin Yuchen" className="w-16 h-20 rounded-xl object-cover border-2 border-cyan-400 shadow-lg mx-auto" referrerPolicy="no-referrer" />
                      <span className="text-[11px] font-black text-cyan-300 mt-1 block bg-black/80 px-2 py-0.5 rounded-full border border-cyan-500/50">林予辰</span>
                    </div>

                    <div className="text-center">
                      <img src={charXiaopingImg} alt="Guide Liguang" className="w-16 h-20 rounded-xl object-cover border-2 border-purple-400 shadow-lg mx-auto" referrerPolicy="no-referrer" />
                      <span className="text-[11px] font-black text-purple-300 mt-1 block bg-black/80 px-2 py-0.5 rounded-full border border-purple-500/50">黎光</span>
                    </div>
                  </div>

                </div>

                <p className="text-xs font-bold italic text-purple-200 mt-3 bg-indigo-950/80 px-4 py-1.5 rounded-full border border-purple-500/40">
                  「每一次選擇，都是認識自己的開始。」
                </p>
              </div>

              {/* RIGHT CARD: 角色介紹 (Full Character List, Fully Visible Photos) */}
              <div className="lg:col-span-4 bg-slate-950/90 border-2 border-indigo-500/50 rounded-3xl p-6 md:p-8 text-left space-y-5 shadow-2xl backdrop-blur-lg">
                <div className="flex items-center gap-3 text-purple-300 font-black text-lg md:text-xl border-b-2 border-indigo-800/80 pb-3">
                  <Users className="w-6 h-6 text-purple-400 shrink-0" />
                  <span>登場角色介紹</span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Char 1 */}
                  <div className="flex items-center gap-3.5 bg-indigo-950/80 p-3 rounded-2xl border-2 border-indigo-800/80 hover:border-cyan-400 transition-all">
                    <img src={charKehuaImg} alt="Lin Yuchen" className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-cyan-200">林予辰（你）</span>
                        <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">主角</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium mt-0.5">高一學生，好奇心旺盛，在迷宮中尋找生命的真正答案。</p>
                    </div>
                  </div>

                  {/* Char 2 */}
                  <div className="flex items-center gap-3.5 bg-indigo-950/80 p-3 rounded-2xl border-2 border-indigo-800/80 hover:border-purple-400 transition-all">
                    <img src={charXiaopingImg} alt="Guide Liguang" className="w-12 h-12 rounded-xl object-cover border-2 border-purple-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-purple-200">引路人－黎光</span>
                        <span className="text-xs font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-500/40">指引者</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium mt-0.5">神秘指引者，溫柔而堅定，陪伴你走過每一道試煉。</p>
                    </div>
                  </div>

                  {/* Char 3 */}
                  <div className="flex items-center gap-3.5 bg-indigo-950/80 p-3 rounded-2xl border-2 border-indigo-800/80 hover:border-amber-400 transition-all">
                    <img src={charBojunImg} alt="Bojun" className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-amber-200">同學・博鈞</span>
                        <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">關鍵NPC</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium mt-0.5">面對學習與期待的困境，需要真誠同理與傾聽的朋友。</p>
                    </div>
                  </div>

                </div>

                <button
                  onClick={() => setShowRolesModal(true)}
                  className="w-full py-2.5 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 rounded-2xl text-xs font-black border border-indigo-600 transition-all cursor-pointer text-center"
                >
                  查看全部詳細角色圖鑑 &gt;
                </button>
              </div>

            </div>

          </div>

          {/* BOTTOM BAR: Info Cards + Chapter Stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 3 Mini Info Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-slate-950/90 border-2 border-indigo-800/80 rounded-2xl p-4 text-left space-y-2 hover:border-cyan-400 transition-all">
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-black">
                  <BookOpen className="w-5 h-5 shrink-0" />
                  <span>故事背景</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  了解心靈迷宮的起源與使命任務。
                </p>
                <button
                  onClick={() => setActiveInfoTab('story')}
                  className="text-xs font-black text-cyan-300 hover:underline cursor-pointer pt-1 block"
                >
                  查看更多 &gt;
                </button>
              </div>

              <div className="bg-slate-950/90 border-2 border-indigo-800/80 rounded-2xl p-4 text-left space-y-2 hover:border-indigo-400 transition-all">
                <div className="flex items-center gap-2 text-indigo-200 text-sm font-black">
                  <Compass className="w-5 h-5 shrink-0 text-indigo-400" />
                  <span>遊玩方式</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  選擇推進劇情，思考多元價值結局。
                </p>
                <button
                  onClick={() => setActiveInfoTab('gameplay')}
                  className="text-xs font-black text-indigo-300 hover:underline cursor-pointer pt-1 block"
                >
                  查看說明 &gt;
                </button>
              </div>

              <div className="bg-slate-950/90 border-2 border-indigo-800/80 rounded-2xl p-4 text-left space-y-2 hover:border-purple-400 transition-all">
                <div className="flex items-center gap-2 text-purple-300 text-sm font-black">
                  <Heart className="w-5 h-5 shrink-0 text-pink-400" />
                  <span>核心價值</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  融入生命教育議題，啟發深層思考。
                </p>
                <button
                  onClick={() => setActiveInfoTab('values')}
                  className="text-xs font-black text-purple-300 hover:underline cursor-pointer pt-1 block"
                >
                  了解更多 &gt;
                </button>
              </div>

            </div>

            {/* Right Chapter Stepper (章節進度) */}
            <div className="lg:col-span-7 bg-slate-950/90 border-2 border-indigo-800/80 rounded-3xl p-5 text-left space-y-4 flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b-2 border-indigo-800/60 pb-2.5">
                <div className="flex items-center gap-2.5 text-sm font-black text-cyan-200">
                  <span className="text-xl">🌀</span>
                  <span>章節探索進度 (Chapter Progress)</span>
                </div>
                
                <button
                  onClick={() => setShowChapterModal(true)}
                  className="text-xs font-black text-indigo-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer bg-indigo-950 px-3 py-1 rounded-xl border border-indigo-700"
                >
                  查看全章節地圖總覽 <List className="w-4 h-4" />
                </button>
              </div>

              {/* Stepper Nodes */}
              <div className="grid grid-cols-5 gap-3 items-center text-center py-2">
                
                {/* Node 0 */}
                <div 
                  onClick={() => {
                    setGameState('playing');
                    setCurrentChapter(0);
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 border-2 border-cyan-200 text-white shadow-[0_0_20px_rgba(34,211,238,0.7)] flex items-center justify-center text-xl font-black transition-all group-hover:scale-110">
                    🌀
                  </div>
                  <span className="text-xs font-black text-cyan-200">Prologue</span>
                  <span className="text-[11px] font-bold text-slate-300">序章：迷宮入口</span>
                </div>

                {/* Node 1 */}
                <div 
                  onClick={() => {
                    if (unlockedChapterMax >= 1) {
                      setGameState('playing');
                      setCurrentChapter(1);
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 transition-all ${unlockedChapterMax >= 1 ? 'cursor-pointer' : 'opacity-60'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-base font-black ${
                    unlockedChapterMax >= 1 
                      ? 'bg-indigo-900 border-indigo-400 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {unlockedChapterMax >= 1 ? '1' : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-black text-slate-200">Chapter 1</span>
                  <span className="text-[11px] font-bold text-slate-300">1. 新的選擇</span>
                </div>

                {/* Node 2 */}
                <div 
                  onClick={() => {
                    if (unlockedChapterMax >= 2) {
                      setGameState('playing');
                      setCurrentChapter(2);
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 transition-all ${unlockedChapterMax >= 2 ? 'cursor-pointer' : 'opacity-60'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-base font-black ${
                    unlockedChapterMax >= 2 
                      ? 'bg-indigo-900 border-indigo-400 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {unlockedChapterMax >= 2 ? '2' : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-black text-slate-200">Chapter 2</span>
                  <span className="text-[11px] font-bold text-slate-300">2. 鏡像同理</span>
                </div>

                {/* Node 3 */}
                <div 
                  onClick={() => {
                    if (unlockedChapterMax >= 3) {
                      setGameState('playing');
                      setCurrentChapter(3);
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 transition-all ${unlockedChapterMax >= 3 ? 'cursor-pointer' : 'opacity-60'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-base font-black ${
                    unlockedChapterMax >= 3 
                      ? 'bg-indigo-900 border-indigo-400 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {unlockedChapterMax >= 3 ? '3' : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-black text-slate-200">Chapter 3</span>
                  <span className="text-[11px] font-bold text-slate-300">3. 終極抉擇</span>
                </div>

                {/* Node 4 */}
                <div 
                  onClick={() => {
                    if (unlockedChapterMax >= 4) {
                      setGameState('playing');
                      setCurrentChapter(4);
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 transition-all ${unlockedChapterMax >= 4 ? 'cursor-pointer' : 'opacity-60'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-base font-black ${
                    unlockedChapterMax >= 4 
                      ? 'bg-purple-900 border-purple-400 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {unlockedChapterMax >= 4 ? '4' : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-black text-slate-200">Chapter 4</span>
                  <span className="text-[11px] font-bold text-slate-300">4. 幸福之門</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PLAYING INTERACTIVE STORY CHAPTERS                                        */}
      {/* ========================================================================= */}
      {gameState === 'playing' && (
        <div className="relative z-20 space-y-8 max-w-4xl mx-auto text-left">
          
          {/* Chapter Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between bg-slate-950/90 border-2 border-indigo-700/80 rounded-3xl p-5 shadow-xl gap-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🌀</span>
              <div>
                <h3 className="text-base md:text-lg font-black text-cyan-200">
                  {currentChapter === 0 && '序章：迷宮的入口 (Prologue)'}
                  {currentChapter === 1 && '第一章：新的選擇 (Self Discovery)'}
                  {currentChapter === 2 && '第二章：鏡像與同理 (Empathy & Connection)'}
                  {currentChapter === 3 && '第三章：終極抉擇與勇氣 (Values & Dilemma)'}
                  {currentChapter === 4 && '第四章：幸福之門 (Spirituality & Beyond)'}
                </h3>
                <p className="text-xs font-bold text-slate-300 mt-0.5">
                  心靈迷宮深度探索進行中 ・ 當前進度 {currentChapter + 1} / 5
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map(idx => (
                <button
                  key={idx}
                  disabled={idx > unlockedChapterMax}
                  onClick={() => setCurrentChapter(idx)}
                  className={`w-10 h-10 rounded-2xl text-sm font-black transition-all ${
                    currentChapter === idx
                      ? 'bg-cyan-400 text-slate-950 border-2 border-white shadow-lg scale-110'
                      : idx <= unlockedChapterMax
                      ? 'bg-indigo-900 text-cyan-200 border border-indigo-700 cursor-pointer'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-40 cursor-not-allowed'
                  }`}
                >
                  {idx === 0 ? '序' : idx}
                </button>
              ))}
            </div>
          </div>

          {/* CHAPTER 0: PROLOGUE */}
          {currentChapter === 0 && (
            <div className="bg-slate-950/90 border-2 border-indigo-600/70 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-lg">
              
              <div className="flex items-center gap-4 border-b-2 border-indigo-800/60 pb-4">
                <img src={charXiaopingImg} alt="Guide Liguang" className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shrink-0 shadow-lg" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-sm font-black text-purple-300 flex items-center gap-2">
                    <span>引路人－黎光</span>
                    <span className="text-xs bg-purple-950 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-500/50">Guide</span>
                  </h4>
                  <p className="text-sm text-slate-100 font-bold mt-1 leading-relaxed">
                    「歡迎來到這座紀錄著你心靈痕跡的迷宮……在這裡，每一個選擇，都是一面認識真實自我與生命的鏡子。」
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-sm md:text-base text-slate-100 leading-relaxed font-semibold bg-indigo-950/60 p-5 rounded-2xl border-2 border-indigo-800/60">
                  你睜開雙眼，發現自己身處於一座散發著淡淡藍紫色星光的古老走廊。牆壁兩側懸浮著無數空白的畫框，地板上刻繪著發光的羅盤與星軌圖騰。眼前是一位身穿星藍色長袍、眼神溫柔堅定的少女「黎光」。
                </p>

                <div className="space-y-3 pt-2">
                  <p className="text-sm md:text-base font-black text-cyan-200">黎光輕聲問你：「在踏入第一座試煉之門前，請告訴我，你認為自己內心最大的優勢是什麼？」</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {[
                      { id: 'curiosity', label: '💡 無限的好奇與求知欲', desc: '善於思考探究，勇於發掘事物本質' },
                      { id: 'empathy', label: '💖 溫暖的同理與傾聽力', desc: '能感知他人情緒，帶給身邊人溫暖' },
                      { id: 'courage', label: '🛡️ 堅毅的責任與勇氣', desc: '面對困境不輕易退縮，敢於為信念站出來' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setChosenPersonalityTrait(item.id)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          chosenPersonalityTrait === item.id 
                            ? 'bg-gradient-to-r from-indigo-900 to-purple-900 border-cyan-300 text-white shadow-xl ring-2 ring-cyan-400' 
                            : 'bg-indigo-950/60 border-indigo-800/80 text-slate-200 hover:border-indigo-500'
                        }`}
                      >
                        <div className="text-sm md:text-base font-black text-cyan-200">{item.label}</div>
                        <p className="text-xs md:text-sm text-slate-300 font-medium mt-1.5 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    disabled={!chosenPersonalityTrait}
                    onClick={() => handleChapterComplete(0)}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm md:text-base rounded-2xl cursor-pointer shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>完成序章，開啟「第一章：新的選擇」</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* CHAPTER 1 */}
          {currentChapter === 1 && (
            <div className="bg-slate-950/90 border-2 border-indigo-600/70 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-lg">
              <div className="flex justify-between items-center border-b-2 border-indigo-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🪞</span>
                  <div>
                    <h4 className="text-base md:text-lg font-black text-cyan-200">第一章：新的選擇 —— 自我探索與鏡像反射</h4>
                    <p className="text-xs text-slate-300 font-bold">探討議題：自我認同、性格心理（MBTI/WOOP）、生命的起點</p>
                  </div>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-100 leading-relaxed font-semibold bg-indigo-950/60 p-5 rounded-2xl border-2 border-indigo-800/60">
                迷宮第一展廳的牆上掛著一面巨大的「心理反射鏡」。鏡子中呈現出你平日學習與生活的種種情境。黎光說：「很多人習慣跟隨他人的期待而活，卻忘了問問自己真正要的是什麼。」
              </p>

              <div className="space-y-4">
                <p className="text-sm md:text-base font-black text-cyan-200">【探索任務】當面對重大生涯抉擇或學習挫折時，你最傾向的對策是：</p>
                
                {[
                  { id: 1, title: 'A. 運用 WOOP 願望目標策略', desc: '明確願望(Wish)與成果(Outcome)，預想障礙(Obstacle)並制定如果……就……行動計劃(Plan)。' },
                  { id: 2, title: 'B. 尋求師長與同儕真誠傾聽', desc: '敞開心扉交流，在對話中梳理內心感受與思路。' },
                  { id: 3, title: 'C. 獨處進行日記文字反思', desc: '透過文字沉澱心情，客觀釐清自己的價值優先順序。' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setChap1Choice(opt.id)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      chap1Choice === opt.id 
                        ? 'bg-gradient-to-r from-indigo-900 to-purple-900 border-cyan-300 text-white ring-2 ring-cyan-400' 
                        : 'bg-indigo-950/60 border-indigo-800/80 text-slate-200 hover:border-indigo-500'
                    }`}
                  >
                    <div className="text-sm md:text-base font-black text-cyan-200">{opt.title}</div>
                    <p className="text-xs md:text-sm text-slate-200 font-medium mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-indigo-800/60">
                <button
                  onClick={() => setCurrentChapter(0)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-black rounded-2xl"
                >
                  &lt; 上一章
                </button>

                <button
                  disabled={chap1Choice === null}
                  onClick={() => handleChapterComplete(1)}
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm md:text-base rounded-2xl cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>解開第一道迷宮門，進入「第二章」</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER 2 */}
          {currentChapter === 2 && (
            <div className="bg-slate-950/90 border-2 border-indigo-600/70 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-lg">
              <div className="flex justify-between items-center border-b-2 border-indigo-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🤝</span>
                  <div>
                    <h4 className="text-base md:text-lg font-black text-purple-200">第二章：身心思考 —— 鏡像與同理的力量</h4>
                    <p className="text-xs text-slate-300 font-bold">探討議題：人際關係、情緒同理、換位思考與陪伴</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-indigo-950/60 p-5 rounded-2xl border-2 border-indigo-800/60">
                <img src={charBojunImg} alt="Bojun" className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-lg" referrerPolicy="no-referrer" />
                <div className="text-xs md:text-sm text-slate-100">
                  <span className="font-black text-amber-300 text-sm md:text-base block">同學・博鈞的情緒困境：</span>
                  <p className="font-semibold mt-1 leading-relaxed">「最近因為比賽失利和家裡期待，我覺得壓力好大，感覺大家都只在乎成績，沒有人在乎我的感受……」</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm md:text-base font-black text-purple-200">【同理溝通任務】作為朋友，最能展現「同理傾聽」的回應方式是：</p>

                {[
                  { id: 1, title: 'A. 溫柔同理與陪伴', desc: '「我能感受你現在一定很沮喪和辛苦。謝謝你願意跟我說，不論結果如何，我都支持你。」' },
                  { id: 2, title: 'B. 給予實用建議與規劃', desc: '「別想太多了，我們現在就來排個讀書與訓練時間表，把問題解決就好了！」' },
                  { id: 3, title: 'C. 轉移注意力放鬆', desc: '「走啦！別提難過的事了，我們去打球放鬆一下吧！」' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setChap2Choice(opt.id);
                      setEmpathyScore(opt.id === 1 ? 98 : opt.id === 2 ? 75 : 60);
                    }}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      chap2Choice === opt.id 
                        ? 'bg-gradient-to-r from-indigo-900 to-purple-900 border-purple-300 text-white ring-2 ring-purple-400' 
                        : 'bg-indigo-950/60 border-indigo-800/80 text-slate-200 hover:border-indigo-500'
                    }`}
                  >
                    <div className="text-sm md:text-base font-black text-purple-200">{opt.title}</div>
                    <p className="text-xs md:text-sm text-slate-200 font-medium mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-indigo-800/60">
                <button
                  onClick={() => setCurrentChapter(1)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-black rounded-2xl"
                >
                  &lt; 上一章
                </button>

                <button
                  disabled={chap2Choice === null}
                  onClick={() => handleChapterComplete(2)}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm md:text-base rounded-2xl cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>同理光芒匯聚，進入「第三章」</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER 3 */}
          {currentChapter === 3 && (
            <div className="bg-slate-950/90 border-2 border-indigo-600/70 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-lg">
              <div className="flex justify-between items-center border-b-2 border-indigo-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚖️</span>
                  <div>
                    <h4 className="text-base md:text-lg font-black text-amber-200">第三章：終極抉擇與勇氣 —— 價值思辨與倫理天平</h4>
                    <p className="text-xs text-slate-300 font-bold">探討議題：電車難題、功利與德行倫理、生命價值的優先順序</p>
                  </div>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-100 leading-relaxed font-semibold bg-indigo-950/60 p-5 rounded-2xl border-2 border-indigo-800/60">
                迷宮轉角處出現一座古老的電車軌道分道揚鑣之處。黎光說：「生活中我們常面臨兩難抉擇。真正的道德勇氣，不是算計利益極大化，而是始終堅守尊重生命的內在核心價值。」
              </p>

              <div className="space-y-4">
                <p className="text-sm md:text-base font-black text-amber-200">【價值思辨任務】在面對複雜的社會與道德兩難議題時，你堅守的核心引導準則是：</p>

                {[
                  { id: 1, title: '🛡️ 人尊嚴原則', desc: '將每個人視為具有不可替代尊嚴的獨立個體，絕不將人僅當作達成目的的工具。' },
                  { id: 2, title: '⚖️ 最大共好原則', desc: '考量整體長遠福祉，盡最大努力降低傷害並創造大眾的幸福。' },
                  { id: 3, title: '🌱 誠實與責任原則', desc: '坦然面對抉擇帶來的代價，勇於承擔社會責任與利他使命。' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setChap3Choice(opt.id);
                      setCourageChoice(opt.title);
                    }}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      chap3Choice === opt.id 
                        ? 'bg-gradient-to-r from-amber-950 to-indigo-950 border-amber-300 text-white ring-2 ring-amber-400' 
                        : 'bg-indigo-950/60 border-indigo-800/80 text-slate-200 hover:border-indigo-500'
                    }`}
                  >
                    <div className="text-sm md:text-base font-black text-amber-200">{opt.title}</div>
                    <p className="text-xs md:text-sm text-slate-200 font-medium mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-indigo-800/60">
                <button
                  onClick={() => setCurrentChapter(2)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-black rounded-2xl"
                >
                  &lt; 上一章
                </button>

                <button
                  disabled={chap3Choice === null}
                  onClick={() => handleChapterComplete(3)}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-sm md:text-base rounded-2xl cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>通過價值審判，進入「第四章：幸福之門」</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER 4: SPIRITUALITY & BEYOND */}
          {currentChapter === 4 && (
            <div className="bg-slate-950/90 border-2 border-cyan-400/80 rounded-3xl p-8 space-y-8 shadow-2xl backdrop-blur-lg text-center">
              
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-1 shadow-[0_0_40px_rgba(34,211,238,0.9)] animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl">
                  ✨
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-100 to-purple-200">
                  恭喜開啟「幸福之門」與生命超越！
                </h3>
                <p className="text-sm md:text-base text-slate-100 font-extrabold max-w-2xl mx-auto leading-relaxed">
                  你已順利通關心靈迷宮的全域試煉！黎光微笑道：「恭喜你找到屬於自己的出口。請在生命誓約卡寫下你對未來的祝福，開啟全新的學習旅程！」
                </p>
              </div>

              {/* Life Pledge Card */}
              <div className="bg-gradient-to-b from-indigo-950 to-slate-950 border-2 border-cyan-400/80 rounded-3xl p-6 text-left space-y-5 shadow-2xl max-w-xl mx-auto">
                <div className="flex items-center gap-3 border-b-2 border-cyan-500/40 pb-3">
                  <Award className="w-6 h-6 text-amber-300" />
                  <span className="text-base font-black text-cyan-200">生命英雄・幸福誓約卡</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-black text-slate-200 block">我的生命行動宣言 (Pledge):</label>
                  <textarea
                    rows={3}
                    value={lifePledgeText}
                    onChange={(e) => setLifePledgeText(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-indigo-600/80 rounded-2xl p-4 text-xs md:text-sm text-white font-bold focus:outline-none focus:border-cyan-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs md:text-sm font-bold text-slate-200 pt-1 border-t border-indigo-900">
                  <div>探索特質：<span className="text-cyan-300 font-black">{chosenPersonalityTrait || '好奇探索'}</span></div>
                  <div>同理分數：<span className="text-purple-300 font-black">{empathyScore} / 100</span></div>
                  <div className="col-span-2">核心價值：<span className="text-amber-300 font-black">{courageChoice || '人尊嚴原則'}</span></div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    handleChapterComplete(4);
                    setGameState('lobby');
                  }}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-base md:text-lg rounded-2xl shadow-2xl cursor-pointer transition-all flex items-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-cyan-200" />
                  <span>完成並領取「心靈迷宮徽章」</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ================= MODAL: 遊戲說明 ================= */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0F28] border-2 border-indigo-500/80 rounded-3xl max-w-xl w-full p-6 text-left text-white space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b-2 border-indigo-800 pb-3">
                <h3 className="text-lg font-black text-cyan-300 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  <span>心靈迷宮：遊戲說明指南</span>
                </h3>
                <button onClick={() => setShowGuideModal(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
                <p>1. 本遊戲包含序章與四大核心主題展廳（自我探索、同理關係、價值思辨、幸福超越）。</p>
                <p>2. 每完成一個展廳的抉擇任務，即可解鎖下一道試煉之門與專屬心靈印記。</p>
                <p>3. 所有選擇均無標準對錯，目的在於引導進行深度的生命自我對話與價值思辨。</p>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black rounded-2xl text-sm cursor-pointer shadow-lg"
              >
                我知道了，返回迷宮
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: 角色圖鑑 ================= */}
      <AnimatePresence>
        {showRolesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0F28] border-2 border-purple-500/80 rounded-3xl max-w-2xl w-full p-6 text-left text-white space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b-2 border-indigo-800 pb-3">
                <h3 className="text-lg font-black text-purple-300 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  <span>心靈迷宮：登場角色全圖鑑</span>
                </h3>
                <button onClick={() => setShowRolesModal(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-950/80 p-4 rounded-2xl border-2 border-cyan-500/50 flex items-center gap-4">
                  <img src={charKehuaImg} alt="Lin Yuchen" className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-black text-cyan-200 text-sm">林予辰 (主角)</h5>
                    <p className="text-xs text-slate-300 mt-1">高一學生，因意外進入心靈迷宮，面對各種生命的學習課題。</p>
                  </div>
                </div>

                <div className="bg-indigo-950/80 p-4 rounded-2xl border-2 border-purple-500/50 flex items-center gap-4">
                  <img src={charXiaopingImg} alt="Liguang" className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-black text-purple-200 text-sm">引路人－黎光</h5>
                    <p className="text-xs text-slate-300 mt-1">神秘指引者，溫柔而堅定，協助主角通過試煉之門。</p>
                  </div>
                </div>

                <div className="bg-indigo-950/80 p-4 rounded-2xl border-2 border-amber-500/50 flex items-center gap-4">
                  <img src={charBojunImg} alt="Bojun" className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-black text-amber-200 text-sm">同學・博鈞</h5>
                    <p className="text-xs text-slate-300 mt-1">需要陪伴與情緒同理的朋友，激發同理溝通的可能。</p>
                  </div>
                </div>

                <div className="bg-indigo-950/80 p-4 rounded-2xl border-2 border-slate-700/80 flex items-center gap-4">
                  <img src={charXiaowenImg} alt="Xiaowen" className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-black text-slate-200 text-sm">同學・小雯</h5>
                    <p className="text-xs text-slate-300 mt-1">堅持原則與理想的夥伴，共同經歷生命倫理試煉。</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowRolesModal(false)}
                className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-black rounded-2xl text-sm cursor-pointer shadow-lg"
              >
                關閉角色圖鑑
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: 章節總覽 ================= */}
      <AnimatePresence>
        {showChapterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0F28] border-2 border-cyan-500/80 rounded-3xl max-w-xl w-full p-6 text-left text-white space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b-2 border-indigo-800 pb-3">
                <h3 className="text-lg font-black text-cyan-200 flex items-center gap-2">
                  <List className="w-6 h-6 text-cyan-400" />
                  <span>心靈迷宮：全章節試煉總覽</span>
                </h3>
                <button onClick={() => setShowChapterModal(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { num: 0, title: '序章：迷宮的入口 (Prologue)', desc: '覺察自我心理特質，開啟心靈迷宮冒險。' },
                  { num: 1, title: '第一章：新的選擇 (Self Discovery)', desc: '探索性格心理學（MBTI/WOOP）與自我生命定位。' },
                  { num: 2, title: '第二章：鏡像與同理 (Empathy & Connection)', desc: '學習真誠傾聽、換位思考與朋友夥伴關係支持。' },
                  { num: 3, title: '第三章：終極抉擇 (Values & Dilemma)', desc: '電車難題倫理思辨與人性尊嚴核心原則。' },
                  { num: 4, title: '第四章：幸福之門 (Spirituality & Beyond)', desc: '確立生命行動誓約，邁向自我超越與終極關懷。' },
                ].map(item => (
                  <div key={item.num} className="p-4 bg-indigo-950/80 rounded-2xl border-2 border-indigo-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-cyan-200">{item.title}</div>
                      <p className="text-xs text-slate-300 mt-1">{item.desc}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold shrink-0 ${unlockedChapterMax >= item.num ? 'bg-cyan-950 text-cyan-300 border border-cyan-500' : 'bg-slate-900 text-slate-500'}`}>
                      {unlockedChapterMax >= item.num ? '已解鎖' : '未解鎖'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowChapterModal(false)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black rounded-2xl text-sm cursor-pointer shadow-lg"
              >
                返回遊戲
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
