import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
// Removed `fetchCompanyConfig` since it's asynchronous
// We can now use an environment variable instead for `keyPrefix`.
import { fetchTenantConfiguration } from '../../service/api-data-provider';
export const actionTypes = {
    RefreshStore: "REFRESH_STORE"
};

let initialState = {
    current: 1
};

const demoReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RefreshStore:
            return {
                ...state,
                current: action.payload.current
            };

        default:
            return state;
    }
};

export const demoActions = {
    refreshStore: (current) => ({ type: actionTypes.RefreshStore, payload: { current } })
};

const response  = await fetchTenantConfiguration(); 
const keyPrefix = response.REACT_APP_COMPANY_NAME;

const persistConfig = {
    keyPrefix: `${keyPrefix}-`, // Using the company name prefix from .env
    key: "demo",
    storage
};

export default persistReducer(persistConfig, demoReducer);
