# CareVend PH — Health, Hygiene & First-Aid Touchscreen Vending Kiosk

Interactive touchscreen vending machine display web application prototype for over-the-counter (OTC) medicines, first-aid, and feminine hygiene essentials in the Philippines.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons
- **Audio:** Native Web Audio API (`AudioContext` oscillator synthesis — touch clicks & 3-second dispensing beep with zero external audio dependencies)
- **Backend / Database:** Supabase (`@supabase/supabase-js`) with automatic Offline LocalStorage fallback
- **Deployment:** Vercel-ready (`npm run build` runs `tsc -b && vite build`)

## 9 Seeded Vending Slots (3×3 Grid)
| Slot | Product | Category | Unit | Price (PHP) | Default Stock |
| :--- | :--- | :--- | :--- | ---: | ---: |
| A1 | Band-Aid | First Aid | Per strip | ₱5.00 | 15 |
| A2 | Cetirizine (10mg) | Medicine | Per tablet | ₱15.00 | 12 |
| A3 | Reusable Pad | Hygiene | Per piece | ₱120.00 | 8 |
| B1 | Neozep Z+ | Medicine | Per tablet | ₱9.00 | 15 |
| B2 | Biogesic (500mg) | Medicine | Per tablet | ₱6.00 | 20 |
| B3 | Ascof Forte (600mg) | Medicine | Per tablet | ₱9.00 | 15 |
| C1 | Diatabs (2mg) | Medicine | Per capsule | ₱10.00 | 12 |
| C2 | Modess Napkin | Hygiene | Per single pad | ₱8.00 | 15 |
| C3 | Menstrual Cup | Hygiene | Per piece | ₱350.00 | 5 |

## Local Setup & Supabase Configuration

1. Install dependencies and run locally:
   ```bash
   npm install
   npm run dev
   ```
   Without environment variables, CareVend PH automatically starts in **Offline Mode** backed by `localStorage`.

2. Connect Supabase:
   - Open your Supabase project → **SQL Editor**.
   - Paste and run [`supabase/schema.sql`](./supabase/schema.sql) to create `public.slots`, `public.transactions`, RLS policies, seed data, and `restock_all_slots()`.
   - Copy `.env.example` to `.env.local` (or add these variables in Vercel Project Settings):
     ```env
     VITE_SUPABASE_URL=https://your-project-ref.supabase.co
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
     ```

3. Custom Product Photos:
   - Drop product images into `public/images/products/` (e.g., `band-aid.jpg`, `biogesic.jpg`, etc.). Built-in medical/hygiene SVG illustrations automatically display as fallbacks whenever a custom photo is not yet present.
