import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUploadUrl  } from '../../helpers/attachmentUtils'
import { getTodosById } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const item = await getTodosById(todoId)
    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'todo item not found with this id'
        })
      }
    }
    const url = getUploadUrl(todoId)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        uploadUrl: url
      })
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
