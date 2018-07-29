import React from 'react';
import {Link} from 'react-router-dom'
import styled from 'styled-components';

const NotFoundStyle = styled.div`
  text-align: center;
  margin-top: 30px;
  h2 {
    font-weight: 500;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
`;

const NotFound = () => (
  <NotFoundStyle>
    <p>Error <em>404</em></p>
    <h2>Aqu&iacute; no hay nada</h2>
    <Link to="/">Volver</Link>
  </NotFoundStyle>
)

export default NotFound;
