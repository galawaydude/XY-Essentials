import React from 'react';
import './bloglisting.css';
import BlogCard from '../../../components/blogcard/BlogCard';

const BlogListing = () => {
    return (
        <div className="blog-maincon ">
            <div className="blog-top-bg">
                <img src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Background" />
                <h1 className="blog-overlay-text">Blogs</h1>
            </div>

            <div className="blog-con container">
                <div className="blog-cards-con">
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                </div>
            </div>
        </div>
    );
};

export default BlogListing;
