const userService = require('../services/user.service')

const getMe = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const profile = await userService.getProfile(userId)
    res.json(profile)
  } catch (err) {
    // If profile not found, return a default skeleton
    if (err.status === 404) {
      return res.json({
        userId: req.headers['x-user-id'],
        firstName: '',
        lastName: '',
        phone: null,
        avatarUrl: null,
        kycStatus: 'PENDING',
      })
    }
    next(err)
  }
}

const updateMe = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const profile = await userService.createOrUpdateProfile(userId, req.body)
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

const deleteMe = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    await userService.deleteProfile(userId)
    res.json({ message: 'Profile deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const profile = await userService.getProfileByUserId(req.params.id)
    if (!profile) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await userService.getAllProfiles()
    res.json(profiles)
  } catch (err) {
    next(err)
  }
}

const updateKycStatus = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { kycStatus } = req.body
    const profile = await userService.updateKycStatus(userId, kycStatus)
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  getUserById,
  getAllProfiles,
  updateKycStatus,
}
