import * as React from 'react'
import { Card } from 'semantic-ui-react'
import { Product } from '../types/ProductModel'
import { Link } from 'react-router-dom'

interface GroupCardProps {
  group: Product
}

interface GroupCardState {
}

export class Group extends React.PureComponent<GroupCardProps, GroupCardState> {

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            <Link to={`/product/${this.props.group.ProductID}`}>{this.props.group.Title}</Link>
          </Card.Header>
          <Card.Description>{this.props.group.Description}</Card.Description>
        </Card.Content>
      </Card>
    )
  }
}
