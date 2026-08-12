/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 工具箱（只有老師看得到）
 *
 * 上課當下會用到的五件小事，全部在瀏覽器裡跑，不需要後端：
 *   1. 隨機抽人   2. 課堂計時器   3. 隨機分組
 *   4. 評語範本   5. 匯出全班作答 CSV
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dice5,
  Timer,
  Users,
  MessageSquareQuote,
  Download,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Shuffle
} from 'lucide-react';
import { StudentSubmission, UserProfile } from '../types';
import {
  UNITS_ORDER,
  UNIT_SHORT_NAMES,
  buildQuestionList,
  formatAnswerValue
} from '../questions';

interface ToolboxTabProps {
  submissions: StudentSubmission[];
  registeredUsers?: UserProfile[];
  currentUser?: UserProfile | null;
}

const COMMENT_TEMPLATES: { tag: string; text: string }[] = [
  { tag: '肯定思考', text: '你把自己的經驗放進來一起想，這一段讀起來很有溫度。老師看見你在認真對待自己的生命。' },
  { tag: '鼓勵深入', text: '方向抓得很好！可以再往下追一句「為什麼我會這樣想？」，答案會更貼近你自己。' },
  { tag: '同理關懷', text: '你願意站在對方的位置想一遍，這是生命教育最重要的能力之一，繼續保持。' },
  { tag: '邏輯提醒', text: '這裡的推論可以再檢查一次：前提是不是真的成立？換一個角度會不會有別的可能？' },
  { tag: '實踐邀請', text: '寫得很好，接下來試著把它變成一件這禮拜就做得到的小事，下次上課跟大家分享。' },
  { tag: '溫柔催交', text: '這一份還沒送出來喔，老師很想看看你的想法，寫幾句也可以，先交再說。' }
];

const TIMER_PRESETS = [1, 3, 5, 10];

/** 倒數結束的提示音，用 Web Audio 直接合成，不需要音檔 */
function beep() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.28, 0.56].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = i === 2 ? 1046.5 : 784;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.26);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch (e) { /* 沒有音效也不影響計時 */ }
}

