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

  let provider =
    auth.currentUser &&
    auth.currentUser.providerData &&
    auth.currentUser.providerData[0].providerId.replace('.com', '');

  return (
    <div>
      <AppBar
        title="Pickup tricking"
        onLeftIconButtonTouchTap={onMenuClick}
        onTitleTouchTap={onMenuClick}
      />

      <Drawer open={drawerOpen}>
        <Link to="/browse">
          <MenuItem onTouchTap={() => onCloseDrawer()}>Find tricking spots</MenuItem>
        </Link>
        <Link to="/host">
          <MenuItem onTouchTap={() => onCloseDrawer()}>Add a spot to the map</MenuItem>
        </Link>
        <Link to="/mine">
          <MenuItem onTouchTap={() => onCloseDrawer()}>
            Update my spots
          </MenuItem>
        </Link>
        <Link to="/about">
          <MenuItem onTouchTap={() => onCloseDrawer()}>
            About TrickSpot
          </MenuItem>
        </Link>
        {auth.currentUser &&
          <MenuItem onTouchTap={signOut}>
            Logout {provider ? '(' + provider + ')' : null}
          </MenuItem>}
      </Drawer>
    </div>
  );
};

export default withRouter(Navigation);
