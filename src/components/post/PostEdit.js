import React, { Component, Fragment } from 'react';
import Editor from './Editor';
import styled from 'styled-components';
import Button from '../Button';
import { db } from '../../firebase';
import slug from 'slugg';
import Icon from '../Icon';
import Modal from 'react-awesome-modal';
import ImageGallery from '../image-gallery/ImageGallery';
import FormGroup from '../FormGroup';
import { Link } from 'react-router-dom';
import UserDisplay from '../UserDisplay';

const EditStyle = styled.div`
  padding: 20px 14px;
  .ql-container, .ql-editor {
    border-radius: 0 0 4px 4px;
  }
  .ql-editor {
    background: white;
    min-height: 150px;
  }
  .back-btn {
    margin: 0;
  }
  > h2 {
    text-align: center;
    font-size: 30px;
  }
  > nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .material-icons {
    margin-right: 4px;
    margin-bottom: 2px;
  }
  .btn-gallery {
    margin: 0;
  }
  .selected-image {
    margin-top: 8px;
    max-height: 150px;
    display: block;
  }
  .save-btn {
    margin-left: 0;
  }
  .player {
    padding: 4px 0;
    font-size: 16px;
    .material-icons {
      color: red;
      margin: 0;
      margin-left: 8px;
      cursor: pointer;
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
    }
    &.disabled {
      opacity: 0.5;
    }
  }
`;

class PostEdit extends Component {
  unsubscriber = null;  
  state = {
    playersLoading: false,
    loading: true,
    showImageGallery: false,
    post: {
      id: null,
      title: '',
      narrator: null,
      date: '',
      hour: '',
      description: { ops: [] },
      mainImageUrl: null,
      totalSeats: 0,
      fullSeats: 0,
      players: []
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === 'new') {
      this.setState({loading: false})
    } else {
      this.fetchPost(id);
    }
  }
  
  componentWillUnmount() {
    if (typeof this.unsubscriber === 'function') {
      this.unsubscriber();
    }
  }

  fetchPost(id) {
    this.unsubscriber = db.collection('posts').doc(id)
    .onSnapshot(ref => {
      if (!ref.exists) {
        this.setState({loading: false})
        console.log('this document does not exists')
        return;
      }
      const data = ref.data();
      this.setState({
        loading: false,
        post: {
          ...data,
          id: ref.id,
          description: JSON.parse(data.description || 'null')
        }
      })
    })
  }

