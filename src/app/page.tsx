import ImageAnalyzer from '@/components/ImageAnalyzer';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-[11px] font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          MODO PAINT SYSTEM
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-500">
            超合繪配色規劃器
          </span>
        </h1>
        <p className="mt-3 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          上傳模型參考圖片，自動抽色 → 配對摩多顏料 → 生成完整上色工序
        </p>
      </div>

      <ImageAnalyzer />
    </div>
  );
}
