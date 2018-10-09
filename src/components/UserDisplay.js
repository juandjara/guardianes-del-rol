import React from 'react';
import styled from 'styled-components';
import defaultAvatar from '../assets/default-avatar-black.svg'

const UserStyle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 14px;
  background: #f2f2f7;
  border-radius: 4px;
  > img {
    flex: 0 0 auto;
    height: 40px;
    width: 40px;
    margin: 4px;
    border-radius: 50%;
  }
  > span {
    margin: 0 8px;
  }
`;

const UserDisplay = ({photoURL, email, displayName}) => (
  <UserStyle>
    <img src={photoURL || defaultAvatar} alt="avatar" />
    <span>{displayName || email}</span>
  </UserStyle>
)

export default UserDisplay;
