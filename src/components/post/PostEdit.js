import React, { Component, Fragment } from 'react';
import Editor from './Editor';
import styled from 'styled-components';
import Button from '../Button';
import { db } from '../../firebase';

const EditStyle = styled.div`
  padding: 20px 10px;
  .ql-container, .ql-editor {
    border-radius: 0 0 4px 4px;
  }
  .ql-editor {
    background: white;
    min-height: 150px;
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
    const promise = id ? this.update(id) : this.create();
    promise.then(() => {
      this.props.history.push('/post');
    }).catch(err => {
      console.error('error creating post ', err);
      window.alert('Algo ha fallado :c')
    });
  }

  create() {
    const coll = db.collection('posts');
    const newId = coll.doc().id;
    return coll.add({
      ...this.state.post,
      description: JSON.stringify(this.state.post.description),
      id: newId
    })
  }

  update(id) {
    return db.collection('posts')
    .doc(id).update({
      ...this.state.post,
      description: JSON.stringify(this.state.post.description)
    })
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
    return (
      <EditStyle className="container">
        <Button onClick={() => this.goBack()}>Volver</Button>
        <h2>Nueva partida</h2>
        {this.state.loading ? 'Cargando...' : (
          <Fragment>
            <div className="form-group">
              <label htmlFor="title">T&iacute;tulo</label>
              <input type="text" 
                value={this.state.post.title}
                onChange={ev => this.edit('title', ev.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input type="date" name="date"
                value={this.state.post.date}
                onChange={ev => this.edit('date', ev.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="hour">Hora</label>
              <input type="text" name="hour"
                placeholder="HH:MM"
                value={this.state.post.hour}
                onChange={ev => this.edit('hour', ev.target.value)} />
            </div>
            <div className="form-group">
              <label>Descripci&oacute;n</label>
              <Editor
                value={this.state.post.description}
                onChange={value => this.edit('description', value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="totalSeats">Plazas totales</label>
              <input type="number"
                value={this.state.post.totalSeats}
                onChange={ev => this.edit('totalSeats', ev.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="fullSeats">Plazas ocupadas</label>
              <input type="number" name="fullSeats"
                value={this.state.post.fullSeats}
                onChange={ev => this.edit('fullSeats', ev.target.value)} />
            </div>
            <Button onClick={() => this.save()}>Guardar</Button>
            <Button onClick={() => this.delete()}>Borrar</Button>
          </Fragment>
        )}
      </EditStyle>
    )
  }
}

export default PostEdit;
