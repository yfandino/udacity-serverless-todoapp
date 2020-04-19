import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('todo-s3-layer')

const ATTACHMENTS_BUCKET = process.env.ATTACHMENTS_BUCKET

const S3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function getUploadPresignedURL(userId: string, todoId: string): Promise<string> {
  logger.info(`Generating new Upload URL for user: ${userId}`)
  logger.info(`Key: ${userId}/${todoId}`)

  const uploadURL = S3.getSignedUrl('putObject', {
    Bucket: ATTACHMENTS_BUCKET,
    Key: `${userId}/${todoId}`,
    Expires: 300
  })
  
  return uploadURL
}