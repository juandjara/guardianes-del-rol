import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...props }) => (
  <Route {...props} render={(routeProps) => (
    !!props.user
      ? <Component {...routeProps} user={props.user} />
      : <Redirect to={{
          pathname: '/login',
          state: { next: routeProps.location.pathname }
        }} />
  )} />
)

export default (ProtectedRoute);
