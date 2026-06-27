import SyncPanel from '@/components/SyncPanel';

export default function SyncPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500">
          更新色號資料庫
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          一鍵從 MODO 官方經銷商網站抓取最新色號，AI 自動解析比對
        </p>
      </div>
      <SyncPanel />
    </div>
  );
}
