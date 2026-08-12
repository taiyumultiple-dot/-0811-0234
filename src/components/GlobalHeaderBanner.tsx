/**
 * 首頁的角色橫幅。
 *
 * 原本這支還包含一條「品牌列」（logo + 使用導覽 + 登入），只有首頁看得到，
 * 跟其他分頁上方那條 sticky 頁首長得不一樣。現在 sticky 頁首全站共用，
 * 這裡就只剩橫幅本身，避免同一個畫面出現兩條品牌列。
 */
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroCharacters from '../assets/images/hero-characters.jpg';

interface GlobalHeaderBannerProps {
  onNavigate: (tabName: string) => void;
}

export default function GlobalHeaderBanner({ onNavigate }: GlobalHeaderBannerProps) {
  const [isCollapsed] = useState(() => {
    return localStorage.getItem('global_header_banner_collapsed') === 'true';
  });

  return (
    <div className="mb-6">
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
