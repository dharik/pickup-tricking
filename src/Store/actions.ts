import { Coordinates, Spot } from '../types';

export type Actions =
  | { type: 'MAP_DRAGGED'; payload: Coordinates }

  // User location
  | { type: 'USER_LOCATION_REQUESTED' }
  | { type: 'USER_LOCATION_RECEIVED'; payload: Coordinates }
  | { type: 'USER_LOCATION_NOT_RECEIVED' }

  // Data loading
  | { type: 'FETCH_SPOTS_REQUESTED' }
  | { type: 'FETCH_SPOTS_STARTED' }
  | { type: 'FETCH_SPOTS_SUCCEEDED'; payload: Spot[] }
  | { type: 'FETCH_SPOTS_FAILED' };

export type ActionTypes = Pick<Actions, 'type'>['type'];
