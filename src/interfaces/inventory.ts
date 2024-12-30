export interface VariantData {
  variant: {
    inventory_item_id: number;
  };
}

export interface InventoryData {
  inventory_levels: {
    available: number;
  }[];
}
