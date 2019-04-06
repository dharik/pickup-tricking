import { createStore, compose } from 'redux';
import { ActionTypes } from './actions';
import produce from 'immer';

const inititalState = {
  map: {
    center: { lat: 31.8610858, lng: -122.2695871 },
    hasBeenDragged: false
  },
  user: {
    location: { lat: null, lng: null, loading: false }
  },
  spots: []
};

export type Store = typeof inititalState;

const theBigReducer = produce((state: Store, action: ActionTypes) => {
  switch (action.type) {
    case 'MAP_DRAGGED':
      state.map.center = action.payload;
      state.map.hasBeenDragged = true;
      break;
    case 'USER_LOCATION_REQUESTED':
      state.user.location.loading = true;
      break;
    case 'USER_LOCATION_RECEIVED':
      state.user.location.lat = action.payload.lat;
      state.user.location.lng = action.payload.lng;
      state.user.location.loading = false;

      if (!state.map.hasBeenDragged) {
        state.map.center = action.payload;
      }
      break;
    case 'USER_LOCATION_NOT_RECEIVED':
      state.user.location.loading = false;
      break;
    case 'FETCH_SPOTS_SUCCESS':
      state.spots = action.payload;
      break;
  }
}, inititalState);

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(theBigReducer, composeEnhancers());
