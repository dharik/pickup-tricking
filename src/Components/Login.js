import React, { Component } from 'react';
import SocialLogins from '../lib/SocialLogins';
import { auth } from '../firebase';

class Login extends Component {
  constructor(props) {
    super(props);
    auth.onAuthStateChanged(next => {
      if(next) {
        console.log('login worked');
      } else {
        console.error('failed to login');
      }
    });
  }
  render() {
    return (
      <div>
        You'll need to login first!
        <SocialLogins
          fireRef={auth}
          providers={['google', 'facebook', 'phone']}
        />
      </div>
    );
  }
}

export default Login;