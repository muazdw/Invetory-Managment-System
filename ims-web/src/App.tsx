import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import './App.css';
import { AuthPage } from './components/auth/AuthPage';
import { CrudPanel } from './components/CrudPanel';
import {
  IconAlertTriangle,
  IconBox,
  IconDollar,
  IconEdit,
  IconHistory,
  IconInbox,
  IconPlus,
  IconTruck,
  IconUsers,
} from './components/icons/Icons';
import { AppShell, Sidebar } from './components/layout/Sidebar';
import { PageHeader, PanelCard, SearchInput } from './components/layout/PageHeader';
import { StatCard } from './components/layout/StatCard';
import { Alert } from './components/ui/Alert';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { DataTable } from './components/ui/DataTable';
import { API_BASE, PAGE_META } from './constants';
import type {
  Company,
  Employee,
  EmployeeFormState,
  InventoryItem,
  MovementFormState,
  Product,
  ProductFormState,
  StockMovement,
  Supplier,
  SupplierFormState,
  ViewTab,
} from './types';
import { fmtMoney } from './utils/format';

function getAlertVariant(message: string): 'info' | 'success' | 'warning' | 'error' {
  const lower = message.toLowerCase();
  if (lower.includes('welcome') || lower.includes('created') || lower.includes('updated') || lower.includes('applied') || lower.includes('logged out')) {
    return 'success';
  }
  if (lower.includes('only company owners')) return 'warning';
  if (lower.includes('fail') || lower.includes('error') || lower.includes('invalid') || lower.includes('unauthorized')) {
    return 'error';
  }
  return 'info';
}

