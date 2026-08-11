import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Award,
  Heart,
  Shield,
  BookOpen,
  RotateCcw,
  HelpCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Star,
  MoveUp,
  MoveDown,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Flame,
  Zap,
  Bookmark,
  Share2
} from 'lucide-react';

export interface ScenarioCard {
  cardId: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Scenario {
  id: number;
  stage: number;
  category: '哲學思考' | '人學探索' | '終極關懷' | '價值思辨' | '靈性修養與人格統整';
  difficulty: 'explore' | 'think' | 'challenge';
  title: string;
  situation: string;
  question: string;
  emotions: string[];
  actionCards: ScenarioCard[];
  suggestedOrder: string[];
  valueOptions: string[];
  keyConflict: string;
  perspectives: {
    self: string;
    others: string;
    consequence: string;
    value: string;
    possibility: string;
  };
  reflectionQuestion: string;
  concept: string[];
}

export const SCENARIO_BANK: Scenario[] = [
  {
    id: 1,
    stage: 1,
    category: '價值思辨',
    difficulty: 'explore',
    title: '大家都選的路，也適合我嗎？',
    situation: '可華的家人希望他選擇熱門科系，但他真正有興趣的是設計。身邊的同學都說，選熱門科系以後比較有工作，可華開始懷疑自己的興趣是不是不夠實際。',
    question: '如果你是可華，你會先做什麼？',
    emotions: ['焦慮', '困惑', '有壓力', '期待'],
    actionCards: [
      { cardId: '1-a', title: '整理自己的興趣與能力', description: '寫下喜歡的事、擅長的事與在意的生活方式' },
      { cardId: '1-b', title: '蒐集科系與職涯資料', description: '比較課程內容、工作環境與發展可能' },
      { cardId: '1-c', title: '與家人進行對話', description: '說明自己的想法，也理解家人的擔心' },
      { cardId: '1-d', title: '直接照別人的安排', description: '先選擇大家認為最安全的道路' }
    ],
    suggestedOrder: ['1-a', '1-b', '1-c', '1-d'],
    valueOptions: ['自主', '安全', '責任', '關係', '成長'],
    keyConflict: '自主選擇與家人期待之間的平衡',
    perspectives: {
      self: '整理自己的興趣與能力，能讓選擇更有依據。',
      others: '家人的意見可能來自對未來穩定的擔心。',
      consequence: '只依照他人期待，短期可能減少衝突，長期可能增加不滿。',
      value: '自主與安全不一定互相排斥，可以透過資料與對話尋找平衡。',
      possibility: '可以安排訪談、體驗課程或短期探索，再做決定。'
    },
    reflectionQuestion: '你曾經在哪件事情上感受到自己的期待與他人的期待不同？',
    concept: ['價值澄清', '自主', '責任選擇']
  },
  {
    id: 2,
    stage: 2,
    category: '哲學思考',
    difficulty: 'think',
    title: '努力就一定會成功嗎？',
    situation: '博俊投入了整整三個月準備全國高中生生命論壇競賽，每天熬夜準備資料，最終卻連佳作都沒有拿到。他看著得獎名單，感到深深的挫折與不公。',
    question: '面對努力與結果的不對等，你會建議博俊怎麼做？',
    emotions: ['難過', '生氣', '困惑', '孤單'],
    actionCards: [
      { cardId: '2-a', title: '接納並表達失落情緒', description: '允許自己難過，不強迫立刻堅強' },
      { cardId: '2-b', title: '回顧過程中的收穫', description: '盤點自己獲得的知識、表達能力與成長' },
      { cardId: '2-c', title: '尋求專業評審或老師建議', description: '瞭解評分標準與改進的方向' },
      { cardId: '2-d', title: '徹底放棄未來競賽', description: '認定自己不適合這類活動' }
    ],
    suggestedOrder: ['2-a', '2-b', '2-c', '2-d'],
    valueOptions: ['成長', '成就', '信念', '接納', '勇氣'],
    keyConflict: '努力的過程價值與結果勝負的內在衝突',
    perspectives: {
      self: '認識到個人的內在價值不單由一次比賽結果定義。',
      others: '評審與競爭對手各有不同優點，不代表你的努力毫無意義。',
      consequence: '盲目放棄會阻斷成長；整理心情能轉換為內在養分。',
      value: '真正的成就不只在於獎牌，更在於歷練後的內在韌性。',
      possibility: '將這次的準備素材整理成個人學習歷程檔案。'
    },
    reflectionQuestion: '當努力沒有得到預期的結果時，是什麼支撐你繼續前進？',
    concept: ['過程價值', '挫折復原', '自我認同']
  },
  {
    id: 3,
    stage: 3,
    category: '人學探索',
    difficulty: 'explore',
    title: '我一定要讓每個人都喜歡嗎？',
    situation: '小雯害怕被同儕孤立，因此總是習慣答應同學們的要求，無論是代訂飲料還是幫忙寫作業。最近她感到非常疲憊，自己的功課反而無法完成。',
    question: '小雯該如何調整她的人際界線？',
    emotions: ['有壓力', '焦慮', '孤單', '害怕'],
    actionCards: [
      { cardId: '3-a', title: '釐清個人的能量極限', description: '了解自己有哪些事情可以幫，哪些會過度消耗' },
      { cardId: '3-b', title: '學習溫和但堅定地拒絕', description: '表達關心，同時誠實說明自己的困難' },
      { cardId: '3-c', title: '與值得信任的朋友深談', description: '分享自己的真實感受，建立健康的雙向關係' },
      { cardId: '3-d', title: '繼續無條件討好所有人', description: '犧牲自己的健康與時間來換取認同' }
    ],
    suggestedOrder: ['3-a', '3-b', '3-c', '3-d'],
    valueOptions: ['尊重', '關係', '自主', '誠實', '健康'],
    keyConflict: '討好他人與建立健康人際界線的矛盾',
    perspectives: {
      self: '學習劃定界線不是冷漠，而是保護內在健康的前提。',
      others: '真誠的朋友會尊重你的困難，而非只利用你的討好。',
      consequence: '長期的自我犧牲會引發內在怨恨與情緒崩潰。',
      value: '真正的關係建立在互相尊重，而非單方面的迎合。',
      possibility: '練習一句簡短預設的拒絕台詞，減輕當下緊張感。'
    },
    reflectionQuestion: '你曾在什麼時候勇敢地說出「不」？那時的感覺如何？',
    concept: ['人際界線', '自我接納', '健全關係']
  },
  {
    id: 4,
    stage: 4,
    category: '價值思辨',
    difficulty: 'think',
    title: '朋友犯錯，我要不要說？',
    situation: '小平發現好友在期末分組報告中，直接複製貼上了網路上的論文全文，並請小保密。如果老師查出抄襲，全組的成績都將被歸零。',
    question: '面對朋友的誠實危機，你會選擇怎麼做？',
    emotions: ['困惑', '有壓力', '害怕', '生氣'],
    actionCards: [
      { cardId: '4-a', title: '先私下與好友溝通', description: '說明抄襲的嚴重性與對全組的後果，鼓勵他修改' },
      { cardId: '4-b', title: '提供具體的修改協助', description: '一起討論如何改寫與註明資料來源' },
      { cardId: '4-c', title: '向老師或導師求助', description: '若好友拒絕修改，尋求師長客觀介入處置' },
      { cardId: '4-d', title: '隱瞞不報並一同承擔風險', description: '為了友情選擇違背原則默許抄襲' }
    ],
    suggestedOrder: ['4-a', '4-b', '4-c', '4-d'],
    valueOptions: ['誠實', '責任', '公平', '關係', '勇氣'],
    keyConflict: '對朋友的忠誠與對誠實公義的拉扯',
    perspectives: {
      self: '捍衛誠實原則能讓你保持內心的坦蕩與坦然。',
      others: '真心的友情應該是協助對方改過，而非陪伴犯錯。',
      consequence: '僥倖隱瞞若被發現，將損及全組信用與學術誠信。',
      value: '誠實是所有信任關係的基石，友情不能建立在虛假上。',
      possibility: '請老師再給小組多一天時間補正報告內容。'
    },
    reflectionQuestion: '當友情與原則發生衝突時，你最看重的是什麼？',
    concept: ['誠實原則', '責任承擔', '真摯友情']
  },
  {
    id: 5,
    stage: 5,
    category: '人學探索',
    difficulty: 'explore',
    title: '成績不好，就代表我不夠好嗎？',
    situation: '可華在數學段考中只得了 45 分，看著身邊同學高分慶祝，他深感沮喪，甚至開始懷疑自己是不是天生能力不如人，未來沒有希望。',
    question: '你該如何幫助可華重新看待這次的成績？',
    emotions: ['難過', '焦慮', '孤單', '困惑'],
    actionCards: [
      { cardId: '5-a', title: '區分「單次成績」與「個人價值」', description: '提醒自己分數只是特定題目的掌握度，不等於全人評價' },
      { cardId: '5-b', title: '進行錯題訂正與原因分析', description: '找出是概念不懂、練習不足還是粗心大意' },
      { cardId: '5-c', title: '調整學習方法或尋求同儕教導', description: '尋求高分同學或老師幫助，改變死記硬背的方式' },
      { cardId: '5-d', title: '完全自我否定並放棄學習', description: '貼上「我就是笨」的標籤，不再嘗試努力' }
    ],
    suggestedOrder: ['5-a', '5-b', '5-c', '5-d'],
    valueOptions: ['自我認同', '成長', '接納', '信念', '勇氣'],
    keyConflict: '外部評價標準與自我多元價值的認知衝突',
    perspectives: {
      self: '人的生命是多元且立體的，學業表現僅是其中一部分。',
      others: '每個人都有不同的思考天賦與學習節奏。',
      consequence: '過度將失敗歸咎於天份會喪失改善的動力與可能。',
      value: '接納自己的不完美，才是真正成長與強大的開端。',
      possibility: '記錄自己在其他領域（如繪畫、同理心）的獨特專長。'
    },
    reflectionQuestion: '除了成績之外，你最欣賞自己的三種特質是什麼？',
    concept: ['自我價值', '成長思維', '多元智能']
  },
  {
    id: 6,
    stage: 6,
    category: '靈性修養與人格統整',
    difficulty: 'explore',
    title: '我有責任替別人承擔一切嗎？',
    situation: '小雯是班上的股長，總是熱心替大家解決各種大小事。最近有同學拖延交作業，甚至希望小雯幫忙編造理由開脫，小雯感到身心俱疲。',
    question: '小雯如何釐清關懷與過度承擔的界線？',
    emotions: ['有壓力', '困惑', '孤單', '難過'],
    actionCards: [
      { cardId: '6-a', title: '劃分責任屬性', description: '分清什麼是自己的職責，什麼是同學該自行承擔的責任' },
      { cardId: '6-b', title: '與同學坦誠表達原則', description: '說明可以協助提醒，但無法幫忙包庇或做假' },
      { cardId: '6-c', title: '必要時向導師反應困難', description: '讓導師了解班級運作的真實瓶頸與壓力' },
      { cardId: '6-d', title: '繼續咬牙替所有人收爛攤子', description: '剝奪他人學習自我負責的機會，同時損害自己' }
    ],
    suggestedOrder: ['6-a', '6-b', '6-c', '6-d'],
    valueOptions: ['責任', '關懷', '公平', '尊重', '自由'],
    keyConflict: '過度熱心包辦與個人責任分際的衝突',
    perspectives: {
      self: '替他人承擔後果往往會阻止對方學會獨立負責。',
      others: '明確的規範能讓團隊運作更健全公平。',
      consequence: '過度包攬會讓自己耗竭，最終無法照顧真正需要的人。',
      value: '真正的關懷是陪伴對方成長，而不是替對方走完人生的路。',
      possibility: '建立班級明確的收繳與提醒公約。'
    },
    reflectionQuestion: '你曾在什麼情境下發現自己承擔了過多不屬於自己的責任？',
    concept: ['責任分際', '關懷倫理', '健康利他']
  },
  {
    id: 7,
    stage: 7,
    category: '終極關懷',
    difficulty: 'challenge',
    title: '失去重要的人之後...',
    situation: '博俊最深愛的爺爺在上個月因病過世了。博俊表面上維持正常的上課生活，但每當夜晚一個人時，便陷入無盡的思念與空虛感中。',
    question: '面對悲傷與失落，博俊可以如何展開療癒？',
    emotions: ['難過', '孤單', '害怕', '安心'],
    actionCards: [
      { cardId: '7-a', title: '允許悲傷自然流露', description: '不壓抑眼淚與哀傷，接納失落是愛過與思念的證明' },
      { cardId: '7-b', title: '尋找信任的師長或家人傾訴', description: '將內心美好的記憶與對爺爺的感謝表達出來' },
      { cardId: '7-c', title: '以有意義的方式紀念他', description: '整理相片、種植植物或延續爺爺美好的教誨' },
      { cardId: '7-d', title: '強迫自己忘記並假裝沒事', description: '封閉情感，拒絕任何悲傷的回憶' }
    ],
    suggestedOrder: ['7-a', '7-b', '7-c', '7-d'],
    valueOptions: ['愛', '感恩', '信念', '接納', '生命意義'],
    keyConflict: '面對死別的深沉失落與重建生活希望的轉化',
    perspectives: {
      self: '悲傷不是軟弱，而是我們對逝者真摯愛意的延續。',
      others: '身邊的家人與朋友也在經歷失落，互相陪伴能帶來力量。',
      consequence: '壓抑悲傷可能導致身心症狀；適度表達才能逐漸復原。',
      value: '生命的長度有限，但愛與美好的影響力可以跨越生死。',
      possibility: '寫一封告別與感謝信給逝去的親人。'
    },
    reflectionQuestion: '哪一段美好的回憶或教誨，至今仍深刻影響著你？',
    concept: ['生死哲思', '失落關懷', '生命有限性']
  },
  {
    id: 8,
    stage: 8,
    category: '哲學思考',
    difficulty: 'think',
    title: '幸福一定等於擁有更多嗎？',
    situation: '小珍看到同學們每到新手機上市就立刻更換，社群軟體上充滿了高級餐廳與名牌鞋款的打卡，她開始對自己的簡樸生活感到空虛與自卑。',
    question: '你會如何引導小珍探索幸福的本質？',
    emotions: ['困惑', '有壓力', '期待', '安心'],
    actionCards: [
      { cardId: '8-a', title: '檢視內心真正的需要與欲望', description: '區分是「想要」還是「需要」，減少盲目盲從盲比' },
      { cardId: '8-b', title: '體驗非物質的內在富足', description: '感受與朋友真誠談心、完成創作或閱讀帶來的滿足' },
      { cardId: '8-c', title: '建立每日感恩日記習慣', description: '記錄生活中已擁有的平凡幸福與小美好' },
      { cardId: '8-d', title: '盲目追求物質打卡來獲得認同', description: '透過不斷購買與比較來短暫填補內心空虛' }
    ],
    suggestedOrder: ['8-a', '8-b', '8-c', '8-d'],
    valueOptions: ['幸福', '意義', '自由', '感恩', '簡樸'],
    keyConflict: '物質慾望的外在刺激與內在精神富足的抉擇',
    perspectives: {
      self: '幸福是一種內在的安定狀態，而非與他人比較的結果。',
      others: '社群媒體呈現的往往只是精心挑選的表面亮點。',
      consequence: '陷於無窮的物質比較只會帶來永無止境的空虛與焦慮。',
      value: '真正的自由是不被外在物品與他人目光所奴役。',
      possibility: '嘗試一週的「社群媒體減量」與「微型靜心」。'
    },
    reflectionQuestion: '在你的生活中，有哪些不需要花大錢就能感到無比幸福的瞬間？',
    concept: ['幸福思辨', '物質與精神', '內在富足']
  },
  {
    id: 9,
    stage: 9,
    category: '靈性修養與人格統整',
    difficulty: 'challenge',
    title: '我想成為怎樣的人？',
    situation: '小高即將高中畢業，身邊的人都在討論要讀什麼賺錢的科系、找什麼高薪的工作。他開始停下腳步思考：人生難道只有賺錢與生存嗎？',
    question: '面對未來的生涯藍圖，小高可以如何進行靈性探索？',
    emotions: ['期待', '困惑', '安心', '有希望'],
    actionCards: [
      { cardId: '9-a', title: '思考個人的核心生命價值', description: '探索自己渴望為這個世界帶來什麼正面改變' },
      { cardId: '9-b', title: '將能力、興趣與社會需求相統合', description: '尋找既能發揮所長又能帶來意義的交集點' },
      { cardId: '9-c', title: '撰寫自己的生命故事與願景', description: '描繪十年後的自己希望擁有什麼樣的人格與生活' },
      { cardId: '9-d', title: '只以薪水與社會地位為唯一指標', description: '忽視內心呼喚，僅追求功利導向的人生目標' }
    ],
    suggestedOrder: ['9-a', '9-b', '9-c', '9-d'],
    valueOptions: ['生命意義', '信念', '服務', '成長', '自主'],
    keyConflict: '世俗功利價值與個人內在召喚（Vocation）的統合',
    perspectives: {
      self: '工作是實現個人天命與社會價值的載體之一。',
      others: '當你的工作能服務他人時，會產生最深沉的幸福感。',
      consequence: '忽視靈性追求會讓中年職涯面臨嚴重的意義感危機。',
      value: '做一個「有品格、有愛心」的人，遠比單純成功更重要。',
      possibility: '訪問一位你尊敬的長輩，瞭解他生命中最珍惜的選擇。'
    },
    reflectionQuestion: '當你八十歲回首一生時，你希望別人如何記得你？',
    concept: ['生命方向', '天命探索', '人格統整']
  },
  {
    id: 10,
    stage: 10,
    category: '終極關懷',
    difficulty: 'explore',
    title: '看見別人的痛苦，我能做什麼？',
    situation: '班上的小安最近家裡發生變故，變得沉默寡言，午餐時間常獨自躲在角落。同學們不知道該怎麼辦，有些人甚至刻意避開他。',
    question: '身為同班同學，你可以如何給予溫暖的同理與陪伴？',
    emotions: ['困惑', '難過', '期待', '安心'],
    actionCards: [
      { cardId: '10-a', title: '給予安靜且不施壓的陪伴', description: '用溫和的微笑或遞上一張加油便條紙表達關心' },
      { cardId: '10-b', title: '傾聽而不輕易給予說教或評價', description: '當他想說時耐心地聽，不講大道理' },
      { cardId: '10-c', title: '評估狀況並尋求輔導老師協助', description: '若發現情緒危機過重，及時尋求專業協助' },
      { cardId: '10-d', title: '完全冷漠或當作八卦私下討論', description: '對他人的痛苦視而不見甚至二次傷害' }
    ],
    suggestedOrder: ['10-a', '10-b', '10-c', '10-d'],
    valueOptions: ['關懷', '同理', '尊重', '關係', '責任'],
    keyConflict: '害怕給他人添麻煩的猶豫與真誠同理行動的實踐',
    perspectives: {
      self: '伸出溫暖的手能喚醒內心的善意與社會連結感。',
      others: '人在最脆弱時，一個真誠的眼神就能帶來無限希望。',
      consequence: '冷漠會加速痛苦者的孤立感；溫暖的社群能成為避風港。',
      value: '人與人之間的同理與互助是社會最美好的光芒。',
      possibility: '邀請他一起去圖書館安靜自習或散步。'
    },
    reflectionQuestion: '當你陷入低潮時，別人做的哪一件小事曾深深溫暖了你？',
    concept: ['同理心', '溫暖陪伴', '社會支持網絡']
  }
];

interface LifeCompassGameProps {
  currentStudent: any;
  onSaveQuest: (studentId: string, questType: string, data: any) => void;
  onClose?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function LifeCompassGame({
  currentStudent,
  onSaveQuest,
  onClose,
  onNavigateTab
}: LifeCompassGameProps) {

  // Audio / Sound FX Toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Random 10 Scenarios Fisher-Yates Session Sampling
  const sessionScenarios = useMemo(() => {
    const copy = [...SCENARIO_BANK];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 10);
  }, []);

