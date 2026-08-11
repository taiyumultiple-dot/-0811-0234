/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Sparkles, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Heart, 
  HelpCircle, 
  FileText, 
  Plus, 
  Trash2, 
  Eye, 
  UserCheck, 
  MessageSquare, 
  BarChart3, 
  Tv, 
  Award, 
  Check,
  Calendar,
  Clock,
  Play
} from 'lucide-react';
import { Character, StudentSubmission, TimelineEvent, Feedback, Encouragement } from '../types';
import SafeImageAvatar from './SafeImageAvatar';
import { LIFE_KEYWORDS, DEFAULT_ENCOURAGEMENTS } from '../data';
import { ACHIEVEMENTS } from '../achievements';

interface WorksheetTabProps {
  submissions: StudentSubmission[];
  onChangeSubmissions: (subs: StudentSubmission[]) => void;
  activeStudentId: string;
  role: 'student' | 'teacher';
  characters?: Character[];
  onEditAvatar?: (charId: string) => void;
}

export default function WorksheetTab({ 
  submissions, 
  onChangeSubmissions, 
  activeStudentId, 
  role,
  characters,
  onEditAvatar
}: WorksheetTabProps) {
  
  // Sheet type state: 'woop' or 'exhibition' or 'stats' (for teacher)
  const [activeSheet, setActiveSheet] = useState<'woop' | 'exhibition' | 'stats'>(
    role === 'teacher' ? 'stats' : 'woop'
  );

  // Active student submission data for Student view
  const currentSubmission = submissions.find(s => s.studentId === activeStudentId) || submissions[0];

  // Selected student for Teacher review
  const [selectedStudentId, setSelectedStudentId] = useState<string>(submissions[0]?.studentId || '');
  const selectedSubmission = submissions.find(s => s.studentId === selectedStudentId) || submissions[0];

  // Form local states for Student - WOOP
  const [woopStep, setWoopStep] = useState<number>(currentSubmission.woop.currentStep || 1);
  const [woopWish, setWoopWish] = useState<string>(currentSubmission.woop.wish);
  const [woopOutcome, setWoopOutcome] = useState<string>(currentSubmission.woop.outcome);
  const [woopObstacle, setWoopObstacle] = useState<string>(currentSubmission.woop.obstacle);
  const [woopPlan, setWoopPlan] = useState<string>(currentSubmission.woop.plan);

  // Form local states for Student - Exhibition
  const [exRemember, setExRemember] = useState<string>(currentSubmission.exhibition.rememberMe);
  const [exKeywords, setExKeywords] = useState<string[]>(currentSubmission.exhibition.keywords);
  const [exOneLiner, setExOneLiner] = useState<string>(currentSubmission.exhibition.oneLiner);
  const [exTimeline, setExTimeline] = useState<TimelineEvent[]>(currentSubmission.exhibition.timeline);
  const [newKeywordInput, setNewKeywordInput] = useState<string>('');
  
  // Form timeline events adder helper
  const [newTimelineYear, setNewTimelineYear] = useState<string>('');
  const [newTimelineText, setNewTimelineText] = useState<string>('');

  // Audio/encouragement speech simulator
  const [playingSpeech, setPlayingSpeech] = useState<string | null>(null);
  const [encouragements, setEncouragements] = useState<Encouragement[]>(DEFAULT_ENCOURAGEMENTS);
  const [newEncouragementText, setNewEncouragementText] = useState<string>('');
  const [showEncouragementInput, setShowEncouragementInput] = useState<boolean>(false);

  // Teacher feedback input form state
  const [teacherComments, setTeacherComments] = useState<string>('');
  const [teacherScore, setTeacherScore] = useState<number>(90);
  const [teacherSelectedBadges, setTeacherSelectedBadges] = useState<string[]>([]);
  const [isAiGrading, setIsAiGrading] = useState<boolean>(false);
  const feedbackBadges = ["勇敢追夢中", "思考小高手", "韌性練習中", "未來的自己"];

  // AI Inspiration States
  const [aiInspirations, setAiInspirations] = useState<Record<string, string>>({});
  const [loadingInspire, setLoadingInspire] = useState<Record<string, boolean>>({});
  
  // Interactive Keyword Wall Filter State
  const [selectedKeywordFilter, setSelectedKeywordFilter] = useState<string | null>(null);

  const simulateLocalInspiration = (fieldType: string) => {
    switch (fieldType) {
      case "wish":
        return "💡 寫作啟發：\n1. 你的願望可以更具體一點，例如：『想把數學成績提升 10 分』，或者『每晚關掉手機早睡 30 分鐘』。\n2. 試著讓它與你當下的學習阻礙有關。";
      case "outcome":
        return "💡 寫作啟發：\n1. 想像這個願望達成的那一天，你臉上是什麼表情？你的心情會有多輕鬆踏實？\n2. 試著寫下這對你的自信心、或身邊愛你的人（如家人）帶來什麼改變？";
      case "obstacle":
        return "💡 寫作啟發：\n1. 當你卡關、不想努力時，最容易誘惑你、讓你分心的是什麼？（例如滑手機、玩遊戲、直接躺平）\n2. 試著誠實寫出你內心逃避思考時的真實感受。";
      case "plan":
        return "💡 寫作啟發：\n1. 請用『當（遇到障礙）的時候，我就會（做一個不需要太多意志力、容易做到的具體替代行動）』來寫。\n2. 例如：當我『忍不住想拿起手機』時，我就會『把手機拿給客廳的媽媽，並深呼吸 3 次』。";
      case "remember":
        return "💡 寫作啟發：\n1. 想像在你的告別式上，你最在乎的親友回憶起你時，腦海中第一個浮現的溫暖畫面是什麼？\n2. 你希望他們最常提起你的哪一項善良品質、溫暖行動或生命痕跡？";
      case "oneliner":
        return "💡 寫作啟發：\n1. 如果你的生命是一本書，它的封面應該印上哪一句充滿力量、不留遺憾的宣告？\n2. 試著用一個簡單卻溫馨的比喻，寫下你想對世界或摯愛之人說的生命宣告。";
      default:
        return "💡 寫作啟發：請試著用最真誠、最直接的話，寫下你此時此刻的真實心聲。";
    }
  };

  const handleGetAIInspiration = async (fieldType: string, currentValue: string) => {
    setLoadingInspire(prev => ({ ...prev, [fieldType]: true }));
    try {
      const res = await fetch('/api/ai/inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldType, currentValue })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "API_KEY_MISSING") {
          const localInsp = simulateLocalInspiration(fieldType);
          setAiInspirations(prev => ({ ...prev, [fieldType]: localInsp }));
        } else {
          throw new Error(data.message || "取得啟發失敗");
        }
      } else {
        setAiInspirations(prev => ({ ...prev, [fieldType]: data.text }));
      }
    } catch (err: any) {
      console.error("Fetch AI inspire failed:", err);
      const localInsp = simulateLocalInspiration(fieldType);
      setAiInspirations(prev => ({ ...prev, [fieldType]: localInsp }));
    } finally {
      setLoadingInspire(prev => ({ ...prev, [fieldType]: false }));
    }
  };

  const simulateLocalGrading = () => {
    const student = selectedSubmission.studentName;
    const isWoop = activeSheet === 'woop';
    let localComments = "";
    let score = 95;
    let badges: string[] = [];

    if (isWoop) {
      localComments = `嗨 ${student}！林老師看完你的 WOOP 目標與計畫深表肯定。你在「W 願望」中寫道想要更勇敢地面對不懂的公式，這是很有膽識的自我期許！針對「滑手機滑到心煩」的障礙，你設定的「如果...就...」因應策略非常務實且切中痛點。老師相信只要有恆心，你一定可以築夢踏實，為你的心靈防護甲按個讚！`;
      score = 95;
      badges = ["思考小高手", "韌性練習中"];
    } else {
      localComments = `嗨 ${student}！林老師參觀完你的「生前特展」深受感動。你的生命宣言「${selectedSubmission.exhibition.oneLiner || '生活熱氣騰騰'}」充分展現了你對生命的核心嚮往。時間軸上的各個轉折里程碑（包括流浪貓的照顧、失敗的體悟、對流浪動物的愛）都凝聚成了此時此刻最真實、善良的你。非常棒的策展成果！`;
      score = 96;
      badges = ["未來的自己", "勇敢追夢中"];
    }

    setTeacherComments(localComments);
    setTeacherScore(score);
    setTeacherSelectedBadges(badges);
  };

  const handleAiGrading = async () => {
    setIsAiGrading(true);
    try {
      const studentAnswers = activeSheet === 'woop' 
        ? {
            wish: selectedSubmission.woop.wish,
            outcome: selectedSubmission.woop.outcome,
            obstacle: selectedSubmission.woop.obstacle,
            plan: selectedSubmission.woop.plan
          }
        : {
            rememberMe: selectedSubmission.exhibition.rememberMe,
            keywords: selectedSubmission.exhibition.keywords,
            oneLiner: selectedSubmission.exhibition.oneLiner,
            timeline: selectedSubmission.exhibition.timeline
          };

      const res = await fetch('/api/ai/grade-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedSubmission.studentName,
          activeSheet,
          answers: studentAnswers
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "API_KEY_MISSING") {
          alert("💡 AI 協同批改提示：\n\n系統目前尚未偵測到您的 GEMINI_API_KEY，已自動為您切換至「本機精緻模擬批改」！\n您可以點選右上角的 ⚙️ Settings > Secrets 輸入您的金鑰，即可享受真正的 Gemini AI 即時生成評語與智慧勳章！");
          simulateLocalGrading();
        } else {
          throw new Error(data.message || "批改失敗");
        }
      } else {
        setTeacherComments(data.comments);
        setTeacherScore(data.score || 90);
        setTeacherSelectedBadges(data.badges || []);
      }
    } catch (err: any) {
      console.error(err);
      alert("⚠️ 讀取 AI 評語時發生錯誤，改為您啟用本機模擬！");
      simulateLocalGrading();
    } finally {
      setIsAiGrading(false);
    }
  };

  // Projection Discussion modal
  const [projectedItem, setProjectedItem] = useState<{
    studentName: string;
    oneLiner: string;
    keywords: string[];
    rememberMe: string;
    timeline: TimelineEvent[];
  } | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Sync state if student changes
  React.useEffect(() => {
    if (role === 'student') {
      setWoopStep(currentSubmission.woop.currentStep);
      setWoopWish(currentSubmission.woop.wish);
      setWoopOutcome(currentSubmission.woop.outcome);
      setWoopObstacle(currentSubmission.woop.obstacle);
      setWoopPlan(currentSubmission.woop.plan);

      setExRemember(currentSubmission.exhibition.rememberMe);
      setExKeywords(currentSubmission.exhibition.keywords);
      setExOneLiner(currentSubmission.exhibition.oneLiner);
      setExTimeline(currentSubmission.exhibition.timeline);
    }
  }, [activeStudentId, currentSubmission, role]);

  // Sync active sheet when role switches
  React.useEffect(() => {
    setActiveSheet(role === 'teacher' ? 'stats' : 'woop');
  }, [role]);

  // Audio speech trigger simulator
  const playSpeech = (id: string) => {
    setPlayingSpeech(id);
    setTimeout(() => {
      setPlayingSpeech(null);
    }, 3000);
  };

  // Student save WOOP draft helper
  const handleSaveWoop = (isSubmit: boolean = false) => {
    const updated = submissions.map(s => {
      if (s.studentId === activeStudentId) {
        return {
          ...s,
          woop: {
            ...s.woop,
            wish: woopWish,
            outcome: woopOutcome,
            obstacle: woopObstacle,
            plan: woopPlan,
            currentStep: woopStep,
            submitted: isSubmit,
            submittedAt: isSubmit ? new Date().toISOString().replace('T', ' ').substring(0, 16) : s.woop.submittedAt
          }
        };
      }
      return s;
    });
    onChangeSubmissions(updated);
    alert(isSubmit ? "🎉 已成功提交給老師批改！" : "💾 進度已暫存成功！");
  };

  // Student save Exhibition draft helper
  const handleSaveExhibition = (isSubmit: boolean = false) => {
    const updated = submissions.map(s => {
      if (s.studentId === activeStudentId) {
        return {
          ...s,
          exhibition: {
            ...s.exhibition,
            rememberMe: exRemember,
            keywords: exKeywords,
            oneLiner: exOneLiner,
            timeline: exTimeline,
            submitted: isSubmit,
            submittedAt: isSubmit ? new Date().toISOString().replace('T', ' ').substring(0, 16) : s.exhibition.submittedAt
          }
        };
      }
      return s;
    });
    onChangeSubmissions(updated);
    alert(isSubmit ? "🎉 恭喜！你的生前特展已成功提交！可以在右側預覽成果。" : "💾 展覽草稿已成功儲存！");
  };

  // Keywords tag handlers
  const handleToggleKeyword = (kw: string) => {
    if (exKeywords.includes(kw)) {
      setExKeywords(exKeywords.filter(k => k !== kw));
    } else {
      if (exKeywords.length >= 5) {
        alert("最多只能選擇 5 個生命關鍵字喔！");
        return;
      }
      setExKeywords([...exKeywords, kw]);
    }
  };

  const handleAddCustomKeyword = () => {
    if (!newKeywordInput.trim()) return;
    if (exKeywords.includes(newKeywordInput)) return;
    if (exKeywords.length >= 5) {
      alert("最多只能選擇 5 個生命關鍵字喔！");
      return;
    }
    setExKeywords([...exKeywords, newKeywordInput.trim()]);
    setNewKeywordInput('');
  };

  // Timeline events helpers
  const handleAddTimelineEvent = () => {
    if (!newTimelineText.trim()) return;
    const newEv: TimelineEvent = {
      id: Math.random().toString(),
      year: newTimelineYear.trim() || undefined,
      text: newTimelineText.trim()
    };
    setExTimeline([...exTimeline, newEv]);
    setNewTimelineText('');
    setNewTimelineYear('');
  };

  const handleRemoveTimelineEvent = (id: string) => {
    setExTimeline(exTimeline.filter(e => e.id !== id));
  };

  // Custom encouragements
  const handleAddEncouragement = () => {
    if (!newEncouragementText.trim()) return;
    const newEnc: Encouragement = {
      id: Math.random().toString(),
      senderName: '可華同學',
      avatarRole: '同學',
      avatarEmoji: '🎒',
      text: newEncouragementText.trim(),
      likes: 1
    };
    setEncouragements([...encouragements, newEnc]);
    setNewEncouragementText('');
    setShowEncouragementInput(false);
  };

  // Teacher submits grading
  const handleTeacherSubmitFeedback = (targetSheet: 'woop' | 'exhibition') => {
    if (!teacherComments.trim()) {
      alert("請填寫批改評語與反饋！");
      return;
    }
    const feedbackObj: Feedback = {
      comments: teacherComments,
      gradedBy: '林老師',
      gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badges: teacherSelectedBadges,
      score: teacherScore
    };

    const updated = submissions.map(s => {
      if (s.studentId === selectedStudentId) {
        return {
          ...s,
          [targetSheet]: {
            ...s[targetSheet],
            feedback: feedbackObj
          }
        };
      }
      return s;
    });

    onChangeSubmissions(updated);
    setTeacherComments('');
    setTeacherSelectedBadges([]);
    alert(`🎉 已成功將批改與反饋送出給 ${selectedSubmission.studentName}！`);
  };

  // STATISTICS CALCULATIONS FOR TEACHER
  const totalStudents = submissions.length;
  const woopSubmissionsCount = submissions.filter(s => s.woop.submitted).length;
  const exhibitionSubmissionsCount = submissions.filter(s => s.exhibition.submitted).length;

  // Keyword word frequency distribution
  const keywordStats: { [key: string]: number } = {};
  submissions.forEach(s => {
    if (s.exhibition.submitted) {
      s.exhibition.keywords.forEach(kw => {
        keywordStats[kw] = (keywordStats[kw] || 0) + 1;
      });
    }
  });

  const sortedKeywordStats = Object.entries(keywordStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8); // Top 8 keywords in class

  return (
    <div className="space-y-6">
      
      {/* Top Selector Ribbon */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-3xl p-4 border border-blue-100 shadow-2xs gap-4">
        
        {/* Navigation Tabs for sheets */}
        <div className="flex bg-gray-100 p-0.5 rounded-2xl w-full md:w-auto">
          {role === 'student' ? (
            <>
              <button 
                onClick={() => setActiveSheet('woop')}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeSheet === 'woop' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Shield className="w-4 h-4 text-blue-500" />
                WOOP 心理韌性防護甲
              </button>
              <button 
                onClick={() => setActiveSheet('exhibition')}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeSheet === 'exhibition' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-500" />
                棺材中的凝視：我的生前特展
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveSheet('stats')}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeSheet === 'stats' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-500" />
                課堂數據與統計
              </button>
              <button 
                onClick={() => setActiveSheet('woop')}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeSheet === 'woop' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-500" />
                批改學生 WOOP 表單
              </button>
              <button 
                onClick={() => setActiveSheet('exhibition')}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeSheet === 'exhibition' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-500" />
                批改「生前特展」
              </button>
            </>
          )}
        </div>

        {/* Info panel */}
        <div className="text-xs font-medium text-gray-500 flex items-center gap-2 self-end">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100" />
          {role === 'student' 
            ? `目前登入：${currentSubmission.studentName} (學生)`
            : '林老師 (教師身份 · 即時批改模式)'
          }
        </div>
      </div>

      {/* ======================================= */}
      {/* 1. STUDENT VIEW - WOOP FORM             */}
      {/* ======================================= */}
      {activeSheet === 'woop' && role === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Encouragements Panel (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider">給你的鼓勵</h3>
                <span className="text-[10px] text-gray-400">親友支持專區</span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {encouragements.map((enc) => {
                  const isSpeaking = playingSpeech === enc.id;
                  return (
                    <div key={enc.id} className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100 relative group">
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl shrink-0">{enc.avatarEmoji}</span>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-700">{enc.senderName}</span>
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded-full font-bold">
                              {enc.avatarRole}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                            {enc.text}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => playSpeech(enc.id)}
                        className={`absolute bottom-2 right-2 p-1 rounded-full transition-all ${
                          isSpeaking 
                            ? 'bg-blue-500 text-white animate-pulse' 
                            : 'bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Encouragement */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {!showEncouragementInput ? (
                  <button 
                    onClick={() => setShowEncouragementInput(true)}
                    className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-all"
                  >
                    + 給自己/同學一句鼓勵
                  </button>
                ) : (
                  <div className="space-y-2">
                    <textarea 
                      placeholder="輸入溫暖的留言..."
                      rows={2}
                      value={newEncouragementText}
                      onChange={(e) => setNewEncouragementText(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowEncouragementInput(false)}
                        className="flex-1 py-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleAddEncouragement}
                        className="flex-1 py-1 text-xs bg-blue-600 text-white rounded-lg font-bold"
                      >
                        新增
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant helper robot box */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 flex items-start gap-3 relative overflow-hidden">
              <span className="text-3xl shrink-0">🤖</span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-900">小提醒</h4>
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  誠實面對自己，你的想法很重要！我會一直陪著你，陪你打敗內心的逃避怪獸！
                </p>
              </div>
            </div>

            {/* Achievement Badges Area */}
            <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <h3 className="text-xs font-black text-blue-900 flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>我的學習勳章</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  {ACHIEVEMENTS.filter(a => a.checkUnlock(currentSubmission)).length} / {ACHIEVEMENTS.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ACHIEVEMENTS.map(ach => {
                  const isUnlocked = ach.checkUnlock(currentSubmission);
                  return (
                    <div 
                      key={ach.id} 
                      className={`relative aspect-square rounded-xl flex items-center justify-center text-xl transition-all border ${
                        isUnlocked 
                          ? `${ach.bg} ${ach.border} cursor-pointer hover:scale-105 hover:shadow-2xs` 
                          : 'bg-slate-50 border-slate-100 grayscale opacity-40'
                      }`}
                      title={`${ach.name}: ${ach.description} (${isUnlocked ? '已解鎖' : '未解鎖'})`}
                    >
                      <span>{ach.emoji}</span>
                      {isUnlocked && (
                        <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center: WOOP Step Wizard (6 columns) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* WOOP Title Card */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h2 className="text-lg font-extrabold text-blue-900">WOOP 心理韌性防護甲</h2>
                  <p className="text-xs text-gray-400">打造你的心理韌性計畫，勇敢面對挑戰，實現更棒的自己！</p>
                </div>
              </div>

              {/* 填寫指引與玩法 */}
              <div className="mt-3 p-3.5 bg-blue-50/30 border border-blue-100 rounded-2xl text-[11px] leading-relaxed text-blue-900">
                <div className="font-extrabold text-blue-950 mb-1 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>🛡️ WOOP 防護甲・填寫指引與操作方法：</span>
                </div>
                <p className="text-gray-500 mb-2">這是一個引導你將「夢想」轉化為「行動」的心理防護甲科學工具。請依循以下步驟進行：</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-blue-800">
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>1. Wish (願望)</strong>：設定一個有挑戰性但能在近期實現的具體目標。
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>2. Outcome (結果)</strong>：盡情描繪與感受目標實現後最美好的心靈體驗。
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>3. Obstacle (障礙)</strong>：直面阻礙你的那個內在怪獸、情緒或慣性衝動。
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>4. Plan (計畫)</strong>：用「如果（遇到障礙）就（執行行動）」寫下防衛行動。
                  </div>
                </div>
              </div>

              {/* Step indicator sequence (1 to 4) */}
              <div className="flex justify-between items-center mt-6 mb-6 px-4 relative">
                {/* Connecting lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
                <div className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0" style={{ width: `${((woopStep - 1) / 3) * 100}%` }} />
                
                {[
                  { num: 1, label: 'Wish 願望' },
                  { num: 2, label: 'Outcome 結果' },
                  { num: 3, label: 'Obstacle 障礙' },
                  { num: 4, label: 'Plan 計畫' }
                ].map((step) => {
                  const isActive = woopStep === step.num;
                  const isCompleted = woopStep > step.num;
                  return (
                    <button 
                      key={step.num}
                      onClick={() => setWoopStep(step.num)}
                      className="relative z-10 flex flex-col items-center space-y-1 group"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                        isActive 
                          ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/15' 
                          : isCompleted 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300'
                      }`}>
                        {step.num}
                      </div>
                      <span className={`text-[10px] font-extrabold ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Step form blocks */}
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 min-h-[180px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-blue-600">第 {woopStep} 步</span>
                    <span className="text-[10px] text-gray-400">
                      {woopStep === 1 && "誠實找出內心真正渴望達成的學習或成長願望"}
                      {woopStep === 2 && "想像一下，達成這個願望後最棒、最踏實的感受"}
                      {woopStep === 3 && "坦誠找出阻礙你前進的那個內心障礙是什麼"}
                      {woopStep === 4 && "制定一個當「如果...就...」發生的應對計畫"}
                    </span>
                  </div>

                  {woopStep === 1 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1">
                          🪄 WISH 願望
                        </h3>
                        <button 
                          onClick={() => handleGetAIInspiration('wish', woopWish)}
                          disabled={loadingInspire['wish']}
                          className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer border border-purple-200 transition-all shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                          {loadingInspire['wish'] ? '引導生成中...' : 'AI 啟發'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">我真心想要什麼？寫下你的願望，讓夢想更清晰！</p>
                      <textarea 
                        rows={3}
                        value={woopWish}
                        onChange={(e) => setWoopWish(e.target.value)}
                        placeholder="例如：我希望在學期末數學成績進步到 90 分以上，並且能更勇敢地面對不懂的公式。"
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 outline-none leading-relaxed font-medium"
                      />
                      {aiInspirations['wish'] && (
                        <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 font-medium whitespace-pre-wrap leading-relaxed relative animate-fadeIn">
                          <button 
                            onClick={() => setAiInspirations(prev => ({ ...prev, wish: '' }))}
                            className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-purple-400 hover:text-purple-600 font-bold font-sans cursor-pointer text-xs"
                          >
                            ×
                          </button>
                          {aiInspirations['wish']}
                        </div>
                      )}
                    </div>
                  )}

                  {woopStep === 2 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1">
                          🌟 OUTCOME 結果
                        </h3>
                        <button 
                          onClick={() => handleGetAIInspiration('outcome', woopOutcome)}
                          disabled={loadingInspire['outcome']}
                          className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer border border-purple-200 transition-all shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                          {loadingInspire['outcome'] ? '引導生成中...' : 'AI 啟發'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">如果成功達成了，對你的生活會帶來什麼正向感悟或收穫？</p>
                      <textarea 
                        rows={3}
                        value={woopOutcome}
                        onChange={(e) => setWoopOutcome(e.target.value)}
                        placeholder="例如：如果順利達成，我會感到非常踏實與驕傲！我也更有自信地挑戰更難的學業章節。"
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 outline-none leading-relaxed font-medium"
                      />
                      {aiInspirations['outcome'] && (
                        <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 font-medium whitespace-pre-wrap leading-relaxed relative animate-fadeIn">
                          <button 
                            onClick={() => setAiInspirations(prev => ({ ...prev, outcome: '' }))}
                            className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-purple-400 hover:text-purple-600 font-bold font-sans cursor-pointer text-xs"
                          >
                            ×
                          </button>
                          {aiInspirations['outcome']}
                        </div>
                      )}
                    </div>
                  )}

                  {woopStep === 3 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1">
                          🔒 OBSTACLE 障礙
                        </h3>
                        <button 
                          onClick={() => handleGetAIInspiration('obstacle', woopObstacle)}
                          disabled={loadingInspire['obstacle']}
                          className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer border border-purple-200 transition-all shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                          {loadingInspire['obstacle'] ? '引導生成中...' : 'AI 啟發'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">有什麼內在障礙（惰性、焦慮、分心等）可能會阻礙你？</p>
                      <textarea 
                        rows={3}
                        value={woopObstacle}
                        onChange={(e) => setWoopObstacle(e.target.value)}
                        placeholder="例如：我的最大障礙是每次寫題目卡關時，我就會心煩意亂，然後不自覺拿起手機開始滑，逃避思考。"
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 outline-none leading-relaxed font-medium"
                      />
                      {aiInspirations['obstacle'] && (
                        <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 font-medium whitespace-pre-wrap leading-relaxed relative animate-fadeIn">
                          <button 
                            onClick={() => setAiInspirations(prev => ({ ...prev, obstacle: '' }))}
                            className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-purple-400 hover:text-purple-600 font-bold font-sans cursor-pointer text-xs"
                          >
                            ×
                          </button>
                          {aiInspirations['obstacle']}
                        </div>
                      )}
                    </div>
                  )}

                  {woopStep === 4 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1">
                          📝 PLAN 計畫
                        </h3>
                        <button 
                          onClick={() => handleGetAIInspiration('plan', woopPlan)}
                          disabled={loadingInspire['plan']}
                          className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer border border-purple-200 transition-all shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                          {loadingInspire['plan'] ? '引導生成中...' : 'AI 啟發'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">當「障礙」出現時，你要如何行動？用【當....我就會....】來設定！</p>
                      <textarea 
                        rows={3}
                        value={woopPlan}
                        onChange={(e) => setWoopPlan(e.target.value)}
                        placeholder="例如：當我「遇到不會的題目且開始感到心煩」時，我就會「把手機放到客廳，並深呼吸三次，接著翻開錯題筆記本」。"
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 outline-none leading-relaxed font-medium"
                      />
                      {aiInspirations['plan'] && (
                        <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 font-medium whitespace-pre-wrap leading-relaxed relative animate-fadeIn">
                          <button 
                            onClick={() => setAiInspirations(prev => ({ ...prev, plan: '' }))}
                            className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-purple-400 hover:text-purple-600 font-bold font-sans cursor-pointer text-xs"
                          >
                            ×
                          </button>
                          {aiInspirations['plan']}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Companion bubble below the form */}
                <div className="mt-4 p-2.5 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
                  <span className="text-xl">👩🏻‍🏫</span>
                  <p className="text-[10px] text-green-800 font-bold">
                    老師小提示：具體、正向、以「我」為主的願望與計畫，更容易實現喔！
                  </p>
                </div>
              </div>

              {/* Wizard Controls */}
              <div className="flex justify-between items-center mt-5">
                <button 
                  disabled={woopStep === 1}
                  onClick={() => setWoopStep(p => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs rounded-xl border border-gray-100 disabled:opacity-40 transition-all"
                >
                  上一步
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSaveWoop(false)}
                    className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-100 flex items-center gap-1 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    暫存進度
                  </button>

                  {woopStep < 4 ? (
                    <button 
                      onClick={() => setWoopStep(p => Math.min(4, p + 1))}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
                    >
                      下一步
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleSaveWoop(true)}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
                    >
                      提交批改
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Display Teacher's Feedback block if existed */}
            {currentSubmission.woop.feedback && (
              <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-white border border-blue-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-blue-100/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👩🏻‍🏫</span>
                    <div>
                      <h4 className="font-bold text-sm text-blue-950">老師批改反饋</h4>
                      <span className="text-[9px] text-gray-400">評閱時間：{currentSubmission.woop.feedback.gradedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 bg-blue-100/50 px-2.5 py-1 rounded-xl">
                    <span className="text-xs font-bold text-blue-700">評分:</span>
                    <span className="text-sm font-extrabold text-blue-800 font-sans">{currentSubmission.woop.feedback.score || 95}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-blue-50/50">
                  {currentSubmission.woop.feedback.comments}
                </p>

                {/* Display awarded badges */}
                {currentSubmission.woop.feedback.badges && currentSubmission.woop.feedback.badges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      獲得榮譽勳章：
                    </span>
                    {currentSubmission.woop.feedback.badges.map((badge, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                        🏅 {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: WOOP Status Shield (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-xs text-center flex flex-col items-center justify-between min-h-[380px]">
              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase">你的心理韌性防護甲</h3>
                <span className="text-[10px] text-gray-400">完成四個步驟，讓防護甲更加堅固！</span>
              </div>

              {/* Decorative Shield Emblem Graphic */}
              <div className="relative w-44 h-48 flex flex-col items-center justify-center p-4 bg-blue-50/30 rounded-2xl border border-blue-50/50 my-4">
                
                {/* Visual shield outline */}
                <div className="absolute inset-x-6 inset-y-4 border-2 border-blue-500/30 rounded-[30%_30%_50%_50%] flex flex-col justify-around p-3 bg-gradient-to-b from-blue-500/10 to-transparent">
                  
                  {/* Step list badges Inside the shield */}
                  {[
                    { step: 1, label: 'WISH 願望', filled: !!woopWish },
                    { step: 2, label: 'OUTCOME 結果', filled: !!woopOutcome },
                    { step: 3, label: 'OBSTACLE 障礙', filled: !!woopObstacle },
                    { step: 4, label: 'PLAN 計畫', filled: !!woopPlan }
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-2 justify-center">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${s.filled ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>
                        {s.filled && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className={`text-[10px] font-bold ${s.filled ? 'text-blue-800' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  ))}

                </div>

                {/* Glowing emblem star in bottom of shield */}
                <span className="absolute bottom-6 text-2xl filter drop-shadow-sm animate-pulse">⭐</span>
              </div>

              <div className="text-[10px] text-gray-400/80 font-bold">
                🔒 完成所有步驟，解鎖專屬你的韌性徽章！
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* 2. STUDENT VIEW - EXHIBITION FORM        */}
      {/* ======================================= */}
      {activeSheet === 'exhibition' && role === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Support Panel & Audio Speech (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Supporter Cards (Grandpa, Dad) */}
            <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider">我生命中的支持者</h3>
                <span className="text-[10px] text-gray-400">傾聽與鼓勵</span>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'sup_grandpa', name: '可華爺爺', role: '祖父', avatar: '👴🏻', text: '孩子，生命的價值不在長短，而在於你如何真誠地活過。' },
                  { id: 'sup_dad', name: '可華爸爸', role: '父親', avatar: '👨🏻', text: '勇敢做自己，並且記得，愛與善良會留下最深的印記。' }
                ].map((sup) => {
                  const isSpeaking = playingSpeech === sup.id;
                  const charId = sup.id === 'sup_grandpa' ? 'char_grandpa' : 'char_dad';
                  const compChar = characters?.find(c => c.id === charId);
                  return (
                    <div key={sup.id} className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100 relative">
                      <div className="flex gap-2.5 items-center">
                        <SafeImageAvatar
                          src={compChar?.avatarUrl}
                          alt={sup.name}
                          fallbackEmoji={sup.avatar}
                          sizeClassName="w-8 h-8"
                          className="border border-gray-100 bg-white"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-gray-800">{sup.name}</h4>
                          <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed pr-6">
                            「{sup.text}」
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => playSpeech(sup.id)}
                        className={`absolute bottom-2 right-2 p-1 rounded-full transition-all ${
                          isSpeaking 
                            ? 'bg-blue-500 text-white animate-pulse' 
                            : 'bg-gray-100 text-gray-400 hover:bg-blue-100'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Privacy Tips card */}
            <div className="bg-blue-50/20 border border-blue-100 rounded-3xl p-5 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1">
                🛡️ 隱私與安心提醒
              </h4>
              <p className="text-[11px] text-blue-800/80 leading-relaxed font-medium">
                你的分享只屬於你自己與老師，你可以選擇在課堂公開或保留，放心寫下最真實的想法。
              </p>
            </div>
          </div>

          {/* Center: Life Exhibition Form (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card Header Title */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🪦</span>
                <div>
                  <h2 className="text-base font-extrabold text-blue-900">棺材中的凝視：我的生前特展</h2>
                  <p className="text-xs text-gray-400">如果生命是一場展覽，你會如何策劃屬於你的「生前特展」？</p>
                </div>
              </div>

              {/* 填寫指引與玩法 */}
              <div className="p-3.5 bg-blue-50/30 border border-blue-100 rounded-2xl text-[11px] leading-relaxed text-blue-900">
                <div className="font-extrabold text-blue-950 mb-1 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>🎨 「生前特展」填寫指引與策展方法：</span>
                </div>
                <p className="text-gray-500 mb-2">這是一個引導你站在生命的終點，回望與重塑自我價值、追求人生無悔的生命教育策展工具：</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-blue-800">
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>1. 留給世界的面貌</strong>：思考在你的告別式上，你希望親友如何描述與懷念你的為人。
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>2. 生命關鍵字</strong>：選擇 3~5 個最契合你靈魂嚮往的特質詞彙，定義你的核心人格特徵。
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>3. 留下的一句話</strong>：如果生命即將謝幕，寫下一句對世界或深愛之人的最真摯宣言。
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-50">
                    <strong>4. 生命時間軸</strong>：在右側設計你的歷史與未來的光榮里程碑，編排專屬的人生海報。
                  </div>
                </div>
              </div>

              {/* Part 1: How do I want to be remembered */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-gray-800 block flex items-center gap-1.5">
                    🧡 1. 我希望別人如何記得我
                  </label>
                  <button 
                    onClick={() => handleGetAIInspiration('remember', exRemember)}
                    disabled={loadingInspire['remember']}
                    className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer border border-purple-200 transition-all shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                    {loadingInspire['remember'] ? '引導生成中...' : 'AI 啟發'}
                  </button>
                </div>
                <textarea 
                  rows={3}
                  value={exRemember}
                  onChange={(e) => setExRemember(e.target.value)}
                  placeholder="我希望別人記得我是..."
                  maxLength={200}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none leading-relaxed font-medium"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-400 block">{exRemember.length}/200 字</span>
                  {aiInspirations['remember'] && (
                    <button 
                      onClick={() => setAiInspirations(prev => ({ ...prev, remember: '' }))}
                      className="text-[9px] text-purple-600 hover:text-purple-800 font-bold"
                    >
                      關閉 AI 建議
                    </button>
                  )}
                </div>
                {aiInspirations['remember'] && (
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 font-medium whitespace-pre-wrap leading-relaxed relative animate-fadeIn mt-1">
                    <button 
                      onClick={() => setAiInspirations(prev => ({ ...prev, remember: '' }))}
                      className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-purple-400 hover:text-purple-600 font-bold font-sans cursor-pointer text-xs"
                    >
                      ×
                    </button>
                    {aiInspirations['remember']}
                  </div>
                )}
              </div>

              {/* Part 2: Life Keywords Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-800 block flex items-center gap-1.5">
                  ⭐ 2. 我的生命關鍵字 <span className="text-[10px] text-gray-400 font-normal">(選擇 3-5 個代表你的詞彙)</span>
                </label>
                
                {/* Active keywords badges */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {exKeywords.map((kw, idx) => (
                    <span 
                      key={idx}
                      onClick={() => handleToggleKeyword(kw)}
                      className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full cursor-pointer shadow-2xs hover:bg-red-500 flex items-center gap-1"
                    >
                      {kw} <span className="text-[9px] opacity-70">×</span>
                    </span>
                  ))}
                  {exKeywords.length === 0 && (
                    <span className="text-[10px] text-gray-400 italic">尚未選擇任何關鍵字</span>
                  )}
                </div>

                {/* Choice selection pool */}
                <div className="flex flex-wrap gap-1 border-t border-gray-50 pt-2">
                  {LIFE_KEYWORDS.map((kw) => {
                    const isSelected = exKeywords.includes(kw);
                    return (
                      <button 
                        key={kw}
                        onClick={() => handleToggleKeyword(kw)}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold' 
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {kw}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom keyword form */}
                <div className="flex gap-2 items-center mt-2">
                  <input 
                    type="text" 
                    placeholder="自訂關鍵字..."
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-gray-200 outline-none flex-1 max-w-[150px]"
                  />
                  <button 
                    onClick={handleAddCustomKeyword}
                    className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold"
                  >
                    + 新增關鍵字
                  </button>
                </div>
              </div>

              {/* Part 3: One-liner wisdom quote */}
              <div className="space-y-2 border-t border-gray-50 pt-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-gray-800 block flex items-center gap-1.5">
                    💬 3. 我想留下的一句話
                  </label>
                  <button 
                    onClick={() => handleGetAIInspiration('oneliner', exOneLiner)}
                    disabled={loadingInspire['oneliner']}
                    className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer border border-purple-200 transition-all shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                    {loadingInspire['oneliner'] ? '引導生成中...' : 'AI 啟發'}
                  </button>
                </div>
                <textarea 
                  rows={2}
                  value={exOneLiner}
                  onChange={(e) => setExOneLiner(e.target.value)}
                  placeholder="如果有一句話能留給世界，我想說..."
                  maxLength={100}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none leading-relaxed font-medium"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-400 block">{exOneLiner.length}/100 字</span>
                  {aiInspirations['oneliner'] && (
                    <button 
                      onClick={() => setAiInspirations(prev => ({ ...prev, oneliner: '' }))}
                      className="text-[9px] text-purple-600 hover:text-purple-800 font-bold"
                    >
                      關閉 AI 建議
                    </button>
                  )}
                </div>
                {aiInspirations['oneliner'] && (
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 font-medium whitespace-pre-wrap leading-relaxed relative animate-fadeIn mt-1">
                    <button 
                      onClick={() => setAiInspirations(prev => ({ ...prev, oneliner: '' }))}
                      className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-purple-400 hover:text-purple-600 font-bold font-sans cursor-pointer text-xs"
                    >
                      ×
                    </button>
                    {aiInspirations['oneliner']}
                  </div>
                )}
              </div>

              {/* Part 4: Interactive Life Timeline Builder */}
              <div className="space-y-3 border-t border-gray-50 pt-3">
                <label className="text-xs font-extrabold text-gray-800 block flex items-center gap-1.5">
                  🕒 4. 我的生命時間軸 <span className="text-[10px] text-gray-400 font-normal">(重要事件或轉折點)</span>
                </label>

                {/* Active timeline list */}
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {exTimeline.map((ev) => (
                    <div key={ev.id} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-xs">
                      <div className="min-w-0 flex-1 leading-normal">
                        {ev.year && <span className="font-extrabold text-blue-600 mr-2 shrink-0">[{ev.year}]</span>}
                        <span className="text-gray-700 font-medium">{ev.text}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveTimelineEvent(ev.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {exTimeline.length === 0 && (
                    <p className="text-[10px] text-gray-400 italic text-center py-2">尚未新增任何時間軸里程碑</p>
                  )}
                </div>

                {/* Form to add custom timeline milestone */}
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <input 
                      type="text" 
                      placeholder="年份/時期 (如: 國中二年級)"
                      value={newTimelineYear}
                      onChange={(e) => setNewTimelineYear(e.target.value)}
                      className="text-xs p-2 rounded-lg bg-white border border-gray-200 w-full outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="事件內容 (如: 第一次看見落葉思考生死意義)"
                      value={newTimelineText}
                      onChange={(e) => setNewTimelineText(e.target.value)}
                      className="text-xs p-2 rounded-lg bg-white border border-gray-200 w-full outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleAddTimelineEvent}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form submit buttons */}
              <div className="flex gap-2.5 border-t border-gray-50 pt-4">
                <button 
                  onClick={() => handleSaveExhibition(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  儲存草稿
                </button>
                <button 
                  onClick={() => handleSaveExhibition(true)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  預覽與提交展覽
                </button>
              </div>

            </div>
          </div>

          {/* Right: GORGEOUS dynamic Exhibition Poster Preview (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Poster Card */}
            <div className="bg-gradient-to-b from-amber-50/80 to-amber-100/40 rounded-3xl border border-amber-200 p-5 shadow-xs flex flex-col justify-between min-h-[520px]">
              <div className="text-center space-y-1 border-b border-amber-200/50 pb-3">
                <span className="text-[10px] text-amber-800 font-extrabold tracking-widest block">🎨 我的生命之展 預覽</span>
                <h2 className="font-serif text-lg font-black text-amber-950 uppercase tracking-widest">
                  棺材中的凝視
                </h2>
                <span className="text-xs font-extrabold text-amber-900 block">— 我的生前特展 —</span>
                <span className="text-[10px] bg-amber-900 text-white px-2.5 py-0.2 rounded-full font-bold mt-1.5 inline-block">
                  策展人：{currentSubmission.studentName}
                </span>
              </div>

              {/* Render dynamic elements inside a vintage style poster frame */}
              <div className="my-4 bg-white/70 rounded-2xl border border-amber-200/70 p-4 space-y-4 min-h-[280px]">
                
                {/* Curator illustration portrait */}
                <div className="flex justify-center mb-2.5">
                  <div 
                    onClick={() => {
                      if (role === 'student') {
                        const charId = activeStudentId.replace('stud_', 'char_');
                        onEditAvatar?.(charId);
                      }
                    }}
                    className={`w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center overflow-hidden shadow-sm ${
                      role === 'student' ? 'cursor-pointer hover:scale-105 transition-transform group relative' : ''
                    }`}
                    title={role === 'student' ? '點擊更換個人大頭照' : undefined}
                  >
                    {(() => {
                      const curChar = characters?.find(c => c.id === activeStudentId.replace('stud_', 'char_'));
                      return (
                        <SafeImageAvatar
                          src={curChar?.avatarUrl}
                          alt={curChar?.name}
                          fallbackEmoji={curChar?.avatarEmoji || '👦🏻'}
                          sizeClassName="w-full h-full"
                          className="border-none bg-transparent"
                        />
                      );
                    })()}
                    {role === 'student' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] text-white font-extrabold leading-none">
                        換照
                      </div>
                    )}
                  </div>
                </div>

                {/* 1. Life statement */}
                {exRemember && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-amber-900/60 font-bold block">關於我：</span>
                    <p className="text-[10px] text-amber-950 font-medium leading-relaxed italic bg-white p-2.5 rounded-lg border border-amber-100">
                      「{exRemember}」
                    </p>
                  </div>
                )}

                {/* 2. Key labels */}
                {exKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center py-1">
                    {exKeywords.map((kw, idx) => (
                      <span key={idx} className="bg-amber-950 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* 3. One-liner calligraphy card */}
                {exOneLiner && (
                  <div className="border-t border-b border-amber-200/50 py-2.5 text-center my-1">
                    <span className="text-[8px] text-amber-900/50 block font-bold mb-1">生命經典宣言</span>
                    <p className="font-serif text-xs font-bold text-amber-900 italic leading-normal">
                      “ {exOneLiner} ”
                    </p>
                  </div>
                )}

                {/* 4. Timeline list preview */}
                {exTimeline.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-amber-900/60 font-bold block">生命里程碑：</span>
                    <div className="space-y-1">
                      {exTimeline.slice(0, 3).map((ev) => (
                        <div key={ev.id} className="text-[10px] text-amber-950 font-semibold flex gap-1 items-start">
                          <span className="text-amber-700 font-bold shrink-0">·</span>
                          <span>
                            {ev.year && <span className="font-extrabold text-amber-800 mr-1">[{ev.year}]</span>}
                            {ev.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Exhibition Metadata Box */}
              <div className="bg-amber-950/5 p-3 rounded-xl border border-amber-200/50 text-[10px] font-bold text-amber-900 space-y-1">
                <div className="flex justify-between">
                  <span>🖼️ 展覽主題：</span>
                  <span className="text-amber-950">棺材中的凝視：我的生前特展</span>
                </div>
                <div className="flex justify-between">
                  <span>📅 展覽期間：</span>
                  <span className="text-amber-950">即刻起開展 (自由入場)</span>
                </div>
                <div className="flex justify-between">
                  <span>📍 展覽地點：</span>
                  <span className="text-amber-950">心靈深處的回憶館</span>
                </div>
                <div className="flex justify-between">
                  <span>👥 參觀對象：</span>
                  <span className="text-amber-950">所有關心我、愛我的人</span>
                </div>
              </div>

              <div className="text-[9px] text-amber-800/60 font-bold text-center mt-3">
                * 此為預覽效果，實際展覽將依你的填寫內容即時更新產生
              </div>
            </div>

            {/* Display Teacher's Feedback block if existed */}
            {currentSubmission.exhibition.feedback && (
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white border border-amber-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-amber-100/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👩🏻‍🏫</span>
                    <div>
                      <h4 className="font-bold text-xs text-amber-950">老師對此特展的評語</h4>
                      <span className="text-[9px] text-gray-400">評閱時間：{currentSubmission.exhibition.feedback.gradedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 bg-amber-100/50 px-2.5 py-1 rounded-xl">
                    <span className="text-xs font-bold text-amber-700">評分:</span>
                    <span className="text-sm font-extrabold text-amber-800 font-sans">{currentSubmission.exhibition.feedback.score || 95}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-amber-50/50">
                  {currentSubmission.exhibition.feedback.comments}
                </p>

                {/* Display awarded badges */}
                {currentSubmission.exhibition.feedback.badges && currentSubmission.exhibition.feedback.badges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      獲得榮譽勳章：
                    </span>
                    {currentSubmission.exhibition.feedback.badges.map((badge, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                        🏅 {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* 3. TEACHER VIEW - DATA & STATISTICS      */}
      {/* ======================================= */}
      {activeSheet === 'stats' && role === 'teacher' && (
        <div className="space-y-6">
          
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Aggregated class progress counts (4 columns) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-blue-100 p-5 shadow-xs space-y-6">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <BarChart3 className="w-4.5 h-4.5 text-blue-500" />
                全班學習進度摘要
              </h3>

              <div className="space-y-4">
                {/* Stats cards progress */}
                <div className="bg-blue-50/30 border border-blue-50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">全班學員數</span>
                    <span className="text-2xl font-extrabold text-blue-700">{totalStudents} 人</span>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>

                <div className="bg-emerald-50/30 border border-emerald-50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">WOOP 提交率</span>
                    <span className="text-2xl font-extrabold text-emerald-700">
                      {Math.round((woopSubmissionsCount / totalStudents) * 100)}%
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1">已提交 {woopSubmissionsCount} / {totalStudents}</span>
                  </div>
                  <span className="text-3xl">🛡️</span>
                </div>

                <div className="bg-amber-50/30 border border-amber-50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">生前特展 提交率</span>
                    <span className="text-2xl font-extrabold text-amber-700">
                      {Math.round((exhibitionSubmissionsCount / totalStudents) * 100)}%
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1">已提交 {exhibitionSubmissionsCount} / {totalStudents}</span>
                  </div>
                  <span className="text-3xl">🎨</span>
                </div>
              </div>

              {/* Discussion instructions block */}
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-indigo-800 leading-relaxed font-medium">
                💡 **課堂教學提示**：
                利用右側的「生命關鍵字」與「課堂投影討論牆」，您可以在大螢幕上放映學生所寫的生命金句，引導全班進行思辨討論，達到生命教育的深度互動！
              </div>
            </div>

            {/* Right Column: Class Keywords Cloud / Frequency bar chart (8 columns) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-blue-100 p-5 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-100 animate-bounce" />
                  💡 班級生命關鍵字牆 (互動探索雲)
                </h3>
                {selectedKeywordFilter && (
                  <button 
                    onClick={() => setSelectedKeywordFilter(null)}
                    className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg font-bold border border-red-200 transition-colors"
                  >
                    清除關鍵字篩選 ×
                  </button>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50/20 to-indigo-50/20 p-4 rounded-2xl border border-blue-50/50 space-y-3">
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  <strong>💡 師生互動指引與玩法：</strong>下方為全班同學在「生前特展」中選擇的生命核心特質關鍵字。
                  <strong>點選任一關鍵字字卡</strong>，即可在下方的「課堂投影討論牆」中即時篩選出填寫該特質的學生，非常適合老師投影在大螢幕上引導深度思辨討論！
                </p>

                {/* Floating tags list cloud */}
                <div className="flex flex-wrap gap-2.5 justify-center py-4">
                  {sortedKeywordStats.length > 0 ? (
                    sortedKeywordStats.map(([kw, count]) => {
                      const isSelected = selectedKeywordFilter === kw;
                      const sizeClass = count > 3 ? 'text-sm px-4 py-2 font-black' : count > 1 ? 'text-xs px-3.5 py-1.5 font-bold' : 'text-[11px] px-2.5 py-1 font-semibold';
                      const bgClass = isSelected 
                        ? 'bg-blue-600 text-white shadow-md scale-105 border-blue-600' 
                        : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300';

                      return (
                        <button
                          key={kw}
                          onClick={() => setSelectedKeywordFilter(isSelected ? null : kw)}
                          className={`rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${sizeClass} ${bgClass}`}
                        >
                          <span>✨ {kw}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans ${isSelected ? 'bg-blue-800 text-white' : 'bg-blue-50 text-blue-500'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic py-6">尚未有學生提交「生前特展」學習單，暫無統計數據。</p>
                  )}
                </div>
              </div>

              {/* CSS Horizontal Bar Chart representing word count frequency */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">詞頻統計長條圖</h4>
                {sortedKeywordStats.length > 0 ? (
                  sortedKeywordStats.map(([kw, count]) => {
                    const percentage = (count / exhibitionSubmissionsCount) * 100;
                    const isSelected = selectedKeywordFilter === kw;
                    return (
                      <div 
                        key={kw} 
                        onClick={() => setSelectedKeywordFilter(isSelected ? null : kw)}
                        className={`space-y-1 p-2 rounded-xl transition-all cursor-pointer ${isSelected ? 'bg-blue-50 border border-blue-100 shadow-2xs' : 'hover:bg-gray-50/70 border border-transparent'}`}
                      >
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-blue-600 scale-125' : 'bg-blue-400'}`} />
                            {kw}
                            {isSelected && <span className="text-[9px] text-blue-700 font-extrabold bg-blue-50 px-1.5 py-0.2 rounded-md border border-blue-100 ml-1">篩選中</span>}
                          </span>
                          <span className="text-gray-500">{count} 票 ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-4">暫無數據</p>
                )}
              </div>
            </div>

          </div>

          {/* Classroom Projection Discussion wall */}
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                  <Tv className="w-5.5 h-5.5 text-indigo-500 animate-pulse" />
                  課堂投影討論牆 (Classroom Discussion Board)
                  {selectedKeywordFilter && (
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                      關鍵字篩選中：{selectedKeywordFilter}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">投影到黑板或大螢幕上，與同學們探討彼此對生命與價值觀的體悟！</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isAnonymous 
                      ? 'bg-amber-500 border-amber-500 text-white' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {isAnonymous ? "🔒 已開啟匿名展示" : "👥 顯示學生姓名"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {submissions
                .filter(sub => {
                  if (!selectedKeywordFilter) return true;
                  return sub.exhibition.submitted && sub.exhibition.keywords.includes(selectedKeywordFilter);
                })
                .map((sub) => {
                  const hasEx = sub.exhibition.submitted;
                  return (
                    <div 
                      key={sub.studentId}
                      className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between h-48 transition-all hover:shadow-xs relative group ${
                        !hasEx ? 'opacity-50' : 'hover:border-indigo-300 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-gray-400">
                            {isAnonymous ? "匿名學員" : sub.studentName}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md ${hasEx ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-200 text-gray-400'}`}>
                            {hasEx ? "已完成生前特展" : "草稿中"}
                          </span>
                        </div>

                        {hasEx ? (
                          <>
                            <p className="text-xs font-bold text-gray-800 line-clamp-3 italic">
                              “ {sub.exhibition.oneLiner || "未填寫生命宣言"} ”
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {sub.exhibition.keywords.slice(0, 3).map((kw, idx) => {
                                const isHighlighted = selectedKeywordFilter === kw;
                                return (
                                  <span 
                                    key={idx} 
                                    className={`font-bold text-[9px] px-1.5 py-0.2 rounded-md border transition-colors ${
                                      isHighlighted 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xs' 
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                    }`}
                                  >
                                    {kw}
                                  </span>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-gray-400 italic">學生尚未完成填寫</p>
                        )}
                      </div>

                      {hasEx && (
                        <button 
                          onClick={() => setProjectedItem({
                            studentName: isAnonymous ? "匿名同學" : sub.studentName,
                            oneLiner: sub.exhibition.oneLiner,
                            keywords: sub.exhibition.keywords,
                            rememberMe: sub.exhibition.rememberMe,
                            timeline: sub.exhibition.timeline
                          })}
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          放映到大螢幕討論
                        </button>
                      )}
                    </div>
                  );
                })}
              
              {submissions.filter(sub => {
                if (!selectedKeywordFilter) return true;
                return sub.exhibition.submitted && sub.exhibition.keywords.includes(selectedKeywordFilter);
              }).length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-gray-400 italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  沒有學生符合此關鍵字篩選條件。
                </div>
              )}
            </div>
          </div>

          {/* Spotlight Projected Poster Modal Overlay */}
          <AnimatePresence>
            {projectedItem && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-amber-50 border-4 border-amber-300 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative space-y-6 overflow-y-auto max-h-[90vh]"
                >
                  <button 
                    onClick={() => setProjectedItem(null)}
                    className="absolute top-4 right-4 text-amber-900 hover:text-black font-extrabold text-xl p-1.5 rounded-full hover:bg-amber-100/50"
                  >
                    ✕
                  </button>

                  <div className="text-center space-y-1.5 border-b border-amber-300 pb-4">
                    <span className="text-[11px] bg-amber-900 text-white px-3 py-0.5 rounded-full font-bold">
                      課堂投影討論：生命經典對話
                    </span>
                    <h2 className="text-2xl font-serif font-black text-amber-950 tracking-widest mt-2">
                      棺材中的凝視：我的生前特展
                    </h2>
                    <span className="text-sm font-extrabold text-amber-800">
                      策展人：{projectedItem.studentName}
                    </span>
                  </div>

                  {/* Big Spotlight gold card text */}
                  <div className="bg-white rounded-2xl border border-amber-200 p-6 space-y-5 text-center shadow-inner">
                    <span className="text-4xl">💭</span>
                    <h3 className="font-serif text-lg font-black text-amber-900 italic leading-relaxed">
                      “ {projectedItem.oneLiner} ”
                    </h3>
                    
                    {/* Keywords badges */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {projectedItem.keywords.map((kw, idx) => (
                        <span key={idx} className="bg-amber-950 text-white font-extrabold text-xs px-3 py-1 rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Detailed descriptions */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-900">我希望別人如何記得我：</span>
                    <p className="text-xs text-amber-950 bg-white/50 p-4 rounded-xl border border-amber-200 font-medium leading-relaxed">
                      {projectedItem.rememberMe}
                    </p>
                  </div>

                  {/* Timeline milestone spotlight */}
                  {projectedItem.timeline.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-amber-900">生命印記與轉折里程碑：</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {projectedItem.timeline.map((ev) => (
                          <div key={ev.id} className="p-3 bg-white/40 border border-amber-200 rounded-xl text-xs">
                            {ev.year && <span className="font-extrabold text-amber-800 block mb-1">[{ev.year}]</span>}
                            <p className="text-amber-950 font-semibold">{ev.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-2 text-xs text-amber-900/60 font-bold">
                    【引導提問】林老師：大家對於這位策展人的生命觀宣言有什麼深刻的啟發嗎？歡迎舉手發言討論！
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* ======================================= */}
      {/* 4. TEACHER VIEW - GRADING PORTAL         */}
      {/* ======================================= */}
      {((activeSheet === 'woop' || activeSheet === 'exhibition') && role === 'teacher') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Student Selector list (3 columns) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-blue-100 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">待批改學生名冊</h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {submissions.map((sub) => {
                const sheetSubmitted = activeSheet === 'woop' ? sub.woop.submitted : sub.exhibition.submitted;
                const hasFeedback = activeSheet === 'woop' ? !!sub.woop.feedback : !!sub.exhibition.feedback;
                const isSelected = selectedStudentId === sub.studentId;

                return (
                  <div 
                    key={sub.studentId}
                    onClick={() => setSelectedStudentId(sub.studentId)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-blue-400 bg-blue-50/20 shadow-xs' 
                        : 'border-gray-50 bg-gray-50/50 hover:border-blue-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">👦🏻</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-800">{sub.studentName}</h4>
                        <span className="text-[9px] text-gray-400">學員編號: {sub.studentId}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        sheetSubmitted 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {sheetSubmitted ? "已提交" : "未提交"}
                      </span>
                      {hasFeedback && (
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded-md">
                          ✓ 已批改
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle: Student entries detail reviewer (6 columns) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Student Answers review container */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-5">
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎒</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-800">
                      查看 {selectedSubmission.studentName} 的學習單
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      類型：{activeSheet === 'woop' ? 'WOOP 心理韌性防護甲' : '生前特展'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400">
                  提交日期：{activeSheet === 'woop' 
                    ? (selectedSubmission.woop.submittedAt || "未提交") 
                    : (selectedSubmission.exhibition.submittedAt || "未提交")}
                </span>
              </div>

              {/* WOOP detail review mode */}
              {activeSheet === 'woop' ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/20 border border-blue-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-blue-800 block">🪄 WISH 願望：</span>
                    <p className="text-gray-700 font-medium">{selectedSubmission.woop.wish || "學生尚未填寫"}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-emerald-800 block">🌟 OUTCOME 結果：</span>
                    <p className="text-gray-700 font-medium">{selectedSubmission.woop.outcome || "學生尚未填寫"}</p>
                  </div>

                  <div className="p-3 bg-red-50/20 border border-red-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-red-800 block">🔒 OBSTACLE 障礙：</span>
                    <p className="text-gray-700 font-medium">{selectedSubmission.woop.obstacle || "學生尚未填寫"}</p>
                  </div>

                  <div className="p-3 bg-purple-50/20 border border-purple-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-purple-800 block">📝 PLAN 計畫：</span>
                    <p className="text-gray-700 font-medium">{selectedSubmission.woop.plan || "學生尚未填寫"}</p>
                  </div>
                </div>
              ) : (
                /* Exhibition detail review mode */
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-amber-950 block">🧡 1. 我希望別人如何記得我：</span>
                    <p className="text-gray-700 font-medium">{selectedSubmission.exhibition.rememberMe || "學生尚未填寫"}</p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-amber-950 block mb-1">⭐ 2. 我的生命關鍵字：</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSubmission.exhibition.keywords.map((kw, idx) => (
                        <span key={idx} className="bg-amber-950 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                          {kw}
                        </span>
                      ))}
                      {selectedSubmission.exhibition.keywords.length === 0 && <span className="text-gray-400">尚未填寫</span>}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-amber-950 block">💬 3. 我想留下的一句話：</span>
                    <p className="text-gray-700 font-medium italic font-serif font-semibold">
                      “ {selectedSubmission.exhibition.oneLiner || "學生尚未填寫"} ”
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-amber-950 block mb-1.5">🕒 4. 我的生命時間軸里程碑：</span>
                    <div className="space-y-1">
                      {selectedSubmission.exhibition.timeline.map((ev) => (
                        <div key={ev.id} className="text-xs text-gray-700">
                          {ev.year && <span className="font-extrabold text-blue-600 mr-1">[{ev.year}]</span>}
                          <span>{ev.text}</span>
                        </div>
                      ))}
                      {selectedSubmission.exhibition.timeline.length === 0 && <span className="text-gray-400">尚未填寫</span>}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Existing Feedback view for active student */}
            {((activeSheet === 'woop' && selectedSubmission.woop.feedback) || (activeSheet === 'exhibition' && selectedSubmission.exhibition.feedback)) && (
              <div className="bg-blue-50/30 border border-blue-100 rounded-3xl p-5 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-blue-900">✏️ 已送出的歷史批改意見：</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  評語：{activeSheet === 'woop' 
                    ? selectedSubmission.woop.feedback?.comments 
                    : selectedSubmission.exhibition.feedback?.comments}
                </p>
                <div className="text-[10px] text-gray-400 font-bold">
                  打分數：{activeSheet === 'woop' 
                    ? selectedSubmission.woop.feedback?.score 
                    : selectedSubmission.exhibition.feedback?.score} 分 | 
                  批改人：林老師
                </div>
              </div>
            )}
          </div>

          {/* Right: Teacher feedback writer form (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Feedback Editor panel */}
            <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-3xl border border-blue-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-blue-100 pb-2">
                <h3 className="text-sm font-bold text-blue-950 flex items-center gap-1">
                  <UserCheck className="w-4.5 h-4.5 text-blue-600" />
                  批改與反饋編輯器
                </h3>
                <span className="text-[10px] text-gray-400 block">給予即時、正向的生命回饋！</span>
              </div>

              {/* Comments textarea */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 block">即時批改評語與反饋：</label>
                <textarea 
                  rows={4}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  placeholder="寫下具啟發性的評語...（如: 你的WOOP計畫很有條理，特別是面對障礙時的做法很具體，加油！）"
                  className="w-full text-xs p-3 rounded-xl border border-blue-100 focus:border-blue-400 bg-white outline-none leading-relaxed font-medium"
                />
              </div>

              {/* Award Badge checklist selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 block flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  授與榮譽勳章：
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {feedbackBadges.map((badge) => {
                    const isSelected = teacherSelectedBadges.includes(badge);
                    return (
                      <button 
                        key={badge}
                        onClick={() => {
                          if (isSelected) {
                            setTeacherSelectedBadges(teacherSelectedBadges.filter(b => b !== badge));
                          } else {
                            setTeacherSelectedBadges([...teacherSelectedBadges, badge]);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-amber-100 border-amber-300 text-amber-800 font-extrabold shadow-2xs' 
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        🏅 {badge}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating slider score */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>評估分數：</span>
                  <span className="text-blue-700 font-extrabold">{teacherScore} 分</span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="100" 
                  value={teacherScore}
                  onChange={(e) => setTeacherScore(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-100 rounded-lg"
                />
              </div>

              {/* Send buttons */}
              <button 
                onClick={() => handleTeacherSubmitFeedback(activeSheet === 'woop' ? 'woop' : 'exhibition')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                送出批改與反饋
              </button>
            </div>

            {/* Socratic AI help widget */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 text-center space-y-3">
              <span className="text-3xl block">💡</span>
              <h4 className="text-xs font-bold text-amber-900 leading-none">AI 協同批改小助手</h4>
              <p className="text-[10px] text-amber-700 leading-normal font-medium">
                點擊可為學生的填寫內容自動生成溫馨鼓勵、或是生成蘇格拉底提問以利課堂思辨！
              </p>
              
              <button 
                onClick={handleAiGrading}
                disabled={isAiGrading}
                className={`py-1.5 px-3 font-bold text-[10px] rounded-lg transition-all text-white flex items-center justify-center gap-1.5 mx-auto ${
                  isAiGrading 
                    ? 'bg-amber-400 cursor-not-allowed' 
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {isAiGrading ? (
                  <>
                    <span className="animate-spin text-xs">🌀</span>
                    AI 正在認真批改中...
                  </>
                ) : (
                  <>
                    <span>🪄</span>
                    自動生成 AI 評語
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
