import type { FormEvent } from 'react';
import type {
  EmployeeFormState,
  MovementFormState,
  Product,
  ProductFormState,
  Supplier,
  SupplierFormState,
  ViewTab,
} from '../types';
import { IconX } from './icons/Icons';
import { Button } from './ui/Button';
import { FormField } from './ui/FormField';

type PanelConfig = { label: string; title: string };

type CrudPanelProps = {
  isOpen: boolean;
  panelConfig: PanelConfig | null;
  activeTab: ViewTab;
  loading: boolean;
  suppliers: Supplier[];
  products: Product[];
  newProduct: ProductFormState;
  setNewProduct: (state: ProductFormState) => void;
  newSupplier: SupplierFormState;
  setNewSupplier: (state: SupplierFormState) => void;
  movement: MovementFormState;
  setMovement: (state: MovementFormState) => void;
  newEmployee: EmployeeFormState;
  setNewEmployee: (state: EmployeeFormState) => void;
  employeeFeedback: string;
  createProduct: (event: FormEvent) => Promise<void>;
  createSupplier: (event: FormEvent) => Promise<void>;
  applyMovement: (event: FormEvent) => Promise<void>;
  addEmployee: (event: FormEvent) => Promise<void>;
  editingProductId: string | null;
  editingSupplierId: string | null;
  removeProduct: (id: string) => Promise<void>;
  removeSupplier: (id: string) => Promise<void>;
  onClose: () => void;
};

export function CrudPanel(props: CrudPanelProps) {
  const {
    isOpen,
    panelConfig,
    activeTab,
    loading,
    suppliers,
    products,
    newProduct,
    setNewProduct,
    newSupplier,
    setNewSupplier,
    movement,
    setMovement,
    newEmployee,
    setNewEmployee,
    employeeFeedback,
    createProduct,
    createSupplier,
    applyMovement,
    addEmployee,
    editingProductId,
    editingSupplierId,
    removeProduct,
    removeSupplier,
    onClose,
  } = props;

  if (!isOpen || !panelConfig) return null;

  const handleSubmit = (handler: (e: FormEvent) => Promise<void>) => async (e: FormEvent) => {
    e.preventDefault();
    await handler(e);
    onClose();
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-header">
          <h2 id="drawer-title">{panelConfig.title}</h2>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close panel">
            <IconX size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {activeTab === 'products' && (
            <form id="product-form" onSubmit={handleSubmit(createProduct)} className="form-grid">
              <FormField label="SKU">
                <input
                  className="input"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="e.g. SKU-001"
                  required
                />
              </FormField>
              <FormField label="Product Name">
                <input
                  className="input"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </FormField>
              <FormField label="Category" hint="Optional">
                <input
                  className="input"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="e.g. Electronics"
                />
              </FormField>
              <FormField label="Unit Price">
                <input
                  className="input"
                  value={newProduct.unitPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
              </FormField>
              <FormField label="Supplier" hint="Optional">
                <select
                  className="select"
                  value={newProduct.supplierId}
                  onChange={(e) => setNewProduct({ ...newProduct, supplierId: e.target.value })}
                >
                  <option value="">No supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </form>
          )}

          {activeTab === 'suppliers' && (
            <form id="supplier-form" onSubmit={handleSubmit(createSupplier)} className="form-grid">
              <FormField label="Supplier Name">
                <input
                  className="input"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Company name"
                  required
                />
              </FormField>
              <FormField label="Email">
                <input
                  className="input"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="contact@company.com"
                  type="email"
                  required
                />
              </FormField>
              <FormField label="Phone">
                <input
                  className="input"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </FormField>
            </form>
          )}

          {activeTab === 'inventory' && (
            <form id="movement-form" onSubmit={handleSubmit(applyMovement)} className="form-grid">
              <FormField label="Movement Type">
                <select
                  className="select"
                  value={movement.type}
                  onChange={(e) => setMovement({ ...movement, type: e.target.value as 'in' | 'out' })}
                >
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                </select>
              </FormField>
              <FormField label="Product">
                <select
                  className="select"
                  value={movement.productId}
                  onChange={(e) => setMovement({ ...movement, productId: e.target.value })}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Quantity">
                <input
                  className="input"
                  value={movement.quantity}
                  onChange={(e) => setMovement({ ...movement, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  type="number"
                  min="1"
                  required
                />
              </FormField>
              <FormField label="Note" hint="Optional">
                <input
                  className="input"
                  value={movement.note}
                  onChange={(e) => setMovement({ ...movement, note: e.target.value })}
                  placeholder="Add a note about this movement"
                />
              </FormField>
            </form>
          )}

          {activeTab === 'employees' && (
            <form id="employee-form" onSubmit={handleSubmit(addEmployee)} className="form-grid">
              {employeeFeedback && (
                <div className="alert alert--warning">
                  <p>{employeeFeedback}</p>
                </div>
              )}
              <FormField label="Email">
                <input
                  className="input"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="employee@company.com"
                  type="email"
                  required
                  disabled={Boolean(employeeFeedback)}
                />
              </FormField>
              <FormField label="Temporary Password" hint="Minimum 6 characters">
                <input
                  className="input"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  placeholder="Set initial password"
                  type="password"
                  minLength={6}
                  required
                  disabled={Boolean(employeeFeedback)}
                />
              </FormField>
              <FormField label="Role">
                <select
                  className="select"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as 'manager' | 'viewer' })}
                  disabled={Boolean(employeeFeedback)}
                >
                  <option value="viewer">Viewer — read-only access</option>
                  <option value="manager">Manager — full access</option>
                </select>
              </FormField>
            </form>
          )}
        </div>

        <div className="drawer-footer">
          {activeTab === 'products' && (
            <>
              <Button type="submit" form="product-form" variant="primary" fullWidth loading={loading}>
                {editingProductId ? 'Save Changes' : 'Create Product'}
              </Button>
              {editingProductId && (
                <Button
                  type="button"
                  variant="danger-outline"
                  fullWidth
                  onClick={async () => {
                    await removeProduct(editingProductId);
                    onClose();
                  }}
                >
                  Delete Product
                </Button>
              )}
            </>
          )}
          {activeTab === 'suppliers' && (
            <>
              <Button type="submit" form="supplier-form" variant="primary" fullWidth loading={loading}>
                {editingSupplierId ? 'Save Changes' : 'Add Supplier'}
              </Button>
              {editingSupplierId && (
                <Button
                  type="button"
                  variant="danger-outline"
                  fullWidth
                  onClick={async () => {
                    await removeSupplier(editingSupplierId);
                    onClose();
                  }}
                >
                  Delete Supplier
                </Button>
              )}
            </>
          )}
          {activeTab === 'inventory' && (
            <Button type="submit" form="movement-form" variant="primary" fullWidth loading={loading}>
              Apply Movement
            </Button>
          )}
          {activeTab === 'employees' && (
            <Button
              type="submit"
              form="employee-form"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={Boolean(employeeFeedback)}
            >
              Add Team Member
            </Button>
          )}
          <Button type="button" variant="ghost" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </aside>
    </>
  );
}
