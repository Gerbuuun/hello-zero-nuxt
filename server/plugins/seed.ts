import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { pgTable, uniqueIndex, index, text, timestamp, integer, unique, primaryKey } from 'drizzle-orm/pg-core'

export const group = pgTable('group', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  parentId: text('parent_id'),
  contextId: text('context_id').notNull(),
},
(table) => {
  return {
    pkey: uniqueIndex('group_pkey').on(table.id),
    deletedAtIdx: index().on(table.deletedAt),
    contextIdIdx: index().on(table.contextId),
    parentIdIdx: index().on(table.parentId),
  }
})

export const membership = pgTable('membership', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  planId: text('plan_id'),
  groupId: text('group_id').notNull(),
  userId: text('user_id').notNull(),
  status: text('status').notNull(),
  role: text('role').notNull(),
  contextId: text('context_id').notNull(),
},
(table) => {
  return {
    pkey: uniqueIndex('membership_pkey').on(table.id),
    groupIdIdx: index().on(table.groupId),
    userIdIdx: index().on(table.userId),
    planIdIdx: index().on(table.planId),
    deletedAtIdx: index().on(table.deletedAt),
    contextIdIdx: index().on(table.contextId),
  }
})

export const notification = pgTable('notification', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  readAt: timestamp('read_at', { withTimezone: true, mode: 'string' }),
  userId: text('user_id').notNull(),
},
(table) => {
  return {
    pkey: uniqueIndex('notification_pkey').on(table.id),
    userIdIdx: index().on(table.userId),
  }
})

export const permission = pgTable('permission', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  permission: text('permission').notNull(),
  actorId: text('actor_id').notNull(),
  subjectId: text('subject_id').notNull(),
  contextId: text('context_id').notNull(),
},
(table) => {
  return {
    pkey: uniqueIndex('permission_pkey').on(table.id),
    deletedAtIdx: index().on(table.deletedAt),
    contextIdIdx: index().on(table.contextId),
    actorIdIdx: index().on(table.actorId),
    subjectIdIdx: index().on(table.subjectId),
  }
})

export const plan = pgTable('plan', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  contextId: text('context_id').notNull(),
},
(table) => {
  return {
    pkey: uniqueIndex('plan_pkey').on(table.id),
    deletedAtIdx: index().on(table.deletedAt),
    contextIdIdx: index().on(table.contextId),
  }
})

export const user = pgTable('user', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
},
(table) => {
  return {
    pkey: uniqueIndex('user_pkey').on(table.id),
    emailUnique: uniqueIndex('user_email_unique').on(table.email),
    userEmailUnique: unique('user_email_unique').on(table.email),
  }
})

export const userOauth = pgTable('user_oauth', {
  userId: text('user_id').primaryKey().notNull(),
  provider: text('provider').primaryKey().notNull(),
  providerId: text('provider_id').notNull(),
  tokens: text('tokens'),
},
(table) => {
  return {
    userIdProviderPk: uniqueIndex('user_oauth_user_id_provider_pk').on(table.userId, table.provider),
    providerProviderIdIdx: uniqueIndex().on(table.provider, table.providerId),
    userOauthUserIdProviderPk: primaryKey({ columns: [table.userId, table.provider], name: 'user_oauth_user_id_provider_pk' }),
  }
})

const schema = {
  group,
  membership,
  notification,
  permission,
  plan,
  user,
  userOauth,
}

export default defineNitroPlugin(async () => {
  const db = drizzle(postgres('postgresql://user:password@localhost:5430/zstart'), { schema })

  const users = await db.select().from(user)

  if (users.length === 0) {
    console.log('Seeding database...')

    await db.insert(user).values([
      { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
    ])

    await db.insert(group).values([
      { id: '1', name: 'Group 1', description: 'Group 1', type: 'organization', contextId: '1' },
      { id: '2', name: 'Group 2', description: 'Group 2', type: 'default', contextId: '1' },
    ])

    await db.insert(membership).values([
      { id: '1', groupId: '1', userId: '1', status: 'active', role: 'admin', contextId: '1' },
      { id: '2', groupId: '2', userId: '2', status: 'active', role: 'default', contextId: '1' },
    ])

    console.log('Database seeded')
  }
})
