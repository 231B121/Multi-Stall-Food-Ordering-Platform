const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance using Mongoose.
 * Validates MONGODB_URI presence and sets up connection lifecycle event listeners.
 * 
 * @returns {Promise<void>} Resolves when connection is established
 */
const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variable
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    // Lifecycle event listeners for connection monitoring
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB connection lost. Attempting reconnection...');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`✗ MongoDB runtime error: ${err.message}`);
    });

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