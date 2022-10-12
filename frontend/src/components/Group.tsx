import * as React from 'react'
import { Icon, Card, Button, Image } from 'semantic-ui-react'
import { Product } from '../types/ProductModel'
import { Link } from 'react-router-dom'
import { History } from 'history'

interface GroupCardProps {
  group: Product,
  history: History
}

interface GroupCardState {
}


export class Group extends React.PureComponent<GroupCardProps, GroupCardState> {

  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/editproduct/${productId}`)
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
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(this.props.group.ProductID)}
                >
                  <Icon name="pencil" />
                </Button>
      </Card>
    )
  }
}
