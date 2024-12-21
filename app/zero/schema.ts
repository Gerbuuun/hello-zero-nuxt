import { column, definePermissions, createSchema } from '@rocicorp/zero'
import type { Row, TableSchema } from '@rocicorp/zero'

const { enumeration } = column

const groupSchema = {
  tableName: 'group',
  columns: {
    id: 'string',
    name: 'string',
    description: { type: 'string', optional: true },
    type: enumeration<'default' | 'organization'>(),
    parentID: { type: 'string', optional: true },
    contextID: 'string',
    createdAt: 'number',
    updatedAt: 'number',
    deletedAt: { type: 'number', optional: true },
  } satisfies TableSchema['columns'],
  primaryKey: ['id'],
  relationships: {
    context: { destField: 'id', sourceField: 'contextID', destSchema: () => groupSchema },
    parent: { destField: 'id', sourceField: 'parentID', destSchema: () => groupSchema },
    children: { destField: 'parentID', sourceField: 'id', destSchema: () => groupSchema },
    memberships: { destField: 'groupID', sourceField: 'id', destSchema: () => membershipSchema },
  },
} as const

const membershipSchema = {
  tableName: 'membership',
  columns: {
    id: 'string',
    planID: { type: 'string', optional: true },
    groupID: 'string',
    userID: 'string',
    status: enumeration<'active' | 'inactive'>(),
    role: enumeration<'default' | 'admin'>(),
    contextID: 'string',
    createdAt: 'number',
    updatedAt: 'number',
    deletedAt: { type: 'number', optional: true },
  } satisfies TableSchema['columns'],
  primaryKey: ['id'],
  relationships: {
    context: { destField: 'id', sourceField: 'contextID', destSchema: () => groupSchema },
    group: { destField: 'id', sourceField: 'groupID', destSchema: () => groupSchema },
    user: { destField: 'id', sourceField: 'userID', destSchema: () => userSchema },
  },
} as const

const userSchema = {
  tableName: 'user',
  columns: {
    id: 'string',
    name: 'string',
    email: 'string',
    createdAt: 'number',
    updatedAt: 'number',
    deletedAt: { type: 'number', optional: true },
  } satisfies TableSchema['columns'],
  primaryKey: ['id'],
  relationships: {
    memberships: { destField: 'userID', sourceField: 'id', destSchema: () => membershipSchema },
  },
} as const

export const schema = createSchema({
  version: 1,
  tables: {
    group: groupSchema,
    membership: membershipSchema,
    user: userSchema,
  },
})

export type GroupRow = Row<typeof groupSchema>
export type MembershipRow = Row<typeof membershipSchema>
export type UserRow = Row<typeof userSchema>

type AuthData = {
  sub: string | null
}

export const permissions = definePermissions<AuthData, typeof schema>(schema, () => {
  // // Group rules
  // const isGroupMember = (
  //   authData: AuthData,
  //   eb: ExpressionBuilder<typeof groupSchema>,
  // ) => eb.exists('memberships', iq => iq.where(eb => eb.cmp('userID', '=', authData.sub!)))
  // const isGroupAdmin = (
  //   authData: AuthData,
  //   eb: ExpressionBuilder<typeof groupSchema>,
  // ) => eb.exists('memberships', iq => iq.where(eb => eb.and(eb.cmp('userID', '=', authData.sub!), eb.cmp('role', '=', 'admin'))))

  // // Member rules
  // const isAdminOfMembersGroup = (authData: AuthData, eb: ExpressionBuilder<typeof membershipSchema>) => eb.exists('group', iq => iq.where(eb => isGroupAdmin(authData, eb)))

  // // Context rules
  // const allowIfInContext = (
  //   authData: AuthData,
  //   eb: ExpressionBuilder<typeof groupSchema | typeof membershipSchema | typeof permissionSchema>,
  // ) => eb.exists('context', iq => iq.where(eb => isGroupMember(authData, eb)))
  // const allowIfContextAdmin = (
  //   authData: AuthData,
  //   eb: ExpressionBuilder<typeof groupSchema | typeof membershipSchema | typeof permissionSchema>,
  // ) => eb.exists('context', iq => iq.where(eb => isGroupAdmin(authData, eb)))

  // // User rules
  // const allowIfUser = (authData: AuthData, eb: ExpressionBuilder<typeof userSchema>) => eb.cmp('id', '=', authData.sub!)
  // const allowIfUserIsInContext = (
  //   authData: AuthData,
  //   eb: ExpressionBuilder<typeof userSchema>,
  // ) => eb.exists('memberships', iq => iq.where(eb => eb.exists('group', iq => iq.where(eb => isGroupMember(authData, eb)))))

  return {
    // group: {
    //   row: {
    //     select: ANYONE_CAN,
    //     update: {
    //       preMutation: [isGroupAdmin],
    //     },
    //     delete: [isGroupAdmin],
    //   },
    // },
    // membership: {
    //   row: {
    //     select: [allowIfInContext],
    //     update: {
    //       preMutation: [isAdminOfMembersGroup],
    //     },
    //     delete: [isAdminOfMembersGroup],
    //   },
    // },
    // user: {
    //   row: {
    //     select: [allowIfUserIsInContext],
    //     insert: NOBODY_CAN,
    //     update: {
    //       preMutation: [allowIfUser],
    //     },
    //     delete: NOBODY_CAN,
    //   },
    // },
  }
})
