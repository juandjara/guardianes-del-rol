import React, {Component} from 'react';
import { storage, db } from '../../firebase';
import styled from 'styled-components';
import Button from '../Button';
import ImageGrid from './ImageGrid';
import slugg from 'slugg';
import Icon from '../Icon';

const GalleryStyle = styled.div`
  padding: 10px;
  margin: 0 auto;
  > h2 {
    text-align: center;
    font-size: 28px;
    margin: 10px;
  }
  > h3 {
    font-size: 14px;
    text-align: center;
    color: #808080;
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

class ImageGallery extends Component {
  state = {
    images: [],
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

  selectImage(image) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(image);
    }
  }

  render() {
    const {images, loading} = this.state;
    return (
      <GalleryStyle className="container">
        <h2>Galer&iacute;a de im&aacute;genes</h2>
        <h3>Por favor, seleccione o suba una imagen</h3>
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
            images={images}  
            onClick={img => this.selectImage(img)}
            onDelete={(img, ev) => this.deleteImage(img, ev)} 
            showDelete />
        )}
      </GalleryStyle>
    );
  }
}
 
export default ImageGallery;