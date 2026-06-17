import { Carousel , Image} from "react-bootstrap"
import newban1 from '../assets/newban1.jpeg'
import baby from '../assets/gut2.jpeg'
import ban2 from '../assets/newban2.jpeg'

const ProductCarousel=()=>{
    return(
        <Carousel pause='hover' className="bg-dark">
            <Carousel.Item  style={{height:450}}>
                    <Image src={newban1} fluid style={{height:'100%',width:'100%'}}/>
                    {/* <Carousel.Caption style={{color:'#000', fontSize:35,color:"white",position:'absolute'}}>Every Nutrition Your Baby Needs In One Sachet</Carousel.Caption> */}
            </Carousel.Item>
            <Carousel.Item style={{height:450}}>
                    <Image src={newban1} fluid style={{height:'100%',width:'100%'}}/>
            </Carousel.Item>
            {/* <Carousel.Item style={{height:450}}>
                    <Image src={ban2} fluid style={{height:'100%',width:'100%'}}/>
            </Carousel.Item> */}
        </Carousel>
    )
}

export default ProductCarousel;