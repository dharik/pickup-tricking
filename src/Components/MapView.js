import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const MapView = withGoogleMap(
  ({ markers, center, onMarkerClick, onMapClick, onMapMounted, onBoundsChanged }) => (
    <GoogleMap
      ref={onMapMounted}
      defaultZoom={5}
      center={center}
      onClick={onMapClick}
      onDragEnd={onBoundsChanged}
      options={{
        gestureHandling: 'greedy',
        mapTypeControl: false
      }}>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.selectedLocation}
          onClick={() => onMarkerClick(marker)}
        />
      ))}
    </GoogleMap>
  )
);

export default MapView;
