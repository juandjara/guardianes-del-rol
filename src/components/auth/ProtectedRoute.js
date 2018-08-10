import React from 'react';
import withAuth from './withAuth';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...props }) => (
  <Route {...props} render={(routeProps) => (
    !!props.user
      ? <Component {...routeProps} {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { next: routeProps.location.pathname }
        }} />
  )} />
)

export default withAuth(ProtectedRoute);
