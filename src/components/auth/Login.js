import React, {Component, Fragment} from 'react';
import { auth } from '../../firebase';
import styled from 'styled-components';
import Button from '../Button';
import FormGroup from '../FormGroup';
import Icon from '../Icon';
import withContext from '../../contextService';
import {Redirect} from 'react-router-dom';

const LoginStyle = styled.div`
  padding: 8px;
  max-width: 400px;
  h2 {
    text-align: center;
  }
  form button, .back-btn {
    margin-left: 0;
  }
  .material-icons {
    margin-bottom: 2px;
    margin-right: 4px;
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
  .login-choose {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    button {
      margin-bottom: 12px;
    }
  }
`;

class Login extends Component {
  state = {
    email: '',
    username: '',
    error: null,
    mailSent: false,
    loading: false,
    loginForm: null
  }

  checkMail() {
    this.setState({loading: true});
    this.sendSignInMail();
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

  anonLogin() {
    const username = this.state.username || window.prompt('Elige un nombre de usuario');
    if (!username) {
      return;
    }
    localStorage.setItem('anonUsername', username);
    auth.signInAnonymously()
    .then(() => {
      this.props.history.push('/');
    })
    .catch(err => {
      console.error('anon login err: ', err);
      window.alert('Algo ha fallado :C');
    });
  }

  renderWithMailSent () {
    const mailDomain = this.state.email.replace(/^.+@/, '');
    return (
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
    )
  }

  renderAnonLogin () {
    const {username, error} = this.state;
    return (
      <Fragment>
        <FormGroup error={!!error} style={{marginBottom: 10}}>
          <label htmlFor="username">Elige un nombre de usuario</label>
          <input type="username" name="username" required
            placeholder="Nombre de usuario"
            value={username}
            onChange={ev => this.setState({username: ev.target.value})} />
        </FormGroup>
        <Button type="submit" main onClick={() => this.anonLogin()}>
          Entrar como invitado
        </Button> 
      </Fragment>
    )
  }

  renderMailLogin () {
    const {email, error, loading} = this.state;
    return (
      <Fragment>
        <FormGroup error={!!error} style={{marginBottom: 10}}>
          <label htmlFor="email">Introduce tu email para continuar</label>
          <input type="email" name="email" required
            placeholder="Email"
            value={email}
            onChange={ev => this.setState({email: ev.target.value})} />
          <div className="error">{error}</div>
        </FormGroup>
        <Button type="submit" disabled={loading} main onClick={() => this.checkMail()}>
          {loading ? (
            <span>
              Cargando...
              <Icon icon="autorenew" className="spin" />
            </span>
          ) : 'Continuar'}
        </Button>
      </Fragment>
    )
  }

  renderLoginForm (loginForm) {
    switch (loginForm) {
      case 'email':
        return (
          <form onSubmit={(ev) => ev.preventDefault()}>
            {this.renderMailLogin()}
          </form>
        )
      case 'anon':
        return (
          <form onSubmit={(ev) => ev.preventDefault()}>
            {this.renderAnonLogin()}
          </form>
        )
      default:
        return null
    }
  }

  render() {
    // const {mailSent, loginForm} = this.state;
    const mailSent = this.state.mailSent;
    const loginForm = 'email'
    const redirection = this.props.location.state || {next: '/'};
    const user = this.props.user;
    
    return user 
      ? <Redirect to={redirection.next} />
      : (
        <LoginStyle className="container">
          <h2>Bienvenido</h2>
          {mailSent
            ? this.renderWithMailSent()
            : (
              <Fragment>
                {loginForm 
                  ? (
                    <div>
                      <Button className="back-btn" onClick={() => this.setState({ loginForm: null })}>
                        <Icon icon="arrow_back" size="1em" />
                        Volver
                      </Button>
                      {this.renderLoginForm(loginForm)}
                    </div>
                  )
                  : (
                    <div className="login-choose">
                      <Button onClick={() => { this.setState({ loginForm: 'email' }) }}>
                        <Icon icon="email" size="1em" />
                        Entrar con tu correo
                      </Button>
                      <Button onClick={() => { this.setState({ loginForm: 'anon' }) }}>
                        <Icon icon="person_outline" size="1em" />
                        Entrar como invitado
                      </Button>
                    </div>
                  )
                }
                <p style={{marginTop: 16, fontSize: 14, fontWeight: 300}}>
                  Si tienes cualquier duda con el proceso de iniciar sesión puedes mandar un correo a <a href="mailto:guardianesdelrol@gmail.com">guardianesdelrol@gmail.com</a>
                </p>
              </Fragment>
            )
          }
        </LoginStyle>
      )
  }

}

export default withContext(Login);

