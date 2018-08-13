import React, { Component } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';

const PostListStyle = styled.div`
  padding: 10px;
  > h2 {
    text-align: center;
    font-size: 32px;
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
  padding: 8px;
  > div {
    display: flex;
    align-items: flex-end;
    margin-bottom: 12px; 
  }
  img {
    margin-right: 12px;
    max-width: 150px;
  }
  p {
    font-size: 14px;
    line-height: 16px;
    margin-top: .5em;
  }
`;

class PostList extends Component {
  state = {loading: true, posts: []}
  componentDidMount() {
    db.collection('posts').get()
    .then(ref => {
      const docs = ref.docs.map(
        docRef => ({...docRef.data(), id: docRef.id})
      )
      return docs;
    })
    .then(posts => {
      this.setState({loading: false, posts})
      console.log('posts: ', posts)
    })
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
                  <img src={post.mainImageUrl} alt="Imagen de portada" />
                  <div>
                    <p>
                      <strong>Fecha:</strong> 
                      <br /> {post.date} {post.hour}
                    </p>
                    <p>
                      <strong>Narrador:</strong> 
                      <br /> {post.narrator}
                    </p>
                    <p>
                      <strong>Plazas:</strong>
                      {' '}{post.fullSeats} / {post.totalSeats}
                    </p>
                  </div>
                </div>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </PostDetails>
            ))}
          </ul>
        )}
      </PostListStyle>
    )
  }
}

export default PostList;
