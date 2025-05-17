import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = ({children}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // or remove behavior for instant scroll
  }, [pathname]);

  return (<>{children}</>);
};

