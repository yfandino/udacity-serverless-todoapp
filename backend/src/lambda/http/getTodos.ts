import 'source-map-support/register'

import { parseUserId } from '../../auth/utils'
import { getAllTodos } from '../../businessLogic/todos'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const jwt = event.headers.Authorization.split(' ').pop()
  
  const userId = parseUserId(jwt)
  const items = await getAllTodos(userId)

  return {
    statusCode: 200,
    headers: {
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Origin": "*"
    },
    body: JSON.stringify({ items })
  }
}
