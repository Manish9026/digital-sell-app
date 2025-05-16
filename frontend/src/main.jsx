import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import './index.css'
import './theme.css';
import App from './App.jsx'
import { RoutesProvider } from './routerProvider.jsx'
import { Provider } from 'react-redux'
import { store } from './store.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
// import { Toaster } from "@/components/ui/sonner"

import { Toaster } from "sonner";
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
        <ToastContainer
position="bottom-center"
// containerId="mobile"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
limit={1}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
// theme="light"
/>
<Toaster
richColors
        expand={true}
        closeButton
        toastOptions={{
          classNames: {
            toast: "toast ",
            // title: "text-base font-semibold",
            // description: "text-sm opacity-90",
            // actionButton: "bg-primary text-white hover:bg-primary/80",
            // cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
          },
        }}
/>
    <RoutesProvider/>
    </Provider>
  // </StrictMode>,
)
