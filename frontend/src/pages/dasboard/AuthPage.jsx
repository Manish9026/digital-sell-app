import React from 'react'
import {LoginLayout} from '@/components/Dashboard/LoginLayout'
// import { LoginForm } from '@/components/Store/AuthForm'
// '../../components/Dashboard/LoginLayout'
const LoginForm = React.lazy(() => import('../../components/Dashboard/LoginLayout').then(module => ({ default: module.LoginForm })));

const AuthPage = () => {
  return (
    <div>
    <LoginLayout 
      title="Welcome Back" 
      subtitle="Sign in to access your account"
    > 
      <LoginForm />
     </LoginLayout>
  <p className='bg-debug'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem animi rerum nisi id temporibus magni ad dolorum unde. Dolor deserunt modi, unde necessitatibus dolorem ipsa assumenda nisi non soluta quasi!</p>
    </div>
  )
}

export default AuthPage