export const url=import.meta.env.VITE_SERVER_URL || "http://localhost:2000";

 const storeUserBaseUrl=`${url}/api/store/user`;
 const dashboardBaseUrl=`${url}/api/dashboard`;
 export {storeUserBaseUrl,dashboardBaseUrl}