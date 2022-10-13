import * as React from 'react'
import { Icon, Card, Button, Image } from 'semantic-ui-react'
import { Product } from '../types/ProductModel'
import { Link } from 'react-router-dom'
import { History } from 'history'
import { deleteTodo } from '../api/todos-api'
import Auth from '../auth/Auth'

interface GroupCardProps {
  group: Product,
  history: History,
  auth: Auth
}

interface GroupCardState {
}


export class Group extends React.PureComponent<GroupCardProps, GroupCardState> {

  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/editproduct/${productId}`)
  }
  
  onTodoDelete = async (productId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), productId)
      console.log("okok")
      window.location.reload();
    } catch {
      alert('Product deletion failed. Are you sure this item was created by you ?')
    }
  }

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            <Link to={`/product/${this.props.group.ProductID}`}>{this.props.group.Title}</Link>
          </Card.Header>
                {this.props.group.ImageUrl && (
                  <Image src={this.props.group.ImageUrl} bordered centered />
                )}
          <Card.Description>{this.props.group.Description}</Card.Description>
        </Card.Content>
              {this.props.group.UpdatePossible && (
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(this.props.group.ProductID)}
                >
                  <Icon name="pencil" />
                </Button>
              )}
              {this.props.group.UpdatePossible && (
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(this.props.group.ProductID)}
                >
                  <Icon name="delete" />
                </Button>
              )}
        </Card>
    )
  }
}
