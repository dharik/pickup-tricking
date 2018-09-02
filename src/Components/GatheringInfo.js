import React from 'react';
import { ExternalLink } from 'react-feather';

const GatheringInfo = ({ marker }) => {
  if (!marker) {
    return null;
  }

  let frequencyText = '';
  if (marker.frequency === 'once') {
    const d = new Date(marker.date);
    frequencyText = d.toLocaleString();
  } else if (marker.frequency === 'weekly') {
    frequencyText = marker.weekly_days.join(', ');
  }

  return (
    <React.Fragment>
      <h3>
        {marker.title}{' '}
        {marker.url && (
          <a href={marker.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
          </a>
        )}
      </h3>

      <div className="spot-frequency">{frequencyText}</div>

      <div className="spot-features">
        {marker.isSpringFloor && <span>Spring floor</span>}
        {marker.isGrass && <span>Grass</span>}
        {marker.isFree && <span>Free</span>}
        {marker.hasCrashPads && <span>Has crashpads</span>}
      </div>

      <p>{marker.description}</p>
      <p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${
            marker.selectedLocation.lat
          },${marker.selectedLocation.lng}`}
          target="_blank">
          Open in maps
        </a>
      </p>
    </React.Fragment>
  );
};

export default GatheringInfo;
