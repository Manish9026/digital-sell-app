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
   tagTypes: ['Session'],
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
    verify_2FA:builder.mutation({
      query:(data)=>({
        url:'/verify-2fa',
        method:"POST",
        body:data
      })
    }),
    
    setup_2FA:builder.mutation({
      query:()=>({
        url:'/enable-2fa',
        method:"POST"
      })
    }),
    confirm_2FA:builder.mutation({
      query:(data)=>({
        url:'/confirm-2fa',
        method:"POST",
        body:data
      })
    }),
    disabled_2FA: builder.query({
      query: () => ({
        url: "/disabled-2fa",
        method: "GET",
      }),
    }),

    sessions: builder.query({
      query: () => ({
        url: "/sessions",
        method: "GET",
      }),
       providesTags: ['Session']
    }),

    deleteSession: builder.mutation({
      query: (id) => ({
       url: `/session/${id}`,
        method: "DELETE",
        // params:id
      }),
       invalidatesTags: ['Session']
    }),

    logoutAdmin: builder.query({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
    }),
  }),
});

const driveSetupApi=createApi({
  baseQuery:fetchBaseQuery({
    baseUrl:`${dashboardBaseUrl}/drive`,
    credentials:"include"
  }),
  tagTypes:["drives"],
  endpoints:(builder)=>({
    addDrive:builder.mutation({
      query:()=>({
        url:"/auth/google",
        method:"POST"
      }),
      invalidatesTags:["drive"]
    }),

    getDriveDate:builder.query({

      query:()=>(
        {
          url:"/get-drives",
          method:"GET",       
        }
      ),
      
      providesTags: ['drives']
    }),
    
  })



})
export const {useAddDriveMutation,useGetDriveDateQuery}=driveSetupApi

export const { useLoginAdminMutation, useLogoutAdminMutation,useLazyVerifyAdminQuery,useLazyLogoutAdminQuery,useSetup_2FAMutation,useConfirm_2FAMutation,useLazyDisabled_2FAQuery ,useVerify_2FAMutation,useSessionsQuery,useDeleteSessionMutation} = adminAuthApi;
export { adminAuthApi ,driveSetupApi};