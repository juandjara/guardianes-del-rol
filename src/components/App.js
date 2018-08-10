import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Login from './auth/Login';
import PostList from './post/PostList';
import PostEdit from './post/PostEdit';
import CategoryList from './category/CategoryList';
import CategoryEdit from './category/CategoryEdit';
import withAuth from './auth/withAuth';
import Header from './Header';
import NotFound from './NotFound';
import ImageGallery from './image-gallery/ImageGallery';
import Profile from './auth/Profile';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginConfirm from './auth/LoginConfirm';

const Loading = () => (
  <p style={{margin: '1em', textAlign: 'center'}}>
    Cargando panel de control
  </p>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Header />
          {this.props.loadingAuth ? <Loading /> : (
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/post" />} />,
              <Route path="/login" component={Login} />
              <Route path="/login_confirm" component={LoginConfirm} />
              <ProtectedRoute exact path="/post" component={PostList} />,
              <ProtectedRoute path="/post/:id" component={PostEdit} />,
              <ProtectedRoute exact path="/category" component={CategoryList} />,
              <ProtectedRoute path="/category/:id" component={CategoryEdit} />,
              <ProtectedRoute path="/gallery" component={ImageGallery} />,
              {/* desactivado hasta que se definan los datos de usuario
              <Route path="/profile" component={Profile} /> */}
              <Route component={NotFound} />
            </Switch>
          )}
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default withAuth(App);
