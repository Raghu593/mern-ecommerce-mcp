import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import Message from './Message';
import {Row, Col,Image,ListGroup, Container, ListGroupItem ,Form, Button,Card} from 'react-bootstrap';
import { addToCart,removeFromCart } from '../app/features/slices/cartslice';
import { brandcolor } from '../components/brandcolor';

function CartScreen() {

  const navigate=useNavigate();

    const dispatch=useDispatch();
    const cartItems=useSelector((state)=>state.cart.cartItems);
    const totalQuantity=useSelector((state)=>state.cart.totalQuantity);
    const totalCartValue=useSelector((state)=>state.cart.totalCartValue);

    const checkoutHandler=()=>{
      navigate('/login?redirect=shipping')
      //     if (localStorage.getItem('userInfo') !== null) {
  //       navigate('/shipping')
  // }
  // else{ 
  //       navigate('/login')
  //   }
  }

  return( 
    <Container>
    <Row>
      <Col md={8}>
        <h1 style={{color:brandcolor}}>Shopping Cart</h1>
        {cartItems.length===0 ? 
        (<Message>Your Cart Is Empty <Link to='/' style={{color:brandcolor}}>Go Back</Link></Message>) :
         (
         <ListGroup variant='flush'>
        
        {cartItems.map((item)=>(
          <ListGroupItem key={item.product}>
              <Row>
                <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                </Col>
                <Col md={3}>
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </Col>
                <Col md={2}>${item.price}</Col>
                <Col md={2}>
                <Form.Control as='select' value={item.qty} onChange={(e)=>dispatch(addToCart({
                qty:e.target.value,
                name:item.name,
                product:item.product,
                image:item.image,
                price:item.price,
                countInStock:item.countInStock,
                }))}>  
                            {
                            [...Array(item.countInStock).keys()].map(x=>(
                            <option key={x+1} value={x+1}>
                            {x+1}
                            </option>
                            ))
                            }
                </Form.Control>
                </Col>
                <Col md={2}>
                  <Button type='button' variant='light' onClick={()=> dispatch(removeFromCart({id:item.product,cal:item.itemsmultiliedbyqty}))}><i className='fas fa-trash' style={{color:brandcolor}}></i></Button>
                </Col>
              </Row>
          </ListGroupItem>
        ))}
        </ListGroup>
        )}
      </Col>
      {totalQuantity > 0 ?
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Subtotal For ({totalQuantity}) items</h2>
              <h4>{totalCartValue}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                onClick={checkoutHandler}
                style={{color:brandcolor}}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
      :
      <>
      </>
      }
    </Row>

    {/* <input type="file"/> */}
    </Container>
  )
}

export default CartScreen