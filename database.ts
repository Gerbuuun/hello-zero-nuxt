import { pgTable, uniqueIndex, index, text, timestamp } from 'drizzle-orm/pg-core'

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
  groupId: text('group_id').notNull(),
  userId: text('user_id').notNull(),
  status: text('status').notNull(),
  role: text('role').notNull(),
  contextId: text('context_id').notNull(),
},
(table) => {
  return {
    groupIdIdx: index().on(table.groupId),
    userIdIdx: index().on(table.userId),
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
    emailUnique: uniqueIndex('user_email_unique').on(table.email),
  }
})