  // Game State Indexes & Energy
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentScenario = sessionScenarios[currentIndex] || sessionScenarios[0];

  // Stats
  const [reflectionEnergy, setReflectionEnergy] = useState<number>(680);
  const [streak, setStreak] = useState<number>(1);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [currentHintTier, setCurrentHintTier] = useState<number>(0); // 0: none, 1, 2, 3
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Scenario Form States for current question
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [orderedCards, setOrderedCards] = useState<ScenarioCard[]>([]);
  const [selectedPrimaryValue, setSelectedPrimaryValue] = useState<string>('');
  const [selectedSecondaryValue, setSelectedSecondaryValue] = useState<string>('');
  const [selectedOverlookedValue, setSelectedOverlookedValue] = useState<string>('');
  const [reasonText, setReasonText] = useState<string>('');
  const [extendedReflection, setExtendedReflection] = useState<string>('');

  // Selected Card for swapping
  const [selectedCardIdForSwap, setSelectedCardIdForSwap] = useState<string | null>(null);

  // Submitted Feedback Modal
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConceptModal, setShowConceptModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Session Records array
  const [sessionRecords, setSessionRecords] = useState<any[]>([]);

  // Initialize orderedCards whenever scenario changes
  useEffect(() => {
    if (currentScenario) {
      // Shuffle action cards initially so it's not suggested order
      const cards = [...currentScenario.actionCards];
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      setOrderedCards(cards);
      setSelectedEmotions([currentScenario.emotions[0]]);
      setSelectedPrimaryValue(currentScenario.valueOptions[0] || '自主');
      setSelectedSecondaryValue(currentScenario.valueOptions[1] || '責任');
      setSelectedOverlookedValue(currentScenario.valueOptions[2] || '關係');
      setReasonText('');
      setExtendedReflection('');
      setIsSubmitted(false);
      setCurrentHintTier(0);
      setSelectedCardIdForSwap(null);
    }
  }, [currentIndex, currentScenario]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Emotion selection
  const handleToggleEmotion = (emo: string) => {
    if (selectedEmotions.includes(emo)) {
      if (selectedEmotions.length === 1) {
        triggerToast('請至少選擇一項感受情緒喔！');
        return;
      }
      setSelectedEmotions(selectedEmotions.filter(e => e !== emo));
    } else {
      setSelectedEmotions([...selectedEmotions, emo]);
    }
  };

  // Move Card Up/Down
  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const newCards = [...orderedCards];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCards.length) return;
    [newCards[index], newCards[targetIdx]] = [newCards[targetIdx], newCards[index]];
    setOrderedCards(newCards);
  };

