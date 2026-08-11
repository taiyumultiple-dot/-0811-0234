/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charDadImg from '../assets/images/characters/char_dad.jpg';
import charBojunImg from '../assets/images/characters/char_bojun.jpg';
import { TextbookReaderLayout, PageNavItem } from './TextbookReaderLayout';

interface Unit01TextbookPageViewerProps {
  key?: string;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  role: 'student' | 'teacher';
  isSubmitted: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onFinishUnit?: () => void;
}

export const CHAPTERS_NAV_UNIT_01: PageNavItem[] = [
  { page: 14, code: "P.014", title: "第一章：思考的起點 ─ 為什麼要思考？", tag: "第一章", emoji: "💭" },
  { page: 15, code: "P.015", title: "思辨樂園 ─ 破除思考盲點與框框", tag: "第一章", emoji: "🧩" },
  { page: 16, code: "P.016", title: "蒼蠅與蜜蜂 ─ 盲目經驗與創新思維", tag: "第一章", emoji: "🐝" },
  { page: 17, code: "P.017", title: "思考的層次：初階、中階與高階思考", tag: "第一章", emoji: "📊" },
  { page: 18, code: "P.018", title: "思考地圖 ─ 刻板印象、偏見與歧視", tag: "第一章", emoji: "🗺️" },
  { page: 19, code: "P.019", title: "MIND田捕手：盲眼射箭與客觀求證", tag: "第一章", emoji: "🏹" },
  { page: 20, code: "P.020", title: "第二章：邏輯思考與論證 ─ 批判性思考", tag: "第二章", emoji: "🔍" },
  { page: 21, code: "P.021", title: "思辨樂園 ─ 邏輯謬誤大搜查", tag: "第二章", emoji: "🔍" },
  { page: 22, code: "P.022", title: "稻草人謬誤與訴諸權威", tag: "第二章", emoji: "🌾" },
  { page: 23, code: "P.023", title: "滑坡謬誤與假等同謬誤", tag: "第二章", emoji: "🛷" },
  { page: 24, code: "P.024", title: "思考地圖 ─ 健全論證的三要素", tag: "第二章", emoji: "📐" },
  { page: 25, code: "P.025", title: "MIND田捕手：網路新聞真假判讀", tag: "第二章", emoji: "📰" },
  { page: 26, code: "P.026", title: "第三章：換位思考與同理心", tag: "第三章", emoji: "🤝" },
  { page: 27, code: "P.027", title: "思辨樂園 ─ 換位思考練習", tag: "第三章", emoji: "🔄" },
  { page: 28, code: "P.028", title: "思考地圖 ─ 捷運博愛座的禮讓爭議", tag: "第三章", emoji: "🚇" },
  { page: 29, code: "P.029", title: "MIND田捕手：行人路權優先與防禦駕駛", tag: "第三章", emoji: "🚶" },
  { page: 30, code: "P.030", title: "盲人摸象與認知偏見的哲學思維", tag: "第三章", emoji: "🐘" },
  { page: 31, code: "P.031", title: "網路謠言的辨識與理性探究", tag: "第三章", emoji: "📡" },
  { page: 32, code: "P.032", title: "保持客觀與換位思考：博愛座隱性需求", tag: "第三章", emoji: "♿" },
  { page: 33, code: "P.033", title: "立場不必中立，態度必須公正：AI 寫作業", tag: "第三章", emoji: "🤖" },
  { page: 34, code: "P.034", title: "思考你的思考：讓思考成為你的習慣 (上)", tag: "第三章", emoji: "💗" },
  { page: 35, code: "P.035", title: "思考你的思考：讓思考成為你的習慣 (下)", tag: "第三章", emoji: "🎓" }
];

