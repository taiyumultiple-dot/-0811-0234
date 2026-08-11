/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from '../assets/images/characters/char_xiaoping.jpg';
import charBojunImg from '../assets/images/characters/char_bojun.jpg';
import { TextbookReaderLayout, PageNavItem } from './TextbookReaderLayout';

interface Unit04TextbookPageViewerProps {
  key?: string;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  role: 'student' | 'teacher';
  isSubmitted: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onFinishUnit?: () => void;
}

export const CHAPTERS_NAV_UNIT_04: PageNavItem[] = [
  { page: 72, code: "P.072", title: "行前閱讀：掌握智慧的方向", tag: "前導", emoji: "🧭" },
  { page: 73, code: "P.073", title: "行前暖身：價值困境大抉擇", tag: "前導", emoji: "⚖️" },
  { page: 74, code: "P.074", title: "第1章：道德與價值的本質", tag: "第一章", emoji: "💎" },
  { page: 75, code: "P.075", title: "第1章：思辨樂園 ─ 經典電車問題", tag: "第一章", emoji: "🚃" },
  { page: 76, code: "P.076", title: "第1章：效益主義 vs 義務論", tag: "第一章", emoji: "⚖️" },
  { page: 77, code: "P.077", title: "第1章：MIND 田捕手 ─ 告密者的兩難", tag: "第一章", emoji: "🕵️" },
  { page: 78, code: "P.078", title: "第2章：正義、平等與社會福利", tag: "第二章", emoji: "🏛️" },
  { page: 79, code: "P.079", title: "第2章：思辨樂園 ─ 羅爾斯「無知之幕」", tag: "第二章", emoji: "🎭" },
  { page: 80, code: "P.080", title: "第2章：思考地圖 ─ 資源分配的公平性", tag: "第二章", emoji: "📊" },
  { page: 81, code: "P.081", title: "第2章：MIND 田捕手 ─ 器官移植優先權", tag: "第二章", emoji: "🫀" },
  { page: 82, code: "P.082", title: "第3章：科技發展與倫理挑戰", tag: "第三章", emoji: "🤖" },
  { page: 83, code: "P.083", title: "第3章：思辨樂園 ─ 自動駕駛車的道德抉擇", tag: "第三章", emoji: "🚗" },
  { page: 84, code: "P.084", title: "第3章：思考地圖 ─ 基因編輯與複製技術", tag: "第三章", emoji: "🧬" },
  { page: 85, code: "P.085", title: "第3章：MIND 田捕手 ─ AI 算力與隱私權", tag: "第三章", emoji: "🔒" },
  { page: 86, code: "P.086", title: "單元總結：價值倫理與智慧決定", tag: "總結", emoji: "💡" },
  { page: 87, code: "P.087", title: "延伸閱讀：當代道德難題反思", tag: "延伸", emoji: "📖" },
  { page: 88, code: "P.088", title: "課後隨堂綜合測驗 (上)", tag: "測驗", emoji: "✍️" },
  { page: 89, code: "P.089", title: "課後隨堂綜合測驗 (下)", tag: "測驗", emoji: "🏆" }
];

