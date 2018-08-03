import React, {Component} from 'react';
import { auth } from '../firebase';
import styled from 'styled-components';
import logo from '../assets/logo-guardianes.png';
import withAuth from './withAuth'
import Button from './Button';
import Icon from './Icon';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';


const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: firebrick;
  color: #fafafa;
  h1 {
    font-weight: normal;
    margin: 8px 0;
    white-space: nowrap;
    font-size: 28px;
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
      border: 2px solid #c0392b;
      height: 60px;
      vertical-align: middle;
      margin: 0 8px;
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

class Header extends Component {
  state = { open: false }
  toggle() {
    this.setState(state => ({open: !state.open}));
  }
  render() {
    const user = this.props.user;
    const menu = user && (
      <Menu onSelect={() => {}}>
        <p style={{margin: 10}} subMenuKey="email">{user.email}</p>
        <Button
          onClick={() => auth.signOut()}
          style={{marginLeft: 'auto', display: 'block'}} 
          subMenuKey="close">
          <Icon icon="person_outline" size="1em" style={{marginRight: 4}} />
          Cerrar sesion
        </Button>
      </Menu>
    );
    return (
      <HeaderStyle className="App-header">
        <h1>
          <img src={logo} className="logo" alt="logo" />
          Guardianes del Rol
        </h1>
        {user && (<nav className="big-nav">
          <Dropdown
            animation="slide-up" 
            overlay={menu}>
            <img className="avatar" src={user.photoURL} alt="avatar" />
          </Dropdown>
        </nav>)}
      </HeaderStyle>
    );
  }
}

export default withAuth(Header);
