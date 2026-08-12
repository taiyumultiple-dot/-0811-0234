/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 登入 / 註冊。
 *
 * 設計原則：一進來只有兩個欄位和一顆按鈕，其他都收起來。
 *
 * 幾個刻意的決定：
 *   ・不分「學生登入」「教師登入」兩個分頁。身分寫在帳號上，系統查得到，
 *     沒道理要使用者先自己選一次；選錯了還會出現「找不到帳號」的假錯誤。
 *   ・註冊改成底下一行文字連結，不佔一個分頁。多數人是來登入的。
 *   ・課堂體驗帳號預設收合。老師示範時點開就有，學生自己用時不會被一排
 *     頭像干擾。
 *   ・拿掉了兩張角色立繪與四個裝飾 emoji——那是登入框，不是首頁。
 */

import React, { useState, useEffect } from 'react';
import { User, Lock, LogIn, Eye, EyeOff, ChevronDown, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charBojunImg from '../assets/images/characters/char_bojun.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from '../assets/images/characters/char_xiaoping.jpg';
import charDadImg from '../assets/images/characters/char_dad.jpg';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
  onRegisterUser: (user: UserProfile) => void;
  initialTab?: 'login' | 'register';
  onClose?: () => void;
}

const characterImages: Record<string, string> = {
  kehua: charKehuaImg,
  xiaoping: charXiaopingImg,
  bojun: charBojunImg,
  xiaowen: charXiaowenImg,
  teacher: charDadImg
};

const inputClass =
  'w-full pl-11 pr-4 py-3 bg-white border-2 border-[#E9D6BF] focus:border-[#E65100] ' +
  'rounded-2xl text-sm font-bold text-slate-800 focus:outline-none transition-colors ' +
  'placeholder:text-slate-400 placeholder:font-normal';

