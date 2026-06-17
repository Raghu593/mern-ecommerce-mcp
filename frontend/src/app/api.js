// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({ 
  prepareHeaders: (headers, { getState }) => {
    const userInfo=JSON.parse(localStorage.getItem('userInfo'))
    // If we have a token set in state, let's assume that we should be passing it.
    if (userInfo!==null) {
      headers.set('Authorization', `Bearer ${userInfo.token}`)
    }
    // console.log("logingheaders",headers)
    return headers 
  }
}),
  tagTypes:['EditUserDetails','EditProductDetails'],
  // refetchOnFocus: true,
  endpoints: (builder) => ({
    //Auth end points
    loginUser:builder.mutation({
      query:(formData)=>{
        return{
          url:'api/users/login',
          method:'POST',
          body:formData,
          headers:{
            'Content-type':'application/json',
          }
        }
      }
    }),
    registerUser:builder.mutation({
      query:(formData)=>{
        return{
          url:'api/users',
          method:'POST',
          body:formData,
          headers:{
            'Content-type':'application/json',
          }
      }
    }
    }),
    //Profile End Points
    getProfile:builder.query({
        query:(formData)=>{
          return{
            url:`api/users/profile`,
            method:'GET',
            headers:{
              'Content-type':'application/json',
            }
          }
        }
    }),
    updateProfile:builder.mutation({
      query:(formData)=>{
        return{
          url:`api/users/profile`,
          method:'PUT',
          body:formData,
          headers:{
            'Content-type':'application/json',
          }
        }
      }
  }),
    //Products end points
    getAllProducts:builder.query({
      query:()=>{
        return{
          url:'/api/products',
          method:'GET'
        }
      },
      providesTags:['EditProductDetails']
    }),
    getProductById:builder.query({
      query:(id)=>{
        return{
          url:`/api/products/${id}`,
          method:'GET'
        }
      },
      providesTags:['EditProductDetails']
    }),
    createProduct:builder.mutation({
      query:(id)=>{
        return{
          url:`/api/products`,
          method:'POST'
        }
      }
    }),
    createProductReviews:builder.mutation({
      query:(body)=>{
        return{
          url:`{{URL}}/api/products/${body.id}/reviews`,
          method:'POST'
        }
      }
    }),
    //Orders end points
    createOrder:builder.mutation({
      query:(orderData)=>{
        console.log(orderData,"data")
        return{
          url:`/api/orders`,
          method:'POST',
          body:orderData,
          headers:{
            'Content-type':'application/json',
          }
        }
      }
    }),
    getOrderById:builder.query({     
      query:(id)=>{
        return{
          url:`/api/orders/${id}`,
          method:'GET'
        }
      }
    }),
    getMyOrders:builder.query({
      query:()=>{
          return{
            url:`/api/orders/myorders`,
            method:'GET',
          }
      },
      provideTags:['Refetchorders']
    }),
    getAllOrders:builder.query({
      query:()=>{
        return{
          url:`/api/orders`,
          method:'GET'
        }
      }
    }),
    //Payment End Points
    initiatePayment:builder.mutation({
      query:(data)=>{       
        console.log("sending this data",data) 
        return{
          url:`/api/payment/initiatepayment`,
          method:'POST',
          body:data,
          headers:{
            'Content-type':'application/json',
          }
        }
      }
    }),
    verifyPayment:builder.mutation({
      query:(response)=>{
        return{
          url:`/api/payment/verifypayment`,
          method:'POST',
          body:response,
          headers:{
            'Content-type':'application/json',
          }
        }
      }
  }),
    updateOrderToPaid:builder.mutation({      //pass in id,payment result coming from paypal or razor pay gateway of choice
      query:(id)=>{
        return{
          url:`/api/orders/${id}/pay`,
          method:'PUT',
          headers:{
            'Content-type':'application/json',
          }
        }
      }
    }),
    updateOrderToDeliver:builder.mutation({      //pass in id,payment result coming from paypal or razor pay gateway of choice
      query:(id)=>{
        return{
          url:`/api/orders/${id}/deliver`,
          method:'PUT',
          headers:{
            'Content-type':'application/json',
          }
        }
      }
    }),
  //admin end points
   getUsers:builder.query({
    query:()=>{
      return{
        url:`/api/users`,
        method:'GET',
      }
    },
    providesTags:['EditUserDetails']
   }),
   getUserById:builder.query({
    query:(id)=>{
      return{
        url:`/api/users/${id}`,
        method:'GET',
      }
    },
    providesTags:['EditUserDetails']
   }),
   updateUserById:builder.mutation({
    query:(formData)=>{
          console.log("logingheaders",formData)
      return{
        url:`/api/users/${formData.id}`,
        method:'PUT',
        body:{
            "name":formData.name,
            "email":formData.email,
            "isAdmin":`${formData.isAdmin}`
        }
      }   
    },
    invalidatesTags:['EditUserDetails']
   }),
   deleteUser:builder.mutation({
    query:(id)=>{
      return{
        url:`/api/users/${id}`,
        method:'DELETE',
      }
    }
   }),
   deleteProduct:builder.mutation({
    query:(id)=>{
      return{
        url:`/api/products/${id}`,
        method:'DELETE',
      }
    }
   }),
   createProduct:builder.mutation({
    query:(formData)=>{
      return{
        url:`/api/products`,
        method:'POST',
        body:formData
      }
    },
    // invalidatesTags:['EditProductDetails']
  }),
  updateProduct:builder.mutation({
    query:(formData)=>{
      console.log(formData.id)
      return{
        url:`/api/products/${formData.id}`,
        method:'PUT',
        body:formData
      }
    },
    invalidatesTags:['EditProductDetails']
  }),
  upload:builder.mutation({
    query:(formData)=>{
      console.log("api.js triggered",formData)
      return{
        url:`/api/upload`,
        method:'POST',
        body:formData,
        headers:{
          'Content-type':'multipart/form-data boundary=MyBoundary'
        }
      }
    }
  })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
              useGetAllProductsQuery,
              useGetProductByIdQuery,
              useLoginUserMutation,
              useRegisterUserMutation,
              useGetProfileQuery,
              useUpdateProfileMutation,
              useCreateOrderMutation,
              useGetOrderByIdQuery,
              useInitiatePaymentMutation,
              useVerifyPaymentMutation,
              useGetMyOrdersQuery,
              useGetAllOrdersQuery,
              useGetUsersQuery,
              useDeleteUserMutation,
              useGetUserByIdQuery,
              useDeleteProductMutation,
              useUpdateUserByIdMutation,
              useCreateProductMutation,
              useUpdateProductMutation,
              useUploadMutation,
              useUpdateOrderToPaidMutation,
              useUpdateOrderToDeliverMutation,
              useCreateProductReviewsMutation
                      } = api