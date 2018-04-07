import React from 'react'

import { IconButton } from 'material-ui'
import { LocalShipping, Face } from 'material-ui-icons'

export default function Event({ event, classes, onSetEvent, onSetWork, modality }) {
  return (
    <React.Fragment>
      <span className={'event-title'}>{event.title}</span>
      {modality === 'pay' && <span className={'event-work'}>
        <IconButton
          variant="raised"
          color="primary"
          className={classes.smallIconButton}
          onClick={e => onSetWork(e, event)}
        >
          <LocalShipping className={classes.smallIcon} />
        </IconButton>
      </span>}
      {!event.money ? (
        <IconButton
          variant="raised"
          color="primary"
          className={`event-money ${classes.smallIconButton}`}
          onClick={e => onSetEvent(e, event)}
        >
          <Face className={classes.smallIcon} />
        </IconButton>
      ) : (
          <span className={'money-detail'}>  
            ${event.money} €
          </span>
        )}
    </React.Fragment>
  )
}