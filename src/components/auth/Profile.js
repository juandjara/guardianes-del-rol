import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';
import FormGroup from '../FormGroup';
import { db } from '../../firebase';

const ProfileStyle = styled.div`
  padding: 16px;
  .back-btn {
    margin: 0;
  }
  h2 {
    margin-top: 6px;
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
  state = {
    name: ''
  }
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
          <input type="text" id="name"
            value={this.state.name}
            onChange={ev => this.setState({name: ev.target.value})} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="avatar">Avatar</label>
        </FormGroup>
      </ProfileStyle>
    );
  }
}

export default Profile;