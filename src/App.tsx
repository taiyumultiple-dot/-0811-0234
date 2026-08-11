import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Home, 
  Map, 
  Gamepad2, 
  Brain, 
  FileText, 
  Users, 
  UserCheck, 
  Search, 
  GraduationCap, 
  User,
  Heart,
  HelpCircle,
  TrendingUp,
  Settings,
  ChevronDown,
  LogOut,
  UserPlus,
  BookOpen,
  Beaker,
  Bell
} from 'lucide-react';

import { Character, StudentSubmission, UserProfile } from './types';
import { INITIAL_SUBMISSIONS, CHARACTERS } from './data';
import HomeTab from './components/HomeTab';
import CourseMapTab from './components/CourseMapTab';
import WorksheetTab from './components/WorksheetTab';
import KeywordWallTab from './components/KeywordWallTab';
import CharacterStoryTab from './components/CharacterStoryTab';
import LearningStatisticsTab from './components/LearningStatisticsTab';
import InteractiveQuestTab from './components/InteractiveQuestTab';
import HumanologySelfIdentityQuizPage from './components/HumanologySelfIdentityQuizPage';
import LearningRecordTab from './components/LearningRecordTab';
import LatestNewsTab from './components/LatestNewsTab';
import GlobalHeaderBanner from './components/GlobalHeaderBanner';
import { ACHIEVEMENTS } from './achievements';
import AuthScreen from './components/AuthScreen';
import SafeImageAvatar from './components/SafeImageAvatar';
import WelcomeTour from './components/WelcomeTour';
import charKehuaImg from './assets/images/characters/char_kehua.jpg';
import charBojunImg from './assets/images/characters/char_bojun.jpg';
import charXiaowenImg from './assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from './assets/images/characters/char_xiaoping.jpg';

const SEEDED_USERS: UserProfile[] = [
  { id: 'stud_kehua', username: 'kehua', password: '123', name: '陳可華', role: 'student', avatarEmoji: '👦🏻', avatarUrl: charKehuaImg },
  { id: 'stud_xiaoping', username: 'xiaoping', password: '123', name: '張曉萍', role: 'student', avatarEmoji: '👩🏻', avatarUrl: charXiaopingImg },
  { id: 'stud_bojun', username: 'bojun', password: '123', name: '王博鈞', role: 'student', avatarEmoji: '🏀', avatarUrl: charBojunImg },
  { id: 'stud_xiaowen', username: 'xiaowen', password: '123', name: '王小文', role: 'student', avatarEmoji: '👧🏻', avatarUrl: charXiaowenImg },
  { id: 'teacher_lin', username: 'teacher', password: '123', name: '林老師', role: 'teacher', avatarEmoji: '👩🏻‍🏫' },
];

const memoryStorage: Record<string, string> = {};

