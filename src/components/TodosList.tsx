import {Button, Table, Popconfirm, message} from 'antd'
import React from 'react'
import {uuid} from '../utils/uuid'
import {useQuery, useMutation, useQueryClient} from 'react-query'
import {
  DeleteOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import {ColumnProps} from 'antd/lib/table'
import {TodosState} from '../ts'
import { fetchTodos, removeTodo } from '../api'

export type IProps = {
  isEditing: boolean
  currentTodo: TodosState
}

interface TodoProps {
  isEditing: IProps
  dispatchState: React.Dispatch<React.SetStateAction<IProps>>
}

const TodosList: React.FC<TodoProps> = ({dispatchState, isEditing}) => {
  const queryClient = useQueryClient()
  const {isEditing: edit, currentTodo} = isEditing

  const {isLoading, data} = useQuery('todos', fetchTodos)

  const {mutateAsync} = useMutation(removeTodo)

  const confirm = async (id: number) => {
    await mutateAsync(id)
    queryClient.invalidateQueries('todos')
    message.success('Successfully Deleted Task.')
  }

  const columns: ColumnProps<TodosState>[] = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: uuid(),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: uuid(),
      render: (_, record) => {
        return (
          <div className="flex">
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => confirm(record.id)}
            >
              <Button type="text">
                <DeleteOutlined />
                Delete
              </Button>
            </Popconfirm>
            {edit ? (
              <Button
                disabled={record.id !== currentTodo.id}
                type="text"
                onClick={() =>
                  dispatchState(old => ({
                    ...old,
                    isEditing: false,
                    currentTodo: {} as TodosState,
                  }))
                }
              >
                <CloseCircleOutlined />
                cancel
              </Button>
            ) : (
              <Button
                type="text"
                onClick={() =>
                  dispatchState(old => ({
                    ...old,
                    isEditing: true,
                    currentTodo: record,
                  }))
                }
              >
                <EditOutlined />
                Edit
              </Button>
            )}
          </div>
        )
      },
    },
  ]
  return (
    <div className="container">
      <h1>Todos</h1>
      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={data}
        loading={isLoading}
      />
    </div>
  )
}

export default TodosList
