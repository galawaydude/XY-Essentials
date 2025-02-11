import React, { useState } from 'react';
import './addproduct.css';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        packaging: '',
        category: '',
        skinType: '',
        stock: '',
        images: [],
        sizes: [''],
        claims: [''],
        suitableFor: [''],
        keyIngredients: [{ ingredient: '', description: '' }],
        whatMakesItWorthUsing: '',
    });

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
    const addSize = () => {
        setProduct({
            ...product,
            sizes: [...product.sizes, ''],
        });
    };

    const addSuitableFor = () => {
        setProduct({
            ...product,
            suitableFor: [...product.suitableFor, ''],
        });
    };

    const handleSizeChange = (index, value) => {
        const updatedSizes = [...product.sizes];
        updatedSizes[index] = value;
        setProduct({ ...product, sizes: updatedSizes });
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

    const deleteSize = (index) => {
        const updatedSizes = product.sizes.filter((_, i) => i !== index);
        setProduct({ ...product, sizes: updatedSizes });
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
        setProduct({ ...product, productImages: files }); // Change from productImages to images
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append product details to formData
        for (const key in product) {
            if (Array.isArray(product[key])) {
                if (key === 'keyIngredients') {
                    product[key].forEach((item) => {
                        formData.append(`${key}[]`, JSON.stringify(item)); // Append as JSON string with key as an array
                    });
                } else {
                    product[key].forEach((item) => {
                        formData.append(key, item); // Keep this for other arrays
                    });
                }
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await response.json();
            console.log('Product created:', data);
            navigate('/admin/inventory');
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };


    return (
        <div className="add-product-maincon">
            <div className="add-product-content">
                <h2 className="add-product-head">Add New Product</h2>
                <form className="add-product-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />

                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="4" placeholder="Product Description" value={product.description} onChange={handleChange} required></textarea>

                    <label htmlFor="price">Actual Price</label>
                    <input type="number" id="price" name="price" placeholder="Product Price" value={product.price} onChange={handleChange} required />

                    <label htmlFor="packaging">Packaging</label>
                    <select id="packaging" name="packaging" value={product.packaging} onChange={handleChange} required>
                        <option value="">Select Packaging</option>
                        <option value="Tube">Tube</option>
                        <option value="Sachet">Sachet</option>
                    </select>

                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" value={product.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="Cleanse">Cleanse</option>
                        <option value="Treat">Treat</option>
                        <option value="Protect">Protect</option>
                    </select>

                    <label htmlFor="skinType">Skin Type</label>
                    <select id="skinType" name="skinType" value={product.skinType} onChange={handleChange} required>
                        <option value="">Select Skin Type</option>
                        <option value="Dry">Dry</option>
                        <option value="Oily">Oily</option>
                    </select>


                    <label htmlFor="stock">Stock</label>
                    <input type="number" id="stock" name="stock" placeholder="Stock Quantity" value={product.stock} onChange={handleChange} required />

                    <label htmlFor="images">Upload Images</label>
                    <input type="file" id="images" name="images" multiple onChange={handleImageUpload} required />

                    <h3>Sizes</h3>
                    {product.sizes.map((size, index) => (
                        <div key={index} className="size">
                            <input
                                type="text"
                                placeholder="Size"
                                value={size}
                                onChange={(e) => handleSizeChange(index, e.target.value)}
                                required
                            />
                            <FaTrash onClick={() => deleteSize(index)} style={{ cursor: 'pointer', color: 'red' }} />
                        </div>
                    ))}
                    <button type="button" onClick={addSize}>Add Size</button>

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
                            <div className='key-ingredient-inputs'>
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
                            <div className='key-ingredient-inputs'>
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

                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
