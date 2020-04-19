import * as AWS from 'aws-sdk'

const ATTACHMENTS_BUCKET = process.env.ATTACHMENTS_BUCKET

const S3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function getUploadPresignedURL(userId: string, todoId: string): Promise<string> {
  console.log(`Generating new Upload URL for user: ${userId}`)
  console.log(`Key: ${userId}/${todoId}`)

  const uploadURL = S3.getSignedUrl('putObject', {
    Bucket: ATTACHMENTS_BUCKET,
    Key: `${userId}/${todoId}`,
    Expires: 300
  })
  
  return uploadURL
}