import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import { Link } from 'react-router-dom';

const Navigation = ({
  openHostModalFn,
  onMenuClick,
  match,
  drawerOpen,
  onCloseDrawer
}) => {
  return (
    <div>
      <AppBar
        title="Pickup tricking"
        onLeftIconButtonTouchTap={onMenuClick}
        onTitleTouchTap={onMenuClick}
      />

      <Drawer open={drawerOpen}>
        <Link to="/browse">
          <MenuItem onTouchTap={() => onCloseDrawer()}>Browse spots</MenuItem>
        </Link>
        <Link to="/host">
          <MenuItem onTouchTap={() => onCloseDrawer()}>Add a spot</MenuItem>
        </Link>
        <Link to="/manage">
          <MenuItem onTouchTap={() => onCloseDrawer()}>Update my spots</MenuItem>
        </Link>
        <Link to="/about">
          <MenuItem onTouchTap={() => onCloseDrawer()}>About TrickSpot</MenuItem>
        </Link>
      </Drawer>
    </div>
  );
};

export default Navigation;