export default function Unit01TextbookPageViewer({
  answers,
  setAnswers,
  role,
  isSubmitted,
  currentPage: controlledPage,
  onPageChange,
  onFinishUnit
}: Unit01TextbookPageViewerProps) {
  const [localPage, setLocalPage] = useState<number>(14);
  const currentPage = controlledPage !== undefined ? controlledPage : localPage;

  const activePageData = CHAPTERS_NAV_UNIT_01.find(p => p.page === currentPage) || CHAPTERS_NAV_UNIT_01[0];
  const readPagesList = answers.textbookReadPages || [14];

  const setCurrentPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalPage(page);
    }
    
    if (role === 'student' && !isSubmitted) {
      const readPages = answers.textbookReadPages || [14];
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

  // Page-specific contents
  let leftContent: React.ReactNode = null;
  let rightQuestionBadge = "思考問題";
  let rightQuestionText: string | React.ReactNode = "";
  let rightAnswerValue = "";
  let onRightAnswerChange: ((val: string) => void) | undefined = undefined;
  let rightTips: Array<{ tipId: string; text: string; icon?: string }> = [];
  let heroImage = charKehuaImg;

  if (currentPage === 14) {
    heroImage = charBojunImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E07A5F] mr-1">博鈞</span>在網路上看到一則關於「人工智慧將全面取代人類思考」的熱門討論，感到十分焦慮。
        </p>
        <p>
          他問老師：「如果 AI 算得比我們快、寫得比我們好，那我們為什麼還要花時間學會獨立思考呢？」
        </p>
        <p>
          老師微笑著回答：「AI 能提供資料與公式，但『為什麼要選擇這個目標？』與『什麼是真正的價值？』只有人類具備深刻思考與反思的能力。」
        </p>
      </div>
    );
    rightQuestionBadge = "思考問題";
    rightQuestionText = "面對人工智慧與資訊爆棚的時代，你認為人類「獨立思考」最不可被取代的價值是什麼？";
    rightAnswerValue = answers.p14_reflection || '';
    onRightAnswerChange = (val) => updateAnswer('p14_reflection', val);
    rightTips = [
      { tipId: "TIP 01", text: "思考 AI 與人類在情緒、同理心與價值判斷上的差異", icon: "🤖" },
      { tipId: "TIP 02", text: "評估盲目接受資訊可能帶來的風險與影響", icon: "🧠" }
    ];
  } else if (currentPage === 15) {
    heroImage = charXiaowenImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          日常生活中，我們常被習慣與既定觀念限制。「九點連線問題」告訴我們：跳出框架（Think outside the box）才能看見問題的真相。
        </p>
        <p>
          當我們不敢跨出無形的邊界時，解答往往就被隱藏在我們的意識盲點之中。
        </p>
      </div>
    );
    rightQuestionBadge = "思辨練習";
    rightQuestionText = "請分享一次你打破「慣性思維」或「既定印象」的經驗，當時發生了什麼事？你學到了什麼？";
    rightAnswerValue = answers.p15_reflection || '';
    onRightAnswerChange = (val) => updateAnswer('p15_reflection', val);
    rightTips = [
      { tipId: "TIP 01", text: "嘗試描述問題最初給你的限制感", icon: "🧩" },
      { tipId: "TIP 02", text: "說明你是如何發現突破點的", icon: "💡" }
    ];
  } else {
    heroImage = charKehuaImg;
    leftContent = (
      <div className="space-y-3 text-slate-700 leading-relaxed font-medium">
        <p className="text-sm font-bold text-slate-800">{activePageData.title}</p>
        <p className="text-xs text-slate-600">
          透過本章節的哲學思考範例，練習辨識邏輯盲點、釐清事實與觀點，並建立健全的思辨習慣。
        </p>
      </div>
    );
    rightQuestionBadge = "哲學思辨";
    rightQuestionText = `關於「${activePageData.title}」，請寫下你的思辨心得或課堂反思：`;
    rightAnswerValue = answers[`p${String(currentPage).padStart(2, '0')}_reflection`] || '';
    onRightAnswerChange = (val) => updateAnswer(`p${String(currentPage).padStart(2, '0')}_reflection`, val);
    rightTips = [
      { tipId: "TIP 01", text: "區分前提（Premise）與結論（Conclusion）", icon: "📐" },
      { tipId: "TIP 02", text: "保持懷疑態度，客觀檢視證據來源", icon: "🔍" }
    ];
  }

  return (
    <TextbookReaderLayout
      unitCategory="哲學思考"
      unitTitle="思考的點線面"
      unitCode="單元二"
      pagesNav={CHAPTERS_NAV_UNIT_01}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onFinishUnit={onFinishUnit}
      readPages={readPagesList}
      pageTitle={activePageData.title}
      pageCode={`P.${String(currentPage).padStart(3, '0')}`}
      leftHeaderTitle={`情境對話：${activePageData.title}`}
      leftHeroTitle={activePageData.title}
      leftHeroSubtitle="哲學思辨與邏輯導引"
      leftHeroImage={heroImage}
      leftContent={leftContent}
      rightHeaderTitle="01 你的看法是？"
      rightQuestionBadge={rightQuestionBadge}
      rightQuestionText={rightQuestionText}
      rightAnswerValue={rightAnswerValue}
      onRightAnswerChange={onRightAnswerChange}
      rightAnswerPlaceholder="在此寫下你的思辨想法..."
      rightMaxLength={500}
      rightTips={rightTips}
      suggestedTime="15 – 20 分鐘"
      tipText="點擊側邊選單可快速切換章節，請完成思考問題後點擊儲存。"
      userName="王小文"
      userAvatarUrl={charXiaowenImg}
      isDisabled={isDisabled}
    />
  );
}
