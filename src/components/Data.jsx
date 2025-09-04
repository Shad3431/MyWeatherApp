import React, {useState} from "react";
import {api_key, base_url, forecast_url, geocode_url} from "../utils/constants.js";
import Form from "./Form.jsx";
import Weather from "./Weather.jsx";

const Data = ({ setTheme }) => {
    const [weatherInfo, setWeatherInfo] = useState({});
    const [forecastDays, setForecastDays] = useState([]);

    const toEmoji = (main) => {
        const m = (main || "").toLowerCase();
        if (m.includes("thunder")) return "⛈️";
        if (m.includes("rain") || m.includes("drizzle")) return "🌧️";
        if (m.includes("snow")) return "❄️";
        if (m.includes("cloud")) return "☁️";
        if (m.includes("wind")) return "🌬️";
        if (m.includes("fog") || m.includes("mist") || m.includes("haze")) return "🌫️";
        return "☀️";
    };

    const toTheme = (main) => {
        const m = (main || "").toLowerCase();
        if (m.includes("thunder")) return "thunder";
        if (m.includes("rain") || m.includes("drizzle")) return "rainy";
        if (m.includes("snow")) return "snowy";
        if (m.includes("cloud")) return "cloudy";
        if (m.includes("wind")) return "windy";
        return "sunny";
    };

    const dayKey = (ts) => {
        const d = new Date(ts * 1000);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };

    const aggregateForecast = (list=[]) => {
        const map = new Map();
        list.forEach(it=>{
            const key = dayKey(it.dt);
            const t = it.main?.temp ?? 0;
            const tmin = it.main?.temp_min ?? t;
            const tmax = it.main?.temp_max ?? t;
            const hum = it.main?.humidity ?? 0;
            const wind = it.wind?.speed ?? 0;
            const pop = Math.round((it.pop ?? 0)*100);
            const rain = it.rain?.["3h"] ?? it.rain?.["1h"] ?? 0;
            const main = it.weather?.[0]?.main || "";
            if(!map.has(key)){
                map.set(key,{date:new Date(key),min:tmin,max:tmax,hum:[hum],wind:[wind],pop:[pop],rain:[rain],cond:[main]});
            } else {
                const d=map.get(key);
                d.min=Math.min(d.min,tmin); d.max=Math.max(d.max,tmax);
                d.hum.push(hum); d.wind.push(wind); d.pop.push(pop); d.rain.push(rain); d.cond.push(main);
            }
        });
        const mode = (arr)=>{const m={};arr.forEach(x=>m[x]=(m[x]||0)+1);return Object.entries(m).sort((a,b)=>b[1]-a[1])[0]?.[0]||"Clear";}
        return Array.from(map.values()).sort((a,b)=>a.date-b.date).slice(0,7).map(d=>({
            date:d.date,
            min:Math.round(d.min),
            max:Math.round(d.max),
            humidity:Math.round(d.hum.reduce((s,x)=>s+x,0)/d.hum.length),
            wind:Math.round(d.wind.reduce((s,x)=>s+x,0)/d.wind.length),
            pop:Math.max(...d.pop),
            rain:(d.rain.reduce((s,x)=>s+(x||0),0)).toFixed(1),
            main:mode(d.cond),
            emoji:toEmoji(mode(d.cond))
        }));
    };

    const getWeather = async (input) => {
        try {
            let lat = input.lat, lon = input.lon, label = input.label;

            if ((lat == null || lon == null) && label) {
                const gr = await fetch(`${geocode_url}?q=${encodeURIComponent(label)}&limit=1&appid=${api_key}`);
                const g = await gr.json();
                if (Array.isArray(g) && g[0]) {
                    lat = g[0].lat; lon = g[0].lon;
                    label = `${g[0].name}${g[0].state ? ", " + g[0].state : ""}${g[0].country ? ", " + g[0].country : ""}`;
                }
            }

            let curResp;
            if (lat != null && lon != null) {
                curResp = await fetch(`${base_url}?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric&lang=ru`);
            } else {
                curResp = await fetch(`${base_url}?q=${encodeURIComponent(label)}&appid=${api_key}&units=metric&lang=ru`);
            }
            const cur = await curResp.json();
            if (cur.cod && Number(cur.cod) !== 200) {
                setWeatherInfo({error: cur.message});
                setForecastDays([]);
                setTheme?.("default");
                return;
            }

            const current = {
                city: label || `${cur.name}${cur.sys?.country ? ", " + cur.sys.country : ""}`,
                temp: Math.round(cur.main?.temp),
                feels_like: Math.round(cur.main?.feels_like),
                description: cur.weather?.[0]?.description || "",
                pressure: cur.main?.pressure,
                humidity: cur.main?.humidity,
                wind: cur.wind?.speed,
                visibility: cur.visibility != null ? Math.round(cur.visibility/1000) : null,
                clouds: cur.clouds?.all,
                sunrise: cur.sys?.sunrise,
                sunset: cur.sys?.sunset,
                rain1h: cur.rain?.["1h"] ?? 0
            };
            setWeatherInfo(current);
            setTheme?.(toTheme(cur.weather?.[0]?.main));

            let fResp;
            if (lat != null && lon != null) {
                fResp = await fetch(`${forecast_url}?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric&lang=ru`);
            } else {
                fResp = await fetch(`${forecast_url}?q=${encodeURIComponent(current.city)}&appid=${api_key}&units=metric&lang=ru`);
            }
            const fj = await fResp.json();
            const days = Array.isArray(fj.list) ? aggregateForecast(fj.list) : [];
            setForecastDays(days);
        } catch {
            setWeatherInfo({error: "Network error / Ошибка сети"});
            setForecastDays([]);
            setTheme?.("default");
        }
    };

    return (
        <div>
            <Form getWeather={getWeather}/>
            <Weather weather={weatherInfo} forecast={forecastDays}/>
        </div>
    );
};

export default Data;
