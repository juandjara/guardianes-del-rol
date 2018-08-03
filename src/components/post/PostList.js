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
  ul {
    li {
      margin: 8px;
    }
  }
  .material-icons {
    margin-right: 4px;
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
        <Link to="/post/new">
          <Button>
            <Icon icon="create" size="1em" />
            Nueva partida
          </Button>
        </Link>
        {this.state.loading ? 'Cargando...' : (
          <ul>
            {this.state.posts.map(post => (
              <li key={post.id}>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </PostListStyle>
    )
  }
}

export default PostList;
