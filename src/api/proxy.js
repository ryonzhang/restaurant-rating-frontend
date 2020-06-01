import axios from 'axios'
import {
  VIEW_TIMEZONES,
  CREATE_TIMEZONES,
  EDIT_TIMEZONES,
  DELETE_TIMEZONES,
  VIEW_USERS,
  ADD_USERS,
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
  return auth && auth.accessToken
}

const viewTimezones = async () => {
  const response = await axios.get(VIEW_TIMEZONES, config(getToken()))
  return response.data.sort((a, b) => {
    if (a.avg_rating > b.avg_rating) {
      return 1
    } else {
      return -1
    }
  })
}

const getZoneInfoFromGoogle = async (lat, lng) => {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/timezone/json?location=' +
      lat +
      ',' +
      lng +
      '&timestamp=1458000000&key=AIzaSyCUZQEHru9-ko3r1jCXuS0wHX1urwM6ck0'
  )
  console.log(response.data)
  return response.data
}

const editTimezones = async (id, name, city, lat, long, tz) => {
  const response = await axios.put(
    EDIT_TIMEZONES(id),
    { name, city, lat, long, tz },
    config(getToken())
  ).catch(err=>{
    return err.response
  })
  return response
}

const createTimezones = async (name, city, lat, long, tz, user) => {
  const response = await axios.post(
    CREATE_TIMEZONES,
    {
      name,
      city,
      lat,
      long,
      tz,
      user,
    },
    config(getToken())
  ).catch(err=>{
    return err.response
  })
  return response
}

const deleteTimezones = async (id) => {
  const response = await axios.delete(DELETE_TIMEZONES(id), config(getToken()))
  console.log(response.data)
}

const viewUsers = async () => {
  const response = await axios.get(VIEW_USERS, config(getToken()))
  return response.data
}

const addUsers = async (email,password) => {
  const response = await axios.post(ADD_USERS,{email,password}, config(getToken()))
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
  viewTimezones,
  editTimezones,
  createTimezones,
  deleteTimezones,
  editUsers,
  viewUsers,
  addUsers,
  viewRoles,
  deleteUsers,
  getZoneInfoFromGoogle,
}
