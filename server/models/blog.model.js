const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Blog post author (admin user)
  tags: [{ type: String }],  // Tags for filtering/searching blog posts
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Optional category for blog posts
  published: { type: Boolean, default: false },  // Is the blog post published
  publishDate: { type: Date },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
