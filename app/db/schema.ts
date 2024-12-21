import { column, definePermissions, createTableSchema, createSchema } from '@rocicorp/zero'
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
    permissions: { destField: 'actorID', sourceField: 'id', destSchema: () => permissionSchema },
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
    plan: { destField: 'id', sourceField: 'planID', destSchema: () => planSchema },
  },
} as const

const notificationSchema = createTableSchema({
  tableName: 'notification',
  columns: {
    id: 'string',
    title: 'string',
    content: 'string',
    readAt: { type: 'number', optional: true },
    userID: 'string',
    createdAt: 'number',
    updatedAt: 'number',
    deletedAt: { type: 'number', optional: true },
  },
  primaryKey: ['id'],
})

const permissionSchema = {
  tableName: 'permission',
  columns: {
    id: 'string',
    permission: enumeration<'read' | 'write'>(),
    actorID: 'string',
    subjectID: 'string',
    contextID: 'string',
    createdAt: 'number',
    updatedAt: 'number',
    deletedAt: { type: 'number', optional: true },
  } satisfies TableSchema['columns'],
  primaryKey: ['id'],
  relationships: {
    context: { destField: 'id', sourceField: 'contextID', destSchema: () => groupSchema },
  },
} as const

const planSchema = {
  tableName: 'plan',
  columns: {
    id: 'string',
    name: 'string',
    description: { type: 'string', optional: true },
    price: 'number',
    contextID: 'string',
    createdAt: 'number',
    updatedAt: 'number',
    deletedAt: { type: 'number', optional: true },
  } satisfies TableSchema['columns'],
  primaryKey: ['id'],
  relationships: {
    context: { destField: 'id', sourceField: 'contextID', destSchema: () => groupSchema },
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
    permissions: { destField: 'actorID', sourceField: 'id', destSchema: () => permissionSchema },
  },
} as const

export const schema = createSchema({
  version: 1,
  tables: {
    group: groupSchema,
    membership: membershipSchema,
    notification: notificationSchema,
    permission: permissionSchema,
    plan: planSchema,
    user: userSchema,
  },
})

export type GroupRow = Row<typeof groupSchema>
export type MembershipRow = Row<typeof membershipSchema>
export type NotificationRow = Row<typeof notificationSchema>
export type PermissionRow = Row<typeof permissionSchema>
export type PlanRow = Row<typeof planSchema>
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
  //   eb: ExpressionBuilder<typeof groupSchema | typeof membershipSchema | typeof permissionSchema | typeof planSchema>,
  // ) => eb.exists('context', iq => iq.where(eb => isGroupMember(authData, eb)))
  // const allowIfContextAdmin = (
  //   authData: AuthData,
  //   eb: ExpressionBuilder<typeof groupSchema | typeof membershipSchema | typeof permissionSchema | typeof planSchema>,
  // ) => eb.exists('context', iq => iq.where(eb => isGroupAdmin(authData, eb)))

  // // Notification rules
  // const allowIfReceiver = (authData: AuthData, eb: ExpressionBuilder<typeof notificationSchema>) => eb.cmp('userID', '=', authData.sub!)

  // // Permission rules
  // const allowIfAssignedToActor = (authData: AuthData, eb: ExpressionBuilder<typeof permissionSchema>) => eb.cmp('actorID', '=', authData.sub!)

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
    // notification: {
    //   row: {
    //     select: [allowIfReceiver],
    //     update: {
    //       preMutation: [allowIfReceiver],
    //     },
    //     delete: [allowIfReceiver],
    //   },
    // },
    // permission: {
    //   row: {
    //     select: [allowIfAssignedToActor, allowIfContextAdmin],
    //     insert: [allowIfContextAdmin],
    //     update: {
    //       preMutation: [allowIfContextAdmin],
    //     },
    //     delete: [allowIfContextAdmin],
    //   },
    // },
    // plan: {
    //   row: {
    //     select: [allowIfInContext],
    //     insert: [allowIfContextAdmin],
    //     update: {
    //       preMutation: [allowIfContextAdmin],
    //     },
    //     delete: [allowIfContextAdmin],
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
