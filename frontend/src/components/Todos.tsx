import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import { Group } from './Group'
import * as React from 'react'
import {
  Card,
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createProduct, deleteTodo, getProducts, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Product } from '../types/ProductModel'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Product[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newTodo = await createProduct(this.props.auth.getIdToken(), {
        Title: this.state.newTodoName
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('Product creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
 /*   try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }*/
  }

  onTodoCheck = async (pos: number) => {
  /*  try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }*/
  }

  async componentDidMount() {
    try {
      const todos = await getProducts(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">New Product</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add a new product',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Name of the new item"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Products
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <div>
      <h1>Products</h1>

      <Card.Group>
          {this.state.todos.map(group => {
            return <Group key={group.ProductID} group={group} history={this.props.history} />
          })}
      </Card.Group>

      </div>

    )
  }

}
