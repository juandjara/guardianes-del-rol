import styled from 'styled-components';

const ImgContainer = styled.div`
  overflow: hidden;
  min-height: ${props => props.min || 200}px;
  background-color: white;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${props => props.src}');
`;

export default ImgContainer;
