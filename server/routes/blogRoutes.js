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

// All routes are public
router.get('/', getAllBlogs);
router.get('/:id', getBlog);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/comments', addComment);
router.post('/:id/like', toggleLike);

module.exports = router; 