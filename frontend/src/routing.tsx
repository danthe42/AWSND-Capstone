import React from 'react'
import Auth from './auth/Auth'
import { Router, Route } from 'react-router-dom'
import Callback from './components/Callback'
import createHistory from 'history/createBrowserHistory'
import App from './App';
import { EditTodo } from './components/EditTodo';
import { EditTodo2 } from './components/EditTodo2'


const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <div>
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props)
            return <Callback />
          }}
        />
        <Route
          path="/product/:ProductID"
          exact
          render={props => {
            return <EditTodo {...props} auth={auth} />
          }}
        />

        <Route
          path="/editproduct/:ProductID"
          exact
          render={props => {
            return <EditTodo2 {...props} auth={auth} />
          }}
        />

        <Route
          render={props => {
            return <App auth={auth} {...props} />
          }}
        />
      </div>
    </Router>
  )
}
