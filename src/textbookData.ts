/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TextbookPageElement {
  type: 'header' | 'paragraph' | 'blockquote' | 'alert' | 'textarea' | 'matching' | 'illustration' | 'interactive_thinking';
  title?: string;
  text?: string;
  quote?: string;
  author?: string;
  id?: string; // key for answers
  placeholder?: string;
  rows?: number;
  options?: Array<{ scenario: string; correct: string }> | string[];
}

export interface TextbookPage {
  page: number;
  title: string;
  tag: string;
  emoji: string;
  desc: string;
  elements: TextbookPageElement[];
}

export const UNIT00_TEXTBOOK_PAGES: TextbookPage[] = [
  {
    page: 4,
    title: "凝視生命的地圖",
    tag: "導讀",
    emoji: "🧭",
    desc: "可華與爸爸的對話 ── 讀書與幸福生活的深思。",
    elements: [
      {
        type: "header",
        title: "行前閱讀"
      },
      {
        type: "paragraph",
        text: "可華一早起床，爸爸就載他上學，途中爸爸關心問到：「昨晚有因為準備考試而熬夜嗎？」"
      },
      {
        type: "paragraph",
        text: "可華打著哈欠回應：「讀書真的超累的，班上同學都是學霸，時間總是不夠用，書感覺永遠讀不完，為什麼要過這樣的生活？」"
      },
      {
        type: "paragraph",
        text: "爸爸試著用自己經歷的人生道理說服可華：「學生只需要認真讀書，是很幸福的！等你長大出社會工作，才知道什麼叫壓力。」"
      },
      {
        type: "paragraph",
        text: "「好好用功讀書，考上大學，未來才會有好的工作，才會有幸福的人生啊！」"
      },
      {
        type: "paragraph",
        text: "對於爸爸說的幸福人生，可華回想爸爸經常拖著疲累的身軀，熬夜加班工作，壓力大到假日只能像爛泥一般癱在沙發上，這樣的生活真的是幸福人生嗎？可華陷入沈思……。"
      }
    ]
  },
  {
    page: 5,
    title: "生命教育 MAP 與幸福地標",
    tag: "暖身",
    emoji: "🗺️",
    desc: "探索生命教育的五大關卡，並挑選出屬於你的幸福地標。",
    elements: [
      {
        type: "header",
        title: "生命教育 MAP"
      }
    ]
  },
  {
    page: 6,
    title: "打開幸福人生之門",
    tag: "第一章",
    emoji: "🚪",
    desc: "探索用功讀書、好工作與幸福之間的真實關係。",
    elements: [
      {
        type: "header",
        title: "探索的起點"
      }
    ]
  },
  {
    page: 7,
    title: "一分鐘蒼蠅 (One Minute Fly)",
    tag: "第一章",
    emoji: "🪰",
    desc: "透過動畫《One Minute Fly》，思考必要與重要事情的優先順序。",
    elements: [
      {
        type: "header",
        title: "LIFE 心動力 ── ｜一分鐘蒼蠅｜"
      }
    ]
  },
  {
    page: 8,
    title: "幸福心方向 ── 幸福路上",
    tag: "第二章",
    emoji: "🎬",
    desc: "藉由電影《幸福路上》與蔡依林的歌聲，反思自我定位與內在幸福。",
    elements: [
      {
        type: "header",
        title: "幸福心方向"
      }
    ]
  },
  {
    page: 9,
    title: "五把開啟幸福之門的鑰匙",
    tag: "第二章",
    emoji: "🔑",
    desc: "認識台大孫效智教授提出的生命教育核心「基礎方法」與「人生三問」。",
    elements: [
      {
        type: "header",
        title: "五把開啟幸福之門的鑰匙"
      }
    ]
  },
  {
    page: 10,
    title: "第一道與第二道門 ── 哲學思考 & 人學探索",
    tag: "第三章",
    emoji: "🔍",
    desc: "解鎖追求真理與認識自己的心靈鑰匙。",
    elements: [
      {
        type: "header",
        title: "這五把鑰匙，可以分別解開……"
      }
    ]
  },
  {
    page: 11,
    title: "第三至五道門 ── 終極關懷、價值思辨 & 靈性修養",
    tag: "第三章",
    emoji: "🌱",
    desc: "解鎖創造意義、正確抉擇與圓滿生命的生命解答。",
    elements: [
      {
        type: "header",
        title: "生命之謎的五把鑰匙其餘三道門"
      }
    ]
  },
  {
    page: 12,
    title: "幸福煉金術 ── 幸福存摺 STAGE",
    tag: "第四章",
    emoji: "🪙",
    desc: "學會如何累積幸福感的五大內涵（Savor, Thank, Aspire, Give, Empathy）。",
    elements: [
      {
        type: "header",
        title: "幸福煉金術"
      }
    ]
  },
  {
    page: 13,
    title: "屬於你的 Wish List 實踐",
    tag: "實踐",
    emoji: "📝",
    desc: "動手做一週的幸福存摺清單，為生命存入快樂與感恩的能量。",
    elements: [
      {
        type: "header",
        title: "Wish List 幸福存摺實踐清單"
      }
    ]
  }
];

