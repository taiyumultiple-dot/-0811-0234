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

interface Unit02TextbookPageViewerProps {
  key?: string;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  role: 'student' | 'teacher';
  isSubmitted: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onFinishUnit?: () => void;
}

export const CHAPTERS_NAV_UNIT_02: PageNavItem[] = [
  { page: 36, code: "P.036", title: "行前閱讀：漫步奇幻的旅程", tag: "前導", emoji: "🚶" },
  { page: 37, code: "P.037", title: "行前暖身：沙漠飲料心理測驗", tag: "前導", emoji: "🍹" },
  { page: 38, code: "P.038", title: "第1章：一、人的特質 ─ 「人」是什麼？", tag: "第一章", emoji: "👤" },
  { page: 39, code: "P.039", title: "第1章：對比擂台：活動 01 & 02", tag: "第一章", emoji: "⚔️" },
  { page: 40, code: "P.040", title: "第1章：多元學科對「人」的看法", tag: "第一章", emoji: "🔬" },
  { page: 41, code: "P.041", title: "第1章：MIND 田捕手 ─ 被狼養大的孩子", tag: "第一章", emoji: "🐺" },
  { page: 42, code: "P.042", title: "第2章：二、人的身心靈整合與發展", tag: "第二章", emoji: "🌱" },
  { page: 43, code: "P.043", title: "第2章：思辨樂園 ─ 體能、智能與心靈", tag: "第二章", emoji: "🏋️" },
  { page: 44, code: "P.044", title: "第2章：思考地圖 ─ 馬斯洛需求層次理論", tag: "第二章", emoji: "🔺" },
  { page: 45, code: "P.045", title: "第2章：MIND 田捕手 ─ 尼克·胡哲的無肢人生", tag: "第二章", emoji: "🕊️" },
  { page: 46, code: "P.046", title: "第3章：三、人生的意義與目的", tag: "第三章", emoji: "🎯" },
  { page: 47, code: "P.047", title: "第3章：思辨樂園 ─ 尋找生命的北極星", tag: "第三章", emoji: "⭐" },
  { page: 48, code: "P.048", title: "第3章：思考地圖 ─ IKIGAI 生存意義哲學", tag: "第三章", emoji: "🌸" },
  { page: 49, code: "P.049", title: "第3章：MIND 田捕手 ─ 追尋生命意義的維克多·弗蘭克", tag: "第三章", emoji: "📖" },
  { page: 50, code: "P.050", title: "單元總結：人學探索心靈藍圖", tag: "總結", emoji: "🎨" },
  { page: 51, code: "P.051", title: "延伸閱讀：全人發展的現代啟示", tag: "延伸", emoji: "📚" },
  { page: 52, code: "P.052", title: "課後隨堂綜合測驗 (上)", tag: "測驗", emoji: "✍️" },
  { page: 53, code: "P.053", title: "課後隨堂綜合測驗 (下)", tag: "測驗", emoji: "🏆" }
];

export default function Unit02TextbookPageViewer({
  answers,
  setAnswers,
  role,
  isSubmitted,
  currentPage: controlledPage,
  onPageChange,
  onFinishUnit
}: Unit02TextbookPageViewerProps) {
  const [localPage, setLocalPage] = useState<number>(36);
  const currentPage = controlledPage !== undefined ? controlledPage : localPage;

  const activePageData = CHAPTERS_NAV_UNIT_02.find(p => p.page === currentPage) || CHAPTERS_NAV_UNIT_02[0];
  const readPagesList = answers.textbookReadPages || [36];

  const setCurrentPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalPage(page);
    }
    
    if (role === 'student' && !isSubmitted) {
      const readPages = answers.textbookReadPages || [36];
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
  let heroImage = charXiaopingImg;

  if (currentPage === 36) {
    heroImage = charXiaopingImg;
    leftContent = (
      <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E07A5F] mr-1">曉萍</span>在社團活動後對小組成員說：「有時候我覺得自己好像只是一台跟著日程表運作的機器，每天上學、寫作業、補習，到底我真正的特質是什麼呢？」
        </p>
        <p>
          <span className="font-extrabold text-[#2F2117] border-b-2 border-[#E07A5F] mr-1">可華</span>回應：「我也常這樣想！人學探索就是要讓我們明白：我們不只是生物學上的個體，更擁有獨一無二的自由意志與靈性價值。」
        </p>
      </div>
    );
    rightQuestionBadge = "思考問題";
    rightQuestionText = "如果你要用三個關鍵詞來描述「我是誰？」，你會選擇哪三個詞彙？為什麼？";
    rightAnswerValue = answers.p36_reflection || '';
    onRightAnswerChange = (val) => updateAnswer('p36_reflection', val);
    rightTips = [
      { tipId: "TIP 01", text: "結合個人的性格特徵、價值觀與興趣喜好", icon: "👤" },
      { tipId: "TIP 02", text: "思考別人眼中的你與你自己心中的形象有何不同", icon: "🪞" }
    ];
  } else {
    heroImage = charBojunImg;
    leftContent = (
      <div className="space-y-3 text-slate-700 leading-relaxed font-medium">
        <p className="text-sm font-bold text-slate-800">{activePageData.title}</p>
        <p className="text-xs text-slate-600">
          探索人類身心靈發展、自我實現與生存意義，學習建構屬於自己的全人生命藍圖。
        </p>
      </div>
    );
    rightQuestionBadge = "人學思辨";
    rightQuestionText = `請寫下你對於「${activePageData.title}」這一課題的探索心得：`;
    rightAnswerValue = answers[`p${String(currentPage).padStart(2, '0')}_reflection`] || '';
    onRightAnswerChange = (val) => updateAnswer(`p${String(currentPage).padStart(2, '0')}_reflection`, val);
    rightTips = [
      { tipId: "TIP 01", text: "檢視身心靈平衡狀態", icon: "🌱" },
      { tipId: "TIP 02", text: "連結馬斯洛需求與 IKIGAI 核心概念", icon: "🌸" }
    ];
  }

  return (
    <TextbookReaderLayout
      unitCategory="人學探索"
      unitTitle="漫步奇幻的旅程"
      unitCode="單元三"
      pagesNav={CHAPTERS_NAV_UNIT_02}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onFinishUnit={onFinishUnit}
      readPages={readPagesList}
      pageTitle={activePageData.title}
      pageCode={`P.${String(currentPage).padStart(3, '0')}`}
      leftHeaderTitle={`情境對話：${activePageData.title}`}
      leftHeroTitle={activePageData.title}
      leftHeroSubtitle="人學探索與自我認知"
      leftHeroImage={heroImage}
      leftContent={leftContent}
      rightHeaderTitle="01 你的看法是？"
      rightQuestionBadge={rightQuestionBadge}
      rightQuestionText={rightQuestionText}
      rightAnswerValue={rightAnswerValue}
      onRightAnswerChange={onRightAnswerChange}
      rightAnswerPlaceholder="在此寫下你的反思與體會..."
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