function ToolCard({
  icon,
  title,
  subtitle,
  children
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#EAD5C3] rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center gap-3 border-b border-[#F5EDE3] pb-3">
        <div className="w-11 h-11 rounded-xl bg-[#FFF3E0] border border-[#F5C99B] flex items-center justify-center text-[#E65100] shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-[#3E2723]">{title}</h3>
          <p className="text-[11px] font-medium text-[#8D6E63] truncate">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ToolboxTab({ submissions, registeredUsers, currentUser }: ToolboxTabProps) {
  // 班級名單：使用者清單裡的學生，再補上只存在於作答資料裡的人
  const roster = useMemo(() => {
    const names: string[] = [];
    const seen = new Set<string>();
    (registeredUsers || []).filter(u => u.role === 'student').forEach(u => {
      seen.add(u.id);
      names.push(u.name);
    });
    submissions.forEach(s => {
      if (seen.has(s.studentId)) return;
      seen.add(s.studentId);
      names.push(s.studentName);
    });
    return names;
  }, [registeredUsers, submissions]);

  /* ---------- 1. 隨機抽人 ---------- */
  const [picked, setPicked] = useState<string | null>(null);
  const [pickedHistory, setPickedHistory] = useState<string[]>([]);
  const [avoidRepeat, setAvoidRepeat] = useState(true);
  const [rolling, setRolling] = useState(false);

  const drawStudent = () => {
    const pool = avoidRepeat ? roster.filter(n => !pickedHistory.includes(n)) : roster;
    const candidates = pool.length > 0 ? pool : roster;
    if (candidates.length === 0) return;

    setRolling(true);
    let ticks = 0;
    const spin = setInterval(() => {
      setPicked(roster[Math.floor(Math.random() * roster.length)]);
      ticks += 1;
      if (ticks >= 12) {
        clearInterval(spin);
        const final = candidates[Math.floor(Math.random() * candidates.length)];
        setPicked(final);
        setPickedHistory(prev => (prev.includes(final) ? prev : [...prev, final]));
        setRolling(false);
      }
    }, 70);
  };

  /* ---------- 2. 計時器 ---------- */
  const [totalSec, setTotalSec] = useState(180);
  const [leftSec, setLeftSec] = useState(180);
  const [running, setRunning] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setLeftSec(prev => {
        if (prev <= 1) {
          window.clearInterval(tickRef.current!);
          setRunning(false);
          beep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [running]);

  const setPreset = (min: number) => {
    setRunning(false);
    setTotalSec(min * 60);
    setLeftSec(min * 60);
  };

  const mmss = `${String(Math.floor(leftSec / 60)).padStart(2, '0')}:${String(leftSec % 60).padStart(2, '0')}`;
  const progress = totalSec ? (leftSec / totalSec) * 100 : 0;

  /* ---------- 3. 隨機分組 ---------- */
  const [groupCount, setGroupCount] = useState(3);
  const [groups, setGroups] = useState<string[][]>([]);

  const makeGroups = () => {
    const shuffled = [...roster].sort(() => Math.random() - 0.5);
    const n = Math.max(1, Math.min(groupCount, shuffled.length || 1));
    const buckets: string[][] = Array.from({ length: n }, () => []);
    shuffled.forEach((name, i) => buckets[i % n].push(name));
    setGroups(buckets);
  };

  /* ---------- 4. 評語範本 ---------- */
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const copyTemplate = async (tpl: { tag: string; text: string }) => {
    try {
      await navigator.clipboard.writeText(tpl.text);
      setCopiedTag(tpl.tag);
      setTimeout(() => setCopiedTag(null), 1800);
    } catch (e) { /* 瀏覽器擋剪貼簿就算了 */ }
  };

  /* ---------- 5. 匯出全班作答 CSV ---------- */
  const [exported, setExported] = useState(false);

  const exportCsv = () => {
    const esc = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows: string[] = [
      ['學生', '單元', '頁碼', '題目', '學生作答', '老師回覆', '回覆時間', '是否提交', '提交時間'].map(esc).join(',')
    ];

    submissions.forEach(sub => {
      UNITS_ORDER.forEach(unitId => {
        const ws = sub.unitWorksheets?.[unitId];
        if (!ws) return;
        const questions = buildQuestionList(unitId, [ws]);
        questions.forEach(q => {
          const answer = formatAnswerValue(q, ws.answers?.[q.id]);
          const reply = ws.replies?.[q.id];
          if (!answer && !reply) return;
          rows.push([
            sub.studentName,
            UNIT_SHORT_NAMES[unitId] || unitId,
            q.code,
            q.title,
            answer,
            reply?.text || '',
            reply?.at || '',
            ws.submitted ? '已提交' : '未提交',
            ws.submittedAt || ''
          ].map(esc).join(','));
        });
      });
    });

    // ﻿ 是 BOM，Excel 才不會把中文變亂碼
    const blob = new Blob(['﻿' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `全班作答紀錄_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const answeredRows = useMemo(() => {
    let count = 0;
    submissions.forEach(sub => {
      UNITS_ORDER.forEach(unitId => {
        const ws = sub.unitWorksheets?.[unitId];
        if (!ws) return;
        buildQuestionList(unitId, [ws]).forEach(q => {
          if (formatAnswerValue(q, ws.answers?.[q.id]) || ws.replies?.[q.id]) count += 1;
        });
      });
    });
    return count;
  }, [submissions]);

  return (
    <div className="font-sans w-full space-y-6">

      {/* 標題列 */}
      <div className="bg-white border border-[#F1E0CE] rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF3E0] border border-[#F5C99B] rounded-xl text-[#E65100]">
            <Dice5 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#3E2723] tracking-tight">課堂工具箱</h1>
            <p className="text-xs text-[#8D6E63] font-medium mt-1">
              {currentUser?.name || '老師'}專用。上課當下會用到的小工具，全部在這一頁，不用再開別的網站。
            </p>
          </div>
        </div>
        <span className="text-xs font-black text-[#B4570B] bg-[#FFF3E0] border border-[#F5C99B] px-3 py-1.5 rounded-xl self-start md:self-auto">
          👩‍🏫 老師專用
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 items-start">

        {/* 1. 隨機抽人 */}
        <ToolCard
          icon={<Dice5 className="w-5 h-5" />}
          title="隨機抽人"
          subtitle={`從全班 ${roster.length} 人中抽一位回答`}
        >
          <div className={`rounded-2xl border-2 border-dashed py-8 text-center transition-all ${
            rolling ? 'border-[#F5C99B] bg-[#FFF8F0]' : 'border-[#EAD5C3] bg-[#FCFAF6]'
          }`}>
            <span className={`text-3xl font-black ${picked ? 'text-[#E65100]' : 'text-[#D7C5B4]'}`}>
              {picked || '？？？'}
            </span>
          </div>

          <label className="flex items-center gap-2 text-[11px] font-bold text-[#8D6E63] cursor-pointer">
            <input
              type="checkbox"
              checked={avoidRepeat}
              onChange={(e) => setAvoidRepeat(e.target.checked)}
              className="accent-[#E65100] w-3.5 h-3.5"
            />
            抽過的人先不要重複（已抽 {pickedHistory.length} / {roster.length}）
          </label>

          <div className="flex gap-2">
            <button
              onClick={drawStudent}
              disabled={rolling || roster.length === 0}
              className="flex-1 py-2.5 bg-[#E65100] hover:bg-[#D84315] disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Shuffle className="w-4 h-4" />
              {rolling ? '抽籤中…' : '抽一位'}
            </button>
            <button
              onClick={() => { setPickedHistory([]); setPicked(null); }}
              className="px-3.5 py-2.5 bg-white hover:bg-[#FFF6EE] border-2 border-[#EAD5C3] text-[#8D6E63] rounded-xl transition-colors cursor-pointer"
              title="重設抽過的名單"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </ToolCard>

        {/* 2. 課堂計時器 */}
        <ToolCard
          icon={<Timer className="w-5 h-5" />}
          title="課堂計時器"
          subtitle="分組討論、限時書寫都用得到"
        >
          <div className="rounded-2xl bg-[#FCFAF6] border border-[#EAD5C3] py-6 text-center space-y-3">
            <span className={`text-4xl font-black font-mono tracking-tight ${
              leftSec === 0 ? 'text-[#D84315]' : 'text-[#3E2723]'
            }`}>
              {mmss}
            </span>
            <div className="h-2 mx-6 bg-[#F1E0CE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E65100] transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TIMER_PRESETS.map(min => (
              <button
                key={min}
                onClick={() => setPreset(min)}
                className={`px-3 py-1.5 text-[11px] font-black rounded-lg border transition-all cursor-pointer ${
                  totalSec === min * 60
                    ? 'bg-[#FFF3E0] border-[#F5C99B] text-[#B4570B]'
                    : 'bg-white border-[#EAD5C3] text-[#8D6E63] hover:border-[#E65100]'
                }`}
              >
                {min} 分
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { if (leftSec === 0) setLeftSec(totalSec); setRunning(!running); }}
              className="flex-1 py-2.5 bg-[#E65100] hover:bg-[#D84315] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? '暫停' : '開始'}
            </button>
            <button
              onClick={() => { setRunning(false); setLeftSec(totalSec); }}
              className="px-3.5 py-2.5 bg-white hover:bg-[#FFF6EE] border-2 border-[#EAD5C3] text-[#8D6E63] rounded-xl transition-colors cursor-pointer"
              title="重設"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </ToolCard>

        {/* 3. 隨機分組 */}
        <ToolCard
          icon={<Users className="w-5 h-5" />}
          title="隨機分組"
          subtitle="一鍵把全班打散成小組"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#8D6E63] shrink-0">分成</span>
            <input
              type="number"
              min={1}
              max={Math.max(1, roster.length)}
              value={groupCount}
              onChange={(e) => setGroupCount(Number(e.target.value))}
              className="w-16 bg-[#FCFAF6] border border-[#EAD5C3] rounded-lg px-2 py-1.5 text-sm font-black text-[#3E2723] outline-none focus:border-[#E65100]"
            />
            <span className="text-[11px] font-black text-[#8D6E63] shrink-0">組</span>
            <button
              onClick={makeGroups}
              disabled={roster.length === 0}
              className="ml-auto px-4 py-2 bg-[#E65100] hover:bg-[#D84315] disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              分組
            </button>
          </div>

          {groups.length === 0 ? (
            <p className="text-[11px] font-bold text-[#B0A39A] bg-[#FCFAF6] border border-dashed border-[#EAD5C3] rounded-xl p-4 text-center">
              還沒分組。按「分組」就會把 {roster.length} 位同學隨機打散。
            </p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {groups.map((g, i) => (
                <div key={i} className="bg-[#FCFAF6] border border-[#F1E0CE] rounded-xl p-3">
                  <span className="text-[10px] font-black text-[#E65100] block mb-1">第 {i + 1} 組（{g.length} 人）</span>
                  <span className="text-xs font-bold text-[#3E2723]">{g.join('、') || '（無）'}</span>
                </div>
              ))}
            </div>
          )}
        </ToolCard>

        {/* 4. 評語範本 */}
        <ToolCard
          icon={<MessageSquareQuote className="w-5 h-5" />}
          title="評語範本"
          subtitle="點一下複製，貼到批改欄再改成你的話"
        >
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {COMMENT_TEMPLATES.map(tpl => (
              <button
                key={tpl.tag}
                onClick={() => copyTemplate(tpl)}
                className="w-full text-left bg-[#FCFAF6] hover:bg-[#FFF3E0] border border-[#F1E0CE] hover:border-[#E65100] rounded-xl p-3 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-black text-[#E65100] flex items-center gap-1 mb-1">
                  {copiedTag === tpl.tag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedTag === tpl.tag ? '已複製！' : tpl.tag}
                </span>
                <span className="text-[11px] font-bold text-[#5D4037] leading-relaxed block">{tpl.text}</span>
              </button>
            ))}
          </div>
        </ToolCard>

        {/* 5. 匯出全班作答 */}
        <ToolCard
          icon={<Download className="w-5 h-5" />}
          title="匯出全班作答"
          subtitle="下載 CSV，用 Excel 打開存檔或列印"
        >
          <div className="bg-[#FCFAF6] border border-[#F1E0CE] rounded-xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-[#8D6E63] block">目前可匯出</span>
            <span className="text-2xl font-black text-[#3E2723]">{answeredRows} <span className="text-xs font-bold text-[#8D6E63]">筆作答／回覆</span></span>
            <span className="text-[10px] font-medium text-[#B0A39A] block pt-1">
              欄位：學生、單元、頁碼、題目、學生作答、老師回覆、回覆時間、是否提交、提交時間
            </span>
          </div>

          <button
            onClick={exportCsv}
            disabled={answeredRows === 0}
            className="w-full py-2.5 bg-[#E65100] hover:bg-[#D84315] disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {exported ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {exported ? '已下載！' : '下載 CSV'}
          </button>
        </ToolCard>

      </div>
    </div>
  );
}
