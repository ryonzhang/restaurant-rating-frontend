import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { AuthConsumer } from '../authContext'
import Login from '../components/Login'
import PostsList from '../components/PostsList'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'
import Can from '../components/Can'
import { Button, Confirm, Grid, Popup } from 'semantic-ui-react'
import { deleteRestaurants, viewRestaurants } from '../api/proxy'
import RestaurantsList from '../components/RestaurantsList'
import Profile from '../components/Profile'

const HomePage = () => {
  const [activeItem, setActiveItem] = useState('restaurant')
  return (
    <AuthConsumer>
      {({ authenticated, initiateLogin, user }) =>
        authenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <React.Fragment>
            <Menu size={'huge'}>
              <Menu.Item
                name="Restaurant"
                active={activeItem === 'restaurant'}
                onClick={() => setActiveItem('restaurant')}
              />
              <Can
                role={user.role}
                perform="edit:users"
                yes={() => (
                  <Menu.Item
                    name="User"
                    active={activeItem === 'user'}
                    onClick={() => setActiveItem('user')}
                  />
                )}
              />
              <Menu.Menu position="right">
                <Menu.Item
                  name="login"
                  active={activeItem === 'login'}
                  onClick={initiateLogin}
                />
              </Menu.Menu>
            </Menu>
            <RestaurantsList />
          </React.Fragment>
        )
      }
    </AuthConsumer>
  )
}

export default HomePage
