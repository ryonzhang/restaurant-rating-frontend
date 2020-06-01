import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { AuthConsumer } from '../authContext'
import Can from '../components/Can'
import Profile from '../components/Profile'
import TimezonesList from '../components/TimezonesList'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'
import { Popup } from 'semantic-ui-react'
import UsersList from '../components/UsersList'
const DashboardPage = () => {
  const [activeItem, setActiveItem] = useState('restaurant')
  return (
    <AuthConsumer>
      {({ user, logout, authenticated }) =>
        !authenticated ? (
          <Redirect to="/" />
        ) : (
          <div>
            <Menu size={'huge'}>
              <Menu.Item
                name="Timezones"
                active={activeItem === 'timezone'}
                onClick={() => setActiveItem('timezone')}
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
                <Popup
                  trigger={
                    <Menu.Item
                      name="account"
                      active={activeItem === 'account'}
                      onClick={() => setActiveItem('account')}
                    />
                  }
                >
                  <Profile />
                </Popup>
                <Menu.Item
                  name="logout"
                  active={activeItem === 'logout'}
                  onClick={logout}
                />
              </Menu.Menu>
            </Menu>
            <TimezonesList display={activeItem === 'timezone'}/>
            <UsersList display={activeItem === 'user'}/>
          </div>
        )
      }
    </AuthConsumer>
  )
}

export default DashboardPage
