import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from './TrickSpotTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navigation from './Components/Navigation';

import HostGathering from './Components/HostGathering';
import ManageGatherings from './Components/ManageGatherings';

import Browse from './Components/Browse';
import Login from './Components/Login';
import Snackbar from 'material-ui/Snackbar';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import About from './Components/About';

class App extends Component {
  state = {
    center: { lat: 31.8610858, lng: -122.2695871 },
    userCenter: { lat: 31.8610858, lng: -122.2695871 },
    userCenterChanged: false,
    drawerOpen: false,
    requestingLocation: true
  };

  openHostModal = () => {
    this.closeDrawer();
    this.setState({ hostModalOpen: true });
  };

  closeHostModal = () => {
    this.setState({ hostModalOpen: false });
  };

  componentDidMount() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        p => {
          // Got geolocation
          this.setState({
            center: { lat: p.coords.latitude, lng: p.coords.longitude },
            requestingLocation: false
          });
        },
        e => {
          // User probably rejected
          this.setState({
            requestingLocation: false
          });
        }
      );
    } else {
      this.setState({
        requestingLocation: false
      });
    }
  }

  invertDrawerOpen = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  };
  closeDrawer = () => {
    this.setState({
      drawerOpen: false
    });
  };

  closeRequestionLocation = () => {
    this.setState({
      requestingLocation: false
    });
  };

  onBoundsChanged = newCenter => {
    this.setState({
      userCenter: newCenter,
      userCenterChanged: true
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div style={{ height: '100%' }}>
          <Router>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Navigation
                openHostModalFn={this.openHostModal}
                onMenuClick={this.invertDrawerOpen}
                onCloseDrawer={this.closeDrawer}
                drawerOpen={this.state.drawerOpen}
              />

              <div style={{ flex: 1 }}>
                <Switch>
                  <Route path="/about" component={About} />
                  <Route path="/login" component={Login} />
                  <Route
                    path="/host"
                    render={() =>
                      <HostGathering
                        center={this.state.userCenterChanged ? this.state.userCenter : this.state.center}
                      />}
                  />
                  <Route path="/mine" component={ManageGatherings} />
                  <Route
                    render={() =>
                      <Browse
                        center={this.state.userCenterChanged ? this.state.userCenter : this.state.center}
                        onMapClick={this.closeDrawer}
                        onBoundsChanged={this.onBoundsChanged}
                      />}
                  />
                </Switch>
              </div>

              <Snackbar
                open={this.state.requestingLocation}
                message="Requesting your location..."
                autoHideDuration={5000}
                onRequestClose={this.closeRequestionLocation}
              />
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
