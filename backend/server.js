import express from 'express';
import path from 'path'
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import ProductRoutes from './routes/ProductRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import {notFound,errorHandler} from './middleware/ErrorMiddleware.js'

dotenv.config()
connectDB()
const app=express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"))
}

app.use(express.json()) //allow us to accept json data to the body



app.use('/api/products',ProductRoutes) 
app.use('/api/users',userRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/upload',uploadRoutes)

const __dirname=path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))
app.use(errorHandler)


if(process.env.NODE_ENV === 'production'){
    console.log("prod")
    app.use(express.static(path.join(__dirname,'/frontend/build')))
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'frontend','build','index.html')))
}
else{
    app.get('/',(req,res)=>{
        res.send('Api is Running')
    })
}

const PORT=process.env.PORT || 5000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));