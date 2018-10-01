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
  .material-icons {
    margin-right: 4px;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    > a {
      display: block;
      font-size: 12px;
      .material-icons {
        margin-bottom: 2px;
      }
    }
    .search-box {
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #eee;
      background: white;
      input {
        background: transparent;
        border: none;
        font-size: 14px;
        width: 110px;
        outline: none;
        &::placeholder {
          color: #888;
        }
      }
      .material-icons {
        margin: 0;
        font-size: 20px;
      }
    }
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
  state = {loading: true, posts: [], search: ''}
  componentDidMount() {
    this.unsubscriber = db.collection('posts')
    .orderBy('date', 'desc')
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
    const search = this.state.search.toLowerCase();
    const posts = this.state.posts.filter(post => {
      const title = post.title.toLowerCase();
      const game = post.game.toLowerCase();
      const match = title.indexOf(search) !== -1 || game.indexOf(search) !== -1;
      return search ? match : true;
    });
    return (
      <PostListStyle className="container">
        <h2>Partidas</h2>
        <div className="toolbar">
          <Link to="/post/new/edit">
            <Button>
              <Icon icon="create" size="1em" />
              Nueva partida
            </Button>
          </Link>
          <div className="search-box">
            <input 
              type="text"
              onChange={ev => this.setState({search: ev.target.value})}
              placeholder="Buscar partidas" />
            <Icon icon="search" />
          </div>
        </div>
        {this.state.loading ? 'Cargando...' : (
          <ul>
            {posts.map(post => (
              <PostDetails key={post.id}>
                <div>
                  <Link style={{flex: '1 1 auto'}} to={`/post/${post.id}`}>
                    <ImgContainer role="img" 
                      aria-label="imagen de portada"
                      className="main-img"
                      min={150}
                      src={post.mainImageUrl} />
                  </Link>
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
