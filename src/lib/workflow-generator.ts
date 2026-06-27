import { PaintMatch } from './paint-matcher';
import { WorkflowStep } from '@/data/kit-schemes';

export function generateWorkflow(matches: PaintMatch[], modelName: string): WorkflowStep[] {
  const steps: WorkflowStep[] = [];
  let order = 1;

  const colorGroups = matches.map(m => m.extractedColor.label).join('/');

  steps.push({
    order: order++,
    phase: '拆件分色',
    phaseEn: 'Disassemble & Sort',
    icon: '🔧',
    description: `將${modelName}素組後確認合模線位置，依顏色分群拆件（${colorGroups}），用竹籤或鱷魚夾固定各零件`,
    paintIds: [],
    tool: '斜口鉗、筆刀、竹籤、鱷魚夾',
    dryTime: '-',
  });

  steps.push({
    order: order++,
    phase: '表面處理',
    phaseEn: 'Surface Prep',
    icon: '🪄',
    description: '打磨水口與合模線（400→600→800號砂紙），特別注意曲面接合處，清水沖洗去粉塵後完全乾燥',
    paintIds: [],
    tool: '砂紙 400/600/800、海綿砂、筆刀',
    dryTime: '自然乾 30 分鐘',
  });

  steps.push({
    order: order++,
    phase: '底漆打底',
    phaseEn: 'Primer',
    icon: '🎯',
    description: '全件噴底漆補土灰，統一底色並檢查表面瑕疵；淺色件可改用白色底漆減少後續遮蓋層數',
    paintIds: ['mk11'],
    tool: '噴筆 0.3mm、氣壓 0.15MPa',
    dryTime: '硝基漆 30-60 分鐘',
  });

  steps.push({
    order: order++,
    phase: '預陰影',
    phaseEn: 'Pre-Shading',
    icon: '🌑',
    description: '在底漆上沿凹線、裝甲板塊邊緣噴一層薄正黑色，建立明暗基底；降低氣壓做細線控制',
    paintIds: ['m002'],
    tool: '噴筆 0.2mm、氣壓 0.08MPa',
    dryTime: '15-20 分鐘',
  });

  const sortedMatches = [...matches].sort((a, b) => b.extractedColor.percentage - a.extractedColor.percentage);

  for (const match of sortedMatches) {
    const pct = match.extractedColor.percentage;
    const label = match.extractedColor.label;
    const isMetallic = match.basePaint.finish === 'metallic' || match.basePaint.finish === 'chrome';
    const isLight = match.extractedColor.r > 200 && match.extractedColor.g > 200 && match.extractedColor.b > 200;

    steps.push({
      order: order++,
      phase: `${label}底色`,
      phaseEn: `${label} Base Coat`,
      icon: isMetallic ? '🥇' : isLight ? '⬜' : '🎨',
      description: isMetallic
        ? `${match.basePaint.nameZh}（${match.basePaint.code}）噴 1-2 層；金屬漆建議先噴亮黑底增強反射效果，使用金屬色專用溶劑`
        : isLight
        ? `${match.basePaint.nameZh}（${match.basePaint.code}）薄噴 2-3 層，保留預陰影透出的漸層效果；面中央噴厚、邊緣保留暗部`
        : `${match.basePaint.nameZh}（${match.basePaint.code}）噴 2-3 層完整遮蓋，占全機約 ${pct}% 面積`,
      paintIds: [match.basePaint.id],
      tool: isMetallic ? '噴筆 0.3mm、D-09 金屬色溶劑' : '噴筆 0.3mm、氣壓 0.12MPa',
      dryTime: isMetallic ? '金屬漆 40-60 分鐘' : '每層間隔 10 分鐘，完成後 30 分鐘',
    });

    if (match.shadowPaint.id !== match.basePaint.id) {
      steps.push({
        order: order++,
        phase: `${label}陰影`,
        phaseEn: `${label} Shadow`,
        icon: '🔷',
        description: `在${label}區域的凹面、邊緣、接縫處噴${match.shadowPaint.nameZh}（${match.shadowPaint.code}）做漸層陰影，強化立體感`,
        paintIds: [match.shadowPaint.id],
        tool: '噴筆 0.2mm、氣壓 0.08MPa、少量多次',
        dryTime: '20 分鐘',
      });
    }

    if (match.highlightPaint.id !== match.basePaint.id) {
      steps.push({
        order: order++,
        phase: `${label}高光`,
        phaseEn: `${label} Highlight`,
        icon: '✨',
        description: `在${label}區域的凸面中央、邊緣最亮處輕噴${match.highlightPaint.nameZh}（${match.highlightPaint.code}），做出裝甲反光`,
        paintIds: [match.highlightPaint.id],
        tool: '噴筆 0.3mm、極少量輕噴',
        dryTime: '20 分鐘',
      });
    }
  }

  steps.push({
    order: order++,
    phase: '光澤透明漆',
    phaseEn: 'Gloss Coat',
    icon: '💎',
    description: '全件噴一層亮光透明漆做保護層，為後續墨線和水貼提供光滑表面，確保均勻不流掛',
    paintIds: ['m007'],
    tool: '噴筆 0.3mm',
    dryTime: '2-4 小時完全硬化',
  });

  steps.push({
    order: order++,
    phase: '墨線滲入',
    phaseEn: 'Panel Lining',
    icon: '✒️',
    description: '用油性墨線液沿凹線滲入：淺色部位用灰色、深色部位用黑色、暖色部位可用棕色，多餘用溶劑擦拭',
    paintIds: [],
    tool: '滲線筆、油性墨線液（灰/黑/棕）、棉棒',
    dryTime: '10 分鐘後擦拭',
  });

  steps.push({
    order: order++,
    phase: '水貼',
    phaseEn: 'Decals',
    icon: '🏷️',
    description: '水貼浸水 30 秒後取出，用軟化劑輔助貼合曲面，鑷子定位、棉棒壓實排除氣泡',
    paintIds: [],
    tool: '鑷子、棉棒、水貼軟化劑',
    dryTime: '水貼乾燥 2 小時',
  });

  steps.push({
    order: order++,
    phase: '超級消光保護',
    phaseEn: 'Final Flat Coat',
    icon: '🛡️',
    description: '全機噴超級消光透明漆，統一全機質感、封住水貼與墨線，消除塑膠光澤做出超合繪特有質感',
    paintIds: ['t043'],
    tool: '噴筆 0.3mm、氣壓 0.15MPa',
    dryTime: '24 小時完全硬化',
  });

  steps.push({
    order: order++,
    phase: '組裝完成',
    phaseEn: 'Final Assembly',
    icon: '🏆',
    description: '確認所有漆面完全硬化後進行最終組裝，關節處可塗少量矽油潤滑避免磨漆',
    paintIds: [],
    tool: '尖嘴鉗、矽油',
    dryTime: '-',
  });

  return steps;
}
