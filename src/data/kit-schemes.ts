export type KitBrand = 'bandai' | 'kotobukiya';
export type KitGrade = 'HG' | 'RG' | 'MG' | 'PG' | 'SD' | 'OTHER';
export type KitSeries = 'UC' | 'SEED' | 'OO' | 'IBO' | 'WFM' | 'WING' | 'BUILD' | 'HATHAWAY' | 'UNICORN' | 'ZETA' | 'CCA' | 'FA' | 'AC' | 'OTHER';

export interface MixRecipe {
  paintIds: string[];
  ratios: number[];
  note: string;
}

export interface ColorZone {
  zone: string;
  description: string;
  baseColor: string | MixRecipe;
  shadowColor?: string | MixRecipe;
  highlightColor?: string | MixRecipe;
  technique: string;
}

export interface WorkflowStep {
  order: number;
  phase: string;
  phaseEn: string;
  icon: string;
  description: string;
  paintIds: string[];
  tool: string;
  thinRatio?: string;
  dryTime: string;
}

export interface ChogokinScheme {
  id: string;
  kitName: string;
  kitNameEn: string;
  brand: KitBrand;
  grade: KitGrade;
  series: KitSeries;
  image?: string;
  description: string;
  zones: ColorZone[];
  workflow?: WorkflowStep[];
  clearCoat: string;
  tips: string[];
}

