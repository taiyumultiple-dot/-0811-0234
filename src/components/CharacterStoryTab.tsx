/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, HeartHandshake, UsersRound } from 'lucide-react';
import { CHARACTERS } from '../data';
import { Character } from '../types';
import kehuaImg from '../assets/images/characters/char_kehua.jpg';
import xiaopingImg from '../assets/images/characters/char_xiaoping.jpg';
import xiaowenImg from '../assets/images/characters/char_xiaowen.jpg';
import bojunImg from '../assets/images/characters/char_bojun.jpg';
import dadImg from '../assets/images/characters/char_dad.jpg';
import grandpaImg from '../assets/images/characters/char_grandpa.jpg';

interface CharacterStoryTabProps {
  characters?: Character[];
  onNavigate?: (tab: string) => void;
}

type StoryCharacter = {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  traits: string[];
  bio: string;
  image: string;
};

const portraitById: Record<string, string> = {
  char_kehua: kehuaImg,
  char_xiaoping: xiaopingImg,
  char_xiaowen: xiaowenImg,
  char_bojun: bojunImg,
  char_dad: dadImg,
  char_grandpa: grandpaImg
};

const storyCharacters: StoryCharacter[] = [
  {
    id: 'char_kehua',
    name: '陳可華',
    role: '班長',
    subtitle: '高中一年級學生',
    traits: ['溫和細心', '善於觀察', '有時猶豫'],
    bio: '可華是班上的班長，做事細心負責，總是默默關心身邊的人。他不太擅長表達自己的想法，但會用行動來關心同學。面對選擇時，他有時會猶豫，希望能做出最好的決定。',
    image: kehuaImg
  },
  {
    id: 'char_bojun',
    name: '王博鈞',
    role: '康樂股長',
    subtitle: '熱情幽默 樂觀積極',
    traits: ['樂觀開朗', '熱心助人', '愛開玩笑'],
    bio: '博鈞是班上的開心果，喜歡籃球，也很會帶動氣氛。遇到困難時，他常用幽默讓大家放鬆，但也在學習如何把熱情變成更穩定的行動。',
    image: bojunImg
  },
  {
    id: 'char_xiaowen',
    name: '王小文',
    role: '學霸「博士」',
    subtitle: '善解人意 心思細膩',
    traits: ['認真負責', '思考細膩', '主見穩重'],
    bio: '小文認真穩重，擅長分析問題，也常成為同學們請教的對象。她追求真理與知識，在關係中學習柔軟地理解別人的感受。',
    image: xiaowenImg
  },
  {
    id: 'char_xiaoping',
    name: '張曉萍',
    role: '副班長',
    subtitle: '活潑開朗 樂於助人',
    traits: ['同理心強', '善解人意', '意志堅定'],
    bio: '曉萍溫柔又有活力，擅長傾聽，也願意主動照顧身邊的人。她在關係中學習同理與界線，讓善意成為支持彼此成長的力量。',
    image: xiaopingImg
  },
  {
    id: 'char_dad',
    name: '可華爸爸',
    role: '家庭支持',
    subtitle: '穩重可靠 給予方向與支持',
    traits: ['成熟穩重', '關愛包容'],
    bio: '可華爸爸用開明與穩定的陪伴支持孩子，在可華迷惘時給予方向，也提醒他相信自己的判斷。',
    image: dadImg
  },
  {
    id: 'char_grandpa',
    name: '可華爺爺',
    role: '家庭支持',
    subtitle: '溫暖慈愛 陪伴與鼓勵成長',
    traits: ['慈祥智慧', '經驗豐富', '樂觀豁達'],
    bio: '可華爺爺常用人生故事啟發可華，讓他從不同角度理解生命，也學會珍惜當下與身邊的人。',
    image: grandpaImg
  }
];

const relationCopy: Record<string, { title: string; body: string }> = {
  kehua: {
    title: '每一段關係，都是青春對話的縮影。',
    body: '透過理解與陪伴，我們發現生命的意義與成長的力量。'
  },
  xiaoping: {
    title: '溫柔的陪伴，讓關係有了前進的力量。',
    body: '曉萍的同理心讓同學感到被理解，也提醒大家在關係中學習照顧彼此。'
  },
  xiaowen: {
    title: '理性與細膩，能讓對話更靠近真實。',
    body: '小文帶來穩定的思考，也讓青春關係多了一份清楚與理解。'
  },
  bojun: {
    title: '歡笑與行動，能把關心變成具體支持。',
    body: '博鈞的熱情讓團體更有活力，也讓同學們在互動中看見樂觀的價值。'
  }
};

