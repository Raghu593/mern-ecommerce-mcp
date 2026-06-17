import {useState} from 'react';
import { addToCart } from '../app/features/slices/cartslice';
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {Row, Col,Image,ListGroup,Card,Button, Container ,Form} from 'react-bootstrap';
import Rating from '../components/Rating';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../app/api';
import Loader from '../components/Loader';

const ProductScreen = () => {
    const params=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const [qty,setQty]=useState(1)
    // const[product,setProduct]=useState({});

    const {data,isLoading,isSuccess}=useGetProductByIdQuery(params.id);

    // {isSuccess && }
    
    let item=[]
    if(isSuccess){
         item.push(data)
    }

    // setProduct(item)

    // useEffect(()=>{
    //     const fetchProduct=async()=>{
    //         const {data}=await axios.get(`/api/products/${params.id}`)
    //         setProduct(data);
    //     }
    //     fetchProduct();
    // },[])
    console.log("item")
    const addToCartHandler=(name,product,image,price,countInStock)=>{
        // navigate(`/cart/${params.id}?qty=${qty}`)
        dispatch(addToCart({
            qty:qty,
            name:name,
            product:product,
            image:image,
            price:price,
            countInStock:countInStock,
            itemsmultiliedbyqty:null
        }))
    }

    // const product=products.find(p=> p._id===params.id)
  return (
    <Container>

    {
      isLoading && 
      <Loader/>
    }

    {isSuccess && 
    
item.map(product=>(
    <div  key={product._id}>
    <Link className='btn btn-light my-3' to='/'>Go Back</Link>
      <Row>
        <Col md={6}>
            <Image src={product.image} alt={product.name} fluid/>
        </Col>
        <Col>
        <ListGroup variant='flush'>
            <ListGroup.Item>
                <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
                <Rating value={product.rating} text={`${product.numReviews} Reviews`}/>
            </ListGroup.Item>
            <ListGroup.Item>
                Price: ₹ {product.price}
            </ListGroup.Item>
            <ListGroup.Item>
                Description:{product.description}
            </ListGroup.Item>
        </ListGroup>
        </Col>
        <Col md={3}>
            <Card>
                <ListGroup>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                            Price:
                            </Col>
                            <Col>
                            <strong>₹ {product.price}</strong>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                            Status:
                            </Col>
                            <Col>
                            {product.countInStock?'In Stock':'Out Of Stock'}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    {product.countInStock>0 && (
                    <ListGroup.Item>    
                        <Row>
                            <Col>Select Qty</Col>
                            <Col>
                            <Form.Control as='select' value={qty} onChange={(e)=>setQty(e.target.value)}>
                            {
                            [...Array(product.countInStock).keys()].map((x)=>(
                            <option key={x+1} value={x+1}>
                            {x+1}
                            </option>
                            ))
                            }
                            </Form.Control> 
                            </Col>
                        </Row>
                    </ListGroup.Item>


                    )}
                    
                    <ListGroup.Item>
                        <Button className='btn block' type='button' disabled={product.countInStock===0} onClick={()=>addToCartHandler(product.name,product._id,product.image,product.price,product.countInStock)}>Add To Cart</Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
      </Row>
      </div>
))
    
}
    </Container>
  )
}

export default ProductScreen