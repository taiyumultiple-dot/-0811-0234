import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase JSON limit to handle base64 image uploads comfortably
app.use(express.json({ limit: "15mb" }));

// ==========================================
// PERSISTENT STORAGE (Supabase)
// ==========================================
// Local disk (uploads/, data/db.json) does NOT survive redeploys/restarts on
// most hosting, so all app state and avatar images are stored in Supabase
// instead: a Postgres table (public.app_state) for JSON state, and a public
// Storage bucket ("avatars") for images.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
let supabase: ReturnType<typeof createClient> | null = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.warn("⚠️ Warning: SUPABASE_URL / SUPABASE_KEY not set. Falling back to local-disk storage (data will NOT persist across redeploys).");
}

// Legacy local-disk fallback paths, only used if Supabase isn't configured.
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Serve uploaded avatars statically (legacy fallback only)
app.use("/uploads", express.static(UPLOADS_DIR));

// Helper to load/save server database
async function loadDB(): Promise<any> {
  if (supabase) {
    const { data, error } = await supabase.from("app_state").select("key, value");
    if (error) {
      console.error("Failed to load app_state from Supabase:", error);
      return {};
    }
    const db: any = {};
    for (const row of (data || []) as { key: string; value: any }[]) {
      db[row.key] = row.value;
    }
    return db;
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch (e) {
      console.error("Failed to read server db file, returning empty", e);
    }
  }
  return {};
}

async function saveDB(data: any): Promise<void> {
  if (supabase) {
    const rows: { key: string; value: any; updated_at: string }[] = Object.keys(data).map((key) => ({
      key,
      value: data[key],
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("app_state").upsert(rows as any, { onConflict: "key" });
    if (error) {
      console.error("Failed to save app_state to Supabase:", error);
    }
    return;
  }
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save server db file", e);
  }
}

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. AI features will fallback to local simulators.");
}

// ==========================================
// API ROUTES FIRST
// ==========================================

// 0. State save/load endpoints
app.get("/api/state", async (req, res) => {
  const db = await loadDB();
  res.json({
    characters: db.characters || null,
    registeredUsers: db.registeredUsers || null,
    submissions: db.submissions || null,
  });
});

// Helper to process base64 avatars automatically on state POST — uploads to
// Supabase Storage when configured, otherwise falls back to local disk.
async function processBase64Url(id: string, url: string): Promise<string> {
  if (url && url.startsWith('data:')) {
    try {
      const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'png';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${id}_${Date.now()}.${ext}`;

        if (supabase) {
          // Clean up old avatar files for this character in the bucket
          try {
            const { data: existing } = await supabase.storage.from("avatars").list("", { search: id });
            const toRemove = (existing || []).filter((f) => f.name.startsWith(`${id}_`)).map((f) => f.name);
            if (toRemove.length > 0) {
              await supabase.storage.from("avatars").remove(toRemove);
            }
          } catch (err) {
            console.warn("Could not clean up old avatars in Supabase for:", id, err);
          }

          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filename, buffer, { contentType: matches[1], upsert: true });
          if (uploadError) {
            console.error("Supabase avatar upload failed:", uploadError);
            return url;
          }
          const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filename);
          return publicUrlData.publicUrl;
        }

        // Local-disk fallback
        const filepath = path.join(UPLOADS_DIR, filename);
        try {
          const files = fs.readdirSync(UPLOADS_DIR);
          for (const f of files) {
            if (f.startsWith(`${id}_`)) {
              fs.unlinkSync(path.join(UPLOADS_DIR, f));
            }
          }
        } catch (err) {
          console.warn("Could not clean up old avatars for:", id, err);
        }
        fs.writeFileSync(filepath, buffer);
        return `/uploads/${filename}`;
      }
    } catch (e) {
      console.error("Failed to process base64 url for:", id, e);
    }
  }
  return url;
}

app.post("/api/state", async (req, res) => {
  const { characters, registeredUsers, submissions } = req.body;
  const db = await loadDB();

  if (characters !== undefined) {
    db.characters = await Promise.all(
      characters.map(async (c: any) => ({
        ...c,
        avatarUrl: await processBase64Url(c.id, c.avatarUrl),
      }))
    );
  }

  if (registeredUsers !== undefined) {
    db.registeredUsers = await Promise.all(
      registeredUsers.map(async (u: any) => ({
        ...u,
        avatarUrl: await processBase64Url(u.id, u.avatarUrl),
      }))
    );
  }

  if (submissions !== undefined) db.submissions = submissions;
  await saveDB(db);
  res.json({ success: true, characters: db.characters, registeredUsers: db.registeredUsers });
});

// 0.5 Avatar Upload endpoint
app.post("/api/upload-avatar", async (req, res) => {
  const { charId, base64 } = req.body;
  if (!charId || !base64) {
    return res.status(400).json({ error: "Missing charId or base64" });
  }

  try {
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 string format" });
    }

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${charId}_${Date.now()}.${ext}`;

    if (supabase) {
      try {
        const { data: existing } = await supabase.storage.from("avatars").list("", { search: charId });
        const toRemove = (existing || []).filter((f) => f.name.startsWith(`${charId}_`)).map((f) => f.name);
        if (toRemove.length > 0) {
          await supabase.storage.from("avatars").remove(toRemove);
        }
      } catch (err) {
        console.warn("Could not clean up old avatars in Supabase:", err);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filename, buffer, { contentType: matches[1], upsert: true });
      if (uploadError) {
        console.error("Supabase avatar upload failed:", uploadError);
        return res.status(500).json({ error: "Upload Failed", message: uploadError.message });
      }
      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filename);
      return res.json({ url: publicUrlData.publicUrl });
    }

    // Local-disk fallback
    const filepath = path.join(UPLOADS_DIR, filename);
    try {
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const f of files) {
        if (f.startsWith(`${charId}_`)) {
          fs.unlinkSync(path.join(UPLOADS_DIR, f));
        }
      }
    } catch (err) {
      console.warn("Could not clean up old avatars:", err);
    }

    fs.writeFileSync(filepath, buffer);
    res.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error("Failed to save avatar image file:", error);
    res.status(500).json({ error: "Upload Failed", message: error.message });
  }
});

