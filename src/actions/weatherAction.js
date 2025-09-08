

export const SET_WEATHER = "SET_WEATHER";
export const SET_FORECAST = "SET_FORECAST";
export const SET_THEME = "SET_THEME";

export const setWeather = (data) => ({ type: SET_WEATHER, payload: data });
export const setForecast = (data) => ({ type: SET_FORECAST, payload: data });
export const setTheme = (theme) => ({ type: SET_THEME, payload: theme });