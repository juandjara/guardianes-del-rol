import React, {Component} from 'react';
import { auth } from '../firebase';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo-guardianes.png';
import withAuth from './withAuth'
import Button from './Button';
import Icon from './Icon';

const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;
  h1 {
    font-weight: normal;
    margin: 8px 0;
    white-space: nowrap;
    font-size: 28px;
    img {
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
    img {
      border-radius: 50%;
      border: 2px solid #c0392b;
      height: 60px;
      vertical-align: middle;
      margin: 0 8px;
    }
  }
  .small-nav {
    flex-grow: 1;
    position: relative;
    .toggle {
      display: block;
      margin: 0 auto;
      margin-bottom: 8px;
    }
    nav {
      position: absolute;
      top: 100%;
      width: 100%;
      background: #f2f2f2;
      display: none;
      border-top: 1px solid #ccc;
      padding: 8px;
      a, button {
        display: block;
      }
      &.open {
        display: block;
      }
      .logout {
        padding-left: 12px;
        button {
          display: inline-block;
        }
      }
    }
  }
  @media (max-width: 600px) {
    .big-nav {
      display: none;
    }
  }
  @media (min-width: 600px) {
    .small-nav {
      display: none;
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
    return (
      <HeaderStyle className="App-header">
        <h1>
          <img src={logo} className="App-logo" alt="logo" />
          Guardianes Role Master
        </h1>
        {user && (<nav className="big-nav">
          <Link activeClassName="active" to="/post">
            Partidas
          </Link>
          <Link activeClassName="active" to="/category">
            Categorias
          </Link>
          <Link activeClassName="active" to="/gallery">
            Galer&iacute;a
          </Link>
          <Button onClick={() => auth.signOut()}>
            <Icon icon="person_outline" size="1em" />
            Cerrar sesion
          </Button>
          <img src={user && user.photoURL} alt="user avatar" />
        </nav>)}
        {user && (
          <div className="small-nav">
            <Button onClick={() => this.toggle()} className="toggle">Men&uacute;</Button>
            <nav className={this.state.open ? 'open' : ''}>
              <Link activeClassName="active" to="/post">
                <Icon icon="insert_drive_file" size="1em" />
                Partidas
              </Link>
              <Link activeClassName="active" to="/category">
                <Icon icon="label" size="1em" />
                Categorias
              </Link>
              <Link activeClassName="active" to="/gallery">
                <Icon icon="photo" size="1em" />
                Galer&iacute;a
              </Link>
              <div className="logout">
                <span>{user.email}</span>
                <Button onClick={() => auth.signOut()}>Cerrar sesion</Button>
              </div>
            </nav>
          </div>
        )}
      </HeaderStyle>
    );
  }
}

export default withAuth(Header);
