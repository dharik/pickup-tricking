import React, { Component } from "react";
import "./App.css";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import GoogleMapReact from "google-map-react";

import firebase from "firebase";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const apiKeyParams = {
  key: "AIzaSyBUoa5u8pUE5UayWD-QL7Ff8gNQUSaVU84"
};

firebase.initializeApp({
  apiKey: "AIzaSyBUoa5u8pUE5UayWD-QL7Ff8gNQUSaVU84",
  authDomain: "pickup-tricking.firebaseapp.com",
  databaseURL: "https://pickup-tricking.firebaseio.com",
  projectId: "pickup-tricking",
  storageBucket: "pickup-tricking.appspot.com",
  messagingSenderId: "981593307874"
});
const db = firebase.database();

class App extends Component {
  state = {
    hostModalOpen: false,
    latitude: 37.8610858,
    longitude: -122.2695871
  };

  handleOpen = () => {
    console.log("opening");
    this.setState({ hostModalOpen: true });
  };

  handleClose = () => {
    this.setState({ hostModalOpen: false });
  };

  componentDidMount() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(p => {
        console.log("Got current position");
        this.setState({
          longitude: p.coords.longitude,
          latitude: p.coords.latitude
        });
      });
    }

    console.log("db request");
    db
      .ref("gatherings")
      .once("value", v => console.log(v.val()), f => console.error(f));
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div style={{ height: "100%" }}>
          <Toolbar>
            <ToolbarGroup firstChild={false}>
              <ToolbarTitle text="Pickup Tricking" />
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
              <FlatButton label="About" onTouchTap={this.handleOpen} />
              <FlatButton label="Manage Gatherings" />
              <FlatButton
                label="Host a gathering"
                onTouchTap={this.handleOpen}
              />
            </ToolbarGroup>
          </Toolbar>

          <div style={{ height: "90%" }}>
            <GoogleMapReact
              bootstrapURLKeys={apiKeyParams}
              center={{ lat: this.state.latitude, lng: this.state.longitude }}
              defaultZoom={10}
            />
          </div>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
