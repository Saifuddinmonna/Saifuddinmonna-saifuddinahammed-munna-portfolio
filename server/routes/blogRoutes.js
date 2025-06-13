const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getAllBlogsWithoutPagination,
  getBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
  updateComment,
  toggleLike
} = require('../controllers/blogController');
const { verifyToken } = require('../middlewares/auth');

// All routes are public
router.get('/', getAllBlogs);
router.get('/all', getAllBlogsWithoutPagination);
router.get('/:id', getBlog);
router.post('/', verifyToken, createBlog);
router.put('/:id', verifyToken, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);
router.put('/:id/comments/:commentId', updateComment);
router.post('/:id/like', toggleLike);

module.exports = router; 