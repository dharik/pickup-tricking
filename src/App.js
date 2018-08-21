import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from "./Components/Navigation";
import HostGathering from "./Components/HostGathering";
import ManageGatherings from "./Components/ManageGatherings";
import Browse from "./Components/Browse";
import Login from "./Components/Login";
import About from "./Components/About";
import "./App.css";

class App extends Component {
  state = {
    center: { lat: 31.8610858, lng: -122.2695871 },
    userCenter: { lat: 31.8610858, lng: -122.2695871 },
    userCenterChanged: false,
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

  onBoundsChanged = newCenter => {
    this.setState({
      userCenter: newCenter,
      userCenterChanged: true
    });
  };

  render() {
    return (
        <Router>
          <div
            style={{
              height: "100vh",
              width: "100vh"
            }}
          >
              <Switch>
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                <Route
                  path="/host"
                  render={() => (
                    <HostGathering
                      center={
                        this.state.userCenterChanged
                          ? this.state.userCenter
                          : this.state.center
                      }
                    />
                  )}
                />
                <Route path="/mine" component={ManageGatherings} />
                <Route
                  render={() => (
                    <Browse
                      center={
                        this.state.userCenterChanged
                          ? this.state.userCenter
                          : this.state.center
                      }
                      onMapClick={this.closeDrawer}
                      onBoundsChanged={this.onBoundsChanged}
                    />
                  )}
                />
              </Switch>

            {/* <Snackbar
              open={this.state.requestingLocation}
              message="Requesting your location..."
              autoHideDuration={5000}
              onRequestClose={this.closeRequestionLocation}
            /> */}
          </div>
        </Router>
    );
  }
}

export default App;
