import React, { Component, Fragment } from 'react';
import Editor from './Editor';
import styled from 'styled-components';
import Button from '../Button';
import { db } from '../../firebase';
import slug from 'slugg';
import Icon from '../Icon';

const EditStyle = styled.div`
  padding: 20px 14px;
  border-radius: 4px;
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
  .form-group {
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
    }
    label {
      font-size: smaller;
      display: block;
      margin-bottom: 4px;
    }
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
`;

class PostEdit extends Component {
  state = {
    loading: true,
    post: {
      id: null,
      title: '',
      description: { ops: [] },
      date: '',
      hour: '',
      totalSeats: 0,
      fullSeats: 0
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === 'new') {
      this.setState({loading: false})
      return;
    }
    db.collection('posts').doc(id).get()
    .then(docRef => {
      if (!docRef.exists) {
        this.setState({loading: false})
        console.log('this document does not exists')
        return;
      }
      const data = docRef.data();
      this.setState({
        loading: false,
        post: {
          ...data,
          id: docRef.id,
          description: JSON.parse(data.description || 'null')
        }
      })
    })
  }

  save() {
    const id = this.state.post.id;
    const post = {
      ...this.state.post,
      description: JSON.stringify(this.state.post.description),
      slug: slug(this.state.post.title)
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

  render() {
    const post = this.state.post;
    return (
      <EditStyle className="container">
        <nav>
          <Button className="back-btn" onClick={() => this.goBack()}>
            <Icon icon="arrow_back" size="1em" />
            Volver
          </Button>
          {post.id ? (
            <a href={`https://guardianes.now.sh/post/${post.slug}`}>
              <Icon icon="public" size="1em" />
              Ver publicaci&oacute;n
            </a>
          ) : null}
        </nav>
        <h2>Editar partida</h2>
        {this.state.loading ? 'Cargando...' : (
          <Fragment>
            <div className="form-group">
              <label htmlFor="title">T&iacute;tulo</label>
              <input type="text" 
                value={post.title}
                onChange={ev => this.edit('title', ev.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input type="date" name="date"
                placeholder="YYYY-MM-DD"
                value={post.date}
                onChange={ev => this.edit('date', ev.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="hour">Hora</label>
              <input type="text" name="hour"
                placeholder="HH:MM"
                value={post.hour}
                onChange={ev => this.edit('hour', ev.target.value)} />
            </div>
            <div className="form-group">
              <label>Descripci&oacute;n</label>
              <Editor
                value={post.description}
                onChange={value => this.edit('description', value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="totalSeats">Plazas totales</label>
              <input type="number"
                value={post.totalSeats}
                onChange={ev => this.edit('totalSeats', ev.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="fullSeats">Plazas ocupadas</label>
              <input type="number" name="fullSeats"
                value={post.fullSeats}
                onChange={ev => this.edit('fullSeats', ev.target.value)} />
            </div>
            <Button onClick={() => this.save()}>
              <Icon icon="publish" size="1em" />
              Publicar
            </Button>
            <Button onClick={() => this.delete()}>
              <Icon icon="close" size="1em" />
              Borrar
            </Button>
          </Fragment>
        )}
      </EditStyle>
    )
  }
}

export default PostEdit;
