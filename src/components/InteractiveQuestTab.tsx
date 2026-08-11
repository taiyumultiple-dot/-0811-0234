/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Gamepad2, 
  Users, 
  Check, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Heart, 
  Tv, 
  ClipboardList, 
  Send, 
  RefreshCw, 
  ArrowLeft, 
  Smile, 
  Play, 
  Timer,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Map,
  Scale,
  Compass,
  Link as LinkIcon,
  MessageSquare,
  Star,
  Wand2
} from 'lucide-react';

import charKehuaImg from '../assets/images/characters/char_kehua.jpg';
import charBojunImg from '../assets/images/characters/char_bojun.jpg';
import charXiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import charXiaopingImg from '../assets/images/characters/char_xiaoping.jpg';
import charDadImg from '../assets/images/characters/char_dad.jpg';
import charGrandpaImg from '../assets/images/characters/char_grandpa.jpg';

import {
  game01Banner,
  game02Banner,
  game03Banner,
  game04Banner,
  game05Banner,
  game06Banner,
  game07Banner,
  game08Banner,
  game09Banner,
  game10Banner,
  puzzleMapBg,
  gameIcon01,
  gameIcon03,
  gameIcon04,
  gameIcon05,
  gameIcon06,
  gameIcon07,
  gameIcon08,
  gameIcon09,
  gameIcon10,
  lobbyHero,
  lobbyFloral,
  badgeHero,
  badgeSibian,
  badgeTongli,
  badgeYongqi,
  badgeGanen,
  badgeShengming,
  badgeRecommendTask,
} from '../assets/images/game-banners';
import CharacterStoryTab from './CharacterStoryTab';
import LifeCompassGame from './LifeCompassGame';
import CollapsibleSection from './CollapsibleSection';
import LondonMysteriesGame from './LondonMysteriesGame';
import MindLabyrinthGame from './MindLabyrinthGame';

const GAME_BANNER_IMAGES: Record<number, string> = {
  1: game01Banner,
  2: game02Banner,
  3: game03Banner,
  4: game04Banner,
  5: game05Banner,
  6: game06Banner,
  7: game07Banner,
  8: game08Banner,
  9: game09Banner,
  10: game10Banner,
};

interface InteractiveQuestTabProps {
  currentStudent: any;
  onSaveQuest: (studentId: string, questType: any, data: any) => void;
  role: string;
  submissions: any[];
  onSaveQuestFeedback: (studentId: string, questType: string, feedback: any) => void;
  defaultQuest?: string;
  defaultGameId?: number;
}

const GAMES: any[] = [];

const GAME_ICON_IMAGES: Record<number, string> = {
  1: gameIcon01,
  2: puzzleMapBg,
  3: gameIcon03,
  4: gameIcon04,
  5: gameIcon05,
  6: gameIcon06,
  7: gameIcon07,
  8: gameIcon08,
  9: gameIcon09,
  10: gameIcon10,
};

const BADGE_ARTWORK: Record<string, string> = {
  '思辨達人': badgeSibian,
  '同理之心': badgeTongli,
  '勇氣前行': badgeYongqi,
  '感恩之光': badgeGanen,
  '生命探索家': badgeShengming,
};

const renderGameIllustration = (gameId: number) => (
  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#EAD5C3] bg-[#FFFDF9] select-none flex items-center justify-center p-1 shadow-2xs">
    <img src={GAME_ICON_IMAGES[gameId]} alt="" className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105" />
  </div>
);

const PUZZLE_THEMES = [
  { key: '哲學思考', emoji: '🧠', desc: '學習提問與思辨，品嚐思考的樂趣', fullDesc: '🧠 【哲學思考】引導我們對事物進行深刻的發問，澄清概念，發展獨立判斷與思辨能力。', mismatchHint: '💡 提示：這個主題比較偏向「探討思考、邏輯與思辨的樂趣」喔！請試著放入「哲學思考」！', color: 'sky' },
  { key: '人學探索', emoji: '🧑', desc: '認識人與自我，漫步奇幻的旅程', fullDesc: '🧑 【人學探索】探索「人是誰」的根本問題，明白生命的神聖尊嚴與豐富可能性。', mismatchHint: '💡 提示：這個主題是在「認識自我與他人互動、探索我是誰」喔！請試著放入「人學探索」！', color: 'green' },
  { key: '終極關懷', emoji: '💜', desc: '思考生命意義，旅程中的神奇羅盤', fullDesc: '💜 【終極關懷】面對人生的有限，思索終極意義，學習生死關懷與悲傷輔導。', mismatchHint: '💡 提示：這個主題比較偏向「思考生死價值、生命有限與終極意義」喔！請試著放入「終極關懷」！', color: 'violet' },
  { key: '價值思辨', emoji: '⚖️', desc: '掌握智慧方向盤，思辨道德的選擇', fullDesc: '⚖️ 【價值思辨】在多元價值的社會中學會客觀衡量，做出良善與負責任的道德選擇。', mismatchHint: '💡 提示：這個主題是關於「思辨多元道德情境、做出合理選擇」喔！請試著放入「價值思辨」！', color: 'amber' },
  { key: '靈性修養', emoji: '🌸', desc: '開啟心靈超能量，培養內在人格統整', fullDesc: '🌸 【靈性修養】整合身心靈，培養卓越的人格，散發生命的內在人格光輝。', mismatchHint: '💡 提示：這個主題是關於「整合身心靈、修養內在力量與卓越人格」喔！請試著放入「靈性修養」！', color: 'rose' },
];
const PUZZLE_STYLES: Record<string, string> = {
  sky: 'bg-sky-50 border-sky-300 text-sky-700',
  green: 'bg-emerald-50 border-emerald-300 text-emerald-700',
  violet: 'bg-violet-50 border-violet-300 text-violet-700',
  amber: 'bg-amber-50 border-amber-300 text-amber-700',
  rose: 'bg-rose-50 border-rose-300 text-rose-700',
};

const PUZZLE_CHIP_HEX: Record<string, string> = {
  sky: '#0284c7',
  green: '#059669',
  violet: '#7c3aed',
  amber: '#d97706',
  rose: '#e11d48',
};

