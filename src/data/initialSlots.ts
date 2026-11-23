import type { SlotItem } from '../types/kiosk';

const encodeSvg = (svg: string): string =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  A1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#F0F9FF"/>
      <rect x="26" y="38" width="108" height="44" rx="22" fill="#FDE68A" stroke="#D97706" stroke-width="3.5"/>
      <rect x="58" y="42" width="44" height="36" rx="6" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2.5"/>
      <circle cx="42" cy="54" r="3" fill="#B45309"/><circle cx="42" cy="66" r="3" fill="#B45309"/>
      <circle cx="118" cy="54" r="3" fill="#B45309"/><circle cx="118" cy="66" r="3" fill="#B45309"/>
    </svg>`
  ),
  A2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#F0F9FF"/>
      <rect x="44" y="20" width="72" height="80" rx="14" fill="#E0F2FE" stroke="#0284C7" stroke-width="3.5"/>
      <circle cx="65" cy="43" r="10" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
      <circle cx="95" cy="43" r="10" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
      <circle cx="65" cy="75" r="10" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
      <circle cx="95" cy="75" r="10" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
    </svg>`
  ),
  A3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#FFF1F2"/>
      <path d="M58 18C58 13 67 11 80 11C93 11 102 13 102 18L105 42L120 60L105 78L102 102C102 107 93 109 80 109C67 109 58 107 58 102L55 78L40 60L55 42L58 18Z" fill="#FFE4E6" stroke="#F43F5E" stroke-width="3.5"/>
      <rect x="68" y="30" width="24" height="60" rx="12" fill="#FECDD3" stroke="#FB7185" stroke-width="2.5"/>
    </svg>`
  ),
  B1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#F0F9FF"/>
      <rect x="34" y="36" width="92" height="48" rx="24" fill="#CCFBF1" stroke="#0D9488" stroke-width="3.5"/>
      <path d="M80 36H102C115.255 36 126 46.745 126 60C126 73.255 115.255 84 102 84H80V36Z" fill="#0D9488" fill-opacity="0.25"/>
      <line x1="80" y1="36" x2="80" y2="84" stroke="#0D9488" stroke-width="3"/>
    </svg>`
  ),
  B2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#F0F9FF"/>
      <rect x="34" y="36" width="92" height="48" rx="24" fill="#FEF3C7" stroke="#0D9488" stroke-width="3.5"/>
      <line x1="80" y1="42" x2="80" y2="78" stroke="#0D9488" stroke-width="3" stroke-dasharray="5 4"/>
      <circle cx="58" cy="60" r="7" fill="#0D9488"/>
      <circle cx="102" cy="60" r="7" fill="#F59E0B"/>
    </svg>`
  ),
  B3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#ECFDF5"/>
      <circle cx="80" cy="60" r="38" fill="#D1FAE5" stroke="#10B981" stroke-width="3.5"/>
      <path d="M80 34C96 38 100 56 80 86C60 56 64 38 80 34Z" fill="#34D399" stroke="#059669" stroke-width="3"/>
      <line x1="80" y1="42" x2="80" y2="80" stroke="#065F46" stroke-width="2.5"/>
    </svg>`
  ),
  C1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#F0F9FF"/>
      <rect x="38" y="40" width="84" height="40" rx="20" fill="#FFFFFF" stroke="#0284C7" stroke-width="3.5"/>
      <path d="M80 40H102C113.046 40 122 48.954 122 60C122 71.046 113.046 80 102 80H80V40Z" fill="#38BDF8"/>
    </svg>`
  ),
  C2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#FFF1F2"/>
      <rect x="54" y="16" width="52" height="88" rx="26" fill="#FFE4E6" stroke="#F43F5E" stroke-width="3.5"/>
      <rect x="66" y="28" width="28" height="64" rx="14" fill="#FECDD3" stroke="#FB7185" stroke-width="2.5"/>
    </svg>`
  ),
  C3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
      <rect width="160" height="120" rx="16" fill="#FFF1F2"/>
      <path d="M56 30H104L95 74C93.5 82 88 88 80 88C72 88 66.5 82 65 74L56 30Z" fill="#FFE4E6" stroke="#F43F5E" stroke-width="3.5"/>
      <ellipse cx="80" cy="30" rx="24" ry="7" fill="#FECDD3" stroke="#F43F5E" stroke-width="3.5"/>
      <line x1="80" y1="88" x2="80" y2="104" stroke="#F43F5E" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`
  ),
};

export function getFallbackProductImage(slotCode: string): string {
  return PRODUCT_FALLBACK_IMAGES[slotCode] ?? PRODUCT_FALLBACK_IMAGES.A1;
}

export const INITIAL_SLOTS: SlotItem[] = [
  {
    id: 'local-a1',
    slot_code: 'A1',
    name: 'Band-Aid',
    category: 'First Aid',
    unit_label: 'Per strip',
    price: 5.0,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/band-aid.jpg',
    sort_order: 1,
  },
  {
    id: 'local-a2',
    slot_code: 'A2',
    name: 'Cetirizine (10mg)',
    category: 'Medicine',
    unit_label: 'Per tablet',
    price: 15.0,
    stock: 12,
    default_stock: 12,
    image_url: '/images/products/cetirizine.jpg',
    sort_order: 2,
  },
  {
    id: 'local-a3',
    slot_code: 'A3',
    name: 'Reusable Pad',
    category: 'Hygiene',
    unit_label: 'Per piece',
    price: 120.0,
    stock: 8,
    default_stock: 8,
    image_url: '/images/products/reusable-pad.jpg',
    sort_order: 3,
  },
  {
    id: 'local-b1',
    slot_code: 'B1',
    name: 'Neozep Z+',
    category: 'Medicine',
    unit_label: 'Per tablet',
    price: 9.0,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/neozep.jpg',
    sort_order: 4,
  },
  {
    id: 'local-b2',
    slot_code: 'B2',
    name: 'Biogesic (500mg)',
    category: 'Medicine',
    unit_label: 'Per tablet',
    price: 6.0,
    stock: 20,
    default_stock: 20,
    image_url: '/images/products/biogesic.jpg',
    sort_order: 5,
  },
  {
    id: 'local-b3',
    slot_code: 'B3',
    name: 'Ascof Forte (600mg)',
    category: 'Medicine',
    unit_label: 'Per tablet',
    price: 9.0,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/ascof-forte.jpg',
    sort_order: 6,
  },
  {
    id: 'local-c1',
    slot_code: 'C1',
    name: 'Diatabs (2mg)',
    category: 'Medicine',
    unit_label: 'Per capsule',
    price: 10.0,
    stock: 12,
    default_stock: 12,
    image_url: '/images/products/diatabs.jpg',
    sort_order: 7,
  },
  {
    id: 'local-c2',
    slot_code: 'C2',
    name: 'Modess Napkin',
    category: 'Hygiene',
    unit_label: 'Per single pad',
    price: 8.0,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/modess-napkin.jpg',
    sort_order: 8,
  },
  {
    id: 'local-c3',
    slot_code: 'C3',
    name: 'Menstrual Cup',
    category: 'Hygiene',
    unit_label: 'Per piece',
    price: 350.0,
    stock: 5,
    default_stock: 5,
    image_url: '/images/products/menstrual-cup.jpg',
    sort_order: 9,
  },
];

export function formatPHP(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}
