import React from 'react'
// import { PayPalButton } from 'react-paypal-button-v2'
import { Link,useParams ,useNavigate} from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button ,Container} from 'react-bootstrap'
// import dotenv from 'dotenv';
import Message from '../screens/Message'
// import Razorpay from 'razorpay';
// import dotenv from "react-dotenv";
import Loader from '../components/Loader'
import { useGetOrderByIdQuery ,useInitiatePaymentMutation,useVerifyPaymentMutation,useUpdateOrderToDeliverMutation} from '../app/api'
import { brandcolor } from '../components/brandcolor'
// import useRazorpay from "react-razorpay";
  // import Razorpay from 'razorpay';

const OrderScreen = () => {

  // const keyid=process.env.key_id
const orderId = useParams();

console.log("orderid",orderId)
const navigate = useNavigate();
const{isLoading,error,data,isSuccess,refetch}=useGetOrderByIdQuery(orderId.id);
const[payOrder,payOrderResponse]=useInitiatePaymentMutation() 
const[verifyPay,verifyPayResponse]=useVerifyPaymentMutation() 
const[deliver,deliverResponse]=useUpdateOrderToDeliverMutation() 
let res;

const placeOrderHandler=async(e)=>{
  e.preventDefault()
  try {
    await payOrder({"amount":data.totalPrice});
    
  } catch (error) { 
    console.log(error)
  }
  }

  const deliverHandler=async(e)=>{
    e.preventDefault()
    try {
      await deliver(data._id);
      refetch()
      
    } catch (error) { 
      console.log(error)
    }
    }

  let userInfo=JSON.parse(localStorage.getItem('userInfo'))


  const initPayment=(odata)=>{
    console.log("id",odata.id)
      const options={
          key:"rzp_test_UowCySzJTjR40c",
          order_id:odata.id,
          amount:odata.amount,
          currency:odata.currency,
          name:"Test transaction",
          description:"Test transaction",
          handler:async(response)=>{
            console.log("response",response)
            try {
              await verifyPay(response);
              console.log(data)
            } catch (error) {
              console.log(error)
            }
          },
          theme:{
            color:"#3399cc"
          }
      }
      var rzp1 = new window.Razorpay(options);
      rzp1.open()
      // console.log("rpay",rzp1)
  }


  if(payOrderResponse.isSuccess){
    console.log("recieving this order id in resposes",payOrderResponse.data.data)
    initPayment(payOrderResponse.data.data)
  }
  
  isSuccess && console.log(data)


  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <Container>
      <h1>Order Id: {data._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <Button
                      type='button'
                      className='btn btn-block'
                      onClick={placeOrderHandler}
                      style={{color:brandcolor}}
                    >
                      Make Payment
                    </Button>              <p>
                <strong>Name: </strong> {data.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${data.user.email}`}>{data.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {data.shippingAddress.address}, {data.shippingAddress.city}{' '}
                {data.shippingAddress.postalCode},{' '}
                {data.shippingAddress.country}
              </p>
              {data.isDelivered ? (
                <Message variant='success'>
                  Delivered on {data.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {data.paymentMethod}
              </p>
              {data.isPaid ? (
                <Message variant='success'>Paid on {data.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {data.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {data.orderItems.map((item, index) => (
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
                  <Col>${data.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${data.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${data.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${data.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!data.isPaid && (
                <ListGroup.Item>
                  {/* {loadingPay && <Loader />} */}
                  {/* {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )} */}
              {/* <button id="rzp-button1">Pay</button> */}
              {/* Pay ${data.totalPrice} Now */}
                </ListGroup.Item>
              )} 
              {/* {loadingDeliver && <Loader />} */}
              {userInfo &&
                userInfo.isAdmin &&
                // data.isPaid &&
                !data.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderScreen