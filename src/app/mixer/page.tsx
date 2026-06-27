import ColorMixer from '@/components/ColorMixer';

export default function MixerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500">
          調色模擬器
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          選擇摩多顏料、調整比例，即時預覽混色結果
        </p>
      </div>
      <ColorMixer />
    </div>
  );
}
