import { FiEdit2 } from 'react-icons/fi';

const statusColors = {
  'Active': '#22c55e',
  'Low Stock': '#f97316',
  'Expired': '#ef4444',
  'Out of Stock': '#6b7280',
  'Completed': '#22c55e',
  'Returned': '#ef4444',
  'Pending': '#f97316',
};

function StatusBadge({ status }) {
  const color = statusColors[status] || '#6b7280';
  return (
    <span
      className="status-badge"
      style={{
        background: color + '18',
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {status}
    </span>
  );
}

export default function MedicineTable({ medicines, onEdit }) {
  if (!medicines || medicines.length === 0) {
    return (
      <div className="empty-state">
        <p>💊 No medicines found</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Category</th>
            <th>Batch No</th>
            <th>Expiry Date</th>
            <th>Qty</th>
            <th>MRP (₹)</th>
            <th>Supplier</th>
            <th>Status</th>
            {onEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => (
            <tr key={med.id}>
              <td>
                <div className="medicine-info">
                  <span className="medicine-name">{med.name}</span>
                  <span className="medicine-generic">{med.generic_name}</span>
                </div>
              </td>
              <td><span className="category-tag">{med.category}</span></td>
              <td className="mono">{med.batch_no}</td>
              <td>{med.expiry_date}</td>
              <td className={med.quantity < 10 ? 'low-qty' : ''}>{med.quantity}</td>
              <td>₹{med.mrp?.toFixed(2)}</td>
              <td>{med.supplier}</td>
              <td><StatusBadge status={med.status} /></td>
              {onEdit && (
                <td>
                  <button className="btn-icon" onClick={() => onEdit(med)} title="Edit medicine">
                    <FiEdit2 />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
