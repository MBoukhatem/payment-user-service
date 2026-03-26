const { PrismaClient } = require('@prisma/client')
const { Client } = require('pg')

const prisma = new PrismaClient()

const SEED_EMAILS = ['admin@minipaypal.dev', 'user@minipaypal.dev']

const waitForSeedUsers = async (authDb, retries = 20, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    const { rows } = await authDb.query(
      `SELECT id, email FROM "User" WHERE email = ANY($1)`,
      [SEED_EMAILS],
    )
    if (rows.length > 0) return rows
    console.log(`Waiting for seed users in auth_db... (${i + 1}/${retries})`)
    await new Promise((r) => setTimeout(r, delay))
  }
  return []
}

async function main() {
  const profileCount = await prisma.profile.count()
  if (profileCount > 0) {
    console.log('Profiles already exist, skipping seed.')
    return
  }

  const authDb = new Client({
    connectionString: process.env.DATABASE_URL.replace('/user_db', '/auth_db'),
  })

  await authDb.connect()
  const rows = await waitForSeedUsers(authDb)
  await authDb.end()

  if (rows.length === 0) {
    console.log('No seed users found in auth_db after waiting, skipping profile seed.')
    return
  }

  for (const row of rows) {
    const isAdmin = row.email === 'admin@minipaypal.dev'
    await prisma.profile.create({
      data: {
        userId: row.id,
        firstName: isAdmin ? 'Admin' : 'User',
        lastName: 'Test',
        kycStatus: 'VERIFIED',
      },
    })
    console.log(`Profile created for ${row.email}`)
  }

  console.log('User seed complete.')
}

main()
  .catch((e) => { console.error('User seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
