import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HostGathering from './Components/HostGathering';
import ManageGatherings from './Components/ManageGatherings';
import Browse from './Components/Browse';
import Login from './Components/Login';
import About from './Components/About';
import './App.css';

const DEFAULT_MAP_CENTER = { lat: 31.8610858, lng: -122.2695871 };
class App extends Component {
  state = {
    userLocation: null,
    requestingUserLocation: true,
    mapCenter: DEFAULT_MAP_CENTER,
    mapTouched: false
  };

  componentDidMount() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        p => {
          // Got geolocation
          const loc = { lat: p.coords.latitude, lng: p.coords.longitude };

          // Keep the user location but only move the map if the
          // user hasn't interacted with it yet
          if (this.state.mapTouched) {
            this.setState({
              userLocation: loc,
              requestingUserLocation: false
            });
          } else {
            this.setState({
              userLocation: loc,
              mapCenter: loc,
              requestingUserLocation: false
            });
          }
        },
        e => {
          // User probably rejected
          this.setState({
            requestingUserLocation: false
          });
        }
      );
    } else {
      this.setState({
        requestingUserLocation: false
      });
    }
  }

  onBoundsChanged = newCenter => {
    this.setState({
      mapCenter: newCenter,
      mapTouched: true
    });
  };

  render() {
    return (
      <Router>
        <React.Fragment>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/login" component={Login} />
            <Route path="/host" render={() => <HostGathering center={this.state.mapCenter} />} />
            <Route path="/mine" component={ManageGatherings} />
            <Route
              render={() => (
                <Browse center={this.state.mapCenter} onBoundsChanged={this.onBoundsChanged} />
              )}
            />
          </Switch>
          {this.state.requestingUserLocation && (
            <div className="requesting-location">Getting your location...</div>
          )}
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
