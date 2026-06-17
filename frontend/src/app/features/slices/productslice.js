import { createSlice } from "@reduxjs/toolkit";

const initialState={
    products:[],
    loading:false,
    count:5,
    error:[]
}

export const productSlice=createSlice({
    name:'product',
    initialState,
    reducers:{
        productListRequest:(state,action)=>{
            // const {data,isLoading,isFetching,error,isError,isSuccess}=useGetAllProductsQuery();
            // state.count=state.count+1
            // state.products.push(data)
        },
        // productListSuccess:(state,action)=>{
        //     state.loading=false;
        //     state.products=action.payload
        // },
        // productListFailure:(state,action)=>{
        //     state.loading=false;
        //     state.error=action.payload
        // }
    }
}) 

export const {productListRequest} = productSlice.actions;

export default productSlice.reducer;