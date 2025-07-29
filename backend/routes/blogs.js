const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getAllBlogsWithoutPagination,
  getBlog,
  updateBlog,
  deleteBlogImage,
  deleteBlog,
  addComment,
  deleteComment,
  updateComment,
  toggleLike,
} = require("../controllers/blogController");
const { verifyToken } = require("../middlewares/auth");
const { uploadWithErrorHandling } = require("../middlewares/multer");

// Public routes
router.get("/", getAllBlogs);
router.get("/all", getAllBlogsWithoutPagination);
router.get("/:id", getBlog);
router.post("/:id/like", toggleLike);
router.post("/:id/comments", addComment);
router.delete("/:id/comments/:commentId", deleteComment);
router.put("/:id/comments/:commentId", updateComment);

// Protected routes (require authentication)
router.post("/", verifyToken, uploadWithErrorHandling, createBlog);
router.put("/:id", verifyToken, uploadWithErrorHandling, updateBlog);
router.put("/:id/delete-image", verifyToken, deleteBlogImage);
router.delete("/:id", verifyToken, deleteBlog);

// Test route for debugging file upload
router.post("/test-upload", uploadWithErrorHandling, (req, res) => {
  console.log("=== TEST UPLOAD DEBUG ===");
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);
  console.log("req.headers:", req.headers);
  res.json({
    success: true,
    file: req.file,
    body: req.body,
  });
});

module.exports = router;
