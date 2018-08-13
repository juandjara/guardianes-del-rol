import React, {Component} from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';

const PostDisplayStyle = styled.div`
  padding: 14px 0;
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
  }
  h2 {
    text-align: center;
    font-size: 24px;
    flex: 1 1 auto;
    margin: 24px 12px;
  }
  .details {
    p {
      margin: 10px;
    }
  }
`;

const ImgContainer = styled.div`
  overflow: hidden;
  min-height: 200px;
  background-color: white;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${props => props.src}');
`;

class PostDisplay extends Component {
  unsubscriber = null;
  state = {
    loading: true,
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
      this.setState({
        loading: false,
        post: {
          ...data,
          description: JSON.parse(data.description || 'null')
        }
      })
    })
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const {post, loading} = this.state;
    return (loading || !post) ? (
      <p style={{textAlign: 'center', margin: '1em'}}>Cargando partida</p>
    ) : (
      <PostDisplayStyle className="container">
        <nav>
          <Button className="back-btn" onClick={() => this.goBack()}>
            <Icon icon="arrow_back" size="1em" />
            Volver
          </Button>
          <div className="flex-space"></div>
          <Link to={`/post/${post.id}/edit`}>
            <Button>
              <Icon icon="edit" size="1em" />
              Editar
            </Button>
          </Link>
          <Button main style={{marginLeft: 6}}>
            <Icon icon="group_add" size="1em" />
            Apuntarme
          </Button>
        </nav>
        <h2>{post.title}</h2>
        <ImgContainer src={post.mainImageUrl} role="img" />
        <div className="details">
          <p>
            <strong>Fecha:</strong>  
            {' '}{post.date} {post.hour}
          </p>
          <p>
            <strong>Narrador:</strong> 
            {' '}{post.narrator}
          </p>
          <p>
            <strong>Plazas:</strong>
            {' '}{post.fullSeats} / {post.totalSeats}
          </p>
        </div>
      </PostDisplayStyle>
    );
  }
}

export default PostDisplay;
