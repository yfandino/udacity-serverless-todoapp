import * as AWS from 'aws-sdk'

import { TodoItem } from '../models/TodoItem'

const TODOS_TABLE = process.env.TODOS_TABLE
const TODOS_ID_INDEX = process.env.TODOS_ID_INDEX

export async function getItems(userId: string): Promise<TodoItem[]> {
  console.log(`Getting all todos for user: ${userId}`)
  console.log(TODOS_TABLE)
  console.log(TODOS_ID_INDEX)

  const DocumentClient = createDynamoDBClient()

  const result = await DocumentClient.query({
    TableName: TODOS_TABLE,
    IndexName: TODOS_ID_INDEX,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  
  return result.Items as TodoItem[]
}

export async function putItem(todo: TodoItem): Promise<TodoItem> {
  const DocumentClient = createDynamoDBClient()

  await DocumentClient.put({
    TableName: TODOS_TABLE,
    Item: todo
  }).promise()

  return todo
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}