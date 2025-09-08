import {useEffect, useRef, useState} from "react";
import {api_key, geocode_url} from "../utils/constants.js";

const Form = ({ getWeather }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        const delay = setTimeout(async () => {
            const q = query.trim();
            if (!q) {
                setSuggestions([]);
                return;
            }
            try {
                const url = `${geocode_url}?q=${encodeURIComponent(q)}&limit=7&appid=${api_key}`;
                const res = await fetch(url);
                const list = await res.json();
                const items = (Array.isArray(list) ? list : []).map(g => ({
                    label: `${g.name}${g.state ? ", " + g.state : ""}${g.country ? ", " + g.country : ""}`,
                    lat: g.lat,
                    lon: g.lon
                }));
                setSuggestions(items);
                setOpen(true);
            } catch {
                setSuggestions([]);
                setOpen(false);
            }
        }, 350);
        return () => clearTimeout(delay);
    }, [query]);

    useEffect(() => {
        const onDoc = (e) => {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    const selectItem = (item) => {
        setQuery(item.label);
        setOpen(false);
        getWeather({ label: item.label, lat: item.lat, lon: item.lon });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        getWeather({ label: q });
        setOpen(false);
    };

    return (
        <form className="search" onSubmit={onSubmit} autoComplete="off">
            <div className="search-row" ref={boxRef} style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Enter city / Введіть місто"
                    value={query}
                    onChange={(e)=>{ setQuery(e.target.value); setOpen(true); }}
                    onFocus={()=> setOpen(suggestions.length > 0)}
                />
                <button type="submit">Show / Показать</button>
                {open && suggestions.length > 0 && (
                    <ul className="ac-list">
                        {suggestions.map((s, i) => (
                            <li key={`${s.label}-${i}`} onClick={()=>selectItem(s)}>
                                <span className="city">{s.label}</span>
                                <span className="coords">{s.lat.toFixed(2)}, {s.lon.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </form>
    );
};

export default Form;
