import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { auth } from '../firebase';

import { Link, withRouter } from 'react-router-dom';

const Navigation = ({
  openHostModalFn,
  onMenuClick,
  match,
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
        onLeftIconButtonTouchTap={onMenuClick}
        onTitleTouchTap={onMenuClick}
      />

      <Drawer open={drawerOpen}>
        <MenuItem onTouchTap={() => open('/browse')}>Find tricking spots</MenuItem>
        <MenuItem onTouchTap={() => open('/host')}>Add a spot to the map</MenuItem>
        <MenuItem onTouchTap={() => open('/mine')}>Update my spots</MenuItem>
        <MenuItem onTouchTap={() => open('/about')}>About TrickSpot</MenuItem>
        {auth.currentUser &&
          <MenuItem onTouchTap={signOut}>
            Logout
          </MenuItem>}
      </Drawer>
    </div>
  );
};

export default withRouter(Navigation);
