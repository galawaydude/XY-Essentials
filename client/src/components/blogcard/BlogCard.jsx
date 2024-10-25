import React from 'react';
import './blogcard.css';

const BlogCard = ({ blog }) => {
    return (
        <div className="home-blog-card">
            <div className="home-blog-img">
                <img src={blog.img} alt={blog.title} />
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
        </div>
    );
}

export default BlogCard;
