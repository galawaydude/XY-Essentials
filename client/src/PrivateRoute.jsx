import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [cookies] = useCookies(['token']);

  return (
    <Route
      {...rest}
      render={props =>
        cookies.token ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
