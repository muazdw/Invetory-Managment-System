export type Company = {
  id: string;
  name: string;
  address?: string;
  createdAt: string;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category?: string;
  unitPrice: number;
  supplier?: Supplier | null;
  inventory?: {
    id: string;
    quantity: number;
    lowStockThreshold: number;
  };
};

export type InventoryItem = {
  id: string;
  quantity: number;
  lowStockThreshold: number;
  product: Product;
};

export type StockMovement = {
  id: string;
  type: 'in' | 'out';
  quantity: number;
  note?: string;
  createdAt: string;
  product: Product;
};

export type Employee = {
  id: string;
  userId: string;
  email: string;
  role: 'owner' | 'manager' | 'viewer';
  joinedAt: string;
};

export type ViewTab = 'dashboard' | 'products' | 'suppliers' | 'inventory' | 'employees' | 'history';

export type ProductFormState = {
  sku: string;
  name: string;
  category: string;
  unitPrice: string;
  supplierId: string;
};

export type SupplierFormState = {
  name: string;
  email: string;
  phone: string;
};

export type MovementFormState = {
  productId: string;
  quantity: string;
  note: string;
  type: 'in' | 'out';
};

export type EmployeeFormState = {
  email: string;
  password: string;
  role: 'manager' | 'viewer';
};
