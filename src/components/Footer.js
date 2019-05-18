import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from './Button';

const PrivacyLinkContainer = styled.footer`
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-top-left-radius: 4px;
  padding: 0 12px;
  line-height: 24px;
  font-size: 12px;
`;
const CookieWindow = styled.div`
  color: black;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-top-right-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  max-width: 600px;
  z-index: 2;
  a {
    flex-shrink: 0;
  }
  button {
    margin-left: 12px;
  }
  ${props => props.good ? 'display: none' : ''}
`;

function Footer() {
  const [cookieOk, setCookieOk] = useState(localStorage.getItem('likesCookies'));
  function setCookieGood() {
    localStorage.setItem('likesCookies', true);
    setCookieOk(true);
  }
  return (
    <footer>
      <CookieWindow good={cookieOk}>
        <p>
          Este sitio usa cookies <span aria-label="Cookie Emoji" role="img">🍪</span> para guardar las preferencias de los usuarios y mantener la sesión iniciada.
        </p>
        <Link to="/privacy">Saber más</Link>
        <Button onClick={() => { setCookieGood() }}>Aceptar</Button>
      </CookieWindow>
      <PrivacyLinkContainer>
        <Link to="/privacy">RGPD y Politica de privacidad</Link>
      </PrivacyLinkContainer>
    </footer>
  );
}


export default Footer;