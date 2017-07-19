import React, { Component } from 'react';
import { auth } from '../firebase';
import firebaseui from 'firebaseui';
import firebase from 'firebase';
import 'firebaseui/dist/firebaseui.css';

var authUi = new firebaseui.auth.AuthUI(auth);

class Login extends Component {
  constructor(props) {
    super(props);
    auth.onAuthStateChanged(next => {
      if (next) {
        if (!this.props.location) {
          this.props.history.push('/host');
        }

        this.props.history.push(this.props.location.state.from);
      }
    });
  }

  componentDidMount() {
    var uiConfig = {
      signInFlow: 'popup',
      signInSuccess: function(currentUser, credential, redirectUrl) {
        return false;
      },
      signInSuccessUrl: (this.props.location && this.props.location.state && this.props.location.state.from) || '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    };

    authUi.start('#firebaseui-auth', uiConfig);
  }

  componentWillUnmount() {
    authUi.reset();
  }

  render() {
    return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h4>Sign in required</h4>
      <div id="firebaseui-auth" />
    </div>
  }
}

export default Login;
