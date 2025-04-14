import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { url } from '../../utils/service'

import { notify } from '../../utils/notification'
import { toast } from 'react-toastify';
const baseQuery = fetchBaseQuery({
    baseUrl: `${url}/api/dashboard/drive`, // ⬅️ update this to your API base
    credentials: 'include', // ⬅️ required to send cookies with every request
  })
const driveServiceApi=createApi({
    reducerPath:"driveServiceApi",
    baseQuery,
    tagTypes:["driveServiceApi"],
    endpoints:(builder)=>({
        uploadPoductOnDrive:builder.mutation({
            query:(credentials)=>({
                url:"/upload-products",
                method: 'POST',
                body: credentials,
            }),
             async onQueryStarted(arg, { dispatch, queryFulfilled, }) {
                      try {
                        const { data } = await queryFulfilled
                        notify({message:data?.message, type:"success",status:data?.status})
                      } catch (err) {
                        const {error} = err
                        notify({message:error?.data?.message, type:"error",status:error?.data?.status})
                      }
                    },
        })
    })

})


export const {useUploadPoductOnDriveMutation}=driveServiceApi;
export {driveServiceApi}