/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from '../assets/images/characters/char_xiaoping.jpg';
import { TextbookReaderLayout, PageNavItem } from './TextbookReaderLayout';

interface Unit05TextbookPageViewerProps {
  key?: string;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  role: 'student' | 'teacher';
  isSubmitted: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onFinishUnit?: () => void;
}

export const CHAPTERS_NAV_UNIT_05: PageNavItem[] = [
  { page: 90, code: "P.090", title: "行前閱讀：點亮心靈的燈火", tag: "前導", emoji: "🕯️" },
  { page: 91, code: "P.091", title: "行前暖身：心靈平靜探索日記", tag: "前導", emoji: "📓" },
  { page: 92, code: "P.092", title: "第1章：靈性與修養的涵義", tag: "第一章", emoji: "🌿" },
  { page: 93, code: "P.093", title: "第1章：思辨樂園 ─ 靜心覺察練習", tag: "第一章", emoji: "🧘" },
  { page: 94, code: "P.094", title: "第1章：東西方靈性傳統比較", tag: "第一章", emoji: "☯️" },
  { page: 95, code: "P.095", title: "第1章：MIND 田捕手 ─ 蘇格拉底的「關照靈魂」", tag: "第一章", emoji: "🏛️" },
  { page: 96, code: "P.096", title: "第2章：感恩、恕道與慈悲心", tag: "第二章", emoji: "❤️" },
  { page: 97, code: "P.097", title: "第2章：思辨樂園 ─ 寫一封感恩信", tag: "第二章", emoji: "✉️" },
  { page: 98, code: "P.098", title: "第2章：思考地圖 ─ 寬恕的力學與療癒", tag: "第二章", emoji: "🩹" },
  { page: 99, code: "P.099", title: "第2章：MIND 田捕手 ─ 德蕾莎修女的無私奉獻", tag: "第二章", emoji: "🕊️" },
  { page: 100, code: "P.100", title: "第3章：天人合一與生態靈性", tag: "第三章", emoji: "🌏" },
  { page: 101, code: "P.101", title: "第3章：思辨樂園 ─ 自然體驗與正念漫步", tag: "第三章", emoji: "🌲" },
  { page: 102, code: "P.102", title: "第3章：思考地圖 ─ 永續發展與內在修養", tag: "第三章", emoji: "♻️" },
  { page: 103, code: "P.103", title: "第3章：MIND 田捕手 ─ 齊柏林《看見台灣》的警示", tag: "第三章", emoji: "🎥" },
  { page: 104, code: "P.104", title: "單元總結：靈性修養與幸福終極地圖", tag: "總結", emoji: "💎" },
  { page: 105, code: "P.105", title: "延伸閱讀：活出優雅與平安的生命", tag: "延伸", emoji: "📖" },
  { page: 106, code: "P.106", title: "課後隨堂綜合測驗 (上)", tag: "測驗", emoji: "✍️" },
  { page: 107, code: "P.107", title: "課後隨堂綜合測驗 (下)", tag: "測驗", emoji: "🏆" },
  { page: 108, code: "P.108", title: "總結：幸福存摺最後實踐", tag: "總結", emoji: "🎉" }
];

export default function Unit05TextbookPageViewer({
  answers,
  setAnswers,
  role,
  isSubmitted,
  currentPage: controlledPage,
  onPageChange,
  onFinishUnit
}: Unit05TextbookPageViewerProps) {
  const [localPage, setLocalPage] = useState<number>(90);
  const currentPage = controlledPage !== undefined ? controlledPage : localPage;

  const activePageData = CHAPTERS_NAV_UNIT_05.find(p => p.page === currentPage) || CHAPTERS_NAV_UNIT_05[0];
  const readPagesList = answers.textbookReadPages || [90];

  const setCurrentPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalPage(page);
    }
    
    if (role === 'student' && !isSubmitted) {
      const readPages = answers.textbookReadPages || [90];
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
  let heroImage = charXiaowenImg;

  if (currentPage === 90) {
    heroImage = charXiaowenImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E07A5F] mr-1">曉文</span>在忙碌的考試季過後，感到心靈深處的疲憊與盲目。
        </p>
        <p>
          她嘗試在安靜的夜晚進行正念呼吸與反思，體會到：「原來除了物質與成績的追求，內心的平靜、感恩與慈悲才是滋養生命的源頭活水。」
        </p>
      </div>
    );
    rightQuestionBadge = "心靈探索";
    rightQuestionText = "在你忙碌或焦慮時，什麼樣的活動（如靜心、聽音樂、步入自然、表達感恩）最能幫助你找回內心的平靜與力量？";
    rightAnswerValue = answers.p90_reflection || '';
    onRightAnswerChange = (val) => updateAnswer('p90_reflection', val);
    rightTips = [
      { tipId: "TIP 01", text: "體會「覺察」不等於「批判」", icon: "🧘" },
      { tipId: "TIP 02", text: "實踐日常的小確幸與感恩行動", icon: "❤️" }
    ];
  } else {
    heroImage = charKehuaImg;
    leftContent = (
      <div className="space-y-3 text-slate-700 leading-relaxed font-medium">
        <p className="text-sm font-bold text-slate-800">{activePageData.title}</p>
        <p className="text-xs text-slate-600">
          培育內在靈性涵養，實踐感恩、恕道、慈悲與環境倫理，活出豐盛和平安的人生。
        </p>
      </div>
    );
    rightQuestionBadge = "靈思反思";
    rightQuestionText = `請寫下你對於「${activePageData.title}」這一課題的修養體會：`;
    rightAnswerValue = answers[`p${String(currentPage).padStart(2, '0')}_reflection`] || '';
    onRightAnswerChange = (val) => updateAnswer(`p${String(currentPage).padStart(2, '0')}_reflection`, val);
    rightTips = [
      { tipId: "TIP 01", text: "將靈性思維轉化為實際的良善行動", icon: "🌱" },
      { tipId: "TIP 02", text: "感受萬物相連（Interconnectedness）的深層體驗", icon: "🌏" }
    ];
  }

  return (
    <TextbookReaderLayout
      unitCategory="靈性修養"
      unitTitle="點亮心靈的燈火"
      unitCode="單元六"
      pagesNav={CHAPTERS_NAV_UNIT_05}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onFinishUnit={onFinishUnit}
      readPages={readPagesList}
      pageTitle={activePageData.title}
      pageCode={`P.${String(currentPage).padStart(3, '0')}`}
      leftHeaderTitle={`情境對話：${activePageData.title}`}
      leftHeroTitle={activePageData.title}
      leftHeroSubtitle="靈性涵養與終極和平"
      leftHeroImage={heroImage}
      leftContent={leftContent}
      rightHeaderTitle="01 你的看法是？"
      rightQuestionBadge={rightQuestionBadge}
      rightQuestionText={rightQuestionText}
      rightAnswerValue={rightAnswerValue}
      onRightAnswerChange={onRightAnswerChange}
      rightAnswerPlaceholder="在此寫下你的心靈修養體會..."
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
