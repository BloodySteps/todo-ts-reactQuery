import {TodosState} from '../ts'
import {uuid} from '../utils/uuid'

export const fetchTodos = async () => {
  const response = await fetch('http://localhost:3000/todos')
  return response.json()
}

export const removeTodo = async (id: number) => {
  const res = await fetch(`http://localhost:3000/todos/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('something went wrong..')
  }
}

export const newTodo = async (todo: TodosState) => {
  const rawResponse = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    body: JSON.stringify({
      id: uuid(),
      title: todo.title,
      completed: false,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  return await rawResponse.json()
}

export const updateTodo = async (todo: TodosState) => {
  const response = await fetch(`http://localhost:3000/todos/${todo.id}`, {
    method: 'PATCH',
    body: JSON.stringify({...todo}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

  return await response.json()
}
