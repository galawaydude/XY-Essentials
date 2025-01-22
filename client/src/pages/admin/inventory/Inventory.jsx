import React, { useEffect, useState } from 'react';
import './inventory.css';
import { Link } from 'react-router-dom';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setProducts(products.filter(product => product._id !== productToDelete));
            setModalVisible(false);
            setProductToDelete(null);
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
                <h2>Inventory</h2>
                <div className="inventory-actions">
                    <input type="text" className="search-bar" placeholder="Search..." />
                    <Link to={'/admin/add-product'}>
                        <button className="add-product-btn">Add Product</button>
                    </Link>
                </div>
            </div>

            <div className="inven-cards">
                {products.map((product) => (
                    <div className="inven-card" key={product._id}>
                        <div className="ic-img">
                            <img loading="lazy"
                                src={product.images[0]} // Assuming the product has an images property
                                alt={product.name}
                            />
                        </div>
                        <div className="ic-deets">
                            <p>{product.name}</p>
                            <p className="ic-price">Price: ${product.price} | In Stock: {product.stock}</p>
                        </div>
                        <div className="ic-actions">
                            <Link to={`/products/${product._id}`}>
                                <i className="fas fa-eye ic-action-icon" title="View"></i>
                            </Link>
                            <Link to={`/admin/edit-product/${product._id}`}>
                                <i className="fas fa-edit ic-action-icon" title="Edit"></i>
                            </Link>
                            <i
                                className="fas fa-trash-alt ic-action-icon"
                                title="Delete"
                                onClick={() => {
                                    setProductToDelete(product._id);
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
                        <h3>Are you sure you want to delete this product?</h3>
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

export default Inventory;
