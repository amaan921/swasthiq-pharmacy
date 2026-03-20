import { useState, useEffect, useRef } from 'react';
import api from '../api';
import StatCard from '../components/StatCard';
import MedicineTable from '../components/MedicineTable';
import AddMedicineModal from '../components/AddMedicineModal';
import { TiTick } from "react-icons/ti";
import { RiSlowDownFill } from "react-icons/ri";
import { AiFillMedicineBox } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";

const statusFilters = ['All', 'Active', 'Low Stock', 'Expired', 'Out of Stock'];
const categoryFilters = ['All', 'Analgesic', 'Antibiotic', 'Antihistamine', 'Antidiabetic', 'Antacid', 'Cardiovascular'];

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);
  const debounceRef = useRef(null);

  const fetchData = (searchVal = '', status = 'All', category = 'All') => {
    const params = {};
    if (searchVal) params.search = searchVal;
    if (status !== 'All') params.status = status;
    if (category !== 'All') params.category = category;

    Promise.all([
      api.get('/api/inventory/', { params }),
      api.get('/api/inventory/overview'),
    ])
      .then(([med, ov]) => {
        setMedicines(med.data);
        setOverview(ov.data);
      })
      .catch(() => setError('Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetchData(val, statusFilter, categoryFilter);
    }, 400);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setLoading(true);
    fetchData(search, status, categoryFilter);
  };

  const handleCategoryFilter = (cat) => {
    setCategoryFilter(cat);
    setLoading(true);
    fetchData(search, statusFilter, cat);
  };

  const handleMedicineAdded = () => {
    setLoading(true);
    fetchData(search, statusFilter, categoryFilter);
  };

  const handleEdit = (medicine) => {
    setEditMedicine(medicine);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditMedicine(null);
  };

  if (loading && !medicines.length)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading inventory...</p>
      </div>
    );
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Manage your medicine stock and inventory.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditMedicine(null); setModalOpen(true); }}>
          + Add Medicine
        </button>
      </div>

      {overview && (
        <div className="stats-grid">
          <StatCard icon={<AiFillMedicineBox />} title="Total Medicines" value={overview.total} color="#6366f1" />
          <StatCard icon={<TiTick />} title="Active" value={overview.active} color="#22c55e" />
          <StatCard icon={<RiSlowDownFill />} title="Low Stock" value={overview.low_stock} color="#f97316" />
          <StatCard
            icon="💰"
            title="Inventory Value"
            value={`₹${overview.total_value?.toLocaleString('en-IN')}`}
            color="#8b5cf6"
          />
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon"><IoIosSearch /></span>
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={handleSearch}
              id="medicine-search"
            />
          </div>
          <div className="filter-pills">
            {statusFilters.map((s) => (
              <button
                key={s}
                className={`pill ${statusFilter === s ? 'active' : ''}`}
                onClick={() => handleStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="filter-select">
            <select value={categoryFilter} onChange={(e) => handleCategoryFilter(e.target.value)}>
              {categoryFilters.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>
        </div>

        <MedicineTable medicines={medicines} onEdit={handleEdit} />
      </div>

      <AddMedicineModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onAdded={handleMedicineAdded}
        editData={editMedicine}
      />
    </div>
  );
}
