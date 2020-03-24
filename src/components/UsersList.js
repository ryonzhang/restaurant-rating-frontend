import React, { Component, useState, useEffect } from 'react'
import { AuthConsumer } from '../authContext'
import { List, Checkbox, Image, Segment, Button } from 'semantic-ui-react'
import { deleteUsers, viewRoles, viewUsers, editUsers } from '../api/proxy'
import Can from './Can'
const UsersList = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [state, setState] = useState(false)
  const getState = (user, role) => {
    console.log(user)
    console.log(role)
    return user.roles.map((r) => r.id).includes(role.id)
  }
  useEffect(() => {
    Promise.all([viewUsers(), viewRoles()]).then(function (values) {
      setUsers(values[0])
      setRoles(values[1])
    })
  }, [])
  return (
    <AuthConsumer>
      {({ user }) => (
        <Segment style={{ width: '60%', left: '20%' }}>
          <Can
            role={user.role}
            perform="view:users"
            yes={() => (
              <List divided verticalAlign="middle">
                {users.map((u, index) => (
                  <List.Item>
                    <List.Content floated="right">
                      <Can
                        role={user.role}
                        perform="change:roles"
                        yes={() => (
                          <React.Fragment>
                            {roles.map((role, i) => (
                              <Checkbox
                                label={role.description}
                                onClick={async () => {
                                  const isChecked = u.roles
                                    .map((r) => r.id)
                                    .includes(role.id)

                                  if (isChecked) {
                                    users[index].roles = u.roles.filter(
                                      (r) => r.id !== role.id
                                    )
                                    setUsers(users)
                                  } else {
                                    users[index].roles.push(role)
                                    setUsers(users)
                                  }
                                  setState(!state)
                                  console.log(users)
                                  await editUsers(
                                    u.user_id,
                                    !isChecked,
                                    role.id
                                  )
                                }}
                                checked={getState(u, role)}
                                toggle
                                style={{ marginRight: 20 }}
                              />
                            ))}
                          </React.Fragment>
                        )}
                      />
                      <Can
                        role={user.role}
                        perform="delete:users"
                        yes={() => (
                          <Button
                            color="white"
                            icon="delete"
                            disabled={u.user_id === user.id}
                            onClick={async () => {
                              setUsers(
                                users.filter((i) => i.user_id !== u.user_id)
                              )
                              await deleteUsers(u.user_id)
                            }}
                          />
                        )}
                      />
                    </List.Content>
                    <Image avatar src={u.picture} />
                    <List.Content>
                      <List.Header as="a">{u.name}</List.Header>
                      <List.Description>{u.user_id}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            )}
          />
        </Segment>
      )}
    </AuthConsumer>
  )
}

export default UsersList
