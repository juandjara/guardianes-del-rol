import React, {Component} from 'react';
import { loginWithGoogle, db } from '../../firebase';
import styled from 'styled-components';
import Button from '../Button';
import FormGroup from '../FormGroup';
import { Redirect } from 'react-router-dom';

const LoginStyle = styled.div`
  padding: 8px;
  max-width: 400px;
  h2 {
    text-align: center;
  }
  button {
    margin-left: 0;
  }
`;

class Login extends Component {
  state = {
    email: '',
    useRedirection: false
  }

  googleLogin() {
    loginWithGoogle()
    .then(() => {
      this.setState({useRedirection: true})
      //this.props.history.push('/')
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

  checkWhitelist(email) {
    db.collection('users')
    .doc(email)
    .get()
    .then(ref => {
      if (!ref.exists) {
        return Promise.reject(`El email ${email} no está en la lista de invitados`);
      }
    })
  }

  render() {
    const useRedirection = this.state.useRedirection;
    const redirection = this.props.location.state || {next: {pathname: '/'}};
    if (useRedirection) {
      return <Redirect to={redirection.next} />
    }

    return (
      <LoginStyle className="container">
        <h2>Bienvenido</h2>
        <Button onClick={() => this.googleLogin()}>
          Google Login
        </Button>
        <form>
          <FormGroup style={{marginBottom: 10}}>
            <label htmlFor="email">Introduce tu email para continuar</label>
            <input type="email" name="email" placeholder="Email" />
          </FormGroup>
          <Button type="submit" main>Continuar</Button>
        </form>
      </LoginStyle>
    )
  }

}

export default Login;

