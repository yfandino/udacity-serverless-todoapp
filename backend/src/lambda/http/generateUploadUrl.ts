import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { parseUserId } from '../../auth/utils'
import { getPresignedURL } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const jwt = event.headers.Authorization.split(' ').pop()
  const userId = parseUserId(jwt)

  const uploadUrl = await getPresignedURL(userId, todoId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Request-Method': "POST"
    },
    body: JSON.stringify({ uploadUrl })
  }
}
