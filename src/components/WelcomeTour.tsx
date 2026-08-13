/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  UserCheck,
  Map,
  GraduationCap,
  Compass,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  Gamepad2
} from 'lucide-react';
import { UserProfile } from '../types';

interface WelcomeTourProps {
  currentUser: UserProfile | null;
  onStartLogin?: () => void;
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

  /* ==========================================================================
     導覽內容
     ---------------------------------------------------------------------------
     這裡寫的每一句都要跟平台現況對得上。2026-08-13 重寫過一次，因為舊版
     還在介紹已經不存在的東西（10 款小遊戲、WOOP 成長表單、關鍵字牆），
     單元 05 的名字也是錯的。改內容之前先確認：
       ・導覽列真正有哪些分頁 → App.tsx 的 navItems
       ・六個單元的正式名稱   → HomeTab.tsx 的 unitCards
       ・遊戲現在有幾款       → HomeTab.tsx 的 GAMES（目前是 0，只剩心靈迷宮）
     ========================================================================== */

  // 1. 未登入訪客看到的導覽
  const guestSteps: TourStep[] = [
    {
      title: '歡迎來到泰宇生命教育互動平台',
      subtitle: '課本、遊戲、紀錄，都在同一個地方',
      description: '這是為高中生命教育設計的數位學習平台。六個單元的數位課本、一款走完就會把課本主題想過一遍的推理遊戲，還有會把你寫下的每一句話留起來的學習紀錄。不用登入也可以先逛一圈。',
      badge: '首頁啟航',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Compass,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="relative w-full h-44 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E0] rounded-2xl border-2 border-orange-100 flex items-center justify-center overflow-hidden p-6">
          <div className="absolute top-2 left-2 w-16 h-16 bg-orange-300/10 rounded-full blur-xl" />
          <div className="absolute bottom-2 right-2 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />
          <div className="text-center space-y-3 z-10">
            <div className="inline-flex p-3 bg-white rounded-full shadow-lg text-orange-500">
              <Compass className="w-11 h-11" />
            </div>
            <p className="text-sm font-black text-[#5D4037]">泰宇生命教育 ‧ 行動學習地圖</p>
            <div className="flex gap-2 justify-center">
              <span className="text-xs bg-orange-500 text-white font-black px-2.5 py-1 rounded-md">數位課本</span>
              <span className="text-xs bg-amber-500 text-white font-black px-2.5 py-1 rounded-md">心靈迷宮</span>
              <span className="text-xs bg-rose-500 text-white font-black px-2.5 py-1 rounded-md">學習紀錄</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '六個單元，對應你手上的課本',
      subtitle: '總說，加上五個核心素養',
      description: '從「總說：凝視生命的地圖」開始，接著是哲學思考、人學探索、終極關懷、價值思辨，最後是靈性修養與人格統整。在首頁的「選擇單元」點任何一張卡的「查看內容」，就會進到那個單元的數位課本。',
      badge: '單元架構',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600 border-amber-200',
      icon: BookOpen,
      iconColor: 'text-amber-500',
      graphic: (
        <div className="w-full h-44 bg-slate-50 rounded-2xl border-2 border-slate-100 p-4 flex flex-col justify-center space-y-3">
          <span className="text-xs font-black text-slate-500 tracking-wider block text-center">六個單元</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '總說', name: '生命地圖', icon: '📖', color: 'bg-[#FFF0DF] border-[#F1E0CE] text-[#C48C46]' },
              { id: '01', name: '哲學思考', icon: '💡', color: 'bg-[#E5F1FF] border-[#CCE1FB] text-[#1D4ED8]' },
              { id: '02', name: '人學探索', icon: '🔍', color: 'bg-[#EAF7EA] border-[#CDE7CD] text-[#2E7D32]' },
              { id: '03', name: '終極關懷', icon: '🧭', color: 'bg-[#FFF0F5] border-[#FCDCE6] text-[#D81B60]' },
              { id: '04', name: '價值思辨', icon: '⚖️', color: 'bg-[#F3E8FF] border-[#E9D5FF] text-[#7E22CE]' },
              { id: '05', name: '靈性修養', icon: '🕯️', color: 'bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]' }
            ].map((u) => (
              <div key={u.id} className={`flex flex-col items-center p-2 rounded-xl border-2 ${u.color} shadow-xs`}>
                <span className="text-lg leading-none">{u.icon}</span>
                <span className="text-[11px] font-black mt-1">{u.id}</span>
                <span className="text-[10px] font-bold opacity-70">{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '心靈迷宮：走完就把課本想過一遍',
      subtitle: '五扇門，一扇對應一個核心素養',
      description: '首頁最上面那張黑底卡片點下去就開始。每一關先看一段劇情，接著用「心象測驗」問自己幾個沒有對錯的問題，然後把散落的思考碎片排成一條論證的順序、鑄出鑰匙開門。過關後寫下你的反思，那一關的角色會回你一段話。',
      badge: '心靈迷宮',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Gamepad2,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="w-full h-44 bg-[#0B1220] rounded-2xl border-2 border-amber-500/25 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-lg border border-amber-300/40 bg-amber-300/10 text-amber-200">
              LIFE EDUCATION QUEST
            </span>
            <span className="text-[10px] font-bold text-slate-400">五扇門</span>
          </div>
          <div className="flex justify-center gap-1.5">
            {['哲學', '人學', '關懷', '價值', '靈性'].map((g, i) => (
              <div key={g} className={`flex-1 rounded-lg border py-2 text-center ${i === 0 ? 'border-amber-400/60 bg-amber-400/10' : 'border-white/10 bg-white/5'}`}>
                <div className={`text-base leading-none ${i === 0 ? 'text-amber-300' : 'text-slate-500'}`}>⌘</div>
                <div className={`text-[10px] font-bold mt-1 ${i === 0 ? 'text-amber-200' : 'text-slate-500'}`}>{g}</div>
              </div>
            ))}
          </div>
          <p className="text-[10.5px] font-bold text-slate-400 text-center leading-relaxed">
            劇情 → 心象測驗 → 鑄鑰開門 → 反思，角色會回你的話
          </p>
        </div>
      )
    },
    {
      title: '登入之後，寫的東西才留得住',
      subtitle: '課堂體驗帳號免密碼，點頭像就進去',
      description: '按右上角的「登入系統」。展開下面的「課堂體驗帳號」，有兩個免密碼的角色可以直接點：學生陳可華、老師林老師。其他角色（王小文、王博鈞、張曉萍）一樣能用，帳號就是他們的英文名、密碼都是 123。',
      badge: '登入系統',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-600 border-blue-200',
      icon: UserCheck,
      iconColor: 'text-blue-500',
      graphic: (
        <div className="w-full h-44 bg-gradient-to-tr from-[#F0F7FF] to-[#E5F1FF] rounded-2xl border-2 border-blue-100 p-4 flex flex-col items-center justify-center gap-3">
          <span className="text-xs font-black text-slate-500">課堂體驗帳號（免密碼）</span>
          <div className="flex items-center justify-center gap-6">
            {[
              { name: '陳可華', role: '學生', emoji: '👦🏻', bg: 'bg-amber-100' },
              { name: '林老師', role: '老師', emoji: '👩🏻‍🏫', bg: 'bg-indigo-100' }
            ].map((item) => (
              <div key={item.name} className="flex flex-col items-center bg-white p-3 rounded-2xl shadow-xs border-2 border-blue-50 w-24">
                <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center text-2xl mb-1.5 border border-white/80 shadow-md`}>
                  {item.emoji}
                </div>
                <span className="text-sm font-black text-slate-800">{item.name}</span>
                <span className="text-[11px] font-bold text-slate-400 mt-0.5">{item.role}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '老師登入後會多兩個分頁',
      subtitle: '學習紀錄、課堂工具箱、學習統計',
      description: '用帳號 teacher、密碼 123 登入（或直接點「林老師」）。導覽列會多出「工具箱」和「學習統計」：學習紀錄看得到全班每個單元的進度，工具箱有隨機抽人這類上課現場會用到的小工具，學習統計是整班的完成度圖表。',
      badge: '教師端',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-600 border-indigo-200',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      graphic: (
        <div className="w-full h-44 bg-slate-900 text-slate-100 rounded-2xl border-2 border-slate-800 p-4 flex flex-col justify-between text-xs">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
            <span className="font-extrabold text-[#EA9A3E]">👩🏻‍🏫 林老師 ‧ 教師端</span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">已登入</span>
          </div>
          <div className="flex gap-2">
            {[
              { n: '學習紀錄', d: '全班進度' },
              { n: '工具箱', d: '隨機抽人' },
              { n: '學習統計', d: '完成度圖表' }
            ].map(t => (
              <div key={t.n} className="flex-1 bg-slate-800/70 border border-slate-700/60 rounded-xl p-2 text-center">
                <div className="font-black text-slate-100 text-[11px]">{t.n}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{t.d}</div>
              </div>
            ))}
          </div>
          <p className="text-[10.5px] text-slate-400 text-center font-bold">
            帳號 teacher ／ 密碼 123
          </p>
        </div>
      )
    }
  ];

  // 2. 已登入的人看到的導覽
  const isTeacherUser = currentUser?.role === 'teacher';

  const userSteps: TourStep[] = [
    {
      title: `歡迎回來，${currentUser?.name || '學習者'}！`,
      subtitle: '從這裡開始都會被記下來',
      description: '你已經進到自己的空間了。接下來讀的課本進度、在遊戲裡寫的反思、每一次的作答，都會存進你的帳號，換一台電腦登入一樣看得到。',
      badge: '個人空間',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Compass,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="w-full h-44 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1E0] rounded-2xl border-2 border-orange-100 flex items-center gap-4 p-5">
          <div className="w-20 h-20 rounded-full bg-orange-100 border-4 border-white flex items-center justify-center text-4xl shadow-md shrink-0">
            {currentUser?.avatarEmoji || '👦🏻'}
          </div>
          <div className="space-y-1.5 text-left">
            <div className="bg-orange-500 text-white text-[11px] font-black px-3 py-1 rounded-full inline-block">
              {isTeacherUser ? '教師端' : '學生'}
            </div>
            <h4 className="text-base font-black text-[#5D4037]">{currentUser?.name}</h4>
            <p className="text-xs text-slate-500 font-bold">寫下的內容會跟著帳號走</p>
          </div>
        </div>
      )
    },
    {
      title: '課本單元：跟實體課本對照著讀',
      subtitle: '六個單元，讀到哪裡系統會記得',
      description: '導覽列的「課本單元」是數位課本。左邊選單元、右邊翻頁，每一頁都有對應的情境圖文。翻頁的時候閱讀進度會自動更新，下次回來接著讀就好。',
      badge: '數位課本',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600 border-amber-200',
      icon: Map,
      iconColor: 'text-amber-500',
      graphic: (
        <div className="w-full h-44 bg-white rounded-2xl border-2 border-slate-100 p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
            <span className="text-xs font-bold text-slate-500">單元 03：終極關懷</span>
            <span className="text-xs text-[#E65100] font-black bg-orange-50 border border-orange-100 px-2 py-0.5 rounded">p.079</span>
          </div>
          <div className="flex gap-2 items-start py-2">
            <span className="text-2xl">💡</span>
            <p className="text-xs text-slate-600 leading-relaxed font-bold line-clamp-2">
              「人生不是要活得完美，而是要活得有意義。」
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
      title: '心靈迷宮：五扇門與角色的回話',
      subtitle: '劇情 → 心象測驗 → 鑄鑰 → 反思',
      description: '首頁最上面那張黑底卡片點「開始遊戲」。每一關先看劇情，再用「心象測驗」問自己幾個沒有對錯的問題，接著把思考碎片排成一條論證順序、鑄出鑰匙開門。最後寫下反思，那一關的角色會讀你寫的東西、回你一段話，還會再追問。',
      badge: '心靈迷宮',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600 border-orange-200',
      icon: Gamepad2,
      iconColor: 'text-orange-500',
      graphic: (
        <div className="w-full h-44 bg-[#0B1220] rounded-2xl border-2 border-amber-500/25 p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-300 text-sm shrink-0">◈</div>
            <div>
              <div className="text-[11px] font-black text-amber-200 leading-none">張曉萍</div>
              <div className="text-[10px] text-slate-500 mt-0.5">同學</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            你說「我只是懶得吵而已」。<br />
            我看得懂這種感覺，我也常常這樣。<br />
            那個詞是誰先講的？
          </p>
          <p className="text-[10px] text-slate-500 text-center font-bold">寫完反思，角色會回你的話</p>
        </div>
      )
    },
    {
      title: '學習紀錄：你寫過的都在這裡',
      subtitle: '一句一句累積起來的成長軌跡',
      description: isTeacherUser
        ? '「學習紀錄」看得到全班每個學生 × 每個單元的進度一覽，點任何一格就能直接跳到那份作答去批改與回覆。'
        : '「學習紀錄」會把你在課本和遊戲裡寫過的每一段整理起來，照單元排好。回頭看的時候，最有感覺的通常是自己幾個禮拜前寫的那幾句。',
      badge: '學習紀錄',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-600 border-emerald-200',
      icon: FileText,
      iconColor: 'text-emerald-500',
      graphic: (
        <div className="w-full h-44 bg-white rounded-2xl border-2 border-emerald-100 p-4 flex flex-col justify-between">
          <span className="text-xs font-black text-emerald-700">
            {isTeacherUser ? '全班 × 單元 進度一覽' : '我的成長紀錄'}
          </span>
          <div className="space-y-2">
            {[
              { u: '總說', q: '原本想問為什麼，最後說了都可以' },
              { u: '第二扇門', q: '大家都說我很乖，可是我只是懶得吵' }
            ].map(r => (
              <div key={r.u} className="bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-2">
                <div className="text-[10px] font-black text-emerald-700">{r.u}</div>
                <div className="text-[11px] text-slate-600 font-bold truncate">{r.q}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 text-center font-bold">
            {isTeacherUser ? '點任一格直接進去批改' : '同學看不到，只有你和老師看得到'}
          </p>
        </div>
      )
    },
    {
      title: isTeacherUser ? '課堂工具箱與學習統計' : '人物介紹：先認識這幾個人',
      subtitle: isTeacherUser ? '上課現場會用到的兩個分頁' : '課本和遊戲裡都會遇到他們',
      description: isTeacherUser
        ? '「工具箱」放的是上課現場的小工具，例如隨機抽人。「學習統計」是整班的完成度圖表，可以一眼看出哪個單元卡住了。右上角的「評閱」下拉可以切換你正在看哪一位學生的空間。'
        : '「人物介紹」有陳可華、王小文、王博鈞、張曉萍和家人的角色卡與關係圖。這幾個人在課本的情境故事、遊戲的劇情裡都會出現，先認識他們，讀起來會比較有感覺。',
      badge: isTeacherUser ? '教師工具' : '角色故事',
      badgeBg: isTeacherUser ? 'bg-indigo-50' : 'bg-rose-50',
      badgeText: isTeacherUser ? 'text-indigo-600 border-indigo-200' : 'text-rose-600 border-rose-200',
      icon: isTeacherUser ? GraduationCap : UserCheck,
      iconColor: isTeacherUser ? 'text-indigo-500' : 'text-rose-500',
      graphic: isTeacherUser ? (
        <div className="w-full h-44 bg-slate-900 text-slate-100 rounded-2xl border-2 border-slate-800 p-4 flex flex-col justify-between text-xs">
          <span className="font-extrabold text-[#EA9A3E]">教師專用分頁</span>
          <div className="flex gap-2">
            {[
              { n: '工具箱', d: '隨機抽人等現場工具' },
              { n: '學習統計', d: '各單元完成度圖表' }
            ].map(t => (
              <div key={t.n} className="flex-1 bg-slate-800/70 border border-slate-700/60 rounded-xl p-3 text-center">
                <div className="font-black text-slate-100 text-[12px]">{t.n}</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{t.d}</div>
              </div>
            ))}
          </div>
          <p className="text-[10.5px] text-slate-400 text-center font-bold">右上角「評閱」可切換學生空間</p>
        </div>
      ) : (
        <div className="w-full h-44 bg-gradient-to-tr from-[#FFF0F2] to-[#FFE4E6] rounded-2xl border-2 border-rose-100 p-4 flex items-center justify-around">
          {[
            { name: '陳可華', role: '班長', emoji: '👦🏻' },
            { name: '王小文', role: '博士', emoji: '👧🏻' },
            { name: '張曉萍', role: '同學', emoji: '👩🏻' }
          ].map((item) => (
            <div key={item.name} className="flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-xs border-2 border-rose-50 w-24">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl mb-1.5 border border-white/80 shadow-md">
                {item.emoji}
              </div>
              <span className="text-sm font-black text-slate-800">{item.name}</span>
              <span className="text-[11px] font-bold text-slate-400 mt-0.5">{item.role}</span>
            </div>
          ))}
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
            
            {/* 只放標籤。頁碼原本擺在這一列的右邊，會被右上角的 ✕ 壓住
                （✕ 是 absolute 定位、蓋在內容上），所以移到底部跟進度點放一起。 */}
            <div className="pr-12">
              <span className={`inline-block text-xs font-black tracking-widest px-3.5 py-1.5 rounded-full border-2 ${activeStepData.badgeBg} ${activeStepData.badgeText}`}>
                {activeStepData.badge}
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
            {/* 進度點 ＋ 頁碼（頁碼從右上角移下來，那裡被 ✕ 佔著）*/}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    aria-label={`第 ${idx + 1} 頁`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentStep ? 'w-6 bg-orange-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-slate-400 tabular-nums">
                {currentStep + 1} / {steps.length}
              </span>
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
