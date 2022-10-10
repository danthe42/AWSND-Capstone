import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getProduct, getReviews, createReview } from '../api/todos-api'
import { Product, Review } from '../types/ProductModel';
import { Grid, Menu, Segment, Icon, Divider, Input } from 'semantic-ui-react'
import { Todos } from './Todos';

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

enum DownloadState {
  NoDownload,
  Fetching,
  Ready,
}

interface EditTodoProps {
  match: {
    params: {
      ProductID: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  file: any
  uploadState: UploadState
  productDownloadState: DownloadState
  reviewsDownloadState: DownloadState
  product?: Product
  reviews: Review[]
  newReviewComment : string
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    productDownloadState: DownloadState.NoDownload,
    reviewsDownloadState: DownloadState.NoDownload,
    product: undefined,
    reviews: [],
    newReviewComment: ""
  }

  onReviewCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newTodo = await createReview(this.props.auth.getIdToken(), this.props.match.params.ProductID, {
        Text: this.state.newReviewComment
      })
      this.setState({
        reviews: [...this.state.reviews, newTodo],
        newReviewComment: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewComment: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
/*    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }*/
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const todos = getProduct(this.props.auth.getIdToken(), this.props.match.params.ProductID)
      this.setState({
        productDownloadState: DownloadState.Fetching
      })
      todos.then( (prod : Product) => { 
        this.setState({
          productDownloadState: DownloadState.Ready,
          product: prod
        })  
      })
      const todos2 = getReviews(this.props.auth.getIdToken(), this.props.match.params.ProductID)
      this.setState({
        reviewsDownloadState: DownloadState.Fetching
      })
      todos2.then( (reviews : Review[]) => { 
        this.setState({
          reviewsDownloadState: DownloadState.Ready,
          reviews: reviews
        })  
      })
      
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  renderReviewsList() {
    if (this.state.reviews.length==0)
    {
      return ( <h2>The product has no reviews yet.</h2> )
    }
    else
    {
      return (
        <Grid padded>
          <b><h2>Reviews:</h2></b>
          {this.state.reviews?.map((review, pos) => {
            return (
              <Grid.Row key={review.ReviewID}>
                <Grid.Column width={2} horizontalAlign="left">
                  <i>{review.UserID}:</i>
                </Grid.Column>
                <Grid.Column width={10} verticalAlign="middle">
                  {review.Text}
                </Grid.Column>
                <Grid.Column width={3} floated="right">
                  {review.CreatedAt}
                </Grid.Column>
                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
              </Grid.Row>
            )
          })}

        </Grid>
      )
    }
  }

  renderCreateReviewInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New review comment',
              onClick: this.onReviewCreate
            }}
            fluid
            actionPosition="left"
            placeholder="My comment comes here..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  render() {
    if (this.state.productDownloadState != DownloadState.Ready && this.state.reviewsDownloadState != DownloadState.Ready)
    {
      return ( 
        <div>
          <h1>Getting data for the product</h1>
        </div>
      )
    }
    else if (this.state.product == undefined || this.state.reviews == undefined)
    {
      return ( 
        <div>
          <h1>Internal error</h1>
        </div>
      )
    } else 
    {
      return (
        <div>

        <h1>Product {this.state.product.Title}</h1>
        <br/>
        <br/>
        <h3>Description: {this.state.product.Description}</h3>
        <p>Created At: {this.state.product.CreatedAt}</p>
        <p>Created by user: {this.state.product.UserID}</p>

        {this.renderReviewsList()}
        {this.renderCreateReviewInput()}

        </div>
      )
    }
/*        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
    */
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
