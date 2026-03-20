import { useState, useEffect } from 'react';
import api from '../api';

const categories = [
  'Analgesic', 'Antibiotic', 'Antihistamine', 'Antidiabetic',
  'Antacid', 'Cardiovascular', 'Dermatology', 'Other',
];

const emptyForm = {
  name: '', generic_name: '', category: 'Analgesic', batch_no: '',
  expiry_date: '', quantity: '', cost_price: '', mrp: '', supplier: '',
};

export default function AddMedicineModal({ isOpen, onClose, onAdded, editData }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || '',
        generic_name: editData.generic_name || '',
        category: editData.category || 'Analgesic',
        batch_no: editData.batch_no || '',
        expiry_date: editData.expiry_date || '',
        quantity: String(editData.quantity ?? ''),
        cost_price: String(editData.cost_price ?? ''),
        mrp: String(editData.mrp ?? ''),
        supplier: editData.supplier || '',
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        quantity: parseInt(form.quantity, 10),
        cost_price: parseFloat(form.cost_price),
        mrp: parseFloat(form.mrp),
      };
      if (isEdit) {
        await api.put(`/api/inventory/${editData.id}`, payload);
      } else {
        await api.post('/api/inventory/', payload);
      }
      onAdded();
      onClose();
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'add'} medicine`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Medicine' : 'Add New Medicine'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Paracetamol 500mg" />
            </div>
            <div className="form-group">
              <label>Generic Name *</label>
              <input name="generic_name" value={form.generic_name} onChange={handleChange} required placeholder="e.g. Acetaminophen" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Batch No *</label>
              <input name="batch_no" value={form.batch_no} onChange={handleChange} required placeholder="e.g. BT-2025-001" />
            </div>
            <div className="form-group">
              <label>Expiry Date *</label>
              <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Cost Price (₹)</label>
              <input type="number" step="0.01" name="cost_price" value={form.cost_price} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>MRP (₹)</label>
              <input type="number" step="0.01" name="mrp" value={form.mrp} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group full-width">
              <label>Supplier</label>
              <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="e.g. PharmaCorp India" />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? '✓ Update Medicine' : '+ Add Medicine')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
