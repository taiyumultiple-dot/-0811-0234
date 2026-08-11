import badgeGanen from './badge_ganen.png';
import badgeHero from './badge_hero.png';
import badgeRecommendTask from './badge_recommend_task.png';
import badgeShengming from './badge_shengming.png';
import badgeSibian from './badge_sibian.png';
import badgeTongli from './badge_tongli.png';
import badgeYongqi from './badge_yongqi.png';
import gameIcon01 from './game_icon_01.png';
import gameIcon03 from './game_icon_03.png';
import gameIcon04 from './game_icon_04.png';
import gameIcon05 from './game_icon_05.png';
import gameIcon06 from './game_icon_06.png';
import gameIcon07 from './game_icon_07.png';
import gameIcon08 from './game_icon_08.png';
import gameIcon09 from './game_icon_09.png';
import gameIcon10 from './game_icon_10.png';
import lobbyFloral from './lobby_floral.png';
import lobbyHero from './lobby_hero.png';
import puzzleMapBg from './puzzle_map_bg.png';

export {
  badgeGanen,
  badgeHero,
  badgeRecommendTask,
  badgeShengming,
  badgeSibian,
  badgeTongli,
  badgeYongqi,
  gameIcon01,
  gameIcon03,
  gameIcon04,
  gameIcon05,
  gameIcon06,
  gameIcon07,
  gameIcon08,
  gameIcon09,
  gameIcon10,
  lobbyFloral,
  lobbyHero,
  puzzleMapBg,
};

// Helper function to create beautiful responsive inline SVGs as data URLs
function createSvgBanner(title: string, subtitle: string, color1: string, color2: string, emoji: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
    <defs>
      <linearGradient id="grad-${title.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
      </filter>
    </defs>
    <!-- Background -->
    <rect width="800" height="400" fill="url(#grad-${title.replace(/\s+/g, '')})" rx="16"/>
    
    <!-- Abstract Shapes -->
    <circle cx="700" cy="100" r="140" fill="white" opacity="0.08"/>
    <circle cx="100" cy="320" r="180" fill="white" opacity="0.05"/>
    <path d="M 0,280 Q 250,180 500,320 T 800,240 L 800,400 L 0,400 Z" fill="white" opacity="0.1"/>
    <path d="M 0,330 Q 180,260 420,360 T 800,290 L 800,400 L 0,400 Z" fill="white" opacity="0.08"/>

    <!-- Decorative floating squares -->
    <rect x="150" y="80" width="40" height="40" rx="8" fill="white" opacity="0.06" transform="rotate(15 150 80)"/>
    <rect x="620" y="280" width="60" height="60" rx="12" fill="white" opacity="0.06" transform="rotate(-25 620 280)"/>

    <!-- Content Card -->
    <rect x="100" y="80" width="600" height="240" fill="white" fill-opacity="0.15" rx="20" stroke="white" stroke-opacity="0.25" stroke-width="1.5" filter="url(#shadow)"/>
    
    <!-- Large Central Emoji -->
    <text x="400" y="150" font-size="56" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${emoji}</text>
    
    <!-- Title -->
    <text x="400" y="220" font-family="'Noto Sans TC', 'Inter', system-ui, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">
      ${title}
    </text>
    
    <!-- Subtitle -->
    <text x="400" y="265" font-family="'Noto Sans TC', 'Inter', system-ui, sans-serif" font-size="18" font-weight="500" fill="#FFFFFF" fill-opacity="0.9" text-anchor="middle" letter-spacing="1">
      ${subtitle}
    </text>
  </svg>`;

  if (typeof window !== 'undefined') {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  } else {
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }
}

// Export 10 color-coded, bespoke banners matching the interactive game cards
export const game01Banner = createSvgBanner('心理測驗 MBTI', '探索你的性格類型，了解自己與他人', '#D97706', '#B45309', '🧠');
export const game02Banner = createSvgBanner('生命拼圖地圖', '將生命的五大單元拼湊出完整的地圖', '#059669', '#047857', '🧩');
export const game03Banner = createSvgBanner('情境選擇大冒險', '面對生活中的道德情境，做出你的抉擇', '#2563EB', '#1D4ED8', '🧭');
export const game04Banner = createSvgBanner('人際關係連連看', '建立與身邊人的溫暖關係連結與支持網絡', '#7C3AED', '#6D28D9', '🕸️');
export const game05Banner = createSvgBanner('價值天平排序戰', '衡量不同價值觀的重要性，找到內心平衡', '#EA580C', '#C2410C', '⚖️');
export const game06Banner = createSvgBanner('生命故事翻翻卡', '翻轉故事卡，尋找對應的生命核心價值', '#DB2777', '#BE185D', '🎴');
export const game07Banner = createSvgBanner('感恩泡泡站', '寫下感恩的話，讓班級充滿溫馨的感謝泡泡', '#0D9488', '#0F766E', '🧼');
export const game08Banner = createSvgBanner('哲學辯論快攻', '針對哲學思辨議題，展開一場全班思維激盪', '#0284C7', '#0369A1', '🗣️');
export const game09Banner = createSvgBanner('心情溫度計', '記錄當下心情狀態，與班級分享情感溫度', '#E11D48', '#BE123C', '🌡️');
export const game10Banner = createSvgBanner('成長徽章挑戰賽', '完成生命挑戰，收集並解鎖榮譽班級徽章', '#F59E0B', '#D97706', '🏆');
