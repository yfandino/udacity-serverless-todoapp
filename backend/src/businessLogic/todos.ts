import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import { getItems, putItem, updateItem, addAttachment, deleteItem } from '../dataLayer/todosDataLayer'
import { getUploadPresignedURL } from '../dataLayer/todosS3Layer'

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return getItems(userId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {

  const itemId = uuid.v4()

  return await putItem({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem> {
  return await updateItem({
    todoId,
    userId,
    ...updateTodoRequest
  })
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  return await deleteItem(todoId, userId)
}

export async function getPresignedURL(userId: string, todoId: string): Promise<string> {
  const attachmentUrl = await getUploadPresignedURL(userId, todoId)
  await addAttachment(userId, todoId) 
  return attachmentUrl;
}