import { TodosAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'


// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function getAllTodos(): Promise<TodoItem[]> {
  return todosAccess.getAllTodos()
}

export async function getTodosById(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodosById(userId)
  }

export async function createTodoItem(
    createTodoRequest: CreateTodoRequest,
    userId: string
  ): Promise<TodoItem> {
    
    const todoId = uuid.v4()
 
  
    return await todosAccess.createTodoItem({
      userId: userId,
      todoId: todoId,
      createdAt: new Date().toISOString(),
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: `http://${bucketName}.s3.amazonaws.com/${todoId}.png`
    }) 
}
export async function updateItem(updatedItem: UpdateTodoRequest , id: string) {
    return todosAccess.updateTodoItem(updatedItem,id)
}

export async function deleteItem(id :string) {
    return todosAccess.deleteTodoItem(id)
}

export async function getTooItem(todoId :string , userId: string) : Promise<TodoItem>  {
    return todosAccess.getTodoItem(todoId, userId)
}
