import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../screens/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../app/api'
import { brandcolor } from '../components/brandcolor'

const RegisterScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  
  const dispatch = useDispatch()

//   const userRegister = useSelector((state) => state.userRegister)
//   const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'


//   const userInfo=JSON.parse(localStorage.getItem('userInfo'))
//   // console.log(userInfo.name)

//     if (userInfo) {
//         navigate('/')
//     }

  let res;

  const[registerUser,{isLoading,error,data,isSuccess}]=useRegisterUserMutation();

  if(isSuccess){
    localStorage.setItem('userInfo',JSON.stringify(data))
    navigate('/')

  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
        const formData={name,email,password}
        res = await registerUser(formData);
    }
  }

  return (
    <FormContainer>
      <h1 style={{color:brandcolor}}>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error.data.message}</Message>}
      {isLoading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
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
          Register
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{color:brandcolor}}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen