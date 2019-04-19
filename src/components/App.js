import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import {ContextProvider} from '../contextService';
import Header from './Header';
import Routes from './Routes';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ContextProvider>
          <Header />
          <Routes />
        </ContextProvider>
      </BrowserRouter>
    );
  }
}

export default App;
