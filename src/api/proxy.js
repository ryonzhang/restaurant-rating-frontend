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
  VIEW_USERS,
  EDIT_USERS,
  VIEW_ROLES,
  DELETE_ROLE,
  DELETE_USERS,
} from './endpoints'

const config = (token) => {
  return {
    headers: {
      authorization: 'Bearer ' + token,
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
  }
}

const getToken = () => {
  const auth = JSON.parse(localStorage.getItem('auth'))
  console.log(auth)
  return auth.accessToken
}

const getUser = () => {
  const auth = JSON.parse(localStorage.getItem('auth'))
  return auth.user
}

const viewRestaurants = async () => {
  const response = await axios.get(VIEW_RESTAURANTS, config(getToken()))
  return response.data.sort((a, b) => {
    if (a.avg_rating > b.avg_rating) {
      return 1
    } else {
      return -1
    }
  })
}

const editRestaurants = async (id, name, description) => {
  const response = await axios.put(
    EDIT_RESTAURANTS(id),
    { name, description },
    config(getToken())
  )
  console.log(response.data)
}

const createRestaurants = async (name, description, owner) => {
  const response = await axios.post(
    CREATE_RESTAURANTS,
    {
      name,
      description,
      owner,
      owner_id: owner.id,
    },
    config(getToken())
  )
  console.log(response.data)
}

const deleteRestaurants = async (id) => {
  const response = await axios.delete(
    DELETE_RESTAURANTS(id),
    config(getToken())
  )
  console.log(response.data)
}

const viewReviews = async (id) => {
  const response = await axios.get(VIEW_REVIEWS(id), config(getToken()))
  console.log(response.status)
}

const editReviews = async (id, date_of_visit, comment, rating, owner) => {
  const response = await axios.put(
    EDIT_REVIEWS(id),
    {
      date_of_visit,
      comment,
      rating,
      owner,
    },
    config(getToken())
  )
  console.log(response.data)
}

const createReviews = async (id, date_of_visit, comment, rating, user) => {
  const response = await axios.post(
    CREATE_REVIEWS(id),
    {
      date_of_visit,
      comment,
      rating,
      owner: user,
    },
    config(getToken())
  )
  console.log(response.data)
}

const deleteReviews = async (id) => {
  const response = await axios.delete(DELETE_REVIEWS(id), config(getToken()))
  console.log(response.data)
}

const viewReplies = async (id) => {
  const response = await axios.get(VIEW_REPLIES(id), config(getToken()))
  console.log(response.status)
}

const editReplies = async (id, comment, owner) => {
  const response = await axios.post(
    CREATE_REPLIES(id),
    { comment, owner },
    config(getToken())
  )
  console.log(response.data)
}

const createReplies = async (id, comment, owner) => {
  const response = await axios.post(
    CREATE_REPLIES(id),
    { comment, owner },
    config(getToken())
  )
  console.log(response.data)
}

const deleteReplies = async (id) => {
  const response = await axios.delete(DELETE_REPLIES(id), config(getToken()))
  console.log(response.data)
}

const viewUsers = async () => {
  const response = await axios.get(VIEW_USERS, config(getToken()))
  return response.data
}

const editUsers = async (id, isAdd, role) => {
  const response = isAdd
    ? await axios.post(EDIT_USERS(id), { roles: [role] }, config(getToken()))
    : await axios.delete(DELETE_ROLE(id), {
        data: { roles: [role] },
        ...config(getToken()),
      })
  console.log(response.status)
}

const viewRoles = async () => {
  const response = await axios.put(VIEW_ROLES, null, config(getToken()))
  return response.data
}

const deleteUsers = async (id) => {
  const response = await axios.delete(DELETE_USERS(id), config(getToken()))
  return response.data
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
  editUsers,
  viewUsers,
  viewRoles,
  deleteUsers,
}
