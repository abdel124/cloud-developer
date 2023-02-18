import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger';

import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')

const logger = createLogger('hollo')

export class TodosAccess {

    constructor(
      XAWS = AWSXRay.captureAWS(AWS),
      private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly indexUserID = process.env.INDEX_USER_ID) {
    }

    async getAllTodos(): Promise<TodoItem[]> {
        console.log('Getting all TodoItems')
    
        const result = await this.docClient.query({
          TableName: this.todosTable
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
      }

    async getTodosById(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.indexUserID,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }

    async createTodoItem(todItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
          TableName: this.todosTable,
          Item: todItem
        }).promise()
    
        return todItem
      }

    async updateTodoItem(partialTodo: UpdateTodoRequest , todoid: string): Promise<TodoItem> {
          logger.info(todoid)
          logger.info(partialTodo)
          const updated = await this.docClient.update({
            TableName: this.todosTable,
            Key: { 'todoId': todoid },
            UpdateExpression: 'set #name = :name, dueDate = :d, done = :done',
            ExpressionAttributeNames: {
              '#name': 'name'
            },
            ExpressionAttributeValues: {
              ':name': partialTodo.name,
              ':d': partialTodo.dueDate,
              ':done': partialTodo.done
            },
            
            //ReturnValues: 'ALL_NEW'
          }).promise()
          
          return updated.Attributes as TodoItem
        }

    async deleteTodoItem(todoId: string) {
            await this.docClient.delete({
              TableName: this.todosTable,
              Key : {
                todoId : todoId,
              }
            }).promise()
         
          }

    async getTodoItem(todoId: string, userId): Promise<TodoItem> {      
          var params = {
              Key: {
               todoId: todoId, 
               userId: userId
              }, 
              TableName: this.todosTable
          };
            const result = await this.docClient.get(params).promise()
            console.log("h2")
            console.log(JSON.stringify(result))
            return result.Item as TodoItem

      }
    }
    
    



// TODO: Implement the dataLayer logic