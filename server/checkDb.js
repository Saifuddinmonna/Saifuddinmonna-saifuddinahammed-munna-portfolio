const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_saifuddin");
    console.log("MongoDB connected successfully");

    // Check testimonials collection
    const testimonials = await mongoose.connection.db.collection('testimonials').find({}).toArray();
    console.log("Testimonials:", testimonials);

    // Check users collection
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Users:", users);

    // Check messages collection
    const messages = await mongoose.connection.db.collection('messages').find({}).toArray();
    console.log("Messages:", messages);

  } catch (err) {
    console.error("MongoDB connection error:", err);
  } finally {
    mongoose.connection.close();
  }
};

connectDB(); 