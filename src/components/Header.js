import React, {Component} from 'react';
import { auth } from '../firebase';
import styled from 'styled-components';
import logo from '../assets/logo-guardianes.png';
import withAuth from './auth/withAuth'
import Button from './Button';
import Icon from './Icon';
import { Link } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.svg';

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
      height: 52px;
      vertical-align: middle;
      margin: 4px 8px;
    }
  }
  .material-icons {
    margin-bottom: 4px;
    margin-right: 6px;
  }
  nav {
    position: relative;
    .avatar {
      border-radius: 50%;
      height: 52px;
      vertical-align: middle;
      margin: 4px 8px;
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 20px;
    }
  }
`;

const MenuStyle = styled.div`
  display: ${props => props.open ? 'block': 'none'};
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 140px;
  text-align: right;
  color: #191919;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  margin: 4px;
  margin-top: 8px;
  .item {
    margin: 4px;
    padding: 6px;
    display: block;
  }
  button.item {
    margin-left: auto;
    background: transparent;
    border: none;
    &:hover, &:focus {
      color: #666;
    }
  }
`;

class Header extends Component {
  state = { open: false }
  toggle() {
    this.setState(state => ({open: !state.open}));
  }
  render() {
    const user = this.props.user;
    const username = user && (user.customName || user.displayName);
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
            src={user.photoURL || defaultAvatar} 
            alt="avatar" />
          <MenuStyle open={this.state.open}>
            <p style={{whiteSpace: 'nowrap', margin: 10}}>{username}</p>
            <Link className="item" to="/profile">Cuenta</Link>
            <Button
              className="item"
              onClick={() => auth.signOut()}>
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