  // Swap Two Cards by Click
  const handleCardClick = (cardId: string) => {
    if (!selectedCardIdForSwap) {
      setSelectedCardIdForSwap(cardId);
      triggerToast('已選取此卡片，請點擊另一張卡片交換位置');
    } else if (selectedCardIdForSwap === cardId) {
      setSelectedCardIdForSwap(null);
    } else {
      const idx1 = orderedCards.findIndex(c => c.cardId === selectedCardIdForSwap);
      const idx2 = orderedCards.findIndex(c => c.cardId === cardId);
      if (idx1 !== -1 && idx2 !== -1) {
        const newCards = [...orderedCards];
        [newCards[idx1], newCards[idx2]] = [newCards[idx2], newCards[idx1]];
        setOrderedCards(newCards);
        triggerToast('🔄 已成功交換兩張行動卡位置！');
      }
      setSelectedCardIdForSwap(null);
    }
  };

  // Reset Card Order
  const handleResetCards = () => {
    const cards = [...currentScenario.actionCards];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setOrderedCards(cards);
    triggerToast('🎲 行動卡已重新洗牌！');
  };

  // Handle Hint Request
  const handleShowHint = () => {
    if (currentHintTier < 3) {
      const nextTier = currentHintTier + 1;
      setCurrentHintTier(nextTier);
      setHintsUsedCount(prev => prev + 1);
      triggerToast(`💡 已開啟第 ${nextTier} 階段提示！`);
    } else {
      triggerToast('已顯示全部 3 階段提示囉！');
    }
  };