export const UNIT01_TEXTBOOK_PAGES: TextbookPage[] = [
  {
    page: 14,
    title: "課本第 14 頁：待輸入...",
    tag: "單元導航",
    emoji: "💡",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 14 頁 ── 課本內容等待匯入"
      },
      {
        type: "paragraph",
        text: "這裡的教材內容已全部清空。請等待更新或手動輸入新資料。"
      }
    ]
  },
  {
    page: 15,
    title: "課本第 15 頁：待輸入...",
    tag: "行前暖身",
    emoji: "🛒",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 15 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 16,
    title: "課本第 16 頁：待輸入...",
    tag: "第一章",
    emoji: "🎯",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 16 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 17,
    title: "課本第 17 頁：待輸入...",
    tag: "第一章",
    emoji: "📊",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 17 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 18,
    title: "課本第 18 頁：待輸入...",
    tag: "第一章",
    emoji: "🏫",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 18 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 19,
    title: "課本第 19 頁：待輸入...",
    tag: "第一章",
    emoji: "🤖",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 19 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 20,
    title: "課本第 20 頁：待輸入...",
    tag: "第一章",
    emoji: "🍀",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 20 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 21,
    title: "課本第 21 頁：待輸入...",
    tag: "第一章",
    emoji: "🛡️",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 21 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 22,
    title: "課本第 22 頁：待輸入...",
    tag: "第二章",
    emoji: "🚃",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 22 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 23,
    title: "課本第 23 頁：待輸入...",
    tag: "第二章",
    emoji: "🚗",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 23 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 24,
    title: "課本第 24 頁：待輸入...",
    tag: "第二章",
    emoji: "👤",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 24 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 25,
    title: "課本第 25 頁：待輸入...",
    tag: "第二章",
    emoji: "👁️",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 25 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 26,
    title: "課本第 26 頁：待輸入...",
    tag: "第二章",
    emoji: "⚖️",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 26 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 27,
    title: "課本第 27 頁：待輸入...",
    tag: "第二章",
    emoji: "🔍",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 27 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 28,
    title: "課本第 28 頁：待輸入...",
    tag: "第二章",
    emoji: "🧩",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 28 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 29,
    title: "課本第 29 頁：待輸入...",
    tag: "第二章",
    emoji: "🧬",
    desc: "等待匯入新教材內容。",
    elements: [
      {
        type: "header",
        title: "第 29 頁 ── 課本內容等待匯入"
      }
    ]
  },
  {
    page: 30,
    title: "第三章：一 思考的幸福方式 ─ 謬誤透視鏡",
    tag: "第三章",
    emoji: "👔",
    desc: "看穿訴諸不當權威與非黑即白的行銷陷阱，防禦日常消費洗腦。",
    elements: [
      {
        type: "header",
        title: "一、 謬誤透視鏡"
      }
    ]
  },
  {
    page: 31,
    title: "生活中的謬誤雷達盤點",
    tag: "第三章",
    emoji: "📡",
    desc: "在廣告詞、生活耳語與網路社群中揪出謬誤，建立邏輯免疫力。",
    elements: [
      {
        type: "header",
        title: "腦力激盪 ─ 生活中的謬誤雷達盤點"
      }
    ]
  },
  {
    page: 32,
    title: "二 蘇格拉底產婆法 ─ 內心三重問",
    tag: "第三章",
    emoji: "🗣️",
    desc: "學習蘇格拉底探尋事實、探索極端、專注行動的產婆術，安撫焦慮。",
    elements: [
      {
        type: "header",
        title: "二、 蘇格拉底產婆術：引導真相的提問"
      }
    ]
  },
  {
    page: 33,
    title: "三 我的防彈思考盾牌 ─ 實踐反思",
    tag: "第三章",
    emoji: "🛡️",
    desc: "動手完成生活邏輯審計日記，用批判思考抵禦認知偏見與情緒衝動。",
    elements: [
      {
        type: "header",
        title: "三、 我的防彈思考盾牌"
      }
    ]
  },
  {
    page: 34,
    title: "四 思考的幸福方程式：理性與自主",
    tag: "第三章",
    emoji: "🧪",
    desc: "結合事實、價值與正確抉擇，建構理性明辨、主導幸福的思考配方。",
    elements: [
      {
        type: "header",
        title: "四、 思考的幸福方程式"
      }
    ]
  },
  {
    page: 35,
    title: "第一單元 終結大回顧與自我檢測表",
    tag: "單元總結",
    emoji: "🏆",
    desc: "回顧「互動思考的樂趣」全單元精華，完成自我成熟度與大收穫評測。",
    elements: [
      {
        type: "header",
        title: "單元總結自我學習檢測"
      }
    ]
  }
];
