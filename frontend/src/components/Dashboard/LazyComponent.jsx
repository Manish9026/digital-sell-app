import { lazy } from 'react';

export  const AuthDashboard = {

    LoginForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.LoginForm }))
  ),
  LoginLayout: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.LoginLayout }))
  ),
  ForgotPasswordForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.ForgotPasswordForm }))
  ),
  NewPasswordForm:lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.NewPasswordForm }))
  ),
  TwoFactorForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.TwoFactorForm }))
  ),
  OTPSetupForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.OTPSetupForm }))
  ),
};



