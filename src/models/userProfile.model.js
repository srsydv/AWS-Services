import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
