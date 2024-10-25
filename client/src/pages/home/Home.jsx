import React, {useEffect, useState} from 'react'
import './home.css';
import ProductCard from '../../components/productcard/ProductCard';
import BlogCard from '../../components/blogcard/BlogCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/');
        const data = await response.json();
        setProducts(data.slice(0, 4)); // Get only the first 4 products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs/');
        const data = await response.json();
        setBlogs(data.slice(0, 3)); // Get only the first 4 products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='home'>
      <div className="hero section container">
        <img src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div>
      <div className="about section container">
        <div className="about-head">
          <div className="section_centre_title">
            About Us
          </div>
          <div className="section_centre_subtitle">
            Order now and appreciate the quality
          </div>
        </div>

        <div className="about-items">
          <div className="about-item">
            <div className="about-item-i">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="about-item-title">
              Large Assortment
            </div>
            <div className="about-item-subtitle">
              we offer many different types of products with fewer variations in each category.
            </div>
          </div>
          <div className="about-item">
            <div className="about-item-i">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="about-item-title">
              Large Assortment
            </div>
            <div className="about-item-subtitle">
              we offer many different types of products with fewer variations in each category.
            </div>
          </div>
          <div className="about-item">
            <div className="about-item-i">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="about-item-title">
              Large Assortment
            </div>
            <div className="about-item-subtitle">
              we offer many different types of products with fewer variations in each category.
            </div>
          </div>
        </div>
      </div>
      <div className="categories section container">
        <div className="cat-head">
          <div className="section_centre_title">
            Categories
          </div>
          <div className="section_centre_subtitle">
            Find what you are looking for
          </div>
        </div>

<div className="cat-items">
    {['Cleansers', 'Treats', 'Serums'].map((category) => (
        <Link to={`/shop?category=${category}`} className="cat-item" key={category}>
            <div className="cat-item-img">
                <img src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt={category} />
            </div>
            <div className="cat-item-title">
                {category}
            </div>
        </Link>
    ))}
</div>
      </div>

      {/* <div className="hero section container">
        <img src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div> */}

      <div className="home-products section container">
        <div className="home-pro-head">
          <div className="section_left_title">
            Browse Our <strong>Products</strong>
          </div>
          <div className="view-all-btn">
            <span>View All</span>
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <hr />
        <div className="home-products-con">
        {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

      </div>
      <div className="home-blog section container">
        <div className="home-pro-head">
          <div className="section_left_title">
            Explore More About  <strong>Skincare</strong>
          </div>
          <div className="view-all-btn">
            <span>View All</span>
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <hr />
        <div className="home-blog-con">
        {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
      <div className="home-testimonials section container">
        <div className="home-pro-head">
          <div className="section_left_title">
            Our Happy  <strong>Customers</strong>
          </div>
        </div>
        <hr />
        <div className="home-testimonials-cards">
          <div className="h-testimonial-card">
            <p className='h-testimonial-stars'>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </p>
            <p className='h-testimonial-name'>lorem ipsum</p>
            <p className='h-testimonial-review'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, beatae facilis. Praesentium, vitae nulla doloribus ipsam eius expedita ad nisi veritatis optio sapiente reiciendis, asperiores itaque enim illum ut eligendi.</p>
          </div>
          <div className="h-testimonial-card">
            <p className='h-testimonial-stars'>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </p>
            <p className='h-testimonial-name'>lorem ipsum</p>
            <p className='h-testimonial-review'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, beatae facilis. Praesentium, vitae nulla doloribus ipsam eius expedita ad nisi veritatis optio sapiente reiciendis, asperiores itaque enim illum ut eligendi.</p>
          </div>
          <div className="h-testimonial-card">
            <p className='h-testimonial-stars'>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </p>
            <p className='h-testimonial-name'>lorem ipsum</p>
            <p className='h-testimonial-review'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, beatae facilis. Praesentium, vitae nulla doloribus ipsam eius expedita ad nisi veritatis optio sapiente reiciendis, asperiores itaque enim illum ut eligendi.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home