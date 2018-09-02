import React from 'react';

import { Link, withRouter } from 'react-router-dom';
import { PlusCircle } from 'react-feather';

const Navigation = () => {
  return (
    <div className="nav">
      TrickSpot - Find local tricking spots
      <Link to="browse">Map</Link>
      <Link to="/about">About</Link>
      <Link to="/host">Add spot<PlusCircle /></Link>
    </div>
  );
};

export default withRouter(Navigation);
