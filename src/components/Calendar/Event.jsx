import React from 'react'

import { IconButton } from 'material-ui'
import { Face } from 'material-ui-icons'

export default function Event({ event, classes, onSetEvent }) {
  return (
    <React.Fragment>
      <span className={'event-title'}>{event.title}</span>
      <span className={'event-money'}>
        {!event.money ? (
          <IconButton
            variant="raised"
            color="primary"
            className={classes.smallIconButton}
            onClick={e => onSetEvent(e, event)}
          >
            <Face className={classes.smallIcon} />
          </IconButton>
        ) : (
            `${event.money} €`
          )}
      </span>
    </React.Fragment>
  )
}