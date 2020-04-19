import * as AWS from 'aws-sdk'

import { TodoItem } from '../models/TodoItem'

const TODOS_TABLE = process.env.TODOS_TABLE
const TODOS_ID_INDEX = process.env.TODOS_ID_INDEX

export async function getItems(userId: string): Promise<TodoItem[]> {
  console.log(`Getting all todos for user: ${userId}`)

  const DocumentClient = createDynamoDBClient()

  const result = await DocumentClient.query({
    TableName: TODOS_TABLE,
    IndexName: TODOS_ID_INDEX,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
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

export async function updateItem(todo: any): Promise<TodoItem> {
  const DocumentClient = createDynamoDBClient()
  
  const updatedTodo = await DocumentClient.update({
    TableName: TODOS_TABLE,
    Key: {
      "userId": todo.userId,
      "todoId": todo.todoId
    },
    UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",,
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":name" : todo.name,
      ":dueDate" : todo.dueDate,
      ":done" : todo.done,
    },
    ReturnValues: "ALL_NEW"
  }).promise()
  
  return updatedTodo.Attributes as TodoItem
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