// 1. Check AI readiness status
app.get("/api/ai/status", (req, res) => {
  res.json({
    ready: !!ai,
    message: ai 
      ? "AI 引擎已連線並啟動完成！" 
      : "尚未設定 Gemini API Key。請點選右上角 Settings > Secrets 儲存您的 GEMINI_API_KEY，或繼續體驗平台內建的本機互動模擬！"
  });
});

// 2. AI Assisted Grading for Teacher
app.post("/api/ai/grade-submission", async (req, res) => {
  const { studentName, activeSheet, answers } = req.body;

  if (!ai) {
    return res.status(400).json({
      error: "API_KEY_MISSING",
      message: "未偵測到 GEMINI_API_KEY。請先至 Settings > Secrets 設定並儲存 API Key。"
    });
  }

  try {
    let sheetTitle = activeSheet === "woop" ? "WOOP 心理韌性心靈防護甲" : "棺材中的凝視：我的生前特展";
    let answerText = JSON.stringify(answers);

    const prompt = `你是一位資深的生命教育老師（林老師）。請批改高中生「${studentName}」提交的「${sheetTitle}」學習單。
    學生填寫的內容如下：
    ${answerText}

    請針對學生的填寫內容，依據哲學思考、人學探索、或存在主義的生命關懷視角，給予具有啟發性、同理心、溫暖且具體的引導評語。
    要求：
    1. 評語以第二人稱（如「你」）親切地對學生說話，多加肯定他的誠實與覺察。
    2. 從 ['勇敢追夢中', '思考小高手', '韌性練習中', '未來的自己'] 這四個榮譽勳章中，挑選 1 到 2 個最契合的勳章。
    3. 給予一個建議的分數（80 到 100 分之間）。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一位充滿熱忱、慈祥、專業的高中生命教育科老師。請以引導思辨和讚美優點為主，批改學生的心靈反思日記或學習單。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comments: {
              type: Type.STRING,
              description: "林老師對學生溫馨、鼓勵、具備啟發與引導價值的完整評語（繁體中文），約100-150字。"
            },
            score: {
              type: Type.INTEGER,
              description: "林老師打的分數（80 - 100分之間）。"
            },
            badges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "最合適的勳章清單，限於 ['勇敢追夢中', '思考小高手', '韌性練習中', '未來的自己'] 之中選 1 或 2 個。"
            }
          },
          required: ["comments", "score", "badges"]
        }
      }
    });

    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText.trim());
      return res.json(parsed);
    } else {
      throw new Error("Empty response from AI");
    }

  } catch (error: any) {
    console.error("AI Grading failed:", error);
    res.status(500).json({ error: "Grading Error", message: error.message });
  }
});

// 2.5 AI Assisted Grading for Unit Textbook Worksheets
app.post("/api/grade-worksheet", async (req, res) => {
  const { unitId, answers, studentName } = req.body;

  if (!ai) {
    return res.status(400).json({
      error: "API_KEY_MISSING",
      message: "未偵測到 GEMINI_API_KEY。請先至 Settings > Secrets 設定並儲存 API Key。"
    });
  }

  try {
    let unitTitle = unitId === "unit_00" ? "總說：凝視生命的地圖" : "單元 01：哲學思考";
    let answerText = JSON.stringify(answers);

    const prompt = `你是一位高中的生命教育科老師「林老師」。請批改學生「${studentName}」提交的「${unitTitle}」隨堂課堂學習單。
    學生填寫的內容如下：
    ${answerText}

    請針對學生的填寫內容（包含評星或配對，以及問答反思），給予溫馨、正向、具有深度啟發與引導思辨價值的評語（繁體中文）。
    要求：
    1. 以第二人稱親切地與學生對話。
    2. 從 ['思考小高手', '未來的自己', '韌性練習中'] 中挑選 1 到 2 個適合的榮譽勳章。
    3. 提供一個評分分數（80 到 100 分之間）。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一位充滿熱忱與人文氣息的高中生命教育科老師。請以鼓勵反思和啟迪智慧為主，給予學生溫暖詳盡的隨堂點評與智慧勳章。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comments: {
              type: Type.STRING,
              description: "對學生的詳細鼓勵與引導評語，約100-150字，繁體中文。"
            },
            score: {
              type: Type.INTEGER,
              description: "給學生的分數（80 - 100分之間）。"
            },
            badges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "勳章清單，限於 ['思考小高手', '未來的自己', '韌性練習中'] 選 1 到 2 個。"
            }
          },
          required: ["comments", "score", "badges"]
        }
      }
    });

    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText.trim());
      return res.json(parsed);
    } else {
      throw new Error("Empty response from AI");
    }

  } catch (error: any) {
    console.error("AI Worksheet Grading failed:", error);
    res.status(500).json({ error: "Grading Error", message: error.message });
  }
});

