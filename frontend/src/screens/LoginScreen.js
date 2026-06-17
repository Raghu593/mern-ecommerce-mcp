import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../screens/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useLoginUserMutation } from '../app/api'
import { useNavigate,useSearchParams} from 'react-router-dom';
import { brandcolor } from '../components/brandcolor'

  const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  // const userLogin = useSelector((state) => state.userLogin)
  // const {data,isLoading,isFetching,error,isError,isSuccess}=useLoginUserMutation(email,password);
  const[loginUser,{isLoading,error,data,isSuccess}]=useLoginUserMutation();
  // const redirect = location.search ? location.search.split('=')[1] : '/'
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  isSuccess && localStorage.setItem('userInfo',JSON.stringify(data))


  useEffect(() => {
    if (localStorage.getItem('userInfo') !== null) {
      navigate(`/${redirect}`)
    }
  }, [redirect])

  // [history, userInfo, redirect]
  if(isSuccess && redirect){
    navigate(`/${redirect}`)
  }
  else if(isSuccess){
    navigate('/')
  }

  // const {refetch} = useGetMyOrdersQuery(skipToken);
  // isSuccess && refetch()

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData={email,password}
    await loginUser(formData);
  }

  return (
    <FormContainer>
      <h1 style={{color:brandcolor}}>Sign In</h1>
      {error && <Message variant='danger'>{error.data.message}</Message>}
      {/* <Message>Hello</Message> */}
      {isLoading && <Loader />}
      {/* {res} */}
      <Form onSubmit={submitHandler}>
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
        <Button type='submit' variant='primary' style={{color:brandcolor}}>
          Sign In
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{color:brandcolor}}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen