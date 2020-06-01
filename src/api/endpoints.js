const HOST = 'http://localhost:3001/'

const VIEW_TIMEZONES = HOST + 'timezones'

const CREATE_TIMEZONES = HOST + 'timezones'

const EDIT_TIMEZONES = (id) => HOST + 'timezones/' + id

const DELETE_TIMEZONES = (id) => HOST + 'timezones/' + id

const VIEW_USERS = HOST + 'users'

const ADD_USERS = HOST + 'users'

const EDIT_USERS = (user_id) => HOST + 'users/' + user_id

const DELETE_ROLE = (user_id) => HOST + 'users/' + user_id + '/role'

const DELETE_USERS = (user_id) => HOST + 'users/' + user_id

const VIEW_ROLES = HOST + 'users/roles'

export {
  VIEW_TIMEZONES,
  CREATE_TIMEZONES,
  EDIT_TIMEZONES,
  DELETE_TIMEZONES,
  VIEW_USERS,
  EDIT_USERS,
  VIEW_ROLES,
  ADD_USERS,
  DELETE_ROLE,
  DELETE_USERS,
}
