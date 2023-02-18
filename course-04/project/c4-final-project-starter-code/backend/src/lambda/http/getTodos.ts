import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils';
import {getTodosById } from '../../helpers/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    console.log('Processing event: ', event)
    const todos = await getTodosById(getUserId(event))
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'*',
        'Access-Control-Allow-Headers':'*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        items: todos
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
