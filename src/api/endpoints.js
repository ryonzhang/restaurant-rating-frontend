const HOST = 'http://localhost:3001/'

const VIEW_RESTAURANTS = HOST + 'restaurants'

const CREATE_RESTAURANTS = HOST + 'restaurants'

const EDIT_RESTAURANTS = (id) => HOST + 'restaurants/' + id

const DELETE_RESTAURANTS = (id) => HOST + 'restaurants/' + id

const VIEW_REVIEWS = HOST + 'reviews'

const CREATE_REVIEWS = (restaurant_id) => HOST + 'reviews/' + restaurant_id

const EDIT_REVIEWS = (review_id) => HOST + 'reviews/' + review_id

const DELETE_REVIEWS = (review_id) => HOST + 'reviews/' + review_id

const VIEW_REPLIES = HOST + 'replies'

const CREATE_REPLIES = (review_id) => HOST + 'replies/' + review_id

const EDIT_REPLIES = (review_id) => HOST + 'replies/' + review_id

const DELETE_REPLIES = (review_id) => HOST + 'replies/' + review_id

const VIEW_USERS = HOST + 'users'

const EDIT_USERS = (user_id) => HOST + 'users/' + user_id

const DELETE_ROLE = (user_id) => HOST + 'users/' + user_id + '/role'

const DELETE_USERS = (user_id) => HOST + 'users/' + user_id

const VIEW_ROLES = HOST + 'users/roles'

export {
  VIEW_RESTAURANTS,
  CREATE_RESTAURANTS,
  EDIT_RESTAURANTS,
  DELETE_RESTAURANTS,
  VIEW_REVIEWS,
  CREATE_REVIEWS,
  EDIT_REVIEWS,
  DELETE_REVIEWS,
  VIEW_REPLIES,
  CREATE_REPLIES,
  EDIT_REPLIES,
  DELETE_REPLIES,
  VIEW_USERS,
  EDIT_USERS,
  VIEW_ROLES,
  DELETE_ROLE,
  DELETE_USERS,
}
