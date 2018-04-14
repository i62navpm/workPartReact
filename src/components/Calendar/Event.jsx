import React from 'react'
import { IconButton } from 'material-ui'
import { translate } from 'react-i18next'
import { LocalShipping, Face } from 'material-ui-icons'

function Event({ event, classes, onSetEvent, onSetWork, modality, t }) {
  return (
    <React.Fragment>
      <span className={'event-title'}>{t(event.title)}</span>
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

export default (translate('translations')(Event))