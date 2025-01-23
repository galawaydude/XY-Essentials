const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Get a product by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  .populate('reviews');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// Create a new product (Admin only)
const createProduct = asyncHandler(async (req, res) => {
  try {
      console.log('Incoming request body:', req.body);

      // Extract product data
      const productData = { ...req.body };

      // Parse keyIngredients if it's an array of strings
      if (req.body.keyIngredients && Array.isArray(req.body.keyIngredients)) {
          productData.keyIngredients = req.body.keyIngredients.map(item => JSON.parse(item));
      } else if (typeof req.body.keyIngredients === 'string') {
          productData.keyIngredients = [JSON.parse(req.body.keyIngredients)];
      }

      console.log('Product data:', productData);

      // Retrieve uploaded images
      const productImages = req.files['productImages'] ? req.files['productImages'].map(file => file.path) : [];
      console.log('Uploaded product images:', productImages);

      // Create new product instance
      const product = new Product({
          ...productData,
          images: productImages,
      });

      // Save the product to the database
      const createdProduct = await product.save();
      console.log('Product created successfully:', createdProduct);

      // Respond with the created product
      res.status(201).json(createdProduct);
  } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a product (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
    try {
        // Find the existing product
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create update object
        const updateData = { ...req.body };

        // Handle keyIngredients
        if (req.body.keyIngredients) {
            try {
                updateData.keyIngredients = JSON.parse(req.body.keyIngredients);
            } catch (e) {
                console.error('Error parsing keyIngredients:', e);
                return res.status(400).json({ 
                    message: 'Invalid keyIngredients format',
                    error: e.message 
                });
            }
        }

        // Handle uploaded images
        if (req.files && req.files.productImages) {
            updateData.images = req.files.productImages.map(file => file.path);
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

const updateProductStock = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  try {
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Check if the stock can be reduced by the given quantity
      if (product.stock < quantity) {
          return res.status(400).json({ message: 'Insufficient stock. Cannot reduce stock by given quantity.' });
      }

      product.stock -= quantity;

      // Initialize ordered if it doesn't exist
      product.ordered = product.ordered || 0;
      product.ordered += quantity;

      await product.save();
      res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a product (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getAllProducts,
  getProductById,
  updateProductStock,
  createProduct,
  updateProduct,
  deleteProduct,
};
