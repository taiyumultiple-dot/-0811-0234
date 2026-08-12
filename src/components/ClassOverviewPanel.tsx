/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 老師版「學習紀錄」＝ 全班同步狀況總覽。
 * 一列一個學生、橫向六個單元，已提交但還沒回的格子亮紅點；
 * 點任一格直接跳到那個學生那一單元的批改畫面。
 */

import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, ClipboardList, Send, TrendingUp, Users } from 'lucide-react';
import { StudentSubmission, UserProfile } from '../types';
import {
  UNITS_ORDER,
  UNIT_SHORT_NAMES,
  UnitQuestion,
  buildQuestionList,
  countAnswered,
  countPendingReplies
} from '../questions';
import SafeImageAvatar from './SafeImageAvatar';

interface ClassOverviewPanelProps {
  submissions: StudentSubmission[];
  registeredUsers?: UserProfile[];
  currentUser?: UserProfile | null;
  onOpenGrading?: (studentId: string, unitId: string) => void;
}

type CellStatus = 'none' | 'progress' | 'pending' | 'done';

interface CellInfo {
  percent: number;
  answered: number;
  total: number;
  status: CellStatus;
  alert: boolean;       // 已提交但還有題目沒回
  submittedAt?: string;
}

const STATUS_STYLE: Record<CellStatus, { box: string; label: string }> = {
  none: { box: 'bg-[#FAF6F0] border-[#EAD5C3] text-[#B0A39A] hover:border-[#D9C3AE]', label: '未開始' },
  progress: { box: 'bg-[#FFF3E0] border-[#F5C99B] text-[#B4570B] hover:border-[#E65100]', label: '進行中' },
  pending: { box: 'bg-[#E65100] border-[#D84315] text-white hover:bg-[#D84315]', label: '待批改' },
  done: { box: 'bg-[#E8F3EE] border-[#B2DCBF] text-[#2E7D32] hover:border-[#2E7D32]', label: '已批改' }
};

/** 'YYYY-MM-DD HH:mm' → Date */
const parseStamp = (stamp?: string): Date | null => {
  if (!stamp) return null;
  const d = new Date(stamp.replace(' ', 'T'));
  return isNaN(d.getTime()) ? null : d;
};

