import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import { Avatar, Divider, Checkbox, Typography } from 'material-ui'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    textAlign: 'left'
  },
  title: {
    marginTop: 30
  }
})

class BusinessEmployeeList extends React.Component {
  constructor(props) {
    super(props)

    const { classes } = props
    this.classes = classes

    this.state = { workforce: [], activeWorkforce: [...props.activeWorkforce] || [] }
  }

  componentWillReceiveProps(nextProps) {
    const { data: { workforce } } = nextProps
    if (!workforce) return
    this.setState({ workforce: [...workforce] })
  }

  handleToggle({ id }) {
    const { activeWorkforce } = this.state
    const currentIndex = activeWorkforce.indexOf(id)
    const newChecked = [...activeWorkforce]

    if (currentIndex === -1) {
      newChecked.push(id)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    this.setState({ activeWorkforce: newChecked })

    this.props.handleChange({
      target: {
        name: this.props.name,
        value: newChecked
      }
    })
  }

  render() {
    const { loading } = this.props.data

    if (loading) return <div>Loading...</div>
    const { workforce } = this.state

    return (
      <div className={this.classes.root}>
        <Typography type="subheading" color="inherit" className={this.classes.title}>
          Employees
        </Typography>
        <List>
          {workforce.map(employee => (
            <React.Fragment key={employee.id}>
              <ListItem dense button className={this.classes.listItem}>
                <Avatar alt={employee.name} src={employee.image} />
                <ListItemText primary={employee.name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    onChange={() => this.handleToggle(employee)}
                    checked={this.state.activeWorkforce.indexOf(employee.id) !== -1}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider inset />
            </React.Fragment>
          ))}
        </List>
      </div>
    )
  }
}

BusinessEmployeeList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default graphql(gql`
  query listWorkforce {
    workforce {
      id,
      name,
      nif,
      image
    }
  }
  `)(
  withStyles(styles)(BusinessEmployeeList)
  )
