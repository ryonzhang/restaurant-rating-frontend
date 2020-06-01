import React, { Component, useState, useEffect } from 'react'
import { AuthConsumer } from '../authContext'
import {List, Checkbox, Image, Segment, Button, Input as SemanticInput, Modal} from 'semantic-ui-react'
import {
  deleteUsers,
  viewRoles,
  viewUsers,
  editUsers,
  addUsers,
  getZoneInfoFromGoogle,
  editTimezones, createTimezones, viewTimezones
} from '../api/proxy'
import Can from './Can'
import PlacesAutocomplete, {geocodeByAddress} from "react-places-autocomplete";
import {Form, Input} from "semantic-ui-react-form-validator";
import Clock from "react-live-clock";
const UsersList = ({display}) => {
  const CreateUsersModal = ({button}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
      <Modal
        size={'small'}
        style={{
          height: 'max-content',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        trigger={button}
        header={'Create User'}
        content={
          <Segment>
            <Form
              onSubmit={async () => {
                const user = await addUsers(email,password);
                console.log(user);
                setUsers([...users,user])
              }}
            >
              <Input
                type="text"
                label="Email"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                value={email}
                validators={['required','isEmail']}
                errorMessages={['this field is required','this should be a valid email']}
                width={16}
              />
              <Input
                type="password"
                label="Password"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                value={password}
                validators={['required','matchRegexp:^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*$']}
                errorMessages={['this field is required','password has to be at least 10 chars with 1 uppercase,1 lowercase,1 special char,1 number']}
                width={16}
              />
              <div className={'submit-create-users'}>
                <Button type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Segment>
        }
      />
    )
  }
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
        <div className={display?'display':'none'}>
        <div className={'user-toolbar'}>
          <Button.Group>
            <Can
              role={user.role}
              perform="create:users"
              yes={() => (
                <CreateUsersModal
                  button={<Button icon="plus" />}
                />
              )}
            />
          </Button.Group>
        </div>
        <Segment style={{ width: '60%', left: '20%' }} >
          <Can
            role={user.role}
            perform="view:users"
            yes={() => (
              <List divided verticalAlign="middle" >
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
        </div>
      )}
    </AuthConsumer>
  )
}

export default UsersList
