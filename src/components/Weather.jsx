// src/components/Weather.jsx
import { useLanguage } from "../i18n/LanguageContext.jsx";

const fmtTime = (ts, locale) => {
    if (!ts) return "-";
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
};

const fmtDay = (date, locale) =>
    new Date(date).toLocaleDateString(locale, {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
    });

const Weather = ({ weather = {}, forecast = [] }) => {
    const hasToday = weather && typeof weather.temp === "number" && !weather.error;
    const { locale, t } = useLanguage();

    return (
        <div className="wx">
            <section className="card current">
                <div className="current-main">
                    <div className="big-emoji">
                        {

                            weather.description?.toLowerCase().includes("дожд") ? "🌧️" :
                                weather.description?.toLowerCase().includes("гроза") ? "⛈️" :
                                    weather.description?.toLowerCase().includes("снег")  ? "❄️" :
                                        weather.description?.toLowerCase().includes("обла")  ? "☁️"  : "☀️"
                        }
                    </div>

                    <div className="current-center">
                        <div className="place">{hasToday ? weather.city : t("enterCity")}</div>
                        <div className="temp">{hasToday ? `${weather.temp}°C` : "--"}</div>
                        <div className="desc">{hasToday ? weather.description : ""}</div>

                        {hasToday && weather.feels_like != null && (
                            <div className="feels">
                                {t("feelsLike")} {weather.feels_like}°C
                            </div>
                        )}

                        {hasToday && weather.rain1h > 0 && (
                            <div className="feels">☔ {weather.rain1h} mm</div>
                        )}
                    </div>

                    <div className="metric-grid">
                        <div className="metric">
                            <span>{t("pressure")}</span>
                            <b>{weather.pressure ?? "-"}</b>
                            <small>hPa</small>
                        </div>
                        <div className="metric">
                            <span>{t("humidity")}</span>
                            <b>{weather.humidity ?? "-"}</b>
                            <small>%</small>
                        </div>
                        <div className="metric">
                            <span>{t("wind")}</span>
                            <b>{weather.wind ?? "-"}</b>
                            <small>m/s</small>
                        </div>
                        <div className="metric">
                            <span>{t("clouds")}</span>
                            <b>{weather.clouds ?? "-"}</b>
                            <small>%</small>
                        </div>
                        <div className="metric">
                            <span>{t("visibility")}</span>
                            <b>{weather.visibility ?? "-"}</b>
                            <small>km</small>
                        </div>
                        <div className="metric">
                            <span>{t("sunrise")}</span>
                            <b>{fmtTime(weather.sunrise, locale)}</b>
                        </div>
                        <div className="metric">
                            <span>{t("sunset")}</span>
                            <b>{fmtTime(weather.sunset, locale)}</b>
                        </div>
                    </div>
                </div>

                {weather.error && <p className="error">Error: {weather.error}</p>}
            </section>

            <section className="card week">
                <h3>{t("forecast7")}</h3>
                <ul className="week-list">
                    {forecast && forecast.length > 0 ? (
                        forecast.map((d, i) => (
                            <li key={i} className="week-item">
                                <div className="w-left">
                                    <div className="w-day">{fmtDay(d.date, locale)}</div>
                                    <div className="w-emoji">{d.emoji || "☀️"}</div>
                                </div>
                                <div className="w-mid">
                                    <div className="w-range">
                                        <b>{d.max}°</b> / <span>{d.min}°</span>
                                    </div>
                                    <div className="w-main">{d.main}</div>
                                </div>
                                <div className="w-right">
                                    <div className="w-metric">💨 {d.wind} m/s</div>
                                    <div className="w-metric">💧 {d.humidity}%</div>
                                    <div className="w-metric">
                                        ☔ {d.pop}% {Number(d.rain) > 0 ? `(${d.rain} mm)` : ""}
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="empty">{t("noData")}</li>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default Weather;
