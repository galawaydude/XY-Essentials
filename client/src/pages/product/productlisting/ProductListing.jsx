import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../../components/productcard/ProductCard';
import './productlisting.css';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSkinType, setSelectedSkinType] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedRating, setSelectedRating] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const category = query.get('category');
        const querySearch = query.get('query');

        if (category) {
            setSelectedCategory(category);
        }
        if (querySearch) {
            setSearchQuery(querySearch);
        }
    }, [location]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const params = new URLSearchParams(location.search);
        if (query) {
            params.set('query', query);
        } else {
            params.delete('query');
        }
        navigate({ search: params.toString() });
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSelectedSkinType('');
        setSelectedType('');
        setPriceRange([0, 1000]);
        setSelectedRating('');
        setSearchQuery('');
        navigate({ search: '' });
    };

    const filteredProducts = products.filter(product => {
        const passesCategory = selectedCategory === '' || product.category === selectedCategory;
        const passesSkinType = selectedSkinType === '' || product.skinType === selectedSkinType;
        const passesType = selectedType === '' || product.type === selectedType;
        const passesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const passesRating = selectedRating === '' || product.rating >= selectedRating;
        const passesPackaging = product.packaging !== 'Sachet';
        const passesSearchQuery = searchQuery === '' || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase());

        return passesSearchQuery && 
               passesPackaging && 
               passesCategory && 
               passesSkinType && 
               passesType && 
               passesPrice && 
               passesRating;
    });

    return (
        <div className="product-details">
            <div className="section">
                <div className="home-pro-head">
                    <div className="section_left_title">
                        All <strong>Products</strong>
                    </div>
                </div>
                <hr />

                <div className="plp-main-container">
                    <div className="plp-filter-sidebar">
                        <div className="plp-search-container">
                            <input
                                type="text"
                                className="plp-search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="plp-filter-section">
                            <div className="plp-filter-header">
                                <h6 className="plp-filter-title">Filters</h6>
                                <button 
                                    className="plp-filter-button"
                                    onClick={handleClearFilters}
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>

                        <div className="plp-filter-section">
                            <div className="plp-filter-header">
                                <p className="plp-filter-title">Categories</p>
                            </div>
                            <div className="plp-filter-group">
                                {['Cleanse', 'Protect', 'Treat'].map((category) => (
                                    <label className="plp-filter-option" key={category}>
                                        <input
                                            type="checkbox"
                                            className="plp-filter-checkbox"
                                            checked={selectedCategory === category}
                                            onChange={() => setSelectedCategory(
                                                category === selectedCategory ? '' : category
                                            )}
                                        />
                                        <span className="plp-filter-label">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="plp-filter-section">
                            <div className="plp-filter-header">
                                <p className="plp-filter-title">Skin Type</p>
                            </div>
                            <div className="plp-filter-group">
                                {['Dry', 'Oily'].map((skinType) => (
                                    <label className="plp-filter-option" key={skinType}>
                                        <input
                                            type="checkbox"
                                            className="plp-filter-checkbox"
                                            checked={selectedSkinType === skinType}
                                            onChange={() => setSelectedSkinType(
                                                skinType === selectedSkinType ? '' : skinType
                                            )}
                                        />
                                        <span className="plp-filter-label">{skinType}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* <div className="plp-filter-section">
                            <div className="plp-filter-header">
                                <p className="plp-filter-title">Minimum Rating</p>
                            </div>
                            <div className="plp-filter-group">
                                {[
                                    { value: '', label: 'All Ratings' },
                                    { value: 4, label: '4+ Stars' },
                                    { value: 4.5, label: '4.5+ Stars' },
                                    { value: 5, label: '5 Stars' }
                                ].map((rating) => (
                                    <label className="plp-filter-option" key={rating.value}>
                                        <input
                                            type="radio"
                                            className="plp-filter-checkbox"
                                            name="rating"
                                            checked={selectedRating === rating.value}
                                            onChange={() => setSelectedRating(rating.value)}
                                        />
                                        <span className="plp-filter-label">{rating.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div> */}
                    </div>

                    <div className="plp-products-grid">
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