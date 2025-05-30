import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { dashboardBaseUrl } from "../../utils/service";

const dashProductApi=createApi({
    reducerPath:"dashProductApi",
        baseQuery:fetchBaseQuery({
            baseUrl:`${dashboardBaseUrl}/product`,
            credentials:"include"
        }),
        endpoints:(builders)=>({

        getCoupons:builders.query({
                query:(code)=>({
                    url:`/coupons?code=${code}`,
                    method:"GET"
                })
            })

        })

})

export const {useLazyGetCouponsQuery,useGetCouponsQuery}=dashProductApi;
export {dashProductApi}