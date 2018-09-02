import React from 'react';
import { ExternalLink, Navigation } from 'react-feather';

const GatheringInfo = ({ marker }) => {
  if (!marker) {
    return null;
  }

  let frequencyText = '';
  if (marker.frequency === 'once') {
    const d = new Date(marker.date);
    frequencyText = d.toLocaleDateString();
  } else if (marker.frequency === 'weekly') {
    frequencyText = marker.weekly_days.join(', ');
  }

  return (
    <React.Fragment>
      <div className="spot-title">
        {marker.title}{' '}
        {marker.url && (
          <a href={marker.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
          </a>
        )}
      </div>

      <div className="spot-frequency">{frequencyText}</div>

      <div className="spot-features">
        {marker.isSpringFloor && <span>Spring floor</span>}
        {marker.isGrass && <span>Grass</span>}
        {marker.isFree && <span>Free</span>}
        {marker.hasCrashPads && <span>Crashpads</span>}
      </div>

      <p>{marker.description}</p>

      <div className="spot-footer">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${
            marker.selectedLocation.lat
          },${marker.selectedLocation.lng}`}
          target="_blank">
          <Navigation size="1rem" /> Get Directions
        </a>
      </div>
    </React.Fragment>
  );
};

export default GatheringInfo;
