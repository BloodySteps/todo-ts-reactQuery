import React, {useState} from 'react'
import {Layout, Typography} from 'antd'
import TodosList, {IProps} from './components/TodosList'
import NewTodo from './components/NewTodo'
import {TodosState} from './ts/index'

const {Header, Content} = Layout

const App: React.FC = () => {
  const [state, setState] = useState<IProps>({
    isEditing: false,
    currentTodo: {} as TodosState,
  })
  return (
    <>
      <Layout className="layout">
        <Header className="text-center">
          <Typography.Text className="white-clr">
            To add a todo, just fill the form below and click in add todo
          </Typography.Text>
        </Header>
        <Content>
          <NewTodo record={state} dispatchState={setState} />
        </Content>
      </Layout>
      <TodosList dispatchState={setState} isEditing={state} />
    </>
  )
}

export default App
