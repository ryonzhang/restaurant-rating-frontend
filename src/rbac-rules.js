const userCheck = ({ userId, ownerId }) => {
  if (!userId || !ownerId) return false
  return userId === ownerId
}

const rules = {
  manager: {
    static: ['view:users', 'delete:users', 'change:roles', 'edit:users','create:users'],
  },
  user: {
    static: ['create:timezones','view:timezones','delete:timezones'],
    dynamic: {
      'view:timezones': userCheck,
      'edit:timezones': userCheck,
      'delete:timezones': userCheck,
    },
  },
  admin: {
    static: [
      'view:timezones','edit:timezones','delete:timezones','create:timezones','view:users', 'delete:users', 'change:roles', 'edit:users','create:users'
    ],
  },
}

export default rules
