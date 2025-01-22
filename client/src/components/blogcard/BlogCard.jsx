import React from 'react';
import { Link } from 'react-router-dom';
import './blogcard.css';

const BlogCard = ({ blog }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    return (
       
            <div className="home-blog-card">
                 <Link to={`/blogs/${blog._id}`}>
                <div className="home-blog-img">
                    <img loading="lazy" src={blog.img} alt={blog.title} />
                </div>
                <div className="home-blog-details">
                    <div className="h-blog-card-tags">
                        {blog.tags.map((tag, index) => (
                            <p className="h-blog-tag" key={index}>
                                {tag}
                            </p>
                        ))}
                    </div>
                    <div className="h-product-title">
                        {blog.title}
                    </div>
                    <div className="h-product-subtitle">
                        {blog.content}
                    </div>
                </div>
                </Link>
            </div>
    );
}

export default BlogCard;
