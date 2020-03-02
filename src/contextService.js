import React, {createContext, Component} from 'react';
import { auth, db } from './firebase';
import { getInitialTheme } from './theme';

const initialContext = {
  day: new URLSearchParams(window.location.search).get('day'),
  theme: getInitialTheme(),
  user: null,
  loadingAuth: true
};
const Context = createContext({...initialContext});

export class ContextProvider extends Component {
  
  unsubcriber = null;
  state = {
    ...initialContext,
    setTheme: (theme) => {
      this.setState({theme});
    }
  }

  componentDidMount() {
    this.listenAuth();
  }

  componentWillUnmount() {
    if (this.unsubcriber) {
      this.unsubcriber();
    }
  }

  listenAuth() {
    this.unsubcriber = auth.onAuthStateChanged(user => {
      if (!navigator.onLine || !user) {
        this.setState({
          loadingAuth: false,
          user: null
        })
        return;
      }
      if (user && !this.state.user) {
        if (user.isAnonymous) {
          user = this.makeUserFromAnon(user);
        }
        this.setState({user}, () => {
          this.listenUserDB();
        })
      }
    })
  }

  listenUserDB() {
    const user = this.state.user;
    db.collection('users')
    .doc(user.email)
    .onSnapshot(
      (snapshot) => {
        this.setState({
          loadingAuth: false,
          user: snapshot.empty ? null : {...user, ...snapshot.data()}
        })
      },
      (err) => { console.error(err) }
    )
  }

  makeUserFromAnon(user) {
    const username = localStorage.getItem('gdr_anon_username');
    return {
      ...user,
      displayName: username,
      email: `${username}@anon.com`
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

function withContext(WrappedComponent) {
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name;
  const ContextWrapper = (props) => (
    <Context.Consumer>
      {context => (
        <WrappedComponent {...props} {...context} />
      )}
    </Context.Consumer>
  )
  ContextWrapper.displayName = `withContext(${wrappedName})`;
  return ContextWrapper;
}

export default withContext;