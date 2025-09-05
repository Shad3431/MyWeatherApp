import {SET_WEATHER, SET_FORECAST, SET_THEME} from "../actions/weatherAction.js";

export const weatherReducer = (state, action) => {
    switch (action.type) {
        case SET_WEATHER:
            return {...state, weather: action.payload};
        case SET_FORECAST:
            return {...state, forecast: action.payload};
        case SET_THEME:
            return {...state, theme: action.payload};
        default:
            return state;
    }
}
