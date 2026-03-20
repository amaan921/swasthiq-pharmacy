import { useState, useEffect } from 'react';
import api from '../api';
import StatCard from '../components/StatCard';
import MedicineTable from '../components/MedicineTable';
import { BiSolidCapsule } from "react-icons/bi";
import { FaToolbox } from "react-icons/fa";
import { TiWarningOutline } from "react-icons/ti";
import { TbMoneybag } from "react-icons/tb";
import { FiShoppingCart } from "react-icons/fi";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Sales');

  useEffect(() => {
    Promise.all([
      api.get('/api/dashboard/summary'),
      api.get('/api/dashboard/recent-sales'),
      api.get('/api/dashboard/purchase-orders'),
      api.get('/api/inventory/'),
    ])
      .then(([s, sa, po, med]) => {
        setSummary(s.data);
        setSales(sa.data);
        setPurchaseOrders(po.data);
        setMedicines(med.data);
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  if (error) return <div className="error-screen">{error}</div>;

  const statusColors = {
    Completed: '#22c55e',
    Returned: '#ef4444',
    Pending: '#f97316',
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your pharmacy overview.</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards — Purchase Orders is now card #4 */}
      <div className="stats-grid">
        <StatCard
          icon={<TbMoneybag />}
          title="Today's Sales"
          value={`₹${summary.today_sales?.toLocaleString('en-IN')}`}
          trend={summary.sales_change_pct}
          color="#4ade80"
          iconBg="#14532d"
        />
        <StatCard
          icon={<FaToolbox />}
          title="Items Sold Today"
          value={summary.items_sold}
          color="#60a5fa"
          iconBg="#1e3a5f"
        />
        <StatCard
          icon={<TiWarningOutline />}
          title="Low Stock Alerts"
          value={summary.low_stock_count}
          color="#fb923c"
          iconBg="#431407"
        />
        <StatCard
          icon={<FiShoppingCart />}
          title="Purchase Orders"
          value={purchaseOrders ? `₹${purchaseOrders.total?.toLocaleString('en-IN')}` : '—'}
          subtitle={purchaseOrders ? `${purchaseOrders.pending} pending` : ''}
          color="#c084fc"
          iconBg="#3b0764"
        />
      </div>

      {/* Tab Row */}
      <div className="tab-row">
        <div className="tab-pills">
          {['Sales', 'Purchase', 'Inventory'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="tab-actions">
          <button className="btn-primary btn-sm">+ New Sale</button>
          <button className="btn-outline btn-sm">+ New Purchase</button>
        </div>
      </div>

      {/* Make a Sale — shown when Sales tab is active */}
      {activeTab === 'Sales' && (
        <div className="card sale-card">
          <p className="sale-hint">Select medicines from inventory</p>
          <div className="sale-controls">
            <input className="sale-input" placeholder="Patient Id" />
            <input className="sale-input sale-input-wide" placeholder="Search medicines..." />
            <button className="btn-primary btn-sm">Order</button>
            <button className="btn-danger btn-sm">Bill</button>
          </div>
        </div>
      )}

      {/* Medicine picker table (Sales/Inventory tab) */}
      {(activeTab === 'Sales' || activeTab === 'Inventory') && (
        <div className="card">
          <div className="card-header">
            <h2>{activeTab === 'Sales' ? 'Medicine Picker' : 'All Medicines'}</h2>
            <span className="badge">{medicines.length} items</span>
          </div>
          <MedicineTable medicines={medicines} />
        </div>
      )}

      {/* Purchase tab content */}
      {activeTab === 'Purchase' && purchaseOrders && (
        <div className="card">
          <div className="card-header">
            <h2>Purchase Orders</h2>
          </div>
          <div className="purchase-stats">
            <div className="purchase-stat">
              <span className="purchase-label">Total Value</span>
              <span className="purchase-value">₹{purchaseOrders.total?.toLocaleString('en-IN')}</span>
            </div>
            <div className="purchase-stat">
              <span className="purchase-label">Pending Orders</span>
              <span className="purchase-value accent">{purchaseOrders.pending}</span>
            </div>
            <div className="purchase-stat">
              <span className="purchase-label">Status</span>
              <span className="status-badge" style={{
                background: '#f9731618',
                color: '#f97316',
                border: '1px solid #f9731630',
              }}>
                {purchaseOrders.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sales — always visible at bottom */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Sales</h2>
          <span className="badge">{sales.length} transactions</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Patient</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="mono">{sale.invoice_no}</td>
                  <td>{sale.patient_name}</td>
                  <td className="amount">₹{sale.amount?.toLocaleString('en-IN')}</td>
                  <td>{sale.items}</td>
                  <td>
                    <span className="payment-tag">{sale.payment_mode}</span>
                  </td>
                  <td>{sale.date}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: (statusColors[sale.status] || '#6b7280') + '18',
                        color: statusColors[sale.status] || '#6b7280',
                        border: `1px solid ${(statusColors[sale.status] || '#6b7280')}30`,
                      }}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
