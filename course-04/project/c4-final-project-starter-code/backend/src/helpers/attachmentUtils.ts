import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'


//const XAWS = AWSXRay.captureAWS(AWS)
//console.log(XAWS)

// TODO: Implement the fileStogare logic
// const groupsTable = process.env.GROUPS_TABLE
//const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = 300

//const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})




export function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: `${todoId}.png`,
      Expires: urlExpiration
    })
  }