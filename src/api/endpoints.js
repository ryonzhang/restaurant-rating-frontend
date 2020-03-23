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
}
