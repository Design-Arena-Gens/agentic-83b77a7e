import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter(order => order.status === filter);

  return (
    <div className="admin-orders">
      <div className="container">
        <h1>Manage Orders</h1>

        <div className="filter-buttons">
          <button
            className={filter === 'ALL' ? 'active' : ''}
            onClick={() => setFilter('ALL')}
          >
            All Orders
          </button>
          <button
            className={filter === 'PENDING' ? 'active' : ''}
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button
            className={filter === 'IN_PROGRESS' ? 'active' : ''}
            onClick={() => setFilter('IN_PROGRESS')}
          >
            In Progress
          </button>
          <button
            className={filter === 'DELIVERED' ? 'active' : ''}
            onClick={() => setFilter('DELIVERED')}
          >
            Delivered
          </button>
        </div>

        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div key={order.id} className="admin-order-card">
              <div className="order-card-header">
                <h3>Order #{order.id}</h3>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-info">
                  <p><strong>Customer:</strong> {order.user.name}</p>
                  <p><strong>Email:</strong> {order.user.email}</p>
                  <p><strong>Phone:</strong> {order.phoneNumber}</p>
                  <p><strong>Address:</strong> {order.deliveryAddress}</p>
                  {order.specialInstructions && (
                    <p><strong>Instructions:</strong> {order.specialInstructions}</p>
                  )}
                  <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  {order.orderItems.map(item => (
                    <div key={item.id} className="order-item-row">
                      <span>{item.cake.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                </div>

                <div className="status-update">
                  <label>Update Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <p className="no-orders">No orders found for this filter.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
