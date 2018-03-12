import React from 'react'

export default function EventWrapper({ event, children }) {
  return <div className={`${event.salary} calendar-event`}>{children}</div>
}