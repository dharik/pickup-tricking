import { take, call } from 'redux-saga/effects';
import { db } from '../../firebase';

export default function*() {
  const action = yield take('USER_LOCATION_RECEIVED');

  yield call(() => db.ref('visitorLocations').push(action.payload));
}
