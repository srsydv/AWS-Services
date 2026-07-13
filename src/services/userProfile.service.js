import { UserProfile } from '../models/userProfile.model.js';

export async function createProfile(data) {
  return UserProfile.create(data);
}

export async function getAllProfiles() {
  return UserProfile.find().sort({ createdAt: -1 });
}

export async function getProfileById(id) {
  return UserProfile.findById(id);
}

export async function updateProfile(id, data) {
  return UserProfile.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteProfile(id) {
  return UserProfile.findByIdAndDelete(id);
}
