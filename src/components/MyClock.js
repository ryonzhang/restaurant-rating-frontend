import React, { useState, useEffect } from 'react'
import Clock from 'react-clock'
var moment = require('moment')

const MyClock = ({ time, size }) => {
  const [timeValue, setTimeValue] = useState(moment(time))
  console.log(time)
  useEffect(() => {
    setInterval(() => {
      const newTime = timeValue.add(1, 'seconds')
      setTimeValue(moment(newTime))
      console.log(timeValue)
    }, 1000)
  }, [])

  return <Clock value={timeValue.toDate()} size={size} />
}

export default MyClock
