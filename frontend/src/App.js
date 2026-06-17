import Header from "./components/Header";
import Footer from "./components/Footer";
import {BrowserRouter,Route, Routes} from 'react-router-dom'
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceorderScreen from "./screens/PlaceorderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import ProductUploadScreen from "./screens/ProductUploadScreen";
import AllOrders from "./screens/AllOrders";

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
        <Route path='/product/:id' element={<ProductScreen/>}/>
        <Route path='/cart' element={<CartScreen/>}/>
        <Route path='/login' element={<LoginScreen/>}/>
        <Route path='/payment' element={<PaymentScreen/>} exact/>
        <Route path='/shipping' element={<ShippingScreen/>}/>
        <Route path='/placeorder' element={<PlaceorderScreen/>}/>
        <Route path='/profile' element={<ProfileScreen/>}/>
        <Route path='/register' element={<RegisterScreen/>} exact/>
        <Route path='/' element={<HomeScreen/>} exact/>
        <Route path='/order/:id' element={<OrderScreen/>} />
        <Route path='/admin/userlist' element={<UserListScreen/>}/>
        <Route path='/admin/user/:id/edit' element={<UserEditScreen/>}/>
        <Route path='/admin/productlist' element={<ProductListScreen/>}/>
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen/>}/>
        <Route path='/admin/product/upload' element={<ProductUploadScreen/>}/>
        <Route path='/admin/orderlist' element={<AllOrders/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>

  );
}

export default App;
