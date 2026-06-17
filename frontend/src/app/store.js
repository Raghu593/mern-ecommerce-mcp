import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from "./api";
import cartReducer from './features/slices/cartslice'
import userReducer from '../app/features/slices/userSlice'
import productReducer from '../app/features/slices/productslice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  timeout: 1000,
  blacklist: [api.reducerPath],
}

const persistedReducer = persistReducer(persistConfig, cartReducer)


export const store=configureStore({
        reducer:{
            [api.reducerPath]: api.reducer,
            // cart:cartReducer,
            cart:persistedReducer,
            user:userReducer,
            product:productReducer
        },
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          // serializableCheck: false,
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
          immutableCheck: false
        }).concat(api.middleware)
        // devTools:false
        
})

let persistor = persistStore(store)

setupListeners(store.dispatch)