import { StudentSubmission } from './types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string; // e.g. "from-amber-500 to-yellow-400"
  border: string; // "border-amber-200"
  bg: string; // "bg-amber-50"
  checkUnlock: (sub: StudentSubmission) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    name: '初試身手',
    description: '完成任意一份學習單或互動思辨任務',
    emoji: '🎯',
    color: 'from-blue-500 to-indigo-400',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    checkUnlock: (sub) => {
      const hasWoop = sub.woop?.submitted;
      const hasEx = sub.exhibition?.submitted;
      const hasAuto = !!sub.autopilot;
      const hasSocr = !!sub.socrates;
      const hasTrol = !!sub.trolley;
      const hasFall = !!sub.fallacy;
      return !!(hasWoop || hasEx || hasAuto || hasSocr || hasTrol || hasFall);
    }
  },
  {
    id: 'dream_planner',
    name: '夢想規劃家',
    description: '成功送出完整的 WOOP 學習單',
    emoji: '🔮',
    color: 'from-purple-500 to-pink-400',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    checkUnlock: (sub) => !!sub.woop?.submitted
  },
  {
    id: 'life_designer',
    name: '生命設計師',
    description: '成功規劃並送出「生前特展」學習單',
    emoji: '🎨',
    color: 'from-emerald-500 to-teal-400',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    checkUnlock: (sub) => !!sub.exhibition?.submitted
  },
  {
    id: 'autopilot_breaker',
    name: '自主巡航破除者',
    description: '完成「自動駕駛人生」互動思辨',
    emoji: '🚀',
    color: 'from-amber-500 to-orange-400',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    checkUnlock: (sub) => !!sub.autopilot
  },
  {
    id: 'philosophical_thinker',
    name: '真理思辨家',
    description: '與「蘇格拉底 AI」完成生命意義對話',
    emoji: '💬',
    color: 'from-sky-500 to-cyan-400',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    checkUnlock: (sub) => !!sub.socrates
  },
  {
    id: 'ethical_chooser',
    name: '道德抉擇者',
    description: '完成「電車難題」思辨並闡明理由',
    emoji: '⚖️',
    color: 'from-rose-500 to-red-400',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    checkUnlock: (sub) => !!sub.trolley
  },
  {
    id: 'logic_master',
    name: '邏輯大師',
    description: '挑戰「非形式謬誤」趣味賽獲取分數',
    emoji: '🧠',
    color: 'from-violet-500 to-fuchsia-400',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
    checkUnlock: (sub) => !!sub.fallacy
  },
  {
    id: 'resonance_creator',
    name: '生命共鳴音',
    description: '在關鍵字牆投遞生命密碼或金句',
    emoji: '✨',
    color: 'from-teal-500 to-emerald-400',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
    checkUnlock: (sub) => !!(sub.exhibition?.keywords && sub.exhibition.keywords.length > 0)
  }
];
