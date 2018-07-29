import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  padding: 6px;
  margin: 4px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  &:hover {
    border-color: black;
  }
  &:focus {
    background: #f4f4f4;
  }
`;

export default Button;
