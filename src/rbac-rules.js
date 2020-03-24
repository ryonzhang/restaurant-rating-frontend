const userCheck = ({ userId, ownerId }) => {
  if (!userId || !ownerId) return false
  return userId === ownerId
}

const rules = {
  owner: {
    static: ['create:restaurants', 'view:reviews', 'view:replies'],
    dynamic: {
      'edit:restaurants': userCheck,
      'delete:restaurants': userCheck,
      'create:replies': userCheck,
      'edit:replies': userCheck,
      'delete:replies': userCheck,
      'view:restaurants': userCheck,
    },
  },
  visitor: {
    static: [
      'view:restaurants',
      'view:reviews',
      'view:replies',
      'create:reviews',
    ],
    dynamic: {
      'edit:reviews': userCheck,
      'delete:reviews': userCheck,
    },
  },
  admin: {
    static: [
      'view:restaurants',
      'view:reviews',
      'view:replies',
      'edit:restaurants',
      'edit:reviews',
      'edit:replies',
      'delete:restaurants',
      'delete:reviews',
      'delete:replies',
      'view:users',
      'delete:users',
      'change:roles',
      'edit:users',
    ],
  },
}

export default rules
