import React, { useState } from 'react';
import {
  Bell,
  Search,
  Tag,
  Calendar,
  Eye,
  ChevronRight,
  Share2,
  PlusCircle,
  X,
  Check,
  Megaphone,
  BookOpen,
  Sparkles,
  Award,
  ExternalLink,
  MessageSquare,
  Pin
} from 'lucide-react';
import { UserProfile } from '../types';

interface LatestNewsTabProps {
  currentUser?: UserProfile | null;
  onNavigate?: (tab: string) => void;
}

export interface NewsItem {
  id: string;
  title: string;
  category: '系統公告' | '課程與單元' | '活動特報' | '研習與講習' | '更新日誌';
  date: string;
  views: number;
  isPinned?: boolean;
  isNew?: boolean;
  author: string;
  summary: string;
  content: string[];
  tags: string[];
  coverImage?: string;
}

export default function LatestNewsTab({ currentUser, onNavigate }: LatestNewsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Publish Modal State
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [newsTitle, setNewsTitle] = useState<string>('');
  const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('系統公告');
  const [newsSummary, setNewsSummary] = useState<string>('');
  const [newsContent, setNewsContent] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [newsList, setNewsList] = useState<NewsItem[]>([
    {
      id: 'news-001',
      title: '泰宇生命教育互動學習平台 2.0 震撼發布！新增五大單元數位電子書與十款思辨遊戲',
      category: '系統公告',
      date: '2026-07-26',
      views: 1280,
      isPinned: true,
      isNew: true,
      author: '泰宇出版生命教育編輯部',
      summary: '全系統升級！完整支援單元一至單元五課本閱讀、動畫導讀、角色故事圖解與學習紀錄數位歷程分析。',
      content: [
        '親愛的老師與同學們：',
        '非常榮幸向大家宣布，『泰宇生命教育互動學習平台 2.0』即日起全面上線開放使用！',
        '【本次更新重點】',
        '1. 數位課本全單元登場：收錄「總說：凝視生命」、「單元一 思考與思辨」、「單元二 人學探索」、「單元三 終極關懷」、「單元四 價值思辨」、「單元五 靈性修養」。',
        '2. 十大互動遊戲體驗：包含心理測驗 MBTI、生命拼圖地圖、情境選擇大冒險、哲學辯論快攻、感恩泡泡站與成長徽章挑戰賽。',
        '3. 青春關係圖與角色故事：全新收錄「陳可華」、「張曉萍」、「王博鈞」、「王論文」、「可華爸爸」、「可華爺爺」的立體人物故事卡與關係網絡圖。',
        '4. 學習紀錄數位歷程：即時統計同學的學習成績、能力雷達圖、錯題分析與單元完成度，並支援一鍵匯出學習歷程檔案。',
        '歡迎大家踴躍體驗，若有任何建議歡迎回饋給我們！'
      ],
      tags: ['泰宇出版', '系統升級', '數位電子書', '思辨遊戲'],
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'news-002',
      title: '【課程單元】單元五「靈性修養」數位課本與互動學習單全新推出',
      category: '課程與單元',
      date: '2026-07-25',
      views: 860,
      isPinned: false,
      isNew: true,
      author: '生命教育專題研究小組',
      summary: '探討身心靈平衡與靜心覺察，包含「感恩泡泡站」互動體驗與修養省思紀錄表。',
      content: [
        '單元五「靈性修養」教材正式開放！',
        '本單元引導學生從繁忙的課業與生活節奏中，學會停下腳步、靜心觀察內心情緒。',
        '搭配「感恩泡泡站」遊戲，寫下心中感謝的話，為班級增添溫馨氣氛；並能透過「學習紀錄」回顧自己的成長歷程。'
      ],
      tags: ['靈性修養', '靜心覺察', '感恩泡泡', '課本單元'],
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'news-003',
      title: '【遊戲更新】「哲學辯論快攻」與「人際關係連連看」多玩家連線機制上線',
      category: '活動特報',
      date: '2026-07-22',
      views: 940,
      isPinned: false,
      isNew: false,
      author: '互動遊戲開發團隊',
      summary: '針對熱門哲學議題展開班級現場連線激辯，體驗正反方觀點撞擊的思考樂趣！',
      content: [
        '「哲學辯論快攻」新增班級即時連線投票與意見導出功能！',
        '同學們可以在課堂中針對道德與倫理兩難議題發表意見，並由老師一鍵展示全班思考分佈圖表，引導深入思辨。'
      ],
      tags: ['哲學辯論', '人際關係', '連線激辯', '思辨對話']
    },
    {
      id: 'news-004',
      title: '【教學研習】全台高中生命教育教師「數位融入教學」線上研習會報名中',
      category: '研習與講習',
      date: '2026-07-18',
      views: 650,
      isPinned: false,
      isNew: false,
      author: '泰宇教育推廣部',
      summary: '邀請全台生命教育教師一同參與，分享如何善用互動遊戲與課本學習單進行多元評量。',
      content: [
        '研習時間：2026年8月10日 (三) 14:00 - 16:00',
        '研習形式：線上視訊會議（報名後提供會議連結）',
        '研習主題：從「凝視生命」到「價值思辨」— 泰宇數位平台在生命教育課堂的實踐與範例 sharing。',
        '全程參與者核發研習時數 2 小時，歡迎全國生命教育科教師踴躍報名！'
      ],
      tags: ['教師研習', '數位教學', '研習時數', '泰宇出版']
    },
    {
      id: 'news-005',
      title: '【更新日誌】平台修復與讀取效能優化 (v2.0.4)',
      category: '更新日誌',
      date: '2026-07-15',
      views: 410,
      isPinned: false,
      isNew: false,
      author: '系統技術維護組',
      summary: '優化課本翻頁順暢度、提升遊戲載入速度，並完善手機與平板閱讀版面。',
      content: [
        '修復已知問題：',
        '1. 優化課本雙頁閱讀與滾動列流暢度。',
        '2. 修正遊戲完成後成績未即時同步至學習紀錄的異常。',
        '3. 強化行動裝置（Mobile/Tablet）選單響應式介面體驗。'
      ],
      tags: ['系統維護', '效能優化', '更新日誌']
    }
  ]);

  // Handle Publishing New News
  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const newEntry: NewsItem = {
      id: `news-${Date.now()}`,
      title: newsTitle,
      category: newsCategory,
      date: dateStr,
      views: 1,
      isPinned: false,
      isNew: true,
      author: currentUser?.name || '教師/管理員',
      summary: newsSummary,
      content: newsContent.split('\n').filter(line => line.trim() !== ''),
      tags: [newsCategory, '最新發布']
    };

    setNewsList(prev => [newEntry, ...prev]);
    setShowPublishModal(false);
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    showNotification('🎉 最新消息已成功發布！');
  };

  // Filtered News
  const filteredNews = newsList.filter(item => {
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['全部', '系統公告', '課程與單元', '活動特報', '研習與講習', '更新日誌'];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 p-4 md:p-8 font-sans relative">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#E65100] text-white px-5 py-3 rounded-2xl shadow-xl font-extrabold flex items-center gap-2 animate-bounce">
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ========================================================= */}
        {/* HEADER TITLE BANNER                                       */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFEEDD] border-2 border-[#F1E0CE] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#E65100] text-white rounded-2xl shadow-md">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-[#4A321F] tracking-tight">
                  最新消息與公告
                </h1>
                <span className="bg-[#E65100]/10 text-[#E65100] border border-[#E65100]/30 text-xs font-black px-3 py-1 rounded-full">
                  NEWS & UPDATES
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#7D6B5D] font-medium mt-1">
                即時掌握泰宇生命教育平台課程發布、活動訊息、系統修訂與學習觀點分享。
              </p>
            </div>
          </div>

          {/* Right Action: Publish News button (For Teachers/Admin) */}
          {currentUser?.role === 'teacher' && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="px-5 py-3 bg-[#E65100] hover:bg-[#D84315] text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>發布最新消息</span>
            </button>
          )}
        </div>


        {/* ========================================================= */}
        {/* CATEGORY BAR & SEARCH                                     */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#F1E0CE] rounded-2xl p-3 md:px-5 shadow-2xs">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#E65100] text-white shadow-xs'
                    : 'bg-[#FAF5EC] text-[#7D6B5D] hover:bg-[#F3E7D8] border border-[#EAD5C3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋消息關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF5EC] border border-[#EAD5C3] rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#E65100] focus:bg-white"
            />
          </div>
        </div>


        {/* ========================================================= */}
        {/* HERO SPOTLIGHT NEWS ITEM (If first pinned item exists)    */}
        {/* ========================================================= */}
        {filteredNews.length > 0 && filteredNews[0].isPinned && (
          <div
            onClick={() => setSelectedNews(filteredNews[0])}
            className="group bg-gradient-to-br from-[#FFF8EE] to-[#FFF0E0] border-2 border-[#E9D6BF] hover:border-[#E65100] rounded-3xl p-6 md:p-8 shadow-md transition-all cursor-pointer relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
          >
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Pin className="w-3 h-3" /> 置頂特色
                </span>
                <span className="bg-[#E65100] text-white font-black text-[11px] px-2.5 py-0.5 rounded-full">
                  {filteredNews[0].category}
                </span>
                {filteredNews[0].isNew && (
                  <span className="bg-rose-500 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full animate-pulse">
                    NEW
                  </span>
                )}
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 ml-auto md:ml-0">
                  <Calendar className="w-3.5 h-3.5" /> {filteredNews[0].date}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-[#4A321F] group-hover:text-[#E65100] transition-all leading-snug">
                {filteredNews[0].title}
              </h2>

              <p className="text-xs md:text-sm text-[#6E5A4B] line-clamp-2 leading-relaxed">
                {filteredNews[0].summary}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-extrabold text-[#E65100] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  閱讀完整內容 <ChevronRight className="w-4 h-4" />
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Eye className="w-3.5 h-3.5" /> {filteredNews[0].views} 次瀏覽
                </span>
              </div>
            </div>

            {filteredNews[0].coverImage && (
              <div className="md:col-span-1 h-44 md:h-full rounded-2xl overflow-hidden shadow-sm relative">
                <img
                  src={filteredNews[0].coverImage}
                  alt="News Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        )}


        {/* ========================================================= */}
        {/* NEWS GRID CARDS LIST                                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.slice(filteredNews[0]?.isPinned ? 1 : 0).map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-white border border-[#EAD5C3] hover:border-[#E65100] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Meta Top */}
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#FAF5EC] text-[#B4570B] border border-[#EAD5C3] font-black text-[11px] px-2.5 py-0.5 rounded-lg">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-black text-base text-[#4A321F] group-hover:text-[#E65100] transition-all line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-[#7D6B5D] line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Tags & Action Footer */}
              <div className="pt-3 border-t border-[#F5EADF] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400 font-mono">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views}</span>
                </div>

                <span className="font-extrabold text-[#E65100] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all">
                  全文 <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#EAD5C3] rounded-3xl space-y-3">
            <p className="text-base font-extrabold text-slate-500">查無符合「{searchQuery}」的消息公告</p>
            <button
              onClick={() => { setActiveCategory('全部'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#FAF5EC] border border-[#EAD5C3] text-[#B4570B] font-extrabold text-xs rounded-xl hover:bg-[#F3E7D8]"
            >
              清除所有搜尋與篩選
            </button>
          </div>
        )}

      </div>


      {/* ========================================================= */}
      {/* MODAL: FULL NEWS READER                                   */}
      {/* ========================================================= */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#E9D6BF] rounded-3xl max-w-2xl w-full p-6 md:p-8 text-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 custom-scrollbar">
            
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 bg-[#FAF5EC] hover:bg-[#F3E7D8] rounded-full text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 border-b border-[#F1E0CE] pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#E65100] text-white font-black text-xs px-3 py-1 rounded-full">
                  {selectedNews.category}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {selectedNews.date}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 ml-auto">
                  發布者：{selectedNews.author}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-[#4A321F] leading-tight">
                {selectedNews.title}
              </h2>
            </div>

            {selectedNews.coverImage && (
              <div className="rounded-2xl overflow-hidden h-52 w-full shadow-xs">
                <img src={selectedNews.coverImage} alt="News Detail Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            <div className="space-y-3 text-sm text-[#4A321F] leading-relaxed font-medium">
              {selectedNews.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-[#F1E0CE] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-4 h-4 text-[#B4570B]" />
                {selectedNews.tags.map(t => (
                  <span key={t} className="bg-[#FAF5EC] text-[#B4570B] border border-[#EAD5C3] text-xs font-bold px-2.5 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showNotification('🔗 公告連結已複製至剪貼簿！');
                }}
                className="px-3.5 py-1.5 bg-[#FAF5EC] hover:bg-[#F3E7D8] text-[#B4570B] border border-[#EAD5C3] font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>分享此公告</span>
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* MODAL: PUBLISH NEW ANNOUNCEMENT (TEACHER / ADMIN)          */}
      {/* ========================================================= */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#E65100] rounded-3xl max-w-lg w-full p-6 md:p-8 text-slate-800 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowPublishModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-[#F1E0CE] pb-3">
              <Megaphone className="w-6 h-6 text-[#E65100]" />
              <h3 className="text-xl font-black text-[#4A321F]">發布平台最新消息</h3>
            </div>

            <form onSubmit={handlePublishNews} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">公告標題</label>
                <input
                  type="text"
                  required
                  placeholder="請輸入公告標題..."
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full bg-[#FAF5EC] border border-[#EAD5C3] rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:border-[#E65100] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">消息類別</label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="w-full bg-[#FAF5EC] border border-[#EAD5C3] rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:border-[#E65100]"
                >
                  <option value="系統公告">系統公告</option>
                  <option value="課程與單元">課程與單元</option>
                  <option value="活動特報">活動特報</option>
                  <option value="研習與講習">研習與講習</option>
                  <option value="更新日誌">更新日誌</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">簡短摘要 (Card Summary)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="用 1-2 句話說明這則公告的重點..."
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  className="w-full bg-[#FAF5EC] border border-[#EAD5C3] rounded-xl p-3 text-sm font-medium text-slate-800 outline-none focus:border-[#E65100]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">詳細內文 (每一段落一行)</label>
                <textarea
                  rows={4}
                  placeholder="請輸入詳細內容說明..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full bg-[#FAF5EC] border border-[#EAD5C3] rounded-xl p-3 text-sm font-medium text-slate-800 outline-none focus:border-[#E65100]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  確認發布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
