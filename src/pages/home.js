import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { AuthConsumer } from '../authContext'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'
import Can from '../components/Can'
import TimezonesList from '../components/TimezonesList'
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
                <Menu.Item
                  name="login"
                  active={activeItem === 'login'}
                  onClick={initiateLogin}
                />
              </Menu.Menu>
            </Menu>
              <Can
                role={user.role}
                perform="view:timezones"
                yes={() => <TimezonesList display={activeItem === 'timezone'}/>}
              />
             <UsersList display={activeItem === 'user'}/>
          </React.Fragment>
        )
      }
    </AuthConsumer>
  )
}

export default HomePage
