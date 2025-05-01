const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI format check:', 
      process.env.MONGODB_URI ? 
      `URI starts with: ${process.env.MONGODB_URI.substring(0, 20)}...` : 
      'MongoDB URI is undefined');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);

    // Test the connection by listing collections
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(
        "Available collections:",
        collections.map((c) => c.name)
      );
      return true;
    } catch (collectionErr) {
      console.error("Error listing collections:", collectionErr);
      // Continue anyway as this is just informational
      return true;
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(`Error code: ${error.code}, codeName: ${error.codeName}`);
    console.error(`Full error:`, error);
    
    // Don't exit the process in production - allow retries
    if (process.env.NODE_ENV === 'production') {
      console.log('Will continue running despite database connection error');
      return false;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
