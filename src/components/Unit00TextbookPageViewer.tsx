/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charDadImg from '../assets/images/characters/char_dad.jpg';
import { UNIT00_TEXTBOOK_PAGES } from '../textbookData';
import { TextbookReaderLayout, PageNavItem } from './TextbookReaderLayout';

interface Unit00TextbookPageViewerProps {
  key?: string;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  role: 'student' | 'teacher';
  isSubmitted: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onFinishUnit?: () => void;
}

export const CHAPTERS_NAV: PageNavItem[] = UNIT00_TEXTBOOK_PAGES.map(p => ({
  page: p.page,
  code: `P.${String(p.page).padStart(3, '0')}`,
  title: p.title,
  tag: p.tag,
  emoji: p.emoji
}));

const P05_CONDITIONS = [
  { id: "1", text: "理性思考" },
  { id: "2", text: "認識自己" },
  { id: "3", text: "有道德感" },
  { id: "4", text: "幫助他人" },
  { id: "5", text: "能尊重他人" },
  { id: "6", text: "能保持客觀與彈性" },
  { id: "7", text: "知道自己存在的價值與意義" },
  { id: "8", text: "能與別人建立良好和諧的互動關係" },
  { id: "9", text: "有人生目標與方向" },
  { id: "10", text: "不損害他人" },
  { id: "11", text: "重視生命成長" },
  { id: "12", text: "有正確的信仰" },
  { id: "13", text: "追求生命的意義" },
  { id: "14", text: "擁有深度的智慧" },
  { id: "15", text: "不怕挫折、失敗" },
  { id: "16", text: "堅持朝目標前進" },
  { id: "17", text: "能做出正確的判斷" },
  { id: "18", text: "能感受與體驗生命" },
  { id: "19", text: "能修正自己的缺點" },
  { id: "20", text: "其他" }
];

