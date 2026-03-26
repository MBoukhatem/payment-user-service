const prisma = require('../prisma')

const createProfile = async (data) => {
  return prisma.profile.create({ data })
}

const findByUserId = async (userId) => {
  return prisma.profile.findUnique({ where: { userId } })
}

const findById = async (id) => {
  return prisma.profile.findUnique({ where: { id } })
}

const updateByUserId = async (userId, data) => {
  return prisma.profile.update({
    where: { userId },
    data,
  })
}

const deleteByUserId = async (userId) => {
  return prisma.profile.delete({ where: { userId } })
}

const upsertProfile = async (userId, data) => {
  return prisma.profile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  })
}

const findAll = async () => {
  return prisma.profile.findMany({ orderBy: { createdAt: 'desc' } })
}

module.exports = {
  createProfile,
  findByUserId,
  findById,
  updateByUserId,
  deleteByUserId,
  upsertProfile,
  findAll,
}
