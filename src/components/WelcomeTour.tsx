/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  Map, 
  GraduationCap, 
  Award, 
  Compass, 
  FileText, 
  X, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  Target,
  MessageSquare,
  Gamepad2,
  QrCode
} from 'lucide-react';
import { UserProfile } from '../types';

interface WelcomeTourProps {
  currentUser: UserProfile | null;
  onStartLogin?: (role: 'student' | 'teacher') => void;
  isOpen: boolean;
  onClose: () => void;
  isManualTrigger?: boolean;
}

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  graphic: React.ReactNode;
}

export default function WelcomeTour({ 
  currentUser, 
  onStartLogin, 
  isOpen, 
  onClose,
  isManualTrigger = false
}: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Determine tour mode: 'guest' (unlogged-in) or 'user' (logged-in)
  const mode = currentUser ? 'user' : 'guest';

  // Reset step counter whenever the tour opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // 1. TOUR STEPS FOR UNLOGGED-IN VISITORS (GUEST TOUR) - MUCH BIGGER FONTS
  const guestSteps: TourStep[] = [
    {
      title: '歡迎探索生命教育互動平台',
      subtitle: '開啟一段與生命的深度對話',
      description: '這是一套專門為高中生命教育設計的數位互動學習系統。透過課本故事、思辨遊戲、生活實踐與多元成長表單，引導學生在有趣的任務中思索生命的終極意義。',
      badge: '首頁啟航',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Compass,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="relative w-full h-44 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E0] rounded-2xl border-2 border-orange-150 flex items-center justify-center overflow-hidden p-6">
          <div className="absolute top-2 left-2 w-16 h-16 bg-orange-300/10 rounded-full blur-xl" />
          <div className="absolute bottom-2 right-2 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />
          <div className="text-center space-y-3 z-10">
            <div className="inline-flex p-3 bg-white rounded-full shadow-lg text-orange-500 animate-bounce">
              <Compass className="w-12 h-12" />
            </div>
            <p className="text-sm font-black text-[#5D4037]">✨ 泰宇生命教育 ‧ 行動學習地圖 ✨</p>
            <div className="flex gap-2 justify-center">
              <span className="text-xs bg-orange-500 text-white font-black px-2.5 py-1 rounded-md">哲學思考</span>
              <span className="text-xs bg-amber-500 text-white font-black px-2.5 py-1 rounded-md">人學探索</span>
              <span className="text-xs bg-rose-500 text-white font-black px-2.5 py-1 rounded-md">終極關懷</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '精心設計的六大單元課程',
      subtitle: '從凝視生命地圖開始出發',
      description: '首頁展示了完整的課程架構，包含：總說（凝視生命地圖）、單元1（哲學思考）、單元2（人學探索）、單元3（終極關懷）、單元4（價值思辨）、與單元5（身體與科技）。點擊即可進入數位課本世界！',
      badge: '單元架構',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600 border-amber-200',
      icon: BookOpen,
      iconColor: 'text-amber-500',
      graphic: (
        <div className="w-full h-44 bg-slate-50 rounded-2xl border-2 border-slate-100 p-4 flex flex-col justify-center space-y-3">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">單元快速選擇導覽</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '總說', icon: '📖', color: 'bg-[#FFF0DF] border-[#F1E0CE] text-[#C48C46]' },
              { id: '01', icon: '💡', color: 'bg-[#E5F1FF] border-[#CCE1FB] text-[#1D4ED8]' },
              { id: '02', icon: '🔍', color: 'bg-[#EAF7EA] border-[#CDE7CD] text-[#2E7D32]' },
              { id: '03', icon: '🧭', color: 'bg-[#FFF0F5] border-[#FCDCE6] text-[#D81B60]' },
              { id: '04', icon: '⚖️', color: 'bg-[#F3E8FF] border-[#E9D5FF] text-[#7E22CE]' },
              { id: '05', icon: '🎨', color: 'bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]' }
            ].map((u) => (
              <div key={u.id} className={`flex flex-col items-center p-2 rounded-xl border-2 ${u.color} shadow-xs`}>
                <span className="text-xl">{u.icon}</span>
                <span className="text-xs font-black">{u.id}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '互動遊戲 ‧ 班級同樂大廳',
      subtitle: '10 款生命教育主題小遊戲，課堂立即開玩',
      description: '「互動遊戲」分頁準備了 10 款主題遊戲：心理測驗 MBTI、生命拼圖地圖、情境選擇大冒險、人際關係連連看、價值天平排序戰、生命故事翻翻卡、感恩泡泡站、哲學辯論快攻、心情溫度計、成長徽章挑戰賽。老師掃描班級 QR Code 讓學生加入，就能一起同步進行課堂遊戲！',
      badge: '互動遊戲',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Gamepad2,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="w-full h-44 bg-white rounded-2xl border-2 border-slate-100 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" /> 班級代碼 4A28</span>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">已加入 32/40</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 py-2">
            {['MBTI', '🧩', '🧭', '🕸️', '⚖️', '🎴', '🧼', '🗣️', '🌡️', '🏆'].map((label, idx) => (
              <div key={idx} className="aspect-square rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600">
                {idx < 9 ? label : label}
              </div>
            ))}
          </div>
          <p className="text-[11px] font-bold text-slate-400 text-center">共 10 款課堂專用互動遊戲</p>
        </div>
      )
    },
    {
      title: '專屬學生入口 ‧ 扮演生命角色',
      subtitle: '與課本中的學習夥伴一同成長',
      description: '點擊「學生入口」登入。平台內置多位各具性格的預設學生角色（陳可華、王博鈞、王小文、張曉萍）。登入後，你將化身其中一位夥伴，一邊閱讀他們的生命故事，一邊寫下你自己的思辨解答。',
      badge: '學生角色',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-600 border-blue-200',
      icon: UserCheck,
      iconColor: 'text-blue-500',
      graphic: (
        <div className="w-full h-44 bg-gradient-to-tr from-[#F0F7FF] to-[#E5F1FF] rounded-2xl border-2 border-blue-100 p-4 flex items-center justify-around">
          {[
            { name: '陳可華', role: '熱血少年', emoji: '👦🏻', bg: 'bg-amber-100' },
            { name: '張曉萍', role: '氣質少女', emoji: '👩🏻', bg: 'bg-rose-100' },
            { name: '王博鈞', role: '體育健將', emoji: '🏀', bg: 'bg-blue-100' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-xs border-2 border-blue-50 w-24">
              <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center text-xl font-bold mb-1.5 border border-white/80 shadow-md`}>
                {item.emoji}
              </div>
              <span className="text-sm font-black text-slate-800">{item.name}</span>
              <span className="text-xs font-bold text-slate-400 mt-0.5">{item.role}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: '教師評閱與深度引導端',
      subtitle: '一對一的靈魂對話與統計分析',
      description: '老師可以使用預設帳號 teacher / 密碼 123 登入。教師端能即時觀看全班的「學習統計圖表」、各單元閱讀覆蓋率，並針對學生的 WOOP 成長表單、思辨遊戲成果進行最即時的線上給分與引導評語。',
      badge: '教師後台',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-600 border-indigo-200',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      graphic: (
        <div className="w-full h-44 bg-slate-900 text-slate-100 rounded-2xl border-2 border-slate-800 p-4 flex flex-col justify-between font-mono text-xs">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
            <span className="font-extrabold text-[#EA9A3E] flex items-center gap-1">👩🏻‍🏫 教師評閱工作區</span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">系統就緒</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between border-b border-slate-800/40 pb-1">
              <span>📊 課程地圖總讀完率：</span>
              <span className="text-amber-400 font-bold">85.4%</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/40 pb-1">
              <span>📝 已提交思辨任務數：</span>
              <span className="text-indigo-400 font-bold">24 件</span>
            </div>
            <div className="flex justify-between">
              <span>📬 待批改 WOOP 表單：</span>
              <span className="text-rose-400 font-bold">3 件</span>
            </div>
          </div>
          <div className="bg-slate-800/80 p-1.5 rounded text-slate-300 border border-slate-700/50 leading-relaxed text-[11px]">
            林老師評語：「可華寫得很好！看見你對未來的實踐計畫非常周詳，加油！」
          </div>
        </div>
      )
    }
  ];

  // 2. TOUR STEPS FOR LOGGED-IN USERS (USER MEMBER TOUR) - MUCH BIGGER FONTS
  const userSteps: TourStep[] = [
    {
      title: `歡迎回來，${currentUser?.name || '學習者'}！`,
      subtitle: '踏上專屬的生命反思旅程',
      description: '太棒了！你已成功進入你的專屬學習空間。在這裡，你的所有學習足跡，包括數位課本閱讀進度、思辨問卷提交、以及獲取的勳章，都將會完美儲存。讓我們先來了解如何使用這個平台吧！',
      badge: '個人化空間',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Compass,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="w-full h-44 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1E0] rounded-2xl border-2 border-orange-100 flex items-center gap-4 p-5">
          <div className="w-20 h-20 rounded-full bg-orange-100 border-4 border-white flex items-center justify-center text-4xl shadow-md shrink-0 animate-pulse">
            {currentUser?.avatarEmoji || '👦🏻'}
          </div>
          <div className="space-y-1.5 text-left">
            <div className="bg-orange-500 text-white text-[11px] font-black px-3 py-1 rounded-full inline-block">
              {currentUser?.role === 'student' ? '生命探索生' : '引導導師'}
            </div>
            <h4 className="text-base font-black text-[#5D4037]">{currentUser?.name}</h4>
            <p className="text-xs text-slate-500 font-bold">✨ 系統已為你啟動百分之百持久化雲端儲存</p>
          </div>
        </div>
      )
    },
    {
      title: '智慧課程地圖 ‧ 精緻數位課本',
      subtitle: '流暢的頁面閱讀與精美圖表',
      description: '在「課程地圖」中，你可以閱讀與實體課本完全對應的精美數位教材。每頁都配有生動的情境圖文。底部的分頁控制列會自動追蹤你的進度，點擊「下一頁」即可同步更新你的閱讀覆蓋率！',
      badge: '數位閱讀',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600 border-amber-200',
      icon: Map,
      iconColor: 'text-amber-500',
      graphic: (
        <div className="w-full h-44 bg-white rounded-2xl border-2 border-slate-100 p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
            <span className="text-xs font-bold text-slate-500">單元 03：終極關懷 ‧ 課本導覽</span>
            <span className="text-xs text-[#E65100] font-black bg-orange-50 border border-orange-100 px-2 py-0.5 rounded">p.079</span>
          </div>
          <div className="flex gap-2 items-start py-2">
            <span className="text-2xl">💡</span>
            <p className="text-xs text-slate-600 leading-relaxed font-bold line-clamp-2">
              「人生不是要活得完美，而是要活得有意義。即使沒有雙手雙腳，我依然可以擁抱這個世界。」—— 力克‧胡哲
            </p>
          </div>
          <div className="flex items-center justify-between border-t-2 border-slate-50 pt-2 text-xs font-bold text-slate-400">
            <span className="text-slate-500">← 上一頁</span>
            <div className="flex gap-1.5">
              <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-600">12</span>
              <span className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white font-bold">13</span>
              <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-600">14</span>
            </div>
            <span className="text-orange-600 font-black">下一頁 →</span>
          </div>
        </div>
      )
    },
    {
      title: '互動遊戲 ‧ 班級同樂大廳',
      subtitle: '10 款主題遊戲，隨時開玩、隨時複習',
      description: '點選導覽列的「互動遊戲」，就能進入班級同樂大廳。裡面有 10 款生命教育主題遊戲，涵蓋性格測驗、情境抉擇、人際關係、價值排序、記憶配對、感恩留言、哲學辯論、心情紀錄與成長徽章，每一款都能單獨遊玩，也能跟全班同步進行！',
      badge: '互動遊戲',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Gamepad2,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="w-full h-44 bg-white rounded-2xl border-2 border-slate-100 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
            <span className="text-xs font-bold text-slate-500">課堂專用互動遊戲（共 10 款）</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 py-2">
            {['MBTI', '🧩', '🧭', '🕸️', '⚖️', '🎴', '🧼', '🗣️', '🌡️', '🏆'].map((label, idx) => (
              <div key={idx} className="aspect-square rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600">
                {label}
              </div>
            ))}
          </div>
          <p className="text-[11px] font-bold text-slate-400 text-center">點擊任一款「進入遊戲」即可開始</p>
        </div>
      )
    },
    {
      title: '實踐科學：WOOP 成長表單',
      subtitle: '將生命思辨落實到日常行動中',
      description: '「成長表單」頁面整合了廣受心理學界推崇的 WOOP 實踐架構：Wish (願望) ➔ Outcome (結果) ➔ Obstacle (障礙) ➔ Plan (計畫)。透過科學化的步驟設計，引導你將空泛的理想化為能具體實踐的生活方案！',
      badge: 'WOOP表單',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-600 border-emerald-200',
      icon: FileText,
      iconColor: 'text-emerald-500',
      graphic: (
        <div className="w-full h-44 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl border-2 border-emerald-100 p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">實踐目標</span>
            <span className="text-sm font-black text-[#1B5E20]">WOOP 願景計畫表</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { t: 'W', desc: '願望 Wish', c: 'bg-white border-emerald-200 text-emerald-800' },
              { t: 'O', desc: '結果 Outcome', c: 'bg-white border-emerald-200 text-emerald-800' },
              { t: 'O', desc: '障礙 Obstacle', c: 'bg-white border-emerald-200 text-emerald-800' },
              { t: 'P', desc: '計畫 Plan', c: 'bg-white border-emerald-200 text-emerald-800' }
            ].map((step, idx) => (
              <div key={idx} className={`border-2 p-1.5 rounded-xl flex flex-col items-center ${step.c} shadow-xs`}>
                <span className="text-sm font-black">{step.t}</span>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap scale-90">{step.desc.split(' ')[1]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#2E7D32] bg-white/70 px-2.5 py-1.5 rounded-xl border border-white/50 text-center font-bold">
            💡「如果遭遇障礙，我就會執行計畫...」
          </p>
        </div>
      )
    },
    {
      title: '趣味思辨問卷 ‧ 關鍵字願景牆',
      subtitle: '表達你的想法，與全班相互激勵',
      description: '每個單元結束時都有設計精緻的互動思辨挑戰。完成 WOOP 願景計畫後，你可以將自己的生命一字寬 (生命關鍵字) 與一言以蔽之 (願望宣言) 發布至全班的「關鍵字牆」，看見同學們五彩斑斕的生命軌跡！',
      badge: '思辨與社群',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-600 border-purple-200',
      icon: MessageSquare,
      iconColor: 'text-purple-500',
      graphic: (
        <div className="w-full h-44 bg-slate-50 rounded-2xl border-2 border-slate-200 p-3 flex flex-col justify-between">
          <span className="text-xs font-black text-slate-500 block text-center">✨ 全班生命關鍵字願景牆 ✨</span>
          <div className="flex flex-wrap gap-2 justify-center py-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-amber-200 rotate-1 shadow-xs">🌱 溫柔成長</span>
            <span className="bg-rose-100 text-rose-800 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-rose-200 -rotate-2 shadow-xs">🎨 繽紛多姿</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-blue-200 rotate-2 shadow-xs">🏀 永不放棄</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-emerald-200 -rotate-1 shadow-xs">🕯️ 真誠關懷</span>
          </div>
          <p className="text-[10px] text-slate-400 text-center">每位同學完成 WOOP 提交後，會自動顯現在大螢幕上喔！</p>
        </div>
      )
    },
    {
      title: '解鎖榮耀勳章 ‧ 累積學習成就',
      subtitle: '記錄每一次進步，看見成長的痕跡',
      description: '隨著你在課堂中主動閱讀、真誠提交思辨問卷和 WOOP 表單，你將會解鎖各種獨一無二的「榮譽勳章」（如：深度思辨者、行動實踐派、全能探索家等）。點擊大頭照還能上傳或更換最有個性的個人照！',
      badge: '成就榮譽',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-600 border-rose-200',
      icon: Award,
      iconColor: 'text-rose-500',
      graphic: (
        <div className="w-full h-44 bg-gradient-to-tr from-[#FFF0F2] to-[#FFE4E6] rounded-2xl border-2 border-rose-100 p-4 flex items-center justify-around">
          <div className="flex flex-col items-center bg-white border-2 border-rose-100 p-2 rounded-xl shadow-xs w-20 text-center">
            <span className="text-3xl">🧠</span>
            <span className="text-[10px] font-black text-slate-800 mt-1 whitespace-nowrap">深度思辨者</span>
          </div>
          <div className="flex flex-col items-center bg-white border-2 border-amber-100 p-2.5 rounded-xl shadow-md w-24 text-center scale-110 -rotate-3 relative">
            <span className="absolute -top-1.5 -right-1.5 text-sm">⭐</span>
            <span className="text-4xl">🏃🏻</span>
            <span className="text-xs font-black text-slate-800 mt-1 whitespace-nowrap font-extrabold">行動實踐派</span>
          </div>
          <div className="flex flex-col items-center bg-white border-2 border-rose-100 p-2 rounded-xl shadow-xs w-20 text-center">
            <span className="text-3xl">✨</span>
            <span className="text-[10px] font-black text-slate-800 mt-1 whitespace-nowrap">生命探索家</span>
          </div>
        </div>
      )
    }
  ];

  const steps = mode === 'user' ? userSteps : guestSteps;
  const activeStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Save state to localStorage to avoid repetitive auto-popups
    if (mode === 'guest') {
      localStorage.setItem('life_edu_seen_guest_tour', 'true');
    } else if (currentUser) {
      localStorage.setItem(`life_edu_seen_user_tour_${currentUser.id}`, 'true');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleComplete}
          className="fixed inset-0 bg-[#3E2723]/60 backdrop-blur-md"
        />

        {/* Core Tour Box - enlarged for readability */}
        <motion.div 
          initial={{ scale: 0.92, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 15, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white w-full max-w-xl rounded-[32px] border-3 border-[#F1E0CE] shadow-2xl overflow-hidden flex flex-col z-50"
        >
          {/* Top colored aesthetic bar */}
          <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500" />

          {/* Close button */}
          <button 
            onClick={handleComplete}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer z-50 bg-white border border-gray-100 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Core Content area */}
          <div className="p-7 md:p-9 space-y-6 flex-1 overflow-y-auto">
            
            {/* Header section with step indicator */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black tracking-widest px-3.5 py-1.5 rounded-full border-2 ${activeStepData.badgeBg} ${activeStepData.badgeText}`}>
                {activeStepData.badge}
              </span>
              <span className="text-sm font-black text-slate-400 font-sans">
                引導頁碼：{currentStep + 1} / {steps.length}
              </span>
            </div>

            {/* Visual Graphic Showcase Container */}
            <div className="relative">
              {activeStepData.graphic}
            </div>

            {/* Typography Section - much larger font sizes (圖四/太小看不清楚重新設計) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <activeStepData.icon className={`w-6 h-6 shrink-0 ${activeStepData.iconColor}`} />
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {activeStepData.title}
                </h3>
              </div>
              <h4 className="text-sm font-black text-[#EA9A3E] leading-none">
                {activeStepData.subtitle}
              </h4>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">
                {activeStepData.description}
              </p>
            </div>

          </div>

          {/* Footer Navigation Bar */}
          <div className="bg-slate-50 px-7 py-5 border-t-2 border-slate-100 flex items-center justify-between">
            {/* Progress dots indicator */}
            <div className="flex items-center gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-6 bg-orange-600' : 'w-2.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons - larger text sizes and padding */}
            <div className="flex items-center gap-3">
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="px-4 py-2.5 hover:bg-slate-200 text-slate-500 text-xs font-black rounded-xl transition-all cursor-pointer"
                >
                  跳過導覽
                </button>
              ) : null}

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2.5 border-2 border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>上一步</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{currentStep === steps.length - 1 ? '進入探索 ➔' : '下一步'}</span>
                  {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
