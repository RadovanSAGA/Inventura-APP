export interface InventoryItem {
  id: string;
  cisloPolozky: string;
  stav: string;
  popis: string;
  baliacaJednotka: string;
  castkovaJedno: string;
  jednotka: string;
  hodnota1: number;
  hodnota2: number;
  hodnota3: number;
  celkom: number;
  poznamka: string;
  locked: boolean;
}

export interface InventoryFilters {
  searchTerm: string;
  showOnlyLocked: boolean;
  showOnlyUnlocked: boolean;
}