/* ==========================================================================
   星座・今日運勢與 AI 對話（《五門・心靈迷宮》的「心象 → 星座」用）
   ---------------------------------------------------------------------------
   遊戲是靜態網站，金鑰不能放前端，所以由這裡代打。
   線上版（GitHub Pages）走的是同一份提示詞的 Supabase Edge Function，
   兩邊的規則要一起改：supabase/functions/oracle-chat/index.ts
   ========================================================================== */

/** 兩種模式共用的角色設定。規則寫得很硬，因為對象是高中生。 */
const ORACLE_SYSTEM = `你是《五門・心靈迷宮》裡的「星象」，陪高中生說話的角色。這是一款台灣的高中生命教育教材，說繁體中文。

你的說話方式：
・短。每次回覆 2 到 4 句，不要長篇大論，不要條列。
・最後用一個問題收尾，把話題帶回對方自己身上。
・用對方講的具體細節回應，不要講空泛的鼓勵。
・語氣像一個比較年長、願意聽的朋友，不是老師也不是客服。

絕對不要做的事：
・不要預測未來，不要說「你會遇到貴人」「今天適合告白」這種算命句。星座只是開場白。
・不要幫對方下人格標籤，不要說「你就是這種人」。
・不要做心理或醫療診斷，不要建議用藥。
・不要說教，不要在句尾加「加油」「要正向思考」這種話。

遇到這些狀況要特別小心：
・如果對方提到自我傷害、想死、被暴力對待、被性騷擾或霸凌——先好好接住那句話，
  明確告訴他這件事需要真人幫忙，請他找信任的大人、學校輔導老師，
  或撥打台灣的 1995（生命線）、1925（安心專線）、113（保護專線）。
  這種時候不要問反思問題，也不要提星座。`;

