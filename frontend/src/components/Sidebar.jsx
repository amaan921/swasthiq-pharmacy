import { NavLink } from 'react-router-dom';
import { MdOutlineDashboardCustomize, MdInventory } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { FiShoppingCart, FiSettings } from "react-icons/fi";
import { BiReceipt } from "react-icons/bi";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><GiMedicines /></div>
        <div>
          <h1 className="brand-name">SwasthiQ</h1>
          <p className="brand-sub">Pharmacy Management</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <span className="nav-icon"><MdOutlineDashboardCustomize /></span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon"><MdInventory /></span>
          <span>Inventory</span>
        </NavLink>
        <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
          <span className="nav-icon"><BiReceipt /></span>
          <span>Sales</span>
        </a>
        <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
          <span className="nav-icon"><FiShoppingCart /></span>
          <span>Purchase</span>
        </a>
        <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
          <span className="nav-icon"><FiSettings /></span>
          <span>Settings</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">AK</div>
          <div>
            <p className="user-name">Admin</p>
            <p className="user-role">Pharmacist</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
