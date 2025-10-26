import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCakes, deleteCake } from '../../services/api';
import './AdminCakes.css';

const AdminCakes = () => {
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const response = await getAllCakes();
      setCakes(response.data);
    } catch (error) {
      console.error('Error fetching cakes:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cake?')) {
      try {
        await deleteCake(id);
        alert('Cake deleted successfully!');
        fetchCakes();
      } catch (error) {
        console.error('Error deleting cake:', error);
        alert('Failed to delete cake');
      }
    }
  };

  return (
    <div className="admin-cakes">
      <div className="container">
        <div className="page-header">
          <h1>Manage Cakes</h1>
          <Link to="/admin/cakes/add" className="btn-primary">
            Add New Cake
          </Link>
        </div>

        <div className="cakes-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Flavor</th>
                <th>Price</th>
                <th>Occasion</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cakes.map(cake => (
                <tr key={cake.id}>
                  <td>{cake.id}</td>
                  <td>{cake.name}</td>
                  <td>{cake.flavor}</td>
                  <td>${cake.price.toFixed(2)}</td>
                  <td>{cake.occasion}</td>
                  <td>
                    <span className={cake.inStock ? 'badge-success' : 'badge-danger'}>
                      {cake.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>⭐ {cake.rating?.toFixed(1) || 'N/A'} ({cake.reviewCount})</td>
                  <td className="actions">
                    <Link to={`/admin/cakes/edit/${cake.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(cake.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCakes;
