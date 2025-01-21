import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import './addblog.css';

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    if (!imgFile) {
      setError('Cover image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (imgFile) {
        formDataToSend.append('img', imgFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to create blog post');

      setSuccess('Blog post created successfully!');
      setTimeout(() => navigate('/admin/blogs'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-blog-container">
      <div className="add-blog-header">
        <h1>Create New Blog Post</h1>
        <button onClick={() => navigate('/admin/blogs')} className="back-btn">
          <FaTimes /> Cancel
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="add-blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blog Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter an engaging title"
            required
          />
        </div>

        <div className="form-group image-upload">
          <label>Cover Image</label>
          <div className="image-upload-area">
            {imgPreview ? (
              <div className="image-preview">
                <img loading="lazy" src={imgPreview} alt="Preview" />
                <button type="button" onClick={() => {
                  setImgFile(null);
                  setImgPreview(null);
                }}>
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <FaUpload />
                <span>Click or drag to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            rows="10"
            required
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas"
          />
          <small>Separate tags with commas (e.g., fashion, lifestyle, tips)</small>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/blogs')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><FaSpinner className="spinner" /> Publishing...</> : 'Publish Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
