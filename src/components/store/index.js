// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootSaga from './rootSaga';
import cartReducer from './cart';
import modalReducer from './modalReducer';
import wishlistReducer from './wishlistReducer';
import demoReducer from './demoReducer';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    cart: cartReducer,
    modal: modalReducer,
    wishlist: wishlistReducer,
    demo: demoReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'wishlist'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export { store, persistor };
