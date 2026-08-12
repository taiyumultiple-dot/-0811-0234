/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 最新消息 —— 平台更新日誌。
 *
 * 一天一篇。內容全部來自 src/updates.ts，那份檔案是唯一的資料來源；
 * 網站有任何更動就往當天那一篇加一行，這頁會自動長出來。
 *
 * 刻意做得很素：這裡是給人「快速掃過有什麼變了」的地方，
 * 不需要分類篩選、搜尋、瀏覽次數、置頂那一整套。
 */

import { Bell, Sparkles } from 'lucide-react';
import { UPDATES, UpdateArea } from '../updates';

/** 每個分類一個顏色，讓人一眼分得出哪一行跟自己有關 */
const areaStyle: Record<UpdateArea, string> = {
  平台: 'bg-[#FFF3E0] text-[#B4570B] border-[#F5C99B]',
  首頁: 'bg-[#FFF8E1] text-[#8D6E00] border-[#F0DFA0]',
  課本單元: 'bg-[#E8F5E9] text-[#2E7D32] border-[#B7DFBA]',
  人物介紹: 'bg-[#F3E5F5] text-[#6A1B9A] border-[#DCC0E2]',
  互動遊戲: 'bg-[#E3F2FD] text-[#1565C0] border-[#B3D6F2]',
  學習紀錄: 'bg-[#FCE4EC] text-[#AD1457] border-[#F0BBD0]',
  最新消息: 'bg-[#EDE7F6] text-[#4527A0] border-[#C9BCE8]',
  登入: 'bg-[#E0F2F1] text-[#00695C] border-[#A8DAD5]'
};

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/** '2026-08-12' → '2026 年 8 月 12 日（三）' */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${y} 年 ${m} 月 ${d} 日（${wd}）`;
}

function todayISO(): string {
  const n = new Date();
  const p = (v: number) => String(v).padStart(2, '0');
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

export default function LatestNewsTab() {
  const today = todayISO();
  // 資料裡新的日期本來就放前面，這裡再排一次，避免有人插錯位置
  const entries = [...UPDATES].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-5">

      {/* 標頭 */}
      <div className="bg-[#FCFAF6] border-2 border-[#F1E0CE] rounded-3xl p-6 md:p-7 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E65100] flex items-center justify-center shrink-0 shadow-sm">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-black text-[#3E2723]">最新消息</h2>
          <p className="text-xs md:text-sm text-[#7D5C43] font-bold mt-1.5 leading-relaxed">
            平台的更新日誌，一天一篇。課本、遊戲、頁面只要有調整，都會記在這裡。
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#EAD5C3] rounded-3xl p-12 text-center">
          <p className="text-sm text-[#8D6E63] font-bold">還沒有更新紀錄。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => {
            const isToday = entry.date === today;
            return (
              <article
                key={entry.date}
                className={`bg-white rounded-3xl border-2 overflow-hidden shadow-3xs ${
                  isToday ? 'border-[#E65100]/50' : 'border-[#EAD5C3]'
                }`}
              >
                {/* 日期列 */}
                <div
                  className={`px-6 py-4 flex flex-wrap items-center gap-2.5 border-b-2 ${
                    isToday
                      ? 'bg-[#FFF6EE] border-[#F5C99B]/60'
                      : 'bg-[#FCFAF6] border-[#F1E0CE]/70'
                  }`}
                >
                  <h3 className="text-base md:text-lg font-black text-[#3E2723]">
                    {formatDate(entry.date)}
                  </h3>
                  {isToday && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-[#E65100] text-white">
                      <Sparkles className="w-3 h-3" />
                      今天
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#A1887F] ml-auto">
                    {entry.items.length} 則更新
                  </span>
                </div>

                {/* 當天的每一則 */}
                <ul className="divide-y divide-[#F5EDE3]">
                  {entry.items.map((it, i) => (
                    <li key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3.5">
                      <span
                        className={`shrink-0 self-start text-[11px] font-black px-2.5 py-1 rounded-lg border ${areaStyle[it.area] || areaStyle['平台']}`}
                      >
                        {it.area}
                      </span>
                      <p className="text-sm text-[#4E342E] font-bold leading-relaxed">
                        {it.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
