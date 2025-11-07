// types/index.ts

// Assumed shape for an inventory item
export interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  // Add any other fields your item has
}

// Assumed shape for a delivery agent
export interface DeliveryAgent {
  _id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'on-delivery';
}

// Assumed shape for analytics data
export interface KpiMetric {
  _id: string;
  metric: string;
  value: string | number;
  change?: string; // e.g., "+5.2%"
}

// Assumed shape for top-selling products
export interface TopSoldProduct {
  _id: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}