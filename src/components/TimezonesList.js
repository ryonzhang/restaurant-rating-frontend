import React, { Component, useState, useEffect } from 'react'

import { AuthConsumer } from '../authContext'
import { Image, Card, Popup,Input as SemanticInput } from 'semantic-ui-react'
import Can from './Can'
import Clock from 'react-live-clock'

import useForceUpdate from 'use-force-update'
import { Button, Modal, Segment, Confirm } from 'semantic-ui-react'
import { Form, TextArea, Input } from 'semantic-ui-react-form-validator'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'
import {
  createTimezones,
  deleteTimezones,
  editTimezones,
  viewTimezones,
  getZoneInfoFromGoogle,
} from '../api/proxy'
import MyClock from './MyClock'
import LocationPicker from 'react-location-picker'
var moment = require('moment')

/* Default position */

const TimezonesList = ({display}) => {
  const forceUpdate = useForceUpdate()
  const [clockVisble, setClockVisible] = useState(true)

  const diffString=(tz)=>{
    var now = moment();
    var localOffset = now.utcOffset();
    now.tz(tz);
    var centralOffset = now.utcOffset();
    var diffInMinutes = localOffset - centralOffset;
    return diffInMinutes<0? (-diffInMinutes/60)+' hour(s) ahead':(diffInMinutes/60)+' hour(s) behind'
  }

  const CreateOrEditTimezoneModal = ({ timezone, user, button }) => {
    const [nameValue, setNameValue] = useState(timezone ? timezone.name : '')
    const [cityValue, setCityValue] = useState(timezone ? timezone.city : '')
    const [latValue, setLatValue] = useState(timezone ? timezone.lat : 0)
    const [longValue, setLongValue] = useState(timezone ? timezone.long : 0)
    const [tz, setTz] = useState(timezone ? timezone.tz : '')
    const [error, setError] = useState('')
    const [clock, setClock] = useState(true)
    const [changeByInput,setChangeByInput] = useState(false)
    useEffect(() => setClock(!!timezone),[])

    const handleLocationChange = ({ position, address, places }) => {
      if(!changeByInput) {
        const place = places.filter(
          (place) =>
            place.types.includes('locality') ||
            place.types.includes('country') ||
            place.types.includes('administrative_area_level_2')
        )
        console.log(places)
        console.log(place)
        if (place.length > 0) {
          setCityValue(place[0].formatted_address)
          setLatValue(place[0].geometry.location.lat())
          setLongValue(place[0].geometry.location.lng())
          getZoneInfoFromGoogle(
            place[0].geometry.location.lat(),
            place[0].geometry.location.lng()
          ).then((response) => {
            setTz(response.timeZoneId)
            setClock(false)
            setTimeout(function () {
              setClock(true)
            }, 1)
          })
        }
      }
    }

    const handleChange = (address) => {
      setCityValue(address)
    }
    const sleep = (milliseconds) => {
      const date = Date.now()
      let currentDate = null
      do {
        currentDate = Date.now()
      } while (currentDate - date < milliseconds)
    }

    const handleSelect = async (address) => {
      const results = await geocodeByAddress(address)
      console.log(results[0])
      setCityValue(results[0].formatted_address)
      setLatValue(results[0].geometry.location.lat())
      setLongValue(results[0].geometry.location.lng())
      const zoneInfo = await getZoneInfoFromGoogle(
        results[0].geometry.location.lat(),
        results[0].geometry.location.lng()
      )
      setTz(zoneInfo.timeZoneId)
      setChangeByInput(true)
      setTimeout(function () {
        setChangeByInput(false)
      }, 500)
      setClock(false)
      setTimeout(function () {
        setClock(true)
      }, 1)
    }
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
        header={timezone ? 'Edit Timezone' : 'Create Timezone'}
        content={
          <Segment>
            <Form
              onSubmit={async () => {
                const response= timezone
                  ? await editTimezones(
                      timezone._id,
                      nameValue,
                      cityValue,
                      latValue,
                      longValue,
                      tz
                    )
                  : await createTimezones(
                      nameValue,
                      cityValue,
                      latValue,
                      longValue,
                      tz,
                      user
                    )
                console.log(response)
                if(response.status>=400){
                  setError(response.data)
                  console.log(response)
                }else{
                  setTimezones(await viewTimezones())

                  setClockVisible(false)
                  setTimeout(function () {
                    setClockVisible(true)
                  }, 0.1)
                  sleep(100)
                }

              }}
            >
              <div>
                <LocationPicker
                  containerElement={<div style={{ height: '100%' }} />}
                  mapElement={<div style={{ height: '400px' }} />}
                  defaultPosition={{ lat: latValue, lng: longValue }}
                  zoom={3}
                  onChange={handleLocationChange}
                />
              </div>
              <p className={'error'}>{error && 'Error:'+error}</p>
              <Input
                type="text"
                label="Name"
                onChange={(e) => {
                  setNameValue(e.target.value)
                }}
                value={nameValue}
                validators={['required']}
                errorMessages={['this field is required']}
                width={16}
              />

              <PlacesAutocomplete
                value={cityValue}
                onChange={handleChange}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <Input
                      {...getInputProps({
                        placeholder: 'Search Places ...',
                        className: 'location-search-input',
                      })}
                      label="City"
                      width={16}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const className = suggestion.active
                          ? 'suggestion-item--active'
                          : 'suggestion-item'
                        const style = suggestion.active
                          ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                          : { backgroundColor: '#ffffff', cursor: 'pointer' }
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
              <div className={'submit'}>
                <div className={'submit-clock'}>
                  {clock && (
                    <div style={{display:'flex',flexDirection:'row'}}>
                      <Clock format={'HH:mm:ss'} ticking={false} timezone={tz} />
                      <p className={'submit-clock-description'}>{diffString(tz)}</p>
                    </div>
                  )}
                </div>
                <Button className={'submit-button'} type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Segment>
        }
      />
    )
  }
  const [timezones, setTimezones] = useState([])
  const [isOpen, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [timezoneToDelete, setTimezoneToDelete] = useState('')
  useEffect(() => {
    const getTimezone = async () => {
      const timezones = await viewTimezones()
      setTimezones(timezones)
    }
    getTimezone()
  }, [])

  return (
    <AuthConsumer>
      {({ user }) => (
        <React.Fragment>
          <div className={`main ${display?'display':'none'}`}>

          <div className={'toolbar'}>
              <Button.Group>
                <Can
                  role={user.role}
                  perform="create:timezones"
                  yes={() => (
                    <CreateOrEditTimezoneModal
                      user={user}
                      button={<Button icon="plus" />}
                    />
                  )}
                />
              </Button.Group>
              <SemanticInput className={'filter'} size='large' icon='filter' placeholder='Filter...' onChange={(event,text)=>{
                setFilter(text.value)
                console.log(text.value)
              }} />
            </div>
            <Card.Group>
              {timezones &&
                timezones.filter(timezone=>timezone.name.includes(filter)).map((timezone, index) => (
                  <Can
                    role={user.role}
                    perform="view:timezones"
                    data={{
                      userId: user.id,
                      ownerId: timezone.user.id,
                    }}
                    yes={() => (
                      <Card>
                        <Card.Content>
                          <Popup
                            content={timezone.user.email}
                            key={timezone.user.name}
                            header={timezone.user.name}
                            trigger={
                              <Image
                                floated="right"
                                size="mini"
                                src={timezone.user.picture}
                                alt={timezone.user.name}
                              />
                            }
                          />
                          <Card.Header>{timezone.name}</Card.Header>
                          <Card.Meta>
                            <p className={'card-city-name'}>{timezone.city}</p>
                          </Card.Meta>
                          <Card.Description>
                            <div className={'card-content-clock'}>
                              {clockVisble && (
                                <MyClock
                                  size={200}
                                  time={
                                    new Date(
                                      new Intl.DateTimeFormat('en-US', {
                                        timeZone: timezone.tz,
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                      }).format(new Date())
                                    )
                                  }
                                />
                              )}
                              {clockVisble && (
                                <div className={'card-display-time'}>

                                  <Popup
                                    content={diffString(timezone.tz)}
                                    key={timezone.tz}
                                    header={timezone.tz}
                                    trigger={
                                      <Clock
                                        format={'HH:mm:ss'}
                                        ticking={true}
                                        timezone={timezone.tz}
                                      />
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                          <div className="ui two buttons">
                            <Can
                              role={user.role}
                              perform="edit:timezones"
                              data={{
                                userId: user.id,
                                ownerId: timezone.user.id,
                              }}
                              yes={() => (
                                <CreateOrEditTimezoneModal
                                  timezone={timezone}
                                  user={user}
                                  button={
                                    <Button basic color="green">
                                      Edit
                                    </Button>
                                  }
                                />
                              )}
                            />
                            <Can
                              role={user.role}
                              perform="delete:timezones"
                              data={{
                                userId: user.id,
                                ownerId: timezone.user.id,
                              }}
                              yes={() => (
                                <React.Fragment>
                                  <Button
                                    basic
                                    color="red"
                                    onClick={() => {
                                      setOpen(true)
                                      setTimezoneToDelete(timezone._id)
                                    }}
                                  >
                                    Delete
                                  </Button>
                                  <Confirm
                                    style={{
                                      height: 'max-content',
                                      left: '50%',
                                      top: '50%',
                                      transform: 'translate(-50%, -50%)',
                                    }}
                                    open={isOpen}
                                    content={
                                      'Are you sure to delete this timezone?'
                                    }
                                    onCancel={() => {
                                      setOpen(false)
                                    }}
                                    onConfirm={async () => {
                                      await deleteTimezones(timezoneToDelete)
                                      ;(async () => {
                                        setTimezones(await viewTimezones())
                                      })()
                                      setOpen(false)
                                    }}
                                  />
                                </React.Fragment>
                              )}
                            />
                          </div>
                        </Card.Content>
                      </Card>
                    )}
                  />
                ))}
            </Card.Group>
          </div>
        </React.Fragment>
      )}
    </AuthConsumer>
  )
}
export default TimezonesList
