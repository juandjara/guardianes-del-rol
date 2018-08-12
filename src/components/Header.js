import React, {Component} from 'react';
import { auth } from '../firebase';
import styled from 'styled-components';
import logo from '../assets/logo-guardianes.png';
import withAuth from './auth/withAuth'
import Button from './Button';
import Icon from './Icon';
import { Link } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar-white.svg';

const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #c0392b;
  color: #fafafa;
  h1 {
    font-weight: normal;
    margin: 0;
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
      cursor: pointer;
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

const DialogStyle = styled.div`
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
  margin: 8px;
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
  .name {
    white-space: nowrap;
    margin-top: 6px;
    margin-bottom: 12px;
    padding: 4px 10px;
    border-bottom: 1px solid #ccc;
  }
`;

class Header extends Component {
  dialogNode = null;
  state = { open: false }
  openDropdown() {
    this.setState({open: true})
    window.addEventListener('click', this.closeDropdown);
  }
  closeDropdown = (ev) => {
    if (
      this.dialogNode && 
      this.dialogNode.contains(ev.target)
    ) {
      return;
    } 
    this.setState({open: false})
    window.removeEventListener('click', this.closeDropdown)
  }
  render() {
    const user = this.props.user;
    const username = user && (user.displayName || user.email);
    return (
      <HeaderStyle className="App-header">
        <Link to="/">
          <h1>
            <img src={logo} className="logo" alt="logo" />
            Guardianes del Rol
          </h1>
        </Link>
        {user && (<nav ref={node => {this.dialogNode = node}}>
          <img 
            onClick={() => this.openDropdown()}
            src={user.photoURL || defaultAvatar} 
            className="avatar" 
            alt="avatar" />
          <DialogStyle open={this.state.open}>
            <p className="name">{username}</p>
            <Link className="item" to="/profile">Cuenta</Link>
            <Button
              className="item"
              onClick={() => auth.signOut()}>
              <Icon icon="person_outline" size="1em" style={{marginRight: 4}} />
              Cerrar sesion
            </Button>
          </DialogStyle>
        </nav>)}
      </HeaderStyle>
    );
  }
}

export default withAuth(Header);
