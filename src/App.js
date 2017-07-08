import React, { Component } from "react";
import "./App.css";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import theme from "material-ui/styles/baseThemes/lightBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import Navigation from "./Components/Navigation";
import Dialog from "material-ui/Dialog";

import HostGathering from './Components/HostGathering';
import firebase from "firebase";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

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
    hostModalOpen: true,
    center: [37.8610858,-122.2695871],
    latitude: 37.8610858,
    longitude: -122.2695871
  };

  openHostModal = () => {
    console.log("opening");
    this.setState({ hostModalOpen: true });
  };

  closeHostModal = () => {
    this.setState({ hostModalOpen: false });
  };

  componentDidMount() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(p => {
        // Got geolocation
        this.setState({
          center: [p.coords.latitude, p.coords.longitude],
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
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div style={{ height: "100%" }}>
          <Navigation
            openHostModalFn={this.openHostModal}
          />

          <div style={{ height: "90%" }}>
            

          </div>



          <Dialog
            open={this.state.hostModalOpen}
            onRequestClose={this.closeHostModal}
            autoScrollBodyContent={true}
          >
            <HostGathering center={{ lat: this.state.latitude, lng: this.state.longitude }}/>
          </Dialog>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
