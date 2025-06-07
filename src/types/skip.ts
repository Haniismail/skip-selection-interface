export interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  transport_cost: number | null;
  per_tonne_cost: number | null;
  price_before_vat: number;
  vat: number;
  postcode: string;
  area: string;
  forbidden: boolean;
  created_at: string;
  updated_at: string;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
}

export interface FilterState {
  sizeRange: [number, number];
  hirePeriodRange: [number, number];
  allowsHeavyWaste: boolean | null; // null = all, true = only heavy waste, false = only non-heavy waste
  allowedOnRoad: boolean | null; // null = all, true = only road allowed, false = only permit required
}
