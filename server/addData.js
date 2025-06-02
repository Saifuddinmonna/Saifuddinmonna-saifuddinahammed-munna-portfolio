const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_saifuddin");
    console.log("MongoDB connected successfully");

    // Add new users
    const users = [
      {
        name: "Saifuddin Ahammed",
        email: "saifuddin@gmail.com",
        password: "hashedPassword123", // In real app, this should be properly hashed
        role: "admin",
        photoURL: "/images/users/admin.jpg"
      },
      {
        name: "John Smith",
        email: "john@example.com",
        password: "hashedPassword456",
        role: "user",
        photoURL: "/images/users/john.jpg"
      }
    ];

    await mongoose.connection.db.collection('users').insertMany(users);
    console.log("Users added successfully");

    // Add new messages
    const messages = [
      {
        content: "Hello, I'm interested in your services",
        sender: {
          id: "1",
          name: "John Smith",
          email: "john@example.com",
          photoURL: "/images/users/john.jpg"
        },
        room: "general",
        createdAt: new Date()
      },
      {
        content: "Can you help me with a web development project?",
        sender: {
          id: "1",
          name: "John Smith",
          email: "john@example.com",
          photoURL: "/images/users/john.jpg"
        },
        room: "general",
        createdAt: new Date()
      }
    ];

    await mongoose.connection.db.collection('messages').insertMany(messages);
    console.log("Messages added successfully");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

connectDB(); 