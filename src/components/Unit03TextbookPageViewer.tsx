/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charDadImg from '../assets/images/characters/char_dad.jpg';
import charGrandpaImg from '../assets/images/characters/char_grandpa.jpg';
import { TextbookReaderLayout, PageNavItem } from './TextbookReaderLayout';

interface Unit03TextbookPageViewerProps {
  key?: string;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  role: 'student' | 'teacher';
  isSubmitted: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onFinishUnit?: () => void;
}

export const CHAPTERS_NAV_UNIT_03: PageNavItem[] = [
  { page: 54, code: "P.054", title: "行前閱讀：體驗神奇的羅盤", tag: "前導", emoji: "🧭" },
  { page: 55, code: "P.055", title: "行前暖身：生命中的失落與面對", tag: "前導", emoji: "🍂" },
  { page: 56, code: "P.056", title: "第1章：苦難的本質與意涵", tag: "第一章", emoji: "🌧️" },
  { page: 57, code: "P.057", title: "第1章：面對苦難的心理調適機制", tag: "第一章", emoji: "🛡️" },
  { page: 58, code: "P.058", title: "第1章：庫伯勒-羅斯 悲傷五階段", tag: "第一章", emoji: "⏳" },
  { page: 59, code: "P.059", title: "第1章：MIND 田捕手 ─ 史鐵生的地壇故事", tag: "第一章", emoji: "🌳" },
  { page: 60, code: "P.060", title: "第2章：死亡的哲學思索與尊嚴", tag: "第二章", emoji: "🕯️" },
  { page: 61, code: "P.061", title: "第2章：思辨樂園 ─ 安樂死與尊嚴善終", tag: "第二章", emoji: "⚖️" },
  { page: 62, code: "P.062", title: "第2章：思考地圖 ─ 預立醫療決定 (AD)", tag: "第二章", emoji: "📋" },
  { page: 63, code: "P.063", title: "第2章：MIND 田捕手 ─ 安寧療護與臨終關懷", tag: "第二章", emoji: "🕊️" },
  { page: 64, code: "P.064", title: "第3章：終極信仰與生死超越", tag: "第三章", emoji: "🌌" },
  { page: 65, code: "P.065", title: "第3章：各大宗教對死亡與未來的看法", tag: "第三章", emoji: "☸️" },
  { page: 66, code: "P.066", title: "第3章：思考地圖 ─ 生死兩利與遺產規劃", tag: "第三章", emoji: "📜" },
  { page: 67, code: "P.067", title: "第3章：MIND 田捕手 ─ 撰寫自己的告別式", tag: "第三章", emoji: "✉️" },
  { page: 68, code: "P.068", title: "單元總結：生死關懷與心靈羅盤", tag: "總結", emoji: "💎" },
  { page: 69, code: "P.069", title: "延伸閱讀：超越死亡的生命力量", tag: "延伸", emoji: "📖" },
  { page: 70, code: "P.070", title: "課後隨堂綜合測驗 (上)", tag: "測驗", emoji: "✍️" },
  { page: 71, code: "P.071", title: "課後隨堂綜合測驗 (下)", tag: "測驗", emoji: "🏆" }
];

export default function Unit03TextbookPageViewer({
  answers,
  setAnswers,
  role,
  isSubmitted,
  currentPage: controlledPage,
  onPageChange,
  onFinishUnit
}: Unit03TextbookPageViewerProps) {
  const [localPage, setLocalPage] = useState<number>(54);
  const currentPage = controlledPage !== undefined ? controlledPage : localPage;

  const activePageData = CHAPTERS_NAV_UNIT_03.find(p => p.page === currentPage) || CHAPTERS_NAV_UNIT_03[0];
  const readPagesList = answers.textbookReadPages || [54];

  const setCurrentPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalPage(page);
    }
    
    if (role === 'student' && !isSubmitted) {
      const readPages = answers.textbookReadPages || [54];
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
  let heroImage = charGrandpaImg;

  if (currentPage === 54) {
    heroImage = charGrandpaImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E07A5F] mr-1">可華</span>陪同爺爺至醫院探視病重的鄰居阿公。回程的路上，爺爺感嘆人生無常，人終究要面對老去與死亡。
        </p>
        <p>
          爺爺問可華：「孩子，你覺得人死後會去哪裡？我們該如何勇敢面對生命的終點？」
        </p>
        <p>
          這段對話帶領可華開始思索「生死關懷」與「終極信仰」的深層意涵。
        </p>
      </div>
    );
    rightQuestionBadge = "思考問題";
    rightQuestionText = "面對親友的離去或對死亡的恐懼，你認為什麼樣的心態或信仰能帶給人力量與平安？";
    rightAnswerValue = answers.p54_reflection || '';
    onRightAnswerChange = (val) => updateAnswer('p54_reflection', val);
    rightTips = [
      { tipId: "TIP 01", text: "探討悲傷五階段（否定、憤怒、討價還價、抑鬱、接受）", icon: "⏳" },
      { tipId: "TIP 02", text: "思考四道人生：道謝、道歉、道愛、道別", icon: "🕊️" }
    ];
  } else {
    heroImage = charDadImg;
    leftContent = (
      <div className="space-y-3 text-slate-700 leading-relaxed font-medium">
        <p className="text-sm font-bold text-slate-800">{activePageData.title}</p>
        <p className="text-xs text-slate-600">
          透過終極關懷課文，思考苦難的意涵、尊嚴善終與安寧照顧，體會生命超越性的平靜。
        </p>
      </div>
    );
    rightQuestionBadge = "生死思辨";
    rightQuestionText = `請寫下你對於「${activePageData.title}」這一課題的想法：`;
    rightAnswerValue = answers[`p${String(currentPage).padStart(2, '0')}_reflection`] || '';
    onRightAnswerChange = (val) => updateAnswer(`p${String(currentPage).padStart(2, '0')}_reflection`, val);
    rightTips = [
      { tipId: "TIP 01", text: "學習理解並陪伴悲傷的情緒", icon: "❤️" },
      { tipId: "TIP 02", text: "尊重多元宗教與哲學對未來的詮釋", icon: "🌌" }
    ];
  }

  return (
    <TextbookReaderLayout
      unitCategory="終極關懷"
      unitTitle="體驗神奇的羅盤"
      unitCode="單元四"
      pagesNav={CHAPTERS_NAV_UNIT_03}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onFinishUnit={onFinishUnit}
      readPages={readPagesList}
      pageTitle={activePageData.title}
      pageCode={`P.${String(currentPage).padStart(3, '0')}`}
      leftHeaderTitle={`情境對話：${activePageData.title}`}
      leftHeroTitle={activePageData.title}
      leftHeroSubtitle="生死尊嚴與終極關懷"
      leftHeroImage={heroImage}
      leftContent={leftContent}
      rightHeaderTitle="01 你的看法是？"
      rightQuestionBadge={rightQuestionBadge}
      rightQuestionText={rightQuestionText}
      rightAnswerValue={rightAnswerValue}
      onRightAnswerChange={onRightAnswerChange}
      rightAnswerPlaceholder="在此寫下你的生死思辨心得..."
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
