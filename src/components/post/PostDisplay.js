import React, {Component} from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';
import UserDisplay from '../UserDisplay';
import ImgContainer from '../ImgContainer';
import { Quill } from 'react-quill/dist/index';
import Helmet from 'react-helmet';

const PostDisplayStyle = styled.div`
  padding: 10px 0;
  font-size: 14px;
  .material-icons {
    margin-right: 4px;
    margin-bottom: 2px;
  }
  nav {
    padding: 0 10px;
    display: flex;
    align-items: center;
    button {
      flex: 0 0 auto;
      margin: 0;
    }
    .flex-space {
      flex: 1 1 auto;
    }
    + p {
      margin-top: 24px;
    }
  }
  > p {
    margin-top: 16px;
  }
  h2 {
    text-align: center;
    font-size: 24px;
    flex: 1 1 auto;
    margin: 8px 12px 24px 12px;
  }
  .details {
    margin-top: 24px;
    > p, .user-wrapper {
      margin: 8px;
      line-height: 20px;
    }
  }
  .description {
    font-size: 14px;
    line-height: 20px;
    margin: 12px 0;
    > strong {
      margin-left: 10px;
    }
    .inner {
      padding: 8px;
      p {
        margin: 0;
      }
      img {
        max-width: 100%;
      }
    }
  }
`;

class PostDisplay extends Component {
  unsubscriber = null;
  state = {
    loading: true,
    joinLoading: false,
    post: null
  }

  componentDidMount() {
    this.fetchPost();
  }

  componentWillUnmount() {
    if (typeof this.unsubscriber === 'function') {
      this.unsubscriber();
    }
  }

  fetchPost() {
    const id = this.props.match.params.id;
    this.unsubscriber = db.collection('posts').doc(id)
    .onSnapshot(snapshot => {
      if (!snapshot.exists) {
        this.setState({loading: false, post: {}});
        return;
      }
      const data = snapshot.data();
      const description = JSON.parse(data.description || '[]');
      const tempDiv = document.createElement('div');
      (new Quill(tempDiv)).setContents(description);
      const node = tempDiv.getElementsByClassName('ql-editor')[0];
      Array.from(node.getElementsByClassName('quill-plugin-image-upload-placeholder'))
      .forEach(el => {el.className = ''});
      const html = node.innerHTML;
      const text = node.textContent;
      
      this.setState({
        loading: false,
        description_plain: text,
        post: {
          ...data,
          id: snapshot.id,
          description: html
        }
      })
    })
  }

  join() {
    const {id, players, fullSeats} = this.state.post;
    const {email, displayName} = this.props.user;
    const newPlayers = [
      ...players,
      {email, displayName}
    ];
    this.setState({joinLoading: true});
    db.collection('posts').doc(id)
    .update({
      fullSeats: fullSeats + 1,
      players: newPlayers
    })
    .then(() => {
      this.setState({joinLoading: false});
    })
    .catch(err => {
      this.setState({joinLoading: false});
      window.alert('Algo ha fallado :c');
      console.error(err);
    })
  }

  leave() {
    const {id, players, fullSeats} = this.state.post;
    const newPlayers = players.filter(
      u => u.email !== this.props.user.email
    );
    this.setState({joinLoading: true});
    db.collection('posts').doc(id)
    .update({
      fullSeats: fullSeats - 1,
      players: newPlayers
    })
    .then(() => {
      this.setState({joinLoading: false});
    })
    .catch(() => {
      this.setState({joinLoading: false});
      window.alert('Algo ha fallado :c');
    }) 
  }

  render() {
    const {post, loading} = this.state;
    const user = this.props.user;
    const canEdit = post && post.narrator.email === user.email;
    const players = post && post.players.map(u => u.displayName || u.email).join(', ');
    const hasJoined = post && post.players.find(u => u.email === user.email);
    return (loading || !post) ? (
      <p style={{textAlign: 'center', margin: '1em'}}>Cargando partida</p>
    ) : (
      <PostDisplayStyle className="container">
        {post.title && (
          <Helmet>
            <title>{post.title} | Guardianes del Rol</title>
          </Helmet>
        )}
        <nav>
          <Link to={`/post?day=${post.date}`}>
            <Button className="back-btn">
              <Icon icon="arrow_back" size="1em" />
              Volver
            </Button>
          </Link>
          <div className="flex-space"></div>
          {canEdit && (<Link to={`/post/${post.id}/edit`}>
            <Button>
              <Icon icon="edit" size="1em" />
              Editar
            </Button>
          </Link>)}
          {hasJoined ? (
            <Button 
              disabled={this.state.joinLoading} 
              style={{marginLeft: 6}}
              onClick={() => this.leave()}>
              <Icon icon="person_add_disabled" size="1em" />
              Abandonar
            </Button>
          ) : (
            <Button main 
              disabled={this.state.joinLoading} 
              style={{marginLeft: 6}}
              onClick={() => this.join()}>
              <Icon icon="group_add" size="1em" />
              Apuntarme
            </Button>
          )}
        </nav>
        <p style={{textAlign: 'center'}}>{post.game}</p>
        <h2>{post.title}</h2>
        <ImgContainer src={post.mainImageUrl} role="img" aria-label="imagen de portada" />
        <div className="details">
          <div className="user-wrapper">
            <strong>Narrador:</strong> 
            <UserDisplay email={post.narrator.email}
              displayName={post.narrator.displayName}
              photoURL={post.narrator.photoURL} />
          </div>
          <p>
            <strong>Plazas: </strong>
            {post.fullSeats} / {post.totalSeats}
          </p>
          <p>
            <strong>Lugar: </strong>
            {post.place}
          </p>
          <p>
            <strong>Fecha: </strong>  
            {post.date} {post.hour}
          </p>
          <p>
            <strong>Jugadores: </strong>
            {players}
          </p>
          <div className="description">
            <div className="inner" dangerouslySetInnerHTML={{__html: this.state.post.description}}></div>
          </div>
        </div>
      </PostDisplayStyle>
    );
  }
}

export default PostDisplay;
