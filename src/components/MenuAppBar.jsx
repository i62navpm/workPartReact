import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { AppBar, Toolbar, Typography, IconButton, LinearProgress, Hidden } from 'material-ui'
import { AccountCircle } from 'material-ui-icons'
import Menu, { MenuItem } from 'material-ui/Menu'
import { setDrawer } from '../actions/drawer'
import { logoutUser } from '../actions/auth'
const debug = require('debug')
const error = debug('menuAppBar:error')

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

class MenuAppBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      auth: !!this.props.user.email,
      anchorEl: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.logout = this.logout.bind(this)
  }

  handleChange(event, checked) {
    this.setState({ auth: checked })
  }

  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorEl: null })
  }

  async logout() {
    try {
      this.handleClose()
      await this.props.onLogoutClick()
      this.props.history.push('/auth/login')
    } catch (err) {
      this.handleClose()
      error(err)
    }
  }

  render() {
    const { classes } = this.props
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Link to={'/business'} className={classes.link}>
              <Typography type="title" color="inherit" className={classes.flex}>
                Work Part App
              </Typography>
            </Link>
            <Hidden xsDown>
              <Typography type="body1" color="inherit" align="right" className={classes.flex}>
                {this.props.user.email}
              </Typography>
            </Hidden>
            {auth && (
              <div id="menu-appbar">
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {this.props.loader.loading && <LinearProgress color="accent" />}
      </div>
    )
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    user: state.auth,
    loader: state.loader
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogoutClick: () => dispatch(logoutUser()),
    setDrawer: (open) => dispatch(setDrawer({ open }))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MenuAppBar))


