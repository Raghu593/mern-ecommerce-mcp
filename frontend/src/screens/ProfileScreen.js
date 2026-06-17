import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col,Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../screens/Message'
import Loader from '../screens/Loader'
import { useGetProfileQuery,useGetMyOrdersQuery } from '../app/api'
import { useUpdateProfileMutation } from '../app/api'
import { useNavigate } from 'react-router-dom';
import { brandcolor } from '../components/brandcolor'

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
 
  const {refetch} = useGetMyOrdersQuery();
  let updateResponse;

  const navigate = useNavigate();
  let userInfo;
  useEffect(() => {
  if (localStorage.getItem('userInfo') === null) {
        navigate('/login')
  }
  else{
    userInfo=JSON.parse(localStorage.getItem('userInfo'))
    setName(userInfo.name)
    setEmail(userInfo.email)
    refetch();
  }

},[userInfo])


// const {refetch} = useGetMyOrdersQuery();
//   const orderListMy = useSelector((state) => state.orderListMy)
  const {data,isLoading,error,isSuccess,isError}=useGetProfileQuery();
  isSuccess && console.log(data)
  isError && console.log("error")
  const myordersresponse=useGetMyOrdersQuery();
  console.log(myordersresponse.data)
  const[updateUser,updateUserResponse]=useUpdateProfileMutation();

  updateUserResponse.isError && console.log(updateUserResponse.error)

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
  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      const formData={name,email,password}
      updateResponse=await updateUser(formData);
      console.log("update",updateUserResponse.data)
    }
  }

  if(updateUserResponse.isSuccess){
    localStorage.setItem('userInfo',JSON.stringify(updateUserResponse.data))
    navigate(0)
    }


  // let changeEmail=(e)=>{
    // console.log("mail",email)
  // }

  return (
    <Container>
    <Row>
      <Col md={3}>
        <h2 style={{color:brandcolor}}>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {/* {} */}
        {updateUserResponse.isSuccess && <Message variant='success'>Profile Updated</Message>}
      {/* <Message>Hello</Message> */}
      {/* {updateUserResponse.isLoading && <Loader />} */}
      {isLoading || updateUserResponse.isLoading ? <Loader/> : ""}
      {error || updateUserResponse.error ? <Message variant='danger'>{error.data.message}</Message> : ""}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                // ref={name}
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // onChange={changeEmail()}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' style={{color:brandcolor}}>
              Update
            </Button>
          </Form>
      </Col>
      <Col md={9}>
        <h2 style={{color:brandcolor}}>My Orders</h2>
         {myordersresponse.isLoading ? (
          <Loader />
        ) : myordersresponse.error ? (
          <Message variant='danger'>{myordersresponse.error.data.message}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {console.log(myordersresponse.data)}
              {myordersresponse.data.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
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
                    <LinkContainer to={`/order/${order._id}`} style={{color:brandcolor}}>
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

export default ProfileScreen