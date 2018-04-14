import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { translate } from 'react-i18next'
import {
  Typography,
  Modal,
  Button,
  MenuItem,
  Chip,
  Input
} from 'material-ui'
import { ArrowDropUp, ArrowDropDown, Clear, Cancel } from 'material-ui-icons'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

const ITEM_HEIGHT = 34

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: theme.spacing.unit * 30,
    maxWidth: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  },
  button: {
    marginTop: 5,
    float: 'right'
  },
  chip: {
    margin: theme.spacing.unit / 4,
    display: 'inline-flex'
  },
  select: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  '@global': {
    '.Select': {
      minHeight: ITEM_HEIGHT,
      height: 'auto'
    },
    '.Select .Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select .Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select .Select--multi .Select-input': {
      margin: 0,
    },
    '.Select .Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select .Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select .Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select .Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select .Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select .Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select .Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select .Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select .Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select .Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    '.Select .Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },

})

class Option extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    this.props.onSelect(this.props.option, event)
  }

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {children}
      </MenuItem>
    )
  }
}

class SelectWrapped extends React.Component {
  render() {
    const { classes, t, ...other } = this.props
    return (
      <Select.Creatable
        optionComponent={Option}
        noResultsText={<Typography>{t('No results found')}</Typography>}
        arrowRenderer={arrowProps => {
          return arrowProps.isOpen ? <ArrowDropUp /> : <ArrowDropDown />
        }}
        clearRenderer={() => <Clear />}
        valueComponent={valueProps => {
          const { value, children, onRemove } = valueProps

          const onDelete = event => {
            event.preventDefault()
            event.stopPropagation()
            onRemove(value)
          }

          if (onRemove) {
            return (
              <Chip
                tabIndex={-1}
                label={children}
                className={classes.chip}
                deleteIcon={<Cancel onTouchEnd={onDelete} />}
                onDelete={onDelete}
              />
            )
          }

          return <div className="Select-value">{children}</div>
        }}
        {...other}
      />
    )
  }
}

class ModalWork extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      works: null,
      suggestions: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleChange(value) {
    this.setState({ works: value })
  }

  handleClose() {
    this.props.handleModalClose(this.state.works)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.works && nextProps.works.length) {
      const placeWorks = nextProps.works.map(item => ({ label: item, value: item }))
      this.setState({ works: placeWorks, suggestions: [...this.state.suggestions, ...placeWorks] })
    } else {
      this.setState({ works: null })
    }
  }

  render() {
    const { t } = this.props
    return (
      <Modal open={this.props.openModal} onClose={this.handleClose}>
        <div className={this.props.classes.paper}>
          <Typography type="title" id="modal-title">
            {t('Insert a work')}
          </Typography>
          <Input
            fullWidth
            className={this.props.classes.select}
            inputComponent={translate('translations')(SelectWrapped)}
            value={this.state.works}
            onChange={this.handleChange}
            placeholder={t('Select or insert a work place')}
            name="react-select-chip"
            inputProps={{
              classes: this.props.classes,
              multi: true,
              backspaceRemoves: true,
              instanceId: 'react-select-chip',
              id: 'react-select-chip',
              options: this.state.suggestions,
            }}
          />
          <Button
            className={this.props.classes.button}
            raised
            color="primary"
            onClick={this.handleClose}
          >
            {t('Save')}
          </Button>
        </div>
      </Modal>
    )
  }
}

ModalWork.propTypes = {
  classes: PropTypes.object.isRequired,
  works: PropTypes.array,
  openModal: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
}

export default withStyles(styles)(translate('translations')(ModalWork))
