import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { url } from '../../utils/service'
import { logout, setCredentials } from '../../slices/store/authSlice'
import { notify } from '../../utils/notification'
import { toast } from 'react-toastify'
const baseQuery = fetchBaseQuery({
    baseUrl: `${url}/api/dashboard`, // ⬅️ update this to your API base
    credentials: 'include', // ⬅️ required to send cookies with every request
  })
export const productApi=createApi({
    reducerPath:"productApi",
    baseQuery,
    tagTypes:["product"],
    endpoints:(builder)=>({
        getProducts:builder.query({
            query: () => ({
                    url: '/product',
                    method: 'GET',
                    // credentials: 'include'
                }),
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                          try {
                           
                          } catch (err) {
                            console.error('Login error:', err)
                          }
                        },
        }),
        getSingleProduct:builder.query({
            query: (id) => ({
                    url: `/product/${id}`,
                    method: 'GET',
                    // credentials: 'include'
                }),
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                          try {
                          //  const data=await queryFulfilled;
                          //  console.log(data,data);
                           
                          } catch (err) {
                            console.error('Login error:', err)
                          }
                        },
        })
    })
})

export const {useGetProductsQuery,useGetSingleProductQuery} =productApi