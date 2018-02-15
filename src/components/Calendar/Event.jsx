import React from 'react'

import { IconButton } from 'material-ui'
import { Face } from 'material-ui-icons'

export default function Event({ event, classes, onSetEvent }) {
  return (
    <React.Fragment>
      <span className={'event-title'}>{event.data.title}</span>
      <span className={'event-money'}>
        {!event.data.money ? (
          <IconButton
            variant="raised"
            color="primary"
            className={classes.smallIconButton}
            onClick={e => onSetEvent(e, event)}
          >
            <Face className={classes.smallIcon} />
          </IconButton>
        ) : (
            `${event.data.money} €`
          )}
      </span>
    </React.Fragment>
  )
}