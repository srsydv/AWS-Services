import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected');
}
