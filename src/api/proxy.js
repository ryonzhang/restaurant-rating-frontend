import axios from 'axios'
import {
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
} from './endpoints'

const viewRestaurants = async () => {
  const response = await axios.get(VIEW_RESTAURANTS)
  return response.data
}

const editRestaurants = async (id, name, description) => {
  const response = await axios.put(EDIT_RESTAURANTS(id), { name, description })
  console.log(response.data)
}

const createRestaurants = async (name, description, owner) => {
  const response = await axios.post(CREATE_RESTAURANTS, {
    name,
    description,
    owner,
    owner_id: owner.id,
  })
  console.log(response.data)
}

const deleteRestaurants = async (id) => {
  const response = await axios.delete(DELETE_RESTAURANTS(id))
  console.log(response.data)
}

const viewReviews = async (id) => {
  const response = await axios.get(VIEW_REVIEWS(id))
  console.log(response.status)
}

const editReviews = async (id, date_of_visit, comment, rating, owner) => {
  const response = await axios.put(EDIT_REVIEWS(id), {
    date_of_visit,
    comment,
    rating,
    owner,
  })
  console.log(response.data)
}

const createReviews = async (id, date_of_visit, comment, rating, user) => {
  const response = await axios.post(CREATE_REVIEWS(id), {
    date_of_visit,
    comment,
    rating,
    owner: user,
  })
  console.log(response.data)
}

const deleteReviews = async (id) => {
  const response = await axios.delete(DELETE_REVIEWS(id))
  console.log(response.data)
}

const viewReplies = async (id) => {
  const response = await axios.get(VIEW_REPLIES(id))
  console.log(response.status)
}

const editReplies = async (id, comment, owner) => {
  const response = await axios.post(CREATE_REPLIES(id), { comment, owner })
  console.log(response.data)
}

const createReplies = async (id, comment, owner) => {
  const response = await axios.post(CREATE_REPLIES(id), { comment, owner })
  console.log(response.data)
}

const deleteReplies = async (id) => {
  const response = await axios.delete(DELETE_REPLIES(id))
  console.log(response.data)
}

export {
  viewRestaurants,
  editRestaurants,
  createRestaurants,
  deleteRestaurants,
  viewReviews,
  editReviews,
  createReviews,
  deleteReviews,
  viewReplies,
  editReplies,
  createReplies,
  deleteReplies,
}
