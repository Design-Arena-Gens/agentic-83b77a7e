import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🍰 Cake Shop
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>

          {user ? (
            <>
              <li><Link to="/cart">Cart ({getCartCount()})</Link></li>
              <li><Link to="/orders">My Orders</Link></li>

              {isAdmin() && (
                <>
                  <li><Link to="/admin/dashboard">Dashboard</Link></li>
                  <li><Link to="/admin/cakes">Manage Cakes</Link></li>
                  <li><Link to="/admin/orders">Manage Orders</Link></li>
                </>
              )}

              <li>
                <span className="user-info">Hello, {user.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/cart">Cart ({getCartCount()})</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
