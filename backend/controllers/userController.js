import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

//@desc Auth user & get token
//route GET /api/users/login
//@access Public
const authUser = asyncHandler(async(req,res)=>{
   const {email,password}=req.body
    
    //can write validations and responsd accordingly here
    
    const user=await User.findOne({email}) //email:email

    if(user&&(await user.matchPassword(password))){

        res.json({
            _id:user._id,
            message:"success",
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })

    }
    else{
            res.status(401)
            throw new Error("Invalide Email Or Password")
    } 

    })


//@desc Register New USer
//route POST /api/users
//@access Public
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body
 
     //can write validations and responsd accordingly here
     
     const userExists=await User.findOne({email}) //email:email
        
     if(userExists){
     res.status(400)
        throw new Error('User Already Exits')
        }

        const user=await User.create({
            name,
            email,
            password
         })

     if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })
     }    else {
        res.status(400)
        throw new Error('Invalid user data')
     }

     })

    


 

//@desc Auth GET user Profile
//route GET /api/users/Profile
//@access Private

const getUserProfile = asyncHandler(async(req,res)=>{
    console.log("req",req)
    console.log("triggered")
    const user= await User.findById(req.user._id)
        if(user){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
            }) 
        }
        else
        {
            res.status(404)
            throw new Error('user not found');
        }

})

//@desc Update user Profile
//route PUT /api/users/Profile
//@access Private

const updateUserProfile = asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id)

    if(user){
        user.name=req.body.name || user.name
        user.email=req.body.email || user.email
        if(req.body.password){
            user.password=req.body.password
        }
        const updateUser=user.save()
        res.json({
            _id:user._id,
            message:"Profile Updated Successfully",
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })
    }
    else
    {
        res.status(404)
        throw new Error('user not found');
    }

})

//@desc Auth GET all users
//route GET /api/users
//@access Private/Admin

const getUsers = asyncHandler(async(req,res)=>{
    const users= await User.find({})
    res.json(users)
}) 

//@desc Delete all users
//route GET /api/users/:id
//@access Private/Admin

const deleteUser = asyncHandler(async(req,res)=>{
    console.log("reqqqqqq",req)
    const user= await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message:"user removed"})
    }
    else{
        res.status(404)
        throw new Error('User Not Found')
    }
}) 

//@desc Auth GET user by id
//route GET /api/users/:id
//@access Private/Admin

const getUserById = asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id).select('-password')
    if(user){
        res.json(user)
    }
    else{
        res.status(404)
        throw new Error("User Not Found")
    }
}) 

//@desc Update user 
//route PUT /api/users/:id
//@access Private/Admin

const updateUser = asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id)
    if(user){
        user.name=req.body.name || user.name
        user.email=req.body.email || user.email
        user.isAdmin=req.body.isAdmin || user.isAdmin
        const updatedUser=await user.save()
        res.json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin,
        })
        // res.json({"true":true})
        // console.log("upppppp",updateUser)
    }
    else
    {
        res.status(404)
        throw new Error('user not found');
    }

})

export {authUser,getUserProfile,registerUser,updateUserProfile,getUsers,deleteUser,getUserById,updateUser}