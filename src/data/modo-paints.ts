export type PaintFinish = 'gloss' | 'matte' | 'semi-gloss' | 'metallic' | 'pearl' | 'fluorescent' | 'transparent' | 'chameleon' | 'chrome';
export type PaintType = 'lacquer' | 'water-based';
export type PaintSeries = 'M' | 'MX' | 'T' | 'MK' | 'D' | 'C' | 'A' | 'AX' | 'AF' | 'AK';

export interface ModoPaint {
  id: string;
  code: string;
  nameZh: string;
  nameEn: string;
  hex: string;
  series: PaintSeries;
  finish: PaintFinish;
  type: PaintType;
  opacity: 'opaque' | 'semi-opaque' | 'transparent';
  volume: number;
  tags: string[];
}

export const modoPaints: ModoPaint[] = [
  // ============================================
  // M 系列 - 基本色 (Basic Colors)
  // ============================================
  { id: 'm001', code: 'M-001', nameZh: '正白', nameEn: 'Pure White', hex: '#FFFFFF', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '白'] },
  { id: 'm002', code: 'M-002', nameZh: '正黑', nameEn: 'Pure Black', hex: '#1A1A1A', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '黑'] },
  { id: 'm003', code: 'M-003', nameZh: '正紅', nameEn: 'Pure Red', hex: '#E31E24', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '紅'] },
  { id: 'm004', code: 'M-004', nameZh: '寶藍', nameEn: 'Royal Blue', hex: '#1B3F8B', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '藍'] },
  { id: 'm005', code: 'M-005', nameZh: '正黃', nameEn: 'Pure Yellow', hex: '#FFD700', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '黃'] },
  { id: 'm006', code: 'M-006', nameZh: '消光添加劑', nameEn: 'Flat Additive', hex: '#F0F0F0', series: 'M', finish: 'matte', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['添加劑', '消光'] },
  { id: 'm007', code: 'M-007', nameZh: '透明亮光', nameEn: 'Gloss Clear', hex: '#FAFAFA', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明漆', '亮光'] },
  { id: 'm008', code: 'M-008', nameZh: '消光透明', nameEn: 'Flat Clear', hex: '#F5F5F5', series: 'M', finish: 'matte', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明漆', '消光'] },
  { id: 'm011', code: 'M-011', nameZh: '消光白', nameEn: 'Flat White', hex: '#F8F8F8', series: 'M', finish: 'matte', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '白', '消光'] },
  { id: 'm012', code: 'M-012', nameZh: '消光黑', nameEn: 'Flat Black', hex: '#222222', series: 'M', finish: 'matte', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '黑', '消光'] },
  { id: 'm013', code: 'M-013', nameZh: '森綠', nameEn: 'Forest Green', hex: '#2D6A4F', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '綠'] },
  { id: 'm014', code: 'M-014', nameZh: '棕', nameEn: 'Brown', hex: '#7B4B2A', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '棕'] },
  { id: 'm015', code: 'M-015', nameZh: '正橘', nameEn: 'Pure Orange', hex: '#FF6B1A', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '橘'] },
  { id: 'm016', code: 'M-016', nameZh: '草綠', nameEn: 'Grass Green', hex: '#5BA84B', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '綠'] },
  { id: 'm017', code: 'M-017', nameZh: '艷紫', nameEn: 'Vivid Purple', hex: '#7B2D8E', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '紫'] },
  { id: 'm018', code: 'M-018', nameZh: '黃綠', nameEn: 'Yellow Green', hex: '#A4C639', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '綠', '黃'] },
  { id: 'm019', code: 'M-019', nameZh: '紫羅蘭', nameEn: 'Violet', hex: '#6A0DAD', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '紫'] },
  { id: 'm020', code: 'M-020', nameZh: '桃紅', nameEn: 'Peach Red', hex: '#FF1493', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '紅', '粉'] },
  { id: 'm021', code: 'M-021', nameZh: '粉紅', nameEn: 'Pink', hex: '#FFB6C1', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '粉'] },
  { id: 'm022', code: 'M-022', nameZh: '胭脂紅', nameEn: 'Carmine Red', hex: '#C41E3A', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '紅'] },
  { id: 'm025', code: 'M-025', nameZh: '橙黃', nameEn: 'Orange Yellow', hex: '#FFB347', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '橘', '黃'] },
  { id: 'm026', code: 'M-026', nameZh: '藍綠', nameEn: 'Teal', hex: '#008080', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '藍', '綠'] },
  { id: 'm027', code: 'M-027', nameZh: '深藍', nameEn: 'Deep Blue', hex: '#00308F', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '藍'] },
  { id: 'm030', code: 'M-030', nameZh: '半光澤透明', nameEn: 'Semi-Gloss Clear', hex: '#F7F7F7', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明漆', '半光澤'] },
  { id: 'm031', code: 'M-031', nameZh: '超級義大利紅', nameEn: 'Super Italian Red', hex: '#CC0000', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '紅'] },
  { id: 'm052', code: 'M-052', nameZh: '天空藍', nameEn: 'Sky Blue', hex: '#87CEEB', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '藍'] },
  { id: 'm066', code: 'M-066', nameZh: '摩多藍', nameEn: 'Modo Blue', hex: '#0047AB', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['基本色', '藍', '招牌色'] },

  // ============================================
  // M 系列 - 透明色 (Clear / Transparent Colors)
  // ============================================
  { id: 'm041', code: 'M-041', nameZh: '透明紅', nameEn: 'Clear Red', hex: '#E3242B', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明色', '紅'] },
  { id: 'm042', code: 'M-042', nameZh: '透明橙', nameEn: 'Clear Orange', hex: '#FF8C00', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明色', '橘'] },
  { id: 'm044', code: 'M-044', nameZh: '透明天藍', nameEn: 'Clear Sky Blue', hex: '#4FC3F7', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明色', '藍'] },
  { id: 'm045', code: 'M-045', nameZh: '透明黃', nameEn: 'Clear Yellow', hex: '#FFE44D', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明色', '黃'] },

  // ============================================
  // M 系列 - 灰階漸層色 (Gray Gradient)
  // ============================================
  { id: 'm061', code: 'M-061', nameZh: '機甲白', nameEn: 'Mecha White', hex: '#EAEAEA', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['灰階', '白', '機械色'] },
  { id: 'm062', code: 'M-062', nameZh: '淺灰', nameEn: 'Light Gray', hex: '#C0C0C0', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['灰階', '灰', '機械色'] },
  { id: 'm063', code: 'M-063', nameZh: '中灰', nameEn: 'Medium Gray', hex: '#909090', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['灰階', '灰', '機械色'] },
  { id: 'm064', code: 'M-064', nameZh: '深灰', nameEn: 'Dark Gray', hex: '#606060', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['灰階', '灰', '機械色', '骨架'] },
  { id: 'm065', code: 'M-065', nameZh: '暗灰', nameEn: 'Dim Gray', hex: '#404040', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['灰階', '灰', '機械色', '骨架'] },

  // ============================================
  // M 系列 - 螢光色 (Fluorescent Colors)
  // ============================================
  { id: 'm090', code: 'M-090', nameZh: '螢光桃紅', nameEn: 'Fluorescent Peach', hex: '#FF69B4', series: 'M', finish: 'fluorescent', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['螢光色', '粉', '紅'] },
  { id: 'm091', code: 'M-091', nameZh: '螢光紅', nameEn: 'Fluorescent Red', hex: '#FF3131', series: 'M', finish: 'fluorescent', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['螢光色', '紅'] },
  { id: 'm092', code: 'M-092', nameZh: '螢光橘', nameEn: 'Fluorescent Orange', hex: '#FF5F15', series: 'M', finish: 'fluorescent', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['螢光色', '橘'] },
  { id: 'm093', code: 'M-093', nameZh: '螢光黃', nameEn: 'Fluorescent Yellow', hex: '#DFFF00', series: 'M', finish: 'fluorescent', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['螢光色', '黃'] },
  { id: 'm094', code: 'M-094', nameZh: '螢光綠', nameEn: 'Fluorescent Green', hex: '#39FF14', series: 'M', finish: 'fluorescent', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['螢光色', '綠'] },

  // ============================================
  // M 系列 - 軍武/特殊色 (Military & Special)
  // ============================================
  { id: 'm201', code: 'M-201', nameZh: '皇家白', nameEn: 'Royal White', hex: '#F5F0E8', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '白'] },
  { id: 'm202', code: 'M-202', nameZh: '子夜黑', nameEn: 'Midnight Black', hex: '#0D0D0D', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '黑'] },
  { id: 'm203', code: 'M-203', nameZh: '血紅', nameEn: 'Blood Red', hex: '#8B0000', series: 'M', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '紅'] },
  { id: 'm570', code: 'M-570', nameZh: '暗灰', nameEn: 'Military Dark Gray', hex: '#4A4A4A', series: 'M', finish: 'matte', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['軍武色', '灰'] },
  { id: 'm571', code: 'M-571', nameZh: '橄欖綠', nameEn: 'Olive Green', hex: '#556B2F', series: 'M', finish: 'matte', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['軍武色', '綠'] },
  { id: 'm572', code: 'M-572', nameZh: '巧克力棕', nameEn: 'Chocolate Brown', hex: '#5C3317', series: 'M', finish: 'matte', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['軍武色', '棕'] },

  // ============================================
  // M 系列 - 少女膚色 (Girl's Skin Colors)
  // ============================================
  { id: 'm101', code: 'M-101', nameZh: '膚色基本', nameEn: 'Base Skin', hex: '#FDDBB8', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['膚色', '美少女'] },
  { id: 'm102', code: 'M-102', nameZh: '膚色陰影', nameEn: 'Skin Shadow', hex: '#E8B88A', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['膚色', '美少女', '陰影'] },
  { id: 'm103', code: 'M-103', nameZh: '膚色高光', nameEn: 'Skin Highlight', hex: '#FFF0DB', series: 'M', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['膚色', '美少女', '高光'] },

  // ============================================
  // M 系列 - 珠光色 (Pearl Colors)
  // ============================================
  { id: 'm111', code: 'M-111', nameZh: '珠光白', nameEn: 'Pearl White', hex: '#F8F6F0', series: 'M', finish: 'pearl', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['珠光色', '白'] },
  { id: 'm112', code: 'M-112', nameZh: '珠光紅', nameEn: 'Pearl Red', hex: '#E84040', series: 'M', finish: 'pearl', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['珠光色', '紅'] },
  { id: 'm113', code: 'M-113', nameZh: '珠光藍', nameEn: 'Pearl Blue', hex: '#4169E1', series: 'M', finish: 'pearl', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['珠光色', '藍'] },
  { id: 'm114', code: 'M-114', nameZh: '珠光金', nameEn: 'Pearl Gold', hex: '#DAA520', series: 'M', finish: 'pearl', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['珠光色', '金'] },

  // ============================================
  // MX 系列 - 金屬色 (Metallic Colors)
  // ============================================
  { id: 'mx01', code: 'MX-01', nameZh: '金色', nameEn: 'Gold', hex: '#D4AF37', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '金'] },
  { id: 'mx02', code: 'MX-02', nameZh: '機械鐵', nameEn: 'Robot Iron', hex: '#5A5A5A', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '鐵', '機械'] },
  { id: 'mx03', code: 'MX-03', nameZh: '機械銀', nameEn: 'Robot Silver', hex: '#B0B0B0', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '銀', '機械'] },
  { id: 'mx05', code: 'MX-05', nameZh: '機械金', nameEn: 'Robot Gold', hex: '#C5A54E', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '金', '機械'] },
  { id: 'mx06', code: 'MX-06', nameZh: '赤金', nameEn: 'Pure Gold', hex: '#E8B830', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '金'] },
  { id: 'mx07', code: 'MX-07', nameZh: '青金', nameEn: 'Bronze Gold', hex: '#B8860B', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '金', '青銅'] },
  { id: 'mx08', code: 'MX-08', nameZh: '香檳金', nameEn: 'Champagne Gold', hex: '#F7E7CE', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '金', '香檳'] },
  { id: 'mx09', code: 'MX-09', nameZh: '玫瑰金', nameEn: 'Rose Gold', hex: '#B76E79', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '金', '玫瑰'] },
  { id: 'mx10', code: 'MX-10', nameZh: '亮銀', nameEn: 'Bright Silver', hex: '#D0D0D0', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '銀'] },
  { id: 'mx11', code: 'MX-11', nameZh: '槍鐵', nameEn: 'Gun Metal', hex: '#3C3C3C', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '鐵', '槍'] },
  { id: 'mx12', code: 'MX-12', nameZh: '星光鋁', nameEn: 'Star Aluminium', hex: '#A8A9AD', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色', '鋁', '銀'] },

  // MX 系列 - 金屬色源 Astro Lab
  { id: 'mx41', code: 'MX-41', nameZh: '色源紅', nameEn: 'Metal Source Red', hex: '#CC3333', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色源', '紅'] },
  { id: 'mx42', code: 'MX-42', nameZh: '色源銅紅', nameEn: 'Metal Source Copper Red', hex: '#CC6644', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色源', '銅', '紅'] },
  { id: 'mx43', code: 'MX-43', nameZh: '色源橙', nameEn: 'Metal Source Orange', hex: '#DD7722', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色源', '橘'] },
  { id: 'mx44', code: 'MX-44', nameZh: '色源藍', nameEn: 'Metal Source Blue', hex: '#3355AA', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色源', '藍'] },
  { id: 'mx45', code: 'MX-45', nameZh: '色源黃', nameEn: 'Metal Source Yellow', hex: '#DDAA22', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色源', '黃'] },
  { id: 'mx47', code: 'MX-47', nameZh: '色源檸檬黃', nameEn: 'Metal Source Lemon Yellow', hex: '#E8D44D', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色源', '黃'] },
  { id: 'mx48', code: 'MX-48', nameZh: '色源土耳其藍', nameEn: 'Metal Source Turquoise', hex: '#40A4A0', series: 'MX', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬色源', '藍', '綠'] },

  // ============================================
  // T 系列 - 特效/最佳化 (Special Effects)
  // ============================================
  { id: 't009', code: 'T-009', nameZh: 'ZERO 極細金屬銀', nameEn: 'Zero Ultra-Fine Metal Silver', hex: '#C8C8C8', series: 'T', finish: 'chrome', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['ZERO', '金屬', '銀', '極細'] },
  { id: 't010', code: 'T-010', nameZh: 'ZERO 極細金屬金', nameEn: 'Zero Ultra-Fine Metal Gold', hex: '#D4A843', series: 'T', finish: 'chrome', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['ZERO', '金屬', '金', '極細'] },
  { id: 't023', code: 'T-023', nameZh: '引擎啞鋁色', nameEn: 'Engine Matte Aluminium', hex: '#8E8E8E', series: 'T', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬質感', '鋁', '引擎'] },
  { id: 't024', code: 'T-024', nameZh: '盔甲鐵色', nameEn: 'Armor Iron', hex: '#4E4E4E', series: 'T', finish: 'metallic', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['金屬質感', '鐵', '盔甲'] },
  { id: 't043', code: 'T-043', nameZh: '超級消光透明', nameEn: 'Super Flat Clear', hex: '#F2F2F2', series: 'T', finish: 'matte', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['透明漆', '超級消光'] },
  { id: 't046', code: 'T-046', nameZh: '煙燻特效', nameEn: 'Smoke Effect', hex: '#696969', series: 'T', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 30, tags: ['特效', '煙燻'] },
  { id: 't051', code: 'T-051', nameZh: '初音綠', nameEn: 'Miku Green', hex: '#39C5BB', series: 'T', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '綠', '初音'] },
  { id: 't052', code: 'T-052', nameZh: '天空藍', nameEn: 'Sky Blue', hex: '#6EC6E6', series: 'T', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '藍'] },
  { id: 't053', code: 'T-053', nameZh: '輕紅', nameEn: 'Light Red', hex: '#FF7F7F', series: 'T', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '紅'] },
  { id: 't054', code: 'T-054', nameZh: '橘黃', nameEn: 'Orange Yellow', hex: '#FFA347', series: 'T', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '橘', '黃'] },
  { id: 't055', code: 'T-055', nameZh: '玄藍', nameEn: 'Deep Mysterious Blue', hex: '#2A3D66', series: 'T', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['特殊色', '藍'] },
  { id: 't061', code: 'T-061', nameZh: '灰白1級', nameEn: 'Gray White Lv.1', hex: '#E8E8E8', series: 'T', finish: 'semi-gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['灰階', '白'] },

  // ============================================
  // MK 系列 - 偏光/變色龍 (Chameleon / Polarize)
  // ============================================
  { id: 'mk11', code: 'MK-11', nameZh: '底漆補土灰', nameEn: 'Primer Putty Grey', hex: '#808080', series: 'MK', finish: 'matte', type: 'lacquer', opacity: 'opaque', volume: 50, tags: ['底漆', '補土', '灰'] },
  { id: 'mk15', code: 'MK-15', nameZh: '極光紅', nameEn: 'Aurora Red', hex: '#FF2255', series: 'MK', finish: 'chameleon', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['偏光', '極光', '紅'] },
  { id: 'mk16', code: 'MK-16', nameZh: '極光藍', nameEn: 'Aurora Blue', hex: '#2255FF', series: 'MK', finish: 'chameleon', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['偏光', '極光', '藍'] },
  { id: 'mk17', code: 'MK-17', nameZh: '極光紫', nameEn: 'Aurora Purple', hex: '#7722FF', series: 'MK', finish: 'chameleon', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['偏光', '極光', '紫'] },
  { id: 'mk19', code: 'MK-19', nameZh: '底漆補土紫', nameEn: 'Primer Putty Purple', hex: '#6B4C8A', series: 'MK', finish: 'matte', type: 'lacquer', opacity: 'opaque', volume: 50, tags: ['底漆', '補土', '紫'] },
  { id: 'mk35', code: 'MK-35', nameZh: '魔光紅', nameEn: 'Magic Light Red', hex: '#FF1144', series: 'MK', finish: 'chameleon', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['魔光', '變色龍', '紅'] },
  { id: 'mk36', code: 'MK-36', nameZh: '魔光藍', nameEn: 'Magic Light Blue', hex: '#1144FF', series: 'MK', finish: 'chameleon', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['魔光', '變色龍', '藍'] },
  { id: 'mk37', code: 'MK-37', nameZh: '魔光黃', nameEn: 'Magic Light Yellow', hex: '#FFDD11', series: 'MK', finish: 'chameleon', type: 'lacquer', opacity: 'semi-opaque', volume: 30, tags: ['魔光', '變色龍', '黃'] },

  // ============================================
  // D 系列 - 溶劑/稀釋液 (Solvents & Thinners)
  // ============================================
  { id: 'd01', code: 'D-01', nameZh: '標準稀釋液', nameEn: 'Standard Thinner', hex: '#FAFAFA', series: 'D', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 50, tags: ['溶劑', '稀釋液'] },
  { id: 'd04', code: 'D-04', nameZh: '噴筆清洗液', nameEn: 'Airbrush Cleaner', hex: '#FAFAFA', series: 'D', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 50, tags: ['溶劑', '清洗'] },
  { id: 'd06', code: 'D-06', nameZh: '緩乾稀釋液', nameEn: 'Slow-Dry Thinner', hex: '#FAFAFA', series: 'D', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 50, tags: ['溶劑', '緩乾'] },
  { id: 'd09', code: 'D-09', nameZh: '金屬色專用溶劑', nameEn: 'Metallic Solvent', hex: '#FAFAFA', series: 'D', finish: 'gloss', type: 'lacquer', opacity: 'transparent', volume: 50, tags: ['溶劑', '金屬色'] },

  // ============================================
  // 超合繪 Super Chrome 系列
  // ============================================
  { id: 'sc01', code: 'SC-01', nameZh: '究極黑', nameEn: 'Ultimate Black', hex: '#050505', series: 'T', finish: 'gloss', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['超合繪', '電鍍', '黑'] },
  { id: 'sc02', code: 'SC-02', nameZh: '銀角', nameEn: 'Silver Horn', hex: '#E0E0E0', series: 'T', finish: 'chrome', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['超合繪', '電鍍', '銀'] },
  { id: 'sc03', code: 'SC-03', nameZh: '金角', nameEn: 'Gold Horn', hex: '#DAA520', series: 'T', finish: 'chrome', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['超合繪', '電鍍', '金'] },
  { id: 'sc04', code: 'SC-04', nameZh: '赤角', nameEn: 'Red Horn', hex: '#CC2222', series: 'T', finish: 'chrome', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['超合繪', '電鍍', '紅'] },
  { id: 'sc05', code: 'SC-05', nameZh: '青角', nameEn: 'Blue Horn', hex: '#2244BB', series: 'T', finish: 'chrome', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['超合繪', '電鍍', '藍'] },
];

export function getPaintById(id: string): ModoPaint | undefined {
  return modoPaints.find(p => p.id === id);
}

export function getPaintsByIds(ids: string[]): ModoPaint[] {
  return ids.map(id => modoPaints.find(p => p.id === id)).filter((p): p is ModoPaint => p !== undefined);
}

export function getPaintsBySeries(series: PaintSeries): ModoPaint[] {
  return modoPaints.filter(p => p.series === series);
}

export function searchPaints(query: string): ModoPaint[] {
  const q = query.toLowerCase();
  return modoPaints.filter(p =>
    p.code.toLowerCase().includes(q) ||
    p.nameZh.includes(q) ||
    p.nameEn.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q))
  );
}

export const seriesInfo: Record<PaintSeries, { nameZh: string; nameEn: string; description: string }> = {
  M: { nameZh: 'M 基本色系列', nameEn: 'M Basic Series', description: '硝基漆基本色，高飽和度、高遮蓋力' },
  MX: { nameZh: 'MX 金屬色系列', nameEn: 'MX Metallic Series', description: 'DualParticle 雙粒子配方金屬漆' },
  T: { nameZh: 'T 特效系列', nameEn: 'T Special Effects', description: 'ZERO極細金屬色、特效漆、最佳化配方' },
  MK: { nameZh: 'MK 底漆/偏光系列', nameEn: 'MK Primer & Chameleon', description: '底漆補土、極光偏光變色漆' },
  D: { nameZh: 'D 溶劑系列', nameEn: 'D Solvents', description: '稀釋液、清洗液、緩乾劑' },
  C: { nameZh: 'C 套色/工具', nameEn: 'C Sets & Tools', description: '套色組合、工具配件' },
  A: { nameZh: 'A 水性基本色', nameEn: 'A Water-Based Basic', description: '水性壓克力基本色' },
  AX: { nameZh: 'AX 水性金屬色', nameEn: 'AX Water-Based Metallic', description: '水性壓克力金屬色' },
  AF: { nameZh: 'AF 水性螢光色', nameEn: 'AF Water-Based Fluorescent', description: '水性壓克力螢光色' },
  AK: { nameZh: 'AK 水性添加劑', nameEn: 'AK Water-Based Additive', description: '水性壓克力添加劑、底漆' },
};
