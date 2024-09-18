const asyncHandler = require('express-async-handler');
const Blog = require('../models/blog.model');

// Create a new blog post
const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const blogPost = new Blog({
    title,
    content,
    author: req.user._id, // Assuming the logged-in user is the author
    createdAt: Date.now(),
  });

  const createdBlogPost = await blogPost.save();
  res.status(201).json(createdBlogPost);
});

// Get all blog posts
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogPosts = await Blog.find({}).populate('author', 'name email');
  res.json(blogPosts);
});

// Get a blog post by ID
const getBlogById = asyncHandler(async (req, res) => {
  const blogPost = await Blog.findById(req.params.id).populate('author', 'name email');

  if (blogPost) {
    res.json(blogPost);
  } else {
    res.status(404);
    throw new Error('Blog post not found');
  }
});

// Update a blog post (Admin or Author only)
const updateBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const blogPost = await Blog.findById(req.params.id);

  if (blogPost) {
    if (blogPost.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to update this blog post');
    }

    blogPost.title = title || blogPost.title;
    blogPost.content = content || blogPost.content;

    const updatedBlogPost = await blogPost.save();
    res.json(updatedBlogPost);
  } else {
    res.status(404);
    throw new Error('Blog post not found');
  }
});

// Delete a blog post (Admin or Author only)
const deleteBlog = asyncHandler(async (req, res) => {
  const blogPost = await Blog.findById(req.params.id);

  if (blogPost) {
    if (blogPost.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to delete this blog post');
    }

    await blogPost.remove();
    res.json({ message: 'Blog post removed' });
  } else {
    res.status(404);
    throw new Error('Blog post not found');
  }
});

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
