import React, { Component } from 'react';

import { db } from '../firebase';
import GatheringInfo from './GatheringInfo';
import MapView from './MapView';
import About from './About';

export default class Browse extends Component {
  state = {
    center: this.props.center,
    gatherings: [{}],
    mapHasBeenDragged: false,
    selectedMarker: null
  };

  map = null;

  componentDidMount() {
    this.gatherData();
  }

  gatherData() {
    db.ref('gatherings')
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
        console.error(f);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.mapHasBeenDragged &&
      (this.props.center.lat !== nextProps.center.lat ||
        this.props.center.lng !== nextProps.center.lng)
    ) {
      this.setState({
        center: nextProps.center
      });
    }
  }

  render() {
    return (
      <div className="browse-container">
        <MapView
          containerElement={<div className="map-half" />}
          mapElement={<div className="map-container" />}
          onMapMounted={map => (this.map = map)}
          onMapClick={this.handleMapClick}
          center={this.state.center}
          onBoundsChanged={this.handleBoundsChanged}
          markers={this.state.gatherings}
          onMarkerClick={this.handleMarkerClick}
        />
        <div className={`list-half`}>
          {this.state.selectedMarker ? (
            <GatheringInfo marker={this.state.selectedMarker} />
          ) : (
            <About />
          )}
        </div>
      </div>
    );
  }

  handleBoundsChanged = () => {
    if (!this.map) {
      return;
    }

    this.setState({
      mapHasBeenDragged: true
    });
    this.props.onBoundsChanged(this.map.getCenter().toJSON());
  };

  handleMarkerClick = targetMarker => {
    this.setState({
      center: targetMarker.selectedLocation,
      selectedMarker: targetMarker
    });
  };

  handleMapClick = () => {
    this.setState({ selectedMarker: null });
    this.forceUpdate();
  };
}
