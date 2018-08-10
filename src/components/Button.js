import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  padding: 6px;
  margin: 4px;
  background: ${props => props.main ? 'dodgerblue' : 'white'};
  color: ${props => props.main ? 'white' : '#191919'};
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  &:hover {
    border-color: ${props => props.main ? 'deepskyblue' : '#191919'};
  }
  &:focus {
    background: ${props => props.main ? 'deepskyblue' : '#f4f4f4'};
  }
  ${props => props.disabled ? `
    opacity: 0.5;
    pointer-events: none;
  ` : ''}
`;

export default Button;
