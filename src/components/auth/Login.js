import React, {Component} from 'react';
import { db, auth } from '../../firebase';
import styled from 'styled-components';
import Button from '../Button';
import FormGroup from '../FormGroup';
import Icon from '../Icon';

const LoginStyle = styled.div`
  padding: 8px;
  max-width: 400px;
  h2 {
    text-align: center;
  }
  form {
    button {
      margin-left: 0;
    }
  }
  .mail-sent {
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    opacity: 0.8;
    header {
      font-size: 20px;
      margin-bottom: 6px;
    }
    .material-icons {
      margin: 0 2px;
    }
  }
  .spin {
    animation: spin 2s infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

class Login extends Component {
  state = {
    email: '',
    error: null,
    mailSent: false,
    loading: false
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
    this.setState({loading: true});
    this.checkWhitelist(this.state.email)
    .then(() => {
      this.sendSignInMail();
    })
    .catch(err => {
      this.setState({loading: false, error: err.message})
    })
  }

  sendSignInMail() {
    const {protocol, host} = window.location;
    const redirection = this.props.location.state || {next: '/'};
    const config = {
      url: `${protocol}//${host}/login_confirm?next=${redirection.next}`,
      handleCodeInApp: true
    };
    auth.sendSignInLinkToEmail(this.state.email, config)
    .then(() => {
      window.localStorage.setItem('tempLoginEmail', this.state.email);
      this.setState({loading: false, mailSent: true})
    })
    .catch(err => {
      console.error(err);
      this.setState({loading: false, error: err.message});
    })
  }

  render() {
    const {email, mailSent, error, loading} = this.state;
    const mailDomain = email.replace(/^.+@/, '');

    return (
      <LoginStyle className="container">
        <h2>Bienvenido</h2>
        {mailSent ? (
          <div className="mail-sent">
            <header>
              <span role="img" aria-label="sparkle">✨</span>
              <Icon icon="mail" />
              <span role="img" aria-label="sparkle">✨</span>          
            </header>
            <p>
              Se ha enviado un enlace a tu correo.
              <br />
              Pulsalo para iniciar sesión.
            </p>
            <a href={`http://${mailDomain}`}>
              <Button>Abrir {mailDomain}</Button>
            </a>
          </div>
        ) : (
          <form onSubmit={ev => this.checkMail(ev)}>
            <FormGroup error={!!error} style={{marginBottom: 10}}>
              <label htmlFor="email">Introduce tu email para continuar</label>
              <input type="email" name="email" required
                placeholder="Email"
                value={email}
                onChange={ev => this.setState({email: ev.target.value})} />
              <div className="error">{error}</div>
            </FormGroup>
            <Button type="submit" disabled={loading} main>
              {loading ? (
                <span>
                  Cargando...
                  <Icon icon="autorenew" className="spin" />
                </span>
              ) : 'Continuar'}
            </Button>
          </form>
        )}
      </LoginStyle>
    )
  }

}

export default Login;

