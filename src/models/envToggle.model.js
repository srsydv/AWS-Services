import mongoose from 'mongoose';

const envToggleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const EnvToggle = mongoose.model('EnvToggle', envToggleSchema);
