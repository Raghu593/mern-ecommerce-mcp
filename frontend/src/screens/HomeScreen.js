import React from 'react'
import { Row , Col, Container ,Image} from 'react-bootstrap'
import Product from '../components/Product'
import { useGetAllProductsQuery } from '../app/api';
import Loader from '../components/Loader';
import ProductCarousel from '../components/Productcarousal';
import baby from '../assets/baby2.jpg'


const HomeScreen = () => {



  
  // const[products,setProducts]=useState([]);

  // const loggedin=useSelector((state)=>state.user.loggedIn);

  // useEffect(()=>{
  //   const fetchProducts=async()=>{
  //   const {data}= await axios.get('/api/products')
  //     setProducts(data);
  //   }
  //   fetchProducts()
  // },[])

  // useEffect(()=>{
  //   dispatch(productListRequest())
  // },[])

  const {data,isLoading,isSuccess}=useGetAllProductsQuery();

  // const getMyOrders=useGetMyOrdersQuery();

  // {isSuccess && console.warn(data)}

  // const add=()=>{
    // dispatch(productListRequest())
  //   console.log("clicked")
  // }

  // {isSuccess && products.push(data)}


    // const Count=useSelector((state)=>state.product.count);

console.log(data)

  return (
    
    <main className="py-3">
          <ProductCarousel/>    
          {/* <Container>      
          <Image src={baby} fluid style={{height:'100%',width:'100%'}}/>
          <h1 style={{position: 'absolute', 
          top: '20%',color:"white",fontWeight:"500",left:'8%',fontSize:25}}>Every Nutrition Your Baby Needs In One Sachet</h1>
          </Container> */}
    { 
      isLoading && 

      <Loader/>


    }


    {isSuccess &&
    <Container>
    <h1>Latest Products </h1>
    <Row>
        {data.map(product=>(
            <Col key={product._id} sm={12} md={6} lg={3} xl={4}>
            <Product product={product}/>
            </Col>
        ))}
    </Row>
    </Container>
}
    </main>
  )
}





export default HomeScreen