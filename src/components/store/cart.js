import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { toast } from 'react-toastify';
import { takeEvery } from 'redux-saga/effects';
import CartPopup from "../utils/popup-notifications/cart-popup";
import { compileString } from "sass";
import { fetchTenantConfiguration } from '../../service/api-data-provider';
const actionTypes = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    UPDATE_CART: 'UPDATE_CART',
}

const initialState = {
    data: []
}

function cartReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.ADD_TO_CART:
            let tmpProduct = { ...action.payload.product };
            if (state.data.findIndex(item => item.cartItemId === action.payload.product.cartItemId) > -1) {
                let tmpData = state.data.reduce((acc, cur) => {
                    if (cur.cartItemId === tmpProduct.cartItemId) {
                        acc.push({
                            ...cur,
                            qty: parseInt(cur.qty) + parseInt(tmpProduct.qty)
                        });
                    } else {
                        acc.push(cur);
                    }

                    return acc;
                }, [])

                return { ...state, data: tmpData };
            } else {
                return { ...state, data: [...state.data, tmpProduct] };
            }

        case actionTypes.REMOVE_FROM_CART:
            let cart = state.data.reduce((cartAcc, product) => {
                if (product.cartItemId !== action.payload.product.cartItemId) {
                    cartAcc.push(product);
                }
                return cartAcc;
            }, []);
            return { ...state, data: cart };

        case actionTypes.UPDATE_CART:
            return { ...state, data: action.payload.products };

        case actionTypes.REFRESH_STORE:
            return initialState;

        default:
            return state;
    }
}

export const cartActions = {
    addToCart: product => ({ type: actionTypes.ADD_TO_CART, payload: { product } }),
    removeFromCart: product => ({ type: actionTypes.REMOVE_FROM_CART, payload: { product } }),
    updateCart: products => ({ type: actionTypes.UPDATE_CART, payload: { products } })
};

export function* cartSaga() {
    yield takeEvery(actionTypes.ADD_TO_CART, function* saga(e) {
        toast(<CartPopup product={e.payload.product} />);
    })
}

const response  = await fetchTenantConfiguration(); 
const keyPrefix = response.REACT_APP_COMPANY_NAME;

const persistConfig = {
    keyPrefix: `${keyPrefix}-`,  // Using the company name prefix from .env
    key: "cart",
    storage
}

export default persistReducer(persistConfig, cartReducer);
