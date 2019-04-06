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

class App extends Component {
  componentDidMount() {
    store.dispatch({ type: 'USER_LOCATION_REQUESTED' });
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
}

export default App;
