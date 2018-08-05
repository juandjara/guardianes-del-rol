import React from 'react';
import styled from 'styled-components';
import Button from '../Button';

const GridStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
  .column {
    flex: 25%;
    max-width: 50%;
    padding: 0 4px;
    .img-container {
      margin-top: 8px;
      vertical-align: middle;
      width: 100%;
      background: white;
      position: relative;
      transition: transform 0.2s;
      cursor: pointer;
      &:hover, 
      &:focus, 
      &:focus-within {
        transform: scale(1.05);
      }
      img {
        width: 100%;
        height: auto;
        color: transparent;
      }
      .progress {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        span {
          display: inline-block;
          margin-top: 6px;
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 1px;
        }
      }
      .actions {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity 0.2s;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0, 0.1);
        button {
          display: block;
          margin-left: auto;
          font-size: 8px;
          padding: 0;
          height: 24px;
          width: 24px;
          .material-icons {
            font-size: 16px;
            margin: 0;
          }
        }
      }
      &.loading {
        img {
          opacity: 0.2;
        }
      }
      &:not(.loading):hover,
      &:not(.loading):focus,
      &:not(.loading):focus-within {
        .actions {
          opacity: 1;
        }
      }
    }
    @media screen and (max-width: 800px)  {
      flex: 50%;
      max-width: 50%;
    }
    @media screen and (max-width: 600px) {
      flex: 100%;
      max-width: 100%;
      .img-container:not(.loading) {
        .actions {
          opacity: 1;
          background-color: transparent;
          transform: none;
        }
      }
    }
  }
`;

const ImageGrid = ({images, showDelete, onDelete, onClick}) => {
  const maxColumns = Math.ceil(images.length / 4);
  const columns = [
    images.slice(0, maxColumns),
    images.slice(maxColumns, maxColumns * 2),
    images.slice(maxColumns * 2, maxColumns * 3),
    images.slice(maxColumns * 3)
  ].filter(col => col.length > 0);
  return (
    <GridStyle>
      {columns.map((images, index) => (
        <div key={index} className="column">
          {images.map(img => {
            const isLoading = !img.downloadUrl;
            const src = img.downloadUrl || img.previewUrl;
            return (
              <div 
                tabIndex={0}
                onClick={() => onClick(img)}
                className={`img-container ${isLoading ? 'loading' : ''}`}
                key={img.name}>
                <img src={src} alt={img.name} />
                {isLoading ? (
                  <div className="progress">
                    <small>Subiendo...</small>
                    <br/>
                    <span>{img.progress}%</span>
                  </div>
                ) : (
                  <div className="actions">
                    {showDelete ? (
                      <Button 
                        onClick={(ev) => onDelete(img, ev)}
                        title="Borrar imagen" >
                        <i className="material-icons">close</i>
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </GridStyle>
  );
}

export default ImageGrid;
