import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { FormControl, InputLabel, Input, InputAdornment } from 'material-ui'
import { Search } from 'material-ui-icons'
import { translate } from 'react-i18next'
import { debounce } from 'lodash'

const styles = () => ({
  icon: {
    fill: '#9e9e9e'
  }
})

class SearchInput extends React.Component {
  constructor(props) {
    super(props)

    this.handleTextChange = this.handleTextChange.bind(this)
    this.sendTextChange = this.sendTextChange.bind(this)
  }

  componentDidMount() {
    this.sendTextChange = debounce(this.sendTextChange, 500)
  }

  handleTextChange(e) {
    this.sendTextChange(e.target.value)
  }

  sendTextChange(text) {
    this.props.filterFn(text)
  }

  render() {
    const { t } = this.props
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor="search-input">{t('Search')}</InputLabel>
        <Input
          id="search-input"
          onChange={this.handleTextChange}
          endAdornment={
            <InputAdornment position="end">
              <Search className={this.props.classes.icon} />
            </InputAdornment>
          }
        />
      </FormControl>
    )
  }
}

SearchInput.propTypes = {
  classes: PropTypes.object.isRequired,
  filterFn: PropTypes.func.isRequired
}

export default withStyles(styles)(translate('translations')(SearchInput))