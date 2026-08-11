import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Search, 
  Key, 
  Lock, 
  Unlock, 
  Compass, 
  BookOpen, 
  Award, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  FileText, 
  Shield, 
  SlidersHorizontal, 
  Share2, 
  Printer, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  MapPin, 
  Layers, 
  Lightbulb,
  ArrowLeft,
  Volume2,
  VolumeX,
  Zap,
  Star
} from 'lucide-react';

import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charBojunImg from '../assets/images/characters/char_bojun.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from '../assets/images/characters/char_xiaoping.jpg';
import charDadImg from '../assets/images/characters/char_dad.jpg';
import charGrandpaImg from '../assets/images/characters/char_grandpa.jpg';

interface LondonMysteriesGameProps {
  currentStudent?: any;
  onSaveQuest?: (studentId: string, questType: string, data: any) => void;
  onClose?: () => void;
}

export interface ClueItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  hint: string;
  isFound: boolean;
}

export default function LondonMysteriesGame({
  currentStudent,
  onSaveQuest,
  onClose
}: LondonMysteriesGameProps) {
  
  // Game Navigation & State
  const [activeRoom, setActiveRoom] = useState<'hub' | 'room1' | 'room2' | 'room3' | 'room4' | 'vault' | 'solved'>('hub');
  const [showNotebook, setShowNotebook] = useState<boolean>(false);
  const [inspectedClue, setInspectedClue] = useState<ClueItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Unlocked Keys
  const [unlockedKeys, setUnlockedKeys] = useState<{
    key1: boolean; // 智慧之匙 (Philosophy)
    key2: boolean; // 同理之匙 (Humanology)
    key3: boolean; // 勇氣之匙 (Ultimate Care)
    key4: boolean; // 責任之匙 (Ultimate Care / Values)
    key5: boolean; // 靈性之匙 (Spiritual)
  }>({
    key1: false,
    key2: false,
    key3: false,
    key4: false,
    key5: false,
  });

  // Clues Inventory
  const [clues, setClues] = useState<ClueItem[]>([
    {
      id: 'clue1',
      name: '舊邏輯手稿：非黑即白',
      category: '哲學思辨',
      icon: '📜',
      description: '十九世紀倫理學者留下的偵探手稿，寫著：「盲目跟風與二分法為謬誤之源，破解盲點之密鑰，唯有獨立思考。」',
      hint: '轉動 cipher wheel 密碼盤，排列出英文單字 "TRUTH"（真理）即可打開舊密碼箱。',
      isFound: true,
    },
    {
      id: 'clue2',
      name: '狼孩觀察筆記',
      category: '人学探索',
      icon: '🐺',
      description: '記載著狼孩卡瑪拉的社會化歷程：「人性不單由生物天生決定，同理心與社會關懷是點亮人類尊嚴的燭光。」',
      hint: '將人性平衡儀上的「同理心」與「自我認同」數值調整至 80 以上平衡狀態。',
      isFound: false,
    },
    {
      id: 'clue3',
      name: '三位石匠的神奇日誌',
      category: '終極關懷',
      icon: '🧱',
      description: '第一位石匠說自己在砌磚，第二位說自己在養家，第三位說自己在建造獻給真善美的偉大教堂。',
      hint: '旋轉維多利亞羅盤，將指針對準正北方「N - 終極使命與至善」。',
      isFound: false,
    },
    {
      id: 'clue4',
      name: '命運電車切換藍圖',
      category: '價值思辨',
      icon: '🚃',
      description: '面對電車難題的抉擇圖卡：「功利主義算計人數，德行倫理看重動機，真摯的利他抉擇需要內在道德智慧。」',
      hint: '拉動機械閘門槓桿，將軌道切換至「保護生命與利他價值」方向。',
      isFound: false,
    },
    {
      id: 'clue5',
      name: '幸福之門五曜印記',
      category: '靈性修養',
      icon: '🗝️',
      description: '當五把鑰匙齊聚，點亮靈性之光，即可開啟隱藏在霧都核心的幸福聖殿。',
      hint: '將 5 把鑰匙依序插入幸福聖殿大門解鎖。',
      isFound: false,
    }
  ]);

  // Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // ----------------------------------------------------
  // ROOM 1 PUZZLE: BRASS CIPHER WHEEL LOCK (TRUTH)
  // ----------------------------------------------------
  const CIPHER_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const [wheelDials, setWheelDials] = useState<number[]>([19, 17, 20, 19, 7]); // Defaults to "T R U T H" indices (19, 17, 20, 19, 7) or initial scrambled
  const [room1Solved, setRoom1Solved] = useState<boolean>(false);

  const spinDial = (index: number) => {
    if (room1Solved) return;
    setWheelDials(prev => {
      const next = [...prev];
      next[index] = (next[index] + 1) % CIPHER_LETTERS.length;
      return next;
    });
  };

  const currentWord = wheelDials.map(i => CIPHER_LETTERS[i]).join('');

  const checkRoom1Solution = () => {
    if (currentWord === 'TRUTH') {
      setRoom1Solved(true);
      setUnlockedKeys(prev => ({ ...prev, key1: true }));
      setClues(prev => prev.map(c => c.id === 'clue2' ? { ...c, isFound: true } : c));
      showToast('🎉 密碼正確！齒輪發出喀嗒聲響，解鎖「鑰匙一：智慧之匙」！');
    } else {
      showToast(`❌ 密碼 "${currentWord}" 不正確！提示：破譯思考盲點的終極解答是英文 "TRUTH"（真理）！`);
    }
  };

  // ----------------------------------------------------
  // ROOM 2 PUZZLE: EMPATHY & HUMANOLOGY BALANCE SLIDERS
  // ----------------------------------------------------
  const [sliderVal1, setSliderVal1] = useState<number>(30); // 生物天性
  const [sliderVal2, setSliderVal2] = useState<number>(85); // 同理與關懷
  const [sliderVal3, setSliderVal3] = useState<number>(80); // 自我認同
  const [sliderVal4, setSliderVal4] = useState<number>(75); // 社會連結
  const [room2Solved, setRoom2Solved] = useState<boolean>(false);

  const checkRoom2Solution = () => {
    // Condition: Empathy >= 75 and Self-Identity >= 75 and Social Connection >= 70
    if (sliderVal2 >= 75 && sliderVal3 >= 75 && sliderVal4 >= 70) {
      setRoom2Solved(true);
      setUnlockedKeys(prev => ({ ...prev, key2: true }));
      setClues(prev => prev.map(c => c.id === 'clue3' ? { ...c, isFound: true } : c));
      showToast('🎉 人性鏡像平衡達成！靈光乍現，解鎖「鑰匙二：同理之匙」！');
    } else {
      showToast('💡 提示：請將「同理心」、「自我認同」與「社會連結」滑桿提升至 75% 以上！');
    }
  };

  // ----------------------------------------------------
  // ROOM 3 PUZZLE: ULTIMATE COMPASS ALIGNMENT
  // ----------------------------------------------------
  const [compassAngle, setCompassAngle] = useState<number>(135); // Initial angle SE
  const [room3Solved, setRoom3Solved] = useState<boolean>(false);

  const rotateCompass = (delta: number) => {
    if (room3Solved) return;
    setCompassAngle(prev => (prev + delta + 360) % 360);
  };

  const checkRoom3Solution = () => {
    // Compass should point to North (0° or 360°)
    if (compassAngle === 0) {
      setRoom3Solved(true);
      setUnlockedKeys(prev => ({ ...prev, key3: true, key4: true }));
      setClues(prev => prev.map(c => c.id === 'clue4' ? { ...c, isFound: true } : c));
      showToast('🎉 羅盤磁針指向終極使命！光芒大作，同時解鎖「鑰匙三：勇氣之匙」與「鑰匙四：責任之匙」！');
    } else {
      showToast('🧭 提示：請將羅盤指針旋轉對準正北方「0° / N (終極至善與使命)」！');
    }
  };

  // ----------------------------------------------------
  // ROOM 4 PUZZLE: TROLLEY VALUE RAIL SWITCH
  // ----------------------------------------------------
  const [lever1, setLever1] = useState<boolean>(false); // Switch 1: Priority
  const [lever2, setLever2] = useState<boolean>(true);  // Switch 2: Empathy Over Profit
  const [lever3, setLever3] = useState<boolean>(true);  // Switch 3: Altruism
  const [room4Solved, setRoom4Solved] = useState<boolean>(false);

  const checkRoom4Solution = () => {
    if (lever1 && lever2 && lever3) {
      setRoom4Solved(true);
      setUnlockedKeys(prev => ({ ...prev, key5: true }));
      setClues(prev => prev.map(c => c.id === 'clue5' ? { ...c, isFound: true } : c));
      showToast('🎉 道德軌道順暢切換！解鎖「鑰匙五：靈性之匙」！所有 5 把鑰匙已全數收集！');
    } else {
      showToast('💡 提示：請將三個道德閘門槓桿全部切換至開啟（ON）狀態！');
    }
  };

  // ----------------------------------------------------
  // VAULT UNLOCK CEREMONY
  // ----------------------------------------------------
  const [vaultUnlocked, setVaultUnlocked] = useState<boolean>(false);
  const [actionPledge, setActionPledge] = useState<string>('每天花5分鐘聆聽朋友的心聲，並表達真誠感恩');

  const handleOpenVault = () => {
    const keyCount = Object.values(unlockedKeys).filter(Boolean).length;
    if (keyCount < 5) {
      showToast(`🔒 鑰匙尚未集齊！目前擁有 ${keyCount} / 5 把鑰匙，請先完成前 4 個解密房間！`);
      return;
    }
    setVaultUnlocked(true);
    setActiveRoom('solved');
    showToast('✨ 幸福之門順利開啟！恭喜你結案並覺醒生命英雄！');

    if (currentStudent?.studentId && onSaveQuest) {
      onSaveQuest(currentStudent.studentId, 'game_london_mysteries', {
        unlockedKeys,
        actionPledge,
        completedAt: new Date().toISOString()
      });
    }
  };

  const keyCount = Object.values(unlockedKeys).filter(Boolean).length;

  return (
    <div className="w-full min-h-[85vh] bg-[#0B1120] text-slate-100 rounded-3xl p-4 md:p-8 font-sans border-2 border-[#D97706]/40 shadow-2xl relative overflow-hidden select-none">
      
      {/* Fog Ambient Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900/60 to-black" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#78350F] text-amber-100 font-extrabold text-xs md:text-sm px-6 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-2 max-w-md text-center"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notebook Modal */}
      <AnimatePresence>
        {showNotebook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#18132A] border-2 border-[#D97706] rounded-3xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl space-y-5 relative"
            >
              <button 
                onClick={() => setShowNotebook(false)}
                className="absolute right-5 top-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-amber-800/40 pb-3">
                <span className="text-3xl">🕵️‍♂️</span>
                <div>
                  <h3 className="text-lg font-black text-amber-300">霧都偵探解密手帳 (Detective Notebook)</h3>
                  <p className="text-xs text-amber-200/70 font-semibold">紀錄已收集的案情線索與破譯指引</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {clues.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setInspectedClue(c)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      c.isFound 
                        ? 'bg-slate-900/80 border-amber-500/60 hover:border-amber-400' 
                        : 'bg-slate-900/30 border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-2xl">{c.icon}</span>
                      <h4 className="text-xs font-black text-amber-200 truncate">{c.name}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 line-clamp-2 leading-relaxed">
                      {c.isFound ? c.description : '🔒 尚未找到相關案情線索……'}
                    </p>
                  </div>
                ))}
              </div>

              {inspectedClue && (
                <div className="bg-amber-950/40 border-2 border-amber-600/60 p-4 rounded-2xl text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{inspectedClue.icon}</span>
                    <h4 className="text-xs font-black text-amber-300">{inspectedClue.name}</h4>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{inspectedClue.description}</p>
                  <p className="text-xs text-amber-400 font-bold bg-black/40 p-2.5 rounded-xl border border-amber-500/30">
                    💡 解密提示：{inspectedClue.hint}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowNotebook(false)}
                  className="px-6 py-2.5 bg-[#D97706] hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl cursor-pointer shadow-md"
                >
                  關閉手帳
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOP DETECTIVE HUD BAR */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border-2 border-amber-600/40 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        
        {/* Left: App Title & Back button */}
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-black"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>離開遊戲</span>
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕵️‍♂️</span>
            <div>
              <h1 className="text-sm md:text-base font-black text-amber-400 tracking-wide flex items-center gap-1.5">
                <span>幸福導航：霧都生命謎案</span>
                <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">London Mysteries Style</span>
              </h1>
              <p className="text-[11px] font-bold text-slate-400">解開四項生命懸案，收集五把幸福鑰匙，開啟幸福聖殿！</p>
            </div>
          </div>
        </div>

        {/* Right: Key Ring & Notebook & Sound */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Key ring */}
          <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <span className="text-xs font-black text-amber-300 mr-1">🔑 鑰匙庫 ({keyCount}/5):</span>
            <span title="智慧之匙" className={`text-base transition-all ${unlockedKeys.key1 ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'grayscale opacity-30'}`}>🗝️</span>
            <span title="同理之匙" className={`text-base transition-all ${unlockedKeys.key2 ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'grayscale opacity-30'}`}>🗝️</span>
            <span title="勇氣之匙" className={`text-base transition-all ${unlockedKeys.key3 ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'grayscale opacity-30'}`}>🗝️</span>
            <span title="責任之匙" className={`text-base transition-all ${unlockedKeys.key4 ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'grayscale opacity-30'}`}>🗝️</span>
            <span title="靈性之匙" className={`text-base transition-all ${unlockedKeys.key5 ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'grayscale opacity-30'}`}>🗝️</span>
          </div>

          <button
            onClick={() => setShowNotebook(true)}
            className="px-3.5 py-2 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-500/50 rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>🎒 解密手帳</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

        </div>

      </div>

      {/* MAIN GAME DISPLAY AREA */}
      <div className="relative z-10 pt-6">
        
        {/* ========================================================= */}
        {/* HUB SCENE: FOGGY MAP / DETECTIVE HQ                       */}
        {/* ========================================================= */}
        {activeRoom === 'hub' && (
          <div className="space-y-6">
            
            {/* Guide Dialogue */}
            <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
              <img src={charKehuaImg} alt="Sherlock Kehua" className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-md" referrerPolicy="no-referrer" />
              <div className="text-left">
                <h3 className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <span>偵探夥伴・可華</span>
                  <span className="text-[10px] text-slate-400 font-semibold">| 霧都生命案件指導員</span>
                </h3>
                <p className="text-xs text-slate-200 font-bold leading-relaxed mt-0.5">
                  {keyCount === 0 && '歡迎來到霧都生命偵探社！請進入四個偵探密室進行調查解密，收集五把幸福鑰匙！'}
                  {keyCount > 0 && keyCount < 5 && `已經成功找到 ${keyCount} 把幸福鑰匙！繼續調查剩餘密室吧！`}
                  {keyCount === 5 && '太厲害了！五把幸福鑰匙已經全數集齊！請前往「幸福聖殿」開啟最終大門！'}
                </p>
              </div>
            </div>

            {/* Room Investigation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Room 1 */}
              <div 
                onClick={() => setActiveRoom('room1')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-left relative overflow-hidden group shadow-lg ${
                  room1Solved 
                    ? 'bg-slate-900/60 border-emerald-500/60' 
                    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border-amber-600/50 hover:border-amber-400 hover:shadow-amber-500/10'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    密室 01 ・ 哲學書房
                  </span>
                  {room1Solved ? (
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 已破譯 (鑰匙 1)
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40">
                      🔒 懸案進行中
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">📜</span>
                  <div>
                    <h3 className="text-base font-black text-amber-200">思考盲點與謬誤密碼鎖</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">破譯跟風與二分法盲點，旋轉密碼盤找到真理！</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-amber-400">
                  <span>獲得獎勵：智慧之匙 🗝️</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">進入密室調查 <ChevronRight className="w-4 h-4" /></span>
                </div>
              </div>

              {/* Room 2 */}
              <div 
                onClick={() => setActiveRoom('room2')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-left relative overflow-hidden group shadow-lg ${
                  room2Solved 
                    ? 'bg-slate-900/60 border-emerald-500/60' 
                    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/40 border-emerald-600/50 hover:border-emerald-400 hover:shadow-emerald-500/10'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    密室 02 ・ 人學檔案室
                  </span>
                  {room2Solved ? (
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 已破譯 (鑰匙 2)
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40">
                      🔒 懸案進行中
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🐺</span>
                  <div>
                    <h3 className="text-base font-black text-emerald-200">狼孩與人性鏡像儀</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">探索生物天性與同理關懷，平衡身心靈數值！</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-emerald-400">
                  <span>獲得獎勵：同理之匙 🗝️</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">進入密室調查 <ChevronRight className="w-4 h-4" /></span>
                </div>
              </div>

              {/* Room 3 */}
              <div 
                onClick={() => setActiveRoom('room3')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-left relative overflow-hidden group shadow-lg ${
                  room3Solved 
                    ? 'bg-slate-900/60 border-emerald-500/60' 
                    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950/40 border-indigo-600/50 hover:border-indigo-400 hover:shadow-indigo-500/10'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    密室 03 ・ 鐘樓密室
                  </span>
                  {room3Solved ? (
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 已破譯 (鑰匙 3 & 4)
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40">
                      🔒 懸案進行中
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧭</span>
                  <div>
                    <h3 className="text-base font-black text-indigo-200">三位石匠與終極航向羅盤</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">旋轉航向羅盤，校準人生至善與生命使命！</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-indigo-400">
                  <span>獲得獎勵：勇氣之匙 🗝️ + 責任之匙 🗝️</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">進入密室調查 <ChevronRight className="w-4 h-4" /></span>
                </div>
              </div>

              {/* Room 4 */}
              <div 
                onClick={() => setActiveRoom('room4')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-left relative overflow-hidden group shadow-lg ${
                  room4Solved 
                    ? 'bg-slate-900/60 border-emerald-500/60' 
                    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950/40 border-rose-600/50 hover:border-rose-400 hover:shadow-rose-500/10'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    密室 04 ・ 命運車站
                  </span>
                  {room4Solved ? (
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 已破譯 (鑰匙 5)
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40">
                      🔒 懸案進行中
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🚃</span>
                  <div>
                    <h3 className="text-base font-black text-rose-200">電車難題與道德切換閘門</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">切換機械閘門槓桿，在道德兩難中做出良善抉擇！</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-rose-400">
                  <span>獲得獎勵：靈性之匙 🗝️</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">進入密室調查 <ChevronRight className="w-4 h-4" /></span>
                </div>
              </div>

            </div>

            {/* Happiness Vault Entrance Button */}
            <button
              onClick={() => setActiveRoom('vault')}
              className={`w-full py-5 rounded-3xl border-2 font-black text-base transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer ${
                keyCount === 5 
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-300 shadow-amber-500/20 animate-pulse' 
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <span className="text-2xl">{keyCount === 5 ? '🚪✨' : '🔒'}</span>
              <span>{keyCount === 5 ? '五鑰齊聚！前往開啟幸福聖殿大門' : `幸福聖殿大門（還需收集 ${5 - keyCount} 把鑰匙）`}</span>
            </button>

          </div>
        )}

        {/* ========================================================= */}
        {/* ROOM 1: BRASS CIPHER WHEEL LOCK                           */}
        {/* ========================================================= */}
        {activeRoom === 'room1' && (
          <div className="space-y-6 text-left">
            <button 
              onClick={() => setActiveRoom('hub')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-extrabold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> 返回偵探地圖
            </button>

            <div className="bg-slate-900/80 border-2 border-amber-600/50 rounded-3xl p-6 space-y-6 shadow-xl">
              
              <div className="flex justify-between items-center border-b border-amber-800/40 pb-4">
                <div>
                  <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <span>📜 密室 01：哲學書房 —— 思考盲點與謬誤密碼鎖</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    案情背景：人們常陷入「二分法」與「跟風盲從」的思考謬誤。破譯密碼鎖即可取得智慧之匙。
                  </p>
                </div>
                {room1Solved && (
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/50">
                    ✓ 已成功解密
                  </span>
                )}
              </div>

              {/* Interactive Cipher Wheel */}
              <div className="bg-black/60 border-2 border-amber-700/60 rounded-3xl p-8 text-center space-y-6">
                <p className="text-xs text-amber-200/80 font-bold">
                  🕵️ 點擊上方與下方按鈕，旋轉 5 個古銅密碼盤，拼出「真理」的英文單字（5個字母）！
                </p>

                {/* Dials */}
                <div className="flex justify-center items-center gap-3 md:gap-5 my-6">
                  {wheelDials.map((dialIdx, dialNum) => (
                    <div key={dialNum} className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => spinDial(dialNum)}
                        className="w-10 h-8 bg-amber-900/60 hover:bg-amber-800 text-amber-300 rounded-lg text-xs font-black cursor-pointer"
                      >
                        ▲
                      </button>
                      <div className="w-12 h-16 md:w-16 md:h-20 bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 border-2 border-amber-500/80 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-amber-200 shadow-inner">
                        {CIPHER_LETTERS[dialIdx]}
                      </div>
                      <button
                        onClick={() => spinDial(dialNum)}
                        className="w-10 h-8 bg-amber-900/60 hover:bg-amber-800 text-amber-300 rounded-lg text-xs font-black cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={checkRoom1Solution}
                    className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-lg active:scale-95 transition-all"
                  >
                    驗證解密密碼 (Unlock)
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROOM 2: EMPATHY & HUMANOLOGY BALANCE SLIDERS              */}
        {/* ========================================================= */}
        {activeRoom === 'room2' && (
          <div className="space-y-6 text-left">
            <button 
              onClick={() => setActiveRoom('hub')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-extrabold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> 返回偵探地圖
            </button>

            <div className="bg-slate-900/80 border-2 border-emerald-600/50 rounded-3xl p-6 space-y-6 shadow-xl">
              
              <div className="flex justify-between items-center border-b border-emerald-800/40 pb-4">
                <div>
                  <h2 className="text-lg font-black text-emerald-300 flex items-center gap-2">
                    <span>🐺 密室 02：人學檔案室 —— 狼孩與人性鏡像儀</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    案情背景：狼孩卡瑪拉的案件告訴我們，人性需要透過同理與社會關懷來平衡與滋養。
                  </p>
                </div>
                {room2Solved && (
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/50">
                    ✓ 已成功解密
                  </span>
                )}
              </div>

              <div className="bg-black/60 border-2 border-emerald-700/60 rounded-3xl p-6 space-y-6">
                
                <p className="text-xs text-emerald-200/80 font-bold">
                  🎛️ 請拖曳滑桿，將「同理與關懷」、「自我認同」、「社會連結」的指標皆提升至 75% 以上！
                </p>

                <div className="space-y-4 max-w-lg mx-auto">
                  
                  {/* Slider 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">1. 生物本能天性</span>
                      <span className="text-amber-400">{sliderVal1}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={sliderVal1} 
                      onChange={(e) => setSliderVal1(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-300">2. 同理心與身心關懷 (目標: ≥75%)</span>
                      <span className="text-emerald-400">{sliderVal2}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={sliderVal2} 
                      onChange={(e) => setSliderVal2(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-300">3. 自我價值認同 (目標: ≥75%)</span>
                      <span className="text-emerald-400">{sliderVal3}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={sliderVal3} 
                      onChange={(e) => setSliderVal3(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Slider 4 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-300">4. 溫暖社會連結 (目標: ≥70%)</span>
                      <span className="text-emerald-400">{sliderVal4}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={sliderVal4} 
                      onChange={(e) => setSliderVal4(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={checkRoom2Solution}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-lg transition-all"
                  >
                    校準人性鏡像天平 (Balance)
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROOM 3: ULTIMATE COMPASS ALIGNMENT                        */}
        {/* ========================================================= */}
        {activeRoom === 'room3' && (
          <div className="space-y-6 text-left">
            <button 
              onClick={() => setActiveRoom('hub')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-extrabold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> 返回偵探地圖
            </button>

            <div className="bg-slate-900/80 border-2 border-indigo-600/50 rounded-3xl p-6 space-y-6 shadow-xl">
              
              <div className="flex justify-between items-center border-b border-indigo-800/40 pb-4">
                <div>
                  <h2 className="text-lg font-black text-indigo-300 flex items-center gap-2">
                    <span>🧭 密室 03：鐘樓密室 —— 三位石匠與終極航向羅盤</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    案情背景：三位石匠各自看重不同的生命目標。第三位石匠尋找的是「至善與終極使命」。
                  </p>
                </div>
                {room3Solved && (
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/50">
                    ✓ 已成功解密
                  </span>
                )}
              </div>

              <div className="bg-black/60 border-2 border-indigo-700/60 rounded-3xl p-8 text-center space-y-6">
                
                <p className="text-xs text-indigo-200/80 font-bold">
                  🧭 點擊旋轉按鈕，將古銅羅盤的指針旋轉對準正北方「0° / N (終極至善與使命)」！
                </p>

                {/* Compass Visual */}
                <div className="relative w-48 h-48 mx-auto bg-indigo-950/80 rounded-full border-4 border-indigo-500 flex items-center justify-center shadow-inner">
                  
                  {/* Cardinal Points */}
                  <span className="absolute top-2 font-black text-xs text-amber-300">N (至善)</span>
                  <span className="absolute right-3 font-black text-xs text-slate-400">E (生計)</span>
                  <span className="absolute bottom-2 font-black text-xs text-slate-400">S (名利)</span>
                  <span className="absolute left-3 font-black text-xs text-slate-400">W (責任)</span>

                  {/* Rotatable Needle */}
                  <div 
                    className="w-1.5 h-36 bg-gradient-to-t from-slate-400 via-amber-400 to-amber-300 rounded-full transition-transform duration-500 shadow-md"
                    style={{ transform: `rotate(${compassAngle}deg)` }}
                  />

                  <div className="absolute w-6 h-6 bg-amber-400 rounded-full border-2 border-amber-100 shadow-md flex items-center justify-center text-[10px] font-black text-slate-900">
                    {compassAngle}°
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => rotateCompass(-45)}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-indigo-200 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    ↺ 逆時針 45°
                  </button>

                  <button
                    onClick={checkRoom3Solution}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-lg"
                  >
                    對準終極航向 (Align)
                  </button>

                  <button
                    onClick={() => rotateCompass(45)}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-indigo-200 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    ↻ 順時針 45°
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROOM 4: TROLLEY VALUE RAIL SWITCH                         */}
        {/* ========================================================= */}
        {activeRoom === 'room4' && (
          <div className="space-y-6 text-left">
            <button 
              onClick={() => setActiveRoom('hub')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-extrabold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> 返回偵探地圖
            </button>

            <div className="bg-slate-900/80 border-2 border-rose-600/50 rounded-3xl p-6 space-y-6 shadow-xl">
              
              <div className="flex justify-between items-center border-b border-rose-800/40 pb-4">
                <div>
                  <h2 className="text-lg font-black text-rose-300 flex items-center gap-2">
                    <span>🚃 密室 04：命運車站 —— 電車難題與道德切換閘門</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    案情背景：面對複雜的道德抉擇與價值困境，拉動機械槓桿切換至良善軌道。
                  </p>
                </div>
                {room4Solved && (
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/50">
                    ✓ 已成功解密
                  </span>
                )}
              </div>

              <div className="bg-black/60 border-2 border-rose-700/60 rounded-3xl p-6 space-y-6">
                
                <p className="text-xs text-rose-200/80 font-bold text-center">
                  ⚙️ 點擊切換三個機械道德槓桿，將軌道指引至「尊重生命與利他實踐」！
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Lever 1 */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-rose-800/40 text-center space-y-3">
                    <h4 className="text-xs font-black text-rose-300">1. 價值澄清閘門</h4>
                    <p className="text-[11px] text-slate-400 font-medium">區分工具價值與內在終極價值</p>
                    <button
                      onClick={() => setLever1(!lever1)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        lever1 ? 'bg-emerald-600 text-white' : 'bg-rose-900/80 text-rose-200'
                      }`}
                    >
                      {lever1 ? '✓ ON (開啟內在價值)' : '✕ OFF (盲目跟風)'}
                    </button>
                  </div>

                  {/* Lever 2 */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-rose-800/40 text-center space-y-3">
                    <h4 className="text-xs font-black text-rose-300">2. 同理尊嚴閘門</h4>
                    <p className="text-[11px] text-slate-400 font-medium">將人視為目的，而非手段</p>
                    <button
                      onClick={() => setLever2(!lever2)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        lever2 ? 'bg-emerald-600 text-white' : 'bg-rose-900/80 text-rose-200'
                      }`}
                    >
                      {lever2 ? '✓ ON (尊重生命尊嚴)' : '✕ OFF (功利算計)'}
                    </button>
                  </div>

                  {/* Lever 3 */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-rose-800/40 text-center space-y-3">
                    <h4 className="text-xs font-black text-rose-300">3. 利他責任閘門</h4>
                    <p className="text-[11px] text-slate-400 font-medium">勇於承擔社會關懷與共好責任</p>
                    <button
                      onClick={() => setLever3(!lever3)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        lever3 ? 'bg-emerald-600 text-white' : 'bg-rose-900/80 text-rose-200'
                      }`}
                    >
                      {lever3 ? '✓ ON (勇於承擔共好)' : '✕ OFF (冷漠旁觀)'}
                    </button>
                  </div>

                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={checkRoom4Solution}
                    className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-lg"
                  >
                    切換道德軌道 (Switch Rails)
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VAULT: HAPPINESS VAULT UNLOCKING CEREMONY                 */}
        {/* ========================================================= */}
        {activeRoom === 'vault' && (
          <div className="space-y-6 text-center">
            <button 
              onClick={() => setActiveRoom('hub')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-extrabold rounded-xl flex items-center gap-1 cursor-pointer mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> 返回偵探地圖
            </button>

            <div className="bg-gradient-to-br from-amber-950/80 via-slate-900 to-black border-2 border-amber-500/60 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-5xl">🏛️</span>
                <h2 className="text-xl font-black text-amber-300">幸福聖殿大門 (The Vault of Happiness)</h2>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  將五把幸福鑰匙插入金光鑰匙孔，啟動開門儀式，覺醒專屬於你的生命英雄！
                </p>
              </div>

              {/* Action Pledge Input */}
              <div className="max-w-md mx-auto bg-black/60 p-4 rounded-2xl border border-amber-500/40 text-left space-y-2">
                <label className="text-xs font-black text-amber-300 block">✨ 寫下你的幸福實踐誓言：</label>
                <input
                  type="text"
                  value={actionPledge}
                  onChange={(e) => setActionPledge(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs font-bold p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                  placeholder="例如：每天給身邊朋友一個誠摯的微笑與感謝"
                />
              </div>

              {/* 5 Keyholes */}
              <div className="flex justify-center gap-4 my-6">
                {[
                  { name: '智慧之匙', unlocked: unlockedKeys.key1 },
                  { name: '同理之匙', unlocked: unlockedKeys.key2 },
                  { name: '勇氣之匙', unlocked: unlockedKeys.key3 },
                  { name: '責任之匙', unlocked: unlockedKeys.key4 },
                  { name: '靈性之匙', unlocked: unlockedKeys.key5 }
                ].map((k, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className={`w-12 h-16 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                      k.unlocked 
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-600'
                    }`}>
                      {k.unlocked ? '🗝️' : '🔒'}
                    </div>
                    <span className="text-[10px] font-black text-amber-200/80">{k.name}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleOpenVault}
                className="px-10 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-base rounded-2xl shadow-2xl cursor-pointer active:scale-95 transition-all"
              >
                ✨ 轉動鑰匙・解鎖幸福之門
              </button>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SOLVED STATE: VICTORY CASE FILE & SSR HERO CARD            */}
        {/* ========================================================= */}
        {activeRoom === 'solved' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="bg-gradient-to-br from-amber-950/90 via-slate-900 to-black border-4 border-amber-400/80 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 animate-bounce" />
                ))}
              </div>

              <span className="inline-block text-xs font-black bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full shadow-md">
                🏆 霧都懸案完全破譯・傳說級 SSR 結案檔案
              </span>

              <div className="text-7xl my-2 animate-pulse">🌟</div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-amber-300">
                  生命大解密者 (Master of Life Mysteries)
                </h2>
                <p className="text-xs text-amber-200/80 font-bold">
                  「穿透盲點，擁抱同理，航向至善，做生命的主人！」
                </p>
              </div>

              <div className="bg-black/60 border border-amber-500/40 p-4 rounded-2xl max-w-md mx-auto text-left space-y-2">
                <h4 className="text-xs font-black text-amber-400 flex items-center gap-1">
                  <span>📜 你的幸福行動誓言：</span>
                </h4>
                <p className="text-xs text-slate-200 font-bold bg-slate-900 p-3 rounded-xl border border-amber-500/30 leading-relaxed">
                  「{actionPledge}」
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveRoom('hub');
                    showToast('🔄 已重置並返回偵探大廳！');
                  }}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  重新探索密室
                </button>

                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-8 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-md"
                  >
                    完成並返回課程地圖
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
}
