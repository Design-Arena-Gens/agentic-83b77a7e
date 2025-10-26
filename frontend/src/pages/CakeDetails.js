import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCakeById, getReviewsByCakeId, createReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CakeDetails.css';

const CakeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [cake, setCake] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchCakeDetails();
    fetchReviews();
  }, [id]);

  const fetchCakeDetails = async () => {
    try {
      const response = await getCakeById(id);
      setCake(response.data);
    } catch (error) {
      console.error('Error fetching cake details:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getReviewsByCakeId(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (cake) {
      addToCart(cake, quantity, customMessage);
      alert('Cake added to cart!');
      navigate('/cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      navigate('/login');
      return;
    }

    try {
      await createReview({ cakeId: parseInt(id), rating, comment });
      alert('Review submitted successfully!');
      setRating(5);
      setComment('');
      fetchReviews();
      fetchCakeDetails();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (!cake) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="cake-details">
      <div className="container">
        <div className="details-grid">
          <div className="cake-image-large">
            {cake.imageUrl ? (
              <img src={cake.imageUrl} alt={cake.name} />
            ) : (
              <div className="no-image-large">🍰</div>
            )}
          </div>

          <div className="cake-details-info">
            <h1>{cake.name}</h1>
            <div className="rating-large">
              {'⭐'.repeat(Math.round(cake.rating))} ({cake.reviewCount} reviews)
            </div>
            <p className="price-large">${cake.price.toFixed(2)}</p>

            <div className="details-section">
              <h3>Details</h3>
              <p><strong>Flavor:</strong> {cake.flavor}</p>
              <p><strong>Size:</strong> {cake.size}</p>
              <p><strong>Occasion:</strong> {cake.occasion}</p>
              <p><strong>Status:</strong> {cake.inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>
            </div>

            <div className="details-section">
              <h3>Description</h3>
              <p>{cake.description}</p>
            </div>

            {cake.ingredients && (
              <div className="details-section">
                <h3>Ingredients</h3>
                <p>{cake.ingredients}</p>
              </div>
            )}

            <div className="details-section">
              <h3>Customize Your Cake</h3>
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <label>Custom Message (optional):</label>
              <input
                type="text"
                placeholder="e.g., Happy Birthday John!"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary btn-large"
              disabled={!cake.inStock}
            >
              {cake.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {user && (
            <div className="review-form">
              <h3>Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <label>Rating:</label>
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
                <label>Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  required
                />
                <button type="submit" className="btn-primary">Submit Review</button>
              </form>
            </div>
          )}

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <strong>{review.user.name}</strong>
                    <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeDetails;
