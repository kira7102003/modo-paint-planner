import { NextRequest, NextResponse } from 'next/server';

function buildPrompt(modelName: string, colorList: string, extras: string) {
  return `模型塗裝專家。「${modelName}」用MODO顏料。
色：${colorList}
${extras}
回覆純JSON。欄位填真實中文內容。
{"styleScope":{"title":"風格標題","features":["特徵1說明","特徵2說明","特徵3說明"]},"colorMapping":[{"zone":"部位","colorSystem":"色系","primer":"底漆如MK-11","basePaint":{"code":"M-xxx","name":"名","hex":"#xxx","mix":"純色或M-061:M-004=9:1"},"shadowPaint":{"code":"M-xxx","name":"名","hex":"#xxx","mix":"比例"},"highlightPaint":{"code":"M-xxx","name":"名","hex":"#xxx","mix":"比例"},"finish":"質感"}],"sharpnessTechniques":{"edgeHighlight":"具體筆具+色號+位置","panelLining":"滲線液種類+方式","metallicBlocking":"部位+金屬色+技法"},"materialsChecklist":{"paints":["漆"],"decalTools":["工具"],"clearCoats":["保護漆"]},"workflow":[{"step":1,"phase":"名","phaseEn":"EN","description":"說明","paints":["色號"],"thinRatio":"比例","tools":"工具","dryTime":"時間"}],"troubleshooting":[{"problem":"問題","solution":"解法"}],"summary":["心得1","心得2","心得3"]}
規則：色號M-xxx/MX-xx/T-xxx。workflow15步。陰影高光要混色比例。提示詞提到的顏色也要配色。`;
}

async function callWithRetry(fn: () => Promise<string>, retries = 2, delay = 20000): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (i < retries && (msg.includes('rate') || msg.includes('Rate') || msg.includes('429') || msg.includes('quota'))) {
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw e;
    }
  }
  throw new Error('retries exhausted');
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 4096 } }),
      signal: AbortSignal.timeout(60000) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `Gemini ${res.status}`); }
  const d = await res.json();
  return d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGroq(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gemma2-9b-it', messages: [{ role: 'user', content: prompt }], temperature: 0.6, max_tokens: 4096 }),
    signal: AbortSignal.timeout(90000) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `Groq ${res.status}`); }
  const d = await res.json();
  return d?.choices?.[0]?.message?.content || '';
}

async function callDeepSeek(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 4096 }),
    signal: AbortSignal.timeout(90000) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `DeepSeek ${res.status}`); }
  const d = await res.json();
  return d?.choices?.[0]?.message?.content || '';
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 4096 }),
    signal: AbortSignal.timeout(60000) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `OpenAI ${res.status}`); }
  const d = await res.json();
  return d?.choices?.[0]?.message?.content || '';
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
  if (!modelName || !extractedColors?.length) return NextResponse.json({ error: '缺少資料' }, { status: 400 });

  const keys: Record<string, string> = {
    groq: body.groqKey || '', gemini: body.geminiKey || '',
    deepseek: body.deepseekKey || '', openai: body.openaiKey || '',
  };
  if (!Object.values(keys).some(k => k.trim())) return NextResponse.json({ error: '請先設定 AI 金鑰' }, { status: 401 });

  const colorList = extractedColors.slice(0, 8)
    .map((c: { hex: string; label: string; percentage: number }, i: number) => `${i+1}.${c.hex}(${c.label}${c.percentage}%)`)
    .join(' ');

  const extras: string[] = [];
  if (body.refColors?.length) extras.push(`改色參考：${body.refColors.slice(0,4).map((c:{hex:string;label:string})=>`${c.hex}(${c.label})`).join(',')}`);
  if (body.paintType === 'water') extras.push('用MODO水性漆A/AX系列');
  const methods: Record<string,string> = { airbrush:'噴漆', brush:'筆塗', both:'噴漆+筆塗' };
  if (body.applyMethod) extras.push(methods[body.applyMethod]||'噴漆');
  if (body.primaryColor) extras.push(`【主色】${body.primaryColor}佔${body.primaryRatio||75}%`);

  const primerNames: Record<string,string> = { white:'白底漆', gray:'灰底漆MK-11', black:'黑底漆', pink:'粉紅底漆', purple:'紫底漆MK-19' };
  if (body.primerConfig) {
    const pc = body.primerConfig as Record<string,string>;
    const allAuto = Object.values(pc).every(v => v === 'auto');
    if (!allAuto) {
      const resolve = (v:string) => v === 'auto' ? 'AI配' : v.startsWith('custom:') ? v.slice(7) : primerNames[v]||v;
      extras.push(`底漆：主體${resolve(pc.body)}/武器${resolve(pc.weapon)}/骨架${resolve(pc.frame)}`);
    }
  }
  if (body.customPrompt) extras.push(`【必須遵守】${body.customPrompt}`);

  const prompt = buildPrompt(modelName, colorList, extras.join('。'));
  const errors: string[] = [];

  for (const { id, call } of CHAIN) {
    if (!keys[id]?.trim()) continue;
    try {
      const text = await callWithRetry(() => call(keys[id], prompt));
      if (!text) continue;
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      return NextResponse.json({ ...JSON.parse(jsonStr), _provider: id });
    } catch (e) {
      errors.push(`${id}: ${(e instanceof Error ? e.message : String(e)).slice(0, 80)}`);
    }
  }
  return NextResponse.json({ error: `所有 AI 都失敗了：${errors.join(' | ')}` }, { status: 500 });
}
