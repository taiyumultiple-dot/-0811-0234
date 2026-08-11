/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  Check, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  FileText, 
  Sparkles, 
  Bookmark, 
  X, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  HelpCircle,
  Video,
  Layers,
  Search,
  Compass,
  ArrowRight,
  Share2
} from 'lucide-react';
import { StudentSubmission } from '../types';
import UnitStudyView from './UnitStudyView';
import HumanologySelfIdentityQuizPage from './HumanologySelfIdentityQuizPage';

interface CourseMapTabProps {
  onNavigate: (tab: string, extra?: any) => void;
  selectedUnitId?: string;
  onSelectUnit?: (unitId: string) => void;
  submissions: StudentSubmission[];
  onChangeSubmissions: (subs: StudentSubmission[]) => void;
  activeStudentId: string;
  role: 'student' | 'teacher';
}

interface UnitDetailConfig {
  id: string;
  unitNum: string;
  navTitle: string;
  title: string;
  desc: string;
  iconEmoji: string;
  progressPercent: number;
  goals: string[];
  chapters: {
    id: string;
    num: number;
    title: string;
    subtitle: string;
    status: 'completed' | 'in_progress' | 'not_started';
    progress?: number;
    iconType: 'book' | 'users' | 'compass' | 'sign' | 'hand';
  }[];
  resources: {
    id: string;
    type: '影片' | '文章' | '活動';
    title: string;
    duration: string;
  }[];
  quizInfo: {
    title: string;
    totalQuestions: number;
    completedCount: number;
    totalCount: number;
    percent: number;
  };
}

