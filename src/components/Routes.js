import React from 'react';
import withContext from '../contextService';
import { Route, Redirect, Switch } from 'react-router-dom';

import Login from './auth/Login';
import PostList from './post/PostList';
import PostEdit from './post/PostEdit';
import NotFound from './NotFound';
import Profile from './auth/Profile';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginConfirm from './auth/LoginConfirm';
import PostDisplay from './post/PostDisplay';

const Loading = () => (
  <p style={{margin: '1em', textAlign: 'center'}}>
    Iniciando sesión
  </p>
)

const Routes = props => props.loadingAuth ? <Loading /> : (
  <Switch>
    <Route exact path="/" render={() => <Redirect to="/post" />} />
    <Route path="/login" component={Login} />
    <Route path="/login_confirm" component={LoginConfirm} />
    <ProtectedRoute user={props.user} exact path="/post" component={PostList} />
    <ProtectedRoute exact user={props.user} path="/post/:id" component={PostDisplay} />
    <ProtectedRoute exact user={props.user} path="/post/:id/edit" component={PostEdit} />
    <ProtectedRoute user={props.user} path="/profile" component={Profile} /> 
    <Route component={NotFound} />
  </Switch>
)

export default withContext(Routes);
