import React, { useState } from 'react';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('img', imgFile);
    formData.append('content', content);
    formData.append('tags', tags.split(',').map(tag => tag.trim()));

    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create blog post');
      }

      setSuccess('Blog post created successfully!');
      // Clear form fields only after successful submission
      setTitle('');
      setImgFile(null);
      setContent('');
      setTags('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="add-blog-container">
      <h2>Add Blog</h2>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form className="add-blog-form" onSubmit={handleSubmit}>
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
            required
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
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
