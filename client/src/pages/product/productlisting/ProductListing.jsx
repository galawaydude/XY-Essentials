import React, { useEffect, useState } from 'react';
import './productlisting.css';
import ProductCard from '../../../components/productcard/ProductCard';
import { Link, useLocation } from 'react-router-dom'

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSkinType, setSelectedSkinType] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]); // Example price range
    const [selectedRating, setSelectedRating] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/');
                const data = await response.json();
                setProducts(data);
                // console.log('Fetched Products:', data); 
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const category = query.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [location]);



    const filteredProducts = products.filter(product => {
        const passesCategory = selectedCategory === '' || product.category === selectedCategory;
        const passesSkinType = selectedSkinType === '' || product.skinType === selectedSkinType || selectedSkinType === 'All';
        const passesType = selectedType === '' || product.type === selectedType;
        const passesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const passesRating = selectedRating === '' || product.rating >= selectedRating;
    
        // Log the product and whether it passes all filters
        // console.log(product, {
        //     passesCategory,
        //     passesSkinType,
        //     passesType,
        //     passesPrice,
        //     passesRating,
        //     passesAll: passesCategory && passesSkinType && passesType && passesPrice && passesRating
        // });
    
        return passesCategory && passesSkinType && passesType && passesPrice && passesRating;
    });
    

    // console.log('Filtered Products:', filteredProducts);

    return (
        <div className="product-details">
            <div className="text-nav-con container">
                <p>Home &gt; Shop </p>
            </div>

            <div className="section container">
                <div className="home-pro-head">
                    <div className="section_left_title">
                        Explore <strong>Products</strong>
                    </div>
                </div>
                <hr />

                <div className="shop-con">
                    <div className="shop-filter">
                        <input
                            type="text"
                            placeholder="Search products..."
                        // Implement search functionality as needed
                        />
                        <div className="filter-btn">
                            <button>Filter</button>
                        </div>

                        <div className='shop-filter-head'>
                            <h6>Filter</h6>
                        </div>

                        <div className="sf-subhead">
                            <p>Categories</p>
                            {['Protect', 'Cleanser', 'Treat'].map((category) => (
                                <div className="sf-item" key={category}>
                                    <input
                                        type="checkbox"
                                        id={category}
                                        name="category"
                                        checked={selectedCategory === category}
                                        onChange={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                                    />
                                    <label htmlFor={category}>{category}</label>
                                </div>
                            ))}
                        </div>

                        <div className="sf-subhead">
                            <p>Skin Type</p>
                            {['Dry', 'Oily'].map((skinType) => (
                                <div className="sf-item" key={skinType}>
                                    <input
                                        type="checkbox"
                                        id={skinType}
                                        name="skinType"
                                        checked={selectedSkinType === skinType}
                                        onChange={() => setSelectedSkinType(skinType === selectedSkinType ? '' : skinType)}
                                    />
                                    <label htmlFor={skinType}>{skinType}</label>
                                </div>
                            ))}
                        </div>

                        {/* <div className="sf-subhead">
                            <p>Product Type</p>
                            {['Moisturizer', 'Grooming', 'Scrub', 'Cleanser'].map((type) => (
                                <div className="sf-item" key={type}>
                                    <input
                                        type="checkbox"
                                        id={type}
                                        name="type"
                                        checked={selectedType === type}
                                        onChange={() => setSelectedType(type === selectedType ? '' : type)}
                                    />
                                    <label htmlFor={type}>{type}</label>
                                </div>
                            ))}
                        </div> */}

                        <div className="sf-subhead">
                            <p>Price Range</p>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            />
                            <p>Price: ${priceRange[0]} - ${priceRange[1]}</p>
                        </div>

                        {/* <div className="sf-subhead">
                            <p>Minimum Rating</p>
                            {['', 4, 4.5, 5].map((rating) => (
                                <div className="sf-item" key={rating}>
                                    <input
                                        type="radio"
                                        id={`rating-${rating}`}
                                        name="rating"
                                        checked={selectedRating === rating}
                                        onChange={() => setSelectedRating(rating)}
                                    />
                                    <label htmlFor={`rating-${rating}`}>{rating ? `≥ ${rating}` : 'All Ratings'}</label>
                                </div>
                            ))}
                        </div> */}
                    </div>

                    <div className="home-products-con">
                        {filteredProducts.map(product => (
              
                                <ProductCard product={product} key={product._id} />
                          
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductListing;
