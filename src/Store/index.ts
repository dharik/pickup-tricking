import { createStore } from 'redux';
import { ActionTypes } from './actions';
import produce from 'immer';

const inititalState = {
  map: {
    center: {
      lng: null,
      lat: null
    }
  }
};

export type Store = typeof inititalState;

const theBigReducer = produce((state: Store, action: ActionTypes) => {
  switch (action.type) {
    case 'MAP_DRAGGED':
      state.map.center = action.payload;
      break;
  }
}, inititalState);

export const store = createStore(
  theBigReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
