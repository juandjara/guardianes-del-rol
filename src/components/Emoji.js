import React from 'react';
import styled from 'styled-components';

const EmojiStyle = styled.span`
  color: transparent;
  text-shadow: 0 0 ${props => props.color};
`;

const Emoji = ({color = 'black', label, children}) => (
  <EmojiStyle role="img" aria-label={label} color={color}>
    {children}
  </EmojiStyle>
)

export default Emoji;
