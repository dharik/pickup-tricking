import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { auth } from '../firebase';

import { Link, withRouter } from 'react-router-dom';

const Navigation = ({
  onMenuClick,
  drawerOpen,
  onCloseDrawer,
  history
}) => {
  const signOut = () => {
    auth.signOut();
    onCloseDrawer();
    history.push('/');
  };

  const open = (rt) => {
    onCloseDrawer();
    history.push(rt);
  }

  let provider =
    auth.currentUser &&
    auth.currentUser.providerData &&
    auth.currentUser.providerData[0].providerId.replace('.com', '');

  return (
    <div>
      <AppBar
        title="TrickSpot"
        onLeftIconButtonClick={onMenuClick}
        onTitleClick={onMenuClick}
      />

      <Drawer open={drawerOpen}>
        <MenuItem onClick={() => open('/browse')}>Find tricking spots</MenuItem>
        <MenuItem onClick={() => open('/host')}>Add a spot to the map</MenuItem>
        <MenuItem onClick={() => open('/mine')}>Update my spots</MenuItem>
        <MenuItem onClick={() => open('/about')}>About TrickSpot</MenuItem>
        {auth.currentUser &&
          <MenuItem onClick={signOut}>
            Logout
          </MenuItem>}
      </Drawer>
    </div>
  );
};

export default withRouter(Navigation);