/** 塔羅解牌的規則。三張牌是過去／現在／未來。 */
const TAROT_RULES = `你是一位塔羅解讀者。三張牌的位置依序是「過去」「現在」「未來」。

每一張牌都要做兩件事，缺一不可：
  (1) 先講這張牌本身的意思——逆位就寫成「正位代表……，逆位則暗示……」的對照。
  (2) 再把它接到對方問的那件事上，講出對他這個問題的具體意涵。
只講牌義不接問題，是最常見也最糟的解牌，不要這樣寫。

寫法：
・用第二人稱「你」。語氣沉穩、誠懇、有畫面。
・比喻要具體，不要空泛的心靈雞湯。
・如果問題是關於另一個人的心態，就描述那個人可能的狀態，
  但要說清楚這是牌面反映的可能性，不是事實。
・綜合結論要**直接回答問題本身**，不要迴避。可以說「極可能」「傾向於」，
  但要給出一個明確的方向。
・最後的建議要把注意力帶回問問題的人自己能掌握的部分。

不可以做的事：
・不要給時間點的斷言（「三個月後」「下週」），不要說「一定會」。
・不要神祕兮兮，不要提業力、前世、天命。
・不要說教，不要在結尾加「加油」。
・全部繁體中文。`;

app.post("/api/oracle-chat", async (req, res) => {
  const { mode, date, signName, traits, history, message, question, cards } = req.body || {};

  if (!ai) {
    return res.status(400).json({
      error: "API_KEY_MISSING",
      message: "未偵測到 GEMINI_API_KEY，遊戲會自動改用離線版內容。"
    });
  }

  try {
    if (mode === "horoscope") {
      const prompt = `今天是 ${date}。請為「${signName}」寫今天的一段話。

這個星座在教材裡的設定：
・別人常說：${traits?.said || ""}
・另一面：${traits?.truth || ""}
・成長課題：${traits?.lesson || ""}
・容易卡住：${traits?.stuck || ""}

要求：
・不要預測會發生什麼事，改成「今天適合練習的一件事」。
・headline 是一句 10 到 16 字的短句，像「今天適合把話講完整」。
・body 兩到三句，扣著上面的設定寫，講得具體一點。
・keywords 兩個詞，每個 2 到 3 字。
・tip 一句話，是今天真的做得到的小動作。
・全部用繁體中文，不要出現「運勢」「吉」「凶」「幸運色」這些字。`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: ORACLE_SYSTEM,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: "10-16 字的短句" },
              body: { type: Type.STRING, description: "兩到三句話" },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "兩個 2-3 字的關鍵詞" },
              tip: { type: Type.STRING, description: "今天做得到的一個小動作" }
            },
            required: ["headline", "body", "keywords", "tip"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return res.json(JSON.parse(text.trim()));
    }

    if (mode === "tarot") {
      const cardText = (cards || []).map((c: any, i: number) =>
        `第 ${i + 1} 張｜位置：${c.slot}
牌：${c.name}（${c.en}）${c.rev ? "逆位" : "正位"}　主題：${c.theme}
這個牌面（${c.rev ? "逆位" : "正位"}）在說：${c.meaning}${
          c.rev && c.uprightRef ? `\n同一張牌正位的意思：${c.uprightRef}` : ""
        }${c.lesson ? `\n生命課題：${c.lesson}` : ""}${
          c.life ? `\n可能長這樣：${c.life}` : ""
        }`).join("\n\n");

      const prompt = `${question ? `對方問的是：「${question}」` : "對方沒有寫特定問題。"}

他抽到的三張牌：

${cardText}

請寫一份解牌報告，用 JSON 回覆：

・opening：兩三句開場，說明這三張牌合起來反映出什麼樣的能量或訊息，
  並點出接下來會怎麼分析。

・cards：三個元素，順序對應上面三張牌。每個包含
  - cardName：牌名＋正逆位＋英文，例如「寶劍一逆位（Reversed Ace of Swords）」
  - aspect：這張牌在這個問題上談的是哪個面向，四到八個字的小標，
    例如「心智與思緒」「狀態與自信」「信念與外在阻礙」
  - general：這張牌本身的意思。逆位一定要寫成
    「正位的◯◯代表……逆位則暗示……」的對照。至少 100 字。
  - appliedLabel：接下來那一段的小標，要從對方的問題長出來，
    例如問「他有沒有想我」就用「想你的程度」，問「該不該換組」就用「這個決定的處境」。
  - applied：把這張牌接到他問的那件事上，講具體的意涵。至少 180 字。

・conclusion：綜合結論。開頭直接回答他問的問題本身，給一個明確的方向
  （可以說「極可能」「傾向於」，但不要迴避），再說明為什麼三張牌合起來指向這個答案。
  至少 250 字。

・advice：建議與指引。把注意力帶回他自己能掌握的部分，給具體可做的事。至少 180 字。

・ask：最後留給他的一個問題，一句話。

整份至少 1000 字。`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: ORACLE_SYSTEM + "\n\n" + TAROT_RULES,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              opening: { type: Type.STRING },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    cardName: { type: Type.STRING },
                    aspect: { type: Type.STRING },
                    general: { type: Type.STRING },
                    appliedLabel: { type: Type.STRING },
                    applied: { type: Type.STRING }
                  },
                  required: ["cardName", "aspect", "general", "appliedLabel", "applied"]
                }
              },
              conclusion: { type: Type.STRING },
              advice: { type: Type.STRING },
              ask: { type: Type.STRING }
            },
            required: ["opening", "cards", "conclusion", "advice", "ask"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return res.json(JSON.parse(text.trim()));
    }

    // mode === "chat"
    const contents = [
      ...(history || []).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.text || "") }]
      })),
      { role: "user", parts: [{ text: String(message || "") }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction:
          ORACLE_SYSTEM +
          `\n\n對方的星座是「${signName}」，今天是 ${date}。` +
          `這個星座的設定：${traits?.truth || ""}／課題：${traits?.lesson || ""}。` +
          `可以偶爾借用它當切入點，但不要每一句都提星座。`
      }
    });

    return res.json({ text: response.text || "" });

  } catch (error: any) {
    console.error("Oracle chat failed:", error);
    res.status(500).json({ error: "ORACLE_ERROR", message: error.message });
  }
});

