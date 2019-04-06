import { take, put, call } from 'redux-saga/effects';

export default function*() {
  if (!window.navigator || !window.navigator.geolocation) {
    return;
  }

  while (true) {
    yield take('USER_LOCATION_REQUESTED');
    try {
      const location = yield call(getUserLocation);
      yield put({
        type: 'USER_LOCATION_RECEIVED',
        payload: location
      });
    } catch (e) {
      yield put({
        type: 'USER_LOCATION_NOT_RECEIVED'
      });
    }
  }
}

const getUserLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      e => reject(e)
    );
  });
