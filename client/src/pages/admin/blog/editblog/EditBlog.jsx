import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams(); // Get the blog post ID from the URL
  const navigate = useNavigate(); // For navigation after editing
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch blog post');
        }

        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags.join(', ')); // Convert tags array to comma-separated string
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBlogPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('img', imgFile); // You might need to handle image updates differently
    formData.append('content', content);
    formData.append('tags', tags.split(',').map(tag => tag.trim()));

    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog post');
      }

      setSuccess('Blog post updated successfully!');
      navigate(`/blogs/${id}`); // Redirect to the updated blog post page
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="edit-blog-container">
      <h2>Edit Blog</h2>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form className="edit-blog-form" onSubmit={handleSubmit}>
        <div className="input-component">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-component">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImgFile(e.target.files[0])}
          />
        </div>
        <div className="input-component">
          <label>Content</label>
          <textarea
            placeholder="Enter blog content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="input-component">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            placeholder="Enter tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
