import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { provider, key } = await req.json();
  if (!provider || !key) return NextResponse.json({ valid: false, error: '缺少參數' });

  try {
    if (provider === 'gemini') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return NextResponse.json({ valid: true });
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ valid: false, error: data?.error?.message || `HTTP ${res.status}` });
    }

    if (provider === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${key}` },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) return NextResponse.json({ valid: true });
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ valid: false, error: data?.error?.message || `HTTP ${res.status}` });
    }

    if (provider === 'deepseek') {
      const res = await fetch('https://api.deepseek.com/models', {
        headers: { 'Authorization': `Bearer ${key}` },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) return NextResponse.json({ valid: true });
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ valid: false, error: data?.error?.message || `HTTP ${res.status}` });
    }

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${key}` },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) return NextResponse.json({ valid: true });
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ valid: false, error: data?.error?.message || `HTTP ${res.status}` });
    }

    return NextResponse.json({ valid: false, error: '不支援的 provider' });
  } catch {
    return NextResponse.json({ valid: false, error: '連線逾時，請檢查網路' });
  }
}
