import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { dashboardBaseUrl } from "../../utils/service";
// import {toast} from '../../components/Shared/Toast'

const baseQuery = fetchBaseQuery({
    baseUrl: `${dashboardBaseUrl}/admin-auth`, // ⬅️ update this to your API base
    credentials: 'include', // ⬅️ required to send cookies with every request
  })
const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery,
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      // async onQueryStarted(arg, { dispatch, queryFulfilled, }) {
      //                       try {
      //                         const { data } = await queryFulfilled
      //                         toast({toastType:"success",description:data?.message,title:"Login Success"})
      //                       } catch (err) {
      //                         const {error} = err
      //                         toast({toastType:"error",description:error?.data?.message,title:"Login Failed"})
      //                       }
      //                     },
    }),
    verifyAdmin: builder.query({
      query: (data) => ({
        url: "/verify-token",
        method: "GET",
        // body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, }) {
                            try {
                              const { data } = await queryFulfilled;

                              // notify({message:data?.message, type:"success",status:data?.status})
                            } catch (err) {
                              const {error} = err
                              // notify({message:error?.data?.message, type:"error",status:error?.data?.status})
                            }
                          },
    }),
    logoutAdmin: builder.query({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginAdminMutation, useLogoutAdminMutation,useLazyVerifyAdminQuery,useLazyLogoutAdminQuery } = adminAuthApi;
export { adminAuthApi };