import { all } from 'redux-saga/effects';

import { cartSaga } from './cart';

export default function* rootSaga() {
    yield all( [
        cartSaga()
    ] )
}