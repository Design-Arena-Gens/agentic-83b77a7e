import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAllOrders, getAllCakes } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, cakesRes] = await Promise.all([
        getDashboardStats(),
        getAllOrders(),
        getAllCakes(),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setCakes(cakesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getPendingOrdersCount = () => {
    return orders.filter(order => order.status === 'PENDING').length;
  };

  const getInProgressOrdersCount = () => {
    return orders.filter(order => order.status === 'IN_PROGRESS').length;
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">${stats.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending Orders</h3>
              <p className="stat-value">{getPendingOrdersCount()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>In Progress</h3>
              <p className="stat-value">{getInProgressOrdersCount()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🍰</div>
            <div className="stat-info">
              <h3>Total Cakes</h3>
              <p className="stat-value">{cakes.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>In Stock</h3>
              <p className="stat-value">
                {cakes.filter(cake => cake.inStock).length}
              </p>
            </div>
          </div>
        </div>

        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user.name}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
