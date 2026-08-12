/**
 * 題目登錄表 —— 「一個單元有哪些題目」的唯一出處。
 *
 * 題目 id 本來是散在六個 Unit0XTextbookPageViewer 裡臨時拼出來的字串，
 * 老師端的逐題批改與全班完成度都需要這份清單，所以集中在這裡。
 *
 * 命名規則（跟各 viewer 的 updateAnswer 一致，改那邊就要改這裡）：
 *   unit_00：p.4 → p04_story_reflection、p.5 → p05_conditions（複選）、其餘 → p{NN}_notes
 *   unit_01 ~ unit_05：一律 p{NN}_reflection
 *
 * ⚠️ 六個 viewer 不可以反過來 import 這個檔案，會變成循環相依。
 *    它們本來就在算自己那一頁的 key，維持原樣就好。
 */

import { UNIT00_TEXTBOOK_PAGES } from './textbookData';
import { PageNavItem } from './components/TextbookReaderLayout';
import { P05_CONDITIONS } from './components/Unit00TextbookPageViewer';
import { CHAPTERS_NAV_UNIT_01 } from './components/Unit01TextbookPageViewer';
import { CHAPTERS_NAV_UNIT_02 } from './components/Unit02TextbookPageViewer';
import { CHAPTERS_NAV_UNIT_03 } from './components/Unit03TextbookPageViewer';
import { CHAPTERS_NAV_UNIT_04 } from './components/Unit04TextbookPageViewer';
import { CHAPTERS_NAV_UNIT_05 } from './components/Unit05TextbookPageViewer';

export interface UnitQuestion {
  id: string;          // questionId，也就是 answers 的 key
  page: number;
  code: string;        // 'P.004'
  title: string;       // 該頁標題
  prompt: string;      // 學生看到的題幹
  kind: 'text' | 'choice';
}

/** answers 裡不是題目的 key */
export const NON_QUESTION_KEYS = ['textbookReadPages'];

export const UNITS_ORDER = ['unit_00', 'unit_01', 'unit_02', 'unit_03', 'unit_04', 'unit_05'];

export const UNIT_SHORT_NAMES: Record<string, string> = {
  unit_00: '總說 凝視生命',
  unit_01: '單元一 思考與思辨',
  unit_02: '單元二 人學探索',
  unit_03: '單元三 終極關懷',
  unit_04: '單元四 價值思辨',
  unit_05: '單元五 靈性修養'
};

const pad = (page: number) => String(page).padStart(2, '0');

/** 各單元的頁面清單，直接沿用 viewer 已經匯出的常數，不另外抄一份 */
const UNIT_PAGES: Record<string, PageNavItem[]> = {
  unit_00: UNIT00_TEXTBOOK_PAGES.map(p => ({
    page: p.page,
    code: `P.${String(p.page).padStart(3, '0')}`,
    title: p.title,
    tag: p.tag,
    emoji: p.emoji
  })),
  unit_01: CHAPTERS_NAV_UNIT_01,
  unit_02: CHAPTERS_NAV_UNIT_02,
  unit_03: CHAPTERS_NAV_UNIT_03,
  unit_04: CHAPTERS_NAV_UNIT_04,
  unit_05: CHAPTERS_NAV_UNIT_05
};

/** 每個單元前幾頁的題幹是特製的，其餘照樣板。文字與 viewer 同步。 */
const SPECIAL_PROMPTS: Record<string, string> = {
  p04_story_reflection: '你是否也曾像可華一樣，對「好好讀書➔考上大學➔找到工作➔幸福人生」這條世俗規則的公式產生過懷疑？如果是你，你會怎麼回答可華的問題？',
  p05_conditions: '關於幸福人生，你覺得需要具備哪些重要條件？（可多選）',
  p14_reflection: '面對人工智慧與資訊爆棚的時代，你認為人類「獨立思考」最不可被取代的價值是什麼？',
  p15_reflection: '請分享一次你打破「慣性思維」或「既定印象」的經驗，當時發生了什麼事？你學到了什麼？',
  p36_reflection: '如果你要用三個關鍵詞來描述「我是誰？」，你會選擇哪三個詞彙？為什麼？',
  p54_reflection: '面對親友的離去或對死亡的恐懼，你認為什麼樣的心態或信仰能帶給人力量與平安？',
  p72_reflection: '當「情感友誼」與「規則誠信」發生衝突時，你會如何做出具有智慧與倫理責任的抉擇？',
  p90_reflection: '在你忙碌或焦慮時，什麼樣的活動（如靜心、聽音樂、步入自然、表達感恩）最能幫助你找回內心的平靜與力量？'
};

