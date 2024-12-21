import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../database'

export default defineNitroPlugin(async () => {
  const db = drizzle(postgres('postgresql://user:password@localhost:5430/zstart'), { schema })

  const users = await db.select().from(schema.user)

  if (users.length === 0) {
    console.log('Seeding database...')

    await db.insert(schema.user).values([
      { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
    ])

    await db.insert(schema.group).values([
      { id: '1', name: 'Group 1', description: 'Group 1', type: 'organization', contextId: '1' },
      { id: '2', name: 'Group 2', description: 'Group 2', type: 'default', contextId: '1' },
    ])

    await db.insert(schema.membership).values([
      { id: '1', groupId: '1', userId: '1', status: 'active', role: 'admin', contextId: '1' },
      { id: '2', groupId: '2', userId: '2', status: 'active', role: 'default', contextId: '1' },
    ])

    console.log('Database seeded')
  }
  else {
    console.log(users)
  }
})