  // Submit Answer & Calculate Multi-perspective Feedback
  const handleSubmitThinking = () => {
    if (selectedEmotions.length === 0) {
      triggerToast('⚠️ 請至少勾選一項您的感受情緒！');
      return;
    }
    if (reasonText.trim().length < 10) {
      triggerToast('⚠️ 請在理由輸入框填寫至少 10 個字的選擇理由喔！');
      return;
    }

    // Award Points
    let gainedEnergy = 100;
    if (currentHintTier === 0) gainedEnergy += 20; // No hint bonus
    setReflectionEnergy(prev => prev + gainedEnergy);

    setIsSubmitted(true);

    // Save record item
    const recordItem = {
      scenarioId: currentScenario.id,
      title: currentScenario.title,
      category: currentScenario.category,
      emotions: selectedEmotions,
      userOrder: orderedCards.map(c => c.title),
      primaryValue: selectedPrimaryValue,
      secondaryValue: selectedSecondaryValue,
      overlookedValue: selectedOverlookedValue,
      reason: reasonText,
      extendedReflection,
      hintsUsed: currentHintTier,
      timestamp: new Date().toLocaleString()
    };

    setSessionRecords(prev => [...prev, recordItem]);

    // REAL-TIME SYNC: Save quest result into main app state
    const studentId = currentStudent?.id || 'stud_kehua';
    const questData = {
      score: 95,
      totalQuestions: 10,
      correctQuestions: currentIndex + 1,
      title: `《生命羅盤》: ${currentScenario.title}`,
      category: currentScenario.category,
      emotions: selectedEmotions,
      primaryValue: selectedPrimaryValue,
      reason: reasonText,
      reflectionEnergy: reflectionEnergy + gainedEnergy,
      completedCount: currentIndex + 1
    };

    onSaveQuest(studentId, 'game_adventure', questData);
    onSaveQuest(studentId, 'game_compass', questData);

    triggerToast('✨ 成功送出思考！能量 +100！數據已即時同步全站！');
  };

