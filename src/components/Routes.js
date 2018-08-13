import React from 'react';
import withAuth from './auth/withAuth';
import { Route, Redirect, Switch } from 'react-router-dom';

import Login from './auth/Login';
import PostList from './post/PostList';
import PostEdit from './post/PostEdit';
import CategoryList from './category/CategoryList';
import CategoryEdit from './category/CategoryEdit';
import NotFound from './NotFound';
import ImageGallery from './image-gallery/ImageGallery';
import Profile from './auth/Profile';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginConfirm from './auth/LoginConfirm';

const Loading = () => (
  <p style={{margin: '1em', textAlign: 'center'}}>
    Iniciando sesión
  </p>
)

const Routes = props => props.loadingAuth ? <Loading /> : (
  <Switch>
    <Route exact path="/" render={() => <Redirect to="/post" />} />,
    <Route path="/login" component={Login} />
    <Route path="/login_confirm" component={LoginConfirm} />
    <ProtectedRoute user={props.user} exact path="/post" component={PostList} />,
    <ProtectedRoute user={props.user} path="/post/:id" component={PostEdit} />,
    {/* <ProtectedRoute user={props.user} exact path="/category" component={CategoryList} />, */}
    {/* <ProtectedRoute user={props.user} path="/category/:id" component={CategoryEdit} />, */}
    {/* <ProtectedRoute user={props.user} path="/gallery" component={ImageGallery} />, */}
    <ProtectedRoute user={props.user} path="/profile" component={Profile} /> 
    <Route component={NotFound} />
  </Switch>
)

export default withAuth(Routes);
