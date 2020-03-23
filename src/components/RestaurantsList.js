import React, { Component, useState, useEffect } from 'react'

import { AuthConsumer } from '../authContext'
import { Image, List, Grid } from 'semantic-ui-react'
import Can from './Can'
import { Rating } from 'semantic-ui-react'
import {
  Button,
  Comment,
  Header,
  Accordion,
  Modal,
  Segment,
  Confirm,
} from 'semantic-ui-react'
import { Form, TextArea, Input } from 'semantic-ui-react-form-validator'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import {
  createReplies,
  createRestaurants,
  createReviews,
  deleteReplies,
  deleteRestaurants,
  deleteReviews,
  editReplies,
  editRestaurants,
  editReviews,
  viewRestaurants,
} from '../api/proxy'

const RestaurantsList = () => {
  const CreateOrEditRestaurantModal = (props) => {
    const [name, setName] = useState(
      props.restaurant ? props.restaurant.name : ''
    )
    const [description, setDescription] = useState(
      props.restaurant ? props.restaurant.description : ''
    )
    return (
      <Modal
        size={'small'}
        style={{
          height: 'max-content',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        trigger={props.button}
        header={props.restaurant ? 'Edit Restaurant' : 'Create Restaurant'}
        content={
          <Segment>
            <Form
              onSubmit={async () => {
                props.restaurant
                  ? await editRestaurants(
                      props.restaurant._id,
                      name,
                      description
                    )
                  : await createRestaurants(name, description, props.user)
                setRestaurants(await viewRestaurants())
              }}
            >
              <Input
                type="text"
                label="Test Input"
                onChange={(e) => {
                  setName(e.target.value)
                }}
                value={name}
                validators={['required']}
                errorMessages={['this field is required']}
                width={6}
              />
              <TextArea
                label="Description"
                validators={['required']}
                errorMessages={['Cannot Be empty']}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                }}
              />
              <Button type="submit">Submit</Button>
            </Form>
          </Segment>
        }
      />
    )
  }

  const EditReviewModal = (props) => {
    const { review, user, button } = props
    const [rating, setRating] = useState(review.rating)
    const [comment, setComment] = useState(review.comment)
    const [date, setDate] = useState(new Date(review.date_of_visit))
    console.log(date)
    return (
      <Modal
        size={'small'}
        style={{
          height: 'max-content',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'visible',
        }}
        trigger={button}
        header={'Edit Review'}
        content={
          <Segment>
            <Form
              onSubmit={() => {
                onEditCommentReview(review._id, user, date, comment, rating)
              }}
            >
              <label>
                <b>Date of visit</b>
              </label>
              <SemanticDatepicker
                style={{ paddingRight: 10 }}
                validators={['required']}
                pointing
                dateFormat={'YYYY-MM-DD'}
                onChange={(event, { name, value }) => {
                  setDate(value)
                  console.log(date)
                }}
                value={date}
              />
              <label>
                <b>Rating</b>
              </label>
              <Rating
                style={{ marginLeft: 20 }}
                maxRating={5}
                defaultRating={rating}
                onRate={(e, { rating, maxRating }) => setRating(rating)}
              />
              <TextArea
                label="Review"
                validators={['required']}
                errorMessages={['Cannot Be empty']}
                value={comment}
                onChange={(event, { name, value }) => {
                  setComment(value)
                }}
              />
              <Button color="red" onClick={() => setOpenEditReview(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </Form>
          </Segment>
        }
      />
    )
  }

  const EditReplyModal = (props) => {
    const { review, user, button } = props
    const [comment, setComment] = useState(review.reply.comment)
    return (
      <Modal
        size={'small'}
        style={{
          height: 'max-content',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'visible',
        }}
        trigger={button}
        header={'Edit Review'}
        content={
          <Segment>
            <Form
              onSubmit={() => {
                onEditCommentReply(review._id, user, comment)
              }}
            >
              <TextArea
                style={{ marginTop: 10 }}
                validators={['required']}
                errorMessages={['Cannot Be empty']}
                value={comment}
                onChange={(event, { name, value }) => {
                  setComment(value)
                }}
              />
              <Button
                content="Add Reply"
                type="submit"
                labelPosition="left"
                icon="edit"
                primary
              />
            </Form>
          </Segment>
        }
      />
    )
  }
  const [restaurants, setRestaurants] = useState([])
  useEffect(() => {
    const getRestaurant = async () => {
      const restaurants = await viewRestaurants()

      console.log(setRestaurants)
      setRestaurants(restaurants)
    }
    getRestaurant()
  }, [])
  const [activeIndices, setActiveIndices] = useState([])
  const [dates, setDates] = useState({})
  const [reviews, setReviews] = useState({})
  const [replies, setReplies] = useState({})
  const [isOpen, setOpen] = useState(false)
  const [isOpenReview, setOpenReview] = useState(false)
  const [isOpenReply, setOpenReply] = useState(false)
  const [onEditReply, setOnEditReply] = useState(false)
  const [isOpenEditReview, setOpenEditReview] = useState(false)
  const [rating, setRating] = useState(0)
  const [isExpanded, setExpanded] = useState(false)
  const [restaurantToDelete, setRestaurantToDelete] = useState('')
  const [reviewToDelete, setReviewToDelete] = useState('')
  const [replyToDelete, setReplyToDelelte] = useState('')
  const handleClick = (e, itemProps) => {
    const { index } = itemProps
    let newIndices = []
    if (activeIndices.includes(index)) {
      newIndices = activeIndices.filter((indice) => indice != index)
    } else {
      newIndices = [...activeIndices, index]
    }
    setActiveIndices(newIndices)
  }

  const handleDatePick = (event, { name, value }) => {
    setDates({ ...dates, [name]: value })
  }
  const handleSetReviews = (event, { name, value }) => {
    setReviews({ ...reviews, [name]: value })
  }

  const handleSetReplies = (event, { name, value }) => {
    setReplies({ ...replies, [name]: value })
  }

  const onCommentReview = async (id, owner) => {
    let dateFormat = require('dateformat')
    const newDate = dateFormat(dates[id], 'yyyy-mm-dd')
    await createReviews(id, newDate, reviews[id], rating, owner)
    setRestaurants(await viewRestaurants())
  }

  const onEditCommentReview = async (id, owner, date, comment, rating) => {
    let dateFormat = require('dateformat')
    const newDate = dateFormat(date, 'yyyy-mm-dd')
    await editReviews(id, newDate, comment, rating, owner)
    setRestaurants(await viewRestaurants())
  }

  const onCommentReply = async (id, owner) => {
    await createReplies(id, replies[id], owner)
    setRestaurants(await viewRestaurants())
    setOnEditReply(false)
  }

  const onEditCommentReply = async (id, owner, comment) => {
    await editReplies(id, comment, owner)
    setRestaurants(await viewRestaurants())
  }

  return (
    <AuthConsumer>
      {({ user }) => (
        <React.Fragment>
          <Button.Group style={{ marginLeft: '76%', marginBottom: '1%' }}>
            <CreateOrEditRestaurantModal
              user={user}
              button={<Button icon="plus" />}
            />
            <Button
              icon="expand"
              onClick={() => {
                setExpanded(true)
              }}
            />
            <Button
              icon="compress"
              onClick={() => {
                setExpanded(false)
              }}
            />
          </Button.Group>

          <div style={{ marginLeft: '15%' }}>
            {restaurants &&
              restaurants.map((restaurant, index) => (
                <Segment style={{ width: '80%', backgroundColor: '#f5f5f5' }}>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={2}>
                        <Image
                          circular
                          size={'tiny'}
                          style={{ marginLeft: 20 }}
                          src={restaurant.owner.picture}
                        />
                      </Grid.Column>
                      <Grid.Column width={12} rows={3} style={{ marginTop: 2 }}>
                        <Grid.Row>
                          <Grid.Column
                            style={{ fontSize: 20, paddingBottom: 5 }}
                          >
                            {restaurant.name}
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column>
                            <Rating
                              defaultRating={restaurant.avg_rating}
                              maxRating={5}
                              disabled
                            />
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column style={{ color: 'gray' }}>
                            {restaurant.description}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid.Column>
                      <Grid.Column>
                        <Button.Group style={{ marginTop: 20 }}>
                          <Can
                            role={user.role}
                            perform="edit:restaurants"
                            data={{
                              userId: user.id,
                              ownerId: restaurant.owner_id,
                            }}
                            yes={() => (
                              <CreateOrEditRestaurantModal
                                user={user}
                                restaurant={restaurant}
                                button={
                                  <Button color="white" icon={'edit'}></Button>
                                }
                              />
                            )}
                          />
                          <Can
                            role={user.role}
                            perform="delete:restaurants"
                            data={{
                              userId: user.id,
                              ownerId: restaurant.owner_id,
                            }}
                            yes={() => (
                              <React.Fragment>
                                <Button
                                  color="white"
                                  icon="delete"
                                  onClick={() => {
                                    setOpen(true)
                                    setRestaurantToDelete(restaurant._id)
                                  }}
                                />
                                <Confirm
                                  style={{
                                    height: 'max-content',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  open={isOpen}
                                  content={
                                    'Are you sure to delete this restaurant?'
                                  }
                                  onCancel={() => {
                                    setOpen(false)
                                  }}
                                  onConfirm={async () => {
                                    await deleteRestaurants(restaurantToDelete)
                                    ;(async () => {
                                      setRestaurants(await viewRestaurants())
                                    })()
                                    setOpen(false)
                                  }}
                                />
                              </React.Fragment>
                            )}
                          />
                        </Button.Group>
                      </Grid.Column>
                    </Grid.Row>
                    {isExpanded && (
                      <Grid.Row>
                        <Grid.Column>
                          <Segment
                            style={{
                              marginLeft: 40,
                              backgroundColor: '#d2d2d2',
                            }}
                          >
                            <Header as="h3" dividing>
                              Comments
                            </Header>
                            <Comment.Group style={{ maxWidth: '100%' }}>
                              {restaurant.reviews &&
                                restaurant.reviews.map((review, index) => (
                                  <Comment>
                                    <Comment.Avatar
                                      as="a"
                                      src={review.owner.picture}
                                    />
                                    <Comment.Content>
                                      <Comment.Author as="a">
                                        {review.owner.name}
                                      </Comment.Author>
                                      <Comment.Metadata>
                                        <span>{review.date_of_visit}</span>
                                        <Rating
                                          defaultRating={review.rating}
                                          maxRating={5}
                                          disabled
                                        />
                                      </Comment.Metadata>
                                      <Comment.Text>
                                        {review.comment}
                                      </Comment.Text>
                                      <React.Fragment>
                                        <Comment.Actions>
                                          <Can
                                            role={user.role}
                                            perform="create:reviews"
                                            data={{
                                              userId: user.id,
                                              ownerId: review.owner.id,
                                            }}
                                            yes={() => {
                                              return (
                                                !review.reply && (
                                                  <Comment.Action
                                                    onClick={() =>
                                                      handleClick(null, {
                                                        index: review._id,
                                                      })
                                                    }
                                                  >
                                                    Reply
                                                  </Comment.Action>
                                                )
                                              )
                                            }}
                                          />
                                          <Can
                                            role={user.role}
                                            perform="edit:reviews"
                                            data={{
                                              userId: user.id,
                                              ownerId: review.owner.id,
                                            }}
                                            yes={() => (
                                              <EditReviewModal
                                                user={user}
                                                review={review}
                                                button={
                                                  <Comment.Action>
                                                    Edit
                                                  </Comment.Action>
                                                }
                                              />
                                            )}
                                          />
                                          <Can
                                            role={user.role}
                                            perform="delete:reviews"
                                            data={{
                                              userId: user.id,
                                              ownerId: review.owner.id,
                                            }}
                                            yes={() => (
                                              <React.Fragment>
                                                <Comment.Action
                                                  onClick={() => {
                                                    setOpenReview(true)
                                                    setReviewToDelete(
                                                      review._id
                                                    )
                                                  }}
                                                >
                                                  Delete
                                                </Comment.Action>
                                                <Confirm
                                                  style={{
                                                    height: 'max-content',
                                                    left: '50%',
                                                    top: '50%',
                                                    transform:
                                                      'translate(-50%, -50%)',
                                                  }}
                                                  open={isOpenReview}
                                                  content={
                                                    'Are you sure to delete this review?'
                                                  }
                                                  onCancel={() => {
                                                    setOpenReview(false)
                                                  }}
                                                  onConfirm={async () => {
                                                    await deleteReviews(
                                                      reviewToDelete
                                                    )
                                                    ;(async () => {
                                                      setRestaurants(
                                                        await viewRestaurants()
                                                      )
                                                    })()
                                                    setOpenReview(false)
                                                  }}
                                                />
                                              </React.Fragment>
                                            )}
                                          />
                                        </Comment.Actions>
                                        {!review.reply &&
                                          activeIndices.includes(
                                            review._id
                                          ) && (
                                            <Form
                                              onSubmit={() => {
                                                onCommentReply(review._id, user)
                                              }}
                                            >
                                              <TextArea
                                                style={{ marginTop: 10 }}
                                                validators={['required']}
                                                errorMessages={[
                                                  'Cannot Be empty',
                                                ]}
                                                value={replies[review._id]}
                                                name={review._id}
                                                onChange={handleSetReplies}
                                              />
                                              <Button
                                                content="Add Reply"
                                                type="submit"
                                                labelPosition="left"
                                                icon="edit"
                                                primary
                                              />
                                            </Form>
                                          )}
                                      </React.Fragment>

                                      {!onEditReply && review.reply && (
                                        <Comment.Group>
                                          <Comment>
                                            <Comment.Avatar
                                              src={review.reply.owner.picture}
                                            />
                                            <Comment.Content>
                                              <Comment.Author as="a">
                                                {review.reply.owner.name}
                                              </Comment.Author>
                                              <Comment.Text>
                                                {review.reply.comment}
                                              </Comment.Text>
                                            </Comment.Content>
                                            <Comment.Actions>
                                              <EditReplyModal
                                                user={user}
                                                review={review}
                                                button={
                                                  <Comment.Action>
                                                    Edit
                                                  </Comment.Action>
                                                }
                                              />
                                              <Comment.Action
                                                onClick={() => {
                                                  setOpenReply(true)
                                                  setReplyToDelelte(review._id)
                                                }}
                                              >
                                                Delete
                                              </Comment.Action>
                                              <Confirm
                                                style={{
                                                  height: 'max-content',
                                                  left: '50%',
                                                  top: '50%',
                                                  transform:
                                                    'translate(-50%, -50%)',
                                                }}
                                                open={isOpenReply}
                                                content={
                                                  'Are you sure to delete this reply?'
                                                }
                                                onCancel={() => {
                                                  setOpenReply(false)
                                                }}
                                                onConfirm={async () => {
                                                  await deleteReplies(
                                                    replyToDelete
                                                  )
                                                  ;(async () => {
                                                    setRestaurants(
                                                      await viewRestaurants()
                                                    )
                                                  })()
                                                  setOpenReply(false)
                                                }}
                                              />
                                            </Comment.Actions>
                                          </Comment>
                                        </Comment.Group>
                                      )}
                                    </Comment.Content>
                                  </Comment>
                                ))}

                              <Accordion>
                                <Accordion.Title
                                  onClick={handleClick}
                                  index={restaurant._id}
                                >
                                  <Comment.Actions>
                                    <Comment.Action
                                      style={{
                                        color: 'gray',
                                        fontSize: 'small',
                                      }}
                                    >
                                      Review
                                    </Comment.Action>
                                  </Comment.Actions>
                                </Accordion.Title>
                                <Accordion.Content
                                  active={activeIndices.includes(
                                    restaurant._id
                                  )}
                                >
                                  <Form
                                    onSubmit={() => {
                                      onCommentReview(restaurant._id, user)
                                    }}
                                  >
                                    <label>
                                      <b>Date of visit</b>
                                    </label>
                                    <SemanticDatepicker
                                      validators={['required']}
                                      pointing
                                      dateFormat={'YYYY-MM-DD'}
                                      onChange={handleDatePick}
                                      name={restaurant._id}
                                      value={dates[restaurant._id]}
                                    />
                                    <label>
                                      <b>Rating</b>
                                    </label>
                                    <Rating
                                      style={{ marginLeft: 20 }}
                                      maxRating={5}
                                      onRate={(e, { rating, maxRating }) =>
                                        setRating(rating)
                                      }
                                    />
                                    <TextArea
                                      label="Description"
                                      validators={['required']}
                                      errorMessages={['Cannot Be empty']}
                                      value={reviews[restaurant._id]}
                                      name={restaurant._id}
                                      onChange={handleSetReviews}
                                    />
                                    <Button type="submit">Submit</Button>
                                  </Form>
                                </Accordion.Content>
                              </Accordion>
                            </Comment.Group>
                          </Segment>
                        </Grid.Column>
                      </Grid.Row>
                    )}
                  </Grid>
                </Segment>
              ))}
          </div>
        </React.Fragment>
      )}
    </AuthConsumer>
  )
}

export default RestaurantsList
