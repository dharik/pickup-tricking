import React from 'react';
// import PropTypes from 'prop-types';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

import Chip from 'material-ui/Chip';

const Browse = withGoogleMap(
  ({ markers, center, onMarkerClick, onMarkerClose }) =>
    <GoogleMap defaultZoom={11} center={center}>
      {markers.map((marker, index) =>
        <Marker
          key={index}
          position={marker.selectedLocation}
          onClick={() => onMarkerClick(marker)}
        >
          {marker.showInfo &&
            <InfoWindow onCloseClick={() => onMarkerClose(marker)}>
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
                  <a href={`geo: <${marker.selectedLocation.lat}>, <${marker.selectedLocation.lng}>?q=${marker.selectedLocation.lat},${marker.selectedLocation.lng}(Gathering)`}>Open in maps</a>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {marker.isSpringFloor && <Chip>Spring floor</Chip>}
                  {marker.isGrass && <Chip>Grass</Chip>}
                  {marker.isFree && <Chip>Free</Chip>}
                  {marker.hasCrashPads && <Chip>Has crashpads</Chip>}
                </div>
              </div>
            </InfoWindow>}
        </Marker>
      )}
    </GoogleMap>
);

// Browse.propTypes = {
//   center: PropTypes.object,
//   markers: PropTypes.array,
//   onMarkerClick: PropTypes.func,
//   onMarkerClose: PropTypes.func
// };

export default Browse;
