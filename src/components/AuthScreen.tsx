/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  GraduationCap, 
  Lock, 
  UserPlus, 
  Sparkles, 
  LogIn, 
  Heart, 
  CheckCircle,
  Eye,
  EyeOff,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../types';

import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charBojunImg from '../assets/images/characters/char_bojun.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from '../assets/images/characters/char_xiaoping.jpg';
import charGrandpaImg from '../assets/images/characters/char_grandpa.jpg';
import charDadImg from '../assets/images/characters/char_dad.jpg';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
  onRegisterUser: (user: UserProfile) => void;
  initialTab?: 'student_login' | 'teacher_login' | 'register';
  onClose?: () => void;
}

export default function AuthScreen({ 
  onLoginSuccess, 
  registeredUsers, 
  onRegisterUser,
  initialTab,
  onClose
}: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'student_login' | 'teacher_login' | 'register'>(initialTab || 'student_login');
  
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register states
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmoji, setRegEmoji] = useState('🎒');
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  const emojiOptions = ['🎒', '👦🏻', '👧🏻', '🏀', '👩🏻', '👨🏻', '👴🏻', '💡', '⚖️', '🎨', '🦁', '🦉', '👩🏻‍🏫', '👨🏻‍🏫'];

  // Mapping characters to high quality image files
  const characterImages: Record<string, string> = {
    kehua: charKehuaImg,
    xiaoping: charXiaopingImg,
    bojun: charBojunImg,
    xiaowen: charXiaowenImg,
    teacher: charDadImg
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const targetRole = activeTab === 'student_login' ? 'student' : 'teacher';
    const found = registeredUsers.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.role === targetRole
    );

    if (!found) {
      setLoginError('⚠️ 找不到該帳號！您可以點選下方「預設學生快速通道」點選頭像一鍵免密登入，或前往註冊新帳號。');
      return;
    }

    if (password && found.password && found.password !== password) {
      setLoginError('密碼輸入錯誤，請再試一次。');
      return;
    }

    onLoginSuccess(found);
  };

  const handleQuickLogin = (user: UserProfile) => {
    onLoginSuccess(user);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!regUsername.trim() || !regPassword.trim() || !regName.trim()) {
      setRegError('所有欄位皆為必填！');
      return;
    }

    const exists = registeredUsers.some(
      u => u.username.toLowerCase() === regUsername.trim().toLowerCase()
    );

    if (exists) {
      setRegError('此帳號已被註冊，請換一個帳號名稱！');
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      username: regUsername.trim(),
      password: regPassword.trim(),
      name: regName.trim(),
      role: regRole,
      avatarEmoji: regEmoji
    };

    onRegisterUser(newUser);
    setRegSuccess(true);
    
    // Clear inputs
    setRegUsername('');
    setRegPassword('');
    setRegName('');

    // Switch tab on success
    setTimeout(() => {
      setActiveTab(regRole === 'student' ? 'student_login' : 'teacher_login');
      setUsername(newUser.username);
      setPassword(newUser.password || '');
      setRegSuccess(false);
    }, 1500);
  };

  const defaultStudents = registeredUsers.filter(u => u.role === 'student' && ['kehua', 'xiaoping', 'bojun', 'xiaowen'].includes(u.username));
  const defaultTeachers = registeredUsers.filter(u => u.role === 'teacher' && u.username === 'teacher');

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-visible px-4 py-8">
      
      {/* BACKGROUND FLOATING DECORATIONS (mimics hand-drawn natural feel of textbook) */}
      <div className="absolute -top-10 -left-12 text-5xl opacity-40 select-none pointer-events-none hidden md:block">🌸</div>
      <div className="absolute -bottom-10 -right-12 text-5xl opacity-40 select-none pointer-events-none hidden md:block">🌿</div>
      <div className="absolute -top-12 -right-8 text-4xl opacity-20 select-none pointer-events-none hidden md:block animate-pulse">✨</div>
      <div className="absolute bottom-1/2 -left-16 text-4xl opacity-30 select-none pointer-events-none hidden md:block">🌼</div>

      {/* 1. BACKGROUND COMPANION CHARACTER (LEFT) - GRANDPA */}
      <div className="absolute right-[102%] mr-8 bottom-4 w-60 h-[400px] hidden xl:block pointer-events-none select-none z-0">
        <motion.div 
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-x-[-20px] bottom-[-20px] top-1/4 bg-gradient-to-t from-orange-200/50 via-amber-100/30 to-transparent blur-3xl rounded-full animate-pulse" />
          
          <img 
            src={charGrandpaImg} 
            alt="可華爺爺" 
            className="w-full h-full object-cover rounded-3xl border-4 border-white shadow-2xl rotate-[-2deg] transition-all duration-500 hover:rotate-0 hover:scale-[1.02]" 
          />
          <div className="absolute -bottom-2 -right-2 bg-[#FFFBF5] text-[#8C6D58] text-sm font-black px-4 py-2.5 rounded-xl border-2 border-[#E9D6BF] shadow-lg whitespace-nowrap flex items-center gap-1.5">
            <span className="text-lg">👴🏻</span>
            <span>可華爺爺 (故事引導)</span>
          </div>
        </motion.div>
      </div>

      {/* 2. BACKGROUND COMPANION CHARACTER (RIGHT) - DAD */}
      <div className="absolute left-[102%] ml-8 bottom-4 w-60 h-[400px] hidden xl:block pointer-events-none select-none z-0">
        <motion.div 
          initial={{ opacity: 0, x: -40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-x-[-20px] bottom-[-20px] top-1/4 bg-gradient-to-t from-orange-200/50 via-amber-100/30 to-transparent blur-3xl rounded-full animate-pulse" />
          
          <img 
            src={charDadImg} 
            alt="可華爸爸" 
            className="w-full h-full object-cover rounded-3xl border-4 border-white shadow-2xl rotate-[2deg] transition-all duration-500 hover:rotate-0 hover:scale-[1.02]" 
          />
          <div className="absolute -bottom-2 -left-2 bg-[#FFF9F2] text-[#B4570B] text-sm font-black px-4 py-2.5 rounded-xl border-2 border-[#E9D6BF] shadow-lg whitespace-nowrap flex items-center gap-1.5">
            <span className="text-lg">🤵🏻</span>
            <span>可華爸爸 (陪伴引導)</span>
          </div>
        </motion.div>
      </div>

      {/* 3. CORE LOGIN PANEL - High Legibility redesign (圈起來太小重新設計) */}
      <div className="w-full bg-[#FCFAF7] rounded-[36px] border-3 border-[#E9D6BF] shadow-2xl overflow-hidden relative z-10 p-1">
        
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#8D6E63] hover:text-[#5D4037] rounded-full hover:bg-orange-50 transition-colors z-50 cursor-pointer text-base font-black border border-gray-200/40 bg-white shadow-xs"
            title="關閉"
          >
            ✕
          </button>
        )}

        {/* Brand Header */}
        <div className="p-8 text-center border-b-2 border-[#F1E0CE]/60 bg-gradient-to-b from-[#FFFDF9] to-transparent relative">
          <div className="flex justify-center mb-4">
            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 3C50 3 53 38 62 47C71 56 97 50 97 50C97 50 71 56 62 62 53 68 50 97 50 97 50 97 47 68 38 62 29 56 3 50 3 50 3 50 29 56 38 47 47 38 50 3 50 3Z" fill="#E0812A"/>
            </svg>
          </div>
          {/* Main Title - MUCH BIGGER AND CHUNKY */}
          <h2 className="text-2xl font-black text-[#3E2723] tracking-tight mb-2">
            泰宇生命教育互動探索站
          </h2>
          {/* Secondary description - legible and clean */}
          <p className="text-xs font-black text-orange-700/80 tracking-widest uppercase font-mono">
            Life Education Portal · Authenticate
          </p>
        </div>

        {/* Tab switchers - Larger, highly clickable design */}
        <div className="flex bg-[#FFFBF5] border-b-2 border-[#F1E0CE]/60 p-2 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('student_login');
              setLoginError('');
            }}
            className={`flex-1 py-3.5 text-sm font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student_login'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[#8D6E63] hover:bg-amber-50 hover:text-[#5D4037]'
            }`}
          >
            <User className="w-5 h-5" />
            學生登入區
          </button>
          
          <button
            onClick={() => {
              setActiveTab('teacher_login');
              setLoginError('');
            }}
            className={`flex-1 py-3.5 text-sm font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'teacher_login'
                ? 'bg-[#5D4037] text-white shadow-md'
                : 'text-[#8D6E63] hover:bg-amber-50 hover:text-[#5D4037]'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            教師登入區
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setRegError('');
            }}
            className={`flex-1 py-3.5 text-sm font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-[#8D6E63] hover:bg-amber-50 hover:text-[#5D4037]'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            註冊帳號
          </button>
        </div>

        {/* Content Form Area */}
        <div className="p-8 bg-white rounded-b-[32px]">
          
          {/* A. STUDENT & TEACHER LOGIN */}
          {(activeTab === 'student_login' || activeTab === 'teacher_login') && (
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-4 bg-rose-50 border-2 border-rose-200 text-[#C62828] text-sm rounded-2xl leading-relaxed font-bold shadow-xs">
                  ⚠️ {loginError}
                </div>
              )}

              {/* Username Input - much larger text & input padding */}
              <div className="space-y-1.5">
                <label className="text-sm font-black text-[#5D4037] block flex items-center gap-1.5">
                  <span>👤</span> 帳號名稱 (Username)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#B4570B]/70">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="請輸入註冊帳號 (體驗可直接點下方學生頭像)"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border-2 border-[#E9D6BF] focus:border-orange-500 rounded-2xl text-sm font-black text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-black text-[#5D4037] block flex items-center gap-1.5">
                  <span>🔒</span> 登入密碼 (Password)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#B4570B]/70">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="請輸入密碼 (體驗免密碼，或輸入 123)"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border-2 border-[#E9D6BF] focus:border-orange-500 rounded-2xl text-sm font-black text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <LogIn className="w-5 h-5" />
                {activeTab === 'student_login' ? '開啟學生思辨空間 ➔' : '進入教師管理後台 ➔'}
              </button>

              {/* Persona Quick Click Shortcuts - REDESIGNED MUCH LARGER FOR LEGIBILITY (圖二/圖四) */}
              <div className="pt-6 border-t-2 border-[#F1E0CE]/60">
                
                {activeTab === 'student_login' ? (
                  <>
                    <h4 className="text-xs font-black text-orange-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <span className="text-lg">🎒</span>
                      <span>預設學生快速通道 (點選頭像，一鍵免密登入)：</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {defaultStudents.map((u) => {
                        const img = characterImages[u.username] || charKehuaImg;
                        return (
                          <button
                            key={u.id}
                            type="button; button"
                            onClick={() => handleQuickLogin(u)}
                            className="p-3 bg-amber-50/40 hover:bg-amber-50 border-2 border-amber-100 rounded-2xl text-left flex items-center gap-3 transition-all hover:scale-[1.03] cursor-pointer shadow-xs group"
                          >
                            <img 
                              src={img} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shadow-md shrink-0 group-hover:border-orange-500 transition-colors" 
                            />
                            <div className="min-w-0">
                              <span className="text-sm font-black text-slate-800 block leading-tight truncate">{u.name}</span>
                              <span className="text-[11px] font-bold text-orange-600 block truncate mt-0.5">點擊快速登入</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2 text-xs text-[#B4570B] bg-orange-50/50 border border-orange-100 p-3.5 rounded-2xl font-bold leading-relaxed mb-4">
                      <span className="text-lg">💡</span>
                      <span>教師體驗：請點點擊下方預設的「林老師（教師範例帳號）」，即可進入教師評閱系統！</span>
                    </div>
                    {defaultTeachers.map((u) => {
                      const img = characterImages[u.username] || charDadImg;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleQuickLogin(u)}
                          className="p-4 bg-[#FFFBF5] hover:bg-[#FAF5EC] border-2 border-[#F1E0CE]/80 rounded-2xl text-left flex items-center gap-4 transition-all hover:scale-[1.03] cursor-pointer shadow-sm group w-full"
                        >
                          <img 
                            src={img} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-orange-300 shadow-md shrink-0 group-hover:border-orange-500 transition-colors" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-800 block leading-tight">{u.name} (學期引導師)</span>
                              <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-orange-200">免密體驗</span>
                            </div>
                            <span className="text-xs font-bold text-gray-500 block mt-1">生命教育教師專用帳號 | ID: teacher</span>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </form>
          )}

          {/* B. REGISTER ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              {regSuccess && (
                <div className="p-4 bg-[#E8F5E9] border-2 border-[#C8E6C9] text-[#2E7D32] text-sm rounded-2xl flex items-center gap-2 font-black animate-pulse">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>🎉 建立檔案成功！即將為您自動登入系統...</span>
                </div>
              )}

              {regError && (
                <div className="p-4 bg-rose-50 border-2 border-rose-200 text-[#C62828] text-sm rounded-2xl leading-relaxed font-bold shadow-xs">
                  ⚠️ {regError}
                </div>
              )}

              {/* Role selector in registration */}
              <div className="space-y-1.5">
                <label className="text-sm font-black text-[#5D4037] block">選擇註冊身分类別</label>
                <div className="grid grid-cols-2 gap-2 bg-[#FFFBF5] p-1.5 rounded-2xl border-2 border-[#F1E0CE]/60">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('student');
                      setRegEmoji('🎒');
                    }}
                    className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      regRole === 'student'
                        ? 'bg-[#E65100] text-white shadow-sm'
                        : 'text-[#8D6E63] hover:text-[#5D4037]'
                    }`}
                  >
                    我是探索學生 (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('teacher');
                      setRegEmoji('👩🏻‍🏫');
                    }}
                    className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      regRole === 'teacher'
                        ? 'bg-[#5D4037] text-white shadow-sm'
                        : 'text-[#8D6E63] hover:text-[#5D4037]'
                    }`}
                  >
                    我是生命導師 (Teacher)
                  </button>
                </div>
              </div>

              {/* Real Name/Nickname */}
              <div className="space-y-1.5">
                <label className="text-sm font-black text-[#5D4037] block">
                  {regRole === 'student' ? '真實姓名或匿名綽號 (Name / Nickname)' : '教師名稱 (e.g. 賴老師)'}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={regRole === 'student' ? "例：林可涵 或 溫柔陽光女孩" : "例：陳老師"}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border-2 border-[#E9D6BF] focus:border-orange-500 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Login Username */}
              <div className="space-y-1.5">
                <label className="text-sm font-black text-[#5D4037] block">登入帳號名稱 (Username)</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="輸入登入帳號，如 stud_amy77"
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border-2 border-[#E9D6BF] focus:border-orange-500 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-black text-[#5D4037] block">自訂登入密碼 (Password)</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="請設定登入密碼"
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border-2 border-[#E9D6BF] focus:border-orange-500 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Avatar Emoji picker */}
              <div className="space-y-1.5">
                <label className="text-sm font-black text-[#5D4037] block">選擇您的生命頭像</label>
                <div className="flex flex-wrap gap-2.5 p-4 bg-[#FFFBF5] rounded-2xl border-2 border-[#F1E0CE]/40">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setRegEmoji(emoji)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-115 active:scale-90 cursor-pointer ${
                        regEmoji === emoji
                          ? 'bg-orange-100 border-2 border-orange-500 shadow-sm'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                建立檔案，開啟生命探索之旅 ✨
              </button>
            </form>
          )}

        </div>

        {/* Support instructions */}
        <div className="p-5 bg-[#FFFBF5] text-center text-xs text-[#8D6E63] border-t-2 border-[#F1E0CE]/60 flex items-center justify-center gap-2 font-bold">
          <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>泰宇生命教育，陪伴你在大千世界中凝視自我、綻放獨特生命力</span>
        </div>

      </div>
    </div>
  );
}
