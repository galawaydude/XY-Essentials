const express = require('express');
const {getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog} = require('../controllers/blog.controller.js');
const {protect, admin} = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, admin, createBlog);
router.put('/:id', protect, admin, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;