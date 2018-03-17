import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import { withStyles } from 'material-ui/styles'
import Card, { CardMedia } from 'material-ui/Card'
import { UploadField } from '@navjobs/upload'
import imageBusiness from '../assets/images/businessDefault.png'
import s3Sdk from '../utils/s3.service'

const styles = () => ({
  media: {
    height: 150,
  }
})

class UploadImage extends React.Component {
  constructor(props) {
    super(props)

    const { image, name, handleChange, classes } = props
    this.classes = classes

    this.state = {
      image: image || imageBusiness,
      name,
      handleChange,
      s3: new s3Sdk()
    }

    this.onUpload = this.onUpload.bind(this)
  }

  async onUpload(file) {
    const { handleChange, name, s3 } = this.state
    const [Body] = file
    if(!Body) return
    const prefix = DateTime.local().ts
    const folder = this.props.folder + '/'
    const Key = `${folder + prefix}__${Body.name}`

    const { Location } = await s3.uploadObject({ Key, Body, ACL: 'public-read' })
    
    this.setState({image: Location})

    handleChange({
      target: {
        name,
        value: Location
      }
    })
  }

  render() {
    const { image } = this.state
    return (
      <Card>
        <UploadField
          onFiles={this.onUpload}
          uploadProps={{ accept: '.png, .jpg, .jpeg' }}
        >
          <CardMedia
            className={this.classes.media}
            image={image}
            title="Business image"
          />
        </UploadField>
      </ Card>
    )
  }
}

UploadImage.propTypes = {
  classes: PropTypes.object.isRequired,
  image: PropTypes.string,
  handleChange: PropTypes.func.isRequired
}

export default withStyles(styles)(UploadImage)