const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[Storage Warning] Failed to read ${key} from localStorage:`, e);
      return memoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[Storage Warning] Failed to write ${key} to localStorage:`, e);
      memoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Storage Warning] Failed to remove ${key} from localStorage:`, e);
      delete memoryStorage[key];
    }
  }
};

export default function App() {
  // 1. STATE INITIALIZATION backed by localStorage for 100% persistence!
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = safeStorage.getItem('life_edu_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SEEDED_USERS;
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const saved = safeStorage.getItem('life_edu_submissions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SUBMISSIONS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = safeStorage.getItem('life_edu_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'student_login' | 'teacher_login' | 'register'>('student_login');
  const [showTour, setShowTour] = useState(false);

  // Fetch initial state from server on mount
  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        if (data.characters && data.characters.length > 0) setCharacters(data.characters);
        if (data.registeredUsers) {
          setRegisteredUsers(data.registeredUsers);
          // Sync currentUser with latest profile details from server
          const storedUser = safeStorage.getItem('life_edu_current_user');
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              const freshUser = data.registeredUsers.find((u: any) => u.id === parsed.id);
              if (freshUser) {
                setCurrentUser(freshUser);
              }
            } catch (e) {}
          }
        }
        if (data.submissions) setSubmissions(data.submissions);
        setIsLoaded(true);
      })
      .catch(e => {
        console.error("Failed to load initial state from server:", e);
        setIsLoaded(true); // fall back to local storage
      });

    // Periodic auto-sync polling to ensure real-time automatic updates for all clients
    const interval = setInterval(() => {
      fetch('/api/state')
        .then(res => res.json())
        .then(data => {
          if (data.characters && data.characters.length > 0) {
            setCharacters(prev => JSON.stringify(prev) !== JSON.stringify(data.characters) ? data.characters : prev);
          }
          if (data.registeredUsers) {
            setRegisteredUsers(prev => JSON.stringify(prev) !== JSON.stringify(data.registeredUsers) ? data.registeredUsers : prev);
          }
          if (data.submissions) {
            setSubmissions(prev => JSON.stringify(prev) !== JSON.stringify(data.submissions) ? data.submissions : prev);
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 2. SYNCHRONIZE WITH LOCAL STORAGE AND SERVER
  useEffect(() => {
    safeStorage.setItem('life_edu_users', JSON.stringify(registeredUsers));
    if (isLoaded) {
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registeredUsers })
      }).catch(e => console.error("Failed to sync users with server:", e));
    }
  }, [registeredUsers, isLoaded]);

  useEffect(() => {
    safeStorage.setItem('life_edu_submissions', JSON.stringify(submissions));
    if (isLoaded) {
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissions })
      }).catch(e => console.error("Failed to sync submissions with server:", e));
    }
  }, [submissions, isLoaded]);

  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem('life_edu_current_user', JSON.stringify(currentUser));
    } else {
      safeStorage.removeItem('life_edu_current_user');
    }
  }, [currentUser]);

  // 2.5 Dynamic characters state backed by localStorage
  const [characters, setCharacters] = useState<Character[]>(() => {
    const saved = safeStorage.getItem('life_edu_characters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return CHARACTERS;
  });

  useEffect(() => {
    safeStorage.setItem('life_edu_characters', JSON.stringify(characters));
    if (isLoaded) {
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characters })
      }).catch(e => console.error("Failed to sync characters with server:", e));
    }
  }, [characters, isLoaded]);

  const handleUpdateCharacterAvatar = (charId: string, newUrl: string) => {
    // A. Update central characters array
    setCharacters(prev => prev.map(c => c.id === charId ? { ...c, avatarUrl: newUrl } : c));

    // B. Sync student user profile photo if appropriate
    const userId = charId.replace('char_', 'stud_');
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, avatarUrl: newUrl } : u));

    // C. Update active session user
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, avatarUrl: newUrl } : null);
    }
  };

  // Current Navigation Tab: '首頁' | '課程地圖' | '思辨與遊戲' | '成長表單' | '角色故事'
  const [activeTab, setActiveTab] = useState<string>('首頁');
  const [activeQuestType, setActiveQuestType] = useState<'autopilot' | 'socrates' | 'trolley' | 'fallacy' | 'teacher_panel' | undefined>(undefined);
  const [initialGameId, setInitialGameId] = useState<number | null>(null);

  // Parse deep-link URL query parameters (e.g., from QR code scans or shared links)
  useEffect(() => {
    if (!isLoaded) return;
    
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const joinParam = params.get('join');
    const gameIdParam = params.get('gameId');
    
    if (tabParam === '互動遊戲' || tabParam === '遊戲探索' || joinParam || gameIdParam) {
      setActiveTab('互動遊戲');
      
      if (gameIdParam) {
        const parsedGId = parseInt(gameIdParam, 10);
        if (!isNaN(parsedGId)) {
          setInitialGameId(parsedGId);
        }
      }
      
      // If student joins via QR code and isn't logged in, log them in as a seed student
      if (!currentUser) {
        const defaultStudent = registeredUsers.find(u => u.id === 'stud_xiaoping') || registeredUsers[0];
        if (defaultStudent) {
          setCurrentUser(defaultStudent);
          safeStorage.setItem('life_edu_current_user', JSON.stringify(defaultStudent));
        }
      }
      
      // Clean up URL parameters to keep address bar pristine after processing
      try {
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (e) {}
    }
  }, [isLoaded, registeredUsers, currentUser]);

  // Achievement popup tracking states
  const [unlockedBadgeForPopup, setUnlockedBadgeForPopup] = useState<any>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Achievement unlock detection effect
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') return;
    
    const studentSub = submissions.find(s => s.studentId === currentUser.id);
    if (!studentSub) return;

    // Current unlocked achievement IDs
    const currentUnlockedIds = ACHIEVEMENTS.filter(a => a.checkUnlock(studentSub)).map(a => a.id);

    // Get previous achievements from localStorage
    const storageKey = `seen_achievements_${currentUser.id}`;
    const savedSeenRaw = safeStorage.getItem(storageKey);
    let seenIds: string[] = [];
    if (savedSeenRaw) {
      try {
        seenIds = JSON.parse(savedSeenRaw);
      } catch (e) {}
    } else {
      // First load for this user - mark all current achievements as seen to avoid a flood of popups
      safeStorage.setItem(storageKey, JSON.stringify(currentUnlockedIds));
      return;
    }

    // Identify if there's any newly unlocked achievement
    const newlyUnlockedId = currentUnlockedIds.find(id => !seenIds.includes(id));
    if (newlyUnlockedId) {
      const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlockedId);
      if (achievement) {
        setUnlockedBadgeForPopup(achievement);
      }
      
      // Save updated seen achievements
      const updatedSeen = [...seenIds, newlyUnlockedId];
      safeStorage.setItem(storageKey, JSON.stringify(updatedSeen));
    }
  }, [submissions, currentUser]);

  // Selected unit context for CourseMapTab
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');

  // Role & active selected student context
  const role = currentUser?.role || 'student';
  const [activeStudentId, setActiveStudentId] = useState<string>('stud_kehua');

  // When current user changes, automatically align activeStudentId
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student') {
        setActiveStudentId(currentUser.id);
      } else {
        // Teachers default to first student for review
        setActiveStudentId('stud_kehua');
      }
    }
  }, [currentUser]);

  // Automated onboarding tour launcher
  useEffect(() => {
    if (!isLoaded) return;

    if (!currentUser) {
      const seenGuest = localStorage.getItem('life_edu_seen_guest_tour');
      if (seenGuest !== 'true') {
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } else {
      const seenUser = localStorage.getItem(`life_edu_seen_user_tour_${currentUser.id}`);
      if (seenUser !== 'true') {
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaded, currentUser]);

  const currentStudent = submissions.find(s => s.studentId === activeStudentId) || submissions[0];

  const handleSelectUnitFromHome = (unitId: string) => {
    setSelectedUnitId(unitId);
    setActiveTab('課本單元');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('首頁');

    // First-time login: auto-show the guided tour once per account
    const seenKey = `life_edu_tour_seen_${user.id}`;
    if (!safeStorage.getItem(seenKey)) {
      safeStorage.setItem(seenKey, '1');
      setShowTour(true);
    }
  };

  const handleRegisterUser = (user: UserProfile) => {
    // Add user to registered pool
    setRegisteredUsers(prev => [...prev, user]);

    // If registered as student, insert a blank submission slot so they can begin working right away!
    if (user.role === 'student') {
      const blankSub: StudentSubmission = {
        studentId: user.id,
        studentName: user.name,
        woop: { wish: '', outcome: '', obstacle: '', plan: '', currentStep: 1, submitted: false },
        exhibition: { rememberMe: '', keywords: [], oneLiner: '', timeline: [], submitted: false }
      };
      setSubmissions(prev => [...prev, blankSub]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('首頁');
  };

  // 3. PERSISTENT QUEST RECORD HANDLER
  const handleSaveQuest = (
    studentId: string, 
    questType: string, 
    data: any
  ) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.studentId === studentId) {
        // Interactive-game results (互動遊戲 tab) are namespaced under sub.games
        // so they don't collide with the older fixed quest-type fields below.
        if (questType.startsWith('game_')) {
          const updatedGames = { ...(sub.games || {}) };
          if (!data) {
            delete updatedGames[questType];
          } else {
            updatedGames[questType] = {
              data,
              submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
          }
          return { ...sub, games: updatedGames };
        }

        if (!data) {
          // Reset action
          const updated: any = { ...sub };
          delete updated[questType];
          return updated;
        }
        return {
          ...sub,
          [questType]: {
            ...((sub as any)[questType] || {}),
            ...data,
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        };
      }
      return sub;
    }));
  };

  // 4. TEACHER FEEDBACK REPLIES HANDLER
  const handleSaveQuestFeedback = (
    studentId: string, 
    questType: 'autopilot' | 'socrates' | 'trolley' | 'fallacy', 
    comments: string
  ) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.studentId === studentId) {
        const questData = sub[questType];
        if (questData) {
          return {
            ...sub,
            [questType]: {
              ...questData,
              feedback: {
                comments,
                gradedBy: currentUser?.name || '林老師',
                gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
              }
            }
          };
        }
      }
      return sub;
    }));
  };

  const navItems = [
    { name: '首頁', icon: Home, badge: null },
    { name: '課本單元', icon: Map, badge: null },
    { name: '互動遊戲', icon: Gamepad2, badge: null },
    { name: '學習紀錄', icon: FileText, badge: null },
    { name: '最新消息', icon: Bell, badge: null },
    ...(currentUser?.role === 'teacher' ? [{ name: '學習統計', icon: TrendingUp, badge: null }] : [])
  ];

  const handleTabSelection = (tabName: string, extra?: any) => {
    if (tabName === 'show_tour') {
      setShowTour(true);
      return;
    }
    if (tabName === '角色故事') {
      setActiveTab('互動遊戲');
      setTimeout(() => {
        const el = document.getElementById('character-story-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (!currentUser && ['課本單元', '課程地圖', '學習統計', '互動遊戲', '學習紀錄'].includes(tabName)) {
      setAuthModalTab('student_login');
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tabName);
    if (extra?.questType) {
      setActiveQuestType(extra.questType);
    }
  };

  return (
    <div id="app-container" className="min-h-screen bg-[#FAF6F0] text-gray-700 font-sans flex flex-col justify-between antialiased">
      
      {/* ========================================================= */}
      {/* 1. BRAND HEADER & NAVBAR                                 */}
      {/* ========================================================= */}
      {activeTab !== '首頁' && (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => handleTabSelection('首頁')}>
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 3C50 3 53 38 62 47C71 56 97 50 97 50C97 50 71 56 62 62 53 68 50 97 50 97 50 97 47 68 38 62 29 56 3 50 3 50 3 50 29 56 38 47 47 38 50 3 50 3Z" fill="#E0812A"/>
              </svg>
              <div>
                <h1 className="text-lg font-extrabold text-[#4A321F] tracking-tight leading-none mb-0.5">
                  泰宇生命教育互動學習平台
                </h1>
                <span className="text-[10px] font-bold text-[#B08A66] block tracking-wider font-mono">
                  Life Education Platform
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleTabSelection(item.name)}
                    className={`relative pb-1 text-sm font-bold transition-all flex items-center gap-1.5 border-b-2 ${
                      isActive 
                        ? 'text-[#E0812A] border-[#E0812A]' 
                        : 'text-slate-500 border-transparent hover:text-[#E0812A]'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[#E0812A]' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Section: Search & User Profile */}
            <div className="flex items-center gap-4">

              {/* Search Icon */}
              <button
                title="搜尋"
                className="p-2 rounded-full text-slate-400 hover:text-[#E0812A] hover:bg-orange-50 transition-all cursor-pointer"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
              
              {/* Teacher's Student Workspace Selector Dropdown */}
              {currentUser?.role === 'teacher' && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full p-0.5 px-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    評閱學生空間:
                  </span>
                  <select 
                    value={activeStudentId} 
                    onChange={(e) => setActiveStudentId(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none pr-1 py-1 cursor-pointer focus:ring-0"
                  >
                    {submissions.map((s) => (
                      <option key={s.studentId} value={s.studentId}>
                        {s.studentName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tour Guide Button */}
              <button
                onClick={() => setShowTour(true)}
                title="查看平台功能導覽"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-orange-200 hover:bg-orange-50 text-[#B4570B] rounded-full text-xs font-bold transition-all cursor-pointer bg-[#FFFBF5]"
              >
                <HelpCircle className="w-4 h-4 text-[#E0812A]" />
                <span className="hidden sm:inline">平台導覽</span>
              </button>

              {/* Active User Profile Button or Login Button */}
              {!currentUser ? (
                <button
                  onClick={() => {
                    setAuthModalTab('student_login');
                    setShowAuthModal(true);
                  }}
                  className="px-5 py-2 bg-[#E65100] hover:bg-[#D84315] text-white rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔑</span>
                  <span>登入系統</span>
                </button>
              ) : (
                <div 
                  className="flex items-center gap-2 bg-[#E0812A] hover:bg-[#C46B1E] text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-all"
                >
                  <SafeImageAvatar
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    fallbackEmoji={currentUser.avatarEmoji || '👤'}
                    sizeClassName="w-5 h-5"
                    className="border border-white/40 bg-white"
                  />
                  <span>{currentUser.name} {currentUser.role === 'student' ? '已登入' : '教師端'}</span>
                </div>
              )}

              {/* Logout button */}
              {currentUser && (
                <button 
                  onClick={handleLogout}
                  title="登出帳號"
                  className="p-2 rounded-full border border-gray-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>
        </header>
      )}

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE CONTAINER                              */}
      {/* ========================================================= */}
      <main className="max-w-7xl w-full mx-auto p-4 lg:p-6 pb-24 lg:pb-6 flex-1">
        {/* Header Banner shown only on Home tab */}
        {activeTab === '首頁' && (
          <GlobalHeaderBanner 
            currentUser={currentUser}
            onNavigate={handleTabSelection}
            onTriggerLogin={(role) => {
              setAuthModalTab(role === 'student' ? 'student_login' : 'teacher_login');
              setShowAuthModal(true);
            }}
            onLogout={handleLogout}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + '-' + role + '-' + activeStudentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === '首頁' && (
              <HomeTab 
                onNavigate={handleTabSelection} 
                onSelectUnit={handleSelectUnitFromHome} 
                onSelectGameId={(gameId) => {
                  setInitialGameId(gameId);
                  handleTabSelection('互動遊戲');
                }}
                activeStudent={{
                  name: currentStudent?.studentName || '陳可華',
                  avatarEmoji: currentUser?.avatarEmoji || '👦🏻',
                  avatarUrl: currentUser?.avatarUrl || charKehuaImg
                }}
                submissions={submissions}
                characters={characters}
                currentUser={currentUser}
                onTriggerLogin={(role) => {
                  setAuthModalTab(role === 'student' ? 'student_login' : 'teacher_login');
                  setShowAuthModal(true);
                }}
                onLogout={handleLogout}
              />
            )}

            {(activeTab === '課本單元' || activeTab === '課程地圖') && (
              <CourseMapTab 
                onNavigate={handleTabSelection} 
                selectedUnitId={selectedUnitId}
                onSelectUnit={setSelectedUnitId}
                submissions={submissions}
                onChangeSubmissions={setSubmissions}
                activeStudentId={activeStudentId}
                role={role}
              />
            )}

            {(activeTab === '人學與自我認同測驗' || activeTab === '隨堂測驗') && (
              <HumanologySelfIdentityQuizPage 
                onBack={() => setActiveTab('課本單元')}
                role={role}
                studentName={currentStudent?.studentName}
                onSaveResult={(score, answers) => {
                  if (currentUser) {
                    handleSaveQuest(currentUser.id, 'game_quiz_humanology', { score, answers });
                  }
                }}
              />
            )}

            {activeTab === '互動遊戲' && (
              <InteractiveQuestTab 
                currentStudent={currentStudent}
                onSaveQuest={handleSaveQuest}
                role={role}
                submissions={submissions}
                onSaveQuestFeedback={handleSaveQuestFeedback}
                defaultQuest={activeQuestType}
                defaultGameId={initialGameId || undefined}
              />
            )}

            {activeTab === '關鍵字牆' && (
              <KeywordWallTab 
                submissions={submissions}
                onChangeSubmissions={setSubmissions}
                currentUser={currentUser}
                registeredUsers={registeredUsers}
              />
            )}

            {activeTab === '成長表單' && (
              <WorksheetTab 
                submissions={submissions}
                onChangeSubmissions={setSubmissions}
                activeStudentId={activeStudentId}
                role={role}
                characters={characters}
              />
            )}

            {activeTab === '學習紀錄' && (
              <LearningRecordTab 
                submissions={submissions}
                onChangeSubmissions={setSubmissions}
                onSaveQuest={handleSaveQuest}
                currentUser={currentUser}
                activeStudentName={currentStudent?.studentName || currentUser?.name || '陳可華'}
                onNavigate={handleTabSelection}
                onSelectUnit={setSelectedUnitId}
              />
            )}

            {activeTab === '最新消息' && (
              <LatestNewsTab 
                currentUser={currentUser}
                onNavigate={handleTabSelection}
              />
            )}

            {activeTab === '學習統計' && currentUser?.role === 'teacher' && (
              <LearningStatisticsTab 
                submissions={submissions}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION                               */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-[#E0812A] scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'text-[#E0812A]' : 'text-slate-400'}`} />
              <span className="text-[10px] font-extrabold tracking-tight">{item.name}</span>
            </button>
          );
        })}
      </div>



      {/* Dynamic Achievement Unlock Popup Modal */}
      <AnimatePresence>
        {unlockedBadgeForPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUnlockedBadgeForPopup(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-amber-200 shadow-2xl p-6 overflow-hidden text-center space-y-6"
            >
              {/* Radiating background elements */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Achievement Badge Center with Bounce & Spin */}
              <div className="relative flex justify-center py-4">
                <motion.div 
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.15, stiffness: 200, damping: 10 }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-tr ${unlockedBadgeForPopup.color} flex items-center justify-center text-5xl shadow-lg border-4 border-white`}
                >
                  {unlockedBadgeForPopup.emoji}
                </motion.div>
                
                {/* Floating crown / sparkles */}
                <span className="absolute -top-1 text-2xl animate-bounce">👑</span>
                <span className="absolute left-1/4 top-1/3 text-xl animate-pulse">✨</span>
                <span className="absolute right-1/4 bottom-1/3 text-xl animate-pulse">✨</span>
              </div>

              {/* Congratulations message */}
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-black tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full uppercase">
                  🎉 恭喜獲得新成就勳章！
                </span>
                <h3 className="text-xl font-black text-slate-800">{unlockedBadgeForPopup.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold px-4">
                  {unlockedBadgeForPopup.description}
                </p>
              </div>

              {/* Share & Continue Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
                <button
                  onClick={() => {
                    const shareText = `🎉 我在《泰宇生命教育互動學習平台》解鎖了【${unlockedBadgeForPopup.name}】勳章！\n「${unlockedBadgeForPopup.description}」\n快來與我一同啟航生命意義的思辨旅程吧！✨`;
                    try {
                      navigator.clipboard.writeText(shareText);
                      setCopiedShare(true);
                      setTimeout(() => setCopiedShare(false), 2500);
                    } catch (err) {
                      console.error("Failed to copy share text to clipboard", err);
                    }
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>{copiedShare ? '✓ 已複製分享文字！' : '分享喜悅 (複製連結)'}</span>
                </button>
                
                <button
                  onClick={() => setUnlockedBadgeForPopup(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-all cursor-pointer"
                >
                  繼續學習
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guest Login Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg z-10"
            >
              <AuthScreen 
                onLoginSuccess={(user) => {
                  handleLoginSuccess(user);
                  setShowAuthModal(false);
                }}
                registeredUsers={registeredUsers}
                onRegisterUser={handleRegisterUser}
                initialTab={authModalTab}
                onClose={() => setShowAuthModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Walkthrough / Tour Guide */}
      <WelcomeTour
        currentUser={currentUser}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onStartLogin={(role) => {
          setAuthModalTab(role === 'student' ? 'student_login' : 'teacher_login');
          setShowAuthModal(true);
        }}
      />

    </div>
  );
}
