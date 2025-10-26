import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCakeById, createCake, updateCake, uploadFile } from '../../services/api';
import './AddEditCake.css';

const AddEditCake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    flavor: '',
    price: '',
    description: '',
    size: 'Medium',
    occasion: '',
    ingredients: '',
    imageUrl: '',
    inStock: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchCake();
    }
  }, [id]);

  const fetchCake = async () => {
    try {
      const response = await getCakeById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching cake:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const response = await uploadFile(formData);
      setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cakeData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (isEditMode) {
        await updateCake(id, cakeData);
        alert('Cake updated successfully!');
      } else {
        await createCake(cakeData);
        alert('Cake created successfully!');
      }
      navigate('/admin/cakes');
    } catch (error) {
      console.error('Error saving cake:', error);
      alert('Failed to save cake');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-edit-cake">
      <div className="container">
        <h1>{isEditMode ? 'Edit Cake' : 'Add New Cake'}</h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Cake Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Flavor *</label>
                <select name="flavor" value={formData.flavor} onChange={handleChange} required>
                  <option value="">Select Flavor</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Vanilla">Vanilla</option>
                  <option value="Strawberry">Strawberry</option>
                  <option value="Red Velvet">Red Velvet</option>
                  <option value="Lemon">Lemon</option>
                  <option value="Carrot">Carrot</option>
                  <option value="Cheesecake">Cheesecake</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Size *</label>
                <select name="size" value={formData.size} onChange={handleChange} required>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Extra Large">Extra Large</option>
                </select>
              </div>

              <div className="form-group">
                <label>Occasion *</label>
                <select name="occasion" value={formData.occasion} onChange={handleChange} required>
                  <option value="">Select Occasion</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Corporate">Corporate</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  In Stock
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Ingredients</label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows="3"
                placeholder="List the main ingredients..."
              />
            </div>

            <div className="form-group">
              <label>Image Upload</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!imageFile || uploading}
                  className="btn-secondary"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              {formData.imageUrl && (
                <div className="image-preview">
                  <p>Current image:</p>
                  <img src={formData.imageUrl} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Image URL (optional if uploaded)</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Or paste image URL here"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update Cake' : 'Create Cake'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/cakes')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditCake;
