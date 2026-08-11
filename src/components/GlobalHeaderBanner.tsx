import React, { useState, useEffect } from 'react';
import { ChevronRight, LogOut, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroCharacters from '../assets/images/hero-characters.jpg';
import { UserProfile } from '../types';

interface GlobalHeaderBannerProps {
  currentUser: UserProfile | null;
  onNavigate: (tabName: string) => void;
  onTriggerLogin?: (role: 'student' | 'teacher') => void;
  onLogout?: () => void;
}

export default function GlobalHeaderBanner({
  currentUser,
  onNavigate,
  onTriggerLogin,
  onLogout,
}: GlobalHeaderBannerProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('global_header_banner_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('global_header_banner_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="space-y-3 mb-6">
      {/* 1. TOP BRAND BAR */}
      <div className="flex items-center justify-between bg-[#FCFAF6] border border-[#F1E0CE] rounded-2xl px-4 md:px-6 py-3 shadow-3xs">
        <div className="flex items-center gap-2.5">
          {/* Elegant orange four-point star sparkle */}
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#E65100] shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
          </svg>
          <span className="font-extrabold text-[#4A321F] text-sm md:text-lg tracking-tight">
            泰宇生命教育互動學習平台
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => onNavigate('show_tour')}
                title="查看平台功能導覽"
                className="px-3 py-1.5 border border-[#E9D6BF] rounded-xl hover:bg-[#FAF5EC] text-[#B4570B] font-extrabold text-xs transition-all flex items-center gap-1 bg-white shadow-3xs cursor-pointer shrink-0"
              >
                <span>💡</span>
                <span className="hidden sm:inline">使用導覽</span>
              </button>

              <span className="text-xs font-bold text-[#7D6B5D] bg-[#FAF5EC] border border-[#F1E0CE] px-3 py-1.5 rounded-full hidden md:flex items-center gap-1.5">
                👤 {currentUser.name} ({currentUser.role === 'student' ? '學生' : '教師'})已登入
              </span>
              
              {currentUser.role === 'student' ? (
                <button 
                  onClick={() => onNavigate('課程地圖')}
                  className="px-3.5 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  學習空間 <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => onNavigate('學習統計')}
                  className="px-3.5 py-1.5 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  教師統計 <ChevronRight className="w-4 h-4" />
                </button>
              )}
              
              <button 
                onClick={onLogout}
                title="登出系統"
                className="p-1.5 md:p-2 border border-[#E9D6BF] rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all bg-white cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onNavigate('show_tour')}
                title="查看平台功能導覽"
                className="px-3 py-1.5 border border-[#E9D6BF] rounded-xl hover:bg-[#FAF5EC] text-[#B4570B] font-extrabold text-xs transition-all flex items-center gap-1 bg-white shadow-3xs cursor-pointer shrink-0"
              >
                <span>💡</span>
                <span className="hidden sm:inline">使用導覽</span>
              </button>

              <button
                onClick={() => onTriggerLogin && onTriggerLogin('student')}
                className="px-3 py-1.5 md:px-4 md:py-2 border border-[#E65100]/60 hover:bg-[#FFFBF5] text-[#E65100] font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 bg-white shadow-3xs cursor-pointer shrink-0"
              >
                <span className="text-sm">👤</span>
                <span>學生入口</span>
              </button>
              
              <button
                onClick={() => onTriggerLogin && onTriggerLogin('teacher')}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-[#E65100] hover:bg-[#D84315] text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 shadow-3xs cursor-pointer shrink-0"
              >
                <span className="text-sm">🔒</span>
                <span>教師登入</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Full-Width Hero Character Banner Image with Animated Collapse */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div 
              onClick={() => onNavigate('課程地圖')}
              className="relative rounded-3xl overflow-hidden cursor-pointer group hover:opacity-98 transition-all duration-300 bg-white border border-[#F1E0CE] shadow-xs"
            >
              <img 
                src={heroCharacters} 
                alt="生命教育互動學習平台 － 選擇單元，進入學習單並開始作答" 
                className="w-full h-auto object-contain object-center block transition-transform duration-500 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              {/* Subtle elegant glassmorphism overlay label */}
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white/90 backdrop-blur-xs border border-white/60 text-[#3E2723] text-xs font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-sm flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-xs md:text-sm">🗺️ 進入課程地圖</span>
                <ChevronRight className="w-4 h-4 text-[#E65100]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

