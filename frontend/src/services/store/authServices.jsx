// src/services/storeUserApi.js
import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { storeUserBaseUrl, url } from '../../utils/service'
import { logout, setCredentials } from '../../slices/store/authSlice'
import { notify } from '../../utils/notification'
import { toast } from 'react-toastify'

const baseQuery = fetchBaseQuery({
  baseUrl: `${storeUserBaseUrl}/auth`, // ⬅️ update this to your API base
  credentials: 'include', // ⬅️ required to send cookies with every request
})

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)


  if (result.error && result.error.status === 401) {
    console.log('Access token expired. Attempting to refresh...')

    // Attempt refresh using cookie-stored refresh token
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions)

    if (refreshResult.data) {
      console.log('Token refreshed. Retrying original request...')
      // Retry the original request
      result = await baseQuery(args, api, extraOptions)
    } else {
      console.warn('Token refresh failed. Consider redirecting to login.')
      // Optional: api.dispatch(logout())
    }
  }

  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
            const { data } = await queryFulfilled;
            dispatch(setCredentials(data?.['data']))
            notify({message:data?.message, type:"success",status:data?.status})
        } catch (err) {
            const {error} = err
            notify({message:error?.data?.message, type:"error",status:error?.data?.status});
        }
      },
    }),
    register: builder.mutation({
        query: (credentials) => ({
          url: '/register',
          method: 'POST',
          body: credentials,
        }),
        // transformErrorResponse: (error) => {
        //     notify({message:error?.data?.message, type:"error",status:error?.data?.status})
        //     return error
        //   },
        async onQueryStarted(arg, { dispatch, queryFulfilled, }) {
          try {
            const { data } = await queryFulfilled
            notify({message:data?.message, type:"success",status:data?.status})
          } catch (err) {
            const {error} = err
            notify({message:error?.data?.message, type:"error",status:error?.data?.status})
          }
        },
      }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
            const { data } = await queryFulfilled
            notify({message:data?.message, type:"success",status:data?.status})
          dispatch(logout());
        } catch (err) {
            const {error} = err
            notify({message:error?.data?.message, type:"error",status:error?.data?.status})
        //   console.error('logout error:', err)
        }
      },
    }),
    verify: builder.query({
      query: () => ({
        url: '/verify',
        method: 'GET',
        // credentials: 'include'
    }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled
            // console.log(data,"data");
            
            dispatch(setCredentials(data?.['data']))
          } catch (err) {
            console.error('Login error:', err)
          }
        },
     
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation,useRegisterMutation ,useVerifyQuery ,useLazyVerifyQuery} = authApi

// fallback base URL
// const baseQuery = fetchBaseQuery({
//   baseUrl: 'http://localhost:5000/api',
//   credentials: 'include',
// })

// export const baseQueryWithReauth = async (args, api, extraOptions) => {
//   // Optionally override baseUrl per request
//   const customBaseQuery = fetchBaseQuery({
//     baseUrl: getBaseUrl(args?.url),
//     credentials: 'include',
//   })

//   let result = await customBaseQuery(args, api, extraOptions)

//   if (result.error && result.error.status === 401) {
//     console.log('Access token expired. Refreshing...')

//     const refreshResult = await customBaseQuery('/auth/refresh', api, extraOptions)

//     if (refreshResult.data) {
//       console.log('Refreshed. Retrying original request...')
//       result = await customBaseQuery(args, api, extraOptions)
//     } else {
//       console.warn('Refresh failed')
//     }
//   }

//   return result
// }

// function getBaseUrl(path = '') {
//   if (path.startsWith('/auth/login') || path.startsWith('/auth/refresh')) {
//     return 'http://localhost:5000/auth' // example: separate auth server
//   }
//   return 'http://localhost:5000/api' // default for storeUser and other APIs
// }
