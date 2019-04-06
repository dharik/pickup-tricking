import { db } from '../../firebase';
import { take, call, put } from 'redux-saga/effects';

export default function*() {
  while (true) {
    yield take('FETCH_SPOTS_REQUESTED');

    try {
      const gatherings = yield call(() => db.ref('gatherings').once('value'));

      let r = [];
      gatherings.forEach(gathering => {
        r.push(gathering.val());
      });

      yield put({ type: 'FETCH_SPOTS_SUCCEEDED', payload: r });
    } catch (e) {
      yield put({ type: 'FETCH_SPOTS_FAILED' });
    }
  }
}
