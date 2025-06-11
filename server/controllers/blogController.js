const Blog = require('../models/Blog');
const User = require('../models/User');

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    console.log('=== Create Blog Request ===');
    console.log('Request Body:', req.body);

    const { 
      title, 
      content, 
      category, 
      image, 
      author,
      date,
      readTime 
    } = req.body;

    // Create blog without requiring authentication
    const blog = new Blog({
      title,
      content,
      tags: [category], // Store category as a tag
      image,
      status: 'published',
      author: {
        name: author.name,
        email: author.email,
        phone: author.phone
      },
      createdAt: date,
      readTime
    });

    await blog.save();
    console.log('Blog created successfully:', blog);

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Create Blog Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all blog posts with pagination and filters
exports.getAllBlogs = async (req, res) => {
  try {
    console.log('=== Get All Blogs Request ===');
    console.log('Query Parameters:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'published';
    const search = req.query.search || '';
    const category = req.query.category || '';

    console.log('Filters:', { page, limit, status, search, category });

    const query = {
      status,
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    };

    if (category) {
      query.tags = category;
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    console.log('Found Blogs:', blogs.length);
    console.log('Total Blogs:', total);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get All Blogs Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single blog post
exports.getBlog = async (req, res) => {
  try {
    console.log('=== Get Single Blog Request ===');
    console.log('Blog ID:', req.params.id);

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      console.log('Blog not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    console.log('Found Blog:', blog);

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get Single Blog Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    console.log('=== Update Blog Request ===');
    console.log('Blog ID:', req.params.id);
    console.log('Update Data:', req.body);

    const { 
      title, 
      content, 
      category, 
      image, 
      author,
      date,
      readTime 
    } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      console.log('Blog not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags: [category],
        image,
        author: {
          name: author.name,
          email: author.email,
          phone: author.phone
        },
        createdAt: date,
        readTime
      },
      { new: true, runValidators: true }
    );

    console.log('Blog updated successfully:', updatedBlog);

    res.status(200).json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    console.log('=== Delete Blog Request ===');
    console.log('Blog ID:', req.params.id);

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      console.log('Blog not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    await blog.deleteOne();
    console.log('Blog deleted successfully');

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Add comment to blog
exports.addComment = async (req, res) => {
  try {
    console.log('=== Add Comment Request ===');
    console.log('Blog ID:', req.params.id);
    console.log('Comment Data:', req.body);

    const { text, author } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      console.log('Blog not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    blog.comments.push({
      text,
      author: {
        name: author.name,
        email: author.email
      },
      createdAt: new Date()
    });

    await blog.save();
    console.log('Comment added successfully');

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Like/Unlike blog
exports.toggleLike = async (req, res) => {
  try {
    console.log('=== Toggle Like Request ===');
    console.log('Blog ID:', req.params.id);
    console.log('Like Data:', req.body);

    const { author } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      console.log('Blog not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const likeIndex = blog.likes.findIndex(
      like => like.email === author.email
    );

    if (likeIndex === -1) {
      blog.likes.push({
        name: author.name,
        email: author.email
      });
      console.log('Blog liked by user');
    } else {
      blog.likes.splice(likeIndex, 1);
      console.log('Blog unliked by user');
    }

    await blog.save();
    console.log('Like status updated successfully');

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 