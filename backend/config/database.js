const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.warn('⚠️ WARNING: MONGODB_URI is not set in environment variables.');
      console.warn('⚠️ Please set MONGODB_URI in your .env file or Render environment settings.');
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit process in development to allow server inspection, but log clearly
    if (process.env.NODE_ENV === 'production') {
      console.error('Exiting process due to database connection failure in production...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
