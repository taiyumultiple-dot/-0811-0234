/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Brain, 
  Check, 
  X,
  Compass,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "在生命教育的核心理念中，下列何者最符合「終極關懷」的意涵？",
    options: [
      "追求極致的物質財富與社會地位",
      "思考生命的終極價值、存在意義與生死關懷",
      "專注於個人當下的娛樂與短期享樂",
      "盲目跟從群眾的意見與潮流"
    ],
    correctIndex: 1,
    explanation: "「終極關懷」著重於探討生命的根本價值、存在的意義、生死問題以及超越物質層面的心靈寄託。",
    category: "終極關懷"
  },
  {
    id: 2,
    question: "當我們在面對生活中的「邏輯謬誤」時，最佳的思考策略是什麼？",
    options: [
      "立即情緒化反駁對手的言論",
      "跳脫習慣性思考，進行理性分析與多元立場審視",
      "直接接受大多數人的立場",
      "避免任何形式的溝通與對話"
    ],
    correctIndex: 1,
    explanation: "面對邏輯謬誤時，理性思辨要求我們保持批判性思考，檢視論證過程是否合乎邏輯，而非訴諸情緒或從眾心理。",
    category: "思考素養"
  },
  {
    id: 3,
    question: "關於「人學與自我認同」，下列何者最能展現健全的自我整合（Self-Identity）？",
    options: [
      "完全由社群媒體的按讚數來定義自我價值",
      "認識並接納自己的長處與局限，追求全人發展與獨特價值",
      "隨波逐流，隨時改變立場以迎合他人",
      "拒絕自我反省，認為自己永遠是正確的"
    ],
    correctIndex: 1,
    explanation: "健全的自我認同源於對自我的深刻理解與接納，能不被外界評價輕易動搖，並發揮個人獨特的生命潛能。",
    category: "人學與自我"
  },
  {
    id: 4,
    question: "在進行生命抉擇與道德思辨時，「效益主義」（Utilitarianism）的主要關注點為何？",
    options: [
      "遵守絕對不變的道德律令與義務",
      "追求最多數人的最大幸福與整體效益極大化",
      "僅以個人短期私利為唯一考量",
      "完全隨機做選擇，不受規範約束"
    ],
    correctIndex: 1,
    explanation: "效益主義以行動的結果為衡量標準，主張能夠為最多數人帶來最大幸福或減少痛苦的決策即為良善之舉。",
    category: "價值思辨"
  },
  {
    id: 5,
    question: "「生命的網絡」概念強調人與人、人與自然的相互連結，這能為我們帶來什麼啟示？",
    options: [
      "個人行為對社會與環境毫無影響",
      "培養同理心與責任感，實踐相互支持與利他共好的生命態度",
      "應該孤立自己，避免與世界產生互動",
      "只關注競爭勝負，忽視合作與共好"
    ],
    correctIndex: 1,
    explanation: "生命網絡讓我們看見彼此間密不可分的關聯，進而學會珍惜相遇、展現慈悲與同理，攜手締造和諧永續的社會。",
    category: "靈性修養"
  }
];

interface HumanologySelfIdentityQuizPageProps {
  onBack?: () => void;
  onSaveResult?: (score: number, answers: Record<number, number>) => void;
  role?: string;
  studentName?: string;
}