  save() {
    const id = this.state.post.id;
    const user = this.props.user;
    const post = {
      ...this.state.post,
      description: JSON.stringify(this.state.post.description),
      slug: slug(this.state.post.title),
      narrator: {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    }
    const promise = id ? this.update(id, post) : this.create(post);
    promise.then(() => {
      this.props.history.push('/post');
    }).catch(err => {
      console.error('error creating post ', err);
      window.alert('Algo ha fallado :c')
    });
  }

  create(post) {
    const coll = db.collection('posts');
    const newId = coll.doc().id;
    return coll.add({
      ...post,
      id: newId
    })
  }

  update(id, post) {
    return db.collection('posts')
    .doc(id).update(post)
  }

  delete() {
    if(!window.confirm('¿Estas seguro de que quieres borrar esta partida?')) {
      return;
    }
    const id = this.state.post.id;
    db.collection('posts').doc(id).delete()
    .then(() => {
      this.props.history.push('/post');
    }).catch(err => {
      console.error('error deleting post ', err);
      window.alert('Algo ha fallado :c')
    });
  }

  goBack() {
    this.props.history.goBack();
  }

  edit(key, value) {
    this.setState(state => ({
      post: {
        ...state.post,
        [key]: value
      }
    }))
  }

  selectImage(img) {
    this.setState(state => ({
      post: {
        ...state.post,
        mainImageUrl: img.downloadUrl
      },
      showImageGallery: false
    }))
  }

  removePlayer(user) {
    const msg = '¿Estas seguro de que quieres eliminar a este jugador de la partida?';
    if (!window.confirm(msg)) {
      return;
    }
    const {id, players, fullSeats} = this.state.post;
    const newPlayers = players.filter(
      u => u.email !== user.email
    );
    this.setState({playersLoading: true});
    db.collection('posts').doc(id)
    .update({
      fullSeats: fullSeats - 1,
      players: newPlayers
    })
    .then(() => {
      this.setState({playersLoading: false});
    })
    .catch(() => {
      this.setState({playersLoading: false});
      window.alert('Algo ha fallado :c');
    }) 
  }

  render() {
    const post = this.state.post;
    const user = this.props.user;
    const canEdit = post.id && post.narrator ? post.narrator.email === user.email : true;
    return !canEdit ? (<h2>Acceso denegado</h2>) : (
      <EditStyle className="container">
        <nav>
          <Button className="back-btn" onClick={() => this.goBack()}>
            <Icon icon="arrow_back" size="1em" />
            Volver
          </Button>
          {/* {post.id ? (
            <Link to={`/post/${post.id}`}>
              <Icon icon="public" size="1em" />
              Ver publicaci&oacute;n
            </Link>
          ) : null} */}
        </nav>
        <h2>{post.id ? 'Editar' : 'Nueva'} partida</h2>
        {this.state.loading ? 'Cargando...' : (
          <Fragment>
            <FormGroup>
              <label htmlFor="title">T&iacute;tulo</label>
              <input type="text" 
                value={post.title}
                onChange={ev => this.edit('title', ev.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="game">Juego</label>
              <input type="text" 
                value={post.game}
                onChange={ev => this.edit('game', ev.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="date">Fecha</label>
              <input type="date" name="date"
                placeholder="YYYY-MM-DD"
                value={post.date}
                onChange={ev => this.edit('date', ev.target.value)} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="hour">Hora</label>
              <input type="text" name="hour"
                placeholder="HH:MM"
                value={post.hour}
                onChange={ev => this.edit('hour', ev.target.value)} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="narrator">Narrador</label>
              <UserDisplay email={user.email} 
                photoURL={user.photoURL} 
                displayName={user.displayName} />
            </FormGroup>
            <FormGroup>
              <label>Descripci&oacute;n</label>
              <Editor
                value={post.description}
                onChange={value => this.edit('description', value)}
              />
            </FormGroup>
            <FormGroup>
              <label>Imagen de portada</label>
              <Button 
                className="btn-gallery"
                onClick={() => this.setState({showImageGallery: true})}>
                <Icon icon="photo_library" size="1em" />
                Abrir galer&iacute;a
              </Button>
              <Button 
                title="Este botón elimina la imagen de la partida pero no la elimina de la galeria"
                onClick={() => this.edit('mainImageUrl', null)}>
                <Icon icon="close" size="1em" />
                Limpiar imagen
              </Button>
              {post.mainImageUrl && (
                <img 
                  src={post.mainImageUrl}
                  alt="imagen seleccionada"
                  className="selected-image" />
              )}
              <Modal 
                visible={this.state.showImageGallery}
                onClickAway={() => this.setState({showImageGallery: false})}>
                <ImageGallery onClick={img => this.selectImage(img)} />
              </Modal>
            </FormGroup>
            <FormGroup>
              <label htmlFor="totalSeats">Plazas totales</label>
              <input type="number" name="totalSeats"
                value={post.totalSeats}
                onChange={ev => this.edit('totalSeats', Number(ev.target.value))} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="fullSeats">Plazas ocupadas</label>
              <input type="number" name="fullSeats"
                value={post.fullSeats}
                onChange={ev => this.edit('fullSeats', Number(ev.target.value))} />
            </FormGroup>
            <FormGroup>
              <label>Jugadores</label>
              {post.players.length === 0 ? 
                <p style={{padding: '4px 0'}}>
                  Sin jugadores
                </p> : 
                post.players.map(user => (
                  <p key={user.email} className={`player ${this.state.playersLoading && 'loading'}`}>
                    <span>{user.displayName}</span>
                    <Icon onClick={() => this.removePlayer(user)} 
                      icon="close" size="1em" />
                  </p>
                ))
              }
            </FormGroup>
            <Button main className="save-btn" onClick={() => this.save()}>
              <Icon icon="publish" size="1em" />
              Publicar {post.id && 'cambios'}
            </Button>
            {post.id && (
              <Button onClick={() => this.delete()}>
                <Icon icon="close" size="1em" />
                Borrar partida
              </Button>
            )}
          </Fragment>
        )}
      </EditStyle>
    )
  }
}

export default PostEdit;
