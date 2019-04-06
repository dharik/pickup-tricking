import React, { Component } from 'react';

import GatheringInfo from './GatheringInfo';
import MapView from './MapView';
import About from './About';
import { connect } from 'react-redux';
import { Store } from '../Store';
import { Spot, Coordinates } from '../types';

interface Props {
  center: Coordinates;
  spots: Spot[];
  mapHasBeenDragged: boolean;
  onMapDrag: Function;
}
class Browse extends Component<Props> {
  state = {
    selectedMarker: null
  };

  map = null;

  render() {
    return (
      <div className="browse-container">
        <MapView
          containerElement={<div className="map-half" />}
          mapElement={<div className="map-container" />}
          onMapMounted={map => (this.map = map)}
          onMapClick={this.handleMapClick}
          center={this.props.center}
          onBoundsChanged={this.handleBoundsChanged}
          markers={this.props.spots}
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
    this.props.onMapDrag(this.map.getCenter().toJSON());
  };

  handleMarkerClick = targetMarker => {
    this.setState({
      selectedMarker: targetMarker
    });
  };

  handleMapClick = () => {
    this.setState({ selectedMarker: null });
    this.forceUpdate();
  };
}

export default connect(
  (state: Store) => {
    return {
      center: state.map.center,
      spots: state.spots,
      mapHasBeenDragged: state.map.hasBeenDragged
    };
  },
  dispatch => {
    return {
      onMapDrag(newCoords) {
        dispatch({ type: 'MAP_DRAGGED', payload: newCoords });
      }
    };
  }
)(Browse);
