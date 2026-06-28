import { NextRequest, NextResponse } from 'next/server';

const SOURCES = [
  { name: 'YYZ 模型工作室', url: 'https://yyz.easy.co/collections/modo' },
  { name: 'HRS 模型', url: 'https://www.hiroshisanmodel.com/collections/%E6%91%A9%E5%A4%9A%E8%A3%BD%E9%80%A0%E6%89%80%E7%B8%BD%E9%83%A8-modocolors' },
  { name: 'Chico Hobby', url: 'https://chicohobby.com/zh/collections/modo-paints' },
  { name: 'MR.JOE HOBBY', url: 'https://store.mrjoe.com.tw/category/60122' },
];

async function fetchPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return '';
    const html = await res.text();
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .substring(0, 8000);
  } catch { return ''; }
}

const PROMPT_TEMPLATE = `你是 MODO（摩多）模型漆的資料庫管理員。以下是從多個經銷商網站抓取的產品頁面文字。

請從中提取所有 MODO 漆色號和名稱。回傳 JSON 格式（不要加 markdown code block）：

{
  "paints": [
    { "code": "M-001", "nameZh": "正白", "nameEn": "Pure White", "series": "M", "finish": "gloss", "hex": "#FFFFFF" }
  ],
  "sources": ["來源1"],
  "totalFound": 數字
}

規則：
1. code 格式：M-xxx、MX-xx、T-xxx、MK-xx、SC-xx、D-xx
2. series 根據 code 前綴判斷
3. finish：金屬色=metallic、消光=matte、亮光=gloss、珠光=pearl、螢光=fluorescent、電鍍=chrome、偏光=chameleon
4. hex 根據顏色名稱給出近似值
5. 不要包含溶劑、工具、配件
6. 每個色號只列一次

網站內容：
`;

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
      }),
      signal: AbortSignal.timeout(60000),
    }
  );
  if (!res.ok) throw new Error(`Gemini: ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGroq(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 8192 }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) throw new Error(`Groq: ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callDeepSeek(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 8192 }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) throw new Error(`DeepSeek: ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 8192 }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`OpenAI: ${res.status}`);
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
  const keys: Record<string, string> = {
    gemini: body.geminiKey || '', groq: body.groqKey || '',
    deepseek: body.deepseekKey || '', openai: body.openaiKey || '',
  };

  if (!Object.values(keys).some(k => k.trim())) {
    return NextResponse.json({ error: '請先在右上角設定 AI 金鑰' }, { status: 401 });
  }

  const pages: string[] = [];
  for (const source of SOURCES) {
    const text = await fetchPage(source.url);
    if (text.length > 100) pages.push(`【${source.name}】\n${text}`);
  }
  if (pages.length === 0) {
    return NextResponse.json({ error: '無法連線到任何經銷商網站' }, { status: 502 });
  }

  const prompt = PROMPT_TEMPLATE + pages.join('\n\n---\n\n');

  for (const { id, call } of CHAIN) {
    if (!keys[id]?.trim()) continue;
    try {
      const text = await call(keys[id], prompt);
      if (!text) continue;
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        .replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      return NextResponse.json(JSON.parse(jsonStr));
    } catch { /* next */ }
  }

  return NextResponse.json({ error: '所有 AI 服務都無法回應' }, { status: 500 });
}