  // Go to Next Scenario
  const handleNextScenario = () => {
    if (currentIndex < sessionScenarios.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setIsCompleted(true);
      triggerToast('🎉 恭喜！您已完成本次 10 關生命羅盤探索！');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-[#3E2723] font-sans relative overflow-hidden pb-12 select-none">
      
      {/* SVG hand-drawn floral ornaments: Left and Right background of page - Same as HomeTab */}
      <svg className="absolute left-0 top-36 w-36 h-80 opacity-40 pointer-events-none select-none z-0 hidden lg:block" viewBox="0 0 100 200" fill="none">
        <path d="M10 200 Q20 120 40 50" stroke="#A7BFA1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 200 Q35 150 25 100" stroke="#A7BFA1" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M40 50 Q50 40 45 35 Q35 45 40 50 Z" fill="#C5D3C2" />
        <path d="M36 75 Q46 70 42 62 Q32 70 36 75 Z" fill="#B3C4AF" />
        <path d="M30 110 Q42 105 38 95 Q26 102 30 110 Z" fill="#C5D3C2" />
        <path d="M22 135 Q10 125 14 118 Q24 125 22 135 Z" fill="#9FB49B" />
        <circle cx="45" cy="35" r="4.5" fill="#F4BCA3" />
        <circle cx="41" cy="62" r="5.5" fill="#F0C3B2" />
        <circle cx="28" cy="115" r="6" fill="#F4BCA3" />
      </svg>

      <svg className="absolute right-0 top-36 w-36 h-80 opacity-40 pointer-events-none select-none z-0 hidden lg:block" viewBox="0 0 100 200" fill="none">
        <path d="M90 200 Q80 120 60 40" stroke="#A7BFA1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M90 200 Q65 140 75 80" stroke="#A7BFA1" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 40 Q50 30 55 25 Q65 35 60 40 Z" fill="#B3C4AF" />
        <path d="M64 70 Q54 65 58 57 Q68 62 64 70 Z" fill="#C5D3C2" />
        <path d="M70 105 Q58 100 62 90 Q74 97 70 105 Z" fill="#9FB49B" />
        <path d="M78 130 Q90 120 86 113 Q76 120 78 130 Z" fill="#C5D3C2" />
        <circle cx="55" cy="25" r="5" fill="#F4BCA3" />
        <circle cx="58" cy="57" r="4.5" fill="#F0C3B2" />
        <circle cx="72" cy="110" r="6.5" fill="#F4BCA3" />
      </svg>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#E65100] text-white px-5 py-3 rounded-2xl shadow-xl font-extrabold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION A: TOP HEADER BAR                                  */}
      {/* ========================================================= */}
      <div className="bg-[#FFFDF9] border-b-2 border-[#EAD5C3] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between flex-wrap gap-3">
          
          {/* Left Title & Icons */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E65100] to-[#FF6F00] text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-[#4A321F] tracking-tight">生命羅盤研究所</h1>
                <span className="text-xs font-black bg-[#E65100]/10 text-[#E65100] border border-[#E65100]/30 px-2.5 py-0.5 rounded-full">
                  幸福人生篇
                </span>
              </div>
              <p className="text-xs font-bold text-[#7D5C43]/80 hidden sm:block">
                閱讀情境、整理感受、做出選擇，看見真正重視的價值。
              </p>
            </div>
          </div>

          {/* Right Controls & User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#F5EBE1] px-3 py-1.5 rounded-xl border border-[#EAD5C3] text-xs font-black text-[#4A321F]">
              <Award className="w-4 h-4 text-[#E65100]" />
              <span>玩家：{currentStudent?.name || '陳可華'}</span>
              <span className="text-[#E65100] font-mono">Lv.3</span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-[#F5EBE1] hover:bg-[#EAD5C3] rounded-xl text-[#4A321F] transition-all cursor-pointer"
              title={soundEnabled ? '關閉音效' : '開啟音效'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-[#E65100] hover:bg-[#c84400] text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer"
              >
                返回大廳
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Container */}
      {!isCompleted ? (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

          {/* ========================================================= */}
          {/* SECTION B & C & D: TOP DASHBOARD & SCENARIO CARD            */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Info Panel (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-[#EAD5C3] pb-3">
                  <span className="text-xs font-black text-[#7D5C43] flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-[#E65100]" /> 本次任務
                  </span>
                  <span className="text-xs font-black text-[#2E7D32] bg-[#2E7D32]/10 border border-[#2E7D32]/30 px-2 py-0.5 rounded-md">
                    {currentScenario.category}
                  </span>
                </div>

                <div className="space-y-3 text-xs font-extrabold text-[#4A321F]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">當前關卡：</span>
                    <span className="font-mono text-[#E65100] text-sm">第 {currentIndex + 1} / 10 關</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">完成進度：</span>
                    <span className="font-mono text-[#2E7D32]">{Math.round(((currentIndex + 1) / 10) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#F5EBE1] h-2.5 rounded-full overflow-hidden border border-[#EAD5C3]">
                    <div
                      className="bg-gradient-to-r from-[#E65100] to-[#FF6F00] h-full transition-all duration-500"
                      style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAD5C3]">
                    <span className="text-slate-400">反思能量：</span>
                    <span className="font-mono text-amber-600 text-sm flex items-center gap-1">
                      <Zap className="w-4 h-4 fill-amber-500 text-amber-500" /> {reflectionEnergy}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">連勝倍率：</span>
                    <span className="font-mono text-rose-500 flex items-center gap-1">
                      <Flame className="w-4 h-4 fill-rose-500" /> ×{streak}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">使用提示：</span>
                    <span className="font-mono text-slate-500">{hintsUsedCount} 次</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowConceptModal(true)}
                  className="w-full py-2 bg-[#F5EBE1] hover:bg-[#EAD5C3] border border-[#EAD5C3] rounded-xl text-xs font-black text-[#4A321F] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>查看對應生命教育概念</span>
                </button>
              </div>
            </div>

            {/* Central Scenario Task Area (9 Cols) */}
            <div className="lg:col-span-9 space-y-5">
              
              {/* Scenario Main Card */}
              <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-6 md:p-7 shadow-sm text-left space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#E65100] text-white text-[11px] font-black px-4 py-1 rounded-bl-2xl">
                  {currentScenario.difficulty === 'explore' ? '探索模式' : currentScenario.difficulty === 'think' ? '思辨模式' : '挑戰模式'}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black text-[#E65100] tracking-wider uppercase">
                    SCENARIO #{currentScenario.id} ‧ {currentScenario.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-[#4A321F]">
                    {currentScenario.title}
                  </h2>
                </div>

                <div className="bg-[#FAF6F0] border border-[#EAD5C3] rounded-2xl p-4 md:p-5 text-sm font-bold text-[#5D4037] leading-relaxed shadow-inner">
                  {currentScenario.situation}
                </div>

                {/* Task Checklist Navigation Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-black">
                  <div className={`p-2 rounded-xl text-center border ${selectedEmotions.length > 0 ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]' : 'bg-[#F5EBE1] text-slate-400'}`}>
                    1. 覺察感受 {selectedEmotions.length > 0 ? '✓' : ''}
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${orderedCards.length > 0 ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]' : 'bg-[#F5EBE1] text-slate-400'}`}>
                    2. 排列行動 ✓
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${selectedPrimaryValue ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]' : 'bg-[#F5EBE1] text-slate-400'}`}>
                    3. 選擇價值 {selectedPrimaryValue ? '✓' : ''}
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${reasonText.trim().length >= 10 ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]' : 'bg-[#F5EBE1] text-slate-400'}`}>
                    4. 寫下理由 {reasonText.trim().length >= 10 ? '✓' : ''}
                  </div>
                </div>
              </div>

              {/* SECTION D: EMOTION AWARENESS AREA */}
              <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#4A321F] flex items-center gap-1.5">
                    <span>❤️</span> 任務一：如果你是主角，現在可能感受到什麼？（可複選）
                  </h3>
                  <span className="text-[11px] text-[#2E7D32] font-bold">
                    情緒沒有對錯，它在提醒我們某些內在需要
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['焦慮', '期待', '害怕', '困惑', '生氣', '難過', '孤單', '安心', '有壓力', '有希望', '猶豫'].map(emo => {
                    const isSelected = selectedEmotions.includes(emo);
                    return (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => handleToggleEmotion(emo)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#E65100] text-white border-[#E65100] shadow-xs'
                            : 'bg-[#F5EBE1] hover:bg-[#EAD5C3] text-[#4A321F] border-[#EAD5C3]'
                        }`}
                      >
                        {emo} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION E: ACTION CARDS REORDERING AREA */}
              <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 md:p-6 shadow-xs text-left space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-black text-[#4A321F] flex items-center gap-1.5">
                      <span>🧭</span> 任務二：排列你會採取的行動先後順序（拖曳或點擊交換）
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      請點擊兩張卡片交換位置，或使用上下按鈕調整理想順序
                    </p>
                  </div>
                  <button
                    onClick={handleResetCards}
                    className="px-3 py-1.5 bg-[#F5EBE1] hover:bg-[#EAD5C3] text-[#4A321F] rounded-xl text-xs font-black border border-[#EAD5C3] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 重新洗牌
                  </button>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5">
                  {orderedCards.map((card, idx) => {
                    const isSelectedForSwap = selectedCardIdForSwap === card.cardId;
                    return (
                      <div
                        key={card.cardId}
                        onClick={() => handleCardClick(card.cardId)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelectedForSwap
                            ? 'bg-amber-50 border-[#E65100] ring-2 ring-[#E65100]/40 shadow-md scale-[1.01]'
                            : 'bg-[#FAF6F0] hover:bg-[#F5EBE1] border-[#EAD5C3]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-[#E65100] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs font-mono">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs md:text-sm font-black text-[#4A321F]">{card.title}</h4>
                            <p className="text-[11px] font-bold text-[#7D5C43]">{card.description}</p>
                          </div>
                        </div>

                        {/* Order Adjustment Buttons */}
                        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveCard(idx, 'up')}
                            className="p-1.5 bg-white border border-[#EAD5C3] rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-[#4A321F] cursor-pointer"
                            title="向上移動"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === orderedCards.length - 1}
                            onClick={() => handleMoveCard(idx, 'down')}
                            className="p-1.5 bg-white border border-[#EAD5C3] rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-[#4A321F] cursor-pointer"
                            title="向下移動"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION F: VALUE SELECTION AREA */}
              <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left space-y-3">
                <h3 className="text-sm font-black text-[#4A321F] flex items-center gap-1.5">
                  <span>⚖️</span> 任務三：選擇你在做決定時最重視的價值
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Primary Value */}
                  <div>
                    <label className="block text-xs font-black text-[#4A321F] mb-1">最核心標竿價值</label>
                    <select
                      value={selectedPrimaryValue}
                      onChange={e => setSelectedPrimaryValue(e.target.value)}
                      className="w-full bg-[#FAF6F0] border-2 border-[#EAD5C3] rounded-xl p-2.5 text-xs font-black text-[#4A321F] outline-none focus:border-[#E65100]"
                    >
                      {currentScenario.valueOptions.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Secondary Value */}
                  <div>
                    <label className="block text-xs font-black text-[#4A321F] mb-1">次要兼顧價值</label>
                    <select
                      value={selectedSecondaryValue}
                      onChange={e => setSelectedSecondaryValue(e.target.value)}
                      className="w-full bg-[#FAF6F0] border-2 border-[#EAD5C3] rounded-xl p-2.5 text-xs font-black text-[#4A321F] outline-none focus:border-[#E65100]"
                    >
                      {currentScenario.valueOptions.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Overlooked Value */}
                  <div>
                    <label className="block text-xs font-black text-[#4A321F] mb-1">可能忽略的價值</label>
                    <select
                      value={selectedOverlookedValue}
                      onChange={e => setSelectedOverlookedValue(e.target.value)}
                      className="w-full bg-[#FAF6F0] border-2 border-[#EAD5C3] rounded-xl p-2.5 text-xs font-black text-[#4A321F] outline-none focus:border-[#E65100]"
                    >
                      {currentScenario.valueOptions.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION G: REASON INPUT AREA */}
              <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-5 shadow-xs text-left space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#4A321F] flex items-center gap-1.5">
                    <span>✍️</span> 任務四：我這樣排序與選擇，是因為... (至少 10 字)
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {reasonText.trim().length} / 300 字
                  </span>
                </div>

                {/* Sentence Prompt Starters */}
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-[#7D5C43]">
                  <span className="text-slate-400">快速句首提示：</span>
                  {[
                    '我最在意的是...',
                    '我擔心的是...',
                    '我希望兼顧...',
                    '如果我是主角...'
                  ].map(prompt => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setReasonText(prev => prev + ' ' + prompt)}
                      className="px-2.5 py-1 bg-[#F5EBE1] hover:bg-[#EAD5C3] border border-[#EAD5C3] rounded-lg text-[#4A321F] cursor-pointer"
                    >
                      + {prompt}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={reasonText}
                  onChange={e => setReasonText(e.target.value)}
                  placeholder="寫下您排序與做出價值選擇背後的內在理由與考量..."
                  className="w-full bg-[#FAF6F0] border-2 border-[#EAD5C3] rounded-2xl p-3 text-xs font-bold text-[#4A321F] outline-none focus:border-[#E65100]"
                />
              </div>

              {/* SECTION H: ACTION BUTTONS BAR */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShowHint}
                    className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>查看提示 ({currentHintTier}/3)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSubmitThinking}
                    className="px-6 py-3 bg-gradient-to-r from-[#E65100] to-[#FF6F00] hover:from-[#c84400] hover:to-[#e65100] text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>送出思考與分析</span>
                  </button>
                </div>
              </div>

              {/* Display Hints Box if triggered */}
              {currentHintTier > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-left space-y-2 text-xs text-amber-950">
                  <h4 className="font-black flex items-center gap-1.5 text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600" /> 三階段思考引導提示
                  </h4>
                  {currentHintTier >= 1 && (
                    <p className="font-bold">
                      💡 <strong>一階（核心衝突）：</strong> {currentScenario.keyConflict}
                    </p>
                  )}
                  {currentHintTier >= 2 && (
                    <p className="font-bold">
                      💡 <strong>二階（思考架構）：</strong> 想一想：這個決定最直接影響的是誰？短期內會發生什麼，長期會帶來什麼影響？
                    </p>
                  )}
                  {currentHintTier >= 3 && (
                    <p className="font-bold">
                      💡 <strong>三階（行動範例）：</strong> 建議的第一步往往是「先了解資訊」或「整理自身感受」，再進行溝通。
                    </p>
                  )}
                </div>
              )}

              {/* SECTION I: MULTI-PERSPECTIVE FEEDBACK AREA (Shows after submit) */}
              {isSubmitted && (
                <div className="bg-[#FAF6F0] border-2 border-[#2E7D32] rounded-3xl p-6 text-left space-y-5 shadow-lg animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#CDE7CD] pb-3">
                    <h3 className="text-base font-black text-[#1B5E20] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#2E7D32]" /> 多角度生命思辨分析報告
                    </h3>
                    <span className="text-xs font-black text-[#2E7D32] bg-[#2E7D32]/10 border border-[#2E7D32]/30 px-3 py-1 rounded-full">
                      已完成分析
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] p-3 rounded-xl border border-emerald-200">
                    🌿 <strong>生命教育提醒：</strong> 每個人在特定人生階段重視的價值不同，這是一種較能兼顧資訊、關係與責任的處理參考，不代表其他選擇一定錯誤。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white border border-[#EAD5C3] rounded-2xl p-3.5 space-y-1">
                      <h4 className="font-black text-[#4A321F] flex items-center gap-1">👁️ 1. 看見自己</h4>
                      <p className="font-bold text-[#7D5C43]">{currentScenario.perspectives.self}</p>
                    </div>
                    <div className="bg-white border border-[#EAD5C3] rounded-2xl p-3.5 space-y-1">
                      <h4 className="font-black text-[#4A321F] flex items-center gap-1">🤝 2. 看見他人</h4>
                      <p className="font-bold text-[#7D5C43]">{currentScenario.perspectives.others}</p>
                    </div>
                    <div className="bg-white border border-[#EAD5C3] rounded-2xl p-3.5 space-y-1">
                      <h4 className="font-black text-[#4A321F] flex items-center gap-1">⏳ 3. 看見後果</h4>
                      <p className="font-bold text-[#7D5C43]">{currentScenario.perspectives.consequence}</p>
                    </div>
                    <div className="bg-white border border-[#EAD5C3] rounded-2xl p-3.5 space-y-1">
                      <h4 className="font-black text-[#4A321F] flex items-center gap-1">⚖️ 4. 看見價值</h4>
                      <p className="font-bold text-[#7D5C43]">{currentScenario.perspectives.value}</p>
                    </div>
                  </div>

                  {/* Extended Reflection Question */}
                  <div className="bg-white border-2 border-[#EAD5C3] rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black text-[#4A321F]">
                      ❓ 延伸深度反思：{currentScenario.reflectionQuestion}
                    </h4>
                    <textarea
                      rows={2}
                      value={extendedReflection}
                      onChange={e => setExtendedReflection(e.target.value)}
                      placeholder="簡短寫下您的延伸體會與個人經歷..."
                      className="w-full bg-[#FAF6F0] border border-[#EAD5C3] rounded-xl p-2.5 text-xs font-bold text-[#4A321F] outline-none"
                    />
                  </div>

                  {/* Next Scenario Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextScenario}
                      className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>前往下一個生命情境 ({currentIndex + 2}/10)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      ) : (
        /* ========================================================= */
        /* SUMMARY REVIEW & SETTLEMENT PAGE                           */
        /* ========================================================= */
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
          <div className="bg-[#FFFDF9] border-2 border-[#EAD5C3] rounded-3xl p-6 md:p-8 shadow-xl text-center space-y-6">
            
            <div className="inline-flex p-4 bg-[#2E7D32]/10 border border-[#2E7D32]/40 rounded-full text-[#2E7D32] animate-bounce">
              <Award className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-[#4A321F]">
                《生命羅盤研究所：幸福人生篇》 探索完成！
              </h2>
              <p className="text-xs md:text-sm font-bold text-[#7D5C43]">
                您已完成本次 10 關生命情境抉擇與思考，收穫滿滿的內在洞察。
              </p>
            </div>

            {/* Overall Metrics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="bg-[#FAF6F0] border border-[#EAD5C3] rounded-2xl p-3.5">
                <span className="text-xs font-black text-slate-400 block">累計反思能量</span>
                <span className="text-xl font-black text-amber-600 font-mono">{reflectionEnergy}</span>
              </div>
              <div className="bg-[#FAF6F0] border border-[#EAD5C3] rounded-2xl p-3.5">
                <span className="text-xs font-black text-slate-400 block">完成情境數</span>
                <span className="text-xl font-black text-[#2E7D32] font-mono">10 / 10</span>
              </div>
              <div className="bg-[#FAF6F0] border border-[#EAD5C3] rounded-2xl p-3.5">
                <span className="text-xs font-black text-slate-400 block">獲得學習徽章</span>
                <span className="text-xl font-black text-[#E65100] font-mono">4 精神徽章</span>
              </div>
              <div className="bg-[#FAF6F0] border border-[#EAD5C3] rounded-2xl p-3.5">
                <span className="text-xs font-black text-slate-400 block">提示使用總次數</span>
                <span className="text-xl font-black text-purple-600 font-mono">{hintsUsedCount} 次</span>
              </div>
            </div>

            {/* Insight Statement */}
            <div className="bg-[#E8F5E9] border border-[#CDE7CD] rounded-2xl p-4 text-xs font-bold text-[#1B5E20] text-left leading-relaxed">
              💡 <strong>價值探索回顧：</strong> 在本次活動中，您經常優先考量<strong>「自主選擇」</strong>與<strong>「誠實責任」</strong>。無倫面對人際關係或未來目標，保持真誠與內在價值能引導您走出一條坦蕩幸福的人生成長道路。
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setIsCompleted(false);
                }}
                className="px-6 py-2.5 bg-[#F5EBE1] hover:bg-[#EAD5C3] border border-[#EAD5C3] text-[#4A321F] font-black text-xs rounded-xl cursor-pointer"
              >
                再探索一次
              </button>
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('學習紀錄');
                }}
                className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                查看個人學習紀錄頁 →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONCEPT EXPLANATION MODAL                                  */}
      {/* ========================================================= */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#E65100] rounded-3xl p-6 max-w-lg w-full text-left space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowConceptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-[#EAD5C3] pb-3">
              <Lightbulb className="w-6 h-6 text-[#E65100]" />
              <h3 className="text-lg font-black text-[#4A321F]">對應生命教育概念說明</h3>
            </div>

            <div className="space-y-3 text-xs font-bold text-[#5D4037] leading-relaxed">
              <p>
                <strong>【當前主題】：</strong> {currentScenario.category}
              </p>
              <p>
                <strong>【核心衝突】：</strong> {currentScenario.keyConflict}
              </p>
              <p>
                <strong>【學習架構】：</strong> 價值澄清不是替你決定標準答案，而是幫助我看見自己在意什麼、選擇會影響誰，以及願意承擔什麼後果。
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowConceptModal(false)}
                className="px-5 py-2 bg-[#E65100] text-white font-black text-xs rounded-xl cursor-pointer"
              >
                瞭解了，繼續思考
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
