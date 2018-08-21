import React, { Component } from 'react';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

import { db } from '../firebase';

const gatheringInfo = ({ marker }) => {
  let frequencyText = '';
  if( marker.frequency === 'once' ) {
    const d = new Date(marker.date);
    frequencyText = `Occurs once on ${d.toLocaleString()}`;
  } else if (marker.frequency === 'weekly') {
    frequencyText = 'Occurs on ' + marker.weekly_days.join(', ');
  }
  // return (
  //   <Card>
  //     <CardHeader
  //       title={marker.title}
  //       subtitle={frequencyText}
  //     />
  //     <CardText>
  //       {marker.description}
  //     </CardText>
  //     <CardActions>
  //       <RaisedButton label="Website" />
  //       <RaisedButton label="Open in maps" />
  //     </CardActions>
  //   </Card>
  // )
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
        {marker.isSpringFloor && <span>Spring floor</span>}
        {marker.isGrass && <span>Grass</span>}
        {marker.isFree && <span>Free</span>}
        {marker.hasCrashPads && <span>Has crashpads</span>}
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
        containerElement={<div style={{ height: '100vh', width: '100vh' }} />}
        mapElement={<div style={{ height: '100vh', width: '100vh' }} />}
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
