import React, { Component } from 'react';
import styled from 'styled-components';
import Icon from '../Icon';
import { auth } from '../../firebase';
import { Redirect } from 'react-router-dom';

const LoginConfirmStyle = styled.div`
  text-align: center;
  max-width: 400px;
  padding: 16px;
  header {
    font-size: 20px;
    margin-bottom: 6px;
  }
  > p {
    margin-top: 20px;
  }
  .error {
    color: red;
  }
`;

class LoginConfirm extends Component {
  state = {
    redirection: null,
    error: null
  }
  componentDidMount() {
    this.finishLogin();
  }
  activeRedirection() {
    const params = new URLSearchParams(this.props.location.search);
    this.setState({redirection: params.get('next')});
  }
  finishLogin() {
    if (!auth.isSignInWithEmailLink(window.location.href)) {
      console.log('this url is not valid for login with email link');
      return;
    }
    let email = window.localStorage.getItem('tempLoginEmail');
    if (!email) {
      email = window.prompt('Por favor, vuelve a introducir tu email');
    }
    auth.signInWithEmailLink(email, window.location.href)
    .then(() => {
      window.localStorage.removeItem('tempLoginEmail');
      this.activeRedirection();
    })
    .catch((err) => {
      console.error(err);
      this.setState({error: err})
    })
  }
  render() {
    return this.state.redirection ? (
      <Redirect to={this.state.redirection} />
    ) : (
      <LoginConfirmStyle className="container">
        <header>
          <span role="img" aria-label="sparkle">✨</span>
          <Icon icon="mail" />
          <span role="img" aria-label="sparkle">✨</span>          
        </header>
        <p><em>Iniciando sesi&oacute;n...</em></p>
        <p className="error">{this.state.error}</p>
      </LoginConfirmStyle>
    )
  }
}

export default LoginConfirm;