export const kitSchemes: ChogokinScheme[] = [
  // ============================================
  // RX-78-2 鋼彈 (初代鋼彈)
  // ============================================
  {
    id: 'rx78-2',
    kitName: 'RX-78-2 鋼彈',
    kitNameEn: 'RX-78-2 Gundam',
    brand: 'bandai',
    grade: 'MG',
    series: 'UC',
    description: '初代鋼彈經典三色配色，超合繪風格強調金屬質感與色階漸變',
    zones: [
      {
        zone: '白色裝甲',
        description: '頭部、胸部、腿部主裝甲',
        baseColor: 'm061',
        shadowColor: { paintIds: ['m062', 'm004'], ratios: [9, 1], note: '淺灰混少量寶藍，營造冷色陰影' },
        highlightColor: 'm001',
        technique: '先噴基底機甲白，陰影處用灰藍混色漸層噴塗，邊緣高光噴正白'
      },
      {
        zone: '紅色裝甲',
        description: '胸口、盾牌、腳部紅色區域',
        baseColor: 'm003',
        shadowColor: { paintIds: ['m003', 'm002'], ratios: [8, 2], note: '正紅+正黑調出暗紅陰影' },
        highlightColor: { paintIds: ['m003', 'm015'], ratios: [7, 3], note: '正紅+正橘提亮' },
        technique: '全面噴正紅，凹處補暗紅陰影，凸面邊緣噴紅橘高光'
      },
      {
        zone: '藍色裝甲',
        description: '腰部、腿部側裙甲',
        baseColor: 'm004',
        shadowColor: { paintIds: ['m004', 'm002'], ratios: [8, 2], note: '寶藍+正黑調深藍陰影' },
        highlightColor: { paintIds: ['m004', 'm001'], ratios: [7, 3], note: '寶藍+正白提亮' },
        technique: '先噴寶藍底色，陰影處混黑加深，邊緣用淡藍提亮'
      },
      {
        zone: '黃色部件',
        description: '頭部V字天線、胸口通風口',
        baseColor: 'mx05',
        shadowColor: 'mx07',
        highlightColor: 'mx06',
        technique: '使用金屬色直接噴塗，天線尖端用赤金提亮增加超合金質感'
      },
      {
        zone: '骨架/關節',
        description: '內構骨架、關節部位',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 'mx03',
        technique: '機械鐵打底，關節深處用槍鐵加深，凸面用機械銀乾刷提亮'
      },
      {
        zone: '噴射器/推進器',
        description: '背包噴嘴、腳底推進器',
        baseColor: 't024',
        shadowColor: 'mx11',
        highlightColor: 't023',
        technique: '盔甲鐵打底，噴嘴內圈加深，外緣用啞鋁提亮'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認合模線位置，依顏色分群拆件，白/紅/藍/黃/骨架各一組，用夾子或竹籤固定', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），清水沖洗去粉塵，完全乾燥', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '全件噴底漆補土灰，統一底色並檢查表面瑕疵；白色件可用白色底漆減少遮蓋層數', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '在底漆上沿凹線、裝甲邊緣噴一層薄黑色，建立明暗基底；控制氣壓降低噴出量做細線', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '白色裝甲底色', phaseEn: 'White Armor Base', icon: '⬜', description: '機甲白薄噴 2-3 層，保留預陰影透出的漸層效果；面的中央噴厚、邊緣保留暗部', paintIds: ['m061'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '白色陰影強化', phaseEn: 'White Shadow', icon: '🔷', description: '用灰藍混色（M-062:M-004=9:1）在凹處與邊緣補噴漸層陰影，強化立體感', paintIds: ['m062', 'm004'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '白色高光', phaseEn: 'White Highlight', icon: '✨', description: '純白在裝甲面中央最凸處輕噴一層提亮，做出裝甲反光點', paintIds: ['m001'], tool: '噴筆 0.3mm、極少量', dryTime: '20 分鐘' },
      { order: 8, phase: '紅色裝甲', phaseEn: 'Red Armor', icon: '🟥', description: '正紅噴 2-3 層遮蓋底色，暗面補暗紅（M-003:M-002=8:2），邊緣凸面噴紅橘高光', paintIds: ['m003', 'm002', 'm015'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 9, phase: '藍色裝甲', phaseEn: 'Blue Armor', icon: '🟦', description: '寶藍底色 2 層，陰影混黑加深（M-004:M-002=8:2），高光提淡藍（M-004:M-001=7:3）', paintIds: ['m004', 'm002', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 10, phase: '金屬色部件', phaseEn: 'Metallic Parts', icon: '🥇', description: '黃色零件噴機械金，天線尖端赤金提亮；先噴亮黑底可增強金屬反射效果', paintIds: ['mx05', 'mx06', 'mx07'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 11, phase: '骨架上色', phaseEn: 'Frame Painting', icon: '⚙️', description: '骨架全噴機械鐵，關節深處補槍鐵壓暗，凸面用機械銀乾刷做金屬磨損感', paintIds: ['mx02', 'mx11', 'mx03'], tool: '噴筆 + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 12, phase: '推進器/噴嘴', phaseEn: 'Thrusters', icon: '🔥', description: '盔甲鐵打底，內圈槍鐵加深，外緣啞鋁提亮，噴口內側可加燒焦色漸層', paintIds: ['t024', 'mx11', 't023'], tool: '噴筆 0.2mm', dryTime: '30 分鐘' },
      { order: 13, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴一層亮光透明漆做保護層，為後續墨線/水貼提供光滑表面', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 14, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '用油性墨線液（灰/黑/棕依部位選色）沿凹線滲入，白色部位用灰色、紅藍用黑色', paintIds: [], tool: '滲線筆或極細毛筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 15, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒，用軟化劑輔助貼合曲面，鑷子定位後用棉棒壓實排氣泡', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 16, phase: '超級消光保護', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '全機噴超級消光透明漆，統一質感、封住水貼與墨線，消除塑膠光澤做出超合繪質感', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 17, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認所有漆面完全硬化後組裝，關節處可塗少量矽油潤滑避免磨漆', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      '超合繪重點：每個色塊都要有明暗漸層，不能只有單一顏色',
      '白色區域是關鍵，用帶藍灰的陰影會比純灰更有質感',
      '黃色零件用金屬色替代普通黃，是超合繪風格的標誌之一',
      '最後上超級消光透明，統一全機質感',
      '建議先在素組上標記分色區域，再拆件噴塗'
    ]
  },

  // ============================================
  // 自由鋼彈 ZGMF-X10A Freedom
  // ============================================
  {
    id: 'freedom',
    kitName: 'ZGMF-X10A 自由鋼彈',
    kitNameEn: 'ZGMF-X10A Freedom Gundam',
    brand: 'bandai',
    grade: 'MG',
    series: 'SEED',
    description: '自由鋼彈藍白紅經典配色，超合繪強調翅膀的金屬質感與漸層',
    zones: [
      {
        zone: '白色主裝甲',
        description: '頭部、胸部、腿部白色裝甲',
        baseColor: 'm061',
        shadowColor: { paintIds: ['m062', 'm027'], ratios: [9, 1], note: '淺灰+微量深藍，冷色調陰影' },
        highlightColor: 'm001',
        technique: '機甲白底色，縫隙與凹面漸層噴灰藍陰影，突出立體感'
      },
      {
        zone: '藍色裝甲',
        description: '肩甲、腰裙甲、小腿側面',
        baseColor: 'm066',
        shadowColor: { paintIds: ['m027', 'm002'], ratios: [8, 2], note: '深藍+正黑' },
        highlightColor: { paintIds: ['m066', 'm001'], ratios: [7, 3], note: '摩多藍+正白' },
        technique: '摩多藍是SEED系專用色，陰影往深藍走，高光往天藍走'
      },
      {
        zone: '紅色區域',
        description: '肩甲內側、腳掌',
        baseColor: 'm003',
        shadowColor: { paintIds: ['m022', 'm002'], ratios: [8, 2], note: '胭脂紅+正黑' },
        highlightColor: 'm015',
        technique: '正紅底色，深處用暗紅，邊緣微噴正橘提亮'
      },
      {
        zone: '翅膀金屬藍',
        description: '翅膀主翼面',
        baseColor: 'mx44',
        shadowColor: { paintIds: ['mx44', 'mx02'], ratios: [7, 3], note: '金屬藍+機械鐵暗面' },
        highlightColor: 'mx03',
        technique: '金屬色源藍打底，翼根加深，翼尖乾刷銀色提亮'
      },
      {
        zone: '翅膀紅色翼',
        description: '翅膀紅色翼面',
        baseColor: 'mx41',
        shadowColor: 'mx02',
        highlightColor: 'mx03',
        technique: '金屬色源紅打底，根部用機械鐵壓暗，尖端提銀'
      },
      {
        zone: '骨架/關節',
        description: '內構、關節',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 'mx03',
        technique: '標準機械色骨架處理'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：白色裝甲/藍色裝甲/紅色區域/翅膀金屬藍/翅膀紅翼/骨架，共六組分別上竹籤', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），特別注意翅膀拼合縫需仔細處理，清水沖洗去粉塵', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '全件噴灰色底漆補土，白色件可用白色底漆減少後續遮蓋層數；翅膀件用黑色底漆增強金屬漆反射', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '沿凹線與裝甲邊緣噴薄黑色預陰影，SEED系可稍微加重翅膀根部的陰影', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '白色裝甲底色', phaseEn: 'White Armor Base', icon: '⬜', description: '機甲白薄噴 2-3 層，保留預陰影透出效果；面的中央噴厚邊緣保留暗部', paintIds: ['m061'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '白色陰影強化', phaseEn: 'White Shadow', icon: '🔷', description: '用灰色混微量深藍（M-062:M-027=9:1）在凹面與邊緣噴漸層陰影，SEED系偏深藍調', paintIds: ['m062', 'm027'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '白色高光', phaseEn: 'White Highlight', icon: '✨', description: '純白在裝甲最凸處輕噴提亮，做出裝甲反光點', paintIds: ['m001'], tool: '噴筆 0.3mm、極少量', dryTime: '20 分鐘' },
      { order: 8, phase: '藍色裝甲', phaseEn: 'Blue Armor', icon: '🟦', description: '摩多藍底色 2 層（SEED專用色），陰影用深藍+正黑加深（M-027:M-002=8:2），高光提亮藍白', paintIds: ['m066', 'm027', 'm002', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 9, phase: '紅色區域', phaseEn: 'Red Areas', icon: '🟥', description: '正紅底色，暗面用胭脂紅+正黑加深（M-022:M-002=8:2），邊緣正橘提亮', paintIds: ['m003', 'm022', 'm002', 'm015'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 10, phase: '翅膀金屬藍翼', phaseEn: 'Metallic Blue Wings', icon: '💙', description: '翅膀主翼先確保亮黑底色，再噴金屬色源藍（MX-44），翼根混機械鐵壓暗，翼尖乾刷機械銀做漸層', paintIds: ['mx44', 'mx02', 'mx03'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 11, phase: '翅膀紅色翼', phaseEn: 'Metallic Red Wings', icon: '❤️', description: '紅色翼面噴金屬色源紅（MX-41），根部用機械鐵壓暗，尖端乾刷機械銀提亮', paintIds: ['mx41', 'mx02', 'mx03'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 12, phase: '骨架上色', phaseEn: 'Frame Painting', icon: '⚙️', description: '骨架全噴機械鐵，關節深處補槍鐵壓暗，凸面用機械銀乾刷做金屬磨損感', paintIds: ['mx02', 'mx11', 'mx03'], tool: '噴筆 + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 13, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴一層亮光透明漆，為後續墨線與水貼提供光滑表面', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 14, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '油性墨線液沿凹線滲入：白色部位用灰色、藍色用黑色、紅色用棕色', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 15, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒，用軟化劑輔助貼合曲面，翅膀曲面需特別注意貼合', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 16, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '全機噴超級消光透明漆，統一質感並封住水貼與墨線', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 17, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面完全硬化後組裝，翅膀展開角度微調，關節處可塗矽油潤滑', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      '自由鋼彈的翅膀是亮點，建議用金屬色源做漸層效果',
      '藍色推薦使用M-066摩多藍，這是SEED系的代表色',
      '白色裝甲的陰影偏深藍調，會比灰色陰影更有SEED風格',
      '翅膀展開狀態噴塗效果最好，可以做出由內到外的漸層'
    ]
  },

  // ============================================
  // 獨角獸鋼彈 RX-0 Unicorn
  // ============================================
  {
    id: 'unicorn',
    kitName: 'RX-0 獨角獸鋼彈',
    kitNameEn: 'RX-0 Unicorn Gundam',
    brand: 'bandai',
    grade: 'MG',
    series: 'UNICORN',
    description: '獨角獸白色裝甲+紅色精神感應框體，超合繪重點在白色的層次與框體發光感',
    zones: [
      {
        zone: '白色裝甲（獨角獸模式）',
        description: '全機白色外裝甲',
        baseColor: 'm201',
        shadowColor: { paintIds: ['m062', 'm019'], ratios: [9, 1], note: '淺灰+微量紫羅蘭，帶紫色調的陰影' },
        highlightColor: 'm001',
        technique: '皇家白底色（帶暖白），陰影用灰紫色調，突出神秘感'
      },
      {
        zone: '精神感應框體（紅）',
        description: '毀滅模式露出的紅色內框',
        baseColor: 'm091',
        shadowColor: 'm003',
        highlightColor: 'm090',
        technique: '螢光紅打底增加發光感，局部壓正紅增加深度，高光用螢光桃紅'
      },
      {
        zone: '藍色精神感應框體',
        description: '覺醒模式藍色框體（選用）',
        baseColor: { paintIds: ['m044', 'm094'], ratios: [7, 3], note: '透明天藍+螢光綠混色' },
        shadowColor: 'm004',
        highlightColor: 'm094',
        technique: '透明藍+螢光綠打底，暗面壓寶藍，亮面提螢光綠做發光效果'
      },
      {
        zone: '骨架（毀滅模式可見）',
        description: '全機骨架',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 'mx03',
        technique: '標準機械色處理，可額外用ZERO銀做重點提亮'
      },
      {
        zone: '角（獨角獸之角）',
        description: '頭頂獨角',
        baseColor: 'mx05',
        highlightColor: 't009',
        technique: '機械金打底，尖端用ZERO銀提亮做超合金質感'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：白色外裝甲/紅色精神感應框體/藍色框體（選用）/骨架/獨角，共五組分別上竹籤', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），白色裝甲片需格外仔細處理表面以免瑕疵在皇家白下顯眼', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '白色裝甲用白色底漆減少遮蓋層數；框體部件用灰色底漆；螢光色部件底漆後可薄噴一層白色增加螢光效果', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '白色裝甲沿凹線噴薄黑色預陰影，框體部件可跳過（螢光色不需要預陰影）', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '白色裝甲底色', phaseEn: 'White Armor Base', icon: '⬜', description: '皇家白（M-201帶暖調）薄噴 2-3 層，保留預陰影漸層效果；面的中央噴厚邊緣保留暗部', paintIds: ['m201'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '白色陰影強化', phaseEn: 'White Shadow', icon: '🔮', description: '灰色混微量紫羅蘭（M-062:M-019=9:1）在凹面噴漸層陰影，UC系特色帶紫調陰影', paintIds: ['m062', 'm019'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '白色高光', phaseEn: 'White Highlight', icon: '✨', description: '純白在裝甲最凸處輕噴提亮，與皇家白形成微妙層次', paintIds: ['m001'], tool: '噴筆 0.3mm、極少量', dryTime: '20 分鐘' },
      { order: 8, phase: '精神感應框體（紅）', phaseEn: 'Psycho-Frame Red', icon: '🔴', description: '先薄噴螢光紅（M-091）2-3層做發光感底色，再局部壓正紅（M-003）增加深度，最後高光處點螢光桃紅（M-090）；保持顏色鮮豔通透', paintIds: ['m091', 'm003', 'm090'], tool: '噴筆 0.2mm、少量多次', dryTime: '螢光漆每層 15 分鐘，完成 40 分鐘' },
      { order: 9, phase: '精神感應框體（藍/選用）', phaseEn: 'Psycho-Frame Blue', icon: '🔵', description: '覺醒模式：透明天藍+螢光綠混色（M-044:M-094=7:3）打底，暗面壓寶藍，亮面提螢光綠做發光效果', paintIds: ['m044', 'm094', 'm004'], tool: '噴筆 0.2mm、少量多次', dryTime: '每層 15 分鐘，完成 40 分鐘' },
      { order: 10, phase: '金色獨角', phaseEn: 'Golden Horn', icon: '🥇', description: '獨角噴機械金打底，尖端用ZERO銀提亮做超合金漸層質感', paintIds: ['mx05', 't009'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 11, phase: '骨架上色', phaseEn: 'Frame Painting', icon: '⚙️', description: '骨架全噴機械鐵，關節深處槍鐵壓暗，凸面機械銀乾刷；毀滅模式可見部分需格外仔細', paintIds: ['mx02', 'mx11', 'mx03'], tool: '噴筆 + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 12, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴亮光透明漆，螢光框體部分可多噴一層增加光澤與保護', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 13, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '白色部位用灰色墨線液，框體紅色部位用棕色，骨架用黑色', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 14, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒，軟化劑輔助貼合；注意獨角獸的水貼較多且密集', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 15, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '白色裝甲噴超級消光；精神感應框體部分建議用亮光保護漆保留發光質感，或分開處理', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 16, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，可切換獨角獸/毀滅模式確認框體露出效果，關節塗矽油潤滑', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      '獨角獸的白要用帶暖調的皇家白，不要用純白，才有質感',
      '精神感應框體用螢光色+透明色疊加，可以做出發光效果',
      '陰影帶微量紫色調是UC系的特色',
      '如果做毀滅模式，白色裝甲縫隙可以透出紅色框體光'
    ]
  },

  // ============================================
  // 攻擊自由 ZGMF-X20A Strike Freedom
  // ============================================
  {
    id: 'strike-freedom',
    kitName: 'ZGMF-X20A 攻擊自由鋼彈',
    kitNameEn: 'ZGMF-X20A Strike Freedom Gundam',
    brand: 'bandai',
    grade: 'MG',
    series: 'SEED',
    description: '攻擊自由以金色關節為特色，超合繪要強調金屬光澤對比',
    zones: [
      {
        zone: '白色裝甲',
        description: '全機主要白色裝甲',
        baseColor: 'm061',
        shadowColor: { paintIds: ['m062', 'm027'], ratios: [9, 1], note: '冷灰藍陰影' },
        highlightColor: 'm001',
        technique: '機甲白底，冷灰藍陰影，純白高光'
      },
      {
        zone: '深藍裝甲',
        description: '肩甲、腰部、小腿深藍區域',
        baseColor: 'm027',
        shadowColor: { paintIds: ['m027', 'm002'], ratios: [7, 3], note: '深藍+正黑' },
        highlightColor: { paintIds: ['m066', 'm001'], ratios: [6, 4], note: '摩多藍+白提亮' },
        technique: '深藍底色，縫隙壓黑藍，邊緣提亮藍白'
      },
      {
        zone: '金色骨架/關節',
        description: '攻擊自由標誌性的金色關節',
        baseColor: 'sc03',
        shadowColor: 'mx07',
        highlightColor: 't010',
        technique: '金角電鍍漆打底，暗面用青金壓暗，亮面ZERO金提亮'
      },
      {
        zone: '龍騎兵翅膀',
        description: '背部龍騎兵系統翅膀',
        baseColor: 'mx05',
        shadowColor: 'mx07',
        highlightColor: 't009',
        technique: '機械金底色，根部青金壓暗，翼尖ZERO銀提亮做漸層'
      },
      {
        zone: '紅色區域',
        description: '腳掌、部分裝甲紅色',
        baseColor: 'm003',
        shadowColor: 'm203',
        highlightColor: 'm015',
        technique: '正紅底色，暗面用血紅加深，亮面正橘提'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：白色裝甲/深藍裝甲/金色骨架關節/龍騎兵翅膀/紅色區域，共五組分別上竹籤', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），金色骨架件需特別仔細處理以確保電鍍漆附著', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '白色件用白色底漆；深藍件用灰色底漆；金色骨架與翅膀件用黑色底漆（電鍍漆需亮黑底色增強反射）', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '白色與深藍裝甲沿凹線噴薄黑色預陰影；金色件跳過（已是黑底）', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '金色骨架亮黑底', phaseEn: 'Gloss Black Undercoat', icon: '⚫', description: '金色骨架關節件先噴一層高光澤亮黑，確保表面光滑如鏡面，這是電鍍漆反射效果的關鍵', paintIds: ['m002', 'm007'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '亮黑 2 小時完全硬化' },
      { order: 6, phase: '金色骨架電鍍', phaseEn: 'Chrome Gold Frame', icon: '👑', description: '在光滑亮黑底上噴金角電鍍漆（SC-03），暗面用青金（MX-07）壓暗，亮面ZERO金提亮', paintIds: ['sc03', 'mx07', 't010'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑、避免觸摸', dryTime: '電鍍漆 2-4 小時' },
      { order: 7, phase: '白色裝甲底色', phaseEn: 'White Armor Base', icon: '⬜', description: '機甲白薄噴 2-3 層保留預陰影漸層', paintIds: ['m061'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 8, phase: '白色陰影強化', phaseEn: 'White Shadow', icon: '🔷', description: '灰色混微量深藍（M-062:M-027=9:1）凹面噴漸層陰影，保持SEED系冷色調', paintIds: ['m062', 'm027'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 9, phase: '白色高光', phaseEn: 'White Highlight', icon: '✨', description: '純白在裝甲最凸處輕噴提亮', paintIds: ['m001'], tool: '噴筆 0.3mm、極少量', dryTime: '20 分鐘' },
      { order: 10, phase: '深藍裝甲', phaseEn: 'Dark Blue Armor', icon: '🟦', description: '深藍底色 2 層，縫隙用深藍+正黑（M-027:M-002=7:3）壓暗，邊緣用摩多藍+白提亮', paintIds: ['m027', 'm002', 'm066', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 11, phase: '紅色區域', phaseEn: 'Red Areas', icon: '🟥', description: '正紅底色，暗面血紅加深，邊緣正橘提亮', paintIds: ['m003', 'm203', 'm015'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 12, phase: '龍騎兵翅膀', phaseEn: 'Dragoon Wings', icon: '🪽', description: '翅膀在亮黑底上噴機械金，根部用青金壓暗，翼尖用ZERO銀提亮做金→銀漸層', paintIds: ['mx05', 'mx07', 't009'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 13, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴亮光透明漆（金色骨架部分需輕噴薄層避免霧化電鍍效果）', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 14, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '白色用灰色、深藍用黑色墨線；金色骨架部分慎重使用避免腐蝕電鍍漆', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 15, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑輔助貼合，翅膀與金色部位需特別注意貼合角度', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 16, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '裝甲部分噴超級消光透明漆統一質感；金色骨架可選擇保留亮光或半光澤做對比', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 17, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，金色骨架與白色裝甲的對比是重點，關節塗矽油潤滑', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      '攻擊自由的重點是金色骨架，建議使用Super Chrome金角漆',
      '金色骨架與白色裝甲的對比是超合繪的關鍵',
      '翅膀從根到尖做金→銀漸層效果最佳',
      '深藍色區域不要太亮，保持與白色的明暗對比'
    ]
  },

  // ============================================
  // 紅色異端 MBF-P02 Astray Red Frame
  // ============================================
  {
    id: 'astray-red',
    kitName: 'MBF-P02 紅色異端鋼彈',
    kitNameEn: 'MBF-P02 Gundam Astray Red Frame',
    brand: 'bandai',
    grade: 'MG',
    series: 'SEED',
    description: '紅色異端以大面積紅色為主，超合繪重點在紅色的層次與日本刀的金屬質感',
    zones: [
      {
        zone: '紅色主裝甲',
        description: '全機大面積紅色裝甲',
        baseColor: 'm031',
        shadowColor: { paintIds: ['m031', 'm002'], ratios: [7, 3], note: '義大利紅+正黑壓暗' },
        highlightColor: { paintIds: ['m031', 'm005'], ratios: [8, 2], note: '義大利紅+正黃提亮' },
        technique: '義大利紅比正紅更有深度，陰影走暗紅，高光帶橘紅'
      },
      {
        zone: '白色裝甲',
        description: '胸部、腿部白色區域',
        baseColor: 'm061',
        shadowColor: { paintIds: ['m062', 'm003'], ratios: [9, 1], note: '淺灰+微紅暖色陰影' },
        highlightColor: 'm001',
        technique: '機甲白底，陰影帶微量紅色（暖色調），配合紅色裝甲'
      },
      {
        zone: '菊一文字（日本刀）',
        description: '大型日本刀武器',
        baseColor: 't009',
        shadowColor: 'mx02',
        highlightColor: 'sc02',
        technique: 'ZERO銀打底做刀身，刀背用機械鐵加深，刀刃用銀角電鍍提亮'
      },
      {
        zone: '骨架/關節',
        description: '金色骨架',
        baseColor: 'mx05',
        shadowColor: 'mx11',
        highlightColor: 'mx06',
        technique: '機械金打底，暗面壓槍鐵，亮面赤金提亮'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：紅色主裝甲/白色裝甲/菊一文字日本刀/金色骨架關節，共四組分別上竹籤', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），日本刀刀身需打磨至1000號以上確保金屬漆光滑', paintIds: [], tool: '砂紙 400/600/800/1000、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '紅色件用灰色底漆；白色件用白色底漆；日本刀用黑色底漆增強金屬反射；骨架用灰色底漆', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '紅色與白色裝甲沿凹線噴薄黑色預陰影，紅色面積大所以預陰影要控制好範圍', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '紅色主裝甲底色', phaseEn: 'Red Armor Base', icon: '🟥', description: '義大利紅（M-031）薄噴 3-4 層（大面積紅色需要多層薄噴避免積漆），保留預陰影透出效果', paintIds: ['m031'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10-15 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '紅色陰影強化', phaseEn: 'Red Shadow', icon: '🔻', description: '義大利紅+正黑（M-031:M-002=7:3）在凹面與邊緣噴暗紅陰影漸層', paintIds: ['m031', 'm002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '紅色高光', phaseEn: 'Red Highlight', icon: '🔺', description: '義大利紅+正黃（M-031:M-005=8:2）在裝甲最凸面噴橘紅高光提亮', paintIds: ['m031', 'm005'], tool: '噴筆 0.3mm、極少量', dryTime: '20 分鐘' },
      { order: 8, phase: '白色裝甲', phaseEn: 'White Armor', icon: '⬜', description: '機甲白底色，陰影用灰色混微紅（M-062:M-003=9:1）做暖色調陰影配合紅色裝甲，高光純白', paintIds: ['m061', 'm062', 'm003', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 9, phase: '菊一文字（日本刀）', phaseEn: 'Katana - Gerbera Straight', icon: '⚔️', description: '刀身噴ZERO銀（T-009）做鏡面質感，刀背用機械鐵（MX-02）加深做層次，刀刃最鋒利處用銀角電鍍漆（SC-02）提亮', paintIds: ['t009', 'mx02', 'sc02'], tool: '噴筆 0.2mm、金屬漆需D-09溶劑、避免觸摸刀面', dryTime: '金屬漆 60 分鐘' },
      { order: 10, phase: '金色骨架', phaseEn: 'Gold Frame', icon: '🥇', description: '骨架噴機械金，暗面槍鐵壓暗，亮面赤金提亮', paintIds: ['mx05', 'mx11', 'mx06'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 11, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴亮光透明漆，日本刀部分需薄噴保留金屬反射', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 12, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '紅色部位用黑色墨線、白色部位用灰色墨線、金色骨架用棕色墨線', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 13, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑輔助貼合，紅色大面積裝甲上的水貼需注意位置對稱', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 14, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '裝甲噴超級消光透明漆統一質感；日本刀可保留亮光做金屬對比', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 15, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，日本刀持握姿勢調整，關節塗矽油潤滑', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      '紅色異端的紅推薦用M-031義大利紅，比正紅更有深度',
      '菊一文字是視覺焦點，ZERO銀+銀角電鍍漆做出刀刃光澤',
      '白色裝甲的陰影帶暖色調（微紅），與冷色UC系不同'
    ]
  },

  // ============================================
  // 飛翼零式 XXXG-00W0 Wing Zero (EW)
  // ============================================
  {
    id: 'wing-zero-ew',
    kitName: 'XXXG-00W0 飛翼零式鋼彈（EW版）',
    kitNameEn: 'Wing Gundam Zero (EW)',
    brand: 'bandai',
    grade: 'MG',
    series: 'WING',
    description: '天使翅膀是最大亮點，超合繪要做出羽毛漸層與本體的對比',
    zones: [
      {
        zone: '白色裝甲',
        description: '全機白色主裝甲',
        baseColor: 'm001',
        shadowColor: { paintIds: ['m062', 'm004'], ratios: [8, 2], note: '淺灰+寶藍冷色陰影' },
        highlightColor: 'm001',
        technique: '純白底色，漸層噴灰藍陰影，保持整體明亮'
      },
      {
        zone: '深藍裝甲',
        description: '肩甲、腰裙甲藍色',
        baseColor: 'm027',
        shadowColor: { paintIds: ['m027', 'm002'], ratios: [7, 3], note: '深藍+正黑' },
        highlightColor: 'm004',
        technique: '深藍底色，暗面壓黑藍，邊緣提寶藍'
      },
      {
        zone: '紅色區域',
        description: '胸口、腳部紅色',
        baseColor: 'm003',
        shadowColor: 'm203',
        highlightColor: 'm015',
        technique: '標準紅色超合繪處理'
      },
      {
        zone: '天使翅膀',
        description: '背部大型天使翅膀',
        baseColor: 'm111',
        shadowColor: { paintIds: ['m062', 'm019'], ratios: [9, 1], note: '淺灰+微紫' },
        highlightColor: 'm001',
        technique: '珠光白打底，羽毛根部灰紫漸層，尖端純白，做出層次'
      },
      {
        zone: '雙管破壞步槍',
        description: '主武器',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 'mx03',
        technique: '機械鐵打底，凹槽槍鐵加深，邊緣機械銀提亮'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：白色裝甲/深藍裝甲/紅色區域/天使翅膀羽毛/武器，共五組；翅膀羽毛片逐片編號以利漸層', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），翅膀羽毛片邊緣需仔細圓滑處理', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '全件噴白色底漆（此機白色面積大用白底漆效率更高），深藍件可改灰色底漆', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '裝甲沿凹線噴薄黑色預陰影；翅膀羽毛在根部噴預陰影為漸層做準備', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '白色裝甲底色', phaseEn: 'White Armor Base', icon: '⬜', description: '純白薄噴 2-3 層保留預陰影漸層效果，面的中央噴厚邊緣保留暗部', paintIds: ['m001'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '白色陰影強化', phaseEn: 'White Shadow', icon: '🔷', description: '灰色混寶藍（M-062:M-004=8:2）在凹面噴冷色漸層陰影', paintIds: ['m062', 'm004'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '深藍裝甲', phaseEn: 'Dark Blue Armor', icon: '🟦', description: '深藍底色 2 層，暗面用深藍+正黑（M-027:M-002=7:3）壓暗，邊緣提寶藍（M-004）', paintIds: ['m027', 'm002', 'm004'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 8, phase: '紅色區域', phaseEn: 'Red Areas', icon: '🟥', description: '正紅底色，暗面血紅加深，邊緣正橘提亮', paintIds: ['m003', 'm203', 'm015'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 9, phase: '天使翅膀珠光底', phaseEn: 'Angel Wings Pearl Base', icon: '🕊️', description: '每片羽毛噴珠光白（M-111）做底色，建立珠光質感基底', paintIds: ['m111'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層 15 分鐘，完成 30 分鐘' },
      { order: 10, phase: '天使翅膀漸層', phaseEn: 'Angel Wings Gradient', icon: '🪶', description: '逐片羽毛處理：根部噴灰紫漸層（M-062:M-019=9:1），中段保留珠光白，尖端薄噴純白提亮；由內到外做出層次', paintIds: ['m062', 'm019', 'm001'], tool: '噴筆 0.2mm、氣壓 0.08MPa、逐片操作', dryTime: '每片 5-10 分鐘' },
      { order: 11, phase: '武器上色', phaseEn: 'Weapon Painting', icon: '🔫', description: '雙管破壞步槍：機械鐵打底，凹槽槍鐵加深，邊緣機械銀乾刷提亮', paintIds: ['mx02', 'mx11', 'mx03'], tool: '噴筆 + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 12, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴亮光透明漆，翅膀可選擇半光澤保留珠光效果', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 13, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '白色用灰色墨線、深藍用黑色、紅色用棕色；翅膀羽毛間可用淺灰墨線增加層次', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 14, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑輔助貼合曲面', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 15, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '全機噴超級消光透明漆統一質感；翅膀可考慮半光澤保留天使光澤感做對比', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 16, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，翅膀展開角度調整，關節塗矽油潤滑', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      '翅膀用珠光白可以增加天使感',
      '翅膀羽毛建議每片做從根部到尖端的漸層',
      '金色零件（胸口）用電鍍漆可以更有超合金感'
    ]
  },

  // ============================================
  // 巴巴托斯 ASW-G-08 Barbatos Lupus Rex
  // ============================================
  {
    id: 'barbatos-lupus-rex',
    kitName: 'ASW-G-08 巴巴托斯天狼王',
    kitNameEn: 'Gundam Barbatos Lupus Rex',
    brand: 'bandai',
    grade: 'HG',
    series: 'IBO',
    description: 'IBO系骨架外露風格，超合繪重點在大量金屬骨架與裝甲的對比',
    zones: [
      {
        zone: '白色裝甲',
        description: '胸部、腿部白色裝甲片',
        baseColor: 'm061',
        shadowColor: 'm063',
        highlightColor: 'm001',
        technique: '機甲白底，中灰漸層做陰影，IBO風格陰影比較直接'
      },
      {
        zone: '深藍裝甲',
        description: '肩甲、腳部深藍裝甲',
        baseColor: 'm027',
        shadowColor: { paintIds: ['m027', 'm002'], ratios: [6, 4], note: '深藍+大比例正黑，壓到很暗' },
        highlightColor: 'm004',
        technique: 'IBO系深藍壓得很暗，接近黑藍'
      },
      {
        zone: '骨架（大面積外露）',
        description: '阿賴耶識骨架，大量外露',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 't009',
        technique: '機械鐵打底，關節深處槍鐵，突出部位ZERO銀乾刷，強調機械質感'
      },
      {
        zone: '尾巴/爪',
        description: '天狼王尾巴與腳爪',
        baseColor: 'mx11',
        shadowColor: { paintIds: ['mx11', 'm002'], ratios: [7, 3], note: '槍鐵+正黑' },
        highlightColor: 'mx03',
        technique: '深色金屬打底，尖端用銀色做銳利感'
      },
      {
        zone: '黃色裝甲',
        description: '胸口、額頭黃色',
        baseColor: 'mx05',
        highlightColor: 'mx06',
        technique: '機械金打底，邊緣赤金提亮'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：白色裝甲/深藍裝甲/骨架（大量外露）/尾巴爪件/黃色部件，共五組；骨架數量最多需細心編號', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），IBO骨架外露面積大需仔細處理每個關節面', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '骨架與尾巴爪件用黑色底漆增強金屬漆效果；裝甲件用灰色底漆', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: 'IBO風格預陰影比一般鋼彈更重，沿凹線與裝甲邊緣大範圍噴黑色，壓暗面積可達30-40%', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.10MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '骨架上色', phaseEn: 'Frame Painting', icon: '⚙️', description: '阿賴耶識骨架全噴機械鐵（MX-02），關節深處補槍鐵（MX-11）壓暗，凸面突出部位用ZERO銀（T-009）乾刷做金屬磨損感', paintIds: ['mx02', 'mx11', 't009'], tool: '噴筆 0.3mm + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 6, phase: '白色裝甲', phaseEn: 'White Armor', icon: '⬜', description: '機甲白底色，中灰（M-063）做直接粗獷的陰影（IBO風格不需太細膩漸層），純白高光', paintIds: ['m061', 'm063', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 7, phase: '深藍裝甲', phaseEn: 'Dark Blue Armor', icon: '🟦', description: '深藍底色，暗面用深藍+大比例正黑（M-027:M-002=6:4）壓到接近黑藍，邊緣提寶藍', paintIds: ['m027', 'm002', 'm004'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 8, phase: '黃色金屬部件', phaseEn: 'Gold Metallic Parts', icon: '🥇', description: '胸口與額頭黃色件噴機械金，邊緣赤金提亮', paintIds: ['mx05', 'mx06'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 9, phase: '尾巴/爪金屬', phaseEn: 'Tail & Claws Metal', icon: '🦾', description: '天狼王尾巴與腳爪全噴槍鐵（MX-11），暗面混正黑壓更暗，尖端用機械銀（MX-03）提亮做銳利感', paintIds: ['mx11', 'm002', 'mx03'], tool: '噴筆 0.3mm + 扁頭筆刷', dryTime: '30 分鐘' },
      { order: 10, phase: '尾巴/爪舊化', phaseEn: 'Tail & Claws Weathering', icon: '💀', description: '在尾巴與爪子上用海綿沾深色乾刷做磨損效果，邊緣用銀色做金屬剝落感，增加IBO系的戰損風格', paintIds: ['mx03', 'mx11'], tool: '海綿、扁頭乾刷筆', dryTime: '20 分鐘' },
      { order: 11, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '裝甲件噴亮光透明漆做墨線前保護；骨架金屬件可跳過保留金屬質感', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 12, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '白色用灰色、深藍用黑色；骨架金屬面可用深棕色墨線增加機械油漬感', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 13, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑貼合', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 14, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '全機噴超級消光透明漆，IBO系全消光風格統一硬派質感', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 15, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，尾巴與爪子活動度確認，關節塗矽油潤滑', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      'IBO系的骨架是最大視覺重點，金屬質感要做到位',
      '巴巴托斯的風格偏硬派，陰影可以壓得更重',
      'ZERO銀乾刷在骨架凸面可以做出磨損/使用感',
      '尾巴和爪子的金屬漸層是加分項'
    ]
  },

  // ============================================
  // 空中霸者 (Aerial) XVX-016
  // ============================================
  {
    id: 'aerial',
    kitName: 'XVX-016 風靈鋼彈',
    kitNameEn: 'Gundam Aerial',
    brand: 'bandai',
    grade: 'HG',
    series: 'WFM',
    description: '水星魔女主角機，白藍粉配色，超合繪要做出現代感與光澤',
    zones: [
      {
        zone: '白色裝甲',
        description: '全機主體白色',
        baseColor: 'm201',
        shadowColor: { paintIds: ['m062', 'm113'], ratios: [8, 2], note: '淺灰+珠光藍微量' },
        highlightColor: 'm001',
        technique: '皇家白底色帶暖調，陰影用帶珠光藍的灰色，現代感'
      },
      {
        zone: '藍色裝甲',
        description: '肩部、腿部藍色',
        baseColor: 'm052',
        shadowColor: 'm066',
        highlightColor: { paintIds: ['m052', 'm001'], ratios: [6, 4], note: '天空藍+正白' },
        technique: '天空藍底色（比UC系淺），陰影走摩多藍，高光提白藍'
      },
      {
        zone: '粉紅/桃紅區域',
        description: '背部GUND-BIT、細節粉色',
        baseColor: 'm021',
        shadowColor: 'm020',
        highlightColor: { paintIds: ['m021', 'm001'], ratios: [7, 3], note: '粉紅+正白' },
        technique: '粉紅底色，暗面桃紅加深，亮面加白提亮'
      },
      {
        zone: 'GUND-BIT盾牌',
        description: '可分離式盾牌群',
        baseColor: 'mx03',
        shadowColor: 'mx02',
        highlightColor: 't009',
        technique: '機械銀底色做科技感，暗面鐵色，邊緣ZERO銀'
      },
      {
        zone: '骨架',
        description: '內構',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 'mx03',
        technique: '標準機械骨架處理'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：白色裝甲/藍色裝甲/粉紅區域/GUND-BIT盾牌/骨架，共五組分別上竹籤', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），GUND-BIT盾牌零件多需逐一處理', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '白色件用白色底漆；藍色與粉紅件用灰色底漆；盾牌件用黑色底漆增強金屬反射', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '現代風格預陰影較輕，沿凹線噴薄黑色即可，不需壓太重', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.06MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '白色裝甲底色', phaseEn: 'White Armor Base', icon: '⬜', description: '皇家白（M-201帶暖調）薄噴 2-3 層，保留輕微預陰影做柔和漸層', paintIds: ['m201'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '白色陰影強化', phaseEn: 'White Shadow', icon: '🔷', description: '灰色混珠光藍微量（M-062:M-113=8:2）在凹面噴柔和陰影，帶現代光澤感', paintIds: ['m062', 'm113'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '白色高光', phaseEn: 'White Highlight', icon: '✨', description: '純白在裝甲最凸處輕噴提亮', paintIds: ['m001'], tool: '噴筆 0.3mm、極少量', dryTime: '20 分鐘' },
      { order: 8, phase: '藍色裝甲', phaseEn: 'Blue Armor', icon: '🟦', description: '天空藍（M-052）底色（比UC系淺），陰影用摩多藍（M-066）加深，高光用天空藍+白提亮', paintIds: ['m052', 'm066', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 9, phase: '粉紅區域', phaseEn: 'Pink Areas', icon: '🩷', description: '粉紅（M-021）底色 2 層，暗面用桃紅（M-020）加深，亮面混白提亮；GUND-BIT背部粉色一併處理', paintIds: ['m021', 'm020', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 10, phase: 'GUND-BIT盾牌', phaseEn: 'GUND-BIT Shields', icon: '🛡️', description: '盾牌群以機械銀（MX-03）底色做科技感，暗面機械鐵壓暗，邊緣ZERO銀提亮；每片可做微妙差異', paintIds: ['mx03', 'mx02', 't009'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 11, phase: '骨架上色', phaseEn: 'Frame Painting', icon: '⚙️', description: '骨架噴機械鐵，關節槍鐵壓暗，凸面機械銀提亮', paintIds: ['mx02', 'mx11', 'mx03'], tool: '噴筆 + 扁頭筆刷', dryTime: '30 分鐘' },
      { order: 12, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴亮光透明漆做墨線前保護', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 13, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '白色用灰色、藍色用深藍色、粉色用棕色墨線；WFM系墨線不宜過粗', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 14, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑貼合，GUND-BIT盾牌上的水貼需逐片處理', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 15, phase: '最終保護漆', phaseEn: 'Final Semi-Gloss Coat', icon: '🌟', description: '全機噴半光澤透明漆（M-030），WFM現代風格用半光澤比全消光更合適，保留適度光澤', paintIds: ['m030'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 16, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，GUND-BIT盾牌展開姿態調整，關節塗矽油潤滑', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 'm030',
    tips: [
      '風靈的配色偏現代清爽，不需要太重的陰影',
      '藍色區域用天空藍而非深藍，保持輕盈感',
      '粉色區域是特色，用珠光底色+粉色可以增加光澤',
      '半光澤透明漆比全消光更適合這台機體的風格'
    ]
  },

  // ============================================
  // 壽屋 - Frame Arms Girl 轟雷
  // ============================================
  {
    id: 'gourai',
    kitName: '轟雷',
    kitNameEn: 'Frame Arms Girl Gourai',
    brand: 'kotobukiya',
    grade: 'OTHER',
    series: 'FA',
    description: '壽屋FA:G轟雷，軍武風美少女機體，超合繪要同時處理膚色與裝甲',
    zones: [
      {
        zone: '膚色（臉/身體）',
        description: '少女部位的膚色',
        baseColor: 'm101',
        shadowColor: 'm102',
        highlightColor: 'm103',
        technique: '膚色基本打底，關節處陰影色，額頭/鼻樑/膝蓋高光'
      },
      {
        zone: '白色裝甲',
        description: '主要裝甲白色區域',
        baseColor: 'm061',
        shadowColor: { paintIds: ['m062', 'm017'], ratios: [9, 1], note: '淺灰+微紫，少女機偏暖紫陰影' },
        highlightColor: 'm001',
        technique: '機甲白底，陰影帶微紫色調增加少女感'
      },
      {
        zone: '深藍/軍武色',
        description: '裝甲深色區域',
        baseColor: 'm570',
        shadowColor: { paintIds: ['m570', 'm002'], ratios: [7, 3], note: '暗灰+正黑' },
        highlightColor: 'm063',
        technique: '軍武暗灰底色，壓暗+提灰做層次'
      },
      {
        zone: '武器/裝備',
        description: '槍械、導彈架等武裝',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 'mx03',
        technique: '金屬質感處理，乾刷提亮'
      },
      {
        zone: '頭髮',
        description: '轟雷的頭髮',
        baseColor: 'm027',
        shadowColor: { paintIds: ['m027', 'm002'], ratios: [7, 3], note: '深藍+正黑' },
        highlightColor: { paintIds: ['m027', 'm001'], ratios: [6, 4], note: '深藍+正白' },
        technique: '深藍底色，髮根壓暗，髮尾漸層提亮'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：膚色部件/白色裝甲/深藍軍武色/武器裝備/頭髮，共五組；膚色部件需特別小心避免刮傷', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），膚色部件打磨至1000號確保光滑；臉部件需格外仔細', paintIds: [], tool: '砂紙 400/600/800/1000、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '膚色件用白色底漆讓膚色更通透；裝甲用灰色底漆；武器用黑色底漆增強金屬感', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '膚色打底', phaseEn: 'Skin Base Coat', icon: '👩', description: '膚色基本（M-101）薄噴 2-3 層做底色，FA:G膚色需優先處理避免被其他顏色汙染', paintIds: ['m101'], tool: '噴筆 0.2mm、氣壓 0.10MPa', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 5, phase: '膚色陰影與高光', phaseEn: 'Skin Shadow & Highlight', icon: '🌸', description: '關節處、眼窩、下巴底噴膚色陰影（M-102），額頭、鼻樑、膝蓋等凸面噴膚色高光（M-103）', paintIds: ['m102', 'm103'], tool: '噴筆 0.2mm、氣壓 0.06MPa', dryTime: '20 分鐘' },
      { order: 6, phase: '預陰影（裝甲）', phaseEn: 'Pre-Shading Armor', icon: '🌑', description: '裝甲件沿凹線噴薄黑色預陰影', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 7, phase: '白色裝甲', phaseEn: 'White Armor', icon: '⬜', description: '機甲白底色，陰影用灰色混微量紫（M-062:M-017=9:1）做少女感暖紫陰影，高光純白', paintIds: ['m061', 'm062', 'm017', 'm001'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 8, phase: '深藍/軍武色裝甲', phaseEn: 'Military Dark Armor', icon: '🔷', description: '暗灰（M-570）底色，暗面用暗灰+正黑（M-570:M-002=7:3）壓暗，高光提中灰（M-063）', paintIds: ['m570', 'm002', 'm063'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 9, phase: '頭髮底色', phaseEn: 'Hair Base Coat', icon: '💇', description: '深藍底色全面噴塗頭髮部件', paintIds: ['m027'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 20 分鐘' },
      { order: 10, phase: '頭髮漸層', phaseEn: 'Hair Gradient', icon: '💎', description: '髮根用深藍+正黑（M-027:M-002=7:3）壓暗，髮尾漸層用深藍+白（M-027:M-001=6:4）提亮，做出光澤飄逸感', paintIds: ['m027', 'm002', 'm001'], tool: '噴筆 0.2mm、氣壓 0.06MPa', dryTime: '20 分鐘' },
      { order: 11, phase: '武器金屬上色', phaseEn: 'Weapon Painting', icon: '🔫', description: '槍械導彈架噴機械鐵底色，凹槽槍鐵加深，邊緣機械銀乾刷提亮', paintIds: ['mx02', 'mx11', 'mx03'], tool: '噴筆 0.3mm + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 12, phase: '武器舊化', phaseEn: 'Weapon Weathering', icon: '💀', description: '武器上用海綿沾銀色做磨損效果，邊緣做金屬剝落痕跡，增加軍武使用感', paintIds: ['mx03', 'mx11'], tool: '海綿、扁頭乾刷筆', dryTime: '20 分鐘' },
      { order: 13, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '裝甲與武器件噴亮光透明漆做墨線前保護；膚色件可輕噴薄層', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 14, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '白色裝甲用灰色、深色裝甲用黑色墨線；膚色部位不上墨線', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 15, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑貼合', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 16, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '裝甲噴超級消光；膚色部件用半光澤保留皮膚質感；頭髮用半光澤保留光澤', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 17, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，注意膚色與裝甲接合處避免磨漆，關節塗矽油', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      'FA:G系列膚色區域建議用專用膚色組（M-101/102/103）',
      '裝甲陰影偏紫色調，可以和少女風格搭配',
      '武器部分可以更重手做舊化效果',
      '頭髮漸層是重點，要細心做出光澤感'
    ]
  },

  // ============================================
  // 閃光哈薩威 RX-105 Ξ (Xi) Gundam
  // ============================================
  {
    id: 'xi-gundam',
    kitName: 'RX-105 Ξ鋼彈',
    kitNameEn: 'Xi Gundam',
    brand: 'bandai',
    grade: 'HG',
    series: 'HATHAWAY',
    description: '閃光哈薩威主角機，大體積機體，超合繪重點在大面裝甲的層次與飛行單元',
    zones: [
      {
        zone: '白色裝甲',
        description: '主體白色裝甲（大面積）',
        baseColor: 'm061',
        shadowColor: { paintIds: ['m062', 'm026'], ratios: [9, 1], note: '淺灰+微藍綠' },
        highlightColor: 'm001',
        technique: '大面積裝甲更需要漸層，從邊緣向中心噴陰影'
      },
      {
        zone: '深藍裝甲',
        description: '胸部、腿部深藍色區域',
        baseColor: 'm027',
        shadowColor: { paintIds: ['m027', 'm017'], ratios: [8, 2], note: '深藍+艷紫' },
        highlightColor: { paintIds: ['m027', 'm052'], ratios: [7, 3], note: '深藍+天空藍' },
        technique: '深藍底，陰影往紫藍走（閃哈系特色），高光天空藍'
      },
      {
        zone: '黃色部件',
        description: '天線、V字等黃色',
        baseColor: 'mx05',
        highlightColor: 'mx06',
        technique: '機械金直接噴，赤金提亮'
      },
      {
        zone: '飛行單元',
        description: 'Minovsky Flight Unit',
        baseColor: 'mx03',
        shadowColor: 'mx02',
        highlightColor: 't009',
        technique: '機械銀底，暗面鐵色，邊緣ZERO銀，做出飛行器金屬感'
      },
      {
        zone: '骨架',
        description: '內構骨架',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 'mx03',
        technique: '標準機械色骨架'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：白色主裝甲/深藍裝甲/黃色部件/飛行單元/骨架，共五組；大體積機體零件多需細心編號', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），大面積白色裝甲片需特別注意平面平整度', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '白色件用白色底漆；深藍件用灰色底漆；飛行單元用黑色底漆增強金屬漆反射', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '沿凹線噴薄黑色預陰影，大面積裝甲的預陰影需拉長距離做出寬幅漸層', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '白色裝甲底色', phaseEn: 'White Armor Base', icon: '⬜', description: '機甲白薄噴 2-3 層，大面積裝甲分區噴塗確保每片都有獨立的明暗漸層', paintIds: ['m061'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '白色陰影強化', phaseEn: 'White Shadow', icon: '🔷', description: '灰色混微量藍綠（M-062:M-026=9:1）在凹面噴陰影，閃哈系帶藍綠色調', paintIds: ['m062', 'm026'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '白色高光', phaseEn: 'White Highlight', icon: '✨', description: '純白在每片裝甲最凸處提亮，大面積件高光範圍可加大', paintIds: ['m001'], tool: '噴筆 0.3mm', dryTime: '20 分鐘' },
      { order: 8, phase: '白色裝甲漸層補強', phaseEn: 'White Armor Gradient', icon: '🎨', description: '大面積裝甲額外從邊緣向中心做二次漸層，確保每個面都有豐富的明暗變化', paintIds: ['m062', 'm001'], tool: '噴筆 0.3mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 9, phase: '深藍裝甲', phaseEn: 'Dark Blue Armor', icon: '🟦', description: '深藍底色，陰影用深藍+艷紫（M-027:M-017=8:2）走紫藍調（閃哈系特色），高光用深藍+天空藍', paintIds: ['m027', 'm017', 'm052'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 10, phase: '黃色金屬部件', phaseEn: 'Gold Metallic Parts', icon: '🥇', description: '天線、V字噴機械金，赤金提亮', paintIds: ['mx05', 'mx06'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 11, phase: '飛行單元', phaseEn: 'Flight Unit Metallic', icon: '✈️', description: 'Minovsky飛行單元在黑底上噴機械銀（MX-03），暗面機械鐵壓暗，邊緣ZERO銀提亮做飛行器金屬漸層', paintIds: ['mx03', 'mx02', 't009'], tool: '噴筆 0.3mm、金屬漆用D-09溶劑', dryTime: '金屬漆 40-60 分鐘' },
      { order: 12, phase: '骨架上色', phaseEn: 'Frame Painting', icon: '⚙️', description: '骨架噴機械鐵，關節槍鐵壓暗，凸面機械銀提亮', paintIds: ['mx02', 'mx11', 'mx03'], tool: '噴筆 + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 13, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴亮光透明漆做墨線前保護', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 14, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '白色用灰色、深藍用黑色墨線；大面積裝甲的墨線需特別整齊', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 15, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑貼合，大面積裝甲上的水貼位置需事先規劃', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 16, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '全機噴超級消光透明漆統一質感', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 17, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，飛行單元角度調整，大體積機體需確認關節強度', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      'Ξ鋼彈體積大，漸層效果要拉長距離',
      '閃哈系的藍色偏紫色調，和UC/SEED系的藍不同',
      '飛行單元的金屬質感是重要加分項',
      '大面積白色裝甲分區噴塗，每片都要有獨立的明暗'
    ]
  },

  // ============================================
  // 壽屋 - 萊丹 Raiden (Armored Core)
  // ============================================
  {
    id: 'ac-raiden',
    kitName: '萊丹',
    kitNameEn: 'Armored Core Raiden',
    brand: 'kotobukiya',
    grade: 'OTHER',
    series: 'AC',
    description: '壽屋AC系列重裝機體，全機偏暗色系軍武風格',
    zones: [
      {
        zone: '主裝甲（暗灰）',
        description: '全機主要裝甲',
        baseColor: 'm570',
        shadowColor: { paintIds: ['m570', 'm002'], ratios: [6, 4], note: '暗灰+大比例正黑' },
        highlightColor: 'm063',
        technique: '暗灰底，壓黑做陰影，提中灰做邊緣高光'
      },
      {
        zone: '輔助裝甲（橄欖綠）',
        description: '部分裝甲橄欖綠區域',
        baseColor: 'm571',
        shadowColor: { paintIds: ['m571', 'm002'], ratios: [7, 3], note: '橄欖綠+正黑' },
        highlightColor: { paintIds: ['m571', 'm005'], ratios: [8, 2], note: '橄欖綠+正黃提亮' },
        technique: '橄欖綠底色，暗面壓暗綠，高光帶黃綠'
      },
      {
        zone: '金屬骨架/關節',
        description: '關節、內構',
        baseColor: 'mx11',
        shadowColor: { paintIds: ['mx11', 'm002'], ratios: [7, 3], note: '槍鐵+正黑' },
        highlightColor: 'mx03',
        technique: '槍鐵底色（比一般鋼彈更暗），暗面壓黑，提銀'
      },
      {
        zone: '武器',
        description: '武器系統',
        baseColor: 'mx02',
        shadowColor: 'mx11',
        highlightColor: 't023',
        technique: '機械鐵底色，暗面槍鐵，高光啞鋁色做金屬磨損感'
      }
    ],
    workflow: [
      { order: 1, phase: '拆件分色', phaseEn: 'Disassemble & Sort', icon: '🔧', description: '素組確認後依色群拆件：暗灰主裝甲/橄欖綠裝甲/金屬骨架關節/武器系統，共四組分別上竹籤', paintIds: [], tool: '斜口鉗、筆刀、竹籤、夾具', dryTime: '-' },
      { order: 2, phase: '表面處理', phaseEn: 'Surface Prep', icon: '🪄', description: '打磨水口與合模線（400→600→800號砂紙），AC系列零件厚實但合模線明顯需仔細處理', paintIds: [], tool: '砂紙 400/600/800、海綿砂', dryTime: '自然乾 30 分鐘' },
      { order: 3, phase: '底漆打底', phaseEn: 'Primer', icon: '🎯', description: '全件用黑色底漆（暗色系機體用黑底可增強陰影深度與金屬漆效果）', paintIds: ['mk11'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '硝基漆 30-60 分鐘' },
      { order: 4, phase: '預陰影', phaseEn: 'Pre-Shading', icon: '🌑', description: '暗色系預陰影用黑底直接保留即可，在裝甲中央噴灰白做反向預陰影（暗色上用亮色做中心提亮）', paintIds: ['m002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '15-20 分鐘' },
      { order: 5, phase: '暗灰主裝甲底色', phaseEn: 'Dark Gray Armor Base', icon: '⬛', description: '暗灰（M-570）薄噴 2-3 層，保留黑底透出的深色漸層', paintIds: ['m570'], tool: '噴筆 0.3mm、氣壓 0.12MPa', dryTime: '每層間隔 10 分鐘，完成後 30 分鐘' },
      { order: 6, phase: '暗灰陰影強化', phaseEn: 'Dark Gray Shadow', icon: '🖤', description: '暗灰+大比例正黑（M-570:M-002=6:4）在凹面與邊緣噴重陰影', paintIds: ['m570', 'm002'], tool: '噴筆 0.2mm、氣壓 0.08MPa', dryTime: '20 分鐘' },
      { order: 7, phase: '暗灰高光', phaseEn: 'Dark Gray Highlight', icon: '◻️', description: '中灰（M-063）在裝甲邊緣凸面噴高光提亮，低明度下的層次變化', paintIds: ['m063'], tool: '噴筆 0.3mm、極少量', dryTime: '20 分鐘' },
      { order: 8, phase: '橄欖綠裝甲', phaseEn: 'Olive Green Armor', icon: '🟢', description: '橄欖綠（M-571）底色，暗面用橄欖綠+正黑（M-571:M-002=7:3）壓暗，高光用橄欖綠+正黃提亮', paintIds: ['m571', 'm002', 'm005'], tool: '噴筆 0.3mm', dryTime: '每層 10 分鐘，完成 30 分鐘' },
      { order: 9, phase: '金屬骨架/關節', phaseEn: 'Metal Frame & Joints', icon: '⚙️', description: '槍鐵底色（MX-11，比一般鋼彈用更暗的金屬色），暗面混正黑壓更暗，凸面機械銀提亮', paintIds: ['mx11', 'm002', 'mx03'], tool: '噴筆 0.3mm + 扁頭筆刷（乾刷用）', dryTime: '30 分鐘' },
      { order: 10, phase: '武器上色', phaseEn: 'Weapon Painting', icon: '🔫', description: '機械鐵底色，暗面槍鐵壓暗，邊緣啞鋁色（T-023）提亮做金屬磨損感', paintIds: ['mx02', 'mx11', 't023'], tool: '噴筆 0.3mm + 扁頭筆刷', dryTime: '30 分鐘' },
      { order: 11, phase: '舊化/磨損效果', phaseEn: 'Weathering & Chipping', icon: '💀', description: '全機用海綿沾銀色與淺灰做裝甲磨損剝落效果，邊緣與凸角重點處理；可在關節處加機械油漬', paintIds: ['mx03', 'm063'], tool: '海綿、扁頭乾刷筆、舊化液', dryTime: '20 分鐘' },
      { order: 12, phase: '鏽蝕效果（選用）', phaseEn: 'Rust Effects (Optional)', icon: '🟤', description: '選用步驟：在裝甲接縫與下方用少量棕色做鏽蝕流痕效果，增加AC系列的戰場真實感', paintIds: ['m570', 'm002'], tool: '極細毛筆、棕色舊化液', dryTime: '15 分鐘' },
      { order: 13, phase: '光澤透明漆', phaseEn: 'Gloss Coat', icon: '💎', description: '全件噴亮光透明漆做墨線前保護層', paintIds: ['m007'], tool: '噴筆 0.3mm', dryTime: '2-4 小時完全硬化' },
      { order: 14, phase: '墨線滲入', phaseEn: 'Panel Lining', icon: '✒️', description: '暗灰用黑色墨線、橄欖綠用深棕色墨線；AC系列墨線可稍粗增加軍武感', paintIds: [], tool: '滲線筆、油性墨線液', dryTime: '10 分鐘後擦拭多餘' },
      { order: 15, phase: '水貼', phaseEn: 'Decals', icon: '🏷️', description: '水貼浸水 30 秒軟化劑貼合，AC系列可加軍事風格水貼增加細節', paintIds: [], tool: '鑷子、棉棒、水貼軟化劑', dryTime: '水貼乾燥 2 小時' },
      { order: 16, phase: '最終保護漆', phaseEn: 'Final Flat Coat', icon: '🛡️', description: '全機噴超級消光透明漆，AC系列標配全消光統一軍武質感', paintIds: ['t043'], tool: '噴筆 0.3mm、氣壓 0.15MPa', dryTime: '24 小時完全硬化' },
      { order: 17, phase: '組裝完成', phaseEn: 'Final Assembly', icon: '🏆', description: '確認漆面硬化後組裝，重裝機體需確認關節強度與武器持握', paintIds: [], tool: '尖嘴鉗、矽油', dryTime: '-' },
    ],
    clearCoat: 't043',
    tips: [
      'AC系列整體偏暗色，超合繪的重點在低明度的層次變化',
      '可以加入少量棕色做鏽蝕效果',
      '武器部分多用乾刷技法強調金屬磨損',
      '消光透明漆是AC系列的標配'
    ]
  }
];

export function getSchemeById(id: string): ChogokinScheme | undefined {
  return kitSchemes.find(s => s.id === id);
}

export function getSchemesByBrand(brand: KitBrand): ChogokinScheme[] {
  return kitSchemes.filter(s => s.brand === brand);
}

export function getSchemesBySeries(series: KitSeries): ChogokinScheme[] {
  return kitSchemes.filter(s => s.series === series);
}
