const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, 
  stock: { type: Number, required: true }, 
  skinType: {type: String},
  images: { 
    type: [{ type: String }], 
    default: [
      'https://m.media-amazon.com/images/I/61a3YAltH5L.jpg',
      'https://m.media-amazon.com/images/I/61a3YAltH5L.jpg',
      'https://m.media-amazon.com/images/I/61a3YAltH5L.jpg',
      'https://m.media-amazon.com/images/I/61a3YAltH5L.jpg',
      'https://m.media-amazon.com/images/I/61a3YAltH5L.jpg'
    ]
  },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  claims: [{ type: String }], 
  suitableFor: [{ type: String }],
  keyIngredients: [{ 
    ingredient: { type: String },
    description: { type: String } 
  }], 
  whatMakesItWorthUsing: { type: String },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
