# Minimal Touchscreen Vending Machine Display

A quiet, human-designed touchscreen kiosk prototype for 9 over-the-counter health and hygiene essentials in the Philippines. Built with a calm neutral aesthetic (warm stone `#F5F5F4`, pure white `rounded-2xl` cards, deep charcoal `#18181B`) and zero dashboard clutter.

## Stack
- **React 18 + TypeScript + Vite + Tailwind CSS**
- **shadcn/ui** (`Button`, `Dialog`, `Progress`)
- **Origin UI** grouped pill quantity stepper
- **`@number-flow/react`** smooth animated quantities and `₱` totals
- **`motion`** subtle press feedback (`whileTap={{ scale: 0.95 }}`) and claim animation
- **Web Audio API** synthesized 30ms touch clicks and exact 3-second dispensing beep
- **Supabase** (`@supabase/supabase-js`) with automatic LocalStorage fallback

## The 9 Products (3×3 Grid)
| Slot | Product | Price | Stock | Photo Path |
| :--- | :--- | ---: | ---: | :--- |
| A1 | Band-Aid | ₱5 | 15 | `/images/products/band-aid.jpg` |
| A2 | Cetirizine | ₱15 | 12 | `/images/products/cetirizine.jpg` |
| A3 | Reusable Pads | ₱120 | 8 | `/images/products/reusable-pads.jpg` |
| B1 | Neozep | ₱9 | 15 | `/images/products/neozep.jpg` |
| B2 | Biogesic | ₱6 | 20 | `/images/products/biogesic.jpg` |
| B3 | Ascof Forte | ₱9 | 15 | `/images/products/ascof-forte.jpg` |
| C1 | Diatabs | ₱10 | 12 | `/images/products/diatabs.jpg` |
| C2 | Modess Napkin | ₱8 | 15 | `/images/products/modess-napkin.jpg` |
| C3 | Menstrual Cup | ₱350 | 5 | `/images/products/menstrual-cup.jpg` |

## Setup & Deployment

1. Run locally (works out-of-the-box with LocalStorage fallback):
   ```bash
   npm install
   npm run dev
   ```

2. Connect Supabase:
   - Paste and run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local` (or Vercel Environment Variables).

3. Verify Vercel production build:
   ```bash
   npm run build
   ```
