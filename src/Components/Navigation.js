import React from 'react';
import AppBar from 'material-ui/AppBar';

const Navigation = ({ openHostModalFn, onMenuClick }) => {
  return (
    <div>
      <AppBar
        title="Pickup tricking"
        onLeftIconButtonTouchTap={onMenuClick}
        onTitleTouchTap={onMenuClick}
      />
    </div>
  );
};

export default Navigation;
