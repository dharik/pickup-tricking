import React, { Component } from 'react';
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navigation from './Components/Navigation';
import Dialog from 'material-ui/Dialog';

import HostGathering from './Components/HostGathering';
import Browse from './Components/Browse';

import { db } from './firebase';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  state = {
    hostModalOpen: false,
    center: { lat: 31.8610858, lng: -122.2695871 },
    gatherings: [{}],
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

  gatherData() {
    db
      .ref('gatherings')
      .once('value')
      .then(gatherings => {
        let r = [];
        gatherings.forEach(gathering => {
          r.push(gathering.val());
        });

        this.setState({
          gatherings: r
        });
      })
      .catch(f => {
        f => console.error(f);
      });
  }
  componentDidMount() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(p => {
        // Got geolocation
        this.setState({
          center: { lat: p.coords.latitude, lng: p.coords.longitude },
          requestingLocation: false
        });
      });
    }

    this.gatherData();
  }

  onAddedGathering() {
    this.closeHostModal();
    this.gatherData();
  }

  handleMarkerClick = targetMarker => {
    this.setState({
      center: targetMarker.selectedLocation,
      gatherings: this.state.gatherings.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true
          };
        }
        return {
          ...marker,
          showInfo: false
        };
      })
    });
  };

  handleMarkerClose = targetMarker => {
    this.setState({
      gatherings: this.state.gatherings.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false
          };
        }
        return marker;
      })
    });
  };

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
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Navigation
            openHostModalFn={this.openHostModal}
            onMenuClick={this.invertDrawerOpen}
          />

          <div style={{ flex: 1 }}>
            <Browse
              center={this.state.center}
              markers={this.state.gatherings}
              onMarkerClick={this.handleMarkerClick}
              onMarkerClose={this.handleMarkerClose}
              containerElement={
                <div style={{ height: '100%', width: '100%' }} />
              }
              mapElement={<div style={{ height: '100%', width: '100%' }} />}
              onMapClick={this.closeDrawer}
            />
          </div>

          <Dialog
            open={this.state.hostModalOpen}
            onRequestClose={this.closeHostModal}
            autoScrollBodyContent={true}
            repositionOnUpdate={false}
          >
            <HostGathering
              center={this.state.center}
              onAddedGathering={() => this.onAddedGathering()}
            />
          </Dialog>

          <Drawer open={this.state.drawerOpen}>
            <MenuItem onTouchTap={this.closeDrawer}>Browse gatherings</MenuItem>
            <MenuItem onTouchTap={this.openHostModal}>
              Add/host a gathering
            </MenuItem>
            <MenuItem>Manage my gatherings</MenuItem>
            <MenuItem>About</MenuItem>
          </Drawer>

          <Snackbar
            open={this.state.requestingLocation}
            message="Requesting your location..."
            autoHideDuration={5000}
            onRequestClose={this.closeRequestionLocation}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
