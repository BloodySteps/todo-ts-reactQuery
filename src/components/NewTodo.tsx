import React, {useEffect, useState} from 'react'
import {Row, Col, Button, Form, Input, message} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {useMutation, useQueryClient} from 'react-query'
import {TodosState} from '../ts/index'
import {IProps} from './TodosList'
import { newTodo, updateTodo } from '../api'

interface todoProps {
  record: IProps
  dispatchState: React.Dispatch<React.SetStateAction<IProps>>
}

const NewTodo: React.FC<todoProps> = ({record, dispatchState}) => {
  const [form] = Form.useForm()
  const [text, setText] = useState<string>('')
  const queryClient = useQueryClient()

  const {mutateAsync} = useMutation(newTodo)
  const {mutateAsync: mutateAsyncTodo} = useMutation(updateTodo)

  const submitHandler = async () => {
    if (record.isEditing) {
      await mutateAsyncTodo(record.currentTodo)
      queryClient.invalidateQueries('todos')
     
      dispatchState(old => ({
        ...old,
        isEditing: false,
        currentTodo: {} as TodosState,
      }))
      form.setFieldsValue({
        title: '',
      })
      message.success('Successfully Updated  Existing Task.')
    } else {
      await mutateAsync({
        id: Math.floor(Math.random() * 8989999),
        title: text,
        completed: false,
      })
      form.setFieldsValue({
        title: '',
      })
      queryClient.invalidateQueries('todos')
      message.success('Successfully Added  New Task.')
    }
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (record.isEditing) {
      dispatchState(old => ({
        ...old,
        currentTodo: {
          ...old.currentTodo,
          title: e.target.value,
        },
      }))
    } else {
      setText(e.target.value)
    }
  }

  useEffect(() => {
    if (record.isEditing) {
      form.setFieldsValue({
        title: record.currentTodo.title,
      })
    } else {
      form.setFieldsValue({
        title: text,
      })
    }
  }, [text, record.isEditing, record.currentTodo.title, form])

  return (
    <div className="container">
      <Form form={form} size="large" onFinish={submitHandler}>
        <Row gutter={16}>
          <Col span={22}>
            <Form.Item name="title">
              <Input
                placeholder="Type Something..."
                required
                onChange={onChangeHandler}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <PlusOutlined />
                {record.isEditing ? 'Update' : 'New'}
                Task
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default NewTodo
