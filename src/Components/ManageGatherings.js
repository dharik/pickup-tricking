import React, { Component } from 'react';
import { db, auth } from '../firebase';
import { Redirect } from 'react-router-dom';

class ManageGatherings extends Component {
  
  render() {
    if(!auth.currentUser) {
      this.props.history.push('/login', { from: '/mine' });
    }
    return (
      <div>
        Manage
      </div>
    );
  }
}

export default ManageGatherings;