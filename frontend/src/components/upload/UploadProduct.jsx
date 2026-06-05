import React, { useState } from 'react';
import './uploadProduct.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UploadProduct = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('productImage', selectedFile);
      formData.append('productTitle', data.productTitle);
      formData.append('productDescription', data.productDescription);
      formData.append('productPrice', data.productPrice);
      formData.append('productCategory', data.productCategory);

      const res = await axios.post('http://localhost:3000/api/product/upload-product', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(res.data.message);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Upload failed!';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1>Upload New Product</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="upload-form">
          <div className="form-group">
            <label htmlFor="productImage">Product Image</label>
            <div className="file-upload">
              {filePreview ? (
                <div className="file-preview">
                  <img src={filePreview} alt="Product preview" />
                  <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); }}>Change Image</button>
                </div>
              ) : (
                <div className="file-placeholder">
                  <span>Click to select or drag and drop</span>
                </div>
              )}
              <input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productTitle">Product Title</label>
            <input
              type="text"
              id="productTitle"
              {...register('productTitle', { required: 'Title is required' })}
              placeholder="Enter product title"
            />
            {errors.productTitle && <p className="error">{errors.productTitle.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="productPrice">Price (₹)</label>
            <input
              type="number"
              id="productPrice"
              {...register('productPrice', { required: 'Price is required', min: { value: 1, message: 'Price must be at least 1' } })}
              placeholder="Enter product price"
            />
            {errors.productPrice && <p className="error">{errors.productPrice.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="productCategory">Category</label>
            <input
              type="text"
              id="productCategory"
              {...register('productCategory', { required: 'Category is required' })}
              placeholder="e.g., Fruits, Vegetables, Herbs"
            />
            {errors.productCategory && <p className="error">{errors.productCategory.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              {...register('productDescription', { required: 'Description is required' })}
              placeholder="Describe your product..."
              rows="4"
            />
            {errors.productDescription && <p className="error">{errors.productDescription.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="upload-btn">
            {isSubmitting ? 'Uploading...' : 'Upload Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;