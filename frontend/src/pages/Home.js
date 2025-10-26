import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCakes, searchCakes } from '../services/api';
import { useCart } from '../context/CartContext';
import './Home.css';

const Home = () => {
  const [cakes, setCakes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFlavor, setFilterFlavor] = useState('');
  const [filterOccasion, setFilterOccasion] = useState('');
  const { addToCart } = useCart();

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

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await searchCakes(searchTerm);
        setCakes(response.data);
      } catch (error) {
        console.error('Error searching cakes:', error);
      }
    } else {
      fetchCakes();
    }
  };

  const handleAddToCart = (cake) => {
    addToCart(cake, 1);
    alert('Cake added to cart!');
  };

  const filteredCakes = cakes.filter(cake => {
    if (filterFlavor && cake.flavor !== filterFlavor) return false;
    if (filterOccasion && cake.occasion !== filterOccasion) return false;
    return true;
  });

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Our Cake Shop</h1>
        <p>Delicious cakes for every occasion</p>
      </div>

      <div className="container">
        <div className="search-filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn-primary">Search</button>
          </div>

          <div className="filters">
            <select value={filterFlavor} onChange={(e) => setFilterFlavor(e.target.value)}>
              <option value="">All Flavors</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Vanilla">Vanilla</option>
              <option value="Strawberry">Strawberry</option>
              <option value="Red Velvet">Red Velvet</option>
              <option value="Lemon">Lemon</option>
            </select>

            <select value={filterOccasion} onChange={(e) => setFilterOccasion(e.target.value)}>
              <option value="">All Occasions</option>
              <option value="Birthday">Birthday</option>
              <option value="Wedding">Wedding</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Baby Shower">Baby Shower</option>
            </select>

            <button onClick={() => { setFilterFlavor(''); setFilterOccasion(''); }} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="cakes-grid">
          {filteredCakes.length > 0 ? (
            filteredCakes.map(cake => (
              <div key={cake.id} className="cake-card">
                <div className="cake-image">
                  {cake.imageUrl ? (
                    <img src={cake.imageUrl} alt={cake.name} />
                  ) : (
                    <div className="no-image">🍰</div>
                  )}
                </div>
                <div className="cake-info">
                  <h3>{cake.name}</h3>
                  <p className="flavor">{cake.flavor}</p>
                  <p className="occasion">{cake.occasion}</p>
                  <div className="rating">
                    {'⭐'.repeat(Math.round(cake.rating))} ({cake.reviewCount} reviews)
                  </div>
                  <p className="price">${cake.price.toFixed(2)}</p>
                  <div className="cake-actions">
                    <Link to={`/cakes/${cake.id}`} className="btn-secondary">View Details</Link>
                    <button onClick={() => handleAddToCart(cake)} className="btn-primary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-cakes">No cakes found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
