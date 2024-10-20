import React from 'react'
import './blogcard.css'

const BlogCard = () => {
    return (
        <div className="home-blog-card">
        <div className="home-blog-img">
          <img src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        </div>
        <div className="home-blog-details">
          <div className="h-blog-card-tags">
            <p className="h-blog-tag">
              Lorem ipsum
            </p>
          </div>
          <div className="h-product-title">
            Lorem ipsum dolor, sit amet Lorem ipsum dolor, sit amet
          </div>
          <div className="h-product-subtitle">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. A porro veniam aut exercitationem harum magnam tenetur deleniti,
          </div>
        </div>
      </div>
    )
}

export default BlogCard