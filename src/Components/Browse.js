import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

import Chip from 'material-ui/Chip';
import { db } from '../firebase';

const gatheringInfo = ({ marker }) => {
  return (
    <div>
      {marker.url
        ? <a href={marker.url} target="_blank" rel="noopener noreferrer">
            <h4>
              {marker.title}
            </h4>
          </a>
        : <h3>
            {marker.title}
          </h3>}
      {marker.frequency === 'once' &&
        <p>
          <b>Occurs once:</b> {new Date(marker.date).toLocaleString()}
        </p>}
      {marker.frequency === 'weekly' &&
        <p>
          <b>Occurs on:</b> {marker.weekly_days.join(', ')}
        </p>}
      <p>
        {marker.description}
      </p>
      <p>
        <a
          href={`geo: <${marker.selectedLocation.lat}>, <${marker
            .selectedLocation.lng}>?q=${marker.selectedLocation.lat},${marker
            .selectedLocation.lng}(Gathering)`}
        >
          Open in maps
        </a>
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {marker.isSpringFloor && <Chip>Spring floor</Chip>}
        {marker.isGrass && <Chip>Grass</Chip>}
        {marker.isFree && <Chip>Free</Chip>}
        {marker.hasCrashPads && <Chip>Has crashpads</Chip>}
      </div>
    </div>
  );
};

const BrowseMap = withGoogleMap(
  ({
    markers,
    center,
    onMarkerClick,
    onMarkerClose,
    onMapClick,
    onMapMounted,
    onBoundsChanged
  }) =>
    <GoogleMap
      ref={onMapMounted}
      defaultZoom={5}
      center={center}
      onClick={onMapClick}
      onDragEnd={onBoundsChanged}
    >
      {markers.map((marker, index) =>
        <Marker
          key={index}
          position={marker.selectedLocation}
          onClick={() => onMarkerClick(marker)}
        >
          {marker.showInfo &&
            <InfoWindow onCloseClick={() => onMarkerClose(marker)}>
              {gatheringInfo({ marker })}
            </InfoWindow>}
        </Marker>
      )}
    </GoogleMap>
);

class Browse extends Component {
  state = {
    center: this.props.center,
    gatherings: [{}],
    mapHasBeenDragged: false
  };

  map = null;

  render() {
    return (
      <BrowseMap
        containerElement={<div style={{ height: '100%', width: '100%' }} />}
        mapElement={<div style={{ height: '100%', width: '100%' }} />}
        onMapClick={this.props.onMapClick}
        markers={this.state.gatherings}
        center={this.state.center}
        onMapMounted={map => (this.map = map)}
        onBoundsChanged={this.handleBoundsChanged}
        onMarkerClick={this.handleMarkerClick}
        onMarkerClose={this.handleMarkerClose}
      />
    );
  }

  componentDidMount() {
    this.gatherData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.mapHasBeenDragged &&
      (this.props.center.lat !== nextProps.center.lat ||
        this.props.center.lng !== nextProps.center.lng)
    ) {
      this.setState({
        center: nextProps.center
      })
    }
  }

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
        console.error(f);
      });
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
}

// Browse.propTypes = {
//   center: PropTypes.object,
//   markers: PropTypes.array,
//   onMarkerClick: PropTypes.func,
//   onMarkerClose: PropTypes.func
// };

export default Browse;
