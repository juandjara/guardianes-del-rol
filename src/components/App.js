import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import {ContextProvider} from '../contextService';
import Header from './Header';
import Routes from './Routes';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ContextProvider>
          <Header />
          <Routes />
          <Footer />
        </ContextProvider>
      </BrowserRouter>
    );
  }
}

export default App;