export default function Unit04TextbookPageViewer({
  answers,
  setAnswers,
  role,
  isSubmitted,
  currentPage: controlledPage,
  onPageChange,
  onFinishUnit
}: Unit04TextbookPageViewerProps) {
  const [localPage, setLocalPage] = useState<number>(72);
  const currentPage = controlledPage !== undefined ? controlledPage : localPage;

  const activePageData = CHAPTERS_NAV_UNIT_04.find(p => p.page === currentPage) || CHAPTERS_NAV_UNIT_04[0];
  const readPagesList = answers.textbookReadPages || [72];

  const setCurrentPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalPage(page);
    }
    
    if (role === 'student' && !isSubmitted) {
      const readPages = answers.textbookReadPages || [72];
      if (!readPages.includes(page)) {
        updateAnswer('textbookReadPages', [...readPages, page]);
      }
    }
  };

  const updateAnswer = (key: string, val: any) => {
    if (role === 'teacher' || isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const isDisabled = role === 'teacher' || isSubmitted;

  let leftContent: React.ReactNode = null;
  let rightQuestionBadge = "思考問題";
  let rightQuestionText: string | React.ReactNode = "";
  let rightAnswerValue = "";
  let onRightAnswerChange: ((val: string) => void) | undefined = undefined;
  let rightTips: Array<{ tipId: string; text: string; icon?: string }> = [];
  let heroImage = charBojunImg;

  if (currentPage === 72) {
    heroImage = charBojunImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E07A5F] mr-1">博鈞</span>與班上同學針對「考前傳答案算不算互助行為？」展開激烈的論辯。
        </p>
        <p>
          同學認為：「大家分數都變高，效益最大化啊！」博鈞反駁：「但這破壞了誠信與公平的原則，後果更嚴重！」
        </p>
        <p>
          這個貼近校園生活的爭議，展示了「效益主義」與「義務論」的典型價值碰撞。
        </p>
      </div>
    );
    rightQuestionBadge = "道德兩難";
    rightQuestionText = "當「情感友誼」與「規則誠信」發生衝突時，你會如何做出具有智慧與倫理責任的抉擇？";
    rightAnswerValue = answers.p72_reflection || '';
    onRightAnswerChange = (val) => updateAnswer('p72_reflection', val);
    rightTips = [
      { tipId: "TIP 01", text: "分析決定帶來的短期與長期影響", icon: "⚖️" },
      { tipId: "TIP 02", text: "思考康德的最高道德命令（普遍化原則）", icon: "📐" }
    ];
  } else {
    heroImage = charXiaopingImg;
    leftContent = (
      <div className="space-y-3 text-slate-700 leading-relaxed font-medium">
        <p className="text-sm font-bold text-slate-800">{activePageData.title}</p>
        <p className="text-xs text-slate-600">
          透過價值思辨課題，探索倫理規範、公平正義與科技倫理，建立良善的公民視野。
        </p>
      </div>
    );
    rightQuestionBadge = "倫理思辨";
    rightQuestionText = `請寫下你對於「${activePageData.title}」這一課題的思辨觀點：`;
    rightAnswerValue = answers[`p${String(currentPage).padStart(2, '0')}_reflection`] || '';
    onRightAnswerChange = (val) => updateAnswer(`p${String(currentPage).padStart(2, '0')}_reflection`, val);
    rightTips = [
      { tipId: "TIP 01", text: "考量利益相關者的權益與感受", icon: "🤝" },
      { tipId: "TIP 02", text: "運用「無知之幕」進行公平正義的推論", icon: "🎭" }
    ];
  }

  return (
    <TextbookReaderLayout
      unitCategory="價值思辨"
      unitTitle="掌握智慧的方向"
      unitCode="單元五"
      pagesNav={CHAPTERS_NAV_UNIT_04}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onFinishUnit={onFinishUnit}
      readPages={readPagesList}
      pageTitle={activePageData.title}
      pageCode={`P.${String(currentPage).padStart(3, '0')}`}
      leftHeaderTitle={`情境對話：${activePageData.title}`}
      leftHeroTitle={activePageData.title}
      leftHeroSubtitle="價值思辨與倫理抉擇"
      leftHeroImage={heroImage}
      leftContent={leftContent}
      rightHeaderTitle="01 你的看法是？"
      rightQuestionBadge={rightQuestionBadge}
      rightQuestionText={rightQuestionText}
      rightAnswerValue={rightAnswerValue}
      onRightAnswerChange={onRightAnswerChange}
      rightAnswerPlaceholder="在此寫下你的倫理思辨觀點..."
      rightMaxLength={500}
      rightTips={rightTips}
      suggestedTime="15 – 20 分鐘"
      tipText="可依閱讀與思考，點擊側邊章節可快速切換或再次閱讀。填寫後記得儲存。"
      userName="王小文"
      userAvatarUrl={charXiaowenImg}
      isDisabled={isDisabled}
    />
  );
}
