import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import "../addproduct/addproduct.css";

const EditProduct = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [],
        claims: [''],
        suitableFor: [''],
        keyIngredients: [{ ingredient: '', description: '' }],
        whatMakesItWorthUsing: '',
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleKeyIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const updatedIngredients = [...product.keyIngredients];
        updatedIngredients[index][name] = value;
        setProduct({ ...product, keyIngredients: updatedIngredients });
    };

    const addKeyIngredient = () => {
        setProduct({
            ...product,
            keyIngredients: [...product.keyIngredients, { ingredient: '', description: '' }],
        });
    };

    const addClaim = () => {
        setProduct({
            ...product,
            claims: [...product.claims, ''],
        });
    };

    const addSuitableFor = () => {
        setProduct({
            ...product,
            suitableFor: [...product.suitableFor, ''],
        });
    };

    const handleClaimChange = (index, value) => {
        const updatedClaims = [...product.claims];
        updatedClaims[index] = value;
        setProduct({ ...product, claims: updatedClaims });
    };

    const handleSuitableForChange = (index, value) => {
        const updatedSuitableFor = [...product.suitableFor];
        updatedSuitableFor[index] = value;
        setProduct({ ...product, suitableFor: updatedSuitableFor });
    };

    const deleteClaim = (index) => {
        const updatedClaims = product.claims.filter((_, i) => i !== index);
        setProduct({ ...product, claims: updatedClaims });
    };

    const deleteSuitableFor = (index) => {
        const updatedSuitableFor = product.suitableFor.filter((_, i) => i !== index);
        setProduct({ ...product, suitableFor: updatedSuitableFor });
    };

    const deleteKeyIngredient = (index) => {
        const updatedIngredients = product.keyIngredients.filter((_, i) => i !== index);
        setProduct({ ...product, keyIngredients: updatedIngredients });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setProduct({ ...product, images: files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Handle regular fields
        Object.keys(product).forEach(key => {
            if (key === 'keyIngredients') {
                formData.append('keyIngredients', JSON.stringify(product.keyIngredients));
            } else if (key === 'images') {
                // Skip the images array here as we'll handle files separately
                return;
            } else if (Array.isArray(product[key])) {
                product[key].forEach(item => {
                    formData.append(key, item);
                });
            } else {
                formData.append(key, product[key]);
            }
        });

        // Handle image files
        const fileInput = document.querySelector('#images');
        if (fileInput && fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach(file => {
                formData.append('productImages', file);
            });
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }
            
            const data = await response.json();
            console.log('Product updated:', data);
            navigate('/admin/inventory');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product: ' + error.message);
        }
    };

    return (
        <div className="add-product-maincon">
            <div className="add-product-content">
                <h2 className="add-product-head">Edit Product</h2>
                <form className="add-product-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />

                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="4" placeholder="Product Description" value={product.description} onChange={handleChange} required></textarea>

                    <label htmlFor="price">Actual Price</label>
                    <input type="number" id="price" name="price" placeholder="Product Price" value={product.price} onChange={handleChange} required />

                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" value={product.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="SPF + Moisturizer">SPF + Moisturizer</option>
                        <option value="Cleanse">Cleanse</option>
                        <option value="Serums">Serums</option>
                    </select>

                    <label htmlFor="stock">Stock</label>
                    <input type="number" id="stock" name="stock" placeholder="Stock Quantity" value={product.stock} onChange={handleChange} required />

                    <label htmlFor="images">Upload Images</label>
                    <input type="file" id="images" name="images" multiple onChange={handleImageUpload} />

                    <h3>Claims</h3>
                    {product.claims.map((claim, index) => (
                        <div key={index} className="claim">
                            <input
                                type="text"
                                placeholder="Claim"
                                value={claim}
                                onChange={(e) => handleClaimChange(index, e.target.value)}
                                required
                            />
                            <FaTrash onClick={() => deleteClaim(index)} style={{ cursor: 'pointer', color: 'red' }} />
                        </div>
                    ))}
                    <button type="button" onClick={addClaim}>Add Claim</button>

                    <h3>Suitable For</h3>
                    {product.suitableFor.map((item, index) => (
                        <div key={index} className="suitable-for">
                            <input
                                type="text"
                                placeholder="Suitable For"
                                value={item}
                                onChange={(e) => handleSuitableForChange(index, e.target.value)}
                                required
                            />
                            <FaTrash onClick={() => deleteSuitableFor(index)} style={{ cursor: 'pointer', color: 'red' }} />
                        </div>
                    ))}
                    <button type="button" onClick={addSuitableFor}>Add Suitable For</button>

                    <h3>Key Ingredients</h3>
                    {product.keyIngredients.map((ingredient, index) => (
                        <div key={index} className="key-ingredient">
                            <label htmlFor={`ingredient-${index}`}>Ingredient</label>
                            <div className="key-ingredient-inputs">
                                <input
                                    type="text"
                                    id={`ingredient-${index}`}
                                    name="ingredient"
                                    value={ingredient.ingredient}
                                    onChange={(e) => handleKeyIngredientChange(index, e)}
                                    required
                                />
                                <FaTrash onClick={() => deleteKeyIngredient(index)} style={{ cursor: 'pointer', color: 'red' }} />
                            </div>
                            <label htmlFor={`description-${index}`}>Description</label>
                            <div className="key-ingredient-inputs">
                                <input
                                    type="text"
                                    id={`description-${index}`}
                                    name="description"
                                    value={ingredient.description}
                                    onChange={(e) => handleKeyIngredientChange(index, e)}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addKeyIngredient}>Add Key Ingredient</button>

                    <label htmlFor="whatMakesItWorthUsing">What Makes It Worth Using</label>
                    <textarea id="whatMakesItWorthUsing" name="whatMakesItWorthUsing" rows="4" placeholder="Value Proposition" value={product.whatMakesItWorthUsing} onChange={handleChange}></textarea>

                    <button type="submit">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;