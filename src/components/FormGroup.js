import styled from 'styled-components';

const FormGroup = styled.div`
  margin-top: 1em;
  margin-bottom: 2em;
  input {
    display: block;
    width: 100%;
    padding: 6px 8px;
    font-size: 1em;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    &:focus {
      border-color: dodgerblue;
    }
    &[type=file] {
      display: none;
    }
    &[readonly] {
      opacity: 0.5;
      border-color: #ccc;
    }
  }
  label {
    font-size: smaller;
    display: block;
    margin-bottom: 4px;
  }
`;

export default FormGroup;
