import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'


//const XAWS = AWSXRay.captureAWS(AWS)
//console.log(XAWS)

// TODO: Implement the fileStogare logic
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration =  process.env.SIGNED_URL_EXPIRATION

//const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})


export function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: `${todoId}.png`,
      Expires: Number(urlExpiration)
    })
  }