const UNIT_CONFIGS: Record<string, UnitDetailConfig> = {
  unit_00: {
    id: 'unit_00',
    unitNum: '單元 01',
    navTitle: '單元 01  總說：凝視生命的地圖',
    title: '總說：凝視生命的地圖',
    desc: '探索生命教育的核心概念，開啟我們對生命的理解與關懷。',
    iconEmoji: '🖼️',
    progressPercent: 75,
    goals: [
      '理解生命教育的基本理念與價值',
      '認識生命的多元面向與意義',
      '培養對生命的尊重與關懷態度',
      '能反思個人生命經驗並表達'
    ],
    chapters: [
      {
        id: '00-1',
        num: 1,
        title: '生命教育的意義與價值',
        subtitle: '認識生命教育的定義、發展與重要性',
        status: 'completed',
        iconType: 'book'
      },
      {
        id: '00-2',
        num: 2,
        title: '生命的多元面向',
        subtitle: '探索生理、心理、社會、靈性等面向的生命',
        status: 'in_progress',
        progress: 60,
        iconType: 'users'
      },
      {
        id: '00-3',
        num: 3,
        title: '生命的探索與反思',
        subtitle: '透過提問與思考，理解生命的意義與方向',
        status: 'not_started',
        iconType: 'compass'
      },
      {
        id: '00-4',
        num: 4,
        title: '生命價值與抉擇',
        subtitle: '面對選擇與挑戰，建立正向的價值觀',
        status: 'not_started',
        iconType: 'sign'
      },
      {
        id: '00-5',
        num: 5,
        title: '關懷與實踐行動',
        subtitle: '將關懷化為行動，實踐對自己與他人的愛',
        status: 'not_started',
        iconType: 'hand'
      }
    ],
    resources: [
      { id: 'r0-1', type: '影片', title: '生命的旅程：一段探索之路', duration: '08:45' },
      { id: 'r0-2', type: '文章', title: '什麼是生命教育？', duration: '5 分鐘閱讀' },
      { id: 'r0-3', type: '活動', title: '生命地圖繪製活動', duration: '線上活動' }
    ],
    quizInfo: {
      title: '生命教育基礎測驗',
      totalQuestions: 15,
      completedCount: 2,
      totalCount: 3,
      percent: 66
    }
  },
  unit_01: {
    id: 'unit_01',
    unitNum: '單元 02',
    navTitle: '單元 02  哲學思考',
    title: '單元01：哲學思考——品嚐思考的樂趣',
    desc: '培養批判與反思能力，學習跳脫思考盲點與常見的邏輯謬誤。',
    iconEmoji: '💡',
    progressPercent: 90,
    goals: [
      '掌握基本邏輯推論與邏輯謬誤辨識',
      '培養思辨與批判性思考能力',
      '建立多元審視觀點，跳脫思考盲點',
      '學習理性溝通與對話技巧'
    ],
    chapters: [
      {
        id: '01-1',
        num: 1,
        title: '跳脫慣性、正確思考',
        subtitle: '認識思考的盲點與思維定型',
        status: 'completed',
        iconType: 'book'
      },
      {
        id: '01-2',
        num: 2,
        title: '思考的邏輯與方法',
        subtitle: '學習演繹與歸納推論法',
        status: 'completed',
        iconType: 'compass'
      },
      {
        id: '01-3',
        num: 3,
        title: '生活謬誤探測器',
        subtitle: '辨識常見邏輯謬誤與跟風心理',
        status: 'completed',
        iconType: 'sign'
      },
      {
        id: '01-4',
        num: 4,
        title: '哲學辯論與對話',
        subtitle: '透過蘇格拉底提問建立理性思辨',
        status: 'in_progress',
        progress: 80,
        iconType: 'users'
      }
    ],
    resources: [
      { id: 'r1-1', type: '影片', title: '思考的藝術：邏輯謬誤解析', duration: '10:20' },
      { id: 'r1-2', type: '文章', title: '如何進行批判性思考', duration: '8 分鐘閱讀' },
      { id: 'r1-3', type: '活動', title: '哲學思考快問快答', duration: '線上測驗' }
    ],
    quizInfo: {
      title: '哲學思辨邏輯測驗',
      totalQuestions: 15,
      completedCount: 3,
      totalCount: 3,
      percent: 100
    }
  },
  unit_02: {
    id: 'unit_02',
    unitNum: '單元 03',
    navTitle: '單元 03  人學探索',
    title: '單元02：人學探索——漫步奇幻的旅程',
    desc: '探索「人」是什麼，深入了解人性、自我價值與社會網絡。',
    iconEmoji: '👤',
    progressPercent: 65,
    goals: [
      '認識人性的多重面向與特質',
      '探索自我認同與內在優勢',
      '理解人與人之間的連結與同理心',
      '體會身心靈的平衡與正念覺察'
    ],
    chapters: [
      {
        id: '02-1',
        num: 1,
        title: '「人」是什麼？',
        subtitle: '從生物、心理與文化看人性',
        status: 'completed',
        iconType: 'book'
      },
      {
        id: '02-2',
        num: 2,
        title: '狼孩與人性的邊界',
        subtitle: '探討環境對人性發展的影響',
        status: 'completed',
        iconType: 'users'
      },
      {
        id: '02-3',
        num: 3,
        title: '探索自我與潛能',
        subtitle: '發現個人的獨特價值與天賦',
        status: 'in_progress',
        progress: 50,
        iconType: 'compass'
      },
      {
        id: '02-4',
        num: 4,
        title: '生命的網絡——你我他',
        subtitle: '建構健康的社會連結與支持',
        status: 'not_started',
        iconType: 'hand'
      }
    ],
    resources: [
      { id: 'r2-1', type: '影片', title: '人性的探索與同理', duration: '12:15' },
      { id: 'r2-2', type: '文章', title: '自我認同的追尋', duration: '6 分鐘閱讀' },
      { id: 'r2-3', type: '活動', title: '身心正念覺察體驗', duration: '線上練習' }
    ],
    quizInfo: {
      title: '人學與自我認同測驗',
      totalQuestions: 12,
      completedCount: 2,
      totalCount: 3,
      percent: 66
    }
  },
  unit_03: {
    id: 'unit_03',
    unitNum: '單元 04',
    navTitle: '單元 04  終極關懷',
    title: '單元03：終極關懷——旅程中的神奇羅盤',
    desc: '探討生命的終極意義、生死課題與永恆關懷。',
    iconEmoji: '❤️',
    progressPercent: 50,
    goals: [
      '理解生命的有限性與終極價值',
      '建立面對挫折與生死的勇氣',
      '思考個人的生命使命與至善目標',
      '學會珍惜當下與表達愛意'
    ],
    chapters: [
      {
        id: '03-1',
        num: 1,
        title: '哲學與生命意義',
        subtitle: '思考存在的價值與終極目標',
        status: 'completed',
        iconType: 'book'
      },
      {
        id: '03-2',
        num: 2,
        title: '生命航點的選擇',
        subtitle: '三位蓋大教堂工人的啟示',
        status: 'completed',
        iconType: 'compass'
      },
      {
        id: '03-3',
        num: 3,
        title: '愛與勇氣讓生死無懼',
        subtitle: '面對失落與道別的心理準備',
        status: 'in_progress',
        progress: 40,
        iconType: 'sign'
      },
      {
        id: '03-4',
        num: 4,
        title: '智慧與愛讓生命更高',
        subtitle: '將關懷轉化為人生航向',
        status: 'not_started',
        iconType: 'hand'
      }
    ],
    resources: [
      { id: 'r3-1', type: '影片', title: '生命的航道：尋找終極羅盤', duration: '15:00' },
      { id: 'r3-2', type: '文章', title: '生死關懷與生命的重量', duration: '10 分鐘閱讀' },
      { id: 'r3-3', type: '活動', title: '寫給未來自己的一封信', duration: '線上實踐' }
    ],
    quizInfo: {
      title: '終極關懷與生命價值測驗',
      totalQuestions: 15,
      completedCount: 1,
      totalCount: 3,
      percent: 33
    }
  },
  unit_04: {
    id: 'unit_04',
    unitNum: '單元 05',
    navTitle: '單元 05  價值思辨',
    title: '單元04：價值思辨——掌握智慧方向盤',
    desc: '在多元價值中進行深刻對話，做出智慧的道德抉擇。',
    iconEmoji: '⚖️',
    progressPercent: 70,
    goals: [
      '辨析道德困境與價值衝突',
      '建立以尊重與和諧為基礎的價值觀',
      '學習在複雜情境中做利他抉擇',
      '實踐真善美的人格目標'
    ],
    chapters: [
      {
        id: '04-1',
        num: 1,
        title: '思考與判斷',
        subtitle: '道德衝突情境的評估與分析',
        status: 'completed',
        iconType: 'book'
      },
      {
        id: '04-2',
        num: 2,
        title: '真理，越「辨」越明',
        subtitle: '電車難題與功利主義的思辨',
        status: 'completed',
        iconType: 'sign'
      },
      {
        id: '04-3',
        num: 3,
        title: '生活中的真善美',
        subtitle: '如何將倫理價值落實於日常',
        status: 'in_progress',
        progress: 70,
        iconType: 'compass'
      },
      {
        id: '04-4',
        num: 4,
        title: '智慧的決策方向',
        subtitle: '建立屬於自己的價值指針',
        status: 'not_started',
        iconType: 'hand'
      }
    ],
    resources: [
      { id: 'r4-1', type: '影片', title: '電車難題與道德抉擇', duration: '11:30' },
      { id: 'r4-2', type: '文章', title: '如何在衝突中尋找和解', duration: '7 分鐘閱讀' },
      { id: 'r4-3', type: '活動', title: '價值選擇大冒險', duration: '互動遊戲' }
    ],
    quizInfo: {
      title: '倫理價值與道德判斷測驗',
      totalQuestions: 15,
      completedCount: 2,
      totalCount: 3,
      percent: 66
    }
  },
  unit_05: {
    id: 'unit_05',
    unitNum: '單元 06',
    navTitle: '單元 06  靈性修養與人格統整',
    title: '單元05：靈性修養與人格統整——開啟心靈超能量',
    desc: '點亮心中的光，開放心靈、整合身心與超越自我。',
    iconEmoji: '🍃',
    progressPercent: 40,
    goals: [
      '體驗內在靈性的安寧與和諧',
      '整合認知、情感與行為的完整人格',
      '培養面對挑戰的堅韌生命力',
      '實現自我超越與對大自然的敬畏'
    ],
    chapters: [
      {
        id: '05-1',
        num: 1,
        title: '點亮心中的光',
        subtitle: '覺察內在的靈性之光',
        status: 'completed',
        iconType: 'book'
      },
      {
        id: '05-2',
        num: 2,
        title: '做自己的主人',
        subtitle: '修養情緒與控制慾望',
        status: 'completed',
        iconType: 'users'
      },
      {
        id: '05-3',
        num: 3,
        title: '靈性的修練',
        subtitle: '靜心冥想與身心和諧',
        status: 'in_progress',
        progress: 50,
        iconType: 'compass'
      },
      {
        id: '05-4',
        num: 4,
        title: '人格的統整與超越',
        subtitle: '實現知行合一的圓滿人生',
        status: 'not_started',
        iconType: 'hand'
      }
    ],
    resources: [
      { id: 'r5-1', type: '影片', title: '靜心與靈性覺察', duration: '09:50' },
      { id: 'r5-2', type: '文章', title: '邁向知行合一的人格統整', duration: '8 分鐘閱讀' },
      { id: 'r5-3', type: '活動', title: '感恩泡泡站', duration: '線上分享' }
    ],
    quizInfo: {
      title: '靈性與人格統整綜合測驗',
      totalQuestions: 15,
      completedCount: 1,
      totalCount: 3,
      percent: 33
    }
  }
};

