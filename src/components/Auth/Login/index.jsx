import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'
import {
  Button,
  Grid,
  Paper,
  TextField
} from 'material-ui'

const styles = (theme) => ({
  paper: {
    padding: 16,
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  rowButtons: {
    marginTop: 30
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
})

function Login(props) {
  const { classes } = props

  return (
    <div>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>

            <form className={classes.form} noValidate>
              <TextField
                id="username"
                label="Username"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="password"
                type="password"
                label="Password"
                margin="normal"
                fullWidth
                required
              />
              <Grid className={classes.rowButtons} container justify="space-between" alignItems="center">
                <Grid item>
                  <Button component={Link} to="register" color="primary">
                    Register
                  </Button>
                </Grid>
                <Grid item>
                  <Button component={Link} to="register" raised color="primary" disabled>
                    Submit
                    <span className={classes.rightIcon}>
                      <i class="material-icons">send</i>
                    </span>
                  </Button>
                </Grid>
              </Grid>
            </form>

          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Login)