export default function ClassOverviewPanel({
  submissions,
  registeredUsers,
  currentUser,
  onOpenGrading
}: ClassOverviewPanelProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toTimeString().split(' ')[0]);
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // 班級名單：使用者清單裡的學生，再補上只存在於作答資料裡的人
  const roster = useMemo(() => {
    const list: { id: string; name: string; avatarEmoji?: string; avatarUrl?: string }[] = [];
    const seen = new Set<string>();

    (registeredUsers || [])
      .filter(u => u.role === 'student')
      .forEach(u => {
        seen.add(u.id);
        list.push({ id: u.id, name: u.name, avatarEmoji: u.avatarEmoji, avatarUrl: u.avatarUrl });
      });

    submissions.forEach(s => {
      if (seen.has(s.studentId)) return;
      seen.add(s.studentId);
      list.push({ id: s.studentId, name: s.studentName });
    });

    return list;
  }, [registeredUsers, submissions]);

  // 每個單元的題目清單只算一次
  const questionsByUnit = useMemo(() => {
    const map: Record<string, UnitQuestion[]> = {};
    UNITS_ORDER.forEach(unitId => {
      map[unitId] = buildQuestionList(unitId, submissions.map(s => s.unitWorksheets?.[unitId]));
    });
    return map;
  }, [submissions]);

  const cellOf = (studentId: string, unitId: string): CellInfo => {
    const ws = submissions.find(s => s.studentId === studentId)?.unitWorksheets?.[unitId];
    const questions = questionsByUnit[unitId] || [];
    const total = questions.length;
    const answered = countAnswered(questions, ws?.answers);
    const pending = countPendingReplies(questions, ws?.answers, ws?.replies);
    const handled = !!ws?.feedback || Object.keys(ws?.replies || {}).length > 0;

    let status: CellStatus = 'none';
    if (ws?.submitted) {
      status = pending > 0 || !handled ? 'pending' : 'done';
    } else if (answered > 0 || (ws?.readingProgress || 0) > 0) {
      status = 'progress';
    }

    return {
      percent: total ? Math.round((answered / total) * 100) : 0,
      answered,
      total,
      status,
      alert: !!ws?.submitted && pending > 0,
      submittedAt: ws?.submittedAt
    };
  };

  const grid = useMemo(() => {
    return roster.map(student => ({
      student,
      cells: UNITS_ORDER.map(unitId => ({ unitId, info: cellOf(student.id, unitId) }))
    }));
  }, [roster, questionsByUnit, submissions]);

  // 上方三個總計
  const { pendingCount, weekCount, avgPercent } = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let pending = 0;
    let week = 0;
    let answeredSum = 0;
    let totalSum = 0;

    grid.forEach(row => {
      row.cells.forEach(({ info }) => {
        if (info.status === 'pending') pending += 1;
        const stamp = parseStamp(info.submittedAt);
        if (stamp && stamp >= weekAgo) week += 1;
        answeredSum += info.answered;
        totalSum += info.total;
      });
    });

    return {
      pendingCount: pending,
      weekCount: week,
      avgPercent: totalSum ? Math.round((answeredSum / totalSum) * 100) : 0
    };
  }, [grid]);

  const stats = [
    { label: '待批改份數', value: pendingCount, unit: '份', icon: ClipboardList, hint: '已提交但還有題目沒回' },
    { label: '本週提交', value: weekCount, unit: '份', icon: Send, hint: '近七天內送出的學習單' },
    { label: '全班平均完成度', value: avgPercent, unit: '%', icon: TrendingUp, hint: '六個單元的作答題數比例' }
  ];

  return (
    <div className="font-sans">
      <div className="w-full space-y-6">

        {/* 標題列 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-[#F1E0CE] rounded-2xl p-5 md:p-6 shadow-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFF3E0] border border-[#F5C99B] rounded-xl text-[#E65100]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#3E2723] tracking-tight flex items-center gap-2 flex-wrap">
                <span>全班學習同步狀況</span>
                <span className="text-xs font-bold text-[#E65100] bg-[#FFF3E0] border border-[#F5C99B] px-3 py-1 rounded-full flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#E65100] animate-pulse"></span>
                  實時同步中 {currentTime || '00:00:00'}
                </span>
              </h1>
              <p className="text-xs text-[#8D6E63] font-medium mt-1">
                {currentUser?.name || '老師'}您好，這裡是全班每位學生在六個單元的作答與批改進度。點任一格即可進入該份學習單批改。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FCFAF6] border border-[#F1E0CE] rounded-xl px-3.5 py-2">
            <Users className="w-4 h-4 text-[#E65100]" />
            <span className="text-xs font-black text-[#3E2723]">全班 {roster.length} 人</span>
          </div>
        </div>

        {/* 三個總計 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(s => (
            <div
              key={s.label}
              className="bg-white border border-[#EAD5C3] hover:border-[#E65100] rounded-2xl p-5 shadow-lg flex items-center justify-between transition-all group"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#8D6E63] block tracking-wider">{s.label}</span>
                <div className="text-3xl font-black text-[#3E2723] tracking-tight flex items-baseline gap-1">
                  <span>{s.value}</span>
                  <span className="text-sm font-bold text-[#8D6E63]">{s.unit}</span>
                </div>
                <span className="text-[10px] font-bold text-[#B0A39A] block">{s.hint}</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFF3E0] border border-[#F5C99B] flex items-center justify-center text-[#E65100] group-hover:scale-110 transition-all">
                <s.icon className="w-7 h-7" />
              </div>
            </div>
          ))}
        </div>

        {/* 全班 × 六單元一覽表 */}
        <div className="bg-white border border-[#F1E0CE] rounded-2xl shadow-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1E0CE] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[#3E2723]">學生 × 單元進度一覽</h2>
              <p className="text-[11px] text-[#8D6E63] font-medium mt-0.5">
                格子裡是該單元的作答完成度，紅點代表「已提交但還有題目沒回」。
              </p>
            </div>

            {/* 圖例 */}
            <div className="flex flex-wrap items-center gap-2">
              {(['none', 'progress', 'pending', 'done'] as CellStatus[]).map(st => (
                <span
                  key={st}
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${STATUS_STYLE[st].box.split(' hover:')[0]}`}
                >
                  {STATUS_STYLE[st].label}
                </span>
              ))}
              <span className="text-[10px] font-black text-[#8D6E63] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                還沒回覆
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#FCFAF6]">
                  <th className="text-left text-[11px] font-black text-[#5D4037] px-4 py-3 border-b border-[#F1E0CE] sticky left-0 bg-[#FCFAF6] z-10">
                    學生
                  </th>
                  {UNITS_ORDER.map(unitId => (
                    <th
                      key={unitId}
                      className="text-center text-[11px] font-black text-[#5D4037] px-3 py-3 border-b border-[#F1E0CE] whitespace-nowrap"
                    >
                      {UNIT_SHORT_NAMES[unitId]}
                    </th>
                  ))}
                  <th className="text-center text-[11px] font-black text-[#5D4037] px-4 py-3 border-b border-[#F1E0CE] whitespace-nowrap">
                    待批改
                  </th>
                </tr>
              </thead>

              <tbody>
                {grid.length === 0 && (
                  <tr>
                    <td colSpan={UNITS_ORDER.length + 2} className="px-4 py-10 text-center text-xs font-bold text-[#B0A39A]">
                      目前還沒有學生帳號。
                    </td>
                  </tr>
                )}

                {grid.map(({ student, cells }) => {
                  const rowPending = cells.filter(c => c.info.status === 'pending').length;
                  return (
                    <tr key={student.id} className="hover:bg-[#FFFBF6] transition-colors">
                      <td className="px-4 py-3 border-b border-[#F5EDE3] sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                          <SafeImageAvatar
                            src={student.avatarUrl}
                            alt={student.name}
                            fallbackEmoji={student.avatarEmoji || '👤'}
                            sizeClassName="w-7 h-7"
                            className="border border-[#F1E0CE] bg-[#FCFAF6]"
                          />
                          <span className="text-xs font-black text-[#3E2723] whitespace-nowrap">{student.name}</span>
                        </div>
                      </td>

                      {cells.map(({ unitId, info }) => (
                        <td key={unitId} className="px-2 py-2 border-b border-[#F5EDE3] text-center">
                          <button
                            onClick={() => onOpenGrading && onOpenGrading(student.id, unitId)}
                            title={`${student.name}｜${UNIT_SHORT_NAMES[unitId]}｜${STATUS_STYLE[info.status].label}｜已作答 ${info.answered}/${info.total} 題`}
                            className={`relative w-full min-w-[86px] rounded-xl border px-2 py-2.5 transition-all cursor-pointer active:scale-95 ${STATUS_STYLE[info.status].box}`}
                          >
                            {info.alert && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-pulse" />
                            )}
                            <span className="block text-sm font-black leading-none">{info.percent}%</span>
                            <span className="block text-[9px] font-black mt-1 opacity-90">
                              {STATUS_STYLE[info.status].label}
                            </span>
                          </button>
                        </td>
                      ))}

                      <td className="px-4 py-3 border-b border-[#F5EDE3] text-center">
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                            rowPending > 0
                              ? 'bg-[#FFF3E0] text-[#E65100] border border-[#F5C99B]'
                              : 'bg-[#F6F3EE] text-[#B0A39A] border border-[#EAD5C3]'
                          }`}
                        >
                          {rowPending} 份
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
