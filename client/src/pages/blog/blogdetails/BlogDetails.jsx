import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './blogdetails.css';

const BlogDetails = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams(); // Get the blog ID from the URL
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog details');
                }
                const data = await response.json();
                setBlog(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBlogDetails();
    }, [id]);

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    if (!blog) {
        return <div>Loading...</div>; // Loading state while fetching
    }

    return (
        <div className="blog-details-maincon container">
            <div className="bd-con">
                <div className="bd-title">
                    <h2>{blog.title}</h2>
                </div>
                <div className="bd-tags">
                    {blog.tags.map((tag, index) => (
                        <p className="bd-tag" key={index}>
                            {tag}
                        </p>
                    ))}
                </div>
                <div className="bd-img">
                    <img src={blog.img} alt={blog.title} />
                </div>
                <div className="bd-content">
                    {blog.content}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
