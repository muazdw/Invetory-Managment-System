import type { ComponentType } from 'react';
import {
  IconHistory,
  IconLayoutDashboard,
  IconPackage,
  IconTruck,
  IconUsers,
  IconWarehouse,
} from './components/icons/Icons';
import type { ViewTab } from './types';

export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  (import.meta.env.DEV ? '/api' : 'http://localhost:3000');

export const TAB_LABELS: Record<ViewTab, string> = {
  dashboard: 'Overview',
  products: 'Products',
  suppliers: 'Suppliers',
  inventory: 'Inventory',
  employees: 'Team',
  history: 'Movements',
};

export const TAB_ICONS: Record<ViewTab, ComponentType<{ size?: number; className?: string }>> = {
  dashboard: IconLayoutDashboard,
  products: IconPackage,
  suppliers: IconTruck,
  inventory: IconWarehouse,
  employees: IconUsers,
  history: IconHistory,
};

export const PAGE_META: Record<ViewTab, { title: string; description: string }> = {
  dashboard: {
    title: 'Overview',
    description: 'Monitor stock health, alerts, and key metrics at a glance.',
  },
  products: {
    title: 'Products',
    description: 'Manage your product catalog, pricing, and supplier links.',
  },
  suppliers: {
    title: 'Suppliers',
    description: 'Track vendor contacts and partnership details.',
  },
  inventory: {
    title: 'Inventory',
    description: 'View current stock levels and replenishment status.',
  },
  employees: {
    title: 'Team',
    description: 'Manage team members and access roles.',
  },
  history: {
    title: 'Stock Movements',
    description: 'Review inbound and outbound stock activity.',
  },
};

export const APP_TABS: ViewTab[] = ['dashboard', 'products', 'suppliers', 'inventory', 'employees', 'history'];
