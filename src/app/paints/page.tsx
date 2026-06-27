import PaintDatabase from '@/components/PaintDatabase';

export default function PaintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500">
          MODO 顏料資料庫
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          摩多全系列硝基漆色號一覽，可依系列篩選或關鍵字搜尋
        </p>
      </div>
      <PaintDatabase />
    </div>
  );
}
