/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Save, 
  CheckCircle, 
  Star, 
  Award, 
  Bookmark, 
  UserCheck, 
  Activity,
  MessageSquare,
  FileText
} from 'lucide-react';
import { StudentSubmission } from '../types';
import { UNIT_DATA } from '../data';

import Unit00TextbookPageViewer from './Unit00TextbookPageViewer';
import Unit01TextbookPageViewer from './Unit01TextbookPageViewer';
import Unit02TextbookPageViewer from './Unit02TextbookPageViewer';
import Unit03TextbookPageViewer from './Unit03TextbookPageViewer';
import Unit04TextbookPageViewer from './Unit04TextbookPageViewer';
import Unit05TextbookPageViewer from './Unit05TextbookPageViewer';

interface UnitStudyViewProps {
  unitId: string;
  onBack: () => void;
  onSelectUnit?: (unitId: string) => void;
  submissions: StudentSubmission[];
  onChangeSubmissions: (subs: StudentSubmission[]) => void;
  activeStudentId: string;
  role: 'student' | 'teacher';
}

export default function UnitStudyView({
  unitId,
  onBack,
  onSelectUnit,
  submissions,
  onChangeSubmissions,
  activeStudentId,
  role
}: UnitStudyViewProps) {
  
  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Current active student submission (for students) or selected student submission (for teachers)
  const [selectedStudentId, setSelectedStudentId] = useState<string>(activeStudentId);
  const currentSubmission = submissions.find(s => s.studentId === selectedStudentId) || submissions[0];

  // Sync state if activeStudentId changes
  useEffect(() => {
    setSelectedStudentId(activeStudentId);
  }, [activeStudentId]);

  // Extract or initialize worksheet state for this unit
  const currentUnitWorksheet = currentSubmission?.unitWorksheets?.[unitId] || {
    answers: {},
    submitted: false
  };

  // Local answer states matching the unit
  const [answers, setAnswers] = useState<Record<string, any>>(currentUnitWorksheet.answers || {});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(currentUnitWorksheet.submitted);

  // Sync local answers if current student submission or unit worksheet updates
  useEffect(() => {
    const ws = currentSubmission?.unitWorksheets?.[unitId] || { answers: {}, submitted: false };
    setAnswers(ws.answers || {});
    setIsSubmitted(ws.submitted);
  }, [selectedStudentId, unitId, currentSubmission]);

  // Active Tab: 'textbook' or 'feedback'
  const [activeTab, setActiveTab] = useState<'textbook' | 'feedback'>('textbook');

  // Teacher feedback form states
  const [teacherComments, setTeacherComments] = useState<string>('');
  const [teacherScore, setTeacherScore] = useState<number>(95);
  const [teacherBadges, setTeacherBadges] = useState<string[]>([]);
  const [isAiGrading, setIsAiGrading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUnitWorksheet.feedback) {
      setTeacherComments(currentUnitWorksheet.feedback.comments || '');
      setTeacherScore(currentUnitWorksheet.feedback.score || 95);
      setTeacherBadges(currentUnitWorksheet.feedback.badges || []);
    } else {
      setTeacherComments('');
      setTeacherScore(95);
      setTeacherBadges([]);
    }
  }, [selectedStudentId, unitId, currentSubmission]);

  // Save Student Answers Draft or Submit
  const handleSaveAnswers = (submit: boolean = false) => {
    const updatedSubmissions = submissions.map(sub => {
      if (sub.studentId === selectedStudentId) {
        const existingWorksheets = sub.unitWorksheets || {};
        return {
          ...sub,
          unitWorksheets: {
            ...existingWorksheets,
            [unitId]: {
              answers,
              submitted: submit,
              submittedAt: submit ? new Date().toISOString().replace('T', ' ').substring(0, 16) : existingWorksheets[unitId]?.submittedAt,
              feedback: existingWorksheets[unitId]?.feedback,
              readingProgress: 999
            }
          }
        };
      }
      return sub;
    });

    onChangeSubmissions(updatedSubmissions);
    setIsSubmitted(submit);
    setToast({ 
      message: submit ? "🎉 學習單已成功提交給林老師！" : "💾 進度已成功暫存！", 
      type: "success" 
    });
  };

  // AI & Local grading simulations for teacher
  const simulateLocalGrading = () => {
    const studentName = currentSubmission.studentName;
    let comments = "";
    let score = 95;
    let badges: string[] = [];

    if (unitId === 'unit_00') {
      comments = `同學好！我是林老師。看了你在「總說學習單」中對幸福生命的詮釋，老師感到十分欣慰。你在五維度幸福指數自評中表現出極佳的自省能力。希望你在高中的三年裡，能依照這份誓言，勇敢探索自己生命的色彩！`;
      score = 94;
      badges = ["思考小高手", "未來的自己"];
    } else if (unitId === 'unit_01') {
      comments = `哈囉 ${studentName}！林老師看完你的「生活謬誤探測器」答案。你對那三個常見邏輯謬誤（群眾、人身攻擊、滑坡）的配對完全正確！並且你能把謬誤連結到自己之前的衝動消費盲點，這代表你已經懂得運用「邏輯審查」去打破跟風思維。繼續保持這顆清晰冷靜的哲學大腦！`;
      score = 96;
      badges = ["思考小高手", "韌性練習中"];
    } else if (unitId === 'unit_02') {
      comments = `同學好！我是林老師。看完了你在「人學探索」學習單上的豐富回答，我感到非常驚艷！在「狼孩潘托哈」的思辨中，你能深度辨別外在特徵與內在人性的交織。在《黑暗榮耀》人性覺察中，你對同珢的處境展現了極高的同理心。特別是你對呼吸體驗的反思中，體會到身心能量的專注與放鬆，這就是靈性修養與自我貼近的絕佳起步。非常好，繼續保持這份溫暖的同理大愛！`;
      score = 95;
      badges = ["同理心大師", "正念覺察生"];
    } else if (unitId === 'unit_03') {
      comments = `同學好！我是林老師。看了你在「終極關懷」學習單中的深刻反思，老師非常感動。在生命航點的選擇中，你展現了超越年齡的成熟；而你對三個工人的啟示中，把讀書上學昇華到「造福他人、發掘熱愛」的層面，這正是第三位蓋大教堂工人的「至善」格局！你分享了你目前最珍貴的價值寶盒，完美契合了亞里斯多德的理智至善真諦！太棒了，繼續勇敢航行你的生命大夢！`;
      score = 97;
      badges = ["哲思小學霸", "利他大愛生"];
    } else {
      comments = `同學好！看完你在這份學習單中的精彩作答。不論是思考的反省還是心靈的探索，都展現出極具溫度的體會。加油！繼續在生命教育的旅程中發光發熱。`;
      score = 95;
      badges = ["思考小高手"];
    }

    setTeacherComments(comments);
    setTeacherScore(score);
    setTeacherBadges(badges);
  };

  const handleAiGrading = async () => {
    setIsAiGrading(true);
    try {
      const res = await fetch('/api/grade-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          answers,
          studentName: currentSubmission.studentName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "API_KEY_MISSING") {
          setToast({ 
            message: "💡 提示：系統尚未偵測到 GEMINI_API_KEY，已自動切換至「精美本機模擬點評」！您可至右上方 ⚙️ Settings 輸入金鑰啟用真實 AI。", 
            type: "info" 
          });
          simulateLocalGrading();
        } else {
          throw new Error(data.message || "點評失敗");
        }
      } else {
        setTeacherComments(data.comments);
        setTeacherScore(data.score || 90);
        setTeacherBadges(data.badges || []);
      }
    } catch (err: any) {
      console.error(err);
      setToast({ 
        message: "⚠️ 讀取 AI 評語時發生網路錯誤，已自動為您啟用本機模擬！", 
        type: "warning" 
      });
      simulateLocalGrading();
    } finally {
      setIsAiGrading(false);
    }
  };

  const handleTeacherSubmitFeedback = () => {
    if (!teacherComments.trim()) {
      setToast({ message: "⚠️ 請輸入批改評語與反饋！", type: "warning" });
      return;
    }

    const feedbackObj = {
      comments: teacherComments,
      gradedBy: '林老師',
      gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badges: teacherBadges,
      score: teacherScore
    };

    const updatedSubmissions = submissions.map(sub => {
      if (sub.studentId === selectedStudentId) {
        const existingWorksheets = sub.unitWorksheets || {};
        const currentWS = existingWorksheets[unitId] || { answers: {}, submitted: false };
        return {
          ...sub,
          unitWorksheets: {
            ...existingWorksheets,
            [unitId]: {
              ...currentWS,
              feedback: feedbackObj
            }
          }
        };
      }
      return sub;
    });

    onChangeSubmissions(updatedSubmissions);
    setToast({ 
      message: `🎉 已成功將單元學習單批改回饋送出給 ${currentSubmission.studentName}！`, 
      type: "success" 
    });
  };

  const UNITS_ORDER = ['unit_00', 'unit_01', 'unit_02', 'unit_03', 'unit_04', 'unit_05'];
  const UNIT_NAMES: Record<string, string> = {
    unit_00: '總說：凝視生命的地圖',
    unit_01: '單元一 思考與思辨',
    unit_02: '單元二 人學探索',
    unit_03: '單元三 終極關懷',
    unit_04: '單元四 價值思辨',
    unit_05: '單元五 靈性修養',
  };

  const handleFinishUnit = () => {
    const currentIndex = UNITS_ORDER.indexOf(unitId);
    if (currentIndex >= 0 && currentIndex < UNITS_ORDER.length - 1) {
      const nextUnitId = UNITS_ORDER[currentIndex + 1];
      if (onSelectUnit) {
        onSelectUnit(nextUnitId);
      }
      setToast({
        message: `🎉 已完成「${UNIT_NAMES[unitId] || unitId}」閱讀！直接跳轉至下一單元：「${UNIT_NAMES[nextUnitId] || nextUnitId}」`,
        type: "success"
      });
    } else {
      setToast({
        message: `🏆 恭喜！您已完成全部單元的課本閱讀與學習！`,
        type: "success"
      });
      if (onSelectUnit) {
        onSelectUnit('unit_00');
      }
    }
  };

  const renderTextbookViewer = () => {
    const props = {
      answers,
      setAnswers,
      role,
      isSubmitted,
      onFinishUnit: handleFinishUnit
    };

    switch (unitId) {
      case 'unit_00':
        return <Unit00TextbookPageViewer key="unit_00" {...props} />;
      case 'unit_01':
        return <Unit01TextbookPageViewer key="unit_01" {...props} />;
      case 'unit_02':
        return <Unit02TextbookPageViewer key="unit_02" {...props} />;
      case 'unit_03':
        return <Unit03TextbookPageViewer key="unit_03" {...props} />;
      case 'unit_04':
        return <Unit04TextbookPageViewer key="unit_04" {...props} />;
      case 'unit_05':
        return <Unit05TextbookPageViewer key="unit_05" {...props} />;
      default:
        return (
          <div className="p-8 text-center text-gray-500 font-sans">
            尚未支援此單元的電子課本。
          </div>
        );
    }
  };

  const unitName = UNIT_DATA.find(u => u.id === unitId)?.title || "生命探索單元";

  return (
    <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm min-h-[600px] flex flex-col justify-between relative">
      
      {/* Dynamic beautiful non-blocking toast overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-lg border text-xs sm:text-sm max-w-md font-sans ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800 animate-pulse'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-100 text-amber-800'
                : 'bg-blue-50 border-blue-100 text-blue-800'
            }`}
          >
            <span className="font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-3.5 py-1.5 hover:bg-[#E8F3EE] bg-white rounded-2xl border border-slate-200 text-[#2E7D32] hover:text-[#236327] transition-all font-bold text-xs flex items-center gap-1 cursor-pointer shadow-3xs"
            title="返回單元總覽"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>返回單元總覽</span>
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                泰宇生命教育
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-[10px] text-gray-400 font-bold">目前單元</span>
            </div>
            <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-blue-500" />
              {unitName}
            </h2>
          </div>
        </div>

        {/* Status badges and Teacher Student Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {role === 'teacher' ? (
            <div className="flex items-center gap-2 bg-blue-50/60 p-1.5 rounded-2xl border border-blue-100">
              <span className="text-xs font-bold text-blue-900 ml-1.5">🎓 學生切換：</span>
              <select 
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs font-black p-1.5 rounded-xl border border-blue-100 outline-none focus:border-blue-500 bg-white"
              >
                {submissions.map(sub => (
                  <option key={sub.studentId} value={sub.studentId}>
                    {sub.studentName}
                  </option>
                ))}
              </select>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl ml-1.5 ${
                isSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isSubmitted ? "學生已交" : "學生未交"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3.5 py-1.5 rounded-2xl border ${
                isSubmitted 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-amber-50 border-amber-100 text-amber-800'
              }`}>
                {isSubmitted ? "🟢 已完成並提交批改" : "✏️ 隨堂練習與自評中"}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* TAB SELECTOR: TEXTBOOK vs GRADING/FEEDBACK */}
      <div className="flex border-b border-gray-100 mb-6">
        <button
          onClick={() => setActiveTab('textbook')}
          className={`px-5 py-2.5 text-xs font-black border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'textbook'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-textbook"
        >
          <FileText className="w-4 h-4" />
          📖 課本內容與隨堂練習
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-5 py-2.5 text-xs font-black border-b-2 flex items-center gap-1.5 transition-all relative ${
            activeTab === 'feedback'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-feedback"
        >
          <MessageSquare className="w-4 h-4" />
          {role === 'teacher' ? '👩‍🏫 批改與點評回饋' : '💬 老師批改反饋'}
          {currentUnitWorksheet.feedback && (
            <span className="absolute top-1.5 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* 2. TABBED CONTENT VIEW AREA */}
      <div className="flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === 'textbook' ? (
            <motion.div
              key="textbook-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              {/* Actual Textbook Page Viewer */}
              <div className="flex-1 min-h-[500px]">
                {renderTextbookViewer()}
              </div>

              {/* Float-style Student Action Controls inside Textbook Tab */}
              {role === 'student' && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl gap-3">
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">隨堂填答暫存與提交中心</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {isSubmitted 
                        ? "🟢 答案已送出給林老師！可以點選「老師批改反饋」分頁查看批改狀態。" 
                        : "💾 您在左方/上方電子課本各分頁中填寫的回答會即時保留，填寫完畢請點選提交。"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      disabled={isSubmitted}
                      onClick={() => handleSaveAnswers(false)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-100 text-blue-600 font-bold text-xs rounded-xl border border-blue-100 flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                      id="btn-save-draft"
                    >
                      <Save className="w-3.5 h-3.5" />
                      暫存進度
                    </button>
                    <button
                      disabled={isSubmitted}
                      onClick={() => handleSaveAnswers(true)}
                      className="flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                      id="btn-submit-answers"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      提交給老師
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="feedback-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 flex-1 max-w-3xl mx-auto w-full py-2"
            >
              {/* Feedback viewing and grading container */}
              <div className="bg-[#FCFAF7] border border-[#F5EAD6] p-6 rounded-3xl space-y-6 shadow-3xs">
                
                {/* Header info */}
                <div className="border-b border-amber-200/40 pb-4">
                  <h3 className="text-base font-black text-[#5C4538] flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    學習單批改回饋中心
                  </h3>
                  <p className="text-xs text-[#8A7568] font-semibold mt-1">
                    在此查看老師點評、評分、生命勳章以及 AI 協同點評。
                  </p>
                </div>

                {/* Show Student Answers Review Box for Teacher or summary check */}
                {role === 'teacher' && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2.5">
                    <h4 className="text-xs font-black text-slate-800">📌 學生隨堂填答快速瀏覽</h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      請點擊上方 <strong className="text-blue-600">「📖 課本內容與隨堂練習」</strong> 分頁，翻閱各個頁面（例如 p.4、p.5、p.10 等）即可直接瀏覽該學生在各課本頁面內填寫的具體文字與作答。
                    </p>
                  </div>
                )}

                {/* Display Current Teacher Feedback */}
                {currentUnitWorksheet.feedback ? (
                  <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/20 to-white border border-amber-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                    <div className="flex justify-between items-center border-b border-amber-200/30 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">👩🏻‍🏫</span>
                        <div>
                          <h4 className="font-extrabold text-xs text-[#5C4538]">林老師的批改與祝福</h4>
                          <span className="text-[9px] text-[#A38E80] font-semibold block mt-0.5">評閱時間：{currentUnitWorksheet.feedback.gradedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1 bg-[#FAF1E6] border border-[#EEDCC8]/60 px-3 py-1 rounded-xl shadow-3xs">
                        <span className="text-[10px] font-bold text-amber-800">總體評分:</span>
                        <span className="text-sm font-extrabold text-amber-900 font-sans">{currentUnitWorksheet.feedback.score}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#5C4538] leading-relaxed font-semibold bg-white/60 p-4 rounded-xl border border-amber-100/30">
                      {currentUnitWorksheet.feedback.comments}
                    </p>

                    {currentUnitWorksheet.feedback.badges && currentUnitWorksheet.feedback.badges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        <span className="text-[10px] text-[#7A6255] font-black flex items-center gap-1">
                          <Award className="w-4 h-4 text-amber-500" />
                          解鎖生命勳章：
                        </span>
                        {currentUnitWorksheet.feedback.badges.map((badge, bidx) => (
                          <span key={bidx} className="bg-amber-100 text-amber-900 font-black text-[10px] px-3 py-1 rounded-full border border-amber-200 shadow-3xs">
                            🏅 {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  role === 'student' && (
                    <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center space-y-3 shadow-3xs">
                      <span className="text-4xl block">⏳</span>
                      <h4 className="text-sm font-black text-slate-800">林老師正在批改中</h4>
                      <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
                        您的學習單已經暫存或提交囉！老師會仔細翻閱您在課本隨堂練習中寫下的文字，並為您撰寫溫暖的鼓勵評語與頒發專屬生命勳章，請耐心等待。
                      </p>
                    </div>
                  )
                )}

                {/* Teacher Feedback input and editing controls */}
                {role === 'teacher' && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-3xs">
                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                      <UserCheck className="w-4.5 h-4.5 text-blue-600" />
                      教師點評評分中心
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-500 block">給予評分 (0-100)：</label>
                          <input 
                            type="number"
                            min="0"
                            max="100"
                            value={teacherScore}
                            onChange={(e) => setTeacherScore(Number(e.target.value))}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-sans font-bold outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-500 block">頒發生命勳章：</label>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {["思考小高手", "未來的自己", "韌性練習中", "同理心大師", "正念覺察生", "哲思小學霸", "利他大愛生", "勇敢追夢中"].map((badge) => {
                              const isSelected = teacherBadges.includes(badge);
                              return (
                                <button
                                  key={badge}
                                  onClick={() => {
                                    if (isSelected) {
                                      setTeacherBadges(teacherBadges.filter(b => b !== badge));
                                    } else {
                                      setTeacherBadges([...teacherBadges, badge]);
                                    }
                                  }}
                                  className={`text-[9px] font-black px-2.5 py-1 rounded-full border transition-all ${
                                    isSelected 
                                      ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-3xs' 
                                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                  }`}
                                >
                                  🏅 {badge}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-500 block">點評評語與祝福文字：</label>
                          <button
                            disabled={isAiGrading}
                            onClick={handleAiGrading}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-black flex items-center gap-0.5 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-all"
                            id="btn-ai-grading"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-100" />
                            {isAiGrading ? "AI 協同點評生成中..." : "✨ AI 協同點評"}
                          </button>
                        </div>
                        <textarea 
                          rows={4}
                          value={teacherComments}
                          onChange={(e) => setTeacherComments(e.target.value)}
                          placeholder="請翻閱課本分頁查看學生的隨堂填答，並在此寫下對學生的鼓勵評語與指引點評..."
                          className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white leading-relaxed font-semibold"
                        />
                      </div>

                      <button
                        onClick={handleTeacherSubmitFeedback}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                        id="btn-teacher-submit-feedback"
                      >
                        <UserCheck className="w-4 h-4" />
                        送出批改與回饋給學生
                      </button>

                    </div>
                  </div>
                )}

                {/* Helpful guides */}
                <div className="bg-[#FAF8F5] border border-amber-100/50 rounded-2xl p-4.5 space-y-2.5">
                  <h3 className="text-xs font-black text-amber-950 flex items-center gap-1">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    💡 生命教育的點評指引
                  </h3>
                  <div className="space-y-1 text-[10px] text-[#7A6255] font-semibold leading-relaxed">
                    <p>
                      <strong>❤️ 探索大於對錯：</strong> 生命教育課本中的隨堂練習沒有標準答案。重點是鼓勵學生與自我產生有溫度的對話。
                    </p>
                    <p>
                      <strong>🌟 正向回饋與激勵：</strong> 教師評語應側重於學生展現出的「思考自主性」、「生活實踐力」與「同理關懷心」。
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
