import React, { Component } from 'react';

import GatheringInfo from './GatheringInfo';
import MapView from './MapView';
import About from './About';
import { connect } from 'react-redux';
import { Store } from '../Store';
import { Spot, Coordinates } from '../types';
import { Link } from 'react-router-dom';
import { PlusCircle, Info } from 'react-feather';

interface Props {
  center: Coordinates;
  spots: Spot[];
  mapHasBeenDragged: boolean;
  onMapDrag: Function;
  onMapClick: Function;
  onMarkerClick: Function;
  loadSpots: VoidFunction;
  selectedSpot: Spot;
  onSpotInfoClose: VoidFunction;
}
class Browse extends Component<Props> {
  map = null;

  componentWillMount() {
    this.props.loadSpots();
  }

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
        {this.props.selectedSpot && (
          <div className="spot-info">
            <GatheringInfo marker={this.props.selectedSpot} onClose={this.props.onSpotInfoClose} />
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
          <Link to="/host" className="add-spot-btn">
            <PlusCircle style={{ height: '1em', width: '1em' }} /> Add a spot
          </Link>
        </div>
        <Link to="about" className="about-btn">
          <Info style={{ height: '1em', width: '1em' }} />
        </Link>
      </div>
    );
  }

  handleBoundsChanged = () => {
    this.props.onMapDrag(this.map.getCenter().toJSON());
  };

  handleMarkerClick = targetMarker => {
    this.props.onMarkerClick(targetMarker);
  };

  handleMapClick = () => {
    this.props.onMapClick(this.map.getCenter().toJSON());
  };
}

export default connect(
  (state: Store) => {
    return {
      center: state.map.center,
      spots: state.spots,
      mapHasBeenDragged: state.map.hasBeenDragged,
      selectedSpot: state.selectedSpot
    };
  },
  dispatch => {
    return {
      onMapDrag(newCoords) {
        dispatch({ type: 'MAP_DRAGGED', payload: newCoords });
      },
      loadSpots() {
        dispatch({ type: 'FETCH_SPOTS_REQUESTED' });
      },
      onMapClick(newCoords) {
        dispatch({ type: 'MAP_CLICKED', payload: newCoords });
      },
      onMarkerClick(spot) {
        dispatch({ type: 'SPOT_SELECTED', payload: spot });
      },
      onSpotInfoClose() {
        dispatch({ type: 'SPOT_CLOSED' });
      }
    };
  }
)(Browse);
