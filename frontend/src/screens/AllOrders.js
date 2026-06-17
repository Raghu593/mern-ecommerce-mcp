import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col,Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../screens/Message'
import Loader from '../screens/Loader'
import { useGetAllOrdersQuery } from '../app/api'
import { useNavigate } from 'react-router-dom';

const AllOrders = ({ location, history }) => {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [message, setMessage] = useState(null)
 
//   const {refetch} = useGetMyOrdersQuery();
//   let updateResponse;

//   const navigate = useNavigate();
//   let userInfo;
//   useEffect(() => {
//   if (localStorage.getItem('userInfo') === null) {
//         navigate('/login')
//   }
//   else{
//     userInfo=JSON.parse(localStorage.getItem('userInfo'))
//     setName(userInfo.name)
//     setEmail(userInfo.email)
//     refetch();
//   }

// },[userInfo])


// const {refetch} = useGetMyOrdersQuery();
//   const orderListMy = useSelector((state) => state.orderListMy)
//   const {data,isLoading,error,isSuccess,isError}=useGetProfileQuery();
//   isSuccess && console.log(data)
//   isError && console.log("error")
//   const myordersresponse=useGetMyOrdersQuery();
//   console.log(myordersresponse.data)
//   const[updateUser,updateUserResponse]=useUpdateProfileMutation();

//   updateUserResponse.isError && console.log(updateUserResponse.error)

// isSuccess && console.log("success",data)

//   useEffect(() => {
//     if (!userInfo) {
//       history.push('/login')
//     } else {
//       if (!user || !user.name || success) {
//         dispatch({ type: USER_UPDATE_PROFILE_RESET })
//         dispatch(getUserDetails('profile'))
//         dispatch(listMyOrders())
//       } else {
//         setName(user.name)
//         setEmail(user.email)
//       }
//     }
//   }, [dispatch, history, userInfo, user, success])
//   const submitHandler = async (e) => {
//     e.preventDefault()
//     if (password !== confirmPassword) {
//       setMessage('Passwords do not match')
//     } else {
//       const formData={name,email,password}
//       updateResponse=await updateUser(formData);
//       console.log("update",updateUserResponse.data)
//     }
//   }

//   if(updateUserResponse.isSuccess){
//     localStorage.setItem('userInfo',JSON.stringify(updateUserResponse.data))
//     navigate(0)
//     }


  // let changeEmail=(e)=>{
    // console.log("mail",email)
  // }


    const {data,isLoading,error,isSuccess,isError}=useGetAllOrdersQuery();

  return (
    <Container>
    <Row>
      <Col md={12}>
        <h2>My Orders</h2>
         {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {console.log(data)}
              {data.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
    </Container>
  )
}

export default AllOrders