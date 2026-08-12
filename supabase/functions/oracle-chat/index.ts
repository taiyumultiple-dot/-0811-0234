/* ==========================================================================
   Supabase Edge Function：oracle-chat
   ---------------------------------------------------------------------------
   《五門・心靈迷宮》的「心象 → 星座」用的後端。

   為什麼需要它：遊戲是 GitHub Pages 上的靜態網站，Gemini 的金鑰不能放前端
   （任何人按 F12 就看得到）。這支函式跑在 Supabase 上，金鑰存在它的 secret 裡，
   前端只帶公開金鑰來呼叫。

   部署方式（在 lifeedu-web 目錄下）：
     npx supabase login
     npx supabase link --project-ref <你的專案 ref>
     npx supabase secrets set GEMINI_API_KEY=<你的金鑰>
     npx supabase functions deploy oracle-chat --no-verify-jwt

   --no-verify-jwt 是必要的：遊戲的玩家不一定登入過，帶的是公開金鑰。

   ⚠️ 這裡的提示詞要跟 lifeedu-web/server.ts 的 /api/oracle-chat 一致，
      改一邊就要改另一邊，否則本機測到的跟線上跑的會是兩套規則。
   ========================================================================== */

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
const API = "https://generativelanguage.googleapis.com/v1beta/models";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

/** 塔羅解牌的規則。三張牌的位置與教材的講法一致，不做預言。 */
const TAROT_RULES = `你在解一副「心象牌」（塔羅大阿爾克那）。三張牌的位置分別是：
「你帶著什麼」「你正在面對」「你可以練習」——刻意不是過去現在未來。

解牌的規矩：
・不要預測會發生什麼事，不要說「會成功」「會分手」「三個月後」這種話。
・牌面是曖昧的意象，你的工作是把它接到對方問的那件事上，讓他自己看見。
・每一段都要扣著對方的問題講，不要只複述牌義。
・用第二人稱「你」，語氣平穩，不要神祕兮兮，也不要說教。
・如果對方沒有問題，就從三張牌本身的關係讀起。
・全部繁體中文。`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function callGemini(payload: unknown) {
  const r = await fetch(`${API}/${MODEL}:generateContent?key=${GEMINI_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message ?? `Gemini HTTP ${r.status}`);
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  if (!GEMINI_KEY) {
    // 前端收到 error 會自動改用離線版，畫面不會壞
    return json({ error: "API_KEY_MISSING" }, 400);
  }

  try {
    const { mode, date, signName, traits, history, message, question, cards } = await req.json();

    if (mode === "tarot") {
      const cardText = (cards ?? []).map((c: Record<string, string>, i: number) =>
        `第 ${i + 1} 張｜位置：${c.slot}
牌：${c.name}（${c.en}）${c.rev ? "逆位" : "正位"}　主題：${c.theme}
這張牌在說：${c.meaning}
生命課題：${c.lesson}
可能長這樣：${c.life}
它問的：${c.ask}`).join("\n\n");

      const prompt = `${question ? `對方問的是：「${question}」` : "對方沒有寫特定問題。"}

他抽到的三張牌：

${cardText}

請寫一份完整的解牌報告，用 JSON 回覆：

・opening：開場。先回應他的問題本身（如果沒問題就講這三張牌湊在一起的第一印象），
  說明你打算怎麼讀這三張牌。至少 150 字。
・cards：三個元素，順序對應上面三張牌。每個包含
  position（位置名稱，照抄）、cardName（牌名＋正逆位）、
  text（這張牌在他這件事上的意思，至少 200 字。要具體，要用到牌的主題與課題，
  要接回他的問題，不要只翻譯牌義）。
・together：把三張連起來講成一條線，至少 200 字。要指出三張之間的張力或呼應。
・advice：他今天或這禮拜真的做得到的一件事，至少 150 字，要具體到可以執行。
・ask：最後留給他的一個問題，一句話。

整份加起來至少 1000 字。`;

      const text = await callGemini({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: ORACLE_SYSTEM + "\n\n" + TAROT_RULES }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              opening: { type: "STRING" },
              cards: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    position: { type: "STRING" },
                    cardName: { type: "STRING" },
                    text: { type: "STRING" },
                  },
                  required: ["position", "cardName", "text"],
                },
              },
              together: { type: "STRING" },
              advice: { type: "STRING" },
              ask: { type: "STRING" },
            },
            required: ["opening", "cards", "together", "advice", "ask"],
          },
        },
      });

      return json(JSON.parse(text.trim()));
    }

    if (mode === "horoscope") {
      const prompt = `今天是 ${date}。請為「${signName}」寫今天的一段話。

這個星座在教材裡的設定：
・別人常說：${traits?.said ?? ""}
・另一面：${traits?.truth ?? ""}
・成長課題：${traits?.lesson ?? ""}
・容易卡住：${traits?.stuck ?? ""}

要求：
・不要預測會發生什麼事，改成「今天適合練習的一件事」。
・headline 是一句 10 到 16 字的短句，像「今天適合把話講完整」。
・body 兩到三句，扣著上面的設定寫，講得具體一點。
・keywords 兩個詞，每個 2 到 3 字。
・tip 一句話，是今天真的做得到的小動作。
・全部用繁體中文，不要出現「運勢」「吉」「凶」「幸運色」這些字。`;

      const text = await callGemini({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: ORACLE_SYSTEM }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              headline: { type: "STRING" },
              body: { type: "STRING" },
              keywords: { type: "ARRAY", items: { type: "STRING" } },
              tip: { type: "STRING" },
            },
            required: ["headline", "body", "keywords", "tip"],
          },
        },
      });

      return json(JSON.parse(text.trim()));
    }

    // mode === "chat"
    const contents = [
      ...(history ?? []).map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.text ?? "") }],
      })),
      { role: "user", parts: [{ text: String(message ?? "") }] },
    ];

    const text = await callGemini({
      contents,
      systemInstruction: {
        parts: [{
          text: ORACLE_SYSTEM +
            `\n\n對方的星座是「${signName}」，今天是 ${date}。` +
            `這個星座的設定：${traits?.truth ?? ""}／課題：${traits?.lesson ?? ""}。` +
            `可以偶爾借用它當切入點，但不要每一句都提星座。`,
        }],
      },
    });

    return json({ text });

  } catch (e) {
    console.error("oracle-chat failed:", e);
    return json({ error: "ORACLE_ERROR", message: String(e) }, 500);
  }
});
