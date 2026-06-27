'use client';

import { useState } from 'react';
import { WorkflowStep } from '@/data/kit-schemes';
import { getPaintById } from '@/data/modo-paints';

function StepCard({ step, isActive, onClick }: {
  step: WorkflowStep;
  isActive: boolean;
  onClick: () => void;
}) {
  const paints = step.paintIds.map(id => getPaintById(id)).filter(Boolean);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        isActive
          ? 'bg-white border-sky-300 shadow-lg shadow-sky-100/50 ring-1 ring-sky-200'
          : 'bg-white/60 border-slate-200/80 hover:border-sky-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
          isActive
            ? 'bg-gradient-to-br from-sky-400 to-cyan-500 shadow-md shadow-sky-200'
            : 'bg-slate-100'
        }`}>
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              isActive
                ? 'bg-sky-100 text-sky-600 border border-sky-200'
                : 'bg-slate-100 text-slate-400'
            }`}>
              STEP {step.order}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{step.phaseEn}</span>
          </div>
          <h4 className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
            {step.phase}
          </h4>
        </div>
      </div>

      {isActive && (
        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>

          {paints.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wide">使用顏料</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {paints.map(paint => (
                  <div key={paint!.id} className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2 py-1 border border-slate-100">
                    <div
                      className="w-4 h-4 rounded border-2 border-white shadow-sm ring-1 ring-slate-200/50"
                      style={{ backgroundColor: paint!.hex }}
                    />
                    <span className="text-[10px] font-mono text-slate-600 font-bold">{paint!.code}</span>
                    <span className="text-[10px] text-slate-400">{paint!.nameZh}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`grid gap-2 ${step.thinRatio ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-2.5 border border-sky-100">
              <span className="text-[9px] font-bold text-sky-500 uppercase tracking-wide block mb-0.5">工具</span>
              <span className="text-[11px] text-slate-600">{step.tool}</span>
            </div>
            {step.thinRatio && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-2.5 border border-emerald-100">
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide block mb-0.5">稀釋比例</span>
                <span className="text-[11px] text-slate-600">{step.thinRatio}</span>
              </div>
            )}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-2.5 border border-amber-100">
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide block mb-0.5">乾燥時間</span>
              <span className="text-[11px] text-slate-600">{step.dryTime}</span>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}

export default function WorkflowTimeline({ steps }: { steps: WorkflowStep[] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  const totalPaintSteps = steps.filter(s => s.paintIds.length > 0).length;
  const totalDrySteps = steps.filter(s => s.dryTime !== '-').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            共 <span className="font-bold text-slate-600">{steps.length}</span> 步工序
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-xs text-slate-400">
            <span className="font-bold text-sky-500">{totalPaintSteps}</span> 步需上色
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-xs text-slate-400">
            <span className="font-bold text-amber-500">{totalDrySteps}</span> 步需等乾
          </span>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'timeline' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}
          >
            時間軸
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'table' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}
          >
            總覽表
          </button>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <div className="relative">
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-sky-200 via-cyan-200 to-violet-200" />

          <div className="space-y-2 relative">
            {steps.map((step, i) => (
              <div key={step.order} className="relative">
                <div className={`absolute left-[23px] top-5 w-[9px] h-[9px] rounded-full border-2 z-10 ${
                  i === activeStep
                    ? 'bg-sky-400 border-white shadow-md shadow-sky-300'
                    : i < activeStep
                    ? 'bg-cyan-300 border-white'
                    : 'bg-white border-slate-300'
                }`} />
                <div className="pl-12">
                  <StepCard
                    step={step}
                    isActive={i === activeStep}
                    onClick={() => setActiveStep(i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-100">
                <th className="text-left py-2.5 px-3 text-sky-600 font-bold">#</th>
                <th className="text-left py-2.5 px-3 text-sky-600 font-bold">工序</th>
                <th className="text-left py-2.5 px-3 text-sky-600 font-bold hidden sm:table-cell">顏料</th>
                <th className="text-left py-2.5 px-3 text-sky-600 font-bold hidden md:table-cell">工具</th>
                <th className="text-left py-2.5 px-3 text-sky-600 font-bold">乾燥</th>
              </tr>
            </thead>
            <tbody>
              {steps.map(step => {
                const paints = step.paintIds.map(id => getPaintById(id)).filter(Boolean);
                return (
                  <tr key={step.order} className="border-b border-slate-50 hover:bg-sky-50/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-black text-slate-400">{step.order}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{step.icon}</span>
                        <div>
                          <div className="font-bold text-slate-700">{step.phase}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{step.phaseEn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 hidden sm:table-cell">
                      <div className="flex gap-1">
                        {paints.slice(0, 4).map(p => (
                          <div
                            key={p!.id}
                            className="w-5 h-5 rounded border-2 border-white shadow-sm ring-1 ring-slate-100"
                            style={{ backgroundColor: p!.hex }}
                            title={`${p!.code} ${p!.nameZh}`}
                          />
                        ))}
                        {paints.length > 4 && (
                          <span className="text-[9px] text-slate-400 self-center">+{paints.length - 4}</span>
                        )}
                        {paints.length === 0 && <span className="text-slate-300">-</span>}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 hidden md:table-cell max-w-[200px] truncate">
                      {step.tool}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {step.dryTime === '-' ? <span className="text-slate-300">-</span> : step.dryTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
