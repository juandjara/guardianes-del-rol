import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';
import FormGroup from '../FormGroup';
import { db, storage } from '../../firebase';
import defaultAvatar from '../../assets/default-avatar-black.svg';
import slugg from 'slugg';
import UserDisplay from '../UserDisplay';

const ProfileStyle = styled.div`
  padding: 16px;
  font-size: 14px;
  button {
    margin-left: 0;
  }
  .back-btn {
    margin: 0;
  }
  h2 {
    margin-top: 6px;
    text-align: center;
  }
  .material-icons {
    margin-right: 4px;
    margin-bottom: 2px;
  }
  .radio {
    display: inline-block;
    margin-top: 8px;
    margin-bottom: 4px;
    margin-right: 1em;
    label {
      display: inline-block;
      margin-left: 6px;
    }
    input {
      margin: 0;
      padding: 0;
      width: auto;
      display: inline-block;
    }
  }
  .avatar {
    display: block;
    height: 100px;
  }
`;

class Profile extends Component {
  fileInputNode = null;
  state = {
    loading: false,
    name: this.props.user.displayName || '',
    avatar: this.props.user.photoURL || defaultAvatar,
    avatarFile: null
  }
  goBack() {
    this.props.history.goBack();
  }
  save(ev) {
    ev.preventDefault();
    this.setState({loading: true})

    const oldAvatarRef = this.props.user.avatarRef;
    let avatarRef = null;
    let promise = Promise.resolve();
    if (this.state.avatarFile) {
      const file = this.state.avatarFile;
      const now = Date.now();
      const metadata = {contentType: file.type}
      avatarRef = `profiles/${now}_${slugg(file.name)}`;
      promise = storage.child(avatarRef).put(file, metadata)
      .then(snapshot => snapshot.ref.getDownloadURL())
    } else if (oldAvatarRef) {
      promise = storage.child(oldAvatarRef).delete()
    }

    promise.then(url => {
      return db.collection('users')
      .doc(this.props.user.email)
      .update({
        avatarRef,
        photoURL: url || null,
        displayName: this.state.name
      })
    })
    .then(() => {
      this.setState({loading: false});
      window.alert('Guardado con exito');
    })
    .catch(err => {
      this.setState({loading: false});
      console.error('update error', err);
      window.alert('Algo ha fallado :c');
    })
  }
  parseFiles(files) {
    const file = files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({avatarFile: file, avatar: reader.result});
    }, false)
    reader.readAsDataURL(file);
  }
  openFileInput() {
    if (this.fileInputNode) {
      this.fileInputNode.click();
    }
  }
  resetAvatar() {
    this.setState({
      avatar: defaultAvatar,
      avatarFile: null
    })
  }
  render() {
    const {loading, name, avatar} = this.state;
    const email = this.props.user.email;
    return (
      <ProfileStyle className="container">
        <Button className="back-btn" onClick={() => this.goBack()}>
          <Icon icon="arrow_back" size="1em" />
          Volver
        </Button>
        <h2>Cuenta</h2>
        <div className="preview">
          Asi te ver&aacute;n otros usuarios:
          <UserDisplay email={email} photoURL={avatar} displayName={name} />
        </div>   
        <form onSubmit={ev => this.save(ev)}>
          <FormGroup>
            <label htmlFor="name">
              Nombre
              <span style={{color: '#666', marginLeft: 4}}>
                (si se deja en blanco se usara el email)
              </span>
            </label>
            <input type="text" id="name"
              placeholder=""
              value={this.state.name}
              onChange={ev => this.setState({name: ev.target.value})} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="avatar">Avatar</label>
            <input type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={ev => this.parseFiles(ev.target.files)}
              ref={node => { this.fileInputNode = node; }} />
            <img 
              src={this.state.avatar}
              alt="imagen seleccionada"
              className="avatar" />
            <Button type="button" onClick={() => this.openFileInput()}>
              <Icon icon="cloud_upload" size="1em" />
              Subir imagen
            </Button>
            {this.state.avatar !== defaultAvatar && (
              <Button type="button" onClick={() => this.resetAvatar()}>
                <Icon icon="close" size="1em" />
                Descartar imagen
              </Button>
            )}
          </FormGroup>
          <Button type="submit" disabled={loading} main>
            {loading ? (
              <span>
                Guardando...
                <Icon icon="autorenew" className="spin" />
              </span>
            ) : 'Guardar'}
          </Button>
        </form>
      </ProfileStyle>
    );
  }
}

export default Profile;