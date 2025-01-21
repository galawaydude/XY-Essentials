import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import '../addblog/addblog.css';

const EditBlog = () => {
  const { id } = useParams();
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
  const [initialImage, setInitialImage] = useState('');

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch blog');
        
        const blog = await response.json();
        setFormData({
          title: blog.title,
          content: blog.content,
          tags: blog.tags.join(', ')
        });
        setImgPreview(blog.img);
        setInitialImage(blog.img);
      } catch (err) {
        setError('Failed to fetch blog details');
      }
    };

    fetchBlog();
  }, [id]);

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
    if (!imgPreview && !imgFile) {
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
      
      // Only append new image if it was changed
      if (imgFile) {
        formDataToSend.append('img', imgFile);
      } else if (initialImage) {
        formDataToSend.append('currentImage', initialImage);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to update blog post');

      setSuccess('Blog post updated successfully!');
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
        <h1>Edit Blog Post</h1>
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
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className="form-group image-upload">
          <label>Cover Image</label>
          <div className="image-upload-area">
            <div className="upload-placeholder  mb-2">
              <FaUpload />
              <span>Click or drag to upload new image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {/* {imgPreview && (
              <div className="image-preview  mt-2 overflow-hidden">
                <img loading="lazy" src={imgPreview} alt="Preview" className='overflow-hidden'/>
                <button type="button" onClick={() => {
                  setImgFile(null);
                  setImgPreview(initialImage);
                }}>
                  <FaTimes />
                </button>
              </div>
            )} */}
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
            {loading ? <><FaSpinner className="spinner" /> Updating...</> : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;

