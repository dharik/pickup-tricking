import { createStore, compose, applyMiddleware } from 'redux';
import { Actions } from './actions';
import produce from 'immer';
import createSagaMiddleware from 'redux-saga';
import fetch_spots from './Sagas/fetch_spots';
import fetch_user_location from './Sagas/fetch_user_location';
import log_user_location from './Sagas/log_user_location';

const inititalState = {
  map: {
    center: { lat: 31.8610858, lng: -122.2695871 },
    hasBeenDragged: false
  },
  user: {
    location: { lat: null, lng: null, loading: false }
  },
  spots: [],
  selectedSpot: null
};

export type Store = typeof inititalState;

const rootReducer = produce((state: Store, action: Actions) => {
  switch (action.type) {
    case 'MAP_DRAGGED':
      state.map.center = action.payload;
      state.map.hasBeenDragged = true;
      break;
    case 'MAP_CLICKED':
    case 'SPOT_CLOSED':
      state.selectedSpot = null;
      break;
    case 'MAP_MARKER_CLICKED':
    case 'SPOT_SELECTED':
      state.selectedSpot = action.payload;
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
    case 'FETCH_SPOTS_SUCCEEDED':
      state.spots = action.payload;
      break;
  }
}, inititalState);

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(fetch_spots);
sagaMiddleware.run(log_user_location);
sagaMiddleware.run(fetch_user_location);
