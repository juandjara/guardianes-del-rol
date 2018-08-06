import React, { Component } from 'react';
import styled from 'styled-components';

const ProfileStyle = styled.div``;

class Profile extends Component {
  render() {
    return (
      <ProfileStyle className="container">
        <p>perfil de usuario</p>
      </ProfileStyle>
    );
  }
}

export default Profile;