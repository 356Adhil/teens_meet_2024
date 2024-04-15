const mongoose = require('mongoose');

async function connectDB() {
  try {
    // MongoDB connection URI
    const MONGODB_URI = process.env.MONGO_URI;

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

module.exports = connectDB;
