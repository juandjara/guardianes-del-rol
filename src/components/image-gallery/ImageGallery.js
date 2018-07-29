import React, {Component} from 'react';
import { storage, db } from '../../firebase';
import styled from 'styled-components';
import Button from '../Button';
import ImageGrid from './ImageGrid';
import slugg from 'slugg';
import Icon from '../Icon';

const GalleryStyle = styled.div`
  padding: 10px;
  > h2 {
    text-align: center;
    font-size: 32px;
  }
  > button {
    display: block;
    margin-bottom: 12px;
    .material-icons {
      margin-right: 4px;
      margin-bottom: 2px;
    }
  }
  [type=file] {
    display: none;
  }
`;

const ModalStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.2);
  padding: 16px;
  .content {
    max-width: 768px;
    margin: 0px auto;
    background: white;
    border-radius: 4px;
    .actions {
      border-bottom: 1px solid #eaeaea;
    }
    .close-modal {
      display: block;
      margin: 0;
      margin-left: auto;
      padding: 4px;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid transparent;
      border-left: 1px solid transparent;
      &:hover {
        border-color: #ccc;
      }
    }
    img {
      display: block;
      margin-bottom: 20px;
      max-width: 100%;
    }
    .inner {
      padding: 1em;
      padding-top: 0.5em;
      max-height: calc(100vh - 100px);
      overflow: auto;
      br + p, p:first-child {
        margin-top: 8px;
        margin-bottom: 4px;
      }
    }
  }
`;

class ImageGallery extends Component {
  state = {
    images: [],
    selectedImage: null,
    loading: true
  }
  _inputNode = null;

  componentDidMount() {
    this.fetchImages();
  }
  fetchImages() {
    db.collection('images').get()
    .then(ref => ref.docs.map(doc => doc.data()).filter(doc => doc.name))
    .then(docs => {
      this.setState({images: docs, loading: false})
    })
  }

  parseFileEvent(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.uploadFile(file, reader.result);
      }, false)
      reader.readAsDataURL(file);
    });
  }

  uploadFile(file, previewUrl) {
    const now = Date.now();
    const name = `${now}_${slugg(file.name)}`;
    const metadata = {contentType: file.type}
    const uploadTask = storage.child(name).put(file, metadata);
    const image = {
      name,
      type: file.type,
      progress: 0,
      state: 'running',
      downloadUrl: null,
      size: null,
      uploadTask,
      uploadDate: now,
      previewUrl
    }
    this.setState(state => ({
      ...state,
      images: state.images.concat(image)
    }))
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        image.progress = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        image.state = snapshot.state;
        image.size = snapshot.totalBytes;
        this.setState(state => ({
          ...state,
          images: state.images.map((_img) => {
            return _img.name === image.name ? image : _img;
          })
        }))
      },
      (err) => {
        console.error(`error uploading image`, err);
        window.alert('Algo ha fallado :c');
        this.setState(state => ({
          ...state,
          images: state.images.filter(_img => _img.name !== image.name)
        }))
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL()
        .then(url => {
          console.log('file availble at: ', url);
          image.downloadUrl = url;
          db.collection('images').doc(image.name).set({
            name: image.name,
            type: image.type,
            size: image.size,
            downloadUrl: url,
            uploadDate: image.uploadDate
          })
          this.setState(state => ({
            ...state,
            images: state.images.map((_img) => {
              return _img.name === image.name ? image : _img;
            })
          }))
        })
      }
    )
  }

  deleteImage(image, ev) {
    ev.stopPropagation();
    if(!window.confirm('¿Estas seguro de que quieres borrar esta imagen?')) {
      return;
    }
    Promise.all([
      db.collection('images').doc(image.name).delete(),
      storage.child(image.name).delete()
    ]).then(() => {
      this.fetchImages();
    }).catch(err => {
      console.error('Error deleting image ', image, err);
      window.alert('Algo ha fallado :c');
    })
  }

  openDetails(image) {
    window.addEventListener('keyup', this.closeDetails);
    this.setState({selectedImage: {
      name: image.name,
      type: image.type.replace('image/', '').toUpperCase(),
      size: this.parseByteSize(image.size),
      date: new Date(image.uploadDate).toLocaleDateString(),
      url: image.downloadUrl
    }});
  }

  closeDetails = () => {
    window.removeEventListener('keyup', this.closeDetails);
    this.setState({selectedImage: null})
  }

  parseByteSize(bytes) {
    if (bytes > (1024 * 1024)) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    if (bytes > 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;      
    }
    return `${bytes} bytes`
  }

  render() {
    const {selectedImage, images, loading} = this.state;
    return (
      <GalleryStyle className="container">
        <h2>Galer&iacute;a de im&aacute;genes</h2>
        <Button onClick={() => this._inputNode && this._inputNode.click()}>
          <Icon icon="cloud_upload" size={16} />
          Subir imagen
        </Button>
        <input 
          type="file" 
          accept="image/jpeg,image/png,image/gif"
          onChange={ev => this.parseFileEvent(ev.target.files)}
          ref={node => { this._inputNode = node; }} />
        {loading ? 'Cargando...' : (
          <ImageGrid 
            onClick={img => this.openDetails(img)}
            onDelete={(img, ev) => this.deleteImage(img, ev)} 
            images={images} />
        )}
        {selectedImage ? (
          <ModalStyle onClick={() => this.closeDetails()}>
            <div className="content">
              <div className="actions">
                <Button 
                  onClick={() => this.closeDetails()}
                  className="close-modal"
                  title="Cerrar" 
                >
                  <Icon icon="close" size={20} />
                </Button>
              </div>
              <div className="inner">
                <img src={selectedImage.url} alt={selectedImage.name} />
                <p><strong>Nombre</strong></p>
                <p>{selectedImage.name}</p>
                <br/>
                <p><strong>Formato</strong></p>
                <p>{selectedImage.type}</p>
                <br/>
                <p><strong>Tamaño</strong></p>
                <p>{selectedImage.size}</p>
                <br/>
                <p><strong>Fecha de subida</strong></p>
                <p>{selectedImage.date}</p>
                <br/>
              </div>
            </div>
          </ModalStyle>
        ) : null}
      </GalleryStyle>
    );
  }
}
 
export default ImageGallery;