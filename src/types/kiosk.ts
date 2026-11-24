export type SlotCategory = 'medicine' | 'first-aid' | 'menstrual';

export type ConnectionStatus = 'connected' | 'offline' | 'loading';

export interface SlotItem {
  id: string;
  slot_code: string;
  name: string;
  category: SlotCategory;
  ingredients: string;
  usageInstruction: string;
  price: number;
  stock: number;
  default_stock: number;
  image_url: string;
  sort_order: number;
  updated_at?: string;
}

export interface CartItem {
  slot: SlotItem;
  quantity: number;
  subtotal: number;
}

export type CheckoutStage = 'idle' | 'payment' | 'dispensing' | 'claim';

export type KioskView = 'symptom-check' | 'questionnaire' | 'recommendation' | 'grid';

export type SymptomId =
  | 'headache-fever'
  | 'cold-nose'
  | 'cough'
  | 'diarrhea'
  | 'allergies'
  | 'cut-scrape'
  | 'menstrual';

export interface SafetyAlertInfo {
  urgent?: boolean;
  title: string;
  message: string;
}

export interface RecommendationResult {
  slotCodes: string[];
  cautionNote?: string;
}

export interface TransactionLineItem {
  slot_code: string;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface TransactionRecord {
  id?: string;
  items: TransactionLineItem[];
  total_quantity: number;
  total_amount: number;
  created_at?: string;
}
