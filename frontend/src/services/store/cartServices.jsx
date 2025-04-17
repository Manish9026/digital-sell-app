import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "./paymentServices";
import { storeUserBaseUrl } from "../../utils/service";
import { notify } from "../../utils/notification";

const baseQuery = authBaseQuery({
    defaultBaseUrl: `${storeUserBaseUrl}/cart`, // e.g. http://localhost:5000
});
const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery,
    tagTypes: ["cartApi"],
    endpoints:(builder)=>({
        addToCart: builder.mutation({
            query: (credentials) => ({
                url: "/add",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data,'data');
                    
                     notify({message:data?.message, type:"success",status:data?.status})
                } catch (err) {
                    console.error("Login error:", err);
                    notify({message:data?.message, type:"error",status:data?.status})
                }
            },
        }),
        fetchCart: builder.query({
            query: () => ({
                url: "/fetch",
                method: "GET",
                
            }),
            providesTags: ["cartApi"],
        }),
        removeCart:builder.mutation({
            query: (credentials) => ({
                url: "/remove",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // console.log(data,'data');
                    
                     notify({message:data?.message, type:"success",status:data?.status})
                } catch (err) {
                    console.error("Login error:", err);
                    notify({message:data?.message, type:"error",status:data?.status})
                }
            },
        })

    })
})

export const { useAddToCartMutation, useFetchCartQuery,useRemoveCartMutation } = cartApi;
export {cartApi}