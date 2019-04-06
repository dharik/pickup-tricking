import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HostGathering from './Components/HostGathering';
import ManageGatherings from './Components/ManageGatherings';
import Browse from './Components/Browse';
import Login from './Components/Login';
import About from './Components/About';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './Store';
import { db } from './firebase';

class App extends Component {
  componentDidMount() {
    this.requestUserLocation();
    this.loadSpots();
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <React.Fragment>
            <Switch>
              <Route path="/about" component={About} />
              <Route path="/login" component={Login} />
              <Route path="/host" render={() => <HostGathering />} />
              <Route path="/mine" component={ManageGatherings} />
              <Route render={() => <Browse />} />
            </Switch>
          </React.Fragment>
        </Router>
      </Provider>
    );
  }

  requestUserLocation = () => {
    if (!window.navigator || !window.navigator.geolocation) {
      return false;
    }

    store.dispatch({ type: 'USER_LOCATION_REQUESTED' });

    window.navigator.geolocation.getCurrentPosition(
      p => {
        store.dispatch({
          type: 'USER_LOCATION_RECEIVED',
          payload: {
            lat: p.coords.latitude,
            lng: p.coords.longitude
          }
        });
      },
      e => {
        // User probably rejected
        store.dispatch({ type: 'USER_LOCATION_NOT_RECEIVED' });
      }
    );
  };

  loadSpots = () => {
    store.dispatch({ type: 'FETCH_SPOTS_STARTED' });
    db.ref('gatherings')
      .once('value')
      .then(gatherings => {
        let r = [];
        gatherings.forEach(gathering => {
          r.push(gathering.val());
        });

        store.dispatch({ type: 'FETCH_SPOTS_SUCCESS', payload: r });

        this.setState({
          gatherings: r
        });
      })
      .catch(f => {
        store.dispatch({ type: 'FETCH_SPOTS_FAILED' });
        console.error(f);
      });
  };
}

export default App;
