const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  addComment,
  toggleLike
} = require('../controllers/blogController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlog);

// Protected routes
router.post('/', verifyToken, createBlog);
router.put('/:id', verifyToken, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);
router.post('/:id/comments', verifyToken, addComment);
router.post('/:id/like', verifyToken, toggleLike);

module.exports = router; 