import React, { useEffect, useState } from 'react';
// import './editProduct.css';
import { FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import {Link, useNavigate} from 'react-router-dom'

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming the product ID is in the URL
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
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
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

        for (const key in product) {
            if (Array.isArray(product[key])) {
                product[key].forEach((item) => {
                    if (typeof item === 'object') {
                        formData.append(key, JSON.stringify(item));
                    } else {
                        formData.append(key, item);
                    }
                });
            } else {
                formData.append(key, product[key]);
            }
        }

        product.images.forEach((image) => {
            if (image instanceof File) {
                formData.append('productImages', image);
            }
        });

        // Send the formData to the backend
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            console.log('Product updated:', data);
            navigate('/admin/inventory');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="edit-product-maincon">
            <div className="edit-product-content container">
                <h2 className="edit-product-head">Edit Product</h2>
                <form className="edit-product-form" onSubmit={handleSubmit}>
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
                        <option value="Cleaners">Cleaners</option>
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
                            <input
                                type="text"
                                id={`ingredient-${index}`}
                                name="ingredient"
                                value={ingredient.ingredient}
                                onChange={(e) => handleKeyIngredientChange(index, e)}
                                required
                            />
                            <label htmlFor={`description-${index}`}>Description</label>
                            <input
                                type="text"
                                id={`description-${index}`}
                                name="description"
                                value={ingredient.description}
                                onChange={(e) => handleKeyIngredientChange(index, e)}
                            />
                            <FaTrash onClick={() => deleteKeyIngredient(index)} style={{ cursor: 'pointer', color: 'red' }} />
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
