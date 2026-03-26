const express = require('express')
const { z } = require('zod')
const userController = require('../controllers/user.controller')
const { validate } = require('../middlewares/validate.middleware')
const { verifyServiceToken } = require('../middlewares/serviceToken.middleware')
const { requireAdmin } = require('../middlewares/admin.middleware')

const router = express.Router()

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().url('Invalid URL').nullable().optional(),
  kycStatus: z.enum(['PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED']).optional(),
})

const updateKycSchema = z.object({
  kycStatus: z.enum(['PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED']),
})

router.get('/me', userController.getMe)
router.put('/me', validate(updateProfileSchema), userController.updateMe)
router.delete('/me', userController.deleteMe)

// Admin routes
router.get('/admin/profiles', requireAdmin, userController.getAllProfiles)
router.put('/admin/profiles/:userId/kyc', requireAdmin, validate(updateKycSchema), userController.updateKycStatus)

router.get('/:id', verifyServiceToken, userController.getUserById)

module.exports = router
