/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Bookmark, 
  Clock, 
  Sparkles, 
  FileText, 
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Leaf
} from 'lucide-react';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';

export interface PageNavItem {
  page: number;
  code: string; // e.g. "P.004"
  title: string;
  tag?: string;
  emoji?: string;
}

export interface TipItem {
  tipId: string; // e.g. "TIP 01"
  text: string;
  icon?: string;
}

export interface TextbookReaderLayoutProps {
  unitCategory: string; // e.g. "參考生命教育" or "哲學思考"
  unitTitle: string; // e.g. "凝視生命的地圖"
  unitCode: string; // e.g. "單元一"
  pagesNav: PageNavItem[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onFinishUnit?: () => void;
  readPages?: number[];
  
  // Header / Breadcrumb
  pageTitle: string;
  pageCode: string; // e.g. "P.004"
  
  // Left Sub-Column (Story / Dialogue / Reading Content)
  leftHeaderTitle: string; // e.g. "情境的對話：凝視生命地圖"
  leftHeroTitle?: string;
  leftHeroSubtitle?: string;
  leftHeroImage?: string;
  leftContent: React.ReactNode;
  
  // Right Sub-Column (Student Interactive Workspace)
  rightHeaderTitle?: string; // e.g. "01 你的看法是？"
  rightQuestionBadge?: string; // e.g. "思考問題"
  rightQuestionText?: string | React.ReactNode;
  rightAnswerValue?: string;
  onRightAnswerChange?: (val: string) => void;
  rightAnswerPlaceholder?: string;
  rightMaxLength?: number;
  rightTips?: TipItem[];
  customRightContent?: React.ReactNode; // For matching / interactive widgets
  
  // Bottom Bar Info
  suggestedTime?: string; // e.g. "15 - 20 分鐘"
  tipText?: string;
  
  // Student Profile Info
  userName?: string;
  userAvatarUrl?: string;
  
  // Role / Disabled state
  isDisabled?: boolean;
}

export function TextbookReaderLayout({
  unitCategory,
  unitTitle,
  unitCode,
  pagesNav,
  currentPage,
  onPageChange,
  onFinishUnit,
  readPages = [],
  pageTitle,
  pageCode,
  leftHeaderTitle,
  leftHeroTitle,
  leftHeroSubtitle,
  leftHeroImage,
  leftContent,
  rightHeaderTitle = "01 你的看法是？",
  rightQuestionBadge = "思考問題",
  rightQuestionText,
  rightAnswerValue = "",
  onRightAnswerChange,
  rightAnswerPlaceholder = "在此寫下你的真實想法...",
  rightMaxLength = 500,
  rightTips = [],
  customRightContent,
  suggestedTime = "15 – 20 分鐘",
  tipText = "可依閱讀與思考，點擊側邊章節可快速切換或再次閱讀。填寫後記得儲存。",
  userName = "王小文",
  userAvatarUrl = charXiaowenImg,
  isDisabled = false
}: TextbookReaderLayoutProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const currentPageIndex = pagesNav.findIndex(p => p.page === currentPage);
  const prevPageObj = currentPageIndex > 0 ? pagesNav[currentPageIndex - 1] : null;
  const nextPageObj = currentPageIndex >= 0 && currentPageIndex < pagesNav.length - 1 ? pagesNav[currentPageIndex + 1] : null;

  return (
    <div className="w-full bg-[#FAF8F5] text-slate-800 font-sans rounded-3xl border border-[#EFE8DC] shadow-sm overflow-hidden flex flex-col">
      
      {/* MAIN CONTENT BODY AREA (Grid Layout) */}
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* LEFT SIDEBAR: CHAPTER / PAGE MAP (`lg:col-span-4 xl:col-span-3.5`) */}
        <aside className="lg:col-span-4 xl:col-span-3.5 bg-white rounded-3xl border border-[#ECE5D8] p-5 shadow-xs space-y-5">
          {/* Unit Header */}
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4ED] text-[#B86B53] rounded-full text-xs sm:text-sm font-extrabold">
              <span>📁</span>
              <span>{unitCode} | {unitCategory}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
              {unitTitle}
            </h2>
          </div>

          {/* Page Vertical List - Fully visible without scrolling */}
          <div className="space-y-2.5">
            {pagesNav.map((item, idx) => {
              const isActive = item.page === currentPage;
              const isRead = readPages.includes(item.page);

              return (
                <button
                  key={item.page}
                  onClick={() => onPageChange(item.page)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFF7F2] border-[#FADECB] shadow-3xs ring-2 ring-[#E07A5F]/20'
                      : 'bg-white border-[#EFE8DC] hover:border-[#E2D5C3] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {/* Circle number pill or page icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                    isActive 
                      ? 'bg-[#E07A5F] text-white shadow-3xs' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isActive ? (idx + 1) : (
                      <FileText className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm sm:text-base leading-snug break-words ${
                      isActive ? 'font-black text-[#8A3C28]' : 'font-bold text-slate-800'
                    }`}>
                      <span className="font-mono text-xs font-bold text-[#E07A5F] mr-1.5 inline-block">{item.code}</span>
                      {item.title}
                    </p>
                  </div>

                  {isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="已閱讀" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT MAIN WORKSPACE (`lg:col-span-8 xl:col-span-8.5`) */}
        <main className="lg:col-span-8 xl:col-span-8.5 space-y-6">
          
          {/* Breadcrumb & Bookmark Header */}
          <div className="bg-white rounded-2xl border border-[#ECE5D8] px-5 py-4 flex flex-wrap items-center justify-between gap-3 shadow-3xs">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-bold flex-wrap">
              <span className="flex items-center gap-1">
                <span>📁</span>
                <span>{unitCategory}</span>
              </span>
              <span>&gt;</span>
              <span>{unitCode}：{unitTitle}</span>
              <span>&gt;</span>
              <span className="text-[#E07A5F] font-extrabold">{pageCode}</span>
            </div>

            {/* Bookmark button & Title */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2.5 rounded-xl transition-all border cursor-pointer ${
                  isBookmarked 
                    ? 'bg-[#FFF3EC] text-[#E07A5F] border-[#FADECB]' 
                    : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
                }`}
                title={isBookmarked ? "取消書籤" : "加入書籤"}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#E07A5F]' : ''}`} />
              </button>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* STACKED CONTENT CONTAINER (Reading Content on Top / Interactive Question Below) */}
          <div className="flex flex-col space-y-6">
            
            {/* UPPER SECTION: READING / STORY CONTENT */}
            <div className="bg-white rounded-3xl border border-[#ECE5D8] p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
              
              <div className="space-y-5">
                {/* Section Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF4EC] text-[#E07A5F] rounded-full text-xs sm:text-sm font-extrabold">
                  <BookOpen className="w-4 h-4" />
                  <span>{leftHeaderTitle}</span>
                </div>

                {/* Hero / Graphic Banner Card */}
                {(leftHeroTitle || leftHeroImage) && (
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#FFF0E6] via-[#FAF3EA] to-[#F3F7F5] border border-[#F5E6D8] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 min-h-[140px]">
                    <div className="space-y-1.5 z-10 flex-1">
                      <span className="inline-block px-3 py-1 bg-[#E07A5F] text-white rounded-md text-xs sm:text-sm font-black font-mono shadow-3xs">
                        {pageCode}
                      </span>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#4A281E] tracking-tight leading-snug">
                        {leftHeroTitle || pageTitle}
                      </h3>
                      {leftHeroSubtitle && (
                        <p className="text-sm sm:text-base text-[#7A4B3A] font-bold">{leftHeroSubtitle}</p>
                      )}
                    </div>

                    {leftHeroImage && (
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-md shrink-0 bg-white">
                        <img 
                          src={leftHeroImage} 
                          alt="插圖" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Paragraph / Dialogue Text Content */}
                <div className="text-base sm:text-lg text-slate-800 leading-relaxed sm:leading-loose space-y-4 font-medium pt-1">
                  {leftContent}
                </div>
              </div>

            </div>

            {/* LOWER SECTION: INTERACTIVE QUESTION WORKSPACE */}
            <div className="bg-white rounded-3xl border border-[#ECE5D8] p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
              
              <div className="space-y-5">
                {/* Section Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF4EC] text-[#E07A5F] rounded-full text-xs sm:text-sm font-extrabold">
                  <MessageSquare className="w-4 h-4" />
                  <span>{rightHeaderTitle}</span>
                </div>

                {/* Custom Right Content OR standard question textarea */}
                {customRightContent ? (
                  customRightContent
                ) : (
                  <>
                    {/* Main Question Callout Card */}
                    <div className="bg-[#FFF8F3] border border-[#F5E6D8] rounded-2xl p-6 shadow-3xs space-y-4">
                      <div className="inline-block px-3 py-1 bg-[#FDE2D1] text-[#A84A30] rounded-md text-xs sm:text-sm font-black">
                        {rightQuestionBadge}
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                        {rightQuestionText}
                      </div>

                      {/* Textarea Input */}
                      <div className="space-y-2 pt-1">
                        <textarea
                          disabled={isDisabled}
                          rows={5}
                          value={rightAnswerValue}
                          onChange={(e) => onRightAnswerChange && onRightAnswerChange(e.target.value)}
                          placeholder={rightAnswerPlaceholder}
                          className="w-full text-base p-4 rounded-xl border border-[#E8D7C8] focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/30 outline-none bg-white font-medium text-slate-900 leading-relaxed resize-none shadow-2xs"
                        />
                        <div className="flex justify-end text-xs font-bold text-slate-400">
                          <span>{rightAnswerValue.length} / {rightMaxLength}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Tips Section */}
                    {rightTips && rightTips.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
                          <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                          <span>思考提示</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {rightTips.map((tip, idx) => (
                            <div 
                              key={tip.tipId || idx}
                              className="bg-[#FAF8F5] border border-[#EFE8DC] p-4 rounded-xl space-y-1.5 shadow-3xs"
                            >
                              <div className="inline-flex items-center gap-1 text-xs font-black text-[#E07A5F] bg-[#FFF4EC] px-2.5 py-1 rounded-md">
                                <span>{tip.icon || '🌿'}</span>
                                <span>{tip.tipId}</span>
                              </div>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-normal">
                                {tip.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>

          </div>

          {/* BOTTOM FULL-WIDTH INFO BAR */}
          <div className="bg-[#FAF5EE] border border-[#EEDCC8] rounded-3xl p-5 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-5">
            
            {/* Col 1: Page code */}
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-white text-[#E07A5F] flex items-center justify-center shrink-0 shadow-2xs border border-[#F5E6D8]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block leading-none mb-1">頁碼</span>
                <span className="text-sm sm:text-base font-black text-slate-900 font-mono leading-none">{pageCode}</span>
              </div>
            </div>

            {/* Col 2: Suggested time */}
            <div className="flex items-center gap-3.5 w-full md:w-auto md:border-l md:border-slate-300 md:pl-6">
              <div className="w-10 h-10 rounded-xl bg-white text-[#E07A5F] flex items-center justify-center shrink-0 shadow-2xs border border-[#F5E6D8]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block leading-none mb-1">建議時間</span>
                <span className="text-sm sm:text-base font-black text-slate-900 leading-none">{suggestedTime}</span>
              </div>
            </div>

            {/* Col 3: Tip */}
            <div className="flex items-center gap-3.5 w-full md:w-auto md:border-l md:border-slate-300 md:pl-6 flex-1">
              <div className="w-10 h-10 rounded-xl bg-white text-[#E07A5F] flex items-center justify-center shrink-0 shadow-2xs border border-[#F5E6D8]">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-500 block leading-none mb-1">小提醒</span>
                <span className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed block">{tipText}</span>
              </div>
            </div>

          </div>

          {/* PAGE NAVIGATION BUTTONS AT BOTTOM */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={!prevPageObj}
              onClick={() => prevPageObj && onPageChange(prevPageObj.page)}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-3xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{prevPageObj ? `上一頁 (${prevPageObj.code})` : '已是第一頁'}</span>
            </button>

            <span className="text-xs sm:text-sm font-mono font-bold text-slate-500">
              {pageCode} / PAGE {pagesNav[pagesNav.length - 1]?.code}
            </span>

            <button
              onClick={() => {
                if (nextPageObj) {
                  onPageChange(nextPageObj.page);
                } else if (onFinishUnit) {
                  onFinishUnit();
                }
              }}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold border flex items-center gap-2 cursor-pointer transition-all shadow-xs active:scale-95 ${
                nextPageObj
                  ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  : 'border-[#B2DCBF] bg-[#2E7D32] hover:bg-[#236327] text-white shadow-md'
              }`}
            >
              <span>{nextPageObj ? `下一頁 (${nextPageObj.code})` : '完成閱讀 → 直接進入下一單元'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </main>
      </div>

    </div>
  );
}

export default TextbookReaderLayout;
