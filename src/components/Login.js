import React, {Component} from 'react';
import { loginWithGoogle } from '../firebase';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';

const LoginStyle = styled.div`
  text-align: center;
  h2 {
    font-weight: 500;
  }
`;

class Login extends Component {
  login() {
    loginWithGoogle()
    .then(res => {
      this.props.history.push('/')
    })
    .catch(err => {
      console.error(
        'Login error with code',
        err.code,
        'and message',
        err.message
      )
    })
  }
  render() {
    return (
      <LoginStyle>
        <h2>Login</h2>
        <Button onClick={() => this.login()}>
          With Google
        </Button>
      </LoginStyle>
    )
  }
}

export default withRouter(Login);

