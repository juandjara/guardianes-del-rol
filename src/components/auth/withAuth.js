import React, {createContext, Component} from 'react';
import { auth, db } from '../../firebase';

const initialContext = { user: null, loadingAuth: true};
const AuthContext = createContext({...initialContext});

export const AuthConsumer = AuthContext.Consumer;
export class AuthProvider extends Component {
  state = {...initialContext}
  unsubcriber = null;

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
  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

function withAuth(WrappedComponent) {
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name;
  const AuthContextWrapper = (props) => (
    <AuthConsumer>
      {context => (
        <WrappedComponent {...props} {...context} />
      )}
    </AuthConsumer>
  )
  AuthContextWrapper.displayName = `withAuth(${wrappedName})`;
  return AuthContextWrapper;
}

export default withAuth;