import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button} from 'react-bootstrap'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useNavigate ,useParams} from 'react-router-dom';
import { useGetProductByIdQuery , useUpdateProductMutation} from '../app/api'

const ProductEditScreen=()=> {

  const params=useParams();
  let id=params.id

  console.log(id)

    const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [skip, setskip] = useState(true)
  const [uploading, setUploading] = useState(false)

  const {data,isLoading,isSuccess}=useGetProductByIdQuery(id,{
    skip
  });

  const [updateProduct,updateProductResponse]=useUpdateProductMutation();

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData={name,price,image,brand,category,countInStock,description,id}
    // console.log(formData)
    await updateProduct(formData);
    }

    const uploadFileHandler = async (e) => {
      const file=e.target.files[0]
      console.log("file",file)
      const formData=new FormData()
      formData.append('image',file)
      setUploading(true)
        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }

          const { data } = await axios.post('/api/upload', formData, config)
          setImage(data)
          //  await uploadImage(file) 
          //  setImage(uploadImageResponse.data)
           setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    useEffect(() => {
      setskip(false)
      if(isSuccess){
        setName(data.name)
        setPrice(data.price)
        setImage(data.image)
        setBrand(data.brand)
        setCategory(data.category)
        setCountInStock(data.countInStock)
        setDescription(data.description)
      }
     
    }, [isSuccess])

  return (
    <>
    <Link to='/admin/productlist' className='btn btn-light my-3'>
      Go Back
    </Link>
    <FormContainer>
      <h1>Edit Product</h1>
      {/* {loadingUpdate && <Loader />} */}
      {/* {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>} */}
      {/* {loading ? ( */}
        {/* <Loader /> */}
      {/* ) : error ? ( */}
        {/* <Message variant='danger'>{error}</Message> */}
      {/* ) : ( */}
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter image url'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control
              type='file'
              id='image-file'
              label='Choose File'
              onChange={uploadFileHandler}
            ></Form.Control>
            {uploading && <Loader />}
          </Form.Group>

          <Form.Group>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter countInStock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      {/* )} */}
    </FormContainer>
  </>  
  )
}

export default ProductEditScreen