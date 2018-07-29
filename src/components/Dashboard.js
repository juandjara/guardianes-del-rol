import React from 'react';
import styled from 'styled-components';

const DashboardStyle = styled.div`
  text-align: center;
  .count {
    text-align: right;
    display: flex;
    justify-content: center;
    > div {
      font-size: 20px;
      padding: 12px;
      margin: 8px;
      border: 1px solid #e6e6e6;
      border-radius: 6px;
      color: #808080;
      min-width: 120px;
      > p {
        color: #191919;
        font-size: 48px;
        font-weight: 300;
      }
      & + div {
        margin-left: 40px;
      }
    }
  }
`;

export default () => (
  <DashboardStyle>
    <h2>Dashboard</h2>
    <div className="count">
      <div>
        <p>0</p>
        posts
      </div>
      <div>
        <p>0</p>
        categories
      </div>
    </div>
  </DashboardStyle>
)
