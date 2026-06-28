import { NextRequest, NextResponse } from 'next/server';

function buildPrompt(modelName: string, colorList: string, extras: string) {
  return `你是模型塗裝專家。分析「${modelName}」的配色，用MODO(摩多)顏料規劃塗裝。
圖片提取顏色：
${colorList}
${extras}

回覆純JSON（不要markdown code block）。所有欄位都要填入真實詳細的中文內容，不要用佔位符。

格式：
{
  "styleScope": {
    "title": "這台模型的塗裝風格定調標題",
    "features": ["第一個視覺特徵的詳細說明", "第二個視覺特徵的詳細說明", "第三個視覺特徵的詳細說明"]
  },
  "colorMapping": [
    {
      "zone": "具體部位名稱如白色裝甲",
      "colorSystem": "該部位的色系質感描述",
      "primer": "該部位底漆(如 白色底漆MK-白)",
      "basePaint": {"code": "MODO色號", "name": "顏色名", "hex": "#色碼", "mix": "若需混色寫比例如 M-061:M-004=9:1，單色寫 純色"},
      "shadowPaint": {"code": "主要色號", "name": "顏色名", "hex": "#色碼", "mix": "混色比例如 M-003:M-002=8:2"},
      "highlightPaint": {"code": "主要色號", "name": "顏色名", "hex": "#色碼", "mix": "混色比例如 M-003:M-015=7:3"},
      "finish": "亮光或半消光或消光或金屬"
    }
  ],
  "sharpnessTechniques": {
    "edgeHighlight": "要寫明用什麼筆(如最細面相筆)、在哪裡勾(裝甲轉折銳角處)、用什麼色號、模擬什麼效果",
    "panelLining": "要寫明用什麼滲線液(如灰色Panel Line)、在哪些凹槽滲入、線條要斷點清晰還是連續、注意事項",
    "metallicBlocking": "要寫明哪些部位(關節/活塞/噴嘴)用什麼金屬色、用什麼技法(乾刷Dry Brushing等)、產生什麼效果"
  },
  "materialsChecklist": {
    "paints": ["需要的漆料清單含色號"],
    "decalTools": ["水貼相關工具"],
    "clearCoats": ["保護漆含建議光澤度"]
  },
  "workflow": [
    {"step": 1, "phase": "工序名稱", "phaseEn": "English", "description": "該步驟的詳細操作說明", "paints": ["使用的MODO色號"], "thinRatio": "建議稀釋比例如1:2.5", "tools": "使用工具", "dryTime": "乾燥時間"}
  ],
  "troubleshooting": [{"problem": "具體問題描述", "solution": "具體解決方案"}],
  "summary": ["第一條塗裝心得", "第二條塗裝心得", "第三條塗裝心得"]
}

規則：
- MODO色號格式M-xxx/MX-xx/T-xxx/MK-xx/SC-xx
- workflow至少15步
- colorMapping根據圖片顏色對應
- sharpnessTechniques每項要寫具體工具+具體色號+具體手法，不要泛泛而談
- thinRatio要針對該步驟的漆料特性建議，不同漆不同比例(如陰影色建議更稀1:4利於疊層漸變，底漆1:1.5，一般色1:2.5)
- troubleshooting要寫實際會遇到的問題和具體解法
- colorMapping每個paint的mix欄位：單色直接用寫「純色」，需要混色的寫具體比例如「M-061:M-004=9:1」「M-003:M-002=8:2」，陰影和高光通常是混色
- 重要：colorMapping不只根據抽色結果，也要根據使用者提示詞中提到的顏色。如果提示詞說某部位要用紅色/金屬色等，即使圖片沒抽到也要加入配色方案`;
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
      signal: AbortSignal.timeout(60000),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini ${res.status}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGroq(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 6000,
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq ${res.status}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callDeepSeek(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 8192,
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `DeepSeek ${res.status}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 8192,
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI ${res.status}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

type CallFn = (key: string, prompt: string) => Promise<string>;
const CHAIN: { id: string; call: CallFn }[] = [
  { id: 'groq', call: callGroq },
  { id: 'gemini', call: callGemini },
  { id: 'deepseek', call: callDeepSeek },
  { id: 'openai', call: callOpenAI },
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { modelName, extractedColors } = body;

  if (!modelName || !extractedColors?.length) {
    return NextResponse.json({ error: '缺少模型名稱或顏色資料' }, { status: 400 });
  }

  const keys: Record<string, string> = {
    gemini: body.geminiKey || '',
    groq: body.groqKey || '',
    deepseek: body.deepseekKey || '',
    openai: body.openaiKey || '',
  };

  if (!Object.values(keys).some(k => k.trim())) {
    return NextResponse.json({ error: '請先在右上角 🔑 設定至少一個 AI 金鑰' }, { status: 401 });
  }

  const colorList = extractedColors
    .slice(0, 8)
    .map((c: { hex: string; label: string; percentage: number }, i: number) =>
      `${i + 1}. ${c.hex}(${c.label},${c.percentage}%)`
    )
    .join('\n');

  const extras: string[] = [];

  if (body.refColors?.length) {
    const refList = body.refColors.slice(0, 4)
      .map((c: { hex: string; label: string }) => `${c.hex}(${c.label})`).join(',');
    extras.push(`改色參考：${refList}`);
  }

  if (body.paintType === 'water') extras.push('用MODO水性漆(A/AX/AF/AK系列)');

  const methods: Record<string, string> = { airbrush: '噴漆', brush: '筆塗(薄塗多層,同方向)', both: '噴漆+筆塗混合' };
  if (body.applyMethod) extras.push(`工法:${methods[body.applyMethod] || '噴漆'}`);

  if (body.primaryColor) {
    extras.push(`【重要-主色規則】整機必須以「${body.primaryColor}」為絕對主色，佔全機面積${body.primaryRatio || 75}%以上。「${body.primaryColor}」可能是顏色名稱(如白色、深藍)或MODO色號名稱(如機甲白=M-061、摩多藍=M-066)。colorMapping中主色zone必須是面積最大的，其他色只是點綴。所有裝甲主體都要用這個主色`);
  } else {
    extras.push(`主色佔比按圖片分析的比例分配，最大面積的顏色佔${body.primaryRatio || 75}%`);
  }

  const primerNames: Record<string, string> = { white: '白色底漆(MK-白)', gray: '灰色底漆(MK-11)', black: '黑色底漆(MK-黑)', pink: '粉紅底漆(MK-19)', purple: '紫色底漆(MK-19紫)' };
  if (body.primerConfig) {
    const pc = body.primerConfig as Record<string, string>;
    const allAuto = Object.values(pc).every(v => v === 'auto');
    if (allAuto) {
      extras.push('【底漆】AI 根據各部位顏色自動建議最佳底漆顏色（淺色件用白底漆、深色件用黑底漆等），workflow要說明');
    } else {
      const resolvePrimer = (v: string) => {
        if (v === 'auto') return 'AI自動建議';
        if (v.startsWith('custom:')) return v.slice(7);
        return primerNames[v] || v;
      };
      extras.push(`【底漆配置】主體裝甲用${resolvePrimer(pc.body)}、武器暗色件用${resolvePrimer(pc.weapon)}、骨架關節用${resolvePrimer(pc.frame)}。workflow底漆步驟要分開噴不同底漆，說明哪些零件用哪種底漆`);
    }
  }

  if (body.customPrompt) {
    extras.push(`【使用者特別要求-必須遵守】${body.customPrompt}。此為使用者的明確指示，colorMapping和workflow都必須反映這些要求`);
  }

  extras.push('每步驟根據漆料和工法自動建議最佳稀釋比例');

  const prompt = buildPrompt(modelName, colorList, extras.join('。'));
  const errors: string[] = [];

  for (const { id, call } of CHAIN) {
    if (!keys[id]?.trim()) continue;
    try {
      const text = await call(keys[id], prompt);
      if (!text) continue;
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        .replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json({ ...parsed, _provider: id });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${id}: ${msg.slice(0, 100)}`);
    }
  }

  return NextResponse.json({ error: `所有 AI 都失敗了：${errors.join(' | ')}` }, { status: 500 });
}
