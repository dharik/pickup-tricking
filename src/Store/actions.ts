import { Coordinates, Spot } from '../types';

export type ActionTypes =
  | { type: 'MAP_DRAGGED'; payload: Coordinates }
  | { type: 'USER_LOCATION_REQUESTED' }
  | { type: 'USER_LOCATION_RECEIVED'; payload: Coordinates }
  | { type: 'USER_LOCATION_NOT_RECEIVED' }
  | { type: 'FETCH_SPOTS_STARTED' }
  | { type: 'FETCH_SPOTS_SUCCESS'; payload: Spot[] }
  | { type: 'FETCH_SPOTS_FAILED' };
