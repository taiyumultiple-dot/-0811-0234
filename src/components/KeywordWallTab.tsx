/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  Tv, 
  Share2, 
  Send, 
  Users, 
  Award, 
  Flame, 
  BookOpen,
  Search,
  CheckCircle,
  TrendingUp,
  Lock,
  Heart
} from 'lucide-react';
import { StudentSubmission, UserProfile } from '../types';
import SafeImageAvatar from './SafeImageAvatar';

interface KeywordWallTabProps {
  submissions: StudentSubmission[];
  onChangeSubmissions: (subs: StudentSubmission[]) => void;
  currentUser: UserProfile;
  registeredUsers?: UserProfile[];
}

// Preset warm-vibe visual styles for keyword cloud
const TAG_COLORS = [
  'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 hover:border-amber-400',
  'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-400',
  'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 hover:border-emerald-400',
  'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-400',
  'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-400',
  'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200 hover:border-pink-400',
  'bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200 hover:border-teal-400',
];

export default function KeywordWallTab({ 
  submissions, 
  onChangeSubmissions, 
  currentUser,
  registeredUsers = []
}: KeywordWallTabProps) {
  const [selectedKeywordFilter, setSelectedKeywordFilter] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Student Quick Post Inputs
  const [newKeywordInput, setNewKeywordInput] = useState<string>('');
  const [newOneLinerInput, setNewOneLinerInput] = useState<string>('');
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const role = currentUser.role;
  const isStudent = role === 'student';

  // 1. Gather all submitted keywords
  const submittedExhibitions = submissions.filter(s => s.exhibition && s.exhibition.submitted);
  const totalSubmissionsCount = submittedExhibitions.length || 1;

  // Aggregate stats
  const keywordStats: Record<string, number> = {};
  submittedExhibitions.forEach(s => {
    if (s.exhibition.keywords) {
      s.exhibition.keywords.forEach(kw => {
        if (kw && kw.trim()) {
          keywordStats[kw] = (keywordStats[kw] || 0) + 1;
        }
      });
    }
  });

  // Sort keywords by frequency
  const sortedKeywordStats = Object.entries(keywordStats).sort((a, b) => b[1] - a[1]);

  // 2. Student Quick Submission Action
  const handleQuickPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim() && !newOneLinerInput.trim()) {
      alert("請至少輸入一個生命關鍵字或一句生命金句喔！");
      return;
    }

    setIsPosting(true);
    
    // Add to submissions array
    const updated = submissions.map(sub => {
      if (sub.studentId === currentUser.id) {
        const existingExhibition = sub.exhibition || { keywords: [], oneLiner: '', rememberMe: '', timeline: [], submitted: false };
        
        // Add new keyword if not already exists
        const processedKeywords = [...existingExhibition.keywords];
        if (newKeywordInput.trim()) {
          const splitKw = newKeywordInput.split(/[,，\s]+/).map(k => k.trim()).filter(k => k);
          splitKw.forEach(kw => {
            if (!processedKeywords.includes(kw)) {
              processedKeywords.push(kw);
            }
          });
        }

        return {
          ...sub,
          exhibition: {
            ...existingExhibition,
            keywords: processedKeywords,
            oneLiner: newOneLinerInput.trim() || existingExhibition.oneLiner,
            submitted: true, // auto-mark submitted so it displays on the board
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        };
      }
      return sub;
    });

    onChangeSubmissions(updated);
    
    // Success notice and clear
    setTimeout(() => {
      setIsPosting(false);
      setNewKeywordInput('');
      setNewOneLinerInput('');
      alert("🎉 您的生命密碼已成功投遞至班級關鍵字牆！");
    }, 500);
  };

  // 3. Filtering logic
  const filteredSubmissions = submissions.filter(sub => {
    const hasEx = sub.exhibition && sub.exhibition.submitted;
    if (!hasEx) return false;

    // Filter by keyword if selected
    if (selectedKeywordFilter && !sub.exhibition.keywords.includes(selectedKeywordFilter)) {
      return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchKeywords = sub.exhibition.keywords.some(k => k.toLowerCase().includes(q));
      const matchOneLiner = sub.exhibition.oneLiner.toLowerCase().includes(q);
      const matchRemember = sub.exhibition.rememberMe.toLowerCase().includes(q);
      
      return matchName || matchKeywords || matchOneLiner || matchRemember;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STATS HEADER */}
      <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-blue-950 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-100 animate-pulse" />
            班級生命關鍵字牆 (互動探索雲)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            投遞內心深處的生命密碼，在彼此的軌跡中看見共鳴，點亮課堂投影討論！
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0 gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>已開展學生: <strong>{submittedExhibitions.length}</strong> 人</span>
          </div>
          <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>累積生命詞彙: <strong>{Object.keys(keywordStats).length}</strong> 種</span>
          </div>
        </div>
      </div>

      {/* 2. EXPLICIT GAME RULES & METHODS (備註遊戲規則與方法) */}
      <div className="bg-gradient-to-r from-amber-50/50 via-amber-50/30 to-white border border-amber-200/60 rounded-3xl p-5 space-y-3 shadow-3xs">
        <h3 className="text-sm font-black text-amber-900 flex items-center gap-2">
          <HelpCircle className="w-4.5 h-4.5 text-amber-600" />
          💡 關鍵字牆的「遊戲規則」與「使用方法」：
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed font-medium">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-100 space-y-1.5">
            <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              🎯 學生端玩法說明 (Student Rules)
            </span>
            <ul className="list-decimal pl-4.5 space-y-1 text-slate-600 text-[11px]">
              <li><strong>完成探索：</strong>至「成長表單」撰寫你的生前特展，即可解鎖大門。</li>
              <li><strong>快速投遞：</strong>若尚未填妥表單，亦可利用下方「快速投稿」面板一鍵投遞關鍵字！</li>
              <li><strong>探索共鳴：</strong>點選字雲中的關鍵字，即可看見有哪些同學（可匿名）有相同的追求，並閱讀他們的深切體悟。</li>
            </ul>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-100 space-y-1.5">
            <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              🎬 老師端引導秘訣 (Teacher Methods)
            </span>
            <ul className="list-decimal pl-4.5 space-y-1 text-slate-600 text-[11px]">
              <li><strong>大螢幕投影：</strong>老師上課時，可將此頁面全螢幕放映至大投影幕上。</li>
              <li><strong>詞頻聚焦：</strong>引導學生觀察字雲，哪一個生命特質是班上最在乎的？（字體越大票數越高）。</li>
              <li><strong>匿名點評：</strong>切換至「🔒 匿名模式」，點選高頻字，挑選幾句令人驚豔的「生命金句」帶全班進行哲學思辨！</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Word Cloud (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Floating tags list cloud */}
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="text-sm font-black text-blue-950 flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-blue-500" />
                🌌 班級生命詞彙大星雲
              </h3>
              
              {selectedKeywordFilter && (
                <button 
                  onClick={() => setSelectedKeywordFilter(null)}
                  className="text-[10px] bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg font-bold border border-red-200 transition-colors"
                >
                  清除關鍵字篩選 ×
                </button>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#fcfbf9] to-[#f7f5ef] p-6 rounded-2xl border border-amber-100/30 min-h-[280px] flex flex-wrap gap-2.5 justify-center items-center content-center relative overflow-hidden">
              {sortedKeywordStats.length > 0 ? (
                sortedKeywordStats.map(([kw, count], idx) => {
                  const isSelected = selectedKeywordFilter === kw;
                  
                  // Calculate sizes based on frequency
                  let sizeClass = "text-xs px-3.5 py-1.5 font-bold";
                  let motionScale = 1.0;
                  if (count > 3) {
                    sizeClass = "text-base px-5 py-2.5 font-black tracking-wide";
                    motionScale = 1.1;
                  } else if (count > 1) {
                    sizeClass = "text-sm px-4 py-2 font-extrabold";
                    motionScale = 1.05;
                  }

                  const baseColorClass = TAG_COLORS[idx % TAG_COLORS.length];
                  const bgClass = isSelected 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-blue-600' 
                    : `${baseColorClass} bg-white shadow-2xs`;

                  return (
                    <motion.button
                      key={kw}
                      whileHover={{ scale: motionScale + 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedKeywordFilter(isSelected ? null : kw)}
                      className={`rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-2 ${sizeClass} ${bgClass}`}
                    >
                      <span>✨ {kw}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${isSelected ? 'bg-blue-800 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        {count}
                      </span>
                    </motion.button>
                  );
                })
              ) : (
                <div className="text-center space-y-2 py-10">
                  <span className="text-4xl">🌾</span>
                  <p className="text-xs text-slate-400 italic">目前尚未有人投遞生命詞彙，快來使用右側表單搶先投稿吧！</p>
                </div>
              )}
            </div>
          </div>

          {/* Classroom Projection Discussion Board */}
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
              <div>
                <h3 className="text-base font-extrabold text-blue-950 flex items-center gap-1.5">
                  <Tv className="w-5 h-5 text-indigo-500" />
                  課堂投影討論牆 (Classroom Discussion Board)
                </h3>
                <p className="text-[11px] text-slate-400">點選上方的字詞或在右側搜尋，即可即時在此投影討論學生的生命感想。</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isAnonymous 
                      ? 'bg-amber-600 border-amber-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  title="切換課堂大螢幕投影是否隱藏學生姓名，保護穩私"
                >
                  {isAnonymous ? "🔒 已開啟匿名展示" : "👥 顯示學生姓名"}
                </button>
              </div>
            </div>

            {/* Filter indicators */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="搜尋學生的金句或生命特質..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-400 outline-none"
                />
              </div>

              {selectedKeywordFilter && (
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                  關鍵字焦點：{selectedKeywordFilter}
                  <button onClick={() => setSelectedKeywordFilter(null)} className="hover:text-red-500 font-bold ml-1">×</button>
                </span>
              )}
            </div>

            {/* Board cards list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, idx) => (
                  <motion.div
                    key={sub.studentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-200 hover:bg-white transition-all shadow-3xs"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100">
                        <div className="flex items-center gap-2">
                          <SafeImageAvatar
                            src={isAnonymous ? undefined : sub.exhibition.timeline?.[0]?.text ? '/uploads/char_avatar.png' : undefined}
                            fallbackEmoji={isAnonymous ? '👤' : '🎒'}
                            sizeClassName="w-6 h-6"
                            className="bg-slate-200 rounded-full"
                          />
                          <span className="text-xs font-extrabold text-slate-800">
                            {isAnonymous ? "生命探險家" : sub.studentName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {sub.exhibition.submittedAt ? sub.exhibition.submittedAt.substring(5, 16) : '剛投遞'}
                        </span>
                      </div>

                      {/* Content quote */}
                      <blockquote className="border-l-2 border-amber-400 pl-3 italic text-xs text-[#5c4424] font-black leading-relaxed">
                        「{sub.exhibition.oneLiner || "這段生命旅程，只要認真活過就值得了！"}」
                      </blockquote>

                      {/* remember me paragraph */}
                      {sub.exhibition.rememberMe && (
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                          我希望別人記得我是一個：{sub.exhibition.rememberMe}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-dashed border-slate-100">
                      {sub.exhibition.keywords.map((kw, kidx) => (
                        <span 
                          key={kidx}
                          onClick={() => setSelectedKeywordFilter(kw)}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                            selectedKeywordFilter === kw 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 italic">無符合篩選條件的生命金句展示</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Dynamic Form / Stats (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick submission post panel for students */}
          {isStudent && (
            <div className="bg-white rounded-3xl border border-amber-100 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-xl">✍️</span>
                <div>
                  <h3 className="text-xs font-black text-slate-800">快速投稿我的生命密碼</h3>
                  <span className="text-[9px] text-amber-600 font-bold block">點擊後可立刻呈現在左側黑板上！</span>
                </div>
              </div>

              <form onSubmit={handleQuickPost} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 block">我的生命關鍵字 (複數可用逗號隔開)</label>
                  <input
                    type="text"
                    placeholder="例如：勇敢, 溫暖, 獨立"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-400 bg-amber-50/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 block">我想留下的一句話 (生命宣言)</label>
                  <textarea
                    rows={3}
                    placeholder="寫下您面對生命、面對未來的深刻信念，或者座右銘..."
                    value={newOneLinerInput}
                    onChange={(e) => setNewOneLinerInput(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-400 bg-amber-50/10 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPosting}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isPosting ? '遞送中...' : '即時投放至黑板！'}
                </button>
              </form>
            </div>
          )}

          {/* Stats Distribution */}
          <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              全班詞彙熱度排行榜
            </h3>

            <div className="space-y-3">
              {sortedKeywordStats.length > 0 ? (
                sortedKeywordStats.slice(0, 5).map(([kw, count], idx) => {
                  const percentage = (count / totalSubmissionsCount) * 100;
                  return (
                    <div 
                      key={kw} 
                      onClick={() => setSelectedKeywordFilter(kw)}
                      className="space-y-1 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between text-[11px] font-bold text-gray-700">
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400 font-sans font-black">{idx + 1}.</span>
                          <span>{kw}</span>
                        </span>
                        <span>{count} 票 ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center py-4">暫無熱度統計</p>
              )}
            </div>
          </div>

          {/* Heartwarming quotes card */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-950 rounded-3xl p-5 text-white shadow-sm space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            
            <Heart className="w-8 h-8 text-amber-400 fill-amber-400/20" />
            
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-300">「生命是一趟探索」</h4>
              <p className="text-[11px] text-blue-100 leading-relaxed">
                課本『生命的網絡：你我他』引導我們：人與人並非孤島，我們的生命在大星雲中相互交織。點選同學的關鍵字，在共同的在乎中，看見連結與支持。
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
