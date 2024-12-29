import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './inventory.css';
import { FaSort, FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [filter, setFilter] = useState('all');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilter = (e) => {
        setFilter(e.target.value);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map(product => product._id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleDelete = async () => {
        try {
            await fetch(`http://localhost:5000/api/products/${productToDelete}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            fetchProducts();
            setModalVisible(false);
        } catch (error) {
            setError('Failed to delete product');
        }
    };

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'all' || 
                                (filter === 'low-stock' && product.stock < 10) ||
                                (filter === 'out-of-stock' && product.stock === 0);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortConfig.direction === 'asc') {
                return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            }
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        });

    if (loading) return <div className="loading-spinner">Loading inventory...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="inventory-container">
            <div className="inventory-header">
                <h1>Inventory Management</h1>
                <div className="header-actions">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <select className="filter-select" onChange={handleFilter} value={filter}>
                        <option value="all">All Products</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                    </select>
                    <Link to="/admin/add-product" className="add-product-btn">
                        <FaPlus /> Add Product
                    </Link>
                </div>
            </div>

            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedProducts.length === filteredProducts.length}
                                />
                            </th>
                            <th onClick={() => handleSort('name')}>
                                Product Info <FaSort />
                            </th>
                            <th onClick={() => handleSort('price')}>
                                Price <FaSort />
                            </th>
                            <th onClick={() => handleSort('stock')}>
                                Stock <FaSort />
                            </th>
                            <th onClick={() => handleSort('ordered')}>
                                Orders <FaSort />
                            </th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product._id} className={product.stock < 10 ? 'low-stock' : ''}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={() => handleSelectProduct(product._id)}
                                    />
                                </td>
                                <td className="product-info">
                                    <img src={product.images[0]} alt={product.name} />
                                    <div>
                                        <h4>{product.name}</h4>
                                        <span>{product.packaging}</span>
                                    </div>
                                </td>
                                <td>₹{product.price}</td>
                                <td>
                                    <span className={`stock-badge ${product.stock < 10 ? 'low' : 'normal'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td>{product.ordered || 0}</td>
                                <td>
                                    <span className={`status-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <div className="action-buttons">
                                        <Link to={`http://localhost:5173/products/${product._id}`} className="action-btn view" title="View Product">
                                            <FaEye />
                                        </Link>
                                        <Link to={`/admin/edit-product/${product._id}`} className="action-btn edit" title="Edit Product">
                                            <FaEdit />
                                        </Link>
                                        <button 
                                            className="action-btn delete"
                                            onClick={() => {
                                                setProductToDelete(product._id);
                                                setModalVisible(true);
                                            }}
                                            title="Delete Product"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Delete Product</h3>
                        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn-confirm" onClick={handleDelete}>Delete</button>
                            <button className="btn-cancel" onClick={() => setModalVisible(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
