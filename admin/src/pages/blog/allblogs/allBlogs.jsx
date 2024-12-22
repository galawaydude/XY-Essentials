import React, { useEffect, useState } from 'react';
import '../../inventory/inventory.css';
import './allblogs.css';
import { Link } from 'react-router-dom';

const Blogs = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);

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

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/blogs/${blogToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }
            setBlogs(blogs.filter(blog => blog._id !== blogToDelete));
            setModalVisible(false);
            setBlogToDelete(null);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="inventory-maincon container">
            <div className="inventory-header">
                <h2>Blogs</h2>
                <div className="inventory-actions">
                    <input type="text" className="search-bar" placeholder="Search..." />
                    <Link to={'/admin/add-blog'}>
                        <button className="add-product-btn">Add Blog</button>
                    </Link>
                </div>
            </div>

            <div className="inven-cards">
                {blogs.map((blog) => (
                    <div className="inven-card" key={blog._id}>
                        <div className="ic-img">
                            <img
                                src={blog.img} // Changed to blog image
                                alt={blog.title} // Changed to blog title
                            />
                        </div>
                        <div className="ic-deets">
                            <p>{blog.title}</p> {/* Changed to blog title */}
                        </div>
                        <div className="ic-actions">
                            <Link to={`/blogs/${blog._id}`}>
                                <i className="fas fa-eye ic-action-icon" title="View"></i>
                            </Link>
                            <Link to={`/admin/edit-blog/${blog._id}`}>
                                <i className="fas fa-edit ic-action-icon" title="Edit"></i>
                            </Link>
                            <i
                                className="fas fa-trash-alt ic-action-icon"
                                title="Delete"
                                onClick={() => {
                                    setBlogToDelete(blog._id);
                                    setModalVisible(true);
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to delete this blog?</h3>
                        <div className="modal-actions">
                            <button onClick={handleDelete}>Yes, Delete</button>
                            <button onClick={() => setModalVisible(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Blogs;