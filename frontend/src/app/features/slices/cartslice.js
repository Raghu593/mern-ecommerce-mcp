import { createSlice } from "@reduxjs/toolkit";
import { useGetMyOrdersQuery } from "../../api";

const initialState={
    cartItems:[],
    totalQuantity:0,
    totalCartValue:0,
    shippingAddress:{},
    paymentMethod:[]
}

export const cartSlice=createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            // console.log("payload",action.payload)
            const newItem=action.payload;
            const existingItem=state.cartItems.find((item)=>item.product === newItem.product)
                    if(existingItem){
                    existingItem.qty=newItem.qty;
                    existingItem.itemsmultiliedbyqty=newItem.qty*newItem.price
                    state.totalCartValue=0
                        state.cartItems.map((item)=>{
                            state.totalCartValue=item.itemsmultiliedbyqty+state.totalCartValue
                        })
                }
                    else{
                        newItem.itemsmultiliedbyqty=newItem.qty*newItem.price
                        state.cartItems.push(newItem);
                        state.totalQuantity=state.cartItems.length
                        state.totalCartValue=0
                        state.cartItems.map((item)=>{
                            state.totalCartValue=item.itemsmultiliedbyqty+state.totalCartValue
                        })
                    }   
                    // localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        }, 
        removeFromCart:(state,action)=>{
            const deleteItem=action.payload;
            // console.log("delitem",deleteItem)
            // console.log(state.cartItems)
            const findItem=state.cartItems.find((item)=>item.product === deleteItem.id)
            // console.warn("found",findItem)
            if(findItem){
                 state.cartItems = state.cartItems.filter(item => item.product !== deleteItem.id); 
                 state.totalQuantity=state.cartItems.length   
                //  console.warn("Tobeminus",state.totalCartValue)
                 state.totalCartValue=state.totalCartValue-deleteItem.cal;
                //  localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
            }
            // state.cartItems.map((item)=>{
            //     // state.totalCartValue=0
            //     state.totalCartValue=state.totalCartValue-item.itemsmultiliedbyqty;
            //     // console.log(total)
            // })
        },
        resetCart:(state,action)=>{
            state.cartItems=[]
            state.totalQuantity=0
            state.totalCartValue=0
            state.shippingAddress={}
            state.paymentMethod=[]
        },
        saveShippingAddress:(state,action)=>{
            state.shippingAddress=action.payload
        },
        savePaymentMethod:(state,action)=>{
            state.paymentMethod=action.payload
        }
        } 
})

export const { addToCart, removeFromCart,saveShippingAddress,savePaymentMethod,resetCart} = cartSlice.actions;

export default cartSlice.reducer;