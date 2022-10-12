import * as React from 'react'
import { Form, Button, ButtonProps, Grid } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getProduct, updateProduct } from '../api/todos-api'
import { Product } from '../types/ProductModel';
import { UpdateProductRequest } from '../types/CreateTodoRequest';

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
  product?: Product
  attrchanged: boolean,
  updatedTitle?: string,
  updatedDescription?: string
}

export class EditTodo2 extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    productDownloadState: DownloadState.NoDownload,
    product: undefined,
    attrchanged: false,
    updatedTitle: undefined,
    updatedDescription: undefined
  }

  handleAttrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      attrchanged: true,
      updatedTitle: event.target.value
    });  
  }

  handleAttrChangeTA = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    
    this.setState({
      attrchanged: true,
      updatedDescription: event.target.value
    });  
  }
    
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  updateAttr = async () => {
    if (this.state.updatedTitle && this.state.updatedDescription && this.state.product)
    {
      try {

        await updateProduct( this.props.auth.getIdToken(), this.state.product.ProductID, { Title: this.state.updatedTitle, Description: this.state.updatedDescription })
        let p: Product = this.state.product
        p.Title = this.state.updatedTitle
        p.Description = this.state.updatedDescription
        this.setState({
          product: p,
          attrchanged: false
        })  
        alert('Product was updated successfully!')

      } catch {
        console.log("Megvan!")
        alert('Update product attr. failed. Network error, or permission denied (is this your product?)')
      }
    } 
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.ProductID)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

    alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
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
          product: prod,
          attrchanged: false,
          updatedTitle: prod.Title,
          updatedDescription: prod.Description
        })  
      })     
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    if (this.state.productDownloadState != DownloadState.Ready)
    {
      return ( 
        <div>
          <h1>Getting data for the product</h1>
        </div>
      )
    }
    else if (this.state.product == undefined)
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

          <h1>Edit product</h1>

          <Form>
          <Form.Field>
          <label>
          Title:
          <input type="text" value={this.state.updatedTitle} name="Title" onChange={this.handleAttrChange}/>
          <br/>
          </label>
          </Form.Field>
          <Form.Field>
          <label>
          Description:
          <textarea value={this.state.updatedDescription} name="Description" rows={10} cols={80} onChange={this.handleAttrChangeTA}/>
          </label>
          <br/>
          {this.renderAttrButton()}

          </Form.Field>
          </Form>

          <br/>
          <br/>

          <h2>Product photo</h2>

          <Form onSubmit={this.handleSubmit}>
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
    }
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

  renderAttrButton() { 
    return (
      <div>
        <Button
          disabled={!this.state.attrchanged}
          type="submit"
          onClick={() => this.updateAttr()}
        >
          Update
        </Button>
      </div>
    )
  }

}
