import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storeUserBaseUrl, url } from "../../utils/service";
import axios from "axios";
// import { btoa } from "buffer";

 const baseQuery = fetchBaseQuery({
  baseUrl: `${storeUserBaseUrl}/auth`, // ⬅️ update this to your API base
  credentials: 'include', // ⬅️ required to send cookies with every request
})
export const authBaseQuery = ({ defaultBaseUrl }) => {
    return async (args, api, extraOptions) => {
      // Optional: path override via meta
      const path = args.meta?.baseUrl || '';
      const baseUrl = `${defaultBaseUrl}${path}`.replace(/\/+$/, '') + '/';
  
      // console.log(baseUrl, "baseUrl");
      
      const rawBaseQuery = fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
          const token = getState().auth?.token;
          if (token) {
            headers.set('authorization', `Bearer ${token}`);
          }
          return headers;
        },
        credentials:"include"
      });
      
      // Clean args (remove meta before request)
      const cleanedArgs = typeof args === 'object' && args.meta
        ? { ...args, meta: undefined }
        : args;
  
      const result = await rawBaseQuery(cleanedArgs, api, extraOptions);
  
      if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery('/refresh-token', api, extraOptions)

        if (refreshResult?.data) {
          console.log('Token refreshed. Retrying original request...')
          // Retry the original request
         result = await rawBaseQuery(cleanedArgs, api, extraOptions);
        } else {
          api.dispatch({ type: 'auth/logout' });
          window.location.href = '/user/login';
          console.warn('Token refresh failed. Consider redirecting to login.')
          // Optional: api.dispatch(logout())
        }
     
      }
  
      return result;
    };
  };

  const customBaseQuery = authBaseQuery({
    defaultBaseUrl: `${storeUserBaseUrl}/payment`, // e.g. http://localhost:5000
  });
  
const paymentApi=createApi({
    reducerPath:"paymentApi",
    baseQuery:customBaseQuery,
    tagTypes:["paymentApi"],
    endpoints:(builder)=>({
        paymentOrder:builder.mutation({
            query:(credentials)=>({
                url:"/create-order",
                method:'POST',
                body:credentials
            }),
            async onQueryStarted({navigate}, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const {order} = data;
                    console.log(order,"payment order data");
                    if(!order) return
                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from env
                        amount: order.amount,
                        currency: "INR",
                        name: "My Store",
                        description: "Test Transaction",
                        order_id: order.id,
                        handler: async function (response) {
                            // window.history.pushState({}, '', `/user/payment-waiting?data=${btoa(JSON.stringify({ loading: true }))}`);
                          navigate("/user/payment-waiting", {
                            loading: true
                          })
                          const result = await axios.post(`${storeUserBaseUrl}/payment/verify-order`, {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            email:order?.email,
                            productName:order?.productName,
                            fileId:order?.fileId
                          });
                          if (result.data.status) {
                            // window.history.pushState({}, '', `/user/payment-success?data=${btoa(JSON.stringify( {
                            //     email: order?.email,
                            //     productName:order?.productName, orderId: response.razorpay_order_id,
                            //   }))}`);
                            navigate("/user/payment-success", {
                              state: {
                                email: order?.email,
                                productName:order?.productName, orderId: response.razorpay_order_id,
                              }
                            })
                          }
                          // alert("Payment successful. Check your email.");
                        },
                        // callbackurl: "http://localhost:2000/api/payment/verify-order",
                        prefill: {
                          name: order.userName,
                          email: order.email,
                          contact: "9999999999",
                        },
                        // method: {
                        //   upi: true, // ✅ explicitly enable UPI (optional)
                        // },
                      };
                  
                      const rzp = new window.Razorpay(options);
                      rzp.open();
                } catch (err) {
                    console.error('Login error:', err)
                }
            },
        })
    })
})

export const {usePaymentOrderMutation}=paymentApi

export {paymentApi}