/** 一般頁面的題幹樣板，與各 viewer 的 rightQuestionText 一致 */
const DEFAULT_PROMPTS: Record<string, (title: string) => string> = {
  unit_00: (t) => `請寫下你對於「${t}」這一節內容的想法或體會：`,
  unit_01: (t) => `關於「${t}」，請寫下你的思辨心得或課堂反思：`,
  unit_02: (t) => `請寫下你對於「${t}」這一課題的探索心得：`,
  unit_03: (t) => `請寫下你對於「${t}」這一課題的想法：`,
  unit_04: (t) => `請寫下你對於「${t}」這一課題的思辨觀點：`,
  unit_05: (t) => `請寫下你對於「${t}」這一課題的修養體會：`
};

/** 某一單元某一頁的題目 id */
export function questionIdForPage(unitId: string, page: number): string {
  if (unitId === 'unit_00') {
    if (page === 4) return 'p04_story_reflection';
    if (page === 5) return 'p05_conditions';
    return `p${pad(page)}_notes`;
  }
  return `p${pad(page)}_reflection`;
}

/** 整個單元的題目清單 */
export function getUnitQuestions(unitId: string): UnitQuestion[] {
  const pages = UNIT_PAGES[unitId];
  if (!pages) return [];

  const makePrompt = DEFAULT_PROMPTS[unitId] || ((t: string) => `請寫下你對於「${t}」的想法：`);

  return pages.map(p => {
    const id = questionIdForPage(unitId, p.page);
    return {
      id,
      page: p.page,
      code: p.code,
      title: p.title,
      prompt: SPECIAL_PROMPTS[id] || makePrompt(p.title),
      kind: id === 'p05_conditions' ? 'choice' : 'text'
    } as UnitQuestion;
  });
}

/**
 * 題目清單 ＋ 學生資料裡出現、但登錄表沒有的 key。
 * 課本改版後舊資料的題目才不會在批改畫面憑空消失。
 */
export function buildQuestionList(
  unitId: string,
  worksheets: Array<{ answers?: Record<string, any> } | undefined>
): UnitQuestion[] {
  const known = getUnitQuestions(unitId);
  const knownIds = new Set(known.map(q => q.id));
  const extras: UnitQuestion[] = [];

  worksheets.forEach(ws => {
    Object.keys(ws?.answers || {}).forEach(key => {
      if (knownIds.has(key) || NON_QUESTION_KEYS.includes(key)) return;
      knownIds.add(key);
      extras.push({
        id: key,
        page: 0,
        code: '其他',
        title: key,
        prompt: `（課本已改版的舊題目：${key}）`,
        kind: 'text'
      });
    });
  });

  return [...known, ...extras];
}

/** 空字串與空陣列都算沒作答 */
export function hasAnswer(value: any): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/** 把作答值轉成看得懂的文字（複選題要把編號換成條件文字） */
export function formatAnswerValue(question: UnitQuestion | undefined, value: any): string {
  if (!hasAnswer(value)) return '';

  if (question?.id === 'p05_conditions' && Array.isArray(value)) {
    return value
      .map((id: string) => {
        const cond = P05_CONDITIONS.find(c => c.id === id);
        return cond ? `${cond.id}. ${cond.text}` : id;
      })
      .join('、');
  }

  if (Array.isArray(value)) return value.join('、');
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

/** 該生在這一單元已作答的題數 */
export function countAnswered(
  questions: UnitQuestion[],
  answers: Record<string, any> | undefined
): number {
  if (!answers) return 0;
  return questions.filter(q => hasAnswer(answers[q.id])).length;
}

/** 「學生作答了但老師還沒回」的題數 —— 全班總覽的紅點就看這個 */
export function countPendingReplies(
  questions: UnitQuestion[],
  answers: Record<string, any> | undefined,
  replies: Record<string, { text: string }> | undefined
): number {
  if (!answers) return 0;
  return questions.filter(q => hasAnswer(answers[q.id]) && !replies?.[q.id]?.text).length;
}
