const Blog = require("../models/Blog");
const User = require("../models/User");
const BlogCategory = require("../models/BlogCategory");
const { sanitizeBlogContent, sanitizeCommentContent } = require("../utils/sanitizeHtml");
const { uploadToCloudinaryBlog } = require("../middlewares/multer");
const cloudinary = require("../config/cloudinary");

// Utility to flatten nested arrays
function flattenArray(arr) {
  return Array.isArray(arr)
    ? arr.reduce((flat, toFlatten) => flat.concat(flattenArray(toFlatten)), [])
    : [arr];
}

// Add this function at the top (after imports)
function calculateReadTime(content) {
  if (!content) return "1";
  const plainText = content.replace(/<[^>]+>/g, " ");
  const wordCount = plainText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return minutes.toString();
}

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    console.log("=== CREATE BLOG REQUEST ===");
    console.log("Request Body:", req.body);
    console.log("req.file:", req.file);
    console.log("User:", req.user);

    const {
      title,
      content,
      categories,
      tags,
      readTime,
      image,
      imageUrl,
      authorName,
      authorEmail,
      authorPhone,
      authorIsHidden,
      date,
    } = req.body;

    // Author object
    const authorObj = {
      name: authorName,
      email: authorEmail,
      phone: authorPhone,
    };

    let imageData = { url: null, public_id: null };

    // Handle image upload
    if (req.file) {
      try {
        const result = await uploadToCloudinaryBlog(req.file.buffer);
        imageData = { url: result.secure_url, public_id: result.public_id };
      } catch (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
      }
    } else if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")) {
      imageData = { url: imageUrl, public_id: null };
    } else if (image && typeof image === "object" && image.url) {
      imageData = { url: image.url, public_id: image.public_id || null };
    } else if (image && typeof image === "string" && image.startsWith("http")) {
      imageData = { url: image, public_id: null };
    }

    // Sanitize the content
    const sanitizedContent = sanitizeBlogContent(content);

    // Handle tags
    let tagsArray = [];
    if (Array.isArray(tags)) {
      tagsArray = flattenArray(tags)
        .map(t => t.trim())
        .filter(Boolean);
    } else if (typeof tags === "string") {
      tagsArray = tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);
    }

    // Handle categories
    let categoriesArray = [];
    if (Array.isArray(categories)) {
      categoriesArray = categories;
    } else if (typeof categories === "string") {
      categoriesArray = categories
        .split(",")
        .map(c => c.trim())
        .filter(Boolean);
    }

    // Auto-calculate readTime if not provided
    let finalReadTime = readTime;
    if (!finalReadTime || isNaN(Number(finalReadTime)) || Number(finalReadTime) <= 0) {
      finalReadTime = calculateReadTime(sanitizedContent);
    }
    finalReadTime = `${finalReadTime} min read`;

    // Create blog
    const blog = new Blog({
      title,
      content: sanitizedContent,
      tags: tagsArray,
      categories: categoriesArray,
      image: imageData,
      status: "published",
      author: authorObj,
      createdAt: date,
      readTime: finalReadTime,
    });

    await blog.save();
    await blog.populate("categories");

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("❌ Create Blog Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all blog posts with pagination and filters
exports.getAllBlogs = async (req, res) => {
  try {
    console.log("=== GET ALL BLOGS REQUEST ===");
    console.log("Query Parameters:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "published";
    const search = req.query.search || "";
    let category = req.query.category || "";
    const tag = req.query.tag || "";

    const query = {
      status,
    };

    // Only add search conditions if search parameter is provided and not empty
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Handle category filtering
    if (category) {
      let categoryIds = [];
      if (Array.isArray(category)) {
        categoryIds = category;
      } else if (typeof category === "string") {
        const catArr = category
          .split(",")
          .map(c => c.trim())
          .filter(Boolean);
        for (const cat of catArr) {
          if (/^[0-9a-fA-F]{24}$/.test(cat)) {
            categoryIds.push(cat);
          } else {
            const found = await BlogCategory.findOne({ $or: [{ name: cat }, { slug: cat }] });
            if (found) categoryIds.push(found._id);
          }
        }
      }
      if (categoryIds.length > 0) {
        query.categories = { $in: categoryIds };
      }
    }

    if (tag) {
      query.tags = tag;
    }

    const blogs = await Blog.find(query)
      .populate("categories")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Get All Blogs Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all blog posts without pagination
exports.getAllBlogsWithoutPagination = async (req, res) => {
  try {
    const status = req.query.status || "published";
    const search = req.query.search || "";
    let category = req.query.category || "";
    const tag = req.query.tag || "";

    const query = {
      status,
    };

    // Only add search conditions if search parameter is provided and not empty
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category) {
      let categoryIds = [];
      if (Array.isArray(category)) {
        categoryIds = category;
      } else if (typeof category === "string") {
        const catArr = category
          .split(",")
          .map(c => c.trim())
          .filter(Boolean);
        for (const cat of catArr) {
          if (/^[0-9a-fA-F]{24}$/.test(cat)) {
            categoryIds.push(cat);
          } else {
            const found = await BlogCategory.findOne({ $or: [{ name: cat }, { slug: cat }] });
            if (found) categoryIds.push(found._id);
          }
        }
      }
      if (categoryIds.length > 0) {
        query.categories = { $in: categoryIds };
      }
    }

    if (tag) {
      query.tags = tag;
    }

    const blogs = await Blog.find(query).populate("categories").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error("❌ Get All Blogs Without Pagination Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single blog post
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("❌ Get Single Blog Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    // Handle image update
    if (req.file) {
      if (blog.image && blog.image.public_id) {
        try {
          await cloudinary.uploader.destroy(blog.image.public_id, { resource_type: "image" });
        } catch (cloudinaryError) {
          console.error("❌ Cloudinary delete error:", cloudinaryError);
        }
      }

      try {
        const result = await uploadToCloudinaryBlog(req.file.buffer);
        blog.image = { url: result.secure_url, public_id: result.public_id };
      } catch (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
      }
    }

    // Update other fields
    const {
      title,
      content,
      categories,
      tags,
      readTime,
      date,
      authorName,
      authorEmail,
      authorPhone,
    } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = sanitizeBlogContent(content);
    if (readTime) blog.readTime = readTime;
    if (date) blog.createdAt = date;

    if (tags) {
      if (Array.isArray(tags)) {
        blog.tags = flattenArray(tags)
          .map(t => t.trim())
          .filter(Boolean);
      } else if (typeof tags === "string") {
        blog.tags = tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean);
      }
    }

    if (categories) {
      if (Array.isArray(categories)) {
        blog.categories = categories;
      } else if (typeof categories === "string") {
        blog.categories = categories
          .split(",")
          .map(c => c.trim())
          .filter(Boolean);
      }
    }

    if (authorName || authorEmail || authorPhone) {
      blog.author = {
        name: authorName || blog.author.name,
        email: authorEmail || blog.author.email,
        phone: authorPhone || blog.author.phone,
      };
    }

    await blog.save();
    await blog.populate("categories");

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("❌ Update Blog Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete blog image only
exports.deleteBlogImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    if (blog.image && blog.image.public_id) {
      try {
        await cloudinary.uploader.destroy(blog.image.public_id, { resource_type: "image" });
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary delete error:", cloudinaryError);
      }
    }

    blog.image = { url: null, public_id: null };
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog image deleted successfully",
      data: {
        id: blog._id,
        title: blog.title,
        image: blog.image,
      },
    });
  } catch (error) {
    console.error("❌ Delete Blog Image Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    if (blog.image && blog.image.public_id) {
      try {
        await cloudinary.uploader.destroy(blog.image.public_id, { resource_type: "image" });
      } catch (cloudinaryError) {
        console.error("❌ Failed to delete Cloudinary image:", cloudinaryError);
      }
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("❌ Delete Blog Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Add comment to blog
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    const newComment = {
      text: sanitizeCommentContent(req.body.content),
      author: {
        name: req.body.author.name,
        email: req.body.author.email,
      },
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Like/Unlike blog
exports.toggleLike = async (req, res) => {
  try {
    const { user } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    const likeIndex = blog.likes.findIndex(like => like.email === user.email);

    if (likeIndex === -1) {
      blog.likes.push({
        name: user.name,
        email: user.email,
      });
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Toggle Like Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete comment from blog
exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    const commentIndex = blog.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    const { userData } = req.body;
    const isAdmin = userData.role === "admin";
    const isCommentAuthor = blog.comments[commentIndex].author.email === userData.email;

    if (!isAdmin && !isCommentAuthor) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to delete this comment",
      });
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update comment in blog
exports.updateComment = async (req, res) => {
  try {
    const { content, userData } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    const commentIndex = blog.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    const isAdmin = userData.role === "admin";
    const isCommentAuthor = blog.comments[commentIndex].author.email === userData.email;

    if (!isAdmin && !isCommentAuthor) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this comment",
      });
    }

    blog.comments[commentIndex].text = content;
    blog.comments[commentIndex].updatedAt = new Date();
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Update Comment Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