export default function HumanologySelfIdentityQuizPage({
  onBack,
  onSaveResult,
  role = 'student',
  studentName = '王小文'
}: HumanologySelfIdentityQuizPageProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const calculateResult = () => {
    const unanswered = QUIZ_QUESTIONS.filter(q => selectedAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert(`⚠️ 請完成所有題目後再提交答案！（尚有 ${unanswered.length} 題未作答）`);
      return;
    }

    let correctCount = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    if (onSaveResult) {
      onSaveResult(finalScore, selectedAnswers);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header & Navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>返回課程地圖</span>
          </button>

          <div className="flex items-center gap-2 bg-[#E8F3EE] px-3.5 py-1.5 rounded-full border border-[#2E7D32]/20 text-[#2E7D32] text-xs font-black">
            <GraduationCap className="w-4 h-4" />
            <span>生命教育核心測驗</span>
          </div>
        </div>

        {/* Hero Title Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2E7D32]/10 to-amber-100/30 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">📝</span>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                    人學與自我認同測驗
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#2E7D32] mt-0.5">
                    隨堂檢測你的生命哲思觀念！
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2 max-w-2xl">
                本測驗涵蓋人學意涵、自我整合、邏輯思考與終極關懷觀念。透過深度思辨問題，幫助你檢視個人對生命價值的理解與成長。
              </p>
            </div>

            {/* Score or Status summary card */}
            <div className="bg-[#F8FAF8] rounded-2xl p-4 border border-[#2E7D32]/15 shrink-0 flex flex-col items-center justify-center min-w-[160px] text-center">
              {submitted ? (
                <div>
                  <span className="text-xs font-black text-slate-500 block mb-1">測驗成績</span>
                  <span className="text-3xl font-black text-[#2E7D32]">{score}</span>
                  <span className="text-xs font-bold text-slate-400"> / 100 分</span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-black text-slate-500 block mb-1">作答進度</span>
                  <span className="text-2xl font-black text-slate-800">{answeredCount}</span>
                  <span className="text-xs font-bold text-slate-400"> / {QUIZ_QUESTIONS.length} 題</span>
                  <div className="w-24 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-[#2E7D32] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Questions Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        {QUIZ_QUESTIONS.map((q, qIndex) => {
          const userSelected = selectedAnswers[q.id];
          const isCorrect = userSelected === q.correctIndex;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.08 }}
              className={`bg-white rounded-3xl p-6 sm:p-7 shadow-xs border transition-all ${
                submitted 
                  ? isCorrect 
                    ? 'border-[#2E7D32]/30 ring-1 ring-[#2E7D32]/20' 
                    : 'border-red-200 ring-1 ring-red-100'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black">
                    Q{q.id}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E8F3EE] text-[#2E7D32] text-[11px] font-black">
                    {q.category}
                  </span>
                </div>

                {submitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black">
                        <Check className="w-3.5 h-3.5" /> 答對了
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-black">
                        <X className="w-3.5 h-3.5" /> 需要複習
                      </span>
                    )}
                  </div>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-800 mb-5 leading-snug">
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((optionText, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isThisSelected = userSelected === optIdx;
                  const isThisCorrectOption = q.correctIndex === optIdx;

                  let optionStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
                  let badgeStyle = "bg-white text-slate-600 border-slate-200";

                  if (submitted) {
                    if (isThisCorrectOption) {
                      optionStyle = "bg-[#E8F3EE] border-[#2E7D32] text-[#2E7D32] font-black";
                      badgeStyle = "bg-[#2E7D32] text-white border-[#2E7D32]";
                    } else if (isThisSelected && !isThisCorrectOption) {
                      optionStyle = "bg-red-50 border-red-300 text-red-700 font-bold";
                      badgeStyle = "bg-red-500 text-white border-red-500";
                    } else {
                      optionStyle = "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60";
                    }
                  } else if (isThisSelected) {
                    optionStyle = "bg-[#E8F3EE] border-[#2E7D32] text-[#2E7D32] font-extrabold shadow-2xs";
                    badgeStyle = "bg-[#2E7D32] text-white border-[#2E7D32]";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${optionStyle}`}
                    >
                      <span className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-black shrink-0 transition-colors ${badgeStyle}`}>
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm font-bold pt-0.5 leading-relaxed">
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 p-4 rounded-2xl space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                    <Brain className="w-4 h-4 text-[#2E7D32]" />
                    <span>解析說明：</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed pl-5">
                    {q.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Submit or Result Action Bar */}
        <div className="pt-4 pb-12">
          {!submitted ? (
            <button
              onClick={calculateResult}
              className="w-full py-4 bg-[#2E7D32] hover:bg-[#236327] text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>提交測驗答案</span>
            </button>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md text-center space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F3EE] text-[#2E7D32] text-3xl mb-1">
                🎉
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  測驗完成！成績：<span className="text-[#2E7D32]">{score}</span> 分
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1 max-w-md mx-auto">
                  太棒了！你展現了優秀的生命哲思與自我認同能力，恭喜解鎖「哲思小專家」成就勳章！
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重新測驗</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-5 py-2.5 bg-[#E8F3EE] hover:bg-[#d8ebd2] text-[#2E7D32] font-extrabold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedToast ? '連結已複製！' : '分享成績'}</span>
                </button>

                <button
                  onClick={onBack}
                  className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#236327] text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-2xs"
                >
                  返回課程地圖
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
