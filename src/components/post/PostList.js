import React, { Component } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';
import UserDisplay from '../UserDisplay';
import ImgContainer from '../ImgContainer';

const PostListStyle = styled.div`
  padding: 10px;
  > h2 {
    text-align: center;
    font-size: 32px;
    margin: 16px;
  }
  > a {
    display: block;
    margin-bottom: 10px;
    font-size: 12px;
    .material-icons {
      margin-bottom: 2px;
    }
  }
  .material-icons {
    margin-right: 4px;
  }
`;

const PostDetails = styled.li`
  margin-top: 8px;
  padding: 8px 4px;
  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-bottom: 12px; 
    .main-img {
      flex: 1 1 auto;
    }
    .info {
      flex: 1 0 0%;
      padding: 0 12px;
      p, .user-wrapper {
        font-size: 14px;
        line-height: 18px;
        margin-top: .5em;
      }
      @media (min-width: 600px) {
        flex-basis: auto;
      }
    }
  }
  .title {
    small {
      display: block;
      color: #222;
      padding-bottom: 4px;
    }
  }
`;

class PostList extends Component {
  unsubscriber = null;  
  state = {loading: true, posts: []}
  componentDidMount() {
    this.unsubscriber = db.collection('posts')
    .onSnapshot(snapshot => {
      const posts = snapshot.docs.map(
        docRef => ({...docRef.data(), id: docRef.id})
      )
      this.setState({loading: false, posts})
    })
  }

  componentWillUnmount() {
    if (typeof this.unsubscriber === 'function') {
      this.unsubscriber();
    }
  }

  render() {
    return (
      <PostListStyle className="container">
        <h2>Partidas</h2>
        <Link to="/post/new/edit">
          <Button>
            <Icon icon="create" size="1em" />
            Nueva partida
          </Button>
        </Link>
        {this.state.loading ? 'Cargando...' : (
          <ul>
            {this.state.posts.map(post => (
              <PostDetails key={post.id}>
                <div>
                  <ImgContainer role="img" 
                    aria-label="imagen de portada"
                    className="main-img"
                    min={150}
                    src={post.mainImageUrl} />
                  <div className="info">
                    <p>
                      <strong>Plazas:</strong>
                      {' '}{post.fullSeats} / {post.totalSeats}
                    </p>
                    <p>
                      <strong>Fecha:</strong> 
                      <br /> {post.date} {post.hour}
                    </p>
                    <div className="user-wrapper">
                      <strong>Narrador:</strong> 
                      <UserDisplay email={post.narrator.email}
                        displayName={post.narrator.displayName}
                        photoURL={post.narrator.photoURL} />
                    </div>
                  </div>
                </div>
                <Link className="title" to={`/post/${post.id}`}>
                  <small>{post.game || ''}</small>
                  {post.title || '(Sin título)'}
                </Link>
              </PostDetails>
            ))}
          </ul>
        )}
      </PostListStyle>
    )
  }
}

export default PostList;
