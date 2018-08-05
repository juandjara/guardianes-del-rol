import React, {Component} from 'react';
import { auth } from '../firebase';
import styled from 'styled-components';
import logo from '../assets/logo-guardianes.png';
import withAuth from './withAuth'
import Button from './Button';
import Icon from './Icon';
import { Link } from 'react-router-dom';

const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #c0392b;
  color: #fafafa;
  h1 {
    font-weight: normal;
    margin: 4px 0;
    white-space: nowrap;
    font-size: 28px;
    color: #fafafa;
    .logo {
      height: 60px;
      vertical-align: middle;
      margin: 0 8px;
    }
  }
  .material-icons {
    margin-bottom: 4px;
    margin-right: 6px;
  }
  nav {
    position: relative;
    a {
      padding: 6px 8px;
      margin: 0 4px;
      color: #414141;
      font-weight: 500;
      &.active {
        font-weight: 600;
        color: rgb(181, 0, 35);
      }
    }
    .avatar {
      border-radius: 50%;
      height: 60px;
      vertical-align: middle;
      padding: 0 8px;
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 20px;
      .logo {
        height: 50px;
      }
    }
    nav .avatar {
      height: 50px;
    }
  }
`;

const MenuStyle = styled.div`
  display: ${props => props.open ? 'block': 'none'};
  position: absolute;
  top: 100%;
  right: 0;
  text-align: right;
  color: #191919;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  margin: 4px;
  margin-top: 8px;
`;

class Header extends Component {
  state = { open: false }
  toggle() {
    this.setState(state => ({open: !state.open}));
  }
  render() {
    const user = this.props.user;
    return (
      <HeaderStyle className="App-header">
        <Link to="/">
          <h1>
            <img src={logo} className="logo" alt="logo" />
            Guardianes del Rol
          </h1>
        </Link>
        {user && (<nav className="big-nav">
          <img 
            onClick={() => this.setState(state => ({open: !state.open}))}
            className="avatar" 
            src={user.photoURL} 
            alt="avatar" />
          <MenuStyle open={this.state.open}>
            <p style={{margin: 10}}>{user.email}</p>
            <Button
              onClick={() => auth.signOut()}
              style={{marginLeft: 'auto', display: 'block'}}>
              <Icon icon="person_outline" size="1em" style={{marginRight: 4}} />
              Cerrar sesion
            </Button>
          </MenuStyle>
        </nav>)}
      </HeaderStyle>
    );
  }
}

export default withAuth(Header);
