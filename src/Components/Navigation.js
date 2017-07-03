import React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import FlatButton from "material-ui/FlatButton";

const Navigation = ({ openHostModalFn }) => {
  return (
    <div>
      <Toolbar>
        <ToolbarGroup firstChild={false}>
          <ToolbarTitle text="Pickup Tricking" />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
          <FlatButton label="About" />
          <FlatButton label="Manage Gatherings" />
          <FlatButton label="Host a gathering" onTouchTap={openHostModalFn} />
        </ToolbarGroup>
      </Toolbar>

    </div>
  );
};

export default Navigation;
