import React from 'react'

import restaurants from '../restaurants'
import { AuthConsumer } from '../authContext'
import Can from './Can'

const PostsList = () => (
  <AuthConsumer>
    {({ user }) => (
      <div>
        <h2>Restaurant List</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr key={restaurant._id}>
                <th scope="row">{index + 1}</th>
                <td>{restaurant.name}</td>
                <td>
                  <Can
                    role={user.role}
                    perform="edit:restaurants"
                    data={{
                      userId: user.id,
                      ownerId: restaurant.owner_id,
                    }}
                    yes={() => (
                      <button className="btn btn-sm btn-default">
                        Edit Restaurant
                      </button>
                    )}
                  />
                  <Can
                    role={user.role}
                    perform="delete:restaurants"
                    yes={() => (
                      <button className="btn btn-sm btn-danger">
                        Delete Restaurants
                      </button>
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </AuthConsumer>
)

export default PostsList
