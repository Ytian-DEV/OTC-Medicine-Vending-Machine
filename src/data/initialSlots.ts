import type { SlotItem } from '@/types/kiosk';

const encodeSvg = (svg: string): string =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

// Rich, studio-styled colorful product illustrations shown until custom photos are dropped into /public/images/products/
export const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  A1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="ba" x1="20" y1="42" x2="140" y2="98" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F2C894"/>
          <stop offset="1" stop-color="#DDA262"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="108" rx="48" ry="7" fill="#000" fill-opacity="0.06"/>
      <g transform="rotate(-12 80 68)">
        <rect x="18" y="44" width="124" height="48" rx="24" fill="url(#ba)" stroke="#C2813D" stroke-width="2"/>
        <rect x="54" y="48" width="52" height="40" rx="8" fill="#FFFDF7" stroke="#E5C08D" stroke-width="1.5"/>
        <rect x="60" y="54" width="40" height="28" rx="4" fill="#FEF3C7" fill-opacity="0.5"/>
        <circle cx="34" cy="58" r="2.2" fill="#B57535"/><circle cx="34" cy="68" r="2.2" fill="#B57535"/><circle cx="34" cy="78" r="2.2" fill="#B57535"/>
        <circle cx="44" cy="63" r="2.2" fill="#B57535"/><circle cx="44" cy="73" r="2.2" fill="#B57535"/>
        <circle cx="126" cy="58" r="2.2" fill="#B57535"/><circle cx="126" cy="68" r="2.2" fill="#B57535"/><circle cx="126" cy="78" r="2.2" fill="#B57535"/>
        <circle cx="116" cy="63" r="2.2" fill="#B57535"/><circle cx="116" cy="73" r="2.2" fill="#B57535"/>
      </g>
    </svg>`
  ),
  A2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="cet" x1="36" y1="20" x2="124" y2="112" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E0F2FE"/>
          <stop offset="1" stop-color="#BAE6FD"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="122" rx="38" ry="6" fill="#000" fill-opacity="0.06"/>
      <rect x="38" y="20" width="84" height="94" rx="14" fill="url(#cet)" stroke="#38BDF8" stroke-width="2"/>
      <rect x="44" y="26" width="72" height="12" rx="4" fill="#0284C7" fill-opacity="0.16"/>
      <circle cx="62" cy="56" r="13" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
      <path d="M56 50C59 47 64 47 67 49" stroke="#BAE6FD" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="98" cy="56" r="13" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
      <path d="M92 50C95 47 100 47 103 49" stroke="#BAE6FD" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="62" cy="90" r="13" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
      <path d="M56 84C59 81 64 81 67 83" stroke="#BAE6FD" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="98" cy="90" r="13" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
      <path d="M92 84C95 81 100 81 103 83" stroke="#BAE6FD" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  ),
  A3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="rp" x1="40" y1="16" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FDA4AF"/>
          <stop offset="1" stop-color="#F43F5E"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="124" rx="34" ry="6" fill="#000" fill-opacity="0.06"/>
      <path d="M58 20C58 14 68 12 80 12C92 12 102 14 102 20L105 46L124 66L105 86L102 112C102 118 92 120 80 120C68 120 58 118 58 112L55 86L36 66L55 46L58 20Z" fill="url(#rp)" stroke="#E11D48" stroke-width="2"/>
      <rect x="66" y="28" width="28" height="76" rx="14" fill="#FFF1F2" stroke="#FB7185" stroke-width="1.75" stroke-dasharray="4 3"/>
      <circle cx="48" cy="66" r="4" fill="#FFF1F2" stroke="#E11D48" stroke-width="1.5"/>
      <circle cx="112" cy="66" r="4" fill="#FFF1F2" stroke="#E11D48" stroke-width="1.5"/>
    </svg>`
  ),
  B1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="neo" x1="80" y1="42" x2="132" y2="94" gradientUnits="userSpaceOnUse">
          <stop stop-color="#34D399"/>
          <stop offset="1" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="108" rx="44" ry="7" fill="#000" fill-opacity="0.06"/>
      <g transform="rotate(-10 80 68)">
        <rect x="24" y="42" width="112" height="52" rx="26" fill="#FFFFFF" stroke="#059669" stroke-width="2.5"/>
        <path d="M80 42H110C124.36 42 136 53.64 136 68C136 82.36 124.36 94 110 94H80V42Z" fill="url(#neo)"/>
        <line x1="80" y1="42" x2="80" y2="94" stroke="#047857" stroke-width="2"/>
        <path d="M40 53H70" stroke="#D1FAE5" stroke-width="4" stroke-linecap="round"/>
        <path d="M90 53H114" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="4" stroke-linecap="round"/>
      </g>
    </svg>`
  ),
  B2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="bio" x1="24" y1="42" x2="136" y2="94" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FDBA74"/>
          <stop offset="1" stop-color="#EA580C"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="112" rx="46" ry="7" fill="#000" fill-opacity="0.06"/>
      <rect x="28" y="24" width="104" height="82" rx="16" fill="#FFF7ED" stroke="#FDBA74" stroke-width="2"/>
      <g transform="rotate(-8 80 65)">
        <rect x="34" y="43" width="92" height="44" rx="22" fill="#FFFFFF" stroke="#EA580C" stroke-width="2.5"/>
        <path d="M80 43H104C116.15 43 126 52.85 126 65C126 77.15 116.15 87 104 87H80V43Z" fill="url(#bio)"/>
        <line x1="80" y1="46" x2="80" y2="84" stroke="#C2410C" stroke-width="2" stroke-dasharray="3 3"/>
        <path d="M48 53H72" stroke="#FED7AA" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    </svg>`
  ),
  B3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="asc" x1="40" y1="24" x2="116" y2="112" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4ADE80"/>
          <stop offset="1" stop-color="#15803D"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="118" rx="40" ry="6" fill="#000" fill-opacity="0.06"/>
      <circle cx="80" cy="68" r="44" fill="#DCFCE7" stroke="#22C55E" stroke-width="2"/>
      <path d="M80 30C103 36 108 62 80 102C52 62 57 36 80 30Z" fill="url(#asc)" stroke="#166534" stroke-width="2"/>
      <path d="M80 40V96" stroke="#DCFCE7" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M80 58L91 49M80 72L68 62M80 78L92 69" stroke="#DCFCE7" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  ),
  C1: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="dia" x1="80" y1="44" x2="132" y2="92" gradientUnits="userSpaceOnUse">
          <stop stop-color="#38BDF8"/>
          <stop offset="1" stop-color="#0369A1"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="108" rx="44" ry="7" fill="#000" fill-opacity="0.06"/>
      <g transform="rotate(10 80 68)">
        <rect x="26" y="44" width="108" height="48" rx="24" fill="#FFFFFF" stroke="#0284C7" stroke-width="2.5"/>
        <path d="M80 44H110C123.25 44 134 54.75 134 68C134 81.25 123.25 92 110 92H80V44Z" fill="url(#dia)"/>
        <path d="M42 54H72" stroke="#E0F2FE" stroke-width="4" stroke-linecap="round"/>
        <path d="M90 54H116" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="4" stroke-linecap="round"/>
      </g>
    </svg>`
  ),
  C2: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="mod" x1="48" y1="16" x2="112" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FCE7F3"/>
          <stop offset="1" stop-color="#F9A8D4"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="124" rx="32" ry="6" fill="#000" fill-opacity="0.06"/>
      <rect x="46" y="16" width="68" height="104" rx="34" fill="url(#mod)" stroke="#EC4899" stroke-width="2"/>
      <rect x="60" y="30" width="40" height="76" rx="20" fill="#FFFFFF" stroke="#F472B6" stroke-width="1.75"/>
      <path d="M72 48C76 54 76 82 72 88M88 48C84 54 84 82 88 88" stroke="#F9A8D4" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  ),
  C3: encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="cup" x1="50" y1="28" x2="110" y2="100" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FDA4AF"/>
          <stop offset="1" stop-color="#FB7185"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="126" rx="26" ry="5" fill="#000" fill-opacity="0.06"/>
      <path d="M48 34H112L101 86C99 95 91 102 80 102C69 102 61 95 59 86L48 34Z" fill="url(#cup)" stroke="#E11D48" stroke-width="2"/>
      <ellipse cx="80" cy="34" rx="32" ry="8" fill="#FFE4E6" stroke="#E11D48" stroke-width="2"/>
      <path d="M62 48L68 82" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="4" stroke-linecap="round"/>
      <rect x="76" y="101" width="8" height="20" rx="4" fill="#FB7185" stroke="#E11D48" stroke-width="1.75"/>
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
