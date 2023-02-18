import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodosById, updateItem } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('UpdateTODOLOG')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = { ...JSON.parse(event.body) }
    logger.info(updatedTodo)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const item = await getTodosById(todoId)
    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'No todo item found with Id'
        })
      }
    }
    const itemUpdated = updateItem(updatedTodo,todoId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        itemUpdated
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
