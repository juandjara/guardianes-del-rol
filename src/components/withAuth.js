import React, {Component} from 'react';
import { auth, db } from '../firebase';

function withAuth(WrappedComponent) {
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name;
  return class WithAuth extends Component {
    static displayName = `withAuth(${wrappedName})`;
    state = {
      loadingAuth: true,
      user: auth.currentUser
    }
    componentDidMount() {
      auth.onAuthStateChanged(user => {
        if (user && !this.state.user) {
          db.collection('users')
          .where('email', '==', user.email)
          .get()
          .then(res => {
            if (res.empty) {
              auth.signOut();
              window.alert('Este usuario necesita invitación')
            }
            this.setState({
              loadingAuth: false,
              user: res.empty ? null : user
            })
          })
        } else if (!user) {
          this.setState({
            loadingAuth: false,
            user: null
          })
        }
      })
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