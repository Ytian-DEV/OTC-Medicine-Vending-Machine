import type { SlotItem } from '@/types/kiosk';

const encodeSvg = (svg: string): string =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

// Quiet, minimal neutral product illustrations shown until custom photos are placed in /public/images/products/
export const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  A1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <rect x="16" y="42" width="88" height="36" rx="18" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <rect x="42" y="46" width="36" height="28" rx="5" fill="#F5F5F4" stroke="#A1A1AA" stroke-width="1.75"/>
      <circle cx="30" cy="56" r="2" fill="#71717A"/><circle cx="30" cy="64" r="2" fill="#71717A"/>
      <circle cx="90" cy="56" r="2" fill="#71717A"/><circle cx="90" cy="64" r="2" fill="#71717A"/>
    </svg>`
  ),
  A2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <rect x="28" y="24" width="64" height="72" rx="12" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <circle cx="47" cy="46" r="9" fill="#F5F5F4" stroke="#71717A" stroke-width="2"/>
      <circle cx="73" cy="46" r="9" fill="#F5F5F4" stroke="#71717A" stroke-width="2"/>
      <circle cx="47" cy="74" r="9" fill="#F5F5F4" stroke="#71717A" stroke-width="2"/>
      <circle cx="73" cy="74" r="9" fill="#F5F5F4" stroke="#71717A" stroke-width="2"/>
    </svg>`
  ),
  A3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <path d="M42 20C42 16 50 14 60 14C70 14 78 16 78 20L80 42L94 60L80 78L78 100C78 104 70 106 60 106C50 106 42 104 42 100L40 78L26 60L40 42L42 20Z" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <rect x="50" y="34" width="20" height="52" rx="10" fill="#F5F5F4" stroke="#A1A1AA" stroke-width="1.75"/>
    </svg>`
  ),
  B1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <rect x="20" y="38" width="80" height="44" rx="22" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <path d="M60 38H78C90.15 38 100 47.85 100 60C100 72.15 90.15 82 78 82H60V38Z" fill="#E7E5E4"/>
      <line x1="60" y1="38" x2="60" y2="82" stroke="#52525B" stroke-width="2.5"/>
    </svg>`
  ),
  B2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <rect x="20" y="39" width="80" height="42" rx="21" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <line x1="60" y1="45" x2="60" y2="75" stroke="#A1A1AA" stroke-width="2" stroke-dasharray="4 4"/>
    </svg>`
  ),
  B3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="34" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <path d="M60 36C74 40 77 57 60 82C43 57 46 40 60 36Z" fill="#F5F5F4" stroke="#71717A" stroke-width="2"/>
      <line x1="60" y1="44" x2="60" y2="76" stroke="#71717A" stroke-width="1.75"/>
    </svg>`
  ),
  C1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <rect x="26" y="42" width="68" height="36" rx="18" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <path d="M60 42H76C85.94 42 94 50.06 94 60C94 69.94 85.94 78 76 78H60V42Z" fill="#F5F5F4" stroke="#52525B" stroke-width="2.5"/>
    </svg>`
  ),
  C2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <rect x="38" y="18" width="44" height="84" rx="22" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <rect x="48" y="30" width="24" height="60" rx="12" fill="#F5F5F4" stroke="#A1A1AA" stroke-width="1.75"/>
    </svg>`
  ),
  C3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <path d="M38 34H82L74 76C72.5 83 67 88 60 88C53 88 47.5 83 46 76L38 34Z" fill="#FFFFFF" stroke="#52525B" stroke-width="2.5"/>
      <ellipse cx="60" cy="34" rx="22" ry="6" fill="#F5F5F4" stroke="#52525B" stroke-width="2.5"/>
      <line x1="60" y1="88" x2="60" y2="104" stroke="#52525B" stroke-width="3" stroke-linecap="round"/>
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
    price: 5,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/band-aid.jpg',
    sort_order: 1,
  },
  {
    id: 'local-a2',
    slot_code: 'A2',
    name: 'Cetirizine',
    price: 15,
    stock: 12,
    default_stock: 12,
    image_url: '/images/products/cetirizine.jpg',
    sort_order: 2,
  },
  {
    id: 'local-a3',
    slot_code: 'A3',
    name: 'Reusable Pads',
    price: 120,
    stock: 8,
    default_stock: 8,
    image_url: '/images/products/reusable-pads.jpg',
    sort_order: 3,
  },
  {
    id: 'local-b1',
    slot_code: 'B1',
    name: 'Neozep',
    price: 9,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/neozep.jpg',
    sort_order: 4,
  },
  {
    id: 'local-b2',
    slot_code: 'B2',
    name: 'Biogesic',
    price: 6,
    stock: 20,
    default_stock: 20,
    image_url: '/images/products/biogesic.jpg',
    sort_order: 5,
  },
  {
    id: 'local-b3',
    slot_code: 'B3',
    name: 'Ascof Forte',
    price: 9,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/ascof-forte.jpg',
    sort_order: 6,
  },
  {
    id: 'local-c1',
    slot_code: 'C1',
    name: 'Diatabs',
    price: 10,
    stock: 12,
    default_stock: 12,
    image_url: '/images/products/diatabs.jpg',
    sort_order: 7,
  },
  {
    id: 'local-c2',
    slot_code: 'C2',
    name: 'Modess Napkin',
    price: 8,
    stock: 15,
    default_stock: 15,
    image_url: '/images/products/modess-napkin.jpg',
    sort_order: 8,
  },
  {
    id: 'local-c3',
    slot_code: 'C3',
    name: 'Menstrual Cup',
    price: 350,
    stock: 5,
    default_stock: 5,
    image_url: '/images/products/menstrual-cup.jpg',
    sort_order: 9,
  },
];

export function formatPHP(amount: number): string {
  return Number.isInteger(amount) ? `₱${amount}` : `₱${amount.toFixed(2)}`;
}
