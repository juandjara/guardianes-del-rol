import React, {Component} from 'react';
import { auth, db } from '../../firebase';

function withAuth(WrappedComponent) {
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name;
  return class WithAuth extends Component {
    static displayName = `withAuth(${wrappedName})`;
    unsubcriber = null;
    state = {
      loadingAuth: true,
      user: auth.currentUser
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
        <WrappedComponent 
          {...this.props}
          user={this.state.user}
          loadingAuth={this.state.loadingAuth} />
      )
    }
  }
}

export default withAuth;