import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container,Navbar,Nav,NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { resetCart } from '../app/features/slices/cartslice';
import logo from '../assets/naturely.png'
import { brandcolor } from './brandcolor';

const Header = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  let userInfo;
  if(localStorage.getItem('userInfo') !== null || localStorage.getItem('userInfo') !== undefined){
    userInfo=JSON.parse(localStorage.getItem('userInfo'))
    // console.log(userInfo.isAdmin)
  }


  // const myordersrefetch=async()=>{
  //       await getMyOrders()
  // }

  // const resetApiState = () => ({
  //   type: string,
  //   payload: undefined,
  // })
    // const {refetch} = useGetMyOrdersQuery(skipToken);

  const logoutHandler=()=>{
    dispatch(resetCart())
    // dispatch(useGetMyOrdersQuery.util.invalidateTags());
    // dispatch(useGetMyOrdersQuery.util.invalidateTags(['Refetchorders']))
    // refetch()
    localStorage.removeItem('userInfo')
    // getMyOrders()
    // dispatch(api.util.resetApiState())
    navigate('/')
  }
  return (
    <header>
        <div style={{backgroundColor:'#000',display:'flex',justifyContent:'center'}}>
          <p style={{color:'#fff',marginTop:15, color:brandcolor,fontSize:13}}>Free shipping above Rs.999/-</p>
        </div>
      <Navbar bg="white" variant='light' expand="lg" collapseOnSelect style={{backgroundColor:'#fcfaf8'}}>
      <Container>
        <LinkContainer to='/'>
        <Navbar.Brand>
              <img src={logo} width='150' height={100} className='d-inline-block align-top' />
        </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          <LinkContainer to='/cart'>
                <Nav.Link style={{ marginRight:25}}>
                  {/* <i className='fas fa-shopping-cart fa-1x' style={{color:brandcolor,marginRight:5}}></i> */}
                  <span style={{color:'#000',fontSize:15}} className='font-link'>Home</span>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/cart'>
                <Nav.Link style={{ marginRight:25}}>
                  {/* <i className='fas fa-shopping-cart fa-1x' style={{color:brandcolor,marginRight:5}}></i> */}
                  <span style={{color:'#000',fontSize:15}} className='font-link'>About us</span>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/cart'>
                <Nav.Link style={{ marginRight:25}}>
                  {/* <i className='fas fa-shopping-cart fa-1x' style={{color:brandcolor,marginRight:5}}></i> */}
                  <span style={{color:'#000',fontSize:15}} className='font-link'>Cart</span>
                </Nav.Link>
              </LinkContainer>
            {userInfo !== null ? (
                <NavDropdown title={<span style={{color:'#000',fontSize:15}}  className='font-link'>{userInfo.name}</span>} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item style={{color:'#000',fontSize:15}} className='font-link'>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                  <span style={{color:'#000',fontSize:15}} className='font-link'>
                    Logout
                  </span>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    {/* <i className='fas fa-user fa-1x' style={{color:brandcolor,marginRight:5}}></i> */}
                    <span style={{color:'#000',fontSize:15}} className='font-link'>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title={<span style={{color:'#000',fontSize:15}}  className='font-link'>Adminn</span>} id='adminmenu'>
                <LinkContainer to='/admin/userlist'>
                  <NavDropdown.Item title={<span style={{color:'#000',fontSize:15}}  className='font-link'>Admin</span>} >Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/productlist'>
                  <NavDropdown.Item title={<span style={{color:'#000',fontSize:15}}  className='font-link'>Admin</span>} >Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/orderlist'>
                  <NavDropdown.Item title={<span style={{color:'#000',fontSize:15}}  className='font-link'>Admin</span>} >Orders</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              )}
            {/* <LinkContainer to='/login'>
            <Nav.Link><i className='fas fa-user'></i>Sign in</Nav.Link>
            </LinkContainer> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  )
}


export default Header