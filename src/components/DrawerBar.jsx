import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDrawer } from '../actions/drawer'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  ListItemText,
  IconButton
} from 'material-ui'
import { ChevronLeft, ChevronRight, People, Business } from 'material-ui-icons'

const styles = theme => ({
  drawerPaper: {
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  }
})

class DrawerBar extends React.Component {
  constructor (props) {
    super(props)
    this.goTo = this.goTo.bind(this)
  }

  goTo (destination) {
    this.props.history.push(destination)
    this.props.setDrawer(false)
  }

  render () {
    const { classes, theme } = this.props

    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(classes.drawerPaper)
        }}
        open={this.props.drawer.open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={() => this.props.setDrawer(false)}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <Divider />
        <List component="nav">
          <ListItem button onClick={() => this.goTo('/business')}>
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary="Business" />
          </ListItem>
          <ListItem button onClick={() => this.goTo('/workforce')}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Workforce" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth,
    drawer: state.drawer
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDrawer: open => dispatch(setDrawer({ open }))
  }
}

DrawerBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(DrawerBar)
)
