const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: {
    type: String,
  },
  content: { type: String, required: true },
  tags: [{ type: String }],
  publishDate: { type: Date },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