// 3. AI Socratic Dialogue Machine
app.post("/api/ai/socratic-chat", async (req, res) => {
  const { messages } = req.body;

  if (!ai) {
    return res.status(400).json({
      error: "API_KEY_MISSING",
      message: "未偵測到 GEMINI_API_KEY。請先至 Settings > Secrets 設定並儲存 API Key。"
    });
  }

  try {
    const chatContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatContents,
      config: {
        systemInstruction: `你是一位高中生命教育數位課程中的「蘇格拉底產婆術對話機」。
        主要宗旨是：不要直接給出標準答案，而是用追問、質疑理所當然、以及引導思辨的方式，陪學生探索「什麼是愛？」、「什麼是存在意義？」、「什麼是道德真理？」。
        調性：保持溫和、包容、富有哲理且帶有一點幽默感。
        每次回覆控制在 100 到 150 字內，字句精練，結尾請用一個溫柔但具穿透性的提問來引導學生深入思考。請用繁體中文回答。`
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Socratic dialogue failed:", error);
    res.status(500).json({ error: "Socratic Chat Error", message: error.message });
  }
});

// 4. Companion Voice Generator
app.post("/api/ai/companion-chat", async (req, res) => {
  const { companionId, studentName, lastMessage } = req.body;

  if (!ai) {
    return res.status(400).json({
      error: "API_KEY_MISSING",
      message: "未偵測到 GEMINI_API_KEY。請先至 Settings > Secrets 設定並儲存 API Key。"
    });
  }

  try {
    let persona = "";
    if (companionId === "char_dad") {
      persona = "你是陳可華（或對話學生）的溫柔開明爸爸，在可華感到茫然、課業壓力大、或者對未來有些困惑時，給予包容、幽默、不說大道理但充滿支持的慈父叮嚀。";
    } else {
      persona = "你是陳可華（或對話學生）豁達慈祥的爺爺，經歷豐富、看待生死極度開朗，常說『人生就像一幅畫，歪歪斜斜也美』之類的智慧比喻。";
    }

    const prompt = `學生 ${studentName} 對你說了這句話：
    “ ${lastMessage || "最近常常覺得有點心煩，不知道自己喜歡什麼..."} ”
    請基於你的長輩人設，回覆一句大約 60 到 100 字極具陪伴感、安慰人心與智慧的暖心話。請使用溫暖的繁體中文口吻。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: persona
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Companion chat failed:", error);
    res.status(500).json({ error: "Companion Error", message: error.message });
  }
});

// 5. AI In-Context Inspiration / Writing Prompter
app.post("/api/ai/inspire", async (req, res) => {
  const { fieldType, currentValue } = req.body;

  if (!ai) {
    return res.status(400).json({
      error: "API_KEY_MISSING",
      message: "未偵測到 GEMINI_API_KEY。請先至 Settings > Secrets 設定並儲存 API Key。"
    });
  }

  try {
    let fieldDescription = "";
    let systemInstruction = "你是一位溫暖、專業、富有同理心的高中生命教育老師「林老師」。你的任務是給予遇到寫作或思考障礙的學生精準、溫柔的引導、靈感建議或思考問題，幫助他們填寫學習單。請用繁體中文，字數精簡（限 120 字內），以條列式給予 2-3 點實用好上手的寫作啟發或追問引導，不要直接幫學生寫好完整的回答，而是用問題引導他們想出自己的答案。";

    switch (fieldType) {
      case "wish":
        fieldDescription = "「WOOP 心理韌性防護甲」的「Wish 願望」欄位。目標是：設定一個近期有挑戰性但能實現的具體學習或成長願望。";
        break;
      case "outcome":
        fieldDescription = "「WOOP 心理韌性防護甲」的「Outcome 結果」欄位。目標是：盡情想像與感受這個目標達成後，會帶來什麼最棒的心靈體驗、正向感受或收穫。";
        break;
      case "obstacle":
        fieldDescription = "「WOOP 心理韌性防護甲」的「Obstacle 障礙」欄位。目標是：直面可能阻礙你的內在怪獸、惰性、情緒、焦慮或逃避的慣性衝動。";
        break;
      case "plan":
        fieldDescription = "「WOOP 心理韌性防護甲」的「Plan 計畫」欄位。目標是：用『如果（遇到上述障礙），我就會（執行防衛行動）』寫下具体的應對計畫。";
        break;
      case "remember":
        fieldDescription = "「生前特展」學習單的「我希望別人如何記得我」欄位。目標是：站在生命的終點，回望與思索你希望留在親友心中的核心特質、溫暖力量與生命痕跡。";
        break;
      case "oneliner":
        fieldDescription = "「生前特展」學習單的「我想留下的一句話」欄位。目標是：生命即將謝幕時，對世界或深愛之人的最真摯生命宣言或座右銘。";
        break;
      default:
        fieldDescription = "生命教育反思欄位";
    }

    const prompt = `學生目前正在填寫生命教育學習單。
    填寫的欄位主題：${fieldDescription}
    學生目前已輸入的內容（可能為空）：${currentValue || "（尚未輸入任何內容）"}

    請給予他們 2-3 點精煉、溫暖、且極具啟發性的引導問題或寫作建議，幫助他們克服寫作障礙、釐清內心想法。
    請直接條列輸出 2 到 3 點，字數控制在 100 字以內，語氣要親切鼓勵。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Inspire failed:", error);
    res.status(500).json({ error: "Inspire Error", message: error.message });
  }
});

// ==========================================
// VITE OR STATIC SERVING MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