export default function CharacterStoryTab({ characters: propCharacters }: CharacterStoryTabProps) {
  const activeCharacters = (propCharacters && propCharacters.length > 0) ? propCharacters : CHARACTERS;
  const [selectedId, setSelectedId] = useState('char_kehua');
  const selected = storyCharacters.find((character) => character.id === selectedId) || storyCharacters[0];
  const selectedSource = activeCharacters.find((character) => character.id === selected.id);
  const relationship = selected.id.includes('xiaoping')
    ? relationCopy.xiaoping
    : selected.id.includes('xiaowen')
      ? relationCopy.xiaowen
      : selected.id.includes('bojun')
        ? relationCopy.bojun
        : relationCopy.kehua;

  return (
    <div className="w-full bg-[#FAF3E8]/80 border-2 border-[#EAD5C3] rounded-3xl p-4 md:p-8 space-y-6 shadow-xs text-[#3E2723] font-sans relative overflow-hidden">
      {/* Corner floral decorations */}
      <div className="hidden md:block absolute left-1 top-20 w-48 h-64 opacity-50 pointer-events-none select-none rotate-[8deg] z-0" aria-hidden="true">
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 300C95 220 90 150 60 90C40 50 20 30 10 10" stroke="#B7C79A" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="55" cy="95" rx="16" ry="8" fill="#C6D6A8" transform="rotate(-30 55 95)" />
          <ellipse cx="35" cy="60" rx="16" ry="8" fill="#C6D6A8" transform="rotate(-50 35 60)" />
          <circle cx="70" cy="130" r="10" fill="#F3C1CE" />
          <circle cx="45" cy="170" r="8" fill="#F6D3A8" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF4EA] via-[#FFFBF6] to-[#FFF0E0] border-2 border-[#EAD5C3] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
          <div className="absolute top-4 left-10 text-3xl opacity-20 pointer-events-none select-none">🌸</div>
          <div className="absolute bottom-3 right-1/3 text-3xl opacity-20 pointer-events-none select-none">🌿</div>
          <div className="space-y-1 text-left z-10">
            <h1 className="text-2xl md:text-3xl font-black text-[#4A321F]">角色故事｜青春關係圖</h1>
            <p className="text-xs md:text-sm font-bold text-[#7D5C43]/90">透過角色互動，一起探索生命中的重要課題與人際關係。</p>
          </div>
          <div className="hidden md:flex items-end -space-x-3 z-10 shrink-0 pr-2">
            {[xiaopingImg, kehuaImg].map((src, i) => (
              <img key={i} src={src} alt="" className="w-20 h-20 rounded-full object-cover border-[3px] border-white shadow-md" style={{ zIndex: 2 - i }} referrerPolicy="no-referrer" />
            ))}
          </div>
        </div>

        {/* Main 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Relationship map */}
          <div className="lg:col-span-7 bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm">
            <h2 className="text-center text-sm font-black tracking-widest text-[#4A321F] mb-6">青春關係圖</h2>

            <div className="relative w-full" style={{ minHeight: 340 }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 300" preserveAspectRatio="none">
                <line x1="175" y1="65" x2="525" y2="65" stroke="#F08A2D" strokeWidth="2.5" />
                <line x1="175" y1="65" x2="525" y2="235" stroke="#9A6AD5" strokeWidth="2.5" strokeDasharray="7 7" />
                <line x1="525" y1="65" x2="175" y2="235" stroke="#9A6AD5" strokeWidth="2.5" strokeDasharray="7 7" />
                <line x1="175" y1="235" x2="525" y2="235" stroke="#61A94F" strokeWidth="2.5" strokeDasharray="7 7" />
                <line x1="175" y1="65" x2="175" y2="235" stroke="#4A91DC" strokeWidth="2.5" />
                <line x1="525" y1="65" x2="525" y2="235" stroke="#4A91DC" strokeWidth="2.5" />
              </svg>

              {/* Relation labels */}
              <span className="absolute left-1/2 -translate-x-1/2 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-current bg-[#FFF8ED] text-[#EF6D1F]" style={{ top: '14%' }}>親密／好友</span>
              <span className="absolute left-1/2 -translate-x-1/2 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-current bg-[#FFF8ED] text-[#8B66C9]" style={{ top: '48%' }}>鄰居關係</span>
              <span className="absolute text-[11px] font-black px-2.5 py-0.5 rounded-full border border-current bg-[#FFF8ED] text-[#3479C8]" style={{ left: '2%', top: '46%' }}>同學</span>
              <span className="absolute text-[11px] font-black px-2.5 py-0.5 rounded-full border border-current bg-[#FFF8ED] text-[#3479C8]" style={{ right: '2%', top: '46%' }}>同學</span>
              <span className="absolute left-1/2 -translate-x-1/2 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-current bg-[#FFF8ED] text-[#3A9B54]" style={{ bottom: '10%' }}>死黨</span>

              {/* Person cards */}
              {[
                { id: 'char_xiaoping', pos: 'absolute left-0 top-0' },
                { id: 'char_kehua', pos: 'absolute right-0 top-0', reverse: true },
                { id: 'char_xiaowen', pos: 'absolute left-0 bottom-0' },
                { id: 'char_bojun', pos: 'absolute right-0 bottom-0', reverse: true },
              ].map(({ id, pos, reverse }) => {
                const c = storyCharacters.find(sc => sc.id === id)!;
                const isActive = selected.id === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedId(id)}
                    className={`${pos} w-[46%] sm:w-[220px] rounded-2xl border-2 bg-[#FFFDF8] shadow-sm flex items-center gap-2.5 p-2.5 text-left transition-all cursor-pointer z-10 ${
                      reverse ? 'flex-row-reverse text-right' : ''
                    } ${isActive ? 'border-[#F97316] shadow-md scale-[1.02]' : 'border-[#EFC895] hover:border-[#F0AE5F]'}`}
                  >
                    <img src={portraitById[id]} alt={c.name} className="w-16 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="text-sm font-black text-[#4A321F]">{c.name}</div>
                      <div className="text-[10px] font-bold text-[#6B4B35] leading-snug">{c.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Family support strip */}
            <div className="mt-4 border-2 border-[#EAD5C3] rounded-2xl bg-[#FFF8ED] p-3 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex flex-col items-center gap-1 text-[#D56719] font-black text-xs shrink-0 px-2">
                <HeartHandshake className="w-5 h-5" />
                <span>家庭支持</span>
              </div>
              {['char_dad', 'char_grandpa'].map((id) => {
                const c = storyCharacters.find(sc => sc.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedId(id)}
                    className={`flex-1 w-full flex items-center gap-3 bg-[#FFFDF8] border rounded-2xl p-2.5 text-left transition-all cursor-pointer ${selected.id === id ? 'border-[#F97316] shadow-sm' : 'border-[#EFC895]'}`}
                  >
                    <img src={portraitById[id]} alt={c.name} className="w-16 h-11 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="text-xs font-black text-[#4A321F]">{c.name}</div>
                      <div className="text-[10px] font-bold text-[#6B4B35] leading-snug">{c.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm flex gap-3 items-start">
              <HeartHandshake className="w-6 h-6 text-[#F07B1B] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-black text-[#4A321F] mb-1">
                  當前選取關係故事 <span className="text-[10px] font-bold text-[#B4570B] tracking-wider">(RELATIONSHIP INSIGHT)</span>
                </h3>
                <strong className="block text-xs font-black text-[#4A321F] mb-1">{relationship.title}</strong>
                <p className="text-[11px] text-[#6B4B35] font-bold leading-relaxed">{relationship.body}</p>
              </div>
            </div>

            <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-black text-[#4A321F] mb-3 flex items-center gap-1.5">
                <UsersRound className="w-3.5 h-3.5" /> 人物角色卡總覽
              </h3>
              <div className="flex flex-wrap gap-2">
                {storyCharacters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => setSelectedId(character.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black border transition-all cursor-pointer ${
                      selected.id === character.id
                        ? 'bg-[#E65100] text-white border-[#E65100]'
                        : 'bg-[#FFFAF2] text-[#5B3218] border-[#EFC895] hover:bg-orange-50'
                    }`}
                  >
                    {character.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-[#9FC7EE] rounded-3xl p-5 shadow-sm flex gap-4">
              <img src={portraitById[selected.id] || selected.image} alt={selected.name} className="w-24 sm:w-28 h-32 sm:h-36 object-cover rounded-2xl shrink-0" referrerPolicy="no-referrer" />
              <div className="min-w-0">
                <h2 className="text-base font-black text-[#4A321F]">{selected.name} <span className="text-xs font-bold text-slate-500">({selected.role})</span></h2>
                <p className="text-[11px] text-slate-500 font-bold mb-2">{selectedSource?.isFamily ? '家庭支持角色' : selected.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selected.traits.map((trait) => (
                    <span key={trait} className="text-[10px] font-black border border-[#9FC7EE] bg-[#EEF6FF] text-[#2F6FB3] rounded-full px-2.5 py-0.5"># {trait}</span>
                  ))}
                </div>
                <p className="text-[11px] text-[#43352B] font-bold leading-relaxed">{selected.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: lesson card */}
        <div className="bg-white border-2 border-[#EAD5C3] rounded-3xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full border-4 border-[#F7D7A2] flex items-center justify-center text-[#D87B1F] shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#4A321F] mb-1.5">角色關係與生命課題</h2>
            <p className="text-xs text-[#6B4B35] font-bold leading-relaxed">
              六位角色展現了青春中常見的不同生命主題，包括友誼、理解、溝通、責任、支持與選擇。在家庭、朋友與同儕的陪伴下，我們學會面對挑戰、建立自我，並在關係中找到成長的力量。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}