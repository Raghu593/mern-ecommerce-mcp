import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Container,Row,Col} from 'react-bootstrap'
import Message from './Message'
import Loader from '../components/Loader'
import { useGetAllProductsQuery ,useDeleteProductMutation} from '../app/api'
import { useNavigate } from 'react-router-dom';


const ProductListScreen = () => {
//   const dispatch = useDispatch()

//   const userList = useSelector((state) => state.userList)
//   const { loading, error, users } = userList

//   const userLogin = useSelector((state) => state.userLogin)
//   const { userInfo } = userLogin

//   const userDelete = useSelector((state) => state.userDelete)
//   const { success: successDelete } = userDelete

//   useEffect(() => {
//     if (userInfo && userInfo.isAdmin) {
//       dispatch(listUsers())
//     } else {
//       history.push('/login')
//     }
//   }, [dispatch, history, successDelete, userInfo])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure to delete this product')) {
        console.log(id)
      deleteProduct(id)
    }
  }

  const navigate = useNavigate();

  // const editHandler=(id)=>{
  //                   console.log("userid",id)
  // }``

  const createProductHandler = () => {
    navigate('/admin/product/upload')
  }

  const {data,isLoading,isSuccess,refetch,error}=useGetAllProductsQuery();
// error & console.log("allproducts",error)
const [deleteProduct,deleteProductResponse]=useDeleteProductMutation();

deleteProductResponse.isSuccess && refetch()

return (
    <Container>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>     
       {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.message}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a>{user.price}</a>
                </td>
                <td>
                  {user.category}
                </td>
                <td>
                  {user.brand}
                </td>
                <td>
                  <LinkContainer to={`/admin/product/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default ProductListScreen