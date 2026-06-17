import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from './Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useGetUserByIdQuery,useUpdateUserByIdMutation } from '../app/api'
import { useNavigate ,useParams} from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query'


const UserEditScreen = () => {

  const params=useParams();
  let id=params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [skip, setskip] = useState(true)

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData={name,email,id,isAdmin}
    // console.log(formData)
    await updateUser(formData);
    }


  const {data,isLoading,isFetching,error,isError,isSuccess,refetch}=useGetUserByIdQuery(id,{
    skip,
  });
  const [updateUser,updateUserResponse]=useUpdateUserByIdMutation();

//  console.log(updateUserResponse.isSuccess)

  useEffect(() => {
    setskip(false)
    if(isSuccess){
      setName(data.name)
      setEmail(data.email)
      setIsAdmin(data.isAdmin)
    }
    // if(updateUserResponse.isSuccess){
    //   // setskip(true)
    //   // refetch()      
    //   navigate('/admin/userlist')
    // }
  }, [isSuccess])


  // const {data,isLoading,error}=useGetProfileQuery();
    //  const [getUser,getUserResponse]=useGetUserByIdQuery();
  //  console.log(getUser)

// if(isSuccess){
//       console.log("data",data)
//  }
   
    let userInfo;
  



  return (
    <>
     {/* {error && <Message variant='danger'>{error}</Message>} */}
      {/* <Message>Hello</Message> */}
      {/* {isLoading && <Loader />} */}
      {/* {isSuccess &&  */}
      <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {/* {isLoading && <Loader />} */}
        {/* {error && <Message variant='danger'>{error}</Message>} */}
        {/* {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data}</Message>
        ) : ( */}
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

            <Form.Group controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary' onClick={submitHandler}>
              Update
            </Button>
          </Form>
        {/* )} */}
      </FormContainer>
      </>
{/* } */}
    </>
  )
}

export default UserEditScreen