export default function AuthScreen({
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  initialTab,
  onClose
}: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialTab || 'login');

  useEffect(() => {
    if (initialTab) setMode(initialTab);
  }, [initialTab]);

  // 登入
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showQuick, setShowQuick] = useState(false);

  // 註冊
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regError, setRegError] = useState('');

  /** 不分身分找帳號——身分由找到的那筆資料決定 */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = registeredUsers.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!found) {
      setLoginError('找不到這個帳號。可以展開下面的課堂體驗帳號直接進入，或先註冊一個。');
      return;
    }
    if (password && found.password && found.password !== password) {
      setLoginError('密碼不對，再試一次。');
      return;
    }
    onLoginSuccess(found);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regUsername.trim() || !regPassword.trim() || !regName.trim()) {
      setRegError('三個欄位都要填。');
      return;
    }
    if (registeredUsers.some(u => u.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      setRegError('這個帳號已經有人用了，換一個。');
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      username: regUsername.trim(),
      password: regPassword.trim(),
      name: regName.trim(),
      role: regRole,
      avatarEmoji: regRole === 'student' ? '🎒' : '👩🏻‍🏫'
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);   // 註冊完直接進去，不用再登入一次
  };

  // 體驗帳號：四位學生 + 一位老師，順序固定
  const demoUsers = [
    ...registeredUsers.filter(
      u => u.role === 'student' && ['kehua', 'xiaoping', 'bojun', 'xiaowen'].includes(u.username)
    ),
    ...registeredUsers.filter(u => u.role === 'teacher' && u.username === 'teacher')
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-3xl border-2 border-[#E9D6BF] shadow-2xl overflow-hidden relative">

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#FFFBF5] rounded-full transition-colors cursor-pointer z-10"
          >
            ✕
          </button>
        )}

        {/* 標頭 */}
        <div className="pt-8 pb-6 px-7 text-center">
          <svg className="w-8 h-8 mx-auto mb-3" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 3C50 3 53 38 62 47C71 56 97 50 97 50C97 50 71 56 62 62 53 68 50 97 50 97 50 97 47 68 38 62 29 56 3 50 3 50 3 50 29 56 38 47 47 38 50 3 50 3Z" fill="#E0812A" />
          </svg>
          <h2 className="text-lg font-black text-[#3E2723]">
            {mode === 'login' ? '登入' : '註冊新帳號'}
          </h2>
          <p className="text-xs text-[#8D6E63] font-bold mt-1">
            {mode === 'login' ? '泰宇生命教育互動學習平台' : '建立帳號後會直接進入平台'}
          </p>
        </div>

        {/* --- 登入 --- */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="px-7 pb-7 space-y-4">
            {loginError && (
              <p className="px-4 py-3 bg-rose-50 border border-rose-200 text-[#C62828] text-xs rounded-2xl font-bold leading-relaxed">
                {loginError}
              </p>
            )}

            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A484]" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="帳號"
                autoComplete="username"
                className={inputClass}
                required
              />
            </div>

            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A484]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="密碼"
                autoComplete="current-password"
                className={inputClass + ' pr-12'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#E65100] hover:bg-[#D84315] text-white rounded-2xl font-black text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4.5 h-4.5" />
              登入
            </button>

            {/* 課堂體驗帳號：預設收起來 */}
            {demoUsers.length > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowQuick(!showQuick)}
                  className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#B4570B] hover:text-[#E65100] py-1.5 transition-colors cursor-pointer"
                >
                  課堂體驗帳號（免密碼）
                  <ChevronDown className={`w-4 h-4 transition-transform ${showQuick ? 'rotate-180' : ''}`} />
                </button>

                {/* 尺寸抓得剛好讓五個人在 375px 的手機上排成一列，不會落單 */}
                {showQuick && (
                  <div className="flex flex-wrap justify-center gap-2 pt-3">
                    {demoUsers.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => onLoginSuccess(u)}
                        title={`以 ${u.name} 的身分進入`}
                        className="flex flex-col items-center gap-1.5 w-12 group cursor-pointer"
                      >
                        <img
                          src={characterImages[u.username] || charKehuaImg}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#E9D6BF] group-hover:border-[#E65100] transition-colors"
                        />
                        <span className="text-[11px] font-bold text-[#5D4037] leading-none truncate w-full text-center">
                          {u.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="text-center text-xs text-[#8D6E63] font-bold pt-1">
              還沒有帳號？{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setRegError(''); }}
                className="text-[#E65100] hover:underline font-black cursor-pointer"
              >
                註冊一個
              </button>
            </p>
          </form>
        )}

        {/* --- 註冊 --- */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="px-7 pb-7 space-y-4">
            {regError && (
              <p className="px-4 py-3 bg-rose-50 border border-rose-200 text-[#C62828] text-xs rounded-2xl font-bold leading-relaxed">
                {regError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 bg-[#FFFBF5] p-1.5 rounded-2xl border-2 border-[#F1E0CE]">
              {(['student', 'teacher'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegRole(r)}
                  className={`py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                    regRole === r ? 'bg-[#E65100] text-white shadow-sm' : 'text-[#8D6E63] hover:text-[#5D4037]'
                  }`}
                >
                  {r === 'student' ? '我是學生' : '我是老師'}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={regName}
              onChange={e => setRegName(e.target.value)}
              placeholder={regRole === 'student' ? '你的名字或綽號' : '老師稱呼，例如 陳老師'}
              className={inputClass.replace('pl-11', 'pl-4')}
              required
            />
            <input
              type="text"
              value={regUsername}
              onChange={e => setRegUsername(e.target.value)}
              placeholder="登入帳號"
              autoComplete="username"
              className={inputClass.replace('pl-11', 'pl-4')}
              required
            />
            <input
              type="password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              placeholder="設定密碼"
              autoComplete="new-password"
              className={inputClass.replace('pl-11', 'pl-4')}
              required
            />

            <button
              type="submit"
              className="w-full py-3.5 bg-[#E65100] hover:bg-[#D84315] text-white rounded-2xl font-black text-sm transition-colors shadow-sm cursor-pointer"
            >
              建立帳號並進入
            </button>

            <button
              type="button"
              onClick={() => { setMode('login'); setLoginError(''); }}
              className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#8D6E63] hover:text-[#E65100] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              回到登入
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
