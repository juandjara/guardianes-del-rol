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
          {
            this.props.user ? (
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/post" />} />
                <Route exact path="/post" component={PostList} />
                <Route path="/post/:id" component={PostEdit} />
                <Route exact path="/category" component={CategoryList} />
                <Route path="/category/:id" component={CategoryEdit} />
                <Route path="/gallery" component={ImageGallery} />
                {/* desactivado hasta que se definan los datos de usuario */}        
                {/* <Route path="/profile" component={Profile} /> */}
                <Route component={NotFound} />
              </Switch>
            ) : this.props.loadingAuth ? <Loading /> : <Login />
          }
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default withAuth(App);
