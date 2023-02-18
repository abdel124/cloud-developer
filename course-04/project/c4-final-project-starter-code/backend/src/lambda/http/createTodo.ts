import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodoItem } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import { parseUserId } from '../../auth/utils'

const logger = createLogger('TodosAccess')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const userid = parseUserId(event.headers.authorizationtoken)
    logger.info(userid)
    const newItem = await createTodoItem(newTodo,userid)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