export default function CourseMapTab({ 
  onNavigate, 
  selectedUnitId = 'unit_00', 
  onSelectUnit,
  submissions,
  onChangeSubmissions,
  activeStudentId,
  role
}: CourseMapTabProps) {

  // Current active unit key
  const [activeUnitKey, setActiveUnitKey] = useState<string>(selectedUnitId || 'unit_00');
  
  // Textbook Reader View Mode
  const [isReadingTextbook, setIsReadingTextbook] = useState<boolean>(false);

  // Bookmarked units state
  const [bookmarkedUnits, setBookmarkedUnits] = useState<Record<string, boolean>>({
    unit_00: true
  });

  // Checklist Goals State
  const [checkedGoals, setCheckedGoals] = useState<Record<string, boolean>>({
    'unit_00_0': true,
    'unit_00_1': true,
    'unit_01_0': true,
    'unit_01_1': true
  });

  // Expanded chapter accordion state
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  // Quiz Modal & Full-Page State
  const [showFullQuizPage, setShowFullQuizPage] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // If full page quiz mode is activated, render the dedicated full page view
  if (showFullQuizPage) {
    return (
      <HumanologySelfIdentityQuizPage
        onBack={() => setShowFullQuizPage(false)}
        role={role}
      />
    );
  }

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const activeConfig = UNIT_CONFIGS[activeUnitKey] || UNIT_CONFIGS['unit_00'];

  const handleToggleBookmark = (unitKey: string) => {
    const nextVal = !bookmarkedUnits[unitKey];
    setBookmarkedUnits(prev => ({ ...prev, [unitKey]: nextVal }));
    showToast(nextVal ? `🔖 已將「${activeConfig.navTitle}」加入我的書籤！` : `已取消「${activeConfig.navTitle}」書籤`);
  };

  const handleToggleGoal = (goalIndex: number) => {
    const goalKey = `${activeUnitKey}_${goalIndex}`;
    setCheckedGoals(prev => ({ ...prev, [goalKey]: !prev[goalKey] }));
  };

  // Render Icon according to chapter type
  const renderChapterIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-5 h-5 text-[#2E7D32]" />;
      case 'users':
        return <Layers className="w-5 h-5 text-[#EA580C]" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-[#7C3AED]" />;
      case 'sign':
        return <ArrowRight className="w-5 h-5 text-[#2563EB]" />;
      case 'hand':
      default:
        return <Sparkles className="w-5 h-5 text-[#E11D48]" />;
    }
  };

  const renderChapterIconBg = (type: string) => {
    switch (type) {
      case 'book':
        return 'bg-[#E8F3EE] border-[#C2E0D1]';
      case 'users':
        return 'bg-[#FFF2E8] border-[#FCE0CC]';
      case 'compass':
        return 'bg-[#F5EEFB] border-[#E8D5F7]';
      case 'sign':
        return 'bg-[#EDF5FF] border-[#CCE2FE]';
      case 'hand':
      default:
        return 'bg-[#FFF0F3] border-[#FCD6DE]';
    }
  };

  const renderNumberBadgeColor = (type: string) => {
    switch (type) {
      case 'book':
        return 'bg-[#2E7D32] text-white';
      case 'users':
        return 'bg-[#EA580C] text-white';
      case 'compass':
        return 'bg-[#7C3AED] text-white';
      case 'sign':
        return 'bg-[#2563EB] text-white';
      case 'hand':
      default:
        return 'bg-[#E11D48] text-white';
    }
  };

  // If user clicked into reading textbook, render UnitStudyView with back handler
  if (isReadingTextbook) {
    return (
      <UnitStudyView 
        unitId={activeUnitKey}
        onBack={() => setIsReadingTextbook(false)}
        onSelectUnit={(uId) => {
          setActiveUnitKey(uId);
          if (onSelectUnit) onSelectUnit(uId);
        }}
        submissions={submissions}
        onChangeSubmissions={onChangeSubmissions}
        activeStudentId={activeStudentId}
        role={role}
      />
    );
  }

  return (
    <div className="w-full space-y-6 antialiased">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2E7D32] text-white font-black text-xs md:text-sm px-6 py-3 rounded-2xl shadow-xl border border-emerald-400 flex items-center gap-2"
          >
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: 課本單元 SIDEBAR                             */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 xl:col-span-3.5 space-y-4">
          
          <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-100 shadow-3xs space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-[#2E7D32]" />
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                課本單元
              </h2>
            </div>

            {/* Units List */}
            <div className="space-y-2">
              {Object.values(UNIT_CONFIGS).map((unit) => {
                const isSelected = activeUnitKey === unit.id;
                return (
                  <button
                    key={unit.id}
                    onClick={() => {
                      setActiveUnitKey(unit.id);
                      if (onSelectUnit) onSelectUnit(unit.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#E8F3EE] border-[#B2DCBF] shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Unit Icon Container */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected 
                        ? 'bg-[#2E7D32] text-white shadow-2xs' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {unit.iconEmoji}
                    </div>

                    {/* Title & Badge */}
                    <div className="min-w-0 flex-1">
                      <span className={`text-xs font-black tracking-wider block ${
                        isSelected ? 'text-[#2E7D32]' : 'text-slate-500'
                      }`}>
                        {unit.unitNum}
                      </span>
                      <h3 className={`text-xs md:text-sm font-extrabold break-words ${
                        isSelected ? 'text-[#1E5623]' : 'text-slate-800'
                      }`}>
                        {unit.id === 'unit_00' ? '總說：凝視生命的地圖' : unit.navTitle.split('  ')[1] || unit.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 1: 🎯 單元學習目標 (Moved to Left Column per user request) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-3xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>🎯</span>
              <span>單元學習目標</span>
            </h3>

            <div className="space-y-2.5 pt-1">
              {activeConfig.goals.map((goalText, idx) => {
                const goalKey = `${activeUnitKey}_${idx}`;
                const isChecked = checkedGoals[goalKey] ?? false;
                return (
                  <label 
                    key={idx}
                    onClick={() => handleToggleGoal(idx)}
                    className="flex items-start gap-2.5 cursor-pointer text-xs md:text-sm font-bold text-slate-800 hover:text-slate-900 group select-none"
                  >
                    <div className={`w-4 h-4 rounded-md border mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                      isChecked 
                        ? 'bg-[#2E7D32] border-[#2E7D32] text-white' 
                        : 'border-slate-300 group-hover:border-[#2E7D32] bg-white'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`leading-snug break-words ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {goalText}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Card 2: ⭐ 小提醒 (Moved to Left Column per user request) */}
          <div className="bg-[#EBF5F0] border border-[#D0E8DC] rounded-3xl p-4 md:p-5 space-y-2 relative overflow-hidden">
            <h4 className="text-xs md:text-sm font-extrabold text-[#2E7D32] flex items-center gap-1">
              <span>⭐</span>
              <span>小提醒</span>
            </h4>

            <p className="text-xs md:text-sm text-[#1E5623] font-bold leading-relaxed">
              每個單元都會有小測驗，完成後可以獲得學習徽章喔！
            </p>

            <div className="flex justify-end pt-1">
              <span className="text-2xl">🌿</span>
            </div>
          </div>

          {/* Bottom Inspirational Quote Banner */}
          <div className="bg-[#FAF5EE] border border-[#EEDCC8] rounded-3xl p-5 relative overflow-hidden space-y-2">
            <div className="relative z-10">
              <h4 className="text-sm font-black text-[#5C4233]">學習沒有終點</h4>
              <p className="text-xs md:text-sm text-[#735442] font-bold mt-1 leading-relaxed">
                每一次探索，都是成長的軌跡。
              </p>
            </div>
            
            {/* Plant & Book Vector Graphic Accent */}
            <div className="flex justify-end pt-2">
              <div className="flex items-end gap-1 opacity-90">
                <span className="text-2xl">🌱</span>
                <span className="text-3xl">📚</span>
              </div>
            </div>
          </div>

          {/* Card: 本單元測驗 (Moved to Left Column) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-3xs space-y-3">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <h3 className="font-extrabold text-slate-800">本單元測驗</h3>
              <span className="text-xs font-extrabold text-slate-500">
                測驗進度 {activeConfig.quizInfo.completedCount} / {activeConfig.quizInfo.totalCount}
              </span>
            </div>

            <div className="flex items-center gap-4 py-1">
              {/* Ring Progress */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="#E2E8F0" strokeWidth="5" fill="transparent" />
                  <circle 
                    cx="28" cy="28" r="22" 
                    stroke="#2E7D32" strokeWidth="5" 
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 * (1 - activeConfig.quizInfo.percent / 100)}
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                </svg>
                <span className="absolute text-xs md:text-sm font-black text-[#2E7D32]">
                  {activeConfig.quizInfo.percent}%
                </span>
              </div>

              {/* Text info */}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs md:text-sm font-extrabold text-slate-800 leading-tight">
                  {activeConfig.quizInfo.title}
                </h4>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  共 {activeConfig.quizInfo.totalQuestions} 題
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowFullQuizPage(true);
              }}
              className="w-full py-2.5 bg-[#2E7D32] hover:bg-[#236327] text-white font-extrabold text-xs md:text-sm rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>開始測驗 (整頁模式)</span>
            </button>
          </div>

        </div>

        {/* ========================================================= */}
        {/* CENTER COLUMN: MAIN UNIT HERO & CHAPTERS                   */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 xl:col-span-8.5 space-y-6">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold px-1">
            <span className="cursor-pointer hover:text-slate-600" onClick={() => onNavigate('首頁')}>🏠</span>
            <span>›</span>
            <span className="text-slate-500">課本單元</span>
            <span>›</span>
            <span className="text-[#2E7D32] font-black">{activeConfig.unitNum}</span>
          </div>

          {/* HERO BANNER CARD */}
          <div className="bg-[#F8F4EE] border border-[#EFE7DC] rounded-3xl p-6 md:p-7 shadow-3xs relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Content Column */}
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs font-black text-[#2E7D32] tracking-wider uppercase bg-[#E2F3E9] px-3 py-1 rounded-full inline-block">
                  {activeConfig.unitNum}
                </span>

                <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                  {activeConfig.title}
                </h1>

                <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                  {activeConfig.desc}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">學習進度</span>
                    <span className="font-black text-[#2E7D32]">{activeConfig.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#2E7D32] h-full rounded-full transition-all duration-500"
                      style={{ width: `${activeConfig.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsReadingTextbook(true)}
                    className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#236327] text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>繼續學習</span>
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(activeUnitKey)}
                    className={`px-4 py-2.5 border rounded-2xl font-extrabold text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      bookmarkedUnits[activeUnitKey]
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedUnits[activeUnitKey] ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{bookmarkedUnits[activeUnitKey] ? '已加入書籤' : '加入書籤'}</span>
                  </button>
                </div>

              </div>

              {/* Right Illustration Column */}
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="relative w-36 h-36 md:w-44 md:h-44 bg-[#EFE7DC]/50 rounded-full flex items-center justify-center p-2 border border-[#E5DACB]/60 shadow-3xs">
                  {/* Clean SVG Artwork */}
                  <svg className="w-full h-full text-[#8C6D58]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Compass / Map graphic */}
                    <circle cx="100" cy="100" r="70" fill="#FAF6EE" stroke="#D9C7B2" strokeWidth="4"/>
                    <circle cx="100" cy="100" r="50" stroke="#2E7D32" strokeWidth="2" strokeDasharray="4 4"/>
                    {/* Signpost */}
                    <path d="M100 40V160" stroke="#8C5C38" strokeWidth="6" strokeLinecap="round"/>
                    <path d="M60 65H125L140 77.5L125 90H60V65Z" fill="#D98A43"/>
                    <path d="M75 110H140L155 122.5L140 135H75V110Z" fill="#2E7D32"/>
                    {/* Decorative leaves */}
                    <path d="M140 150C150 140 170 150 170 150C170 150 160 170 140 150Z" fill="#81C784"/>
                    <path d="M125 160C135 150 155 160 155 160C155 160 145 180 125 160Z" fill="#4CAF50"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>

          {/* 學習內容 SECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-3xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
              學習內容
            </h2>

            <div className="space-y-3">
              {activeConfig.chapters.map((ch) => {
                const isExpanded = expandedChapterId === ch.id;
                return (
                  <div 
                    key={ch.id}
                    className="border border-slate-100 hover:border-slate-200 rounded-2xl p-4 bg-white transition-all hover:shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      
                      {/* Left: Number + Icon + Title */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        
                        {/* Number badge */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${renderNumberBadgeColor(ch.iconType)}`}>
                          {ch.num}
                        </div>

                        {/* Icon container */}
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${renderChapterIconBg(ch.iconType)}`}>
                          {renderChapterIcon(ch.iconType)}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs md:text-sm font-extrabold text-slate-800 truncate">
                            {ch.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {ch.subtitle}
                          </p>
                        </div>

                      </div>

                      {/* Right: Status Pill & Accordion Toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        {ch.status === 'completed' && (
                          <span className="text-[10px] md:text-xs font-black text-[#2E7D32] bg-[#E2F3E9] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#C2E0D1]">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>已完成</span>
                          </span>
                        )}

                        {ch.status === 'in_progress' && (
                          <div className="text-right">
                            <span className="text-[10px] md:text-xs font-black text-[#D97706] bg-[#FEF3C7] px-2.5 py-1 rounded-full block border border-[#FDE68A]">
                              進行中 {ch.progress || 50}%
                            </span>
                          </div>
                        )}

                        {ch.status === 'not_started' && (
                          <span className="text-[10px] md:text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                            未開始
                          </span>
                        )}

                        {/* Accordion toggle button */}
                        <button
                          onClick={() => setExpandedChapterId(isExpanded ? null : ch.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-slate-100 space-y-3"
                      >
                        <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl">
                          💡 <strong>本章學習摘要：</strong> 本章節將帶領同學們透過多媒體影音、延伸選文與情境式思辨提問，建立完整的思維體系與生命反思脈絡。
                        </p>

                        <div className="flex justify-end">
                          <button
                            onClick={() => setIsReadingTextbook(true)}
                            className="px-4 py-1.5 bg-[#2E7D32] text-white font-bold text-xs rounded-xl hover:bg-[#236327] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>開啟課本閱讀</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* QUIZ MODAL */}
      <AnimatePresence>
        {showQuizModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative"
            >
              <button 
                onClick={() => setShowQuizModal(false)}
                className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="text-base font-black text-slate-800">{activeConfig.quizInfo.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold">隨堂檢測你的生命哲思觀念！</p>
                </div>
              </div>

              {quizScore === null ? (
                <div className="space-y-4">
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-800">
                      Q1. 在生命教育的的核心理念中，下列何者最符合「終極關懷」的意涵？
                    </p>
                    {[
                      '追求極致的物質財富與社會地位',
                      '思考生命的終極價值、存在意義與生死關懷',
                      '專注於個人當下的娛樂與短期享樂',
                      '盲目跟從群眾的意見與潮流'
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, 1: i }))}
                        className={`w-full text-left text-xs p-3 rounded-xl border transition-all cursor-pointer font-bold ${
                          quizAnswers[1] === i
                            ? 'bg-[#E8F3EE] border-[#2E7D32] text-[#2E7D32]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-800">
                      Q2. 當我們在面對生活中的「邏輯謬誤」時，最佳的思考策略是什麼？
                    </p>
                    {[
                      '立即情緒化反駁對手的言論',
                      '跳脫習慣性思考，進行理性分析與多元立場審視',
                      '直接接受大多數人的立場',
                      '避免任何形式的溝通與對話'
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, 2: i }))}
                        className={`w-full text-left text-xs p-3 rounded-xl border transition-all cursor-pointer font-bold ${
                          quizAnswers[2] === i
                            ? 'bg-[#E8F3EE] border-[#2E7D32] text-[#2E7D32]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (quizAnswers[1] !== undefined && quizAnswers[2] !== undefined) {
                        setQuizScore(100);
                      } else {
                        showToast('⚠️ 請完成所有測驗題目後再提交！');
                      }
                    }}
                    className="w-full py-3 bg-[#2E7D32] text-white font-black text-xs rounded-2xl shadow-xs hover:bg-[#236327] transition-all cursor-pointer"
                  >
                    提交測驗答案
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <span className="text-4xl block">🎉</span>
                  <h4 className="text-lg font-black text-slate-800">測驗完成！成績：{quizScore} 分</h4>
                  <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                    太棒了！你展現了優秀的生命思辨能力，解鎖「哲思小專家」成就勳章！
                  </p>
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="px-6 py-2.5 bg-[#2E7D32] text-white font-extrabold text-xs rounded-2xl cursor-pointer"
                  >
                    確定並關閉
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
