/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Character, StudentSubmission, UserProfile } from '../types';
import { ACHIEVEMENTS } from '../achievements';
import { LogOut, ChevronRight, Gamepad2, Link as LinkIcon } from 'lucide-react';
// @ts-ignore
import heroCharacters from '../assets/images/hero-characters.jpg';
import {
  gameIcon01,
  puzzleMapBg,
  gameIcon03,
  gameIcon04,
  gameIcon05,
  gameIcon06,
  gameIcon07,
  gameIcon08,
  gameIcon09,
  gameIcon10,
} from '../assets/images/game-banners';

interface HomeTabProps {
  onNavigate: (tab: string) => void;
  onSelectUnit?: (unitId: string) => void;
  onSelectGameId?: (gameId: number) => void;
  activeStudent: { name: string; avatarEmoji: string; avatarUrl?: string };
  submissions: StudentSubmission[];
  characters: Character[];
  onUpdateCharacterClick?: (charId: string) => void;
  currentUser?: UserProfile | null;
  onTriggerLogin?: () => void;
  onLogout?: () => void;
  /** 開啟《五門・心靈迷宮》（public/lifequest/ 的獨立遊戲） */
  onOpenFiveGates?: () => void;
}

export default function HomeTab({ 
  onNavigate, 
  onSelectUnit, 
  onSelectGameId,
  activeStudent, 
  submissions,
  characters,
  onUpdateCharacterClick,
  currentUser,
  onTriggerLogin,
  onLogout,
  onOpenFiveGates
}: HomeTabProps) {

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const GAMES: any[] = [];

  const GAME_ICON_IMAGES: Record<number, string> = {
    1: gameIcon01,
    2: puzzleMapBg,
    3: gameIcon03,
    4: gameIcon04,
    5: gameIcon05,
    6: gameIcon06,
    7: gameIcon07,
    8: gameIcon08,
    9: gameIcon09,
    10: gameIcon10,
  };

  const renderGameIllustration = (gameId: number) => {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#EAD5C3] bg-[#FFFDF9] select-none flex items-center justify-center p-1 shadow-2xs">
        <img src={GAME_ICON_IMAGES[gameId]} alt="" className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105" />
      </div>
    );
  };

  // Map of 6 units in exact accordance with the textbook outline in "圖一"
  const unitCards = [
    {
      id: 'unit_00',
      num: '總說',
      title: '總說',
      subtitle: '| 凝視生命的地圖',
      colorClasses: {
        cardBg: 'bg-[#FFF9F2]',
        border: 'border-[#F1E0CE]',
        circleBg: 'bg-[#FFF0DF]',
        accentText: 'text-[#C48C46]',
        hoverBg: 'hover:bg-[#FBEFDF]',
        btnBorder: 'border-[#EAD2B8]'
      },
      iconSvg: (
        <svg className="w-10 h-10 text-[#C48C46]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeWidth="2" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="2" />
          <path d="M12 5v12" stroke="#4CAF50" strokeWidth="1.5" />
          <path d="M12 8c1-1 3-1.5 3-1.5S13 9 12 10" fill="#4CAF50" />
          <path d="M12 11c-1-1-3-1.5-3-1.5S11 12 12 13" fill="#4CAF50" />
        </svg>
      )
    },
    {
      id: 'unit_01',
      num: '01',
      title: '哲學思考',
      subtitle: '品嚐思考的樂趣',
      colorClasses: {
        cardBg: 'bg-[#F2F8FF]',
        border: 'border-[#CCE1FB]',
        circleBg: 'bg-[#E5F1FF]',
        accentText: 'text-[#1D4ED8]',
        hoverBg: 'hover:bg-[#EAF3FF]',
        btnBorder: 'border-[#CCE1FB]'
      },
      iconSvg: (
        <svg className="w-10 h-10 text-[#1D4ED8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="2" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
          <line x1="19.78" y1="4.22" x2="18.36" y2="5.64" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'unit_02',
      num: '02',
      title: '人學探索',
      subtitle: '漫步奇幻的旅程',
      colorClasses: {
        cardBg: 'bg-[#F5FBF5]',
        border: 'border-[#CDE7CD]',
        circleBg: 'bg-[#EAF7EA]',
        accentText: 'text-[#2E7D32]',
        hoverBg: 'hover:bg-[#EDF8ED]',
        btnBorder: 'border-[#CDE7CD]'
      },
      iconSvg: (
        <svg className="w-10 h-10 text-[#2E7D32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="21" x2="15.5" y2="15.5" stroke="currentColor" strokeWidth="3" />
          <path d="M11 7c-2 0-4 1.5-4 4" stroke="#4CAF50" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="2.5" fill="#4CAF50" />
        </svg>
      )
    },
    {
      id: 'unit_03',
      num: '03',
      title: '終極關懷',
      subtitle: '旅程中的神奇羅盤',
      colorClasses: {
        cardBg: 'bg-[#FAF6FC]',
        border: 'border-[#ECCDF2]',
        circleBg: 'bg-[#F5EAF7]',
        accentText: 'text-[#7B1FA2]',
        hoverBg: 'hover:bg-[#F7EEFA]',
        btnBorder: 'border-[#ECCDF2]'
      },
      iconSvg: (
        <svg className="w-10 h-10 text-[#7B1FA2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'unit_04',
      num: '04',
      title: '價值思辨',
      subtitle: '掌握智慧方向盤',
      colorClasses: {
        cardBg: 'bg-[#FFF9F5]',
        border: 'border-[#FCE1D1]',
        circleBg: 'bg-[#FFF1E8]',
        accentText: 'text-[#E65100]',
        hoverBg: 'hover:bg-[#FFF4ED]',
        btnBorder: 'border-[#FCE1D1]'
      },
      iconSvg: (
        <svg className="w-10 h-10 text-[#E65100]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2" />
          <path d="M12 5h6l2 3-2 3h-6z" fill="currentColor" opacity="0.15" />
          <path d="M12 5h6l2 3-2 3h-6" stroke="currentColor" strokeWidth="2" />
          <path d="M12 13H6l-2 3 2 3h6z" fill="currentColor" opacity="0.15" />
          <path d="M12 13H6l-2 3 2 3h6" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'unit_05',
      num: '05',
      title: '靈性修養與人格統整',
      subtitle: '開啟心靈超能量',
      colorClasses: {
        cardBg: 'bg-[#FFF5F6]',
        border: 'border-[#FCD2D6]',
        circleBg: 'bg-[#FFEBEF]',
        accentText: 'text-[#C2185B]',
        hoverBg: 'hover:bg-[#FFF0F2]',
        btnBorder: 'border-[#FCD2D6]'
      },
      iconSvg: (
        <svg className="w-10 h-10 text-[#C2185B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 10c.5-.5 1-1.5 1-1.5s-1-.5-1.5-1c-.5.5-1 1.5-1 1.5s1 .5 1.5 1" fill="#FF8A80" />
          <circle cx="6" cy="7" r="1.5" fill="#FF8A80" />
          <circle cx="17" cy="11" r="1" fill="#FF8A80" />
        </svg>
      )
    }
  ];

  // Specific characters standing in order to match "圖一":
  // 王小文, 王博鈞, 可華爸爸, 可華爺爺, 張曉萍, 陳可華
  const orderedCompanionIds = [
    { id: 'char_xiaowen', name: '王小文', defaultAvatarUrl: '/uploads/char_xiaowen_1783323000731.png' },
    { id: 'char_bojun', name: '王博鈞', defaultAvatarUrl: '/uploads/char_bojun_1783476419595.png' },
    { id: 'char_dad', name: '可華爸爸', defaultAvatarUrl: '/uploads/char_dad_1783477008022.png' },
    { id: 'char_grandpa', name: '可華爺爺', defaultAvatarUrl: '/uploads/char_grandpa_1783476400556.jpeg' },
    { id: 'char_xiaoping', name: '張曉萍', defaultAvatarUrl: '/uploads/char_xiaoping_1783476410144.png' },
    { id: 'char_kehua', name: '陳可華', defaultAvatarUrl: '/uploads/char_kehua_1783476432058.png' }
  ].map(item => {
    const dynamicChar = characters.find(c => c.id === item.id);
    return {
      ...item,
      avatarUrl: dynamicChar?.avatarUrl || item.defaultAvatarUrl
    };
  });

  const handleUnitClick = (unitId: string) => {
    if (onSelectUnit) {
      onSelectUnit(unitId);
    }
    onNavigate('課程地圖');
  };


  return (
    <div className="min-h-screen bg-[#FDF9F3] text-[#3E2723] font-sans pb-12 relative overflow-hidden px-4 md:px-8">
      
      {/* Scrollbar hide helper styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* SVG hand-drawn floral ornaments: Left and Right background of page */}
      <svg className="absolute left-0 top-36 w-36 h-80 opacity-40 pointer-events-none select-none z-0 hidden lg:block" viewBox="0 0 100 200" fill="none">
        <path d="M10 200 Q20 120 40 50" stroke="#A7BFA1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 200 Q35 150 25 100" stroke="#A7BFA1" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M40 50 Q50 40 45 35 Q35 45 40 50 Z" fill="#C5D3C2" />
        <path d="M36 75 Q46 70 42 62 Q32 70 36 75 Z" fill="#B3C4AF" />
        <path d="M30 110 Q42 105 38 95 Q26 102 30 110 Z" fill="#C5D3C2" />
        <path d="M22 135 Q10 125 14 118 Q24 125 22 135 Z" fill="#9FB49B" />
        <circle cx="45" cy="35" r="4.5" fill="#F4BCA3" />
        <circle cx="41" cy="62" r="5.5" fill="#F0C3B2" />
        <circle cx="28" cy="115" r="6" fill="#F4BCA3" />
      </svg>

      <svg className="absolute right-0 top-36 w-36 h-80 opacity-40 pointer-events-none select-none z-0 hidden lg:block" viewBox="0 0 100 200" fill="none">
        <path d="M90 200 Q80 120 60 40" stroke="#A7BFA1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M90 200 Q65 140 75 80" stroke="#A7BFA1" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 40 Q50 30 55 25 Q65 35 60 40 Z" fill="#B3C4AF" />
        <path d="M64 70 Q54 65 58 57 Q68 62 64 70 Z" fill="#C5D3C2" />
        <path d="M70 105 Q58 100 62 90 Q74 97 70 105 Z" fill="#9FB49B" />
        <path d="M78 130 Q90 120 86 113 Q76 120 78 130 Z" fill="#C5D3C2" />
        <circle cx="55" cy="25" r="5" fill="#F4BCA3" />
        <circle cx="58" cy="57" r="4.5" fill="#F0C3B2" />
        <circle cx="72" cy="110" r="6.5" fill="#F4BCA3" />
      </svg>

      <div className="w-full space-y-6 relative z-10 pt-4">





        {/* 4. "互動遊戲" Section — 排在「選擇單元」上面 */}
        <div id="interactive-games-section" className="bg-[#FCFAF6] rounded-3xl border-2 border-[#F1E0CE] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#F1E0CE]/80 pb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="w-6 h-6 text-[#E65100]" />
              <h3 className="text-xl md:text-2xl font-black text-[#3E2723]">互動遊戲</h3>
            </div>
            
            <button
              onClick={() => onNavigate('互動遊戲')}
              className="px-4 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#E65100] border-2 border-[#E65100]/40 rounded-2xl text-xs md:text-sm font-black transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>進入大廳全螢幕</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {GAMES.length === 0 ? (
            /* 舊的 10 款遊戲已清空。這裡放《五門・心靈迷宮》的獨立入口——
               遊戲本體是 public/lifequest/ 底下的獨立 HTML 專案，用 iframe 開。 */
            <button
              onClick={onOpenFiveGates}
              className="w-full text-left bg-[#0B1220] border-2 border-[#E65100]/30 hover:border-[#E65100] rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 h-44 md:h-auto relative shrink-0">
                  <img
                    src={`${import.meta.env.BASE_URL}lifequest/assets/scenes/gate-hall.webp`}
                    alt="矗立著五扇高聳大門的心靈迷宮"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0B1220] via-[#0B1220]/40 to-transparent" />
                </div>

                <div className="flex-1 p-6 md:p-8 space-y-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black font-mono px-2.5 py-1 rounded-xl border-2 border-amber-300/40 bg-amber-300/10 text-amber-200 shadow-3xs">
                      LIFE EDUCATION QUEST
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-xl border-2 border-emerald-300/40 bg-emerald-300/10 text-emerald-200">
                      六個單元・對應課本
                    </span>
                  </div>

                  <h4 className="text-2xl md:text-3xl font-black text-amber-100 tracking-wide leading-snug group-hover:text-amber-200 transition-colors">
                    打開幸福人生之門・心靈迷宮
                  </h4>

                  <p className="text-xs md:text-sm text-slate-300 font-bold leading-relaxed max-w-xl">
                    可華掉進一座心靈迷宮，裡面矗立著五扇高聳的大門。每一扇門都要把散落的
                    思考碎片排成一條論證的順序，才能鑄出鑰匙。五扇門對應課綱的五大核心素養。
                  </p>

                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {['推理鑄鑰', '課本單元', '迷障圖鑑', '每日思辨', '心象探索'].map(t => (
                      <span
                        key={t}
                        className="text-[10px] md:text-xs font-black px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-[#E65100] text-white text-sm font-black shadow-md group-hover:bg-[#F57C00] transition-colors">
                      開始遊戲 <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
              {(() => {
                const activeSub = submissions.find(s => s.studentName === activeStudent.name);
                const getGameKey = (id: number) => {
                  switch (id) {
                    case 1: return 'mbti';
                    case 2: return 'puzzle';
                    case 3: return 'adventure';
                    case 4: return 'relationships';
                    case 5: return 'value_scale';
                    case 6: return 'memory_cards';
                    case 7: return 'gratitude';
                    case 8: return 'debate';
                    case 9: return 'mood';
                    case 10: return 'badges';
                    default: return '';
                  }
                };

                return GAMES.map((game) => {
                  const gameKey = getGameKey(game.id);
                  const isCompleted = activeSub?.games?.[`game_${gameKey}`] !== undefined;

                  return (
                    <div
                      key={game.id}
                      className="bg-white border-2 border-[#EAD5C3] hover:border-[#E65100] p-5 md:p-6 rounded-3xl transition-all duration-300 shadow-3xs flex flex-col justify-between min-h-[310px] md:min-h-[340px] group hover:-translate-y-1 hover:shadow-md relative"
                    >
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs md:text-sm font-black font-mono px-2.5 py-1 rounded-xl border-2 shadow-3xs ${game.color}`}>
                            {game.number}
                          </span>
                          {isCompleted && (
                            <span className="bg-emerald-50 text-emerald-700 border-2 border-emerald-300 text-xs font-black px-2 py-0.5 rounded-xl flex items-center gap-1 shadow-3xs">
                              <span className="text-xs leading-none">✓</span> 已完成
                            </span>
                          )}
                        </div>

                        <div className="h-28 md:h-32 w-full rounded-2xl overflow-hidden shadow-2xs">
                          {renderGameIllustration(game.id)}
                        </div>

                        <div className="space-y-1.5 text-left">
                          <h4 className="font-black text-base md:text-lg text-[#2D1B10] group-hover:text-[#E65100] transition-colors leading-snug">
                            {game.title}
                          </h4>
                          <p className="text-xs md:text-sm text-[#4E3629] font-bold leading-relaxed">
                            {game.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => {
                            if (onSelectGameId) {
                              onSelectGameId(game.id);
                            } else {
                              onNavigate('互動遊戲');
                            }
                            showToast(`🎮 歡迎進入：${game.title}！`);
                          }}
                          className="w-full py-2.5 bg-[#E65100] hover:bg-[#D84315] text-white border-2 border-[#D84315] rounded-2xl text-xs md:text-sm font-black transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>進入遊戲</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

        {/* 5. "選擇單元" Section - Matches reference image EXACTLY */}
        <div id="select-unit-section" className="bg-[#FCFAF6] rounded-3xl border-2 border-[#F1E0CE] p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b-2 border-[#F1E0CE]/80 pb-4">
            <div className="flex items-center gap-2.5">
              {/* Elegant orange star logo */}
              <svg className="w-6 h-6 text-[#E65100]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
              </svg>
              <h3 className="text-xl md:text-2xl font-black text-[#3E2723]">選擇單元</h3>
            </div>
          </div>

          {/* Grid layout for 6 custom-styled unit cards with clear spacing and large readable text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
            {unitCards.map((unit) => (
              <div
                key={unit.id}
                onClick={() => handleUnitClick(unit.id)}
                className={`p-5 md:p-6 rounded-3xl border-2 ${unit.colorClasses.border} ${unit.colorClasses.cardBg} ${unit.colorClasses.hoverBg} transition-all duration-300 cursor-pointer shadow-3xs hover:shadow-md flex flex-col justify-between items-center text-center min-h-[270px] md:min-h-[290px] group`}
              >
                {/* Rounded Icon badge container with soft colored background circle */}
                <div className={`w-16 h-16 rounded-full ${unit.colorClasses.circleBg} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0`}>
                  {unit.iconSvg}
                </div>

                <div className="space-y-2 my-3 flex-1 flex flex-col justify-center w-full">
                  {unit.id === 'unit_00' ? (
                    <>
                      {/* Big Title text: "總說" */}
                      <h4 className="font-black text-xl md:text-2xl text-[#C48C46] tracking-wide">
                        {unit.num}
                      </h4>
                      {/* Subtitle: "| 凝視生命的地圖" */}
                      <p className="text-xs md:text-sm text-[#4E3629] leading-snug font-black">
                        {unit.subtitle}
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Big Number: e.g. "01" */}
                      <span className={`text-2xl md:text-3xl font-black ${unit.colorClasses.accentText} tracking-wider font-mono`}>
                        {unit.num}
                      </span>
                      {/* Title text: "哲學思考" */}
                      <h4 className="font-black text-base md:text-lg text-[#2D1B10] leading-snug">
                        {unit.title}
                      </h4>
                      {/* Subtitle text: "品嚐思考的樂趣" */}
                      <p className="text-xs md:text-sm text-[#5C4033] leading-snug font-extrabold mt-0.5">
                        {unit.subtitle}
                      </p>
                    </>
                  )}
                </div>

                {/* View content interactive button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnitClick(unit.id);
                  }}
                  className={`w-full py-2 border-2 ${unit.colorClasses.btnBorder} rounded-2xl text-xs md:text-sm font-black ${unit.colorClasses.accentText} bg-white hover:bg-slate-50 transition-all shadow-2xs cursor-pointer active:scale-98`}
                >
                  查看內容
                </button>
              </div>
            ))}
          </div>
        </div>



      </div>

      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#4A321F] text-[#FDF9F3] border border-[#EAD5C3] px-5 py-3 rounded-2xl shadow-xl font-extrabold text-sm z-50 flex items-center gap-2 animate-bounce">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