export default function Unit00TextbookPageViewer({
  answers,
  setAnswers,
  role,
  isSubmitted,
  currentPage: controlledPage,
  onPageChange,
  onFinishUnit
}: Unit00TextbookPageViewerProps) {
  const [localPage, setLocalPage] = useState<number>(4);
  const currentPage = controlledPage !== undefined ? controlledPage : localPage;

  const activePageData = UNIT00_TEXTBOOK_PAGES.find(p => p.page === currentPage) || UNIT00_TEXTBOOK_PAGES[0];
  const readPagesList = answers.textbookReadPages || [4];

  const setCurrentPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalPage(page);
    }
    
    if (role === 'student' && !isSubmitted) {
      const readPages = answers.textbookReadPages || [4];
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

  // Prepare page-specific layout configurations
  let leftContent: React.ReactNode = null;
  let rightQuestionBadge = "思考問題";
  let rightQuestionText: string | React.ReactNode = "";
  let rightAnswerValue = "";
  let onRightAnswerChange: ((val: string) => void) | undefined = undefined;
  let rightTips: Array<{ tipId: string; text: string; icon?: string }> = [];
  let customRightContent: React.ReactNode = undefined;
  let heroImage = charDadImg;

  if (currentPage === 4) {
    heroImage = charDadImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E27468] mr-1">可華</span>一早起床，爸爸就載他上學，途中爸爸關心問到：「昨晚有沒有為準備考試而熬夜呀？」
        </p>
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E27468] mr-1">可華</span>打著哈欠回應：「讀書真的很累人，班上的同學都是學霸，時間總是不夠用，害我每次都讀不完，為什麼要過這樣的生活？」
        </p>
        <p>
          爸爸試著用自己經歷的人性道理啟發可華：「學生只需要認真讀書，是很幸福的！等你長大出社會工作，就知道什麼叫壓力。」
        </p>
        <p className="pl-4 border-l-3 border-[#E27468] italic font-bold text-[#5C4538] py-2 bg-[#FFF7F2] rounded-r-xl my-2">
          「好好用功讀書，考上大學 ➔ 找到好工作 ➔ 幸福人生」
        </p>
        <p>
          這條世俗規則的公式是人生必經之路？如果是你，你會怎麼回答可華的問題？
        </p>
      </div>
    );
    rightQuestionBadge = "思考問題";
    rightQuestionText = "你是否也曾像可華一樣，對「好好讀書➔考上大學➔找到工作➔幸福人生」這條世俗規則的公式產生過懷疑？如果是你，你會怎麼回答可華的問題？";
    rightAnswerValue = answers.p04_story_reflection || '';
    onRightAnswerChange = (val) => updateAnswer('p04_story_reflection', val);
    rightTips = [
      { tipId: "TIP 01", text: "「好工作」真的就是幸福人生的唯一條件嗎？", icon: "🌿" },
      { tipId: "TIP 02", text: "學業的成績單，與內心滿足感，關係是？", icon: "❤️" },
      { tipId: "TIP 03", text: "如果沒有目標的核心價值，成功後是否依然空虛？", icon: "🚀" }
    ];
  } else if (currentPage === 5) {
    heroImage = charKehuaImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          生命教育 MAP 提供我們深度探索、反省生命本質所需的邏輯與工具。
        </p>
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {[
            { step: "01", name: "品嚐思考樂趣" },
            { step: "02", name: "漫步奇幻旅程" },
            { step: "03", name: "體驗神奇羅盤" },
            { step: "04", name: "掌握智慧方向" }
          ].map((s, i) => (
            <div key={i} className="bg-white border border-[#EFE8DC] p-3 rounded-2xl shadow-3xs flex flex-col items-center text-center">
              <span className="text-base mb-1">📍</span>
              <h5 className="text-xs font-black text-slate-800">{s.name}</h5>
              <span className="text-[10px] px-2 py-0.5 bg-[#FFF4EC] text-[#E07A5F] font-extrabold rounded-md mt-1.5">STEP {s.step}</span>
            </div>
          ))}
        </div>
      </div>
    );
    customRightContent = (
      <div className="space-y-4">
        <div className="bg-[#FFF8F3] border border-[#F5E6D8] rounded-2xl p-4 space-y-3">
          <span className="inline-block px-2.5 py-0.5 bg-[#FDE2D1] text-[#A84A30] rounded-md text-[11px] font-black">
            條件選擇
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
            關於幸福人生，你覺得需要具備哪些重要條件？（可多選）：
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {P05_CONDITIONS.map((cond) => {
              const list = answers.p05_conditions || [];
              const isChecked = list.includes(cond.id);
              return (
                <button
                  key={cond.id}
                  disabled={isDisabled}
                  onClick={() => {
                    const newList = isChecked 
                      ? list.filter((item: string) => item !== cond.id) 
                      : [...list, cond.id];
                    updateAnswer('p05_conditions', newList);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer truncate ${
                    isChecked 
                      ? 'bg-[#E07A5F] text-white border-[#C8644A] shadow-3xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{isChecked ? '🎯' : '▫️'}</span>
                  <span className="truncate">{cond.id}. {cond.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    // Default layout for other pages
    heroImage = charXiaowenImg;
    leftContent = (
      <div className="space-y-3 text-slate-700 leading-relaxed font-medium">
        <p className="text-sm font-bold text-slate-800">{activePageData.desc}</p>
        <p className="text-xs text-slate-600">
          歡迎繼續進行隨堂思辨與練習任務，透過這項課題深入理解自身與生命的關係。
        </p>
      </div>
    );
    rightQuestionBadge = "隨堂思辨";
    rightQuestionText = `請寫下你對於「${activePageData.title}」這一節內容的想法或體會：`;
    rightAnswerValue = answers[`p${String(currentPage).padStart(2, '0')}_notes`] || '';
    onRightAnswerChange = (val) => updateAnswer(`p${String(currentPage).padStart(2, '0')}_notes`, val);
    rightTips = [
      { tipId: "TIP 01", text: "試著結合個人的成長經驗進行深度表達", icon: "🌱" },
      { tipId: "TIP 02", text: "嘗試換位思考，理解不同的價值觀與立場", icon: "💡" }
    ];
  }

  return (
    <TextbookReaderLayout
      unitCategory="參考生命教育"
      unitTitle="凝視生命的地圖"
      unitCode="單元一"
      pagesNav={CHAPTERS_NAV}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onFinishUnit={onFinishUnit}
      readPages={readPagesList}
      pageTitle={activePageData.title}
      pageCode={`P.${String(currentPage).padStart(3, '0')}`}
      leftHeaderTitle={`情境的對話：${activePageData.title}`}
      leftHeroTitle={activePageData.title}
      leftHeroSubtitle={activePageData.desc}
      leftHeroImage={heroImage}
      leftContent={leftContent}
      rightHeaderTitle="01 你的看法是？"
      rightQuestionBadge={rightQuestionBadge}
      rightQuestionText={rightQuestionText}
      rightAnswerValue={rightAnswerValue}
      onRightAnswerChange={onRightAnswerChange}
      rightAnswerPlaceholder="在此寫下你的真實想法..."
      rightMaxLength={500}
      rightTips={rightTips}
      customRightContent={customRightContent}
      suggestedTime="15 – 20 分鐘"
      tipText="可依閱讀與思考，點擊側邊章節可快速切換或再次閱讀。填寫後記得儲存。"
      userName="王小文"
      userAvatarUrl={charXiaowenImg}
      isDisabled={isDisabled}
    />
  );
}
