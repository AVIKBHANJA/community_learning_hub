const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Test the connection by listing collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Print full error stack for better debugging
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
