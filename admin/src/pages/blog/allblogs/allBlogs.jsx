import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaTags } from 'react-icons/fa';
import './allblogs.css';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTag, setFilterTag] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/blogs/');
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.ok) {
                    setBlogs(blogs.filter(blog => blog._id !== id));
                }
            } catch (error) {
                console.error('Error deleting blog:', error);
            }
        }
    };

    // Extract all unique tags from blogs
    useEffect(() => {
        const tags = new Set();
        blogs.forEach(blog => {
            blog.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
    }, [blogs]);

    const filteredBlogs = blogs
        .filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                blog.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTag = filterTag === 'all' || blog.tags?.includes(filterTag);
            return matchesSearch && matchesTag;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'recent': return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
                case 'title': return a.title.localeCompare(b.title);
                default: return 0;
            }
        });

    return (
        <div className="blogs-container">
            <div className="blogs-header">
                <div className="header-title">
                    <h1>Blog Management</h1>
                    <p>Create and manage your blog posts</p>
                </div>
                <Link to="/admin/add-blog" className="add-blog-btn">
                    <FaPlus /> New Blog Post
                </Link>
            </div>

            <div className="blog-filters">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select 
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                    >
                        <option value="all">All Tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title A-Z</option>
                    </select>
                </div>
            </div>

            <div className="blogs-grid">
                {filteredBlogs.map(blog => (
                    <div key={blog._id} className="blog-card">
                        <div className="blog-image">
                            <img src={blog.img} alt={blog.title} />
                            <div className="blog-actions">
                                <Link to={`/admin/edit-blog/${blog._id}`} className="edit-btn">
                                    <FaEdit size={16} />
                                </Link>
                                <button onClick={() => handleDelete(blog._id)} className="delete-btn">
                                    <FaTrash size={16} />
                                </button>
                                <Link to={`${import.meta.env.VITE_REACT_CLIENT_URL}/blogs/${blog._id}`} className="view-btn">
                                    <FaEye size={16} />
                                </Link>
                            </div>
                        </div>
                        <div className="blog-content">
                            <h3>{blog.title}</h3>
                            <div className="blog-tags">
                                {blog.tags?.map(tag => (
                                    <span key={tag} className="tag">
                                        <FaTags /> {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="blog-excerpt">
                                {blog.content.substring(0, 150)}...
                            </p>
                            <div className="blog-meta">
                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;