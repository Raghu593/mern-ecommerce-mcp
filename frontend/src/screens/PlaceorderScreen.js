import React from 'react'
import { Row, Button ,Col,ListGroup,Image,Card} from 'react-bootstrap'
import Message from './Message';
import { useNavigate,Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps'
import { useSelector } from 'react-redux'
import { useCreateOrderMutation } from '../app/api';

const PlaceorderScreen = () => {
    const cart=useSelector((state)=>state.cart);
  const navigate=useNavigate();
    //Calculate Prices

      const addDecimals=(num)=>{
        return (Math.round(num*100)/100).toFixed(2)
      }

    cart.shippingPrice=addDecimals(cart.totalCartValue > 100 ? 0 : 100);

    cart.taxPrice=addDecimals(Number((0.15*cart.totalCartValue).toFixed(2)))

      cart.totalPrice=(Number(cart.shippingPrice)+Number(cart.taxPrice)+Number(cart.totalCartValue)).toFixed(2);


      const[createOrder,{error,data,isSuccess}]=useCreateOrderMutation();

      if(isSuccess){
        navigate(`/order/${data._id}`)
        console.log("successsssss")
      }


    const placeOrderHandler=async(e)=>{
      e.preventDefault()
      const orderData={
        orderItems:cart.cartItems,
        shippingAddress:cart.shippingAddress,
        paymentMethod:cart.paymentMethod,
        itemsPrice:cart.totalCartValue,
        shippingPrice:cart.shippingPrice,
        taxPrice:cart.taxPrice,
        totalPrice:cart.totalPrice}
        await createOrder(orderData)
      // console.log(res)
    }

  return (
    <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
            <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping Address</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '} ,
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.totalCartValue}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error.data.message}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceorderScreen