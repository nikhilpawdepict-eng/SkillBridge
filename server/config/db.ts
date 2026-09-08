import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`🌿 MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`📊 View data anytime in MongoDB Compass at: ${MONGODB_URI}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    console.warn(`⚠️ Please ensure MongoDB is running locally (e.g. on default port 27017).`);
    return false;
  }
};
