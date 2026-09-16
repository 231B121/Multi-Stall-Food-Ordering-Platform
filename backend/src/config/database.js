const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variable
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log(`✓ MongoDB Connected: ${mongoURI}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    // In production, don't start the server if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;