function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem('ims_token') ?? '');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<StockMovement[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [company, setCompany] = useState<Company | null>(null);

  const [newProduct, setNewProduct] = useState<ProductFormState>({
    sku: '',
    name: '',
    category: '',
    unitPrice: '',
    supplierId: '',
  });
  const [newSupplier, setNewSupplier] = useState<SupplierFormState>({ name: '', email: '', phone: '' });
  const [movement, setMovement] = useState<MovementFormState>({ productId: '', quantity: '', note: '', type: 'in' });
  const [newEmployee, setNewEmployee] = useState<EmployeeFormState>({
    email: '',
    password: '',
    role: 'viewer' as 'manager' | 'viewer',
  });
  const [productQuery, setProductQuery] = useState('');
  const [supplierQuery, setSupplierQuery] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<MovementFormState['type'] | 'all'>('all');
  const [inventoryLowStockOnly, setInventoryLowStockOnly] = useState(false);
  const [employeeFeedback, setEmployeeFeedback] = useState('');
  const [isCrudPanelOpen, setIsCrudPanelOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

  const lowStockItems = useMemo(
    () => inventory.filter((item) => item.quantity <= item.lowStockThreshold),
    [inventory],
  );
  const lowStockCount = lowStockItems.length;
  const displayedInventory = useMemo(
    () => (inventoryLowStockOnly ? lowStockItems : inventory),
    [inventory, inventoryLowStockOnly, lowStockItems],
  );
  const totalValue = useMemo(
    () => inventory.reduce((sum, item) => sum + item.quantity * Number(item.product.unitPrice ?? 0), 0),
    [inventory],
  );
  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((item) =>
      [item.sku, item.name, item.category, item.supplier?.name].join(' ').toLowerCase().includes(q),
    );
  }, [products, productQuery]);
  const filteredSuppliers = useMemo(() => {
    const q = supplierQuery.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((item) => [item.name, item.email, item.phone].join(' ').toLowerCase().includes(q));
  }, [supplierQuery, suppliers]);
  const filteredHistory = useMemo(() => {
    if (historyTypeFilter === 'all') return history;
    return history.filter((entry) => entry.type === historyTypeFilter);
  }, [history, historyTypeFilter]);

  const panelConfig = useMemo(() => {
    if (activeTab === 'products') {
      return editingProductId
        ? { label: 'Edit Product', title: 'Edit Product' }
        : { label: 'Add Product', title: 'Create Product' };
    }
    if (activeTab === 'suppliers') {
      return editingSupplierId
        ? { label: 'Edit Supplier', title: 'Edit Supplier' }
        : { label: 'Add Supplier', title: 'Create Supplier' };
    }
    if (activeTab === 'inventory') return { label: 'Stock Movement', title: 'Apply Stock Movement' };
    if (activeTab === 'employees') return { label: 'Add Employee', title: 'Add Team Member' };
    return null;
  }, [activeTab, editingProductId, editingSupplierId]);

  const pageMeta = PAGE_META[activeTab];

  const saveToken = (newToken: string) => {
    localStorage.setItem('ims_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('ims_token');
    setToken('');
    setProducts([]);
    setSuppliers([]);
    setInventory([]);
    setHistory([]);
    setEmployees([]);
    setCompany(null);
    setMessage('Logged out successfully.');
  };

  const apiFetch = useCallback(async <T,>(path: string, options?: RequestInit): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> | undefined),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let res: Response;
    try {
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch {
      throw new Error(
        'Unable to reach the API. Make sure the backend is running (npm run start:dev in ims-api).',
      );
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const text = data?.message;
      const detail = Array.isArray(text) ? text.join(', ') : text;
      throw new Error(detail || `Request failed with status ${res.status}`);
    }
    return data as T;
  }, [token]);

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setMessage('');
    try {
      const [productsRes, suppliersRes, inventoryRes, historyRes, companyRes] = await Promise.all([
        apiFetch<Product[]>('/products'),
        apiFetch<Supplier[]>('/suppliers'),
        apiFetch<InventoryItem[]>('/inventory'),
        apiFetch<StockMovement[]>('/stock/history'),
        apiFetch<Company>('/companies/me'),
      ]);
      setProducts(productsRes);
      setSuppliers(suppliersRes);
      setInventory(inventoryRes);
      setHistory(historyRes);
      setCompany(companyRes);
      try {
        const members = await apiFetch<Employee[]>('/companies/members');
        setEmployees(members);
        setEmployeeFeedback('');
      } catch {
        setEmployees([]);
        setEmployeeFeedback('Only company owners can manage employees.');
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, apiFetch]);

  useEffect(() => {
    if (token) {
      void loadAll();
    }
  }, [token, loadAll]);

  useEffect(() => {
    document.title = 'Stockline';
  }, []);

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const path = authMode === 'login' ? '/auth/login' : '/auth/register';
      const body =
        authMode === 'login'
          ? { email, password }
          : { email, password, companyName, address: address || undefined };

      const response = await apiFetch<{ access_token: string }>(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      saveToken(response.access_token);
      setMessage('Welcome! Connected to your inventory backend.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiFetch('/companies/members', {
        method: 'POST',
        body: JSON.stringify(newEmployee),
      });
      setNewEmployee({ email: '', password: '', role: 'viewer' });
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeeRole = async (userId: string, role: 'manager' | 'viewer') => {
    setLoading(true);
    setMessage('');
    try {
      await apiFetch(`/companies/members/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const removeEmployee = async (userId: string) => {
    setLoading(true);
    setMessage('');
    try {
      await apiFetch(`/companies/members/${userId}`, { method: 'DELETE' });
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiFetch(editingProductId ? `/products/${editingProductId}` : '/products', {
        method: editingProductId ? 'PATCH' : 'POST',
        body: JSON.stringify({
          sku: newProduct.sku,
          name: newProduct.name,
          category: newProduct.category || undefined,
          unitPrice: Number(newProduct.unitPrice),
          supplierId: newProduct.supplierId || undefined,
        }),
      });
      setNewProduct({ sku: '', name: '', category: '', unitPrice: '', supplierId: '' });
      setEditingProductId(null);
      setMessage(editingProductId ? 'Product updated.' : 'Product created.');
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiFetch(editingSupplierId ? `/suppliers/${editingSupplierId}` : '/suppliers', {
        method: editingSupplierId ? 'PATCH' : 'POST',
        body: JSON.stringify(newSupplier),
      });
      setNewSupplier({ name: '', email: '', phone: '' });
      setEditingSupplierId(null);
      setMessage(editingSupplierId ? 'Supplier updated.' : 'Supplier created.');
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const applyMovement = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiFetch(`/stock/${movement.type}`, {
        method: 'POST',
        body: JSON.stringify({
          productId: movement.productId,
          quantity: Number(movement.quantity),
          note: movement.note || undefined,
        }),
      });
      setMovement({ productId: '', quantity: '', note: '', type: 'in' });
      setMessage('Stock movement applied.');
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const removeSupplier = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/suppliers/${id}`, { method: 'DELETE' });
      await loadAll();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({
      sku: product.sku,
      name: product.name,
      category: product.category ?? '',
      unitPrice: String(product.unitPrice ?? ''),
      supplierId: product.supplier?.id ?? '',
    });
    setIsCrudPanelOpen(true);
  };

  const startEditSupplier = (supplier: Supplier) => {
    setEditingSupplierId(supplier.id);
    setNewSupplier({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
    });
    setIsCrudPanelOpen(true);
  };

  const resetEditState = () => {
    setEditingProductId(null);
    setEditingSupplierId(null);
    setNewProduct({ sku: '', name: '', category: '', unitPrice: '', supplierId: '' });
    setNewSupplier({ name: '', email: '', phone: '' });
  };

  const openCreatePanel = () => {
    if (activeTab === 'products' || activeTab === 'suppliers') {
      resetEditState();
    }
    setIsCrudPanelOpen(true);
  };

  const handleTabChange = (tab: ViewTab) => {
    setInventoryLowStockOnly(false);
    setActiveTab(tab);
  };

  const navigateToLowStock = () => {
    setInventoryLowStockOnly(true);
    setActiveTab('inventory');
  };

  if (!token) {
    return (
      <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        companyName={companyName}
        setCompanyName={setCompanyName}
        address={address}
        setAddress={setAddress}
        loading={loading}
        message={message}
        onSubmit={handleAuth}
      />
    );
  }

  return (
    <>
      <AppShell
        onMenuToggle={() => setMobileNavOpen((v) => !v)}
        sidebar={
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={logout}
            mobileOpen={mobileNavOpen}
            onMobileClose={() => setMobileNavOpen(false)}
            companyName={company?.name}
          />
        }
      >
        <PageHeader
          title={pageMeta.title}
          description={pageMeta.description}
          action={
            panelConfig ? (
              <Button variant="primary" icon={<IconPlus size={16} />} onClick={openCreatePanel}>
                {panelConfig.label}
              </Button>
            ) : undefined
          }
        />

        {activeTab === 'dashboard' && (
          <div className="stats-grid">
            <StatCard
              label="Products"
              value={products.length}
              icon={<IconBox size={20} />}
              onClick={() => handleTabChange('products')}
            />
            <StatCard
              label="Suppliers"
              value={suppliers.length}
              icon={<IconTruck size={20} />}
              onClick={() => handleTabChange('suppliers')}
            />
            <StatCard
              label="Low Stock Items"
              value={lowStockCount}
              icon={<IconAlertTriangle size={20} />}
              variant={lowStockCount > 0 ? 'warning' : 'default'}
              onClick={navigateToLowStock}
            />
            <StatCard
              label="Total Stock Value"
              value={fmtMoney(totalValue)}
              icon={<IconDollar size={20} />}
              variant="success"
            />
          </div>
        )}

        {message && (
          <Alert variant={getAlertVariant(message)} message={message} onDismiss={() => setMessage('')} />
        )}

        {activeTab === 'dashboard' && (
          <PanelCard
            title="Low Stock Alerts"
            description="Products that need replenishment attention."
          >
            <DataTable
              loading={loading && inventory.length === 0}
              empty={lowStockItems.length === 0}
              emptyIcon={<IconInbox size={24} />}
              emptyTitle="All stock levels are healthy"
              emptyDescription="No products are currently below their low-stock threshold."
            >
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.slice(0, 8).map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td className="cell-mono">{item.quantity}</td>
                    <td className="cell-mono cell-muted">{item.lowStockThreshold}</td>
                    <td>
                      <Badge variant="warning" dot>Needs restock</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </PanelCard>
        )}

        {activeTab === 'products' && (
          <PanelCard
            title="Product Catalog"
            description={`${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
            toolbar={
              <SearchInput
                value={productQuery}
                onChange={setProductQuery}
                placeholder="Search SKU, name, category..."
              />
            }
          >
            <DataTable
              loading={loading && products.length === 0}
              empty={filteredProducts.length === 0}
              emptyIcon={<IconBox size={24} />}
              emptyTitle={productQuery ? 'No products match your search' : 'No products yet'}
              emptyDescription={productQuery ? 'Try adjusting your search terms.' : 'Add your first product to get started.'}
              emptyAction={
                !productQuery ? (
                  <Button variant="primary" icon={<IconPlus size={16} />} onClick={openCreatePanel}>
                    Add Product
                  </Button>
                ) : undefined
              }
            >
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="cell-mono">{product.sku}</td>
                    <td>{product.name}</td>
                    <td className="cell-muted">{product.category || '—'}</td>
                    <td className="cell-mono">{fmtMoney(Number(product.unitPrice))}</td>
                    <td className="cell-muted">{product.supplier?.name ?? '—'}</td>
                    <td>
                      <Button variant="ghost" size="sm" icon={<IconEdit size={14} />} onClick={() => startEditProduct(product)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </PanelCard>
        )}

        {activeTab === 'suppliers' && (
          <PanelCard
            title="Supplier Directory"
            description={`${filteredSuppliers.length} supplier${filteredSuppliers.length !== 1 ? 's' : ''}`}
            toolbar={
              <SearchInput
                value={supplierQuery}
                onChange={setSupplierQuery}
                placeholder="Search name, email, phone..."
              />
            }
          >
            <DataTable
              loading={loading && suppliers.length === 0}
              empty={filteredSuppliers.length === 0}
              emptyIcon={<IconTruck size={24} />}
              emptyTitle={supplierQuery ? 'No suppliers match your search' : 'No suppliers yet'}
              emptyDescription={supplierQuery ? 'Try adjusting your search terms.' : 'Add your first supplier to get started.'}
              emptyAction={
                !supplierQuery ? (
                  <Button variant="primary" icon={<IconPlus size={16} />} onClick={openCreatePanel}>
                    Add Supplier
                  </Button>
                ) : undefined
              }
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.name}</td>
                    <td className="cell-muted">{supplier.email}</td>
                    <td className="cell-mono cell-muted">{supplier.phone}</td>
                    <td>
                      <Button variant="ghost" size="sm" icon={<IconEdit size={14} />} onClick={() => startEditSupplier(supplier)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </PanelCard>
        )}

        {activeTab === 'inventory' && (
          <PanelCard
            title="Stock Levels"
            description={`${displayedInventory.length} tracked item${displayedInventory.length !== 1 ? 's' : ''}`}
            toolbar={
              <select
                className="filter-select"
                value={inventoryLowStockOnly ? 'low' : 'all'}
                onChange={(e) => setInventoryLowStockOnly(e.target.value === 'low')}
                aria-label="Filter stock levels"
              >
                <option value="all">All items</option>
                <option value="low">Low stock only</option>
              </select>
            }
          >
            <DataTable
              loading={loading && inventory.length === 0}
              empty={displayedInventory.length === 0}
              emptyIcon={<IconInbox size={24} />}
              emptyTitle={
                inventoryLowStockOnly
                  ? lowStockItems.length === 0
                    ? 'All stock levels are healthy'
                    : 'No matching items'
                  : 'No inventory data'
              }
              emptyDescription={
                inventoryLowStockOnly
                  ? lowStockItems.length === 0
                    ? 'No products are currently below their low-stock threshold.'
                    : 'Try changing the filter to see more items.'
                  : 'Inventory will appear once products are added and stock movements are recorded.'
              }
            >
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedInventory.map((item) => {
                  const low = item.quantity <= item.lowStockThreshold;
                  return (
                    <tr key={item.id}>
                      <td>{item.product.name}</td>
                      <td className="cell-mono">{item.quantity}</td>
                      <td className="cell-mono cell-muted">{item.lowStockThreshold}</td>
                      <td>
                        <Badge variant={low ? 'warning' : 'success'} dot>
                          {low ? 'Low stock' : 'Healthy'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </PanelCard>
        )}

        {activeTab === 'employees' && (
          <PanelCard title="Team Members" description={`${employees.length} member${employees.length !== 1 ? 's' : ''}`}>
            {employeeFeedback && (
              <Alert variant="warning" message={employeeFeedback} />
            )}
            <DataTable
              loading={loading && employees.length === 0 && !employeeFeedback}
              empty={employees.length === 0}
              emptyIcon={<IconUsers size={24} />}
              emptyTitle="No team members"
              emptyDescription={employeeFeedback || 'Invite team members to collaborate on inventory management.'}
              emptyAction={
                !employeeFeedback ? (
                  <Button variant="primary" icon={<IconPlus size={16} />} onClick={openCreatePanel}>
                    Add Team Member
                  </Button>
                ) : undefined
              }
            >
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.email}</td>
                    <td>
                      <Badge variant="default" className={`role-badge--${employee.role}`}>
                        {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="cell-muted">{new Date(employee.joinedAt).toLocaleDateString()}</td>
                    <td>
                      {employee.role !== 'owner' && (
                        <div className="cell-actions">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEmployeeRole(employee.userId, employee.role === 'manager' ? 'viewer' : 'manager')}
                          >
                            Set {employee.role === 'manager' ? 'Viewer' : 'Manager'}
                          </Button>
                          <Button variant="danger-outline" size="sm" onClick={() => removeEmployee(employee.userId)}>
                            Remove
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </PanelCard>
        )}

        {activeTab === 'history' && (
          <PanelCard
            title="Movement History"
            description={`${filteredHistory.length} record${filteredHistory.length !== 1 ? 's' : ''}`}
            toolbar={
              <select
                className="filter-select"
                value={historyTypeFilter}
                onChange={(e) => setHistoryTypeFilter(e.target.value as 'all' | 'in' | 'out')}
                aria-label="Filter movement type"
              >
                <option value="all">All movements</option>
                <option value="in">Stock in only</option>
                <option value="out">Stock out only</option>
              </select>
            }
          >
            <DataTable
              loading={loading && history.length === 0}
              empty={filteredHistory.length === 0}
              emptyIcon={<IconHistory size={24} />}
              emptyTitle={historyTypeFilter !== 'all' ? 'No matching movements' : 'No movement history'}
              emptyDescription={
                historyTypeFilter !== 'all'
                  ? 'Try changing the filter to see more records.'
                  : 'Stock movements will appear here once recorded.'
              }
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((entry) => (
                  <tr key={entry.id}>
                    <td className="cell-muted">{new Date(entry.createdAt).toLocaleString()}</td>
                    <td>{entry.product?.name ?? '—'}</td>
                    <td className={entry.type === 'in' ? 'type-in' : 'type-out'}>
                      {entry.type === 'in' ? 'Stock In' : 'Stock Out'}
                    </td>
                    <td className="cell-mono">{entry.quantity}</td>
                    <td className="cell-muted">{entry.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </PanelCard>
        )}
      </AppShell>

      <CrudPanel
        isOpen={isCrudPanelOpen}
        panelConfig={panelConfig}
        activeTab={activeTab}
        loading={loading}
        suppliers={suppliers}
        products={products}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        newSupplier={newSupplier}
        setNewSupplier={setNewSupplier}
        movement={movement}
        setMovement={setMovement}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        employeeFeedback={employeeFeedback}
        createProduct={createProduct}
        createSupplier={createSupplier}
        applyMovement={applyMovement}
        addEmployee={addEmployee}
        editingProductId={editingProductId}
        editingSupplierId={editingSupplierId}
        removeProduct={removeProduct}
        removeSupplier={removeSupplier}
        onClose={() => {
          setIsCrudPanelOpen(false);
          resetEditState();
        }}
      />
    </>
  );
}

export default App;
