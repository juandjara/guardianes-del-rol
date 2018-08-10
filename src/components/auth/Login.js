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
    error: null,
    useRedirection: false
  }

  googleLogin() {
    loginWithGoogle()
    .then(() => {
      this.setState({useRedirection: true})
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
    return db.collection('users')
    .doc(email)
    .get()
    .then(ref => {
      if (!ref.exists) {
        const err = new Error(`El email ${email} no está en la lista de invitados`);
        return Promise.reject(err);
      }
    })
  }

  checkMail(ev) {
    ev.preventDefault();
    this.checkWhitelist(this.state.email)
    .then(() => {
      window.alert('all right')
      // send login link
      // show indication for login link
    })
    .catch(err => {
      this.setState({error: err.message})
    })
  }

  render() {
    const {useRedirection, email, error} = this.state;
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
        <form onSubmit={ev => this.checkMail(ev)}>
          <FormGroup error={!!error} style={{marginBottom: 10}}>
            <label htmlFor="email">Introduce tu email para continuar</label>
            <input type="email" name="email" required
              placeholder="Email"
              value={email}
              onChange={ev => this.setState({email: ev.target.value})} />
            <div className="error">{error}</div>
          </FormGroup>
          <Button type="submit" main>Continuar</Button>
        </form>
      </LoginStyle>
    )
  }

}

export default Login;

