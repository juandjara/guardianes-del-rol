import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';
import FormGroup from '../FormGroup';

const ProfileStyle = styled.div`
  padding: 16px;
  h2 {
    text-align: center;
  }
  .material-icons {
    margin-right: 4px;
    margin-bottom: 2px;
  }
  .radio {
    display: inline-block;
    margin-top: 8px;
    margin-bottom: 4px;
    margin-right: 1em;
    label {
      display: inline-block;
      margin-left: 6px;
    }
    input {
      margin: 0;
      padding: 0;
      width: auto;
      display: inline-block;
    }
  }
`;

class Profile extends Component {
  goBack() {
    this.props.history.goBack();
  }
  render() {
    return (
      <ProfileStyle className="container">
        <Button className="back-btn" onClick={() => this.goBack()}>
          <Icon icon="arrow_back" size="1em" />
          Volver
        </Button>
        <h2>Cuenta</h2>       
        <FormGroup>
          <label htmlFor="name">Nombre</label>
          <div className="radio">
            <input type="radio" id="useGoogleName" />
            <label htmlFor="useGoogleName">Por defecto de google</label>
          </div>
          <div className="radio">
            <input type="radio" id="useCustomName" />
            <label htmlFor="useCustomName">Personalizado</label>
          </div>
          <input type="text" id="name" value="nombre" />
        </FormGroup>
        <FormGroup>
          <label htmlFor="">Avatar</label>
          <input type="radio"/>
          <input type="radio"/>
        </FormGroup>
      </ProfileStyle>
    );
  }
}

export default Profile;