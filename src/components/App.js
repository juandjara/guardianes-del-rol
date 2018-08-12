import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './auth/withAuth';
import Header from './Header';
import Routes from './Routes';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes />
        </AuthProvider>
      </BrowserRouter>
    );
  }
}

export default App;
