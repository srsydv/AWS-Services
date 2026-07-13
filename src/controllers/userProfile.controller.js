import * as userProfileService from '../services/userProfile.service.js';

export async function createProfile(req, res, next) {
  try {
    const profile = await userProfileService.createProfile(req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = 'A profile with this email already exists';
    } else if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    next(error);
  }
}

export async function getAllProfiles(_req, res, next) {
  try {
    const profiles = await userProfileService.getAllProfiles();
    res.json({ success: true, data: profiles });
  } catch (error) {
    next(error);
  }
}

export async function getProfileById(req, res, next) {
  try {
    const profile = await userProfileService.getProfileById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'User profile not found' },
      });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid profile id';
    }
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const profile = await userProfileService.updateProfile(req.params.id, req.body);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'User profile not found' },
      });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = 'A profile with this email already exists';
    } else if (error.name === 'ValidationError') {
      error.statusCode = 400;
    } else if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid profile id';
    }
    next(error);
  }
}

export async function deleteProfile(req, res, next) {
  try {
    const profile = await userProfileService.deleteProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'User profile not found' },
      });
    }
    res.json({ success: true, data: { message: 'User profile deleted' } });
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid profile id';
    }
    next(error);
  }
}
