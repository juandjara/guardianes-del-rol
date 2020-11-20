import React, { Component } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';
import UserDisplay from '../UserDisplay';
import ImgContainer from '../ImgContainer';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format } from 'date-fns';
import Helmet from 'react-helmet';
import Select from 'react-select';
import withContext from '../../contextService';
import { themeOptions } from '../../theme';

const PostListStyle = styled.div`
  padding: 10px;
  > h2 {
    text-align: center;
    font-size: 32px;
    margin-top: 16px;
    margin-bottom: 32px;
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
      > button {
        margin-left: 0;
      }
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
      width: 150px;
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
  .week-selector {
    display: flex;
    align-items: center;
    p {
      flex-grow: 1;
      text-align: center;
    }
    button {
      flex: 0 0 auto;
      background: transparent;
      border: none;
      &:hover {
        background: #efefef;
      }
    }
    .material-icons {
      margin: 0;
    }
  }
  .section-selector {
    margin-top: 32px;
    margin-bottom: 16px;
    > label {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
    }
  }

  .nodata {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 1rem;
    font-size: 14px;
    color: #666;
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
      padding-left: 12px;
      p, .user-wrapper {
        font-size: 14px;
        line-height: 18px;
        margin-top: 12px;
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
  state = {
    loading: true,
    posts: [],
    search: '',
    startDate: null,
    endDate: null
  }

  componentDidMount() {
    const dayFromUrl = this.props.day;
    const date = dayFromUrl ? new Date(dayFromUrl) : new Date();
    const startDate = startOfWeek(date, {weekStartsOn: 1});
    const endDate = endOfWeek(date, {weekStartsOn: 1});
    this.setState({startDate, endDate});
    this.fetchPosts();
  }

  componentWillUnmount() {
    if (typeof this.unsubscriber === 'function') {
      this.unsubscriber();
    }
  }

  fetchPosts() {
    this.unsubscriber = db.collection('posts')
    .orderBy('date', 'desc')
    .onSnapshot(snapshot => {
      const posts = snapshot.docs.map(
        docRef => ({...docRef.data(), id: docRef.id})
      )
      this.setState({loading: false, posts})
    })
  }

  filterPrevWeek() {
    const startDate = subWeeks(this.state.startDate, 1);
    const endDate = subWeeks(this.state.endDate, 1);
    const themeStr = this.props.theme ? `&theme=${this.props.theme}` : ''
    this.props.history.push(`/post?day=${endDate.toJSON().split('T')[0]}${themeStr}`);
    this.setState({startDate, endDate});
  }

  filterNextWeek() {
    const startDate = addWeeks(this.state.startDate, 1);
    const endDate = addWeeks(this.state.endDate, 1);
    const themeStr = this.props.theme ? `&theme=${this.props.theme}` : ''
    this.props.history.push(`/post?day=${endDate.toJSON().split('T')[0]}${themeStr}`);
    this.setState({startDate, endDate});
  }

  checkSearch(post, search) {
    const title = post.title.toLowerCase();
    const game = post.game.toLowerCase();
    const match = title.indexOf(search) !== -1 || game.indexOf(search) !== -1;
    return match;
  }

  checkDate(post) {
    const {startDate, endDate} = this.state;
    const date = Number(new Date(post.date));
    return date <= endDate && date >= startDate;
  }

  checkTheme(post) {
    const theme = this.props.theme;
    if (theme === 'all') {
      return true;
    }
    return (post.section || 'guardianes_rol') === theme;
  }

  renderPost(post) {
    const section = (themeOptions.find(opt => opt.value === post.section) || {label: 'Guardianes del Rol'}).label;
    return (
      <PostDetails key={post.id}>
        <div>
          <Link style={{flex: '1 1 auto'}} to={`/post/${post.id}`}>
            <ImgContainer role="img" 
              aria-label="imagen de portada"
              className="main-img"
              min={230}
              src={post.mainImageUrl} />
          </Link>
          <div className="info">
            <p>
              <strong>Lugar:</strong>
              <br /> {post.place}
            </p>
            <p>
              <strong>Fecha:</strong> 
              <br /> {post.date} {post.hour}
            </p>
            <p>
              <strong>Sección:</strong>
              <br /> {section}
            </p>
            <div className="user-wrapper">
              <strong>Narrador:</strong> 
              <UserDisplay email={post.narrator.email}
                displayName={post.narrator.displayName}
                photoURL={post.narrator.photoURL} />
            </div>
            <p>
              <strong>Plazas:</strong>
              {' '}{post.fullSeats} / {post.totalSeats}
            </p>
          </div>
        </div>
        <Link className="title" to={`/post/${post.id}`}>
          <small>{post.game || ''}</small>
          {post.title || '(Sin título)'}
        </Link>
      </PostDetails>
    )
  }

  render() {
    const search = this.state.search.toLowerCase();
    const startDate = format(this.state.startDate, 'DD/MM');
    const endDate = format(this.state.endDate, 'DD/MM'); 
    const posts = this.state.posts.filter(post => {
      const searchMatch = this.checkSearch(post, search);
      const dateMatch = this.checkDate(post);
      const themeMatch = this.checkTheme(post);
      return search ? searchMatch : (dateMatch && themeMatch);
    });
    const {theme, setTheme} = this.props;
    return (
      <PostListStyle className="container">
        <Helmet>
          <title>Guardianes del Rol</title>
        </Helmet>
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
        <div className="section-selector">
          <label>Sección:</label>
          <Select
            isSearchable={false}
            value={themeOptions.find(opt => opt.value === theme)}
            onChange={ev => setTheme(ev.value)}
            options={themeOptions}
          />
        </div>
        <div className="week-selector">
          <Button onClick={() => this.filterPrevWeek()}><Icon icon="arrow_left" /></Button>
          <p>Semana {startDate} - {endDate}</p>
          <Button onClick={() => this.filterNextWeek()}><Icon icon="arrow_right" /></Button>
        </div>
        {posts.length === 0 && (
          <p className="nodata">No hay partidas esta semana</p>
        )}
        {this.state.loading ? 'Cargando...' : (
          <ul>{posts.map(post => this.renderPost(post))}</ul>
        )}
      </PostListStyle>
    )
  }
}

export default withContext(PostList);
