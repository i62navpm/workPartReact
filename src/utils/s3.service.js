import AWS from 'aws-sdk'

export default class S3SDK {
  constructor() {
    AWS.config.apiVersions = { s3: '2006-03-01' }
    this.s3 = new AWS.S3()
  }
  listObjects() {
    return this.s3.listObjects({ Bucket: 'my-image-project' }).promise()
  }
}
