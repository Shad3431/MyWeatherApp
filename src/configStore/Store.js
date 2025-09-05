import {weatherReducer} from "../reducers/weatherReducer.js";
import {applyMiddleware, legacy_createStore as createStore} from "redux";
import {thunk} from "redux-thunk";
import {logger} from "redux-logger/src";

const initialStore = {
    theme: "default",
    weather: {},
    forecast: []
};

export const store = createStore(weatherReducer, initialStore,
    applyMiddleware(thunk, logger));//todo thunk