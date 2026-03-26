const userRepository = require('../repositories/user.repository')

const getProfile = async (userId) => {
  const profile = await userRepository.findByUserId(userId)
  if (!profile) {
    const error = new Error('Profile not found')
    error.status = 404
    throw error
  }
  return profile
}

const createOrUpdateProfile = async (userId, data) => {
  return userRepository.upsertProfile(userId, data)
}

const updateProfile = async (userId, data) => {
  const existing = await userRepository.findByUserId(userId)
  if (!existing) {
    const error = new Error('Profile not found')
    error.status = 404
    throw error
  }
  return userRepository.updateByUserId(userId, data)
}

const deleteProfile = async (userId) => {
  const existing = await userRepository.findByUserId(userId)
  if (!existing) {
    const error = new Error('Profile not found')
    error.status = 404
    throw error
  }
  return userRepository.deleteByUserId(userId)
}

const getProfileById = async (id) => {
  const profile = await userRepository.findById(id)
  if (!profile) {
    const error = new Error('Profile not found')
    error.status = 404
    throw error
  }
  return profile
}

const getProfileByUserId = async (userId) => {
  return userRepository.findByUserId(userId)
}

const getAllProfiles = async () => {
  return userRepository.findAll()
}

const updateKycStatus = async (userId, kycStatus) => {
  const existing = await userRepository.findByUserId(userId)
  if (!existing) {
    const error = new Error('Profile not found')
    error.status = 404
    throw error
  }
  return userRepository.updateByUserId(userId, { kycStatus })
}

module.exports = {
  getProfile,
  createOrUpdateProfile,
  updateProfile,
  deleteProfile,
  getProfileById,
  getProfileByUserId,
  getAllProfiles,
  updateKycStatus,
}
