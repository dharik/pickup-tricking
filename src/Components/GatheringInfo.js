import React from 'react';
import { ExternalLink, Navigation } from 'react-feather';
import './GatheringInfo.css';

const GatheringInfo = ({ marker }) => {
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

      <p className="spot-description">{marker.description}</p>

      <div className="spot-footer">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${
            marker.selectedLocation.lat
          },${marker.selectedLocation.lng}`}
          target="_blank">
          <Navigation style={{ width: '1rem', height: '1rem' }} /> Get Directions
        </a>
      </div>
    </React.Fragment>
  );
};

export default GatheringInfo;
