import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteItem } from '../../helpers/todos'
import  { createLogger } from '../../utils/logger'
import { parseUserId } from '../../auth/utils'
const logger = createLogger('TodosAccess')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    if (!todoId) {
      logger.error('todoId needed to delete')
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'invalid request'
        })
      }
    }
    const userid = parseUserId(event.headers.authorizationtoken)
    await deleteItem(todoId)
    
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(userid),
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
