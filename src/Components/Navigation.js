import React from 'react';
import { auth } from '../firebase';

import { Link, withRouter } from 'react-router-dom';

const Navigation = ({
  onMenuClick,
  drawerOpen,
  history
}) => {
  const signOut = () => {
    auth.signOut();
    history.push('/');
  };

  const open = (rt) => {
    history.push(rt);
  }

  let provider =
    auth.currentUser &&
    auth.currentUser.providerData &&
    auth.currentUser.providerData[0].providerId.replace('.com', '');

  return (
    <div>
        <a onClick={() => open('/browse')}>Find tricking spots</a>
        <a onClick={() => open('/host')}>Add a spot to the map</a>
        <a onClick={() => open('/mine')}>Update my spots</a>
        <a onClick={() => open('/about')}>About TrickSpot</a>
        {auth.currentUser &&
          <a onClick={signOut}>
            Logout
          </a>}
    </div>
  );
};

export default withRouter(Navigation);
