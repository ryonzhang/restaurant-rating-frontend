import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { AuthConsumer } from '../authContext'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'
import Can from '../components/Can'
import RestaurantsList from '../components/RestaurantsList'
import UsersList from '../components/UsersList'

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
            {activeItem === 'restaurant' && (
              <Can
                role={user.role}
                perform="view:restaurants"
                yes={() => <RestaurantsList />}
              />
            )}
            {activeItem === 'user' && <UsersList />}
          </React.Fragment>
        )
      }
    </AuthConsumer>
  )
}

export default HomePage