// Small badge shaped like an actual jigsaw piece (rounded square with a tab
// bump on the right edge), used next to each theme card / completed pill.
const PuzzleBadge: React.FC<{ emoji: string; color: string; muted?: boolean; size?: number }> = ({ emoji, color, muted, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0" style={{ filter: muted ? 'grayscale(1) opacity(0.45)' : undefined }}>
    <path
      d="M12,4 H28 A4,4 0 0 1 32,8 V14 A6,6 0 1 1 32,26 V32 A4,4 0 0 1 28,36 H12 A4,4 0 0 1 8,32 V8 A4,4 0 0 1 12,4 Z"
      fill={PUZZLE_CHIP_HEX[color]}
    />
    <text x="20" y="25" textAnchor="middle" fontSize="16">{emoji}</text>
  </svg>
);

// The five pieces meet at a shared center point (320,230). Each of the four
// quadrant pieces has a quarter-circle "bite" (r=92) carved out of its
// inner corner, and a circular center piece (r=88) sits exactly in that gap.
const PUZZLE_PIECE_PATHS: Record<'TL' | 'TR' | 'BL' | 'BR', string> = {
  TL: 'M28,8 L300,8 A20,20 0 0 1 320,28 L320,138 A92,92 0 0 0 228,230 L28,230 A20,20 0 0 1 8,210 L8,28 A20,20 0 0 1 28,8 Z',
  TR: 'M612,8 A20,20 0 0 0 632,28 L632,210 A20,20 0 0 0 612,230 L412,230 A92,92 0 0 1 320,138 L320,28 A20,20 0 0 0 340,8 L612,8 Z',
  BL: 'M28,452 A20,20 0 0 0 8,432 L8,250 A20,20 0 0 0 28,230 L228,230 A92,92 0 0 1 320,322 L320,432 A20,20 0 0 0 300,452 L28,452 Z',
  BR: 'M612,452 L340,452 A20,20 0 0 1 320,432 L320,322 A92,92 0 0 0 412,230 L612,230 A20,20 0 0 1 632,250 L632,432 A20,20 0 0 1 612,452 Z',
};

const PUZZLE_SLOT: Record<string, 'TL' | 'TR' | 'CENTER' | 'BL' | 'BR'> = {
  '哲學思考': 'TL',
  '人學探索': 'TR',
  '終極關懷': 'CENTER',
  '價值思辨': 'BL',
  '靈性修養': 'BR',
};

const PUZZLE_LABEL_POS: Record<string, { x: number; y: number }> = {
  '哲學思考': { x: 130, y: 100 },
  '人學探索': { x: 505, y: 100 },
  '終極關懷': { x: 320, y: 230 },
  '價值思辨': { x: 130, y: 358 },
  '靈性修養': { x: 505, y: 358 },
};

const PuzzleBoard: React.FC<{
  placed: Record<string, boolean>;
  selectedCard: string | null;
  onDropTheme: (dropped: string, target: string) => void;
  onZoneClick: (zoneKey: string) => void;
}> = ({ placed, selectedCard, onDropTheme, onZoneClick }) => {
  const [hoverZone, setHoverZone] = useState<string | null>(null);

  const renderPiece = (themeKey: string) => {
    const theme = PUZZLE_THEMES.find((t) => t.key === themeKey)!;
    const slot = PUZZLE_SLOT[themeKey];
    const isPlaced = placed[themeKey];
    const isHover = hoverZone === themeKey;
    const isPending = !!selectedCard && !isPlaced;
    const pos = PUZZLE_LABEL_POS[themeKey];

    // Once placed, the piece becomes fully transparent with no outline, so the
    // real artwork (drawn once, beneath all pieces) shows through cleanly.
    const fill = isPlaced ? 'transparent' : isHover ? '#FFE7CE' : isPending ? '#FFF6EA' : '#FAF6F0';
    const stroke = isPlaced ? 'none' : isHover ? '#E65100' : isPending ? '#F5A15A' : '#E9D8C4';

    const shapeProps = {
      fill,
      stroke,
      strokeWidth: isPlaced ? 0 : 3,
      strokeDasharray: isPlaced ? undefined : '6 5',
      onDragOver: (e: React.DragEvent) => { e.preventDefault(); setHoverZone(themeKey); },
      onDragLeave: () => setHoverZone((z) => (z === themeKey ? null : z)),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setHoverZone(null);
        const dropped = e.dataTransfer.getData('text/plain');
        onDropTheme(dropped, themeKey);
      },
      onClick: () => onZoneClick(themeKey),
      style: { cursor: 'pointer', transition: 'fill 0.25s, stroke 0.25s' } as React.CSSProperties,
    };

    return (
      <g key={themeKey} className={isPending ? 'animate-pulse' : ''}>
        {slot === 'CENTER' ? (
          <circle cx={320} cy={230} r={88} {...shapeProps} />
        ) : (
          <path d={PUZZLE_PIECE_PATHS[slot]} {...shapeProps} />
        )}
        {/* Before a piece is placed, its artwork stays hidden and we show a "+" prompt instead */}
        {!isPlaced && (
          <>
            <text x={pos.x} y={pos.y - 6} textAnchor="middle" fontSize={24} style={{ pointerEvents: 'none' }}>
              {isPending ? '👇' : '➕'}
            </text>
            <text
              x={pos.x}
              y={pos.y + 22}
              textAnchor="middle"
              fontSize={15}
              fontWeight={900}
              fill={isPending ? '#E65100' : '#B9A88E'}
              style={{ pointerEvents: 'none' }}
            >
              {themeKey}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 640 460" className="w-full h-auto select-none">
      <defs>
        <clipPath id="puzzle-board-clip">
          <path d={PUZZLE_PIECE_PATHS.TL} />
          <path d={PUZZLE_PIECE_PATHS.TR} />
          <path d={PUZZLE_PIECE_PATHS.BL} />
          <path d={PUZZLE_PIECE_PATHS.BR} />
          <circle cx={320} cy={230} r={88} />
        </clipPath>
      </defs>

      {/* Real landscape artwork, drawn once beneath everything; unplaced pieces cover it with an opaque veil below */}
      <image href={puzzleMapBg} x={0} y={0} width={640} height={460} preserveAspectRatio="xMidYMid slice" />

      {/* Opaque veils for any piece not yet placed, hiding the artwork until the student places it correctly */}
      {PUZZLE_THEMES.filter((t) => !placed[t.key]).map((t) => {
        const slot = PUZZLE_SLOT[t.key];
        return slot === 'CENTER' ? (
          <circle key={`veil-${t.key}`} cx={320} cy={230} r={88} fill="#FAF6F0" style={{ pointerEvents: 'none' }} />
        ) : (
          <path key={`veil-${t.key}`} d={PUZZLE_PIECE_PATHS[slot]} fill="#FAF6F0" style={{ pointerEvents: 'none' }} />
        );
      })}

      {PUZZLE_THEMES.map((t) => renderPiece(t.key))}
    </svg>
  );
};

export default function InteractiveQuestTab({
  currentStudent,
  onSaveQuest,
  role,
  submissions,
  onSaveQuestFeedback,
  defaultQuest,
  defaultGameId
}: InteractiveQuestTabProps) {
  
  const [activeGameId, setActiveGameId] = useState<number | null>(defaultGameId || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOriginSettings, setShowOriginSettings] = useState<boolean>(false);
  const [customOrigin, setCustomOrigin] = useState(() => {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
        return 'https://ais-pre-ex3ms6a5r7cieaa7qg5cyl-72799407197.asia-northeast1.run.app';
      }
      return currentOrigin;
    }
    return 'https://ais-pre-ex3ms6a5r7cieaa7qg5cyl-72799407197.asia-northeast1.run.app';
  });
  
  const [localRole, setLocalRole] = useState<string>(role);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setLocalRole(role);
  }, [role]);

  // Synchronized Game State (Teacher Dashboard & Classroom Projection & Students)
  const [gameMode, setGameMode] = useState<'individual' | 'team' | 'class'>('individual');
  const [teamSizes, setTeamSizes] = useState<Record<string, number>>({
    xiaoping: 8,
    bojun: 8,
    kehua: 8,
    xiaowen: 8,
  });
  const [projectionEnabled, setProjectionEnabled] = useState<boolean>(true);
  const [randomModeEnabled, setRandomModeEnabled] = useState<boolean>(true);
  const [timerPerQuestion, setTimerPerQuestion] = useState<number>(30);

  // Poll state from server to maintain real-time sync across all pages/devices
  useEffect(() => {
    let isMounted = true;
    
    const fetchState = () => {
      fetch('/api/state')
        .then(res => res.json())
        .then(data => {
          if (!isMounted) return;
          if (data && data.interactiveQuestState) {
            const qState = data.interactiveQuestState;
            if (qState.gameMode) setGameMode(qState.gameMode);
            if (qState.teamSizes) setTeamSizes(qState.teamSizes);
            if (qState.projectionEnabled !== undefined) setProjectionEnabled(qState.projectionEnabled);
            if (qState.randomModeEnabled !== undefined) setRandomModeEnabled(qState.randomModeEnabled);
            if (qState.timerPerQuestion !== undefined) setTimerPerQuestion(qState.timerPerQuestion);
          }
        })
        .catch(err => console.error("Failed to fetch interactive quest state:", err));
    };

    fetchState();
    const interval = setInterval(fetchState, 3500); // Poll every 3.5 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Sync state helper to persist on the server instantly
  const handleUpdateQuestState = (updates: {
    gameMode?: 'individual' | 'team' | 'class';
    teamSizes?: Record<string, number>;
    projectionEnabled?: boolean;
    randomModeEnabled?: boolean;
    timerPerQuestion?: number;
  }) => {
    const nextGameMode = updates.gameMode !== undefined ? updates.gameMode : gameMode;
    const nextTeamSizes = updates.teamSizes !== undefined ? updates.teamSizes : teamSizes;
    const nextProjectionEnabled = updates.projectionEnabled !== undefined ? updates.projectionEnabled : projectionEnabled;
    const nextRandomModeEnabled = updates.randomModeEnabled !== undefined ? updates.randomModeEnabled : randomModeEnabled;
    const nextTimerPerQuestion = updates.timerPerQuestion !== undefined ? updates.timerPerQuestion : timerPerQuestion;

    if (updates.gameMode !== undefined) setGameMode(updates.gameMode);
    if (updates.teamSizes !== undefined) setTeamSizes(updates.teamSizes);
    if (updates.projectionEnabled !== undefined) setProjectionEnabled(updates.projectionEnabled);
    if (updates.randomModeEnabled !== undefined) setRandomModeEnabled(updates.randomModeEnabled);
    if (updates.timerPerQuestion !== undefined) setTimerPerQuestion(updates.timerPerQuestion);

    fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interactiveQuestState: {
          gameMode: nextGameMode,
          teamSizes: nextTeamSizes,
          projectionEnabled: nextProjectionEnabled,
          randomModeEnabled: nextRandomModeEnabled,
          timerPerQuestion: nextTimerPerQuestion,
        }
      })
    })
    .catch(err => console.error("Failed to sync interactive quest state to server:", err));
  };

  useEffect(() => {
    if (defaultGameId) {
      setActiveGameId(defaultGameId);
    }
  }, [defaultGameId]);

  // Dynamic class code that is different every time or can be refreshed
  const [classCode, setClassCode] = useState<string>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('taiyu_life_class_code') : null;
    if (saved) return saved;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('taiyu_life_class_code', code);
    }
    return code;
  });

  const handleRefreshClassCode = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setClassCode(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('taiyu_life_class_code', code);
    }
    showToast('🎲 已產生全新班級互動代碼！');
  };

  const cleanPathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const baseOrigin = customOrigin.replace(/\/$/, ''); // remove trailing slash if any
  const joinUrl = `${baseOrigin}${cleanPathname}?tab=互動遊戲&join=${classCode}`;

  useEffect(() => {
    if (activeGameId === null && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        joinUrl,
        {
          width: 110,
          margin: 1.5,
          color: {
            dark: '#4A321F',
            light: '#FFFFFF'
          }
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
        }
      );
    }
  }, [joinUrl, activeGameId, localRole]);

  // Link copy with clipboard support
  const [copiedLink, setCopiedLink] = useState(false);
  const handleCopyLink = () => {
    const copyText = joinUrl;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyText)
        .then(() => {
          setCopiedLink(true);
          showToast('🔗 已複製班級互動連結，快分享給同學們吧！');
          setTimeout(() => setCopiedLink(false), 2000);
        })
        .catch(() => {
          fallbackCopyText(copyText);
        });
    } else {
      fallbackCopyText(copyText);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedLink(true);
      showToast('🔗 已複製班級互動連結，快分享給同學們吧！');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      showToast('❌ 複製失敗，請手動複製瀏覽器網址！');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist a game's result onto the current student's submission record,
  // so teachers can see it in 學習統計 / 成長表單 review.
  const saveGameResult = (gameKey: string, data: any) => {
    if (currentStudent?.studentId) {
      onSaveQuest(currentStudent.studentId, `game_${gameKey}`, data);
    }
  };

  // ----------------------------------------------------
  // GAME STATE 1: 幸福導航｜生命地圖啟程
  // 大廳地圖 + 5 個真互動任務關卡(取代先前的截圖demo,這裡全部是真的遊戲邏輯)
  // 任務1 打破幸福公式 / 任務2 一分鐘蒼蠅挑戰(真倒數) / 任務3 重要與必要 / 任務4 自我探索站 / 任務5(關卡) 幸福之門
  // ----------------------------------------------------
  type LifeKeyId = '哲學思考' | '人學探索' | '終極關懷' | '價值思辨' | '靈性修養';
  type G1Stage = 'lobby' | 'task1' | 'task2' | 'task3' | 'task4' | 'gate' | 'summon' | 'result';
  type G1TaskId = 'task1' | 'task2' | 'task3' | 'task4' | 'gate';

  const [g1GameMode, setG1GameMode] = useState<'mind' | 'london' | 'classic'>('mind');
  const [g1Stage, setG1Stage] = useState<G1Stage>('lobby');
  const [g1Done, setG1Done] = useState<Record<G1TaskId, boolean>>({ task1: false, task2: false, task3: false, task4: false, gate: false });

  // 任務1：打破幸福公式（點選候補詞卡加入你的幸福路徑）
  const TASK1_POOL = ['健康', '家人', '興趣', '朋友', '自由', '意義', '成長', '幫助他人'];
  const [g1Path, setG1Path] = useState<string[]>([]);

  // 任務2：一分鐘蒼蠅挑戰（真的 60 秒倒數 + 5 選 + 分類）
  const TASK2_POOL = ['陪伴家人', '完成作業', '滑手機', '向朋友道歉', '幫助別人', '運動', '吃飯', '睡覺', '說出心裡話', '完成想做的事'];
  const TASK2_CATS = ['重要', '必要', '兩者都是', '依情境而定'];
  const [g1FlyPhase, setG1FlyPhase] = useState<'pick' | 'classify'>('pick');
  const [g1FlySelected, setG1FlySelected] = useState<string[]>([]);
  const [g1FlyClassify, setG1FlyClassify] = useState<Record<string, string>>({});
  const [g1FlyTimer, setG1FlyTimer] = useState(60);

  // 任務3：重要與必要（點卡片再點分類區）
  const TASK3_POOL = ['完成作業', '運動', '維持友誼', '賺取生活費', '探索興趣', '幫助別人'];
  const TASK3_ZONES = ['重要', '必要', '兩者都是', '依情境而定'];
  const [g1SortPicked, setG1SortPicked] = useState<string | null>(null);
  const [g1SortResult, setG1SortResult] = useState<Record<string, string>>({});

  // 任務4：自我探索站（三欄多選，即時組成探索宣言）
  const TASK4_COL1 = ['好奇', '堅持', '敏感', '溫暖', '獨立', '樂觀'];
  const TASK4_COL2 = ['家人', '朋友', '學校', '社會文化', '過去經驗', '個人選擇'];
  const TASK4_COL3 = ['有能力的人', '能關心他人的人', '勇於追求理想的人', '能獨立思考的人', '能面對挫折的人', '能活出自己的人'];
  const [g1DeclareCols, setG1DeclareCols] = useState<{ col1: string[]; col2: string[]; col3: string[] }>({ col1: [], col2: [], col3: [] });

  // 幸福之門：選一個願意實踐的行動
  const GATE_ACTIONS = ['向一個人表達感謝', '主動幫助一個人', '花五分鐘專心感受生活', '記錄今天最重要的一件事', '完成一個小步驟', '寫下想培養的習慣'];
  const [g1GateAction, setG1GateAction] = useState<string | null>(null);

  // 60 秒真倒數計時器
  useEffect(() => {
    if (g1Stage === 'task2' && g1FlyPhase === 'pick' && g1FlyTimer > 0) {
      const timer = setTimeout(() => setG1FlyTimer(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (g1Stage === 'task2' && g1FlyPhase === 'pick' && g1FlyTimer === 0 && g1FlySelected.length > 0) {
      setG1FlyPhase('classify');
    }
  }, [g1Stage, g1FlyPhase, g1FlyTimer, g1FlySelected.length]);

  const KEY_ORDER: LifeKeyId[] = ['哲學思考', '人學探索', '終極關懷', '價值思辨', '靈性修養'];

  const KEY_ARCHETYPES: Record<LifeKeyId, {
    name: string; emoji: string; tagline: string; desc: string; unitDesc: string;
    from: string; to: string; ring: string; chip: string;
  }> = {
    '哲學思考': {
      name: '智者', emoji: '🔭', tagline: '追根究柢的真理探求者',
      desc: '你習慣停下來多想一步，不急著把「大家都這樣走」的路當成唯一答案。你相信，想清楚「為什麼」比急著「做什麼」更重要。',
      unitDesc: '善用批判思考的能力，練習理性與邏輯的思辨方法。',
      from: '#F5F3FF', to: '#EDE9FE', ring: 'border-violet-300 text-violet-700', chip: 'bg-violet-100 text-violet-700'
    },
    '人學探索': {
      name: '觀察家', emoji: '👁️', tagline: '細膩看見人我之間的探索者',
      desc: '你擅長從關係與經驗裡認識自己，也願意花時間去理解身邊的人。對你來說，「我是誰」的答案，往往藏在人與人之間。',
      unitDesc: '在你我他交織的生命網絡中，持續探索自我與他人的連結。',
      from: '#F0FDF4', to: '#DCFCE7', ring: 'border-emerald-300 text-emerald-700', chip: 'bg-emerald-100 text-emerald-700'
    },
    '終極關懷': {
      name: '療癒者', emoji: '🌙', tagline: '溫柔面對生死與意義的人',
      desc: '你對生命的有限特別有感，也因此更珍惜眼前重要的人。你相信，好好道謝、好好陪伴，才是不留遺憾的關鍵。',
      unitDesc: '練習用愛與勇氣，陪自己也陪別人面對生命的課題。',
      from: '#EEF2FF', to: '#E0E7FF', ring: 'border-indigo-300 text-indigo-700', chip: 'bg-indigo-100 text-indigo-700'
    },
    '價值思辨': {
      name: '戰略家', emoji: '♟️', tagline: '在兩難之中做出抉擇的思辨者',
      desc: '你不會盲目跟隨單一的「成功公式」，習慣把不同的選項攤開來比較，想清楚自己真正相信的價值排序。',
      unitDesc: '在辯證與挑戰之中，練習真理越辯越明的智慧。',
      from: '#FEF2F2', to: '#FEE2E2', ring: 'border-red-300 text-red-700', chip: 'bg-red-100 text-red-700'
    },
    '靈性修養': {
      name: '修行者', emoji: '🕊️', tagline: '安頓內心、持續成長的人',
      desc: '你重視與自己獨處的時刻，不急著用忙碌填滿生活。對你而言，內心的安定，是幸福最重要的地基。',
      unitDesc: '透過覺察與內省，持續探索內在的成長與卓越。',
      from: '#FDF2F8', to: '#FCE7F3', ring: 'border-pink-300 text-pink-700', chip: 'bg-pink-100 text-pink-700'
    },
  };

  // ---- 任務1 邏輯 ----
  const toggleTask1Item = (item: string) => {
    setG1Path(prev => {
      if (prev.includes(item)) return prev.filter(x => x !== item);
      if (prev.length >= 5) { showToast('⭐ 路徑最多放 5 個元素，先移除一個再加入新的吧'); return prev; }
      return [...prev, item];
    });
  };
  const finishTask1 = () => {
    if (g1Path.length < 3) { showToast('🧭 至少選 3 個元素，設計出屬於你的幸福路徑吧'); return; }
    setG1Done(prev => ({ ...prev, task1: true }));
    showToast('🔑 完成「打破幸福公式」，獲得哲學思考鑰匙！');
    setG1Stage('lobby');
  };

  // ---- 任務2 邏輯 ----
  const toggleFlySelect = (item: string) => {
    if (g1FlyPhase !== 'pick') return;
    setG1FlySelected(prev => {
      if (prev.includes(item)) return prev.filter(x => x !== item);
      if (prev.length >= 5) { showToast('⏰ 已經選滿 5 件事囉'); return prev; }
      return [...prev, item];
    });
  };
  const classifyFlyItem = (item: string, cat: string) => {
    setG1FlyClassify(prev => ({ ...prev, [item]: cat }));
  };
  const finishTask2 = () => {
    if (Object.keys(g1FlyClassify).length < g1FlySelected.length || g1FlySelected.length === 0) {
      showToast('💭 請為每一件選中的事完成分類'); return;
    }
    setG1Done(prev => ({ ...prev, task2: true }));
    showToast('🔑 完成「一分鐘蒼蠅挑戰」，獲得終極關懷鑰匙！');
    setG1Stage('lobby');
  };

  // ---- 任務3 邏輯 ----
  const pickTask3Card = (card: string) => {
    setG1SortPicked(card);
    showToast('🖐️ 拿起「' + card + '」，點選要放入的分類區');
  };
  const dropTask3Zone = (zone: string) => {
    if (!g1SortPicked) { showToast('請先點選下方一張卡片'); return; }
    setG1SortResult(prev => ({ ...prev, [g1SortPicked!]: zone }));
    setG1SortPicked(null);
  };
  const finishTask3 = () => {
    if (Object.keys(g1SortResult).length < TASK3_POOL.length) { showToast('⚖️ 還有卡片尚未分類完成'); return; }
    setG1Done(prev => ({ ...prev, task3: true }));
    showToast('🔑 完成「重要與必要」，獲得價值思辨鑰匙！');
    setG1Stage('lobby');
  };

  // ---- 任務4 邏輯 ----
  const toggleDeclareChip = (col: 'col1' | 'col2' | 'col3', item: string) => {
    setG1DeclareCols(prev => {
      const arr = prev[col];
      const next = arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
      return { ...prev, [col]: next };
    });
  };
  const finishTask4 = () => {
    const total = g1DeclareCols.col1.length + g1DeclareCols.col2.length + g1DeclareCols.col3.length;
    if (total < 3) { showToast('🪞 三個欄位都至少選一個，才能完成探索喔'); return; }
    setG1Done(prev => ({ ...prev, task4: true }));
    showToast('🔑 完成「自我探索站」，獲得人學探索鑰匙！');
    setG1Stage('lobby');
  };

  // ---- 幸福之門 ----
  const enterGate = () => {
    if (!g1Done.task1 || !g1Done.task2 || !g1Done.task3 || !g1Done.task4) {
      showToast('🔒 幸福之門還沒開啟，先完成前面 4 項任務吧！');
      return;
    }
    setG1Stage('gate');
  };
  const finishGate = () => {
    if (!g1GateAction) { showToast('💫 先選出一個你願意實踐的行動'); return; }
    setG1Done(prev => ({ ...prev, gate: true }));
    setG1Stage('summon');
  };

  const getKeyScores = (): Record<LifeKeyId, number> => {
    const importantCount = Object.values(g1FlyClassify).filter(c => c === '重要').length;
    const nuancedCount = Object.values(g1SortResult).filter(c => c === '依情境而定' || c === '兩者都是').length;
    const declareTotal = g1DeclareCols.col1.length + g1DeclareCols.col2.length + g1DeclareCols.col3.length;
    return {
      '哲學思考': g1Path.length,
      '終極關懷': importantCount * 1.5,
      '價值思辨': nuancedCount * 1.5 + Object.keys(g1SortResult).length * 0.5,
      '人學探索': declareTotal,
      '靈性修養': g1GateAction ? 5 : 0,
    };
  };

  const getTopKey = (): LifeKeyId => {
    const scores = getKeyScores();
    let top: LifeKeyId = KEY_ORDER[0];
    let max = -1;
    KEY_ORDER.forEach(k => { if (scores[k] > max) { max = scores[k]; top = k; } });
    return top;
  };

  const getAwarenessIndex = (): number => {
    if (g1FlySelected.length === 0) return 0;
    const importantCount = Object.values(g1FlyClassify).filter(c => c === '重要').length;
    return Math.round((importantCount / g1FlySelected.length) * 100);
  };

  const revealG1Result = () => {
    const scores = getKeyScores();
    const topKey = getTopKey();
    const awareness = getAwarenessIndex();
    saveGameResult('mbti', {
      path: g1Path,
      flySelected: g1FlySelected,
      flyClassify: g1FlyClassify,
      sortResult: g1SortResult,
      declareCols: g1DeclareCols,
      gateAction: g1GateAction,
      keyScores: scores,
      topKey,
      topKeyLabel: topKey,
      awarenessIndex: awareness,
      allDone: true,
    });
    setG1Stage('result');
    showToast('🎉 你的生命英雄已經覺醒！');
  };

  const resetG1 = () => {
    setG1Stage('lobby');
    setG1Done({ task1: false, task2: false, task3: false, task4: false, gate: false });
    setG1Path([]);
    setG1FlyPhase('pick');
    setG1FlySelected([]);
    setG1FlyClassify({});
    setG1FlyTimer(60);
    setG1SortPicked(null);
    setG1SortResult({});
    setG1DeclareCols({ col1: [], col2: [], col3: [] });
    setG1GateAction(null);
  };

  const g1DoneCount = ['task1', 'task2', 'task3', 'task4'].filter(k => g1Done[k as G1TaskId]).length;
  const g1KeyCount = (['task1', 'task2', 'task3', 'task4', 'gate'] as G1TaskId[]).filter(k => g1Done[k]).length;

  // ----------------------------------------------------
  // GAME STATE 2: LIFE PUZZLE MAP
  // ----------------------------------------------------
  const [puzzlePlaced, setPuzzlePlaced] = useState<Record<string, boolean>>({
    '哲學思考': false,
    '人學探索': false,
    '終極關懷': false,
    '價值思辨': false,
    '靈性修養': false
  });
  const [selectedPuzzleCard, setSelectedPuzzleCard] = useState<string | null>(null);

  const handlePlacePuzzle = (themeKey: string) => {
    const nextPlaced = { ...puzzlePlaced, [themeKey]: true };
    setPuzzlePlaced(nextPlaced);
    setSelectedPuzzleCard(null);
    showToast(`🧩 成功將「${themeKey}」放置到地圖上！`);
    saveGameResult('puzzle', { placed: nextPlaced });
  };

  const handleZoneClick = (themeKey: string) => {
    if (!selectedPuzzleCard) {
      showToast('💡 請先點擊左側「主題拼圖卡」，再點擊對應的地圖空格！');
      return;
    }
    if (selectedPuzzleCard === themeKey) {
      handlePlacePuzzle(themeKey);
    } else {
      showToast(`❌ 放錯位置囉！「${selectedPuzzleCard}」不應該放在這裡，請再想想看！`);
    }
  };

  const resetPuzzle = () => {
    const cleared = {
      '哲學思考': false,
      '人學探索': false,
      '終極關懷': false,
      '價值思辨': false,
      '靈性修養': false
    };
    setPuzzlePlaced(cleared);
    setSelectedPuzzleCard(null);
    saveGameResult('puzzle', { placed: cleared });
    showToast('🔄 拼圖地圖已重置！');
  };

  // ----------------------------------------------------
  // GAME STATE 3: SCENARIO ADVENTURE
  // ----------------------------------------------------
  const [adventureStage, setAdventureStage] = useState(0);
  const [adventurePoints, setAdventurePoints] = useState({ 同理: 10, 責任: 10, 勇氣: 10 });
  const [adventureChoices, setAdventureChoices] = useState<Record<number, number>>({});
  
  const adventureScenarios = [
    {
      title: '校園小衝突',
      story: '下課時，博鈞不小心撞倒了小文正在整理的書本，兩人起了口角，周圍同學都在圍觀。此時你會？',
      options: [
        { text: '上前打圓場，請兩人先冷靜下來再說。', points: { 責任: 6, 同理: 6, 勇氣: 5 } },
        { text: '幫忙把散落的書撿起來，緩和現場氣氛。', points: { 責任: 4, 同理: 8, 勇氣: 2 } },
        { text: '站在旁邊看，等吵完再決定要不要幫忙。', points: { 責任: -2, 同理: -2, 勇氣: -3 } },
        { text: '去找老師來處理這件事。', points: { 責任: 8, 同理: 2, 勇氣: 4 } },
      ],
    },
    {
      title: '朋友被誤會時',
      story: '小文在美術課時不小心打翻了顏料，老師以為是曉萍弄髒了桌子，語氣有點嚴厲。曉萍急著解釋，但大家似乎都沒有聽到她說的話。此時你會？',
      options: [
        { text: '立刻替曉萍解釋，告訴大家真相。', points: { 責任: 8, 同理: 6, 勇氣: 7 } },
        { text: '默默觀察，等別人發現真相。', points: { 責任: -3, 同理: -1, 勇氣: -4 } },
        { text: '安慰曉萍，並和她一起想辦法。', points: { 責任: 4, 同理: 8, 勇氣: 3 } },
        { text: '不關我的事，先離開現場。', points: { 責任: -5, 同理: -5, 勇氣: -5 } },
      ],
    },
    {
      title: '考試作弊的誘惑',
      story: '快段考了，隔壁的好友博鈞因練球沒時間複習，偷偷把單字卡夾在筆袋下。你看見了，且他投來求助眼神。此時你會？',
      options: [
        { text: '假裝沒看見，專心寫自己的考卷。', points: { 責任: 5, 同理: 0, 勇氣: 0 } },
        { text: '以嚴肅眼神制止他，並在考後主動約他一起溫習。', points: { 責任: 8, 同理: 6, 勇氣: 8 } },
        { text: '偷偷在草稿紙上寫下提示傳給他，幫他度過難關。', points: { 責任: -5, 同理: 8, 勇氣: 2 } },
        { text: '在考後私下告訴老師，請老師適當關照博鈞。', points: { 責任: 10, 同理: 3, 勇氣: 6 } },
      ],
    },
    {
      title: '被排擠時的心情',
      story: '班上的小文性格內向、不擅言詞，分組時大家都不想跟他一組。小文一個人默默站在教室角落，看起來非常失落。此時你會？',
      options: [
        { text: '主動走過去邀請小文加入我們小組。', points: { 同理: 10, 勇氣: 8, 責任: 5 } },
        { text: '跟組員討論看看，看大家願不願意接納他。', points: { 同理: 6, 勇氣: 3, 責任: 4 } },
        { text: '裝作很忙不關我的事，畢竟我也怕得罪其他人。', points: { 同理: -4, 勇氣: -2, 責任: 0 } },
        { text: '私下傳訊息鼓勵小文，讓他知道有人在乎他。', points: { 同理: 8, 勇氣: 4, 責任: 3 } },
      ],
    },
    {
      title: '拾到錢包時',
      story: '放學路上，你在樓梯間撿到一個錢包，裡面有現金跟學生證。四下無人，只有你知道這件事。此時你會？',
      options: [
        { text: '立刻拿去交給學務處，請他們幫忙聯絡失主。', points: { 責任: 10, 同理: 6, 勇氣: 5 } },
        { text: '直接聯絡學生證上的同學，親自歸還。', points: { 責任: 8, 同理: 8, 勇氣: 6 } },
        { text: '猶豫了一下，但最後還是決定上交。', points: { 責任: 6, 同理: 4, 勇氣: 3 } },
        { text: '想著反正沒人看到，把現金留下來。', points: { 責任: -10, 同理: -5, 勇氣: -5 } },
      ],
    },
    {
      title: '家庭意見不一致',
      story: '爸爸希望你選擇穩定的科系，將來有份不錯的工作；但你對繪畫有熱情，夢想是成為插畫家。此時你會？',
      options: [
        { text: '好好跟爸爸溝通，說明自己的想法與規劃。', points: { 責任: 8, 同理: 6, 勇氣: 8 } },
        { text: '先聽爸爸的建議，之後再慢慢調整方向。', points: { 責任: 6, 同理: 5, 勇氣: 3 } },
        { text: '嘗試找到兩者兼顧的方式，例如雙主修。', points: { 責任: 7, 同理: 6, 勇氣: 6 } },
        { text: '不想溝通，直接照自己的想法做決定。', points: { 責任: -3, 同理: -4, 勇氣: 7 } },
      ],
    },
  ];

  const handleAdventureChoice = (points: Record<string, number>, optionIdx: number) => {
    const nextChoices = { ...adventureChoices, [adventureStage]: optionIdx };
    setAdventureChoices(nextChoices);

    const nextPoints = {
      同理: Math.max(0, adventurePoints.同理 + (points.同理 || 0)),
      責任: Math.max(0, adventurePoints.責任 + (points.責任 || 0)),
      勇氣: Math.max(0, adventurePoints.勇氣 + (points.勇氣 || 0))
    };
    setAdventurePoints(nextPoints);

    const isLast = adventureStage >= adventureScenarios.length - 1;
    const nextStage = adventureStage + 1;
    setAdventureStage(nextStage);

    if (!isLast) {
      showToast('⚔️ 抉擇完成，前往下一個情境冒險！');
      saveGameResult('adventure', { points: nextPoints, stage: nextStage, selectedChoices: nextChoices });
    } else {
      showToast('🌟 恭喜你，冒險關卡全數完成！');
      saveGameResult('adventure', { points: nextPoints, stage: nextStage, selectedChoices: nextChoices });
    }
  };

  const resetAdventure = () => {
    setAdventureStage(0);
    setAdventurePoints({ 同理: 10, 責任: 10, 勇氣: 10 });
    setAdventureChoices({});
  };

  // ----------------------------------------------------
  // GAME STATE 4: RELATIONSHIPS (Interactive connection game)
  // ----------------------------------------------------
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedRel, setSelectedRel] = useState<string>('死黨');
  const [connections, setConnections] = useState<Array<{ from: string; to: string; rel: string; desc?: string }>>([]);

  const VALID_RELATIONSHIPS = [
    { from: '陳可華', to: '王博鈞', rel: '死黨', desc: '博鈞是可華最好的球友和死黨，在對方心情低潮時互相陪伴打氣！' },
    { from: '張曉萍', to: '王小文', rel: '陪伴者', desc: '小文是曉萍最溫柔的陪伴者，在曉萍因家庭壓力難過時默默給予肩膀與傾聽！' },
    { from: '陳可華', to: '可華爸爸', rel: '家人', desc: '爸爸在可華失去爺爺而感到迷惘時，給予穩定的支持和父愛，是可信任的親情家人！' },
    { from: '陳可華', to: '可華爺爺', rel: '支持者', desc: '爺爺是可華生命中智慧的指路明燈，常常講述深刻的人生哲理故事！' }
  ];

  const handleNodeClick = (node: string) => {
    if (!selectedNode) {
      setSelectedNode(node);
      showToast(`🎯 已選擇第一個角色：${node}，接著請點選要與其連線的角色！`);
    } else {
      if (selectedNode !== node) {
        // Find if this connection pair exists in valid textbook relationships
        const match = VALID_RELATIONSHIPS.find(r => 
          ((r.from === selectedNode && r.to === node) || (r.from === node && r.to === selectedNode)) &&
          r.rel === selectedRel
        );

        if (match) {
          const exists = connections.some(c => (c.from === selectedNode && c.to === node) || (c.from === node && c.to === selectedNode));
          if (exists) {
            showToast(`⚠️ 「${selectedNode}」與「${node}」之間已建立了「${selectedRel}」關係！`);
          } else {
            const newConn = { from: selectedNode, to: node, rel: selectedRel, desc: match.desc };
            const nextConnections = [...connections, newConn];
            setConnections(nextConnections);
            showToast(`🎉 配對成功！\n👉 ${match.desc}`);
            saveGameResult('relationships', { connections: nextConnections });
          }
        } else {
          // Provide a helpful clue depending on who is clicked
          let feedbackClue = '💡 提示：請重新觀察課本中他們的角色互動與支持陪伴關係喔！例如陳可華和他的爺爺是什麼關係呢？';
          if ((selectedNode === '陳可華' && node === '王博鈞') || (selectedNode === '王博鈞' && node === '陳可華')) {
            feedbackClue = '💡 提示：博鈞是可華最好的球友和同學，這在關係中被稱為什麼呢？請切換下方關係標籤！';
          } else if ((selectedNode === '張曉萍' && node === '王小文') || (selectedNode === '王小文' && node === '張曉萍')) {
            feedbackClue = '💡 提示：小文經常在曉萍哭泣難過時默默傾聽，她是曉萍溫柔的「什麼者」呢？';
          } else if ((selectedNode === '陳可華' && node === '可華爸爸') || (selectedNode === '可華爸爸' && node === '陳可華')) {
            feedbackClue = '💡 提示：可華爸爸和可華有共同血緣和深厚的愛，他是最親近的「什麼」呢？';
          } else if ((selectedNode === '陳可華' && node === '可華爺爺') || (selectedNode === '可華爺爺' && node === '陳可華')) {
            feedbackClue = '💡 提示：爺爺常和可華講故事，給予他在悲傷中向前走的精神力量，他是可華的「什麼者」呢？';
          }
          showToast(`❌ 關係配對不正確喔！\n${feedbackClue}`);
        }
      }
      setSelectedNode(null);
    }
  };

  const handleRemoveConnection = (idx: number) => {
    setConnections(prev => {
      const next = prev.filter((_, i) => i !== idx);
      saveGameResult('relationships', { connections: next });
      return next;
    });
    showToast('❌ 關係連結已移除。');
  };

  const resetConnections = () => {
    setConnections([]);
    setSelectedNode(null);
    showToast('🔄 關係連線已全數重置，請重新挑戰！');
  };

  // ----------------------------------------------------
  // GAME STATE 5: VALUE SCALES
  // ----------------------------------------------------
  const [valuesList, setValuesList] = useState<string[]>(['愛', '自由', '責任', '誠實', '成長', '尊重']);
  const [tiltValue, setTiltValue] = useState(0); // scale tilt status
  const [reflectionText, setReflectionText] = useState('');
  
  const moveValue = (index: number, direction: 'up' | 'down') => {
    const list = [...valuesList];
    if (direction === 'up' && index > 0) {
      [list[index], list[index - 1]] = [list[index - 1], list[index]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    }
    setValuesList(list);

    // Dynamic tilt calculation based on first elements
    const topVal = list[0];
    if (topVal === '自由') setTiltValue(-15);
    else if (topVal === '責任') setTiltValue(15);
    else if (topVal === '愛') setTiltValue(-10);
    else if (topVal === '尊重') setTiltValue(5);
    else setTiltValue(0);
  };

  const saveReflection = () => {
    showToast('💾 您的價值排序反思已成功記錄！');
    saveGameResult('value_scale', { ranking: valuesList, reflection: reflectionText });
  };

  // ----------------------------------------------------
  // GAME STATE 6: FLIP CARDS MEMORY MATCH
  // ----------------------------------------------------
  interface MemoryCard {
    id: number;
    text: string;
    pairId: number;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryScore, setMemoryScore] = useState(0);
  const [memoryTimer, setMemoryTimer] = useState(0);
  const [memoryFinished, setMemoryFinished] = useState(false);

  // Initialize cards
  const initMemoryGame = () => {
    const rawData = [
      { text: '勇氣', pairId: 1 },
      { text: '面對重重困難仍然前行', pairId: 1 },
      { text: '同理', pairId: 2 },
      { text: '站在同學的角度設身處地', pairId: 2 },
      { text: '責任', pairId: 3 },
      { text: '切實履行給家人的諾言', pairId: 3 },
      { text: '夢想', pairId: 4 },
      { text: '堅定追尋內心所愛的世界', pairId: 4 },
      { text: '感恩', pairId: 5 },
      { text: '時刻記得對他人的好說謝謝', pairId: 5 },
      { text: '尊重', pairId: 6 },
      { text: '理解班上每個人都是獨一無二', pairId: 6 }
    ];

    // Shuffle
    const shuffled: MemoryCard[] = rawData
      .map((item, idx) => ({
        id: idx,
        text: item.text,
        pairId: item.pairId,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCardIds([]);
    setMemoryMoves(0);
    setMemoryScore(0);
    setMemoryTimer(0);
    setMemoryFinished(false);
  };

  useEffect(() => {
    if (activeGameId === 6) {
      initMemoryGame();
    }
  }, [activeGameId]);

  // Handle Card Click
  const handleCardClick = (cardId: number) => {
    if (flippedCardIds.length >= 2) return;
    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip card
    const updatedCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(updatedCards);

    const nextFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      const [firstId, secondId] = nextFlipped;
      const firstCard = cards.find(c => c.id === firstId)!;
      const secondCard = cards.find(c => c.id === secondId)!;

      if (firstCard.pairId === secondCard.pairId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstId || c.id === secondId) ? { ...c, isMatched: true, isFlipped: true } : c));
          setMemoryScore(prev => prev + 100);
          setFlippedCardIds([]);
          showToast('🌟 完美匹配！');
        }, 500);
      } else {
        // Fail match
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstId || c.id === secondId) ? { ...c, isFlipped: false } : c));
          setFlippedCardIds([]);
        }, 1200);
      }
    }
  };

  // Check victory
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setMemoryFinished(true);
      saveGameResult('memory_cards', { moves: memoryMoves, score: memoryScore, timeSeconds: memoryTimer });
    }
  }, [cards]);

  // ----------------------------------------------------
  // GAME STATE 7: GRATITUDE BUBBLE WALL
  // ----------------------------------------------------
  const [gratitudeMsg, setGratitudeMsg] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [bubbleColor, setBubbleColor] = useState('#FED7AA'); // peach
  const [warmthIndex, setWarmthIndex] = useState(86);
  const [bubbles, setBubbles] = useState([
    { text: '謝謝小文今天借我橡皮擦，你總是默默照顧身邊的人！', sender: '陳可華', color: '#FED7AA' },
    { text: '謝謝博鈞放學後耐心教我數學題，你真的很厲害！', sender: '張曉萍', color: '#FBCFE8' },
    { text: '感謝林老師這週課堂上生動的引導，讓我學會珍惜生命。', sender: '王小文', color: '#D9F99D' },
    { text: '感謝曉萍跟我一起分工做藝術海報，非常有耐心！', sender: 'Anonymous', color: '#BAE6FD' }
  ]);

  const handleSendBubble = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeMsg.trim()) return;

    const newBubble = {
      text: gratitudeMsg.trim(),
      sender: isAnonymous ? '匿名同學' : (currentStudent?.name || '我'),
      color: bubbleColor
    };

    setBubbles(prev => [newBubble, ...prev]);
    setWarmthIndex(prev => Math.min(100, prev + 2));
    setGratitudeMsg('');
    showToast('🎈 溫暖的感恩泡泡已成功升空！');
    saveGameResult('gratitude', { message: newBubble.text, anonymous: isAnonymous });
  };

  // ----------------------------------------------------
  // GAME STATE 8: PHILOSOPHICAL DEBATE
  // ----------------------------------------------------
  const [userVote, setUserVote] = useState<string | null>(null);
  const [debateVotes, setDebateVotes] = useState({ pro: 16, con: 14 });
  const [debateComment, setDebateComment] = useState('');
  const [comments, setComments] = useState([
    { user: '張曉萍', text: '正方博鈞說的「心靈安定才是幸福」真的很有深度，完全認同！', side: 'pro' },
    { user: '陳可華', text: '可是反方說得也對，沒有健康的成功保障，幸福有時很難持久呀？', side: 'con' },
    { user: '林老師', text: '這是一個經典的雙向思考：成功是外在的刻度，幸福是內在的羅盤。', side: 'teacher' }
  ]);

  const handleVote = (side: 'pro' | 'con') => {
    if (userVote) {
      showToast('⚠️ 您今天已經投過票囉！');
      return;
    }
    setUserVote(side);
    setDebateVotes(prev => ({
      ...prev,
      [side]: prev[side] + 1
    }));
    showToast(`🗳️ 成功投票給 ${side === 'pro' ? '正方' : '反方'}！`);
    saveGameResult('debate', { vote: side });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debateComment.trim()) return;

    setComments(prev => [
      ...prev,
      {
        user: currentStudent?.name || '我',
        text: debateComment.trim(),
        side: userVote || 'spectator'
      }
    ]);
    setDebateComment('');
    showToast('💬 發表評論成功！');
  };

  // ----------------------------------------------------
  // GAME STATE 9: MOOD THERMOMETER
  // ----------------------------------------------------
  const [moodLevel, setMoodLevel] = useState(4); // 1 to 6
  const [moodNote, setMoodNote] = useState('');
  const [savedMoods, setSavedMoods] = useState<Array<{ level: number; note: string; date: string }>>([]);

  const moodEmojis = [
    { label: '非常低落', emoji: '😢', color: 'text-blue-500' },
    { label: '有點低落', emoji: '🙁', color: 'text-cyan-500' },
    { label: '心情普通', emoji: '😐', color: 'text-slate-400' },
    { label: '有點開心', emoji: '🙂', color: 'text-amber-500' },
    { label: '開心愉悅', emoji: '😊', color: 'text-orange-500' },
    { label: '超級開心', emoji: '🥳', color: 'text-rose-500' }
  ];

  const handleSaveMood = () => {
    const newRecord = {
      level: moodLevel,
      note: moodNote || '無心情札記',
      date: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    };
    setSavedMoods(prev => [newRecord, ...prev]);
    setMoodNote('');
    showToast('🌡️ 今天的溫度心情已成功記錄至班級！');
    saveGameResult('mood', newRecord);
  };

  // ----------------------------------------------------
  // GAME STATE 10: BADGE CHALLENGE
  // ----------------------------------------------------
  const [badgeTasks, setBadgeTasks] = useState([
    { id: 1, text: '主動參與 1 場課堂思辨發言', done: true, badge: '思辨達人' },
    { id: 2, text: '在人際關係連連看中同理他人感受', done: false, badge: '同理之心' },
    { id: 3, text: '挑戰情境選擇大冒險做出勇敢抉擇', done: false, badge: '勇氣前行' },
    { id: 4, text: '在感恩泡泡站發送一句感謝', done: false, badge: '感恩之光' },
    { id: 5, text: '完成生命故事翻翻卡，探索生命意義', done: false, badge: '生命探索家' }
  ]);

  const toggleBadgeTask = (id: number) => {
    setBadgeTasks(prev => {
      const next = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      saveGameResult('badges', { tasks: next, unlockedCount: next.filter(t => t.done).length });
      return next;
    });
    showToast('🏆 徽章任務狀態已更新！');
  };

  const unlockedBadgeCount = badgeTasks.filter(t => t.done).length;

  // ----------------------------------------------------
  // CORE CLASSROOM DATA SYNCHRONIZATION EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    if (!submissions || submissions.length === 0) return;

    // 1. Load active student's own persistent state across sessions
    if (currentStudent?.studentId) {
      const mySub = submissions.find(s => s.studentId === currentStudent.studentId);
      if (mySub && mySub.games) {
        // Game 1: 幸福導航生命地圖
        if (mySub.games['game_mbti']?.data) {
          const g1Data = mySub.games['game_mbti'].data;
          if (g1Data.allDone) {
            setG1Path(g1Data.path || []);
            setG1FlySelected(g1Data.flySelected || []);
            setG1FlyClassify(g1Data.flyClassify || {});
            setG1SortResult(g1Data.sortResult || {});
            setG1DeclareCols(g1Data.declareCols || { col1: [], col2: [], col3: [] });
            setG1GateAction(g1Data.gateAction || null);
            setG1Done({ task1: true, task2: true, task3: true, task4: true, gate: true });
            setG1Stage('result');
          }
        }
        // Game 2: Puzzle Map
        if (mySub.games['game_puzzle']?.data?.placed) {
          const loadedPlaced = mySub.games['game_puzzle'].data.placed;
          // Only sync if there is actual progress
          if (Object.values(loadedPlaced).filter(Boolean).length > 0) {
            setPuzzlePlaced(loadedPlaced);
          }
        }
        // Game 3: Scenario Adventure
        if (mySub.games['game_adventure']?.data) {
          const advData = mySub.games['game_adventure'].data;
          if (advData.points) setAdventurePoints(advData.points);
          if (advData.stage !== undefined) setAdventureStage(advData.stage);
        }
        // Game 4: Relationships Connecting
        if (mySub.games['game_relationships']?.data?.connections) {
          setConnections(mySub.games['game_relationships'].data.connections);
        }
        // Game 5: Value Scales
        if (mySub.games['game_value_scales']?.data) {
          const valData = mySub.games['game_value_scales'].data;
          if (valData.valuesList) setValuesList(valData.valuesList);
          if (valData.reflection !== undefined) setReflectionText(valData.reflection);
        }
        // Game 9: Mood History
        if (mySub.games['game_mood']?.data) {
          const latestMood = mySub.games['game_mood'].data;
          setSavedMoods(prev => {
            const exists = prev.some(m => m.note === latestMood.note && m.level === latestMood.level);
            if (exists) return prev;
            return [latestMood, ...prev];
          });
        }
        // Game 10: Badge Tasks
        if (mySub.games['game_badges']?.data?.tasks) {
          setBadgeTasks(mySub.games['game_badges'].data.tasks);
        }
      }
    }

    // 2. Aggregate class-wide real-time live boards (Games 7 & 8)
    // --- Game 7: Classroom Gratitude Bubble Wall ---
    const defaultBubbles = [
      { text: '謝謝小文今天借我橡皮擦，你總是默默照顧身邊的人！', sender: '陳可華', color: '#FED7AA' },
      { text: '謝謝博鈞放學後耐心教我數學題，你真的很厲害！', sender: '張曉萍', color: '#FBCFE8' },
      { text: '感謝林老師這週課堂上生動的引導，讓我學會珍惜生命。', sender: '王小文', color: '#D9F99D' },
      { text: '感謝曉萍跟我一起分工做藝術海報，非常有耐心！', sender: 'Anonymous', color: '#BAE6FD' }
    ];
    const liveBubbles = [...defaultBubbles];
    
    submissions.forEach(sub => {
      const gradData = sub.games?.['game_gratitude']?.data;
      if (gradData && gradData.message) {
        const isAnon = gradData.anonymous;
        const senderName = isAnon ? '匿名同學' : (sub.studentName || '同學');
        // Prevent duplicate rendering
        const exists = liveBubbles.some(b => b.text === gradData.message && b.sender === senderName);
        if (!exists) {
          liveBubbles.unshift({
            text: gradData.message,
            sender: senderName,
            color: gradData.color || '#FED7AA'
          });
        }
      }
    });
    setBubbles(liveBubbles);
    setWarmthIndex(Math.min(100, 80 + liveBubbles.length * 2));

    // --- Game 8: Real-time Debate Votes & Comments ---
    let livePro = 16;
    let liveCon = 14;
    const defaultComments = [
      { user: '張曉萍', text: '正方博鈞說的「心靈安定才是幸福」真的很有深度，完全認同！', side: 'pro' },
      { user: '陳可華', text: '可是反方說得也對，沒有健康的成功保障，幸福有時很難持久呀？', side: 'con' },
      { user: '林老師', text: '這是一個經典的雙向思考：成功是外在的刻度，幸福是內在的羅盤。', side: 'teacher' }
    ];
    const liveComments = [...defaultComments];

    submissions.forEach(sub => {
      const debateData = sub.games?.['game_debate']?.data;
      if (debateData) {
        if (debateData.vote === 'pro') livePro++;
        if (debateData.vote === 'con') liveCon++;
        if (debateData.comment) {
          const user = sub.studentName || '熱情同學';
          const exists = liveComments.some(c => c.text === debateData.comment && c.user === user);
          if (!exists) {
            liveComments.push({
              user,
              text: debateData.comment,
              side: debateData.vote || 'spectator'
            });
          }
        }
      }
    });
    setDebateVotes({ pro: livePro, con: liveCon });
    setComments(liveComments);

  }, [submissions, currentStudent]);

  return (
    <div className="min-h-screen bg-[#FBF3E4] text-[#3E2723] font-sans pb-16 px-4 md:px-8 relative overflow-hidden">

      {/* Corner floral decorations (kept inside bounds so the wrapper's overflow-hidden doesn't clip them) */}
      <div className="hidden md:block absolute left-1 top-20 w-48 h-64 opacity-70 pointer-events-none select-none rotate-[8deg] z-0" aria-hidden="true">
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 300C95 220 90 150 60 90C40 50 20 30 10 10" stroke="#B7C79A" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="55" cy="95" rx="16" ry="8" fill="#C6D6A8" transform="rotate(-30 55 95)" />
          <ellipse cx="35" cy="60" rx="16" ry="8" fill="#C6D6A8" transform="rotate(-50 35 60)" />
          <ellipse cx="20" cy="25" rx="14" ry="7" fill="#C6D6A8" transform="rotate(-70 20 25)" />
          <circle cx="70" cy="130" r="10" fill="#F3C1CE" />
          <circle cx="45" cy="170" r="8" fill="#F6D3A8" />
          <circle cx="80" cy="200" r="9" fill="#F3C1CE" />
        </svg>
      </div>
      <div className="hidden md:block absolute right-1 bottom-1 w-44 h-52 opacity-60 pointer-events-none select-none -rotate-[10deg] z-0" aria-hidden="true">
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 240C95 180 110 130 140 90C155 70 170 55 185 40" stroke="#B7C79A" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="145" cy="95" rx="15" ry="7" fill="#C6D6A8" transform="rotate(35 145 95)" />
          <ellipse cx="165" cy="65" rx="14" ry="7" fill="#C6D6A8" transform="rotate(55 165 65)" />
          <circle cx="120" cy="140" r="9" fill="#F6D3A8" />
          <circle cx="150" cy="170" r="10" fill="#F3C1CE" />
        </svg>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#E65100] text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-[#FF8A65]"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto pt-4 space-y-6 relative z-10">
        
        {/* LOBBY VIEW */}
        {activeGameId === null ? (
          <>
            {/* HERO BANNER SECTION */}
            <div id="lobby-hero-banner" className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              {/* Floral vine decoration, top-left of the text block */}
              <div className="absolute left-0 top-6 w-24 h-24 pointer-events-none opacity-90 select-none">
                <img src={lobbyFloral} alt="" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-4 max-w-2xl text-left z-10">
                <div className="inline-flex items-center gap-2 bg-[#FFEAD5] border border-[#F3C29F] text-[#D84315] px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-xs uppercase">
                  <Gamepad2 className="w-4 h-4 text-orange-600" />
                  <span>互動遊戲 ‧ 班級同樂大廳</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h1 className="text-2xl md:text-4xl font-black text-[#4A321F] leading-tight tracking-tight">
                    互動遊戲｜班級同樂大廳
                  </h1>
                  
                  {/* Role Switcher */}
                  <div className="inline-flex items-center gap-1 bg-white/80 border border-[#EAD5C3] p-1 rounded-xl shadow-3xs shrink-0 self-start sm:self-center z-20">
                    <button
                      onClick={() => {
                        setLocalRole('student');
                        showToast('👁️ 已切換為：學生視角');
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                        localRole === 'student'
                          ? 'bg-[#E65100] text-white shadow-3xs'
                          : 'text-[#7D5C43] hover:text-[#E65100]'
                      }`}
                    >
                      學生視角
                    </button>
                    <button
                      onClick={() => {
                        setLocalRole('teacher');
                        showToast('👑 已切換為：教師主控台');
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                        localRole === 'teacher'
                          ? 'bg-[#E65100] text-white shadow-3xs'
                          : 'text-[#7D5C43] hover:text-[#E65100]'
                      }`}
                    >
                      教師主控台
                    </button>
                  </div>
                </div>
                
                <p className="text-sm md:text-base font-extrabold text-[#7D5C43]/90 leading-relaxed max-w-xl">
                  老師掌控節奏，學生掃描 QR code 即可加入，一起參與互動遊戲，讓學習更有趣！
                </p>
              </div>

              {/* Character illustration decoration: students cheering, with book + floral vines */}
              <div className="relative shrink-0 flex items-center justify-center z-10 w-full md:w-auto md:max-w-[420px]">
                <img
                  src={lobbyHero}
                  alt="同學們開心迎接互動遊戲"
                  className="w-full h-auto object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* MAIN DASHBOARD PANEL - THREE COLUMN MASTER LAYOUT */}
            <div id="lobby-main-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT GROUP: Contains 本班遊戲入口, 老師控制台 at the top (teacher only), and 10 Games below */}
              <div className={localRole === 'teacher' ? 'lg:col-span-9 space-y-6' : 'lg:col-span-12 space-y-6'}>
                
                {/* Top Row: 本班遊戲入口 (col-span-5) & 老師控制台 (col-span-7) — teacher only, students go straight to the game grid below */}
                {localRole === 'teacher' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* 本班遊戲入口 Card */}
                  <div className="md:col-span-5 bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-12 -left-12 text-6xl opacity-5 pointer-events-none">🌿</div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b-2 border-[#EAD5C3]/40 pb-3 mb-2">
                        <div className="p-1.5 bg-[#FFEAD5] rounded-xl text-[#E65100]">
                          <Users className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-[#4A321F] text-sm">本班遊戲入口</h3>
                      </div>

                      {/* Side-by-side QR Code and Code Details (Matches user reference image) */}
                      <div className="flex flex-row items-center gap-4 bg-white border-2 border-[#EAD5C3]/60 p-4 rounded-2xl shadow-3xs relative">
                        <div className="absolute top-3 right-3 flex gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
                        </div>
                        
                        {/* QR Code Canvas on Left */}
                        <div className="flex flex-col items-center justify-center bg-[#FDFBF7] p-1.5 rounded-xl border border-[#EAD5C3]/60 shrink-0 shadow-3xs">
                          <canvas ref={canvasRef} className="w-[105px] h-[105px] md:w-[110px] md:h-[110px] object-contain rounded-md" />
                        </div>

                        {/* Code details on Right */}
                        <div className="flex-1 flex flex-col items-start justify-between min-h-[120px] text-left">
                          <div className="space-y-1">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">專屬班級互動代碼</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-3xl font-black text-[#E65100] tracking-widest font-mono bg-[#FFF8F2] py-1 px-3 rounded-xl border-2 border-[#FCD2B5] inline-block shadow-3xs">
                                {classCode}
                              </span>
                              <button
                                onClick={handleRefreshClassCode}
                                title="更換新班級代碼"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#E65100] hover:bg-orange-50 border border-transparent hover:border-[#FCD2B5] transition-all cursor-pointer bg-[#FCFAF7] active:scale-95 shrink-0"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-[11.5px] font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>已連線學生：32 / 40 人</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons with helpful bottom text */}
                    <div className="space-y-2 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={handleCopyLink}
                          className="py-2.5 bg-white hover:bg-orange-50 border-2 border-[#E65100] text-[#E65100] font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>複製連結</span>
                        </button>
                        <button 
                          onClick={() => {
                            setActiveGameId(1);
                            showToast('🎮 遊戲開始！歡迎加入第一關！');
                          }}
                          className="py-2.5 bg-[#E65100] hover:bg-[#D84315] text-white border-2 border-[#D84315] font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 hover:shadow-md"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>開始遊戲</span>
                        </button>
                      </div>
                      <div className="text-center pt-1 space-y-2">
                        <span className="text-[11px] text-slate-400 font-bold block">學生掃描 QR code 或輸入班級代碼即可加入</span>
                        <div className="border-t border-dashed border-[#EAD5C3]/60 pt-2 text-left">
                          <button
                            onClick={() => setShowOriginSettings(!showOriginSettings)}
                            className="text-[11px] text-[#E65100] hover:underline font-extrabold flex items-center gap-1 cursor-pointer select-none"
                          >
                            <span>⚙️</span>
                            <span>{showOriginSettings ? '隱藏網址設定' : '分享連結與 QR Code 網址設定'}</span>
                          </button>
                          {showOriginSettings && (
                            <div className="mt-1.5 bg-white border border-[#EAD5C3]/40 p-2.5 rounded-xl space-y-1.5 text-left animate-fade-in shadow-3xs">
                              <label className="text-[10px] font-black text-slate-500 block">手機掃描專用網址：</label>
                              <input
                                type="text"
                                value={customOrigin}
                                onChange={(e) => setCustomOrigin(e.target.value)}
                                placeholder="請輸入本網站網址 (例如 https://...)"
                                className="w-full text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E65100] font-mono"
                              />
                              <div className="text-[9px] text-slate-400 leading-tight">
                                💡 本地測試 (localhost) 手機無法直接掃描。我們已自動為您同步為 Cloud Run 公開網址，您亦可在上方手動修改。QR Code 與「複製連結」會隨時保持完美同步！
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 老師控制台 Card */}
                  <div className="md:col-span-7 bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b-2 border-[#EAD5C3]/40 pb-3 mb-2">
                        <div className="p-1.5 bg-[#FFEAD5] rounded-xl text-[#E65100]">
                          <Tv className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-[#4A321F] text-sm">老師控制台</h3>
                      </div>

                      {/* Game mode selectors */}
                      <div className="space-y-1.5">
                        <label className="text-[12.5px] font-black text-slate-400 block text-left uppercase">🎮 遊戲模式</label>
                        <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-[#EAD5C3]/40 shadow-3xs">
                          <button 
                            onClick={() => handleUpdateQuestState({ gameMode: 'individual' })}
                            className={`py-1 px-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              gameMode === 'individual'
                                ? 'bg-[#FFF0E0] border border-[#F3C29F] text-[#D84315] shadow-3xs'
                                : 'hover:bg-slate-50 border border-transparent text-slate-500'
                            }`}
                          >
                            <span>👤 個人作答</span>
                          </button>
                          <button 
                            onClick={() => handleUpdateQuestState({ gameMode: 'team' })}
                            className={`py-1 px-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              gameMode === 'team'
                                ? 'bg-[#FFF0E0] border border-[#F3C29F] text-[#D84315] shadow-3xs'
                                : 'hover:bg-slate-50 border border-transparent text-slate-500'
                            }`}
                          >
                            <span>👥 小組競賽</span>
                          </button>
                          <button 
                            onClick={() => handleUpdateQuestState({ gameMode: 'class' })}
                            className={`py-1 px-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              gameMode === 'class'
                                ? 'bg-[#FFF0E0] border border-[#F3C29F] text-[#D84315] shadow-3xs'
                                : 'hover:bg-slate-50 border border-transparent text-slate-500'
                            }`}
                          >
                            <span>🤝 全班合作</span>
                          </button>
                        </div>
                      </div>

                      {/* Class teams setup with portraits */}
                      <div className="space-y-1.5">
                        <label className="text-[12.5px] font-black text-slate-400 block text-left uppercase">👥 參賽小隊設定 (共 4 隊)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {/* Team 1: 張曉萍 */}
                          <div className="bg-white border border-[#F0E2D5] p-1.5 rounded-xl flex items-center justify-between gap-2 shadow-3xs hover:border-[#F3C29F] transition-colors">
                            <div className="flex items-center gap-2">
                              <img src={charXiaopingImg} className="w-6 h-6 rounded-full object-cover" />
                              <span className="text-xs font-black text-slate-800">張曉萍隊</span>
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-100">
                              <button 
                                onClick={() => {
                                  const size = teamSizes.xiaoping ?? 8;
                                  if (size > 0) handleUpdateQuestState({ teamSizes: { ...teamSizes, xiaoping: size - 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                -
                              </button>
                              <span className="text-[10px] text-emerald-600 font-extrabold px-0.5">{teamSizes.xiaoping ?? 8}人</span>
                              <button 
                                onClick={() => {
                                  const size = teamSizes.xiaoping ?? 8;
                                  handleUpdateQuestState({ teamSizes: { ...teamSizes, xiaoping: size + 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Team 2: 王博鈞 */}
                          <div className="bg-white border border-[#F0E2D5] p-1.5 rounded-xl flex items-center justify-between gap-2 shadow-3xs hover:border-[#F3C29F] transition-colors">
                            <div className="flex items-center gap-2">
                              <img src={charBojunImg} className="w-6 h-6 rounded-full object-cover" />
                              <span className="text-xs font-black text-slate-800">王博鈞隊</span>
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-100">
                              <button 
                                onClick={() => {
                                  const size = teamSizes.bojun ?? 8;
                                  if (size > 0) handleUpdateQuestState({ teamSizes: { ...teamSizes, bojun: size - 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                -
                              </button>
                              <span className="text-[10px] text-emerald-600 font-extrabold px-0.5">{teamSizes.bojun ?? 8}人</span>
                              <button 
                                onClick={() => {
                                  const size = teamSizes.bojun ?? 8;
                                  handleUpdateQuestState({ teamSizes: { ...teamSizes, bojun: size + 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Team 3: 陳可華 */}
                          <div className="bg-white border border-[#F0E2D5] p-1.5 rounded-xl flex items-center justify-between gap-2 shadow-3xs hover:border-[#F3C29F] transition-colors">
                            <div className="flex items-center gap-2">
                              <img src={charKehuaImg} className="w-6 h-6 rounded-full object-cover" />
                              <span className="text-xs font-black text-slate-800">陳可華隊</span>
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-100">
                              <button 
                                onClick={() => {
                                  const size = teamSizes.kehua ?? 8;
                                  if (size > 0) handleUpdateQuestState({ teamSizes: { ...teamSizes, kehua: size - 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                -
                              </button>
                              <span className="text-[10px] text-emerald-600 font-extrabold px-0.5">{teamSizes.kehua ?? 8}人</span>
                              <button 
                                onClick={() => {
                                  const size = teamSizes.kehua ?? 8;
                                  handleUpdateQuestState({ teamSizes: { ...teamSizes, kehua: size + 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Team 4: 王小文 */}
                          <div className="bg-white border border-[#F0E2D5] p-1.5 rounded-xl flex items-center justify-between gap-2 shadow-3xs hover:border-[#F3C29F] transition-colors">
                            <div className="flex items-center gap-2">
                              <img src={charXiaowenImg} className="w-6 h-6 rounded-full object-cover" />
                              <span className="text-xs font-black text-slate-800">王小文隊</span>
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-100">
                              <button 
                                onClick={() => {
                                  const size = teamSizes.xiaowen ?? 8;
                                  if (size > 0) handleUpdateQuestState({ teamSizes: { ...teamSizes, xiaowen: size - 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                -
                              </button>
                              <span className="text-[10px] text-emerald-600 font-extrabold px-0.5">{teamSizes.xiaowen ?? 8}人</span>
                              <button 
                                onClick={() => {
                                  const size = teamSizes.xiaowen ?? 8;
                                  handleUpdateQuestState({ teamSizes: { ...teamSizes, xiaowen: size + 1 } });
                                }}
                                className="w-3.5 h-3.5 bg-white text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[9px] font-black hover:bg-emerald-100 cursor-pointer active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Bottom Row: 互動遊戲列表 */}
                  <div className="space-y-4 pt-2">
                    <CollapsibleSection
                      icon={<Gamepad2 className="w-6 h-6 text-[#E65100]" />}
                      title="課堂專用互動遊戲（清空重置中）"
                      subtitle="舊版 10 款遊戲已全數刪除，等待放入新遊戲"
                      defaultExpanded={true}
                    >
                      {GAMES.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-[#EAD5C3] rounded-3xl p-8 md:p-12 text-center space-y-4 shadow-3xs">
                          <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-3xl text-[#E65100] shadow-xs">
                            🗑️
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-lg md:text-xl font-black text-[#3E2723]">原 10 款舊版遊戲已全數刪除</h4>
                            <p className="text-xs md:text-sm text-[#7D5C43] font-bold max-w-lg mx-auto leading-relaxed">
                              遊戲大廳目前已清空重置，隨時準備為您建立與替換全新的互動遊戲！
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
                          {GAMES.map((game) => (
                            <div 
                              key={game.id}
                              className="bg-white border-2 border-[#EAD5C3] hover:border-[#E65100] p-5 md:p-6 rounded-3xl transition-all duration-300 shadow-3xs flex flex-col justify-between min-h-[310px] md:min-h-[340px] group hover:-translate-y-1 hover:shadow-md relative"
                            >
                              <div className="space-y-3.5">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs md:text-sm font-black font-mono px-2.5 py-1 rounded-xl border-2 shadow-3xs ${game.color}`}>
                                      {game.number}
                                    </span>
                                    {(() => {
                                      const getGameKey = (id: number) => {
                                        switch (id) {
                                          case 1: return 'mbti';
                                          case 2: return 'puzzle';
                                          case 3: return 'adventure';
                                          case 4: return 'relationships';
                                          case 5: return 'value_scale';
                                          case 6: return 'memory_cards';
                                          case 7: return 'gratitude';
                                          case 8: return 'debate';
                                          case 9: return 'mood';
                                          case 10: return 'badges';
                                          default: return '';
                                        }
                                      };
                                      const gameKey = getGameKey(game.id);
                                      const isCompleted = currentStudent?.games?.[`game_${gameKey}`] !== undefined;
                                      if (isCompleted) {
                                        return (
                                          <span className="bg-emerald-50 text-emerald-700 border-2 border-emerald-300 text-xs font-black px-2 py-0.5 rounded-xl flex items-center gap-1 shadow-3xs">
                                            <span className="text-xs leading-none">✓</span> 已完成
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                </div>

                                <div className="h-28 md:h-32 w-full rounded-2xl overflow-hidden shadow-2xs">
                                  {renderGameIllustration(game.id)}
                                </div>

                                <div className="space-y-1.5 text-left">
                                  <h4 className="font-black text-base md:text-lg text-[#2D1B10] group-hover:text-[#E65100] transition-colors leading-snug">
                                    {game.title}
                                  </h4>
                                  <p className="text-xs md:text-sm text-[#4E3629] font-bold leading-relaxed">
                                    {game.description}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4">
                                <button 
                                  onClick={() => {
                                    setActiveGameId(game.id);
                                    showToast(`🎮 歡迎進入：${game.title}！`);
                                  }}
                                  className="w-full py-2.5 bg-[#E65100] hover:bg-[#D84315] text-white border-2 border-[#D84315] rounded-2xl text-xs md:text-sm font-black transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <span>進入遊戲</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CollapsibleSection>
                  </div>
                </div>

                {/* RIGHT GROUP (col-span-3): Projection settings and Classroom Timelines — teacher only */}
                {localRole === 'teacher' && (
                <div className="lg:col-span-3 space-y-6">
                  
                  {/* 投影模式設定 */}
                  <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-[#EAD5C3]/60 pb-3">
                      <span className="font-black text-[#4A321F] text-sm">投影模式設定</span>
                      {/* Toggle switch simulation */}
                      <button 
                        onClick={() => handleUpdateQuestState({ projectionEnabled: !projectionEnabled })}
                        className="flex items-center gap-1.5 focus:outline-none cursor-pointer group active:scale-95 transition-transform"
                      >
                        <span className={`text-[12px] font-black px-2 py-0.5 rounded-full border ${
                          projectionEnabled 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                            : 'text-slate-500 bg-slate-50 border-slate-200'
                        }`}>
                          {projectionEnabled ? '已開啟' : '已關閉'}
                        </span>
                        <div className={`w-9 h-5 rounded-full p-0.5 shadow-inner transition-colors duration-200 flex ${
                          projectionEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                        }`}>
                          <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                        </div>
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs font-extrabold text-[#7D5C43] leading-relaxed text-left">
                      <button 
                        onClick={() => handleUpdateQuestState({ randomModeEnabled: !randomModeEnabled })}
                        className="w-full flex justify-between items-center bg-white hover:bg-orange-50 active:scale-99 border border-[#EAD5C3]/60 hover:border-[#E65100] p-2.5 rounded-xl shadow-3xs cursor-pointer transition-all"
                      >
                        <span className="text-slate-400 text-[12.5px]">隨機出題模式:</span>
                        <span className="font-black text-[#E65100]">
                          {randomModeEnabled ? '開啟 (不重覆)' : '關閉 (依序)'}
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          const timings = [15, 30, 45, 60, 0];
                          const currentIndex = timings.indexOf(timerPerQuestion);
                          const nextIndex = (currentIndex + 1) % timings.length;
                          handleUpdateQuestState({ timerPerQuestion: timings[nextIndex] });
                        }}
                        className="w-full flex justify-between items-center bg-white hover:bg-orange-50 active:scale-99 border border-[#EAD5C3]/60 hover:border-[#E65100] p-2.5 rounded-xl shadow-3xs cursor-pointer transition-all"
                      >
                        <span className="text-slate-400 text-[12.5px]">單題答題計時:</span>
                        <span className="font-black text-[#E65100]">
                          {timerPerQuestion === 0 ? '無限制' : `${timerPerQuestion} 秒 / 題`}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 課堂互動流程 */}
                  <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 text-5xl opacity-5 pointer-events-none">🌿</div>
                    
                    <div className="flex items-center gap-2 border-b-2 border-[#EAD5C3]/60 pb-3">
                      <span className="text-lg">📋</span>
                      <h3 className="font-black text-[#4A321F] text-sm">課堂互動流程</h3>
                    </div>

                    {/* Vertical Timeline stepper */}
                    <div className="space-y-4 relative pl-5 text-left">
                      <div className="absolute left-1.5 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-[#F3C29F]" />
                      
                      <div className="relative">
                        <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#E65100] border-2 border-white shadow-xs flex items-center justify-center text-[12px] text-white font-black">1</div>
                        <div className="leading-tight">
                          <div className="text-xs font-black text-[#4A321F]">Step 1 老師選擇遊戲</div>
                          <p className="text-[12px] text-slate-400 font-bold leading-normal mt-0.5">點選下方 10 款互動遊戲之一，按「進入遊戲」</p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#E65100] border-2 border-white shadow-xs flex items-center justify-center text-[12px] text-white font-black">2</div>
                        <div className="leading-tight">
                          <div className="text-xs font-black text-[#4A321F]">Step 2 學生點擊互動連結</div>
                          <p className="text-[12px] text-slate-400 font-bold leading-normal mt-0.5">學生點擊分享的專屬互動連結，或輸入 4 碼班級代碼</p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#E65100] border-2 border-white shadow-xs flex items-center justify-center text-[12px] text-white font-black">3</div>
                        <div className="leading-tight">
                          <div className="text-xs font-black text-[#4A321F]">Step 3 學生進入遊戲</div>
                          <p className="text-[12px] text-slate-400 font-bold leading-normal mt-0.5">學生輸入座號姓名，一秒登入班級同樂大廳</p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#E65100] border-2 border-white shadow-xs flex items-center justify-center text-[12px] text-white font-black">4</div>
                        <div className="leading-tight">
                          <div className="text-xs font-black text-[#4A321F]">Step 4 全班即時作答／小組比賽</div>
                          <p className="text-[12px] text-slate-400 font-bold leading-normal mt-0.5">手機端與課堂大投影同步作答，累積生命點數</p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#E65100] border-2 border-white shadow-xs flex items-center justify-center text-[12px] text-white font-black">5</div>
                        <div className="leading-tight">
                          <div className="text-xs font-black text-[#4A321F]">Step 5 顯示結果與總結</div>
                          <p className="text-[12px] text-slate-400 font-bold leading-normal mt-0.5">大螢幕秀出全班答題分佈，老師進行一鍵點評</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              )}
            </div>

            {/* CHARACTER STORY SECTION AT BOTTOM OF INTERACTIVE GAMES */}
            <div id="character-story-section" className="pt-8 my-8 border-t-2 border-[#EAD5C3]/60">
              <CharacterStoryTab />
            </div>

            {/* FOOTER TIPS CARDS - BOTTOM 3 COLUMN USAGE ADVICE (Matches Image 1 exactly) */}
            <div id="lobby-footer-tips" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-[#EAD5C3]/60">
              {/* Card 1: 使用建議 */}
              <div className="bg-white border-2 border-[#EAD5C3]/40 rounded-2xl p-5 flex gap-3.5 items-start relative overflow-hidden group hover:border-[#E65100] transition-colors">
                <div className="absolute -bottom-6 -right-6 text-3xl opacity-10 pointer-events-none group-hover:scale-110 transition-transform">💡</div>
                <div className="p-2.5 bg-orange-50 border border-[#FCD2B5] rounded-xl text-[#E65100] text-xl shadow-xs">💡</div>
                <div className="space-y-1 text-left">
                  <h5 className="font-black text-sm text-[#4A321F]">使用建議</h5>
                  <p className="text-[12.5px] text-slate-400 font-bold leading-relaxed">
                    活絡氣氛、提升專注力，讓每一堂課都充滿參與感。
                  </p>
                </div>
              </div>
              
              {/* Card 2: 課中互動 */}
              <div className="bg-white border-2 border-[#EAD5C3]/40 rounded-2xl p-5 flex gap-3.5 items-start relative overflow-hidden group hover:border-[#E65100] transition-colors">
                <div className="absolute -bottom-6 -right-6 text-3xl opacity-10 pointer-events-none group-hover:scale-110 transition-transform">🌸</div>
                <div className="p-2.5 bg-orange-50 border border-[#FCD2B5] rounded-xl text-[#E65100] text-xl shadow-xs">📖</div>
                <div className="space-y-1 text-left">
                  <h5 className="font-black text-sm text-[#4A321F]">課中互動</h5>
                  <p className="text-[12.5px] text-slate-400 font-bold leading-relaxed">
                    搭配課程內容，強化理解與思考，讓學生主動參與學習。
                  </p>
                </div>
              </div>

              {/* Card 3: 課後複習 */}
              <div className="bg-white border-2 border-[#EAD5C3]/40 rounded-2xl p-5 flex gap-3.5 items-start relative overflow-hidden group hover:border-[#E65100] transition-colors">
                <div className="absolute -bottom-6 -right-6 text-3xl opacity-10 pointer-events-none group-hover:scale-110 transition-transform">🌻</div>
                <div className="p-2.5 bg-orange-50 border border-[#FCD2B5] rounded-xl text-[#E65100] text-xl shadow-xs">📊</div>
                <div className="space-y-1 text-left">
                  <h5 className="font-black text-sm text-[#4A321F]">課後複習</h5>
                  <p className="text-[12.5px] text-slate-400 font-bold leading-relaxed">
                    筆記學習重點，檢視學習成果，培養自我反思能力。
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            
            {/* BACK TO LOBBY BUTTON */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FCFAF6] border border-[#F1E0CE] rounded-2xl p-3 shadow-3xs">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setActiveGameId(null);
                    showToast('🚪 已返回班級同樂大廳');
                  }}
                  className="px-4 py-1.5 border border-[#F1E0CE] hover:bg-[#FAF5EC] text-slate-600 font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer bg-white shadow-3xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回大廳</span>
                </button>

                <button 
                  onClick={() => {
                    const gameUrl = `${window.location.origin}${window.location.pathname}?tab=互動遊戲&gameId=${activeGameId}`;
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(gameUrl)
                        .then(() => {
                          showToast('📋 已複製此關卡的專屬進入連結！快分享給同學吧！');
                        })
                        .catch(() => {
                          fallbackCopyText(gameUrl);
                        });
                    } else {
                      fallbackCopyText(gameUrl);
                    }
                  }}
                  className="px-4 py-1.5 border border-orange-200 text-orange-700 bg-orange-50/50 hover:bg-orange-100/50 font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>複製此關卡連結</span>
                </button>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-bold text-[#7D6B5D] bg-[#FAF5EC] px-3.5 py-1.5 rounded-full border border-[#F1E0CE]">
                  🎮 當前同樂：{GAMES.find(g => g.id === activeGameId)?.title}
                </span>
              </div>
            </div>

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 1: 幸福導航｜生命地圖啟程 */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 1 && (
              <div id="game-view-mbti" className="space-y-6">
                {/* Mode Selector Header */}
                <div className="flex items-center justify-between gap-3 bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-3 shadow-sm text-slate-100 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌀</span>
                    <span className="text-xs font-black text-cyan-300">第一關遊戲模式切換：</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setG1GameMode('mind')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        g1GameMode === 'mind'
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md ring-2 ring-cyan-300'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>✨ 心靈迷宮 (Mind Labyrinth)</span>
                      {g1GameMode === 'mind' && <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-cyan-200">NEW</span>}
                    </button>

                    <button
                      onClick={() => setG1GameMode('london')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        g1GameMode === 'london'
                          ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>🔍 霧都解密 (London Mysteries)</span>
                    </button>

                    <button
                      onClick={() => setG1GameMode('classic')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        g1GameMode === 'classic'
                          ? 'bg-[#E65100] text-white shadow-md ring-2 ring-orange-300'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>🧭 經典地圖</span>
                    </button>
                  </div>
                </div>

                {/* Mind Labyrinth Mode */}
                {g1GameMode === 'mind' && (
                  <MindLabyrinthGame
                    currentStudent={currentStudent}
                    onSaveQuest={saveGameResult}
                    onClose={() => setActiveGameId(null)}
                  />
                )}

                {/* London Mysteries Mode */}
                {g1GameMode === 'london' && (
                  <LondonMysteriesGame
                    currentStudent={currentStudent}
                    onSaveQuest={saveGameResult}
                    onClose={() => setActiveGameId(null)}
                  />
                )}

                {/* Classic Map Mode */}
                {g1GameMode === 'classic' && (
                  <>
                    {/* 1. Banner */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                      <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                      <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                      <div className="flex items-center gap-5 z-10">
                        <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">01</div>
                        <div className="space-y-1 text-left">
                          <h2 className="text-2xl md:text-3xl font-black text-[#4A321F] flex items-center gap-2">幸福導航：生命地圖啟程 <Timer className="w-5 h-5 text-[#E0812A]" /></h2>
                          <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">完成四項生命探索任務，蒐集五把幸福鑰匙，開啟屬於你的幸福之門。</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                        <img src={GAME_BANNER_IMAGES[1]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                      </div>
                    </div>

                {/* HUD：任務完成度 + 鑰匙進度（除了 lobby 以外都顯示，方便隨時掌握進度） */}
                {g1Stage !== 'summon' && g1Stage !== 'result' && (
                  <div className="flex items-center gap-3 flex-wrap bg-white border-2 border-[#EAD5C3] rounded-2xl px-5 py-3 shadow-xs">
                    <span className="text-xs font-black text-slate-500 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#E65100]" /> 任務完成度 <b className="text-[#E65100]">{Math.round((g1DoneCount / 4) * 100)}%</b></span>
                    <span className="text-slate-300">|</span>
                    <span className="text-xs font-black text-slate-500 flex items-center gap-1.5">🔑 鑰匙進度 <b className="text-[#E65100]">{g1KeyCount} / 5</b></span>
                    {g1Stage !== 'lobby' && (
                      <button onClick={() => setG1Stage('lobby')} className="ml-auto text-xs font-black text-slate-400 hover:text-[#E65100] flex items-center gap-1 cursor-pointer">
                        <ArrowLeft className="w-3.5 h-3.5" /> 回到地圖
                      </button>
                    )}
                  </div>
                )}

                {g1Stage === 'lobby' && (
                  /* ---------- 大廳地圖：4 個任務站 + 幸福之門 ---------- */
                  <div className="space-y-4">
                    {/* 可華導覽對話框 */}
                    <div className="flex items-center gap-3 bg-white border-2 border-[#EAD5C3] rounded-2xl p-3 shadow-xs">
                      <img src={charKehuaImg} alt="可華" className="w-11 h-11 rounded-full object-cover border-2 border-[#E0812A] shadow-sm shrink-0" referrerPolicy="no-referrer" />
                      <p className="text-xs font-bold text-[#4A321F] leading-relaxed">
                        {g1DoneCount === 0 && '我是可華，一起探索屬於我的幸福答案吧！先從任意一個任務站開始吧！'}
                        {g1DoneCount > 0 && g1DoneCount < 4 && `已經完成 ${g1DoneCount} 項任務囉，繼續加油，集滿五把鑰匙就能開啟幸福之門！`}
                        {g1DoneCount === 4 && '最後一步了！點選幸福之門，選擇你願意實踐的行動吧！'}
                      </p>
                    </div>

                    {/* 地圖裝飾背景：虛線路徑連接 4 個任務站 + 幸福之門 */}
                    <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 border-2 border-[#EAD5C3] p-4 md:p-6 overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full hidden sm:block pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 25 25 Q 50 40 50 55 Q 50 70 75 75" fill="none" stroke="#E0812A" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
                        <path d="M 75 25 Q 55 40 50 55 Q 45 70 25 75" fill="none" stroke="#E0812A" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
                      </svg>

                      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {([
                          { id: 'task1' as G1TaskId, num: '任務 1', title: '打破幸福公式', emoji: '📝', desc: '重新思考幸福的路徑', ring: 'border-violet-300', bg: 'bg-white', badge: 'bg-violet-500' },
                          { id: 'task2' as G1TaskId, num: '任務 2', title: '一分鐘蒼蠅挑戰', emoji: '⏰', desc: '如果生命只剩24小時...', ring: 'border-teal-300', bg: 'bg-white', badge: 'bg-teal-600' },
                          { id: 'task3' as G1TaskId, num: '任務 3', title: '重要與必要', emoji: '⚖️', desc: '分辨什麼是重要？什麼是必要？', ring: 'border-orange-300', bg: 'bg-white', badge: 'bg-orange-500' },
                          { id: 'task4' as G1TaskId, num: '任務 4', title: '自我探索站', emoji: '🪞', desc: '我是誰？從何而來？', ring: 'border-pink-300', bg: 'bg-white', badge: 'bg-pink-600' },
                        ]).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setG1Stage(t.id)}
                            className={`text-left p-5 rounded-3xl border-2 ${t.ring} ${t.bg} hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer active:scale-98 relative overflow-hidden shadow-sm`}
                          >
                            {g1Done[t.id] && (
                              <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm z-10">
                                <Check className="w-4 h-4" />
                              </span>
                            )}
                            <span className={`inline-block text-[11px] font-black text-white ${t.badge} px-3 py-1 rounded-full shadow-sm`}>{t.num}</span>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-3xl">{t.emoji}</span>
                              <h4 className="font-black text-[#4A321F] text-base">{t.title}</h4>
                            </div>
                            <p className="text-[12px] font-bold text-slate-500 mt-1.5">{t.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={enterGate}
                      className={`w-full text-center p-5 rounded-3xl border-2 transition-all cursor-pointer active:scale-98 relative overflow-hidden ${
                        g1DoneCount === 4
                          ? 'border-amber-400 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 hover:shadow-lg'
                          : 'border-slate-200 bg-slate-50 opacity-70'
                      }`}
                    >
                      {g1DoneCount === 4 && (
                        <span className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.4), transparent 70%)' }} />
                      )}
                      <div className="relative flex items-center justify-center gap-3">
                        <span className="text-3xl">{g1DoneCount === 4 ? '🚪' : '🔒'}</span>
                        <div>
                          <h4 className="font-black text-[#4A321F] text-base flex items-center gap-1.5">幸福之門 {g1DoneCount === 4 && <Sparkles className="w-4 h-4 text-amber-500" />}</h4>
                          <p className="text-[12px] font-bold text-slate-500">
                            {g1DoneCount === 4 ? '五把鑰匙已齊，選擇你的行動，開啟屬於你的幸福之門！' : `還需完成 ${4 - g1DoneCount} 項任務才能開啟`}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* 五把鑰匙收集進度 */}
                    <div className="bg-[#12225A] rounded-2xl p-4 flex items-center gap-4 flex-wrap">
                      <span className="text-[11px] font-black text-amber-300 shrink-0">🔑 幸福鑰匙收集進度</span>
                      {KEY_ORDER.map((k, idx) => {
                        const taskForKey: G1TaskId[] = ['task1', 'task2', 'task3', 'task4', 'gate'];
                        const unlocked = g1Done[taskForKey[idx]];
                        return (
                          <div key={k} className="flex flex-col items-center gap-1">
                            <span className={`text-lg ${unlocked ? '' : 'grayscale opacity-40'}`}>🗝️</span>
                            <span className={`text-[9.5px] font-black ${unlocked ? 'text-amber-200' : 'text-slate-500'}`}>{k}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {g1Stage === 'task1' && (
                  /* ---------- 任務1：打破幸福公式 ---------- */
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm">
                      <h3 className="font-black text-[#4A321F] text-sm mb-2">原來的公式是這樣，但幸福一定只能這樣嗎？</h3>
                      <div className="flex items-center gap-2 flex-wrap text-xs font-black text-slate-500">
                        <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">用功讀書</span><ChevronRight className="w-3.5 h-3.5" />
                        <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">好大學</span><ChevronRight className="w-3.5 h-3.5" />
                        <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">好工作</span><ChevronRight className="w-3.5 h-3.5" />
                        <span className="px-3 py-1.5 bg-pink-50 border border-pink-200 rounded-xl">幸福？</span>
                      </div>
                    </div>

                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm">
                      <h4 className="font-black text-[#4A321F] text-xs mb-3">重新排列，設計屬於你的幸福路徑（點選 3～5 個元素，依你點選的順序排列）</h4>
                      <div className="min-h-[60px] flex items-center gap-2 flex-wrap mb-4 p-3 bg-white rounded-2xl border-2 border-dashed border-orange-200">
                        {g1Path.length === 0 && <span className="text-xs font-bold text-slate-300">尚未選擇，點下方詞卡加入路徑</span>}
                        {g1Path.map((item, idx) => (
                          <React.Fragment key={item}>
                            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-orange-300" />}
                            <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-black rounded-xl">{item}</span>
                          </React.Fragment>
                        ))}
                        {g1Path.length > 0 && <><ChevronRight className="w-3.5 h-3.5 text-orange-300" /><span className="px-3 py-1.5 bg-pink-500 text-white text-xs font-black rounded-xl">幸福！</span></>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {TASK1_POOL.map((item) => {
                          const chosen = g1Path.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() => toggleTask1Item(item)}
                              className={`p-3 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer active:scale-98 ${
                                chosen ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-[#F1E0CE] bg-white text-[#4A321F] hover:border-orange-200'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <button onClick={finishTask1} className="w-full py-3 bg-[#E65100] hover:bg-[#D84315] text-white font-black text-sm rounded-2xl shadow-sm transition-all cursor-pointer active:scale-98">完成排列 → 檢視我的幸福路徑</button>
                  </div>
                )}

                {g1Stage === 'task2' && (
                  /* ---------- 任務2：一分鐘蒼蠅挑戰（真倒數） ---------- */
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#1B1230] to-[#241938] border-2 border-[#4A3A6B] rounded-3xl p-6 text-center space-y-3">
                      <p className="text-xs font-bold text-white/60">假如你只剩下 24 小時可以活……請從周圍的生命事件中，挑選出你最想完成的 5 件事</p>
                      <div className={`text-4xl font-black font-mono ${g1FlyPhase === 'pick' ? 'text-amber-300 animate-pulse' : 'text-emerald-300'}`}>
                        {g1FlyPhase === 'pick' ? `${g1FlyTimer}s` : '⏱ 時間到！'}
                      </div>
                      <p className="text-[11px] font-bold text-white/40">{g1FlyPhase === 'pick' ? '時間倒數中，請專注選擇！' : '請為每一件選中的事完成分類'}</p>
                    </div>

                    {g1FlyPhase === 'pick' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {TASK2_POOL.map((item) => {
                          const chosen = g1FlySelected.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() => toggleFlySelect(item)}
                              className={`p-3 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer active:scale-98 ${
                                chosen ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-[#F1E0CE] bg-white text-[#4A321F] hover:border-teal-200'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {g1FlySelected.map((item) => (
                          <div key={item} className="bg-white border-2 border-[#EAD5C3] rounded-2xl p-4 flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-black text-[#4A321F] flex-1">{item}</span>
                            <div className="flex gap-2 flex-wrap">
                              {TASK2_CATS.map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => classifyFlyItem(item, cat)}
                                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black border-2 transition-all cursor-pointer ${
                                    g1FlyClassify[item] === cat ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200 text-slate-500 hover:border-teal-300'
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button onClick={finishTask2} className="w-full py-3 bg-[#0F766E] hover:bg-[#0d6058] text-white font-black text-sm rounded-2xl shadow-sm transition-all cursor-pointer active:scale-98">完成分類</button>
                      </div>
                    )}
                  </div>
                )}

                {g1Stage === 'task3' && (
                  /* ---------- 任務3：重要與必要 ---------- */
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm">
                      <h4 className="font-black text-[#4A321F] text-xs mb-3">先點下方一張卡片「拿起來」，再點上方分類區「放進去」</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {TASK3_ZONES.map((zone) => (
                          <button
                            key={zone}
                            onClick={() => dropTask3Zone(zone)}
                            className="min-h-[110px] p-3 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 hover:bg-orange-50 transition-all cursor-pointer text-center"
                          >
                            <h5 className="font-black text-xs text-[#B4570B] mb-2">{zone}</h5>
                            <div className="flex flex-wrap gap-1.5 justify-center">
                              {Object.entries(g1SortResult).filter(([, z]) => z === zone).map(([card]) => (
                                <span key={card} className="px-2 py-1 bg-white border border-orange-200 rounded-lg text-[10.5px] font-black text-[#4A321F]">{card}</span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5">
                      <h4 className="font-black text-[#4A321F] text-xs mb-3">可拖曳的卡片（點擊拿起）</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {TASK3_POOL.filter(c => !g1SortResult[c]).map((card) => (
                          <button
                            key={card}
                            onClick={() => pickTask3Card(card)}
                            className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer active:scale-98 ${
                              g1SortPicked === card ? 'border-orange-500 bg-orange-500 text-white' : 'border-[#F1E0CE] bg-white text-[#4A321F] hover:border-orange-200'
                            }`}
                          >
                            {card}
                          </button>
                        ))}
                        {TASK3_POOL.every(c => g1SortResult[c]) && <span className="text-xs font-bold text-emerald-600">🎉 全部分類完成！</span>}
                      </div>
                    </div>
                    <button onClick={finishTask3} className="w-full py-3 bg-[#B4570B] hover:bg-[#9c4a08] text-white font-black text-sm rounded-2xl shadow-sm transition-all cursor-pointer active:scale-98">確認分類</button>
                  </div>
                )}

                {g1Stage === 'task4' && (
                  /* ---------- 任務4：自我探索站 ---------- */
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 mb-4">透過探索，認識真實的自己，打造屬於你的幸福地圖！（每欄可複選）</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {([
                          { col: 'col1' as const, num: '1', title: '我是誰？', items: TASK4_COL1, color: 'text-red-600' },
                          { col: 'col2' as const, num: '2', title: '我從何而來？', items: TASK4_COL2, color: 'text-violet-600' },
                          { col: 'col3' as const, num: '3', title: '我希望成為什麼樣的人？', items: TASK4_COL3, color: 'text-teal-600' },
                        ]).map((c) => (
                          <div key={c.col} className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-2xl p-4">
                            <h5 className={`font-black text-xs mb-3 ${c.color}`}>{c.num}　{c.title}</h5>
                            <div className="flex flex-wrap gap-2">
                              {c.items.map((item) => {
                                const chosen = g1DeclareCols[c.col].includes(item);
                                return (
                                  <button
                                    key={item}
                                    onClick={() => toggleDeclareChip(c.col, item)}
                                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border-2 transition-all cursor-pointer active:scale-98 ${
                                      chosen ? 'border-[#E65100] bg-[#E65100] text-white' : 'border-[#F1E0CE] bg-white text-[#4A321F]'
                                    }`}
                                  >
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#FFFDF9] border-2 border-dashed border-orange-200 rounded-2xl p-4">
                      <h5 className="font-black text-[11px] text-[#B4570B] mb-1.5">你的探索宣言</h5>
                      <p className="text-xs font-bold text-[#4A321F] leading-relaxed">
                        你重視……{[...g1DeclareCols.col1, ...g1DeclareCols.col2].join('、') || '（尚未選擇）'}
                        {g1DeclareCols.col3.length > 0 && <>，我希望成為{g1DeclareCols.col3.join('、')}的人。</>}
                      </p>
                    </div>
                    <button onClick={finishTask4} className="w-full py-3 bg-[#C2185B] hover:bg-[#a81450] text-white font-black text-sm rounded-2xl shadow-sm transition-all cursor-pointer active:scale-98">完成探索</button>
                  </div>
                )}

                {g1Stage === 'gate' && (
                  /* ---------- 幸福之門：選擇行動 ---------- */
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 text-center">
                      <h3 className="font-black text-[#4A321F] text-sm">五把鑰匙已齊，選擇你願意實踐的行動，開啟屬於你的幸福之門！</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {GATE_ACTIONS.map((action) => {
                        const chosen = g1GateAction === action;
                        return (
                          <button
                            key={action}
                            onClick={() => setG1GateAction(action)}
                            className={`p-4 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer active:scale-98 ${
                              chosen ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-200' : 'border-[#F1E0CE] bg-white text-[#4A321F] hover:border-amber-200'
                            }`}
                          >
                            {action}
                          </button>
                        );
                      })}
                    </div>
                    {g1GateAction && (
                      <div className="bg-white border-2 border-[#EAD5C3] rounded-2xl p-4 text-center">
                        <p className="text-xs font-bold text-[#4A321F]">我的幸福行動：約定今天<span className="text-[#E65100]">「{g1GateAction}」</span>，我將用行動實踐所學，讓幸福從今天開始發光！</p>
                      </div>
                    )}
                    <button onClick={finishGate} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer active:scale-98">✨ 開啟幸福之門</button>
                  </div>
                )}

                {g1Stage === 'summon' && (
                  /* ---------- 召喚動畫 ---------- */
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#1B1230] via-[#241938] to-[#150E24] border-2 border-[#4A3A6B] rounded-3xl p-10 shadow-lg text-center space-y-6">
                    <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(251,191,36,0.35), transparent 60%)' }} />
                    <motion.div
                      animate={{ rotateZ: [0, 3, -3, 0], y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="relative z-10 mx-auto w-36 h-52 rounded-2xl bg-gradient-to-br from-[#2b1a0e] to-[#4a2f16] border-4 border-amber-400 shadow-2xl flex items-center justify-center text-6xl"
                    >
                      🎴
                    </motion.div>
                    <div className="relative z-10 space-y-1.5">
                      <h3 className="text-lg font-black text-amber-300">你的生命英雄即將覺醒...</h3>
                      <p className="text-xs font-bold text-white/50">根據你完成的五項任務，點擊召喚屬於你的生命原型！</p>
                    </div>
                    <button
                      onClick={revealG1Result}
                      className="relative z-10 px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-[#3B2107] font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-2 mx-auto"
                    >
                      <Sparkles className="w-4 h-4" /> 點擊召喚生命英雄
                    </button>
                  </div>
                )}

                {g1Stage === 'result' && (() => {
                  /* ---------- 英雄結果卡 + 五把鑰匙雷達圖 ---------- */
                  const topKey = getTopKey();
                  const hero = KEY_ARCHETYPES[topKey];
                  const heroTextColor = hero.ring.split(' ')[1];
                  const scores = getKeyScores();
                  const maxScore = Math.max(1, ...KEY_ORDER.map(k => scores[k]));
                  const statData = KEY_ORDER.map(k => ({ stat: k, value: Math.round((scores[k] / maxScore) * 100) }));
                  const awareness = getAwarenessIndex();
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className={`relative overflow-hidden rounded-3xl border-2 p-8 shadow-lg text-center space-y-6 ${hero.ring.split(' ')[0]}`}
                      style={{ background: `linear-gradient(135deg, ${hero.from}, ${hero.to})` }}
                    >
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className={`inline-flex text-[11px] font-black px-3 py-1 rounded-full ${hero.chip}`}>傳說級 SSR</div>
                      <div className="text-7xl">{hero.emoji}</div>
                      <div className="space-y-1">
                        <h3 className={`text-3xl font-black ${heroTextColor}`}>{hero.name}</h3>
                        <p className="text-xs font-bold text-slate-500">{hero.tagline}</p>
                        <p className="text-[10.5px] font-bold text-slate-400 font-mono tracking-widest">最重視：{topKey}</p>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto font-bold bg-white/60 p-4 rounded-xl border border-white/80 text-left">
                        {hero.desc}
                      </p>

                      <div className="bg-white/70 rounded-2xl p-3 border border-white/80 max-w-sm mx-auto">
                        <h5 className="font-black text-[11px] text-slate-500 mb-1 flex items-center justify-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> 五把鑰匙面板</h5>
                        <ResponsiveContainer width="100%" height={240}>
                          <RadarChart data={statData}>
                            <PolarGrid stroke="#E5D5C0" />
                            <PolarAngleAxis dataKey="stat" tick={{ fontSize: 10.5, fontWeight: 700, fill: '#7D5C43' }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar dataKey="value" stroke="#E0812A" fill="#E0812A" fillOpacity={0.45} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="bg-white/70 rounded-2xl p-4 border border-white/80 text-left max-w-md mx-auto space-y-2">
                        <h5 className="font-black text-xs text-slate-700">🎯 推薦優先探索單元：{topKey}</h5>
                        <p className="text-[12px] font-bold text-slate-500 leading-relaxed">{hero.unitDesc}</p>
                        <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                          <span className="text-[11px] font-black text-slate-500">⏳ 生命自覺指數</span>
                          <span className="text-sm font-black text-[#E65100]">{awareness}%</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed">你在「一分鐘蒼蠅挑戰」選的 5 件事裡，有 {awareness}% 被你判斷為真正「重要」的事。</p>
                      </div>

                      <div className="bg-white/70 rounded-2xl p-4 border border-white/80 text-left max-w-md mx-auto">
                        <h5 className="font-black text-xs text-slate-700 mb-1">💫 我的幸福行動</h5>
                        <p className="text-[12px] font-bold text-slate-500">{g1GateAction}</p>
                      </div>

                      <button
                        onClick={resetG1}
                        className="px-6 py-2 border-2 border-white/70 bg-white/50 text-slate-600 font-black text-xs rounded-xl hover:bg-white/80 transition-all cursor-pointer shadow-xs active:scale-98"
                      >
                        重新開始探索
                      </button>
                    </motion.div>
                  );
                })()}
              </>
            )}
          </div>
        )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 2: LIFE PUZZLE MAP */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 2 && (
              <div id="game-view-puzzle" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                  <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">02</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">生命拼圖地圖</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">拼出生命教育地圖，認識課本五大主題。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                    <img src={GAME_BANNER_IMAGES[2]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                  {/* Left: Draggable pieces list */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left">
                      <h4 className="font-black text-[#4A321F] text-xs pb-2 mb-3 flex items-center gap-1.5">📌 <span>主題拼圖卡</span></h4>
                      <p className="text-[12px] font-bold text-slate-400 mb-3">💡 電腦：拖曳拼圖到右側空格。<br />📱 手機：點擊拼圖卡，再點擊地圖空格！</p>
                      <div className="space-y-2.5">
                        {PUZZLE_THEMES.map((t) => {
                          const isSelected = selectedPuzzleCard === t.key;
                          return (
                            <div
                              key={t.key}
                              draggable={!puzzlePlaced[t.key]}
                              onDragStart={(e) => e.dataTransfer.setData('text/plain', t.key)}
                              onClick={() => {
                                if (puzzlePlaced[t.key]) {
                                  showToast(`✨ ${t.key} 已經成功置放囉！`);
                                  return;
                                }
                                setSelectedPuzzleCard(isSelected ? null : t.key);
                                showToast(`🎯 已選擇「${t.key}」，請點擊右邊對應的空格放置！`);
                              }}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all ${
                                puzzlePlaced[t.key] 
                                  ? 'opacity-30 cursor-not-allowed bg-slate-50 border-slate-100' 
                                  : isSelected 
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 scale-102 cursor-pointer shadow-xs' 
                                    : `cursor-grab active:cursor-grabbing hover:border-orange-200 ${PUZZLE_STYLES[t.color]}`
                              }`}
                            >
                              <PuzzleBadge emoji={t.emoji} color={t.color} muted={puzzlePlaced[t.key]} />
                              <div className="text-left leading-tight">
                                <div className="text-xs font-black">{t.key}</div>
                                <div className="text-[12px] font-bold opacity-80">{t.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Puzzle board */}
                  <div className="lg:col-span-6 bg-white border-2 border-[#EAD5C3] rounded-3xl p-4 md:p-6 shadow-sm">
                    <PuzzleBoard
                      placed={puzzlePlaced}
                      selectedCard={selectedPuzzleCard}
                      onDropTheme={handlePlacePuzzle}
                      onZoneClick={handleZoneClick}
                    />
                    <p className="text-center text-[12.5px] font-bold text-slate-400 mt-3">🖐️ 拖曳拼圖或點選放置，完美拼出五大生命領域吧！</p>
                  </div>

                  {/* Right: Progress + dad tip */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left">
                      <h4 className="font-black text-[#4A321F] text-xs pb-2 mb-3 flex items-center gap-1.5">🧩 <span>拼圖完成度</span></h4>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center"
                          style={{ background: `conic-gradient(#E65100 ${(Object.values(puzzlePlaced).filter(Boolean).length / 5) * 100}%, #EAD5C3 0)` }}
                        >
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[12.5px] font-black text-[#4A321F]">
                            {Object.values(puzzlePlaced).filter(Boolean).length}/5
                          </div>
                        </div>
                        <p className="text-[12.5px] font-bold text-slate-500 leading-relaxed">
                          已完成 <b className="text-[#E65100]">{Object.values(puzzlePlaced).filter(Boolean).length}</b> 個主題，
                          再完成 {5 - Object.values(puzzlePlaced).filter(Boolean).length} 個即可解鎖獎勵！
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left">
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <img src={charDadImg} alt="可華爸爸" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <h5 className="font-black text-xs text-slate-800">可華爸爸的小提醒</h5>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        生命是一幅拼圖，每個主題都是重要的一塊，用心學習，就能拼出屬於你的生命地圖！
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Completed themes + actions */}
                <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm">
                  <h4 className="font-black text-[#4A321F] text-xs mb-3 flex items-center gap-1.5">🏅 <span>已完成的主題</span></h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                    {PUZZLE_THEMES.map((t, idx) => {
                      const isDone = puzzlePlaced[t.key];
                      const portrait = [charKehuaImg, charXiaopingImg, charXiaowenImg, charBojunImg, charGrandpaImg][idx];
                      return (
                        <div key={t.key} className={`relative overflow-hidden rounded-xl border-2 p-3 ${isDone ? PUZZLE_STYLES[t.color] : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{t.emoji}</span>
                            <span className="text-xs font-black">{t.key}</span>
                          </div>
                          <div className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${isDone ? 'bg-white/70' : 'bg-slate-200/70'}`}>
                            {isDone ? '已完成' : '尚未完成'}
                          </div>
                          {isDone && (
                            <img
                              src={portrait}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm opacity-90"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button onClick={resetPuzzle} className="px-5 py-2 border-2 border-[#F1E0CE] text-slate-500 font-black text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer">重置拼圖</button>
                    <button
                      onClick={() => {
                        const done = Object.values(puzzlePlaced).every(Boolean);
                        showToast(done ? '🎉 恭喜完成生命拼圖地圖！' : '⚠️ 還有拼圖尚未完成喔！');
                        if (done) saveGameResult('puzzle', { placed: puzzlePlaced });
                      }}
                      className="px-6 py-2 bg-[#E65100] hover:bg-[#D84315] text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                      完成送出
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 3: LIFE COMPASS SCENARIO GAME */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 3 && (
              <LifeCompassGame
                currentStudent={currentStudent}
                onSaveQuest={onSaveQuest}
                onClose={() => setActiveGameId(null)}
              />
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 4: RELATIONSHIP LINKS */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 4: RELATIONSHIP LINKS */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 4 && (
              <div id="game-view-relationships" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                  <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">04</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">人際關係連連看</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">連線人物與關係，理解陪伴與支持。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                    <img src={GAME_BANNER_IMAGES[4]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (col-span-3): Connections List */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 text-4xl opacity-5 pointer-events-none">💖</div>
                      <h4 className="font-black text-[#4A321F] text-xs border-b border-[#EAD5C3] pb-2 mb-3.5 flex items-center gap-1.5 uppercase">
                        <span>💖</span>
                        <span>已建立支持網絡 ({connections.length})</span>
                      </h4>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {connections.length === 0 ? (
                          <p className="text-[12px] text-slate-400 font-bold py-4 text-center">暫無關係連結，快在右側點擊兩個角色建立紅線吧！</p>
                        ) : (
                          connections.map((c, idx) => (
                            <div key={idx} className="bg-white border border-[#EAD5C3] p-2 rounded-xl flex justify-between items-center shadow-xs text-xs font-bold text-[#4A321F]">
                              <div className="flex items-center gap-1">
                                <span className="truncate max-w-[50px]">{c.from}</span>
                                <span className="text-[#E65100]">↔️</span>
                                <span className="truncate max-w-[50px]">{c.to}</span>
                                <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-md text-[10.5px] ml-1 shrink-0">
                                  {c.rel}
                                </span>
                              </div>

                              <button 
                                onClick={() => handleRemoveConnection(idx)}
                                className="text-slate-300 hover:text-red-500 transition-colors shrink-0 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {connections.length > 0 && (
                        <div className="pt-3 border-t border-[#EAD5C3] mt-3.5 flex flex-col gap-2">
                          <button
                            onClick={resetConnections}
                            className="w-full py-1.5 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100/50 text-xs font-black rounded-lg transition-colors cursor-pointer"
                          >
                            🔄 重置關係連線
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Unlocked Textbook Stories Feed */}
                    {connections.length > 0 && (
                      <div className="bg-[#FAFDF6] border-2 border-[#D2E4C4] rounded-3xl p-4 shadow-xs text-left">
                        <h4 className="font-black text-[#2E5A1C] text-xs pb-1.5 border-b border-[#D2E4C4] mb-2 flex items-center gap-1">
                          📖 Unlocked Relationship Stories
                        </h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                          {connections.map((c, i) => (
                            <div key={i} className="text-[11.5px] text-[#3F6A2D] bg-[#F1F9EB] p-2.5 rounded-xl border border-[#DDEED5] leading-relaxed">
                              <b>{c.from} ↔️ {c.to} ({c.rel})：</b>
                              <p className="text-slate-600 font-bold mt-1">{c.desc || '已配對成功！這是他們在生命探索中的重要夥伴關係。'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Middle Column (col-span-6): Interactive Relations Canvas */}
                  <div className="lg:col-span-6 bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm">
                    <div className="text-center mb-4 space-y-1">
                      <h3 className="text-xs font-black text-slate-500">💖 關係連線互動大畫布 💖</h3>
                      <p className="text-[12px] text-slate-400 font-bold">
                        目前已點選角色：{selectedNode ? <span className="text-purple-600 font-black bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{selectedNode}</span> : <span className="text-slate-400">請先點選下方第一個角色</span>}
                      </p>
                    </div>

                    {/* Nodes grid */}
                    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
                      {[
                        { name: '陳可華', img: charKehuaImg },
                        { name: '王博鈞', img: charBojunImg },
                        { name: '張曉萍', img: charXiaopingImg },
                        { name: '王小文', img: charXiaowenImg },
                        { name: '可華爸爸', img: charDadImg },
                        { name: '可華爺爺', img: charGrandpaImg },
                      ].map(({ name: node, img }) => (
                        <div 
                          key={node}
                          onClick={() => handleNodeClick(node)}
                          className={`p-3 border-2 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none ${
                            selectedNode === node 
                              ? 'border-purple-600 bg-purple-50 scale-102 shadow-md font-black text-purple-700' 
                              : 'border-dashed border-[#F1E0CE] bg-[#FCFAF6] hover:bg-purple-50/20 hover:border-purple-400 hover:scale-102'
                          }`}
                        >
                          <img src={img} alt={node} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs" referrerPolicy="no-referrer" />
                          <span className="text-[12.5px] font-black text-[#4A321F] mt-1.5">{node}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-3 border-t border-[#F1E0CE] pt-4 mt-4">
                      <span className="text-xs font-black text-slate-400">關係標籤：</span>
                      <div className="flex gap-1.5 flex-wrap justify-center">
                        {['家人', '死黨', '陪伴者', '支持者'].map(r => (
                          <button
                            key={r}
                            onClick={() => setSelectedRel(r)}
                            className={`px-3 py-1 text-xs font-black rounded-lg transition-all border ${
                              selectedRel === r 
                                ? 'bg-purple-600 border-purple-600 text-white shadow-xs' 
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (col-span-3): Character card */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 text-5xl opacity-10 pointer-events-none">✨</div>
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <img src={charXiaowenImg} alt="王小文" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="text-left leading-none">
                          <h5 className="font-black text-xs text-slate-800">王小文的悄悄話</h5>
                          <span className="text-[12px] text-slate-400">暖心好朋友</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        「可華，我們在世界上都不是一座孤島。看著你拉出的這條關係連結網，我才明白原來我們身邊隨時都包圍著這麼多默默支持我們的人，心裡好溫暖喔！」
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 5: VALUE SCALES */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 5: VALUE SCALES */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 5 && (
              <div id="game-view-value-scales" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                  <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">05</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">價值天平排序戰</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">排序你的價值觀，認識重要的選擇。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                    <img src={GAME_BANNER_IMAGES[5]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (col-span-3): Gravity Tilt Scales */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden flex flex-col items-center">
                      <div className="absolute -top-10 -left-10 text-4xl opacity-5 pointer-events-none">⚖️</div>
                      <h4 className="font-black text-[#4A321F] text-xs border-b border-[#EAD5C3] pb-2 mb-3.5 flex items-center gap-1.5 uppercase w-full">
                        <span>⚖️</span>
                        <span>心靈天平傾斜</span>
                      </h4>

                      <div className="w-full text-center space-y-3">
                        <div className="text-[12.5px] font-black text-slate-400">當前天平狀態</div>
                        <div className="text-xs font-black text-[#E65100] bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200 leading-tight">
                          首要核心：{valuesList[0]}
                        </div>
                      </div>

                      {/* Graphic balance scales */}
                      <div className="relative py-6 flex flex-col items-center select-none">
                        {/* Horizontal balance bar that tilts */}
                        <div 
                          className="w-44 h-3 bg-[#8D6E63] rounded-full flex justify-between px-2 transition-transform duration-500 relative"
                          style={{ transform: `rotate(${tiltValue}deg)` }}
                        >
                          <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-[#5D4037] shadow-sm flex items-center justify-center text-[10.5px] font-black -mt-2 truncate text-slate-800">
                            {valuesList[0]?.slice(0, 2)}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-[#5D4037] shadow-sm flex items-center justify-center text-[10.5px] font-black -mt-2 truncate text-slate-500">
                            {valuesList[valuesList.length - 1]?.slice(0, 2)}
                          </div>
                        </div>
                        {/* Stand */}
                        <div className="w-2.5 h-16 bg-[#5D4037]" />
                        <div className="w-16 h-2 bg-[#4E342E] rounded-t-md" />
                      </div>

                      <p className="text-[10.5px] text-[#7D6B5D] font-bold text-center leading-relaxed">
                        天平將隨著您最看重（卡片首位）與最輕忽的價值自動產生傾斜。
                      </p>
                    </div>
                  </div>

                  {/* Middle Column (col-span-6): Interactive Value Scales Ordering & Writing */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Ordering card */}
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm">
                      <h3 className="text-xs font-black text-slate-500 border-b-2 border-[#F1E0CE]/60 pb-3 mb-4">🔄 拖曳微調價值優先順序</h3>
                      
                      <div className="space-y-2 text-left">
                        {valuesList.map((val, idx) => (
                          <div 
                            key={val}
                            className="bg-[#FCFAF7] border-2 border-[#F1E0CE]/50 px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs text-xs font-black text-[#4A321F] hover:border-[#E65100]/60 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-[#E65100]/10 text-[#E65100] flex items-center justify-center font-black text-[12px]">
                                {idx + 1}
                              </span>
                              <span>{val}</span>
                            </div>

                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => moveValue(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 px-2 border-2 border-slate-200 hover:border-orange-300 rounded-lg bg-white disabled:opacity-30 cursor-pointer text-[12px] hover:bg-orange-50 active:scale-95 transition-all font-black"
                              >
                                ⬆️
                              </button>
                              <button 
                                onClick={() => moveValue(idx, 'down')}
                                disabled={idx === valuesList.length - 1}
                                className="p-1 px-2 border-2 border-slate-200 hover:border-orange-300 rounded-lg bg-white disabled:opacity-30 cursor-pointer text-[12px] hover:bg-orange-50 active:scale-95 transition-all font-black"
                              >
                                ⬇️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reflection input card */}
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm space-y-3">
                      <h3 className="text-xs font-black text-slate-500 flex items-center gap-1.5 border-b-2 border-[#F1E0CE]/60 pb-3">
                        <span>📝</span>
                        <span>我的價值反思（寫作大廳同步）</span>
                      </h3>
                      <textarea
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        placeholder="請用一兩句話寫下：為什麼您會做出這樣的價值優先順序選擇？這代表您最想守護的是什麼？"
                        className="w-full h-24 p-3 border-2 border-[#F1E0CE] rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#E65100] bg-[#FAF8F5]/30 focus:bg-white transition-all resize-none"
                      />
                      <div className="flex justify-end">
                        <button 
                          onClick={saveReflection}
                          className="px-5 py-2 bg-[#E65100] hover:bg-[#D84315] text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer active:scale-98 transition-transform"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>儲存我的反思</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (col-span-3): Father's guidance */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 text-5xl opacity-10 pointer-events-none">🌿</div>
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <img src={charDadImg} alt="可華爸爸" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="text-left leading-none">
                          <h5 className="font-black text-xs text-slate-800">可華爸爸的引導</h5>
                          <span className="text-[12px] text-slate-400">生命諮商導師</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        「小博，在『自由』與『責任』之間，我們每個人都在尋求一種平衡。自由給予我們飛翔的羽翼，而責任則是拉住風箏的那根線。想一想，若一味追求其中一個，生命會面臨什麼樣的失衡呢？」
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 6: LIFE STORY FLIP CARDS */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 6: LIFE STORY FLIP CARDS */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 6 && (
              <div id="game-view-life-memory" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                  <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">06</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">生命故事翻翻卡</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">翻開故事卡，配對對應的生命主題。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                    <img src={GAME_BANNER_IMAGES[6]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (col-span-3): Matching Guide */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 text-4xl opacity-5 pointer-events-none">⭐</div>
                      <h4 className="font-black text-[#4A321F] text-xs border-b border-[#EAD5C3] pb-2 mb-3 flex items-center gap-1.5 uppercase">
                        <span>⭐</span>
                        <span>生命價值配對指南</span>
                      </h4>

                      <ul className="text-[12.5px] text-[#7D6B5D] font-bold space-y-2.5 leading-relaxed">
                        <li className="flex items-start gap-1">
                          <span className="text-[#E65100]">🎯</span>
                          <span><b>勇氣</b> ↔ 面對困難仍然堅定前行</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-[#E65100]">🎯</span>
                          <span><b>同理</b> ↔ 站在同學角度設身處地</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-[#E65100]">🎯</span>
                          <span><b>責任</b> ↔ 切實履行給家人的諾言</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-[#E65100]">🎯</span>
                          <span><b>夢想</b> ↔ 堅定追尋心中喜愛的世界</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-[#E65100]">🎯</span>
                          <span><b>感恩</b> ↔ 對他人的熱心由衷說謝謝</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-[#E65100]">🎯</span>
                          <span><b>尊重</b> ↔ 欣賞班上每個人獨特之處</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Middle Column (col-span-6): Interactive Card Play Area */}
                  <div className="lg:col-span-6 bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center border-b-2 border-[#F1E0CE]/60 pb-3 mb-4 text-xs font-black text-[#4A321F]">
                      <div className="flex gap-4">
                        <span className="bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">計步：{memoryMoves} 步</span>
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">得分：{memoryScore} 分</span>
                      </div>
                      <button 
                        onClick={initMemoryGame}
                        className="text-pink-600 font-extrabold flex items-center gap-1 hover:underline cursor-pointer bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>重新洗牌</span>
                      </button>
                    </div>

                    {memoryFinished ? (
                      <div className="text-center py-8 space-y-4">
                        <div className="text-4xl animate-bounce">🏆</div>
                        <h3 className="text-lg font-black text-rose-600">恭喜全班成功配對所有生命故事！</h3>
                        <p className="text-xs text-slate-400 font-bold">總計花費了 {memoryMoves} 步，獲得 {memoryScore} 分！</p>
                        <button 
                          onClick={initMemoryGame}
                          className="px-6 py-2 bg-[#E65100] hover:bg-[#D84315] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          再玩一次
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {cards.map((card) => (
                          <div 
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className={`aspect-square rounded-2xl flex items-center justify-center text-center p-2 border-2 text-[12.5px] font-black transition-all cursor-pointer select-none ${
                              card.isMatched 
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 scale-95 shadow-inner' 
                                : card.isFlipped 
                                  ? 'bg-rose-50 border-rose-300 text-rose-800 rotate-1 shadow-xs' 
                                  : 'bg-[#FCFAF7] border-[#F1E0CE] text-slate-400 hover:border-pink-400 hover:bg-[#FFFBF5] relative overflow-hidden hover:scale-102'
                            }`}
                          >
                            {card.isFlipped || card.isMatched ? (
                              <span className="leading-tight font-black">{card.text}</span>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-lg">⭐</span>
                                <span className="text-[10.5px] text-slate-400 font-bold mt-1">點擊翻轉</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column (col-span-3): Encouragement character card */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 text-5xl opacity-10 pointer-events-none">✨</div>
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <img src={charXiaopingImg} alt="張曉萍" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="text-left leading-none">
                          <h5 className="font-black text-xs text-slate-800">張曉萍的小提醒</h5>
                          <span className="text-[12px] text-slate-400">貼心好同學</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        「可華，在記憶卡片的翻轉中，你是不是也發現生命情境故事與內在核心價值，其實是緊密呼應、互相陪伴的呢？靜下心來，你一定能完全配對成功的！」
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 7: GRATITUDE BUBBLE WALL */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 7: GRATITUDE BUBBLE WALL */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 7 && (
              <div id="game-view-gratitude-bubbles" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                  <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">07</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">感恩泡泡站</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">寫下感謝的話，讓溫暖在班上飄散。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                    <img src={GAME_BANNER_IMAGES[7]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-[#4A321F]">
                  
                  {/* Left Column (col-span-3): Warmth Index Display */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 text-4xl opacity-5 pointer-events-none">🎈</div>
                      <h4 className="font-black text-[#4A321F] text-xs border-b border-[#EAD5C3] pb-2 mb-4 flex items-center gap-1.5 uppercase">
                        <span>💖</span>
                        <span>班級感恩溫暖指數</span>
                      </h4>

                      <div className="text-center space-y-3 py-2">
                        <div className="text-4xl font-black text-rose-500 font-mono animate-pulse">
                          {warmthIndex} ℃
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500" 
                            style={{ width: `${warmthIndex}%` }} 
                          />
                        </div>
                        <p className="text-[12px] text-slate-400 font-bold leading-relaxed">
                          每發送一顆泡泡，班級感恩指數就會上升 2℃！大家攜手共創班級大愛，點亮我們的幸福世界！
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EAD5C3]/60 flex items-center justify-between text-[12.5px] font-black text-slate-500">
                        <span>已發送泡泡總數</span>
                        <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">{bubbles.length} 個</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column (col-span-6): Send Form & Floating Bubbles Wall */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Send Form */}
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm space-y-4 text-left">
                      <h3 className="text-xs font-black text-slate-500 border-b-2 border-[#F1E0CE]/60 pb-3 flex items-center gap-1">
                        <span>✍️</span>
                        <span>撰寫您的溫馨感恩卡</span>
                      </h3>

                      <form onSubmit={handleSendBubble} className="space-y-4">
                        <div>
                          <textarea
                            value={gratitudeMsg}
                            onChange={(e) => setGratitudeMsg(e.target.value)}
                            placeholder="在這裡寫下您想對同學、老師或家人表達的誠摯謝意與溫暖話語..."
                            rows={3}
                            maxLength={120}
                            className="w-full px-4 py-3 border-2 border-[#F1E0CE] rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 bg-[#FAF8F5]/30 focus:bg-white transition-all resize-none leading-relaxed"
                          />
                          <div className="text-right text-[12px] text-slate-400 font-bold mt-1">
                            最多 120 字（當前：{gratitudeMsg.length} 字）
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          {/* Color Picker & Anon Toggle */}
                          <div className="space-y-2 text-left">
                            <span className="text-[12px] text-slate-400 font-black block">選擇泡泡背景色：</span>
                            <div className="flex items-center gap-2">
                              {[
                                { color: '#FED7AA', label: '暖橘' },
                                { color: '#FBCFE8', label: '粉櫻' },
                                { color: '#D9F99D', label: '青葉' },
                                { color: '#BAE6FD', label: '晴藍' }
                              ].map(b => (
                                <button
                                  key={b.color}
                                  type="button"
                                  onClick={() => setBubbleColor(b.color)}
                                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                                    bubbleColor === b.color 
                                      ? 'border-[#E65100] scale-110 shadow-xs' 
                                      : 'border-transparent scale-100 hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: b.color }}
                                  title={b.label}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 text-xs font-black text-slate-500 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-2 border-[#EAD5C3] rounded-sm focus:ring-0 cursor-pointer"
                              />
                              <span>匿名送出</span>
                            </label>

                            <button
                              type="submit"
                              disabled={!gratitudeMsg.trim()}
                              className={`px-5 py-2.5 rounded-2xl text-xs font-black text-white shadow-3xs flex items-center gap-1.5 active:scale-98 transition-all cursor-pointer ${
                                gratitudeMsg.trim() 
                                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' 
                                  : 'bg-slate-300 pointer-events-none'
                              }`}
                            >
                              <span>🎈 送出泡泡</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Bubbles Wall Display */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-500 text-left flex items-center gap-1 pl-2">
                        <span>🎈</span>
                        <span>感恩泡泡即時飄浮牆（最新升空）</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {bubbles.map((b, idx) => (
                          <div
                            key={idx}
                            style={{ backgroundColor: b.color }}
                            className="p-4 rounded-3xl shadow-xs border-2 border-white text-left space-y-2 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-12 h-12 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0,transparent_60%)] pointer-events-none rounded-full" />
                            <p className="text-[12.5px] font-black text-slate-800 leading-relaxed">
                              「{b.text}」
                            </p>
                            <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-500 pt-1 border-t border-black/5">
                              <span>來自：{b.sender}</span>
                              <span className="text-[12px] tracking-wide uppercase px-1.5 py-0.5 bg-white/40 rounded-md border border-white/20">🎈 溫暖升空</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (col-span-3): Encouragement character card */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 text-5xl opacity-10 pointer-events-none">✨</div>
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <img src={charXiaopingImg} alt="張曉萍" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="text-left leading-none">
                          <h5 className="font-black text-xs text-slate-800">張曉萍的小提醒</h5>
                          <span className="text-[12px] text-slate-400">貼心好同學</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        「可華，在感恩泡泡升空的那一刻，我深深感覺到心靈被溫柔地包裹。學會看見別人的好、心存感激，就像是在黑夜裡點亮一盞盞明亮的小橘燈。這就是生命教育裡最美的『同理與感恩』喔！」
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 8: PHILOSOPHICAL DEBATE */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 8 && (
              <div id="game-view-debate" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                  <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">08</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">哲學辯論快攻</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">用觀點與理由展開思辨挑戰。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                    <img src={GAME_BANNER_IMAGES[8]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (col-span-3): Live Poll Stats */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 text-4xl opacity-5 pointer-events-none">🗳️</div>
                      <h4 className="font-black text-[#4A321F] text-xs border-b border-[#EAD5C3] pb-2 mb-4 flex items-center gap-1.5 uppercase">
                        <span>🗳️</span>
                        <span>班級投票即時看板</span>
                      </h4>

                      <div className="space-y-4 text-xs font-black">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[12.5px] text-blue-600">
                            <span>🔵 正方：王博鈞</span>
                            <span>{debateVotes.pro} 票 ({(debateVotes.pro / Math.max(1, debateVotes.pro + debateVotes.con) * 100).toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(debateVotes.pro / Math.max(1, debateVotes.pro + debateVotes.con) * 100)}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[12.5px] text-red-600">
                            <span>🔴 反方：陳可華</span>
                            <span>{debateVotes.con} 票 ({(debateVotes.con / Math.max(1, debateVotes.pro + debateVotes.con) * 100).toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${(debateVotes.con / Math.max(1, debateVotes.pro + debateVotes.con) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column (col-span-6): Interactive Debate Cards & Comments */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Viewpoint Cards side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pro Card */}
                      <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">🔵</span>
                            <div>
                              <h4 className="font-black text-xs text-slate-800">正方觀點：王博鈞</h4>
                              <span className="text-[10.5px] text-slate-400 font-bold block">「幸福是生命唯一的終極指針」</span>
                            </div>
                          </div>
                          <p className="text-[12.5px] text-[#5D4037] leading-relaxed font-bold bg-[#FAF5EC]/30 p-3 rounded-xl border border-[#F1E0CE]/30">
                            「如果一個人取得了世俗成功，內心卻空虛無比、每天失眠，這有意義嗎？我們拼搏的所有事物，都是為了獲取內在的幸福。所以幸福才是目的，成功只是手段。」
                          </p>
                        </div>

                        <button 
                          onClick={() => handleVote('pro')}
                          className={`w-full py-2.5 border-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1 active:scale-98 ${
                            userVote === 'pro' 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                              : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          <span>支持 正方王博鈞</span>
                        </button>
                      </div>

                      {/* Con Card */}
                      <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">🔴</span>
                            <div>
                              <h4 className="font-black text-xs text-slate-800">反方觀點：陳可華</h4>
                              <span className="text-[10.5px] text-slate-400 font-bold block">「成功為幸福構築安全堡壘」</span>
                            </div>
                          </div>
                          <p className="text-[12.5px] text-[#5D4037] leading-relaxed font-bold bg-[#FAF5EC]/30 p-3 rounded-xl border border-[#F1E0CE]/30">
                            生命如果缺乏足夠的現實資源和耕耘成功，幸福往往只是脆弱的泡沫。在學業、事業上取得成功，能極大拓展我們的自由，讓我們能守護家人的幸福！
                          </p>
                        </div>

                        <button 
                          onClick={() => handleVote('con')}
                          className={`w-full py-2.5 border-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1 active:scale-98 ${
                            userVote === 'con' 
                              ? 'bg-red-600 border-red-600 text-white shadow-xs' 
                              : 'border-red-500 text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <span>支持 反方陳可華</span>
                        </button>
                      </div>
                    </div>

                    {/* Chat Comments Box */}
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-500 border-b-2 border-[#F1E0CE]/60 pb-3 flex items-center gap-1">
                        <span>🗣️</span>
                        <span>觀戰大廳彈幕評論席</span>
                      </h3>
                      
                      <form onSubmit={handleAddComment} className="flex gap-2 text-left">
                        <input
                          type="text"
                          value={debateComment}
                          onChange={(e) => setDebateComment(e.target.value)}
                          placeholder="發表您的關鍵論點或反駁想法..."
                          className="flex-1 px-3 py-2 border-2 border-[#F1E0CE] rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 bg-[#FAF8F5]/30 focus:bg-white transition-all"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-98 transition-transform"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>發言</span>
                        </button>
                      </form>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-left">
                        {comments.map((c, idx) => (
                          <div key={idx} className="bg-[#FCFAF7]/60 border border-[#EAD5C3]/40 p-2.5 rounded-xl text-xs font-black flex gap-2">
                            <span className="shrink-0 text-xs">
                              {c.side === 'pro' && '🔵'}
                              {c.side === 'con' && '🔴'}
                              {c.side === 'teacher' && '👩🏻‍🏫'}
                              {c.side === 'spectator' && '💬'}
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-[10.5px] text-slate-400 font-bold block">{c.user}</span>
                              <p className="text-[#5D4037] leading-normal">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (col-span-3): Character suggestion */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 text-5xl opacity-10 pointer-events-none">✨</div>
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <img src={charXiaopingImg} alt="張曉萍" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="text-left leading-none">
                          <h5 className="font-black text-xs text-slate-800">張曉萍的悄悄話</h5>
                          <span className="text-[12px] text-slate-400">貼心好同學</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        「可華，思辨是通往真理的起點。當我們試著站在對方或完全不同的角度去思考『成功』與『幸福』時，就會發現生命比我們想像的還要多元、厚重，非常有意思喔！」
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 9: MOOD THERMOMETER */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 9: MOOD THERMOMETER */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 9 && (
              <div id="game-view-mood" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
                  <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">09</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">心情溫度計</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">辨識今天的情緒，學習理解自己。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2">
                    <img src={GAME_BANNER_IMAGES[9]} alt="" className="h-24 md:h-28 w-auto object-contain rounded-2xl" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (col-span-3): Recharts Pie Chart representing Class Mood stats */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 text-4xl opacity-5 pointer-events-none">📊</div>
                      <h4 className="font-black text-[#4A321F] text-xs border-b border-[#EAD5C3] pb-2 mb-4 flex items-center gap-1.5 uppercase">
                        <span>📊</span>
                        <span>全班心情即時分佈</span>
                      </h4>

                      <div className="h-40 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: '非常開心', value: 25 },
                                { name: '開心愉悅', value: 30 },
                                { name: '心情普通', value: 25 },
                                { name: '低落', value: 20 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={55}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#f43f5e" /> {/* Rose */}
                              <Cell fill="#fb923c" /> {/* Orange */}
                              <Cell fill="#94a3b8" /> {/* Slate */}
                              <Cell fill="#3b82f6" /> {/* Blue */}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-1.5 text-[10.5px] font-black">
                        <div className="flex items-center justify-between text-rose-500">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />非常開心</span>
                          <span>25%</span>
                        </div>
                        <div className="flex items-center justify-between text-orange-500">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" />開心愉悅</span>
                          <span>30%</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" />心情普通</span>
                          <span>25%</span>
                        </div>
                        <div className="flex items-center justify-between text-blue-500">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />低落悶悶</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column (col-span-6): Personal slider & History log */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Slider Card */}
                    <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm space-y-6 text-center">
                      <div className="py-2 space-y-2">
                        <div className="text-5xl animate-bounce">
                          {moodEmojis[moodLevel - 1].emoji}
                        </div>
                        <h3 className={`text-sm font-black ${moodEmojis[moodLevel - 1].color}`}>
                          當前選定心情：{moodEmojis[moodLevel - 1].label}
                        </h3>
                      </div>

                      {/* Slider Interaction */}
                      <div className="space-y-4 max-w-md mx-auto text-left">
                        <input
                          type="range"
                          min="1"
                          max="6"
                          step="1"
                          value={moodLevel}
                          onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                          className="w-full accent-rose-500 h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer"
                        />

                        <div className="flex justify-between text-[12px] font-black text-slate-400">
                          <span>😢 1.非常低落</span>
                          <span>😐 3.普通</span>
                          <span>🥳 6.超級開心</span>
                        </div>
                      </div>

                      <div className="border-t-2 border-[#F1E0CE]/60 pt-4 space-y-3 text-left">
                        <h4 className="text-xs font-black text-slate-500">✍️ 寫下我的今天心情札記（大廳匿名發布）</h4>
                        <textarea
                          value={moodNote}
                          onChange={(e) => setMoodNote(e.target.value)}
                          placeholder="今天放學後雖然練球有點累，但是和曉萍一起喝了冰涼的麥茶，覺得很充實..."
                          className="w-full h-20 p-3 border-2 border-[#F1E0CE] rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-500 bg-[#FAF8F5]/30 focus:bg-white resize-none transition-all"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleSaveMood}
                            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer active:scale-98 transition-transform"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>儲存心情紀錄</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* History List */}
                    {savedMoods.length > 0 && (
                      <CollapsibleSection
                        icon={<span className="text-base">🌡️</span>}
                        title="我的歷史心情紀錄表"
                        subtitle={`共 ${savedMoods.length} 筆心情紀錄`}
                        defaultExpanded={true}
                      >
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-left">
                          {savedMoods.map((m, idx) => (
                            <div key={idx} className="bg-[#FCFAF7] border border-[#EAD5C3]/40 p-2.5 rounded-xl flex items-center gap-3 text-xs font-black shadow-3xs">
                              <span className="text-2xl shrink-0">{moodEmojis[m.level - 1].emoji}</span>
                              <div className="text-left">
                                <span className="text-[10.5px] text-slate-400 font-bold block">{m.date} ‧ {moodEmojis[m.level - 1].label}</span>
                                <p className="text-[#5D4037] leading-normal">{m.note}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleSection>
                    )}
                  </div>

                  {/* Right Column (col-span-3): Companion suggestion card */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 text-5xl opacity-10 pointer-events-none">✨</div>
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <img src={charKehuaImg} alt="陳可華" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="text-left leading-none">
                          <h5 className="font-black text-xs text-slate-800">陳可華的小建議</h5>
                          <span className="text-[12px] text-slate-400">同桌好夥伴</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        「曉萍，無論今天是雨天、陰天還是晴天，心情溫度計都只是記錄此時此刻的自己。溫柔地接納自己的每種情緒，不加評判地擁抱自己，就是送給心靈最棒的禮物喔！」
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 10: BADGE CHALLENGE */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {/* GAME VIEW 10: BADGE CHALLENGE */}
            {/* ------------------------------------------------------------------------------------------------- */}
            {activeGameId === 10 && (
              <div id="game-view-badge" className="space-y-6">
                {/* 1. Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
                  <div className="absolute left-2 top-2 w-20 h-20 opacity-90 pointer-events-none select-none">
                    <img src={lobbyFloral} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#E65100] text-white flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-md">10</div>
                    <div className="space-y-1 text-left">
                      <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">成長徽章挑戰賽</h2>
                      <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">完成任務、收集徽章、看見自己的成長。</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center z-10 shrink-0 pr-2 max-w-[340px]">
                    <img src={badgeHero} alt="" className="w-full h-auto object-contain" />
                  </div>
                </div>

                {/* 2. Three-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (col-span-3): Achievement levels */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FCFAF7] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 text-4xl opacity-5 pointer-events-none">🏆</div>
                      <h4 className="font-black text-[#4A321F] text-xs border-b border-[#EAD5C3] pb-2 mb-4 flex items-center gap-1.5 uppercase">
                        <span>🏆</span>
                        <span>我的今日解鎖進度</span>
                      </h4>

                      <div className="text-center space-y-3 py-4">
                        <div className="text-4xl font-black text-emerald-600 font-mono">
                          {unlockedBadgeCount} / {badgeTasks.length}
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-300" 
                            style={{ width: `${(unlockedBadgeCount / badgeTasks.length) * 100}%` }} 
                          />
                        </div>
                        <p className="text-[12px] text-slate-400 font-bold leading-relaxed">
                          持續點亮更多實踐任務！導師會在學習後台同步看見您優異的生命行動力，並給予綜合點評加分！
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column (col-span-6): Tasks Checklist and Badge display shelf */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Tasks Checklist */}
                    <CollapsibleSection
                      icon={<span className="text-base">🎯</span>}
                      title="點亮我的成長軌跡（本週實踐任務）"
                      subtitle="點擊勾選完成的實踐任務"
                      defaultExpanded={true}
                    >
                      <div className="space-y-3 text-left">
                        {badgeTasks.map(t => (
                          <div 
                            key={t.id}
                            onClick={() => toggleBadgeTask(t.id)}
                            className="bg-[#FCFAF7]/50 border-2 border-[#EAD5C3]/40 p-3 rounded-2xl flex items-center justify-between shadow-3xs cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/10 transition-all group"
                          >
                            <div className="flex items-center gap-3 text-xs font-black text-slate-700">
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                t.done 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-3xs' 
                                  : 'border-[#EAD5C3] bg-white group-hover:border-emerald-500'
                              }`}>
                                {t.done && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className={t.done ? 'line-through text-slate-400 font-bold' : 'font-black'}>{t.text}</span>
                            </div>

                            <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-lg border ${
                              t.done 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                              🏆 解鎖：{t.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>

                    {/* My Badges Display */}
                    <CollapsibleSection
                      icon={<span className="text-base">🏅</span>}
                      title="我的班級勳章展示架"
                      subtitle={`已解鎖 ${unlockedBadgeCount} / ${badgeTasks.length} 個勳章`}
                      defaultExpanded={true}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-2">
                        {badgeTasks.map(t => (
                          <div 
                            key={t.id}
                            className={`p-4 border-2 rounded-2xl flex flex-col items-center text-center justify-between shadow-3xs transition-all relative ${
                              t.done 
                                ? 'bg-[#F0FDF4]/60 border-emerald-300 text-emerald-800 scale-100 overflow-hidden shadow-xs' 
                                : 'bg-slate-50 border-slate-200 text-slate-300 opacity-60 scale-98 select-none'
                            }`}
                          >
                            {t.done && <div className="absolute -top-1 -right-1 text-[12px] bg-amber-400 text-white px-1.5 py-0.5 rounded-bl-xl shadow-3xs font-black">⭐</div>}
                            {BADGE_ARTWORK[t.badge] ? (
                              <img src={BADGE_ARTWORK[t.badge]} alt={t.badge} className={`w-16 h-16 object-contain mb-1 ${t.done ? '' : 'grayscale opacity-60'}`} />
                            ) : (
                              <span className="text-3xl mb-1.5">{t.done ? '🎖️' : '🔒'}</span>
                            )}
                            <span className="text-xs font-black tracking-wide leading-tight">{t.badge}</span>
                            <span className="text-[10.5px] font-bold text-slate-400 mt-1.5 leading-normal">
                              {t.done ? '已點亮解鎖' : '尚未解鎖'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  </div>

                  {/* Right Column (col-span-3): Instructor encouragement card */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <span className="text-base">⭐</span>
                        <h5 className="font-black text-xs text-slate-800">今日推薦任務</h5>
                      </div>
                      <img src={badgeRecommendTask} alt="感恩小行動" className="w-full h-auto object-contain rounded-xl mb-3" />
                      <p className="text-xs font-black text-[#4A321F] mb-1">感恩小行動</p>
                      <p className="text-[12px] text-slate-400 font-bold leading-relaxed mb-3">對身邊的人表達感謝，讓溫暖在你我之間傳遞。</p>
                      <button
                        onClick={() => showToast('🌟 前往完成「感恩小行動」任務！')}
                        className="w-full py-2 bg-white border-2 border-[#F1E0CE] hover:border-[#E65100] text-[#E65100] font-black text-xs rounded-xl transition-all shadow-3xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>立即前往</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 text-5xl opacity-10 pointer-events-none">✨</div>
                      <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-2.5 mb-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-lg shadow-sm">👩🏻‍🏫</div>
                        <div className="text-left leading-none">
                          <h5 className="font-black text-xs text-slate-800">林美蘭導師的期許</h5>
                          <span className="text-[12px] text-slate-400">生命教育指導老師</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-[#7D5C43] leading-relaxed font-bold bg-[#FAF5EC]/40 p-3.5 rounded-xl border border-[#F1E0CE]/40">
                        「同學們，每一個在展示架上亮起的勳章，都記錄了你們在真實生命旅程中朝向真善美邁出的一小步。生命教育不是硬邦邦的課本教條，而是此時此刻你們在日常生活中的勇敢實踐喔！」
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
