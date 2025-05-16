import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { dashboardBaseUrl } from "../../utils/service";


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
    }),
    verifyAdmin: builder.mutation({
      query: (data) => ({
        url: "/verify-admin",
        method: "GET",
        // body: data,
      }),
    }),
    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginAdminMutation, useLogoutAdminMutation } = adminAuthApi;
export { adminAuthApi };