import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext();

const LOCALE_MAP = { uk: "uk-UA", en: "en-US", de: "de-DE" };
const OWM_LANG   = { uk: "uk",    en: "en",    de: "de"   };

const MESSAGES = {
    uk: {
        appTitle: "Weather application",
        appSubtitle: "Погода вашого міста",
        show: "Показати",
        placeholder: "Місто, країна (напр., Kyiv, UA)",
        pressure: "Тиск",
        humidity: "Вологість",
        wind: "Вітер",
        clouds: "Хмари",
        visibility: "Видимість",
        sunrise: "Схід",
        sunset: "Захід",
        feelsLike: "Відчувається",
        enterCity: "Введіть місто",
        forecast7: "Прогноз на 7 днів",
        noData: "Немає даних",
    },
    en: {
        appTitle: "Weather application",
        appSubtitle: "Your city weather",
        show: "Show",
        placeholder: "City, country (e.g., Berlin, DE)",
        pressure: "Pressure",
        humidity: "Humidity",
        wind: "Wind",
        clouds: "Clouds",
        visibility: "Visibility",
        sunrise: "Sunrise",
        sunset: "Sunset",
        feelsLike: "Feels like",
        enterCity: "Enter city",
        forecast7: "7-day Forecast",
        noData: "No data",
    },
    de: {
        appTitle: "Weather application",
        appSubtitle: "Wetter deiner Stadt",
        show: "Anzeigen",
        placeholder: "Stadt, Land (z. B. Berlin, DE)",
        pressure: "Druck",
        humidity: "Luftfeuchte",
        wind: "Wind",
        clouds: "Wolken",
        visibility: "Sichtweite",
        sunrise: "Sonnenaufgang",
        sunset: "Sonnenuntergang",
        feelsLike: "Gefühlt",
        enterCity: "Stadt eingeben",
        forecast7: "7-Tage-Vorhersage",
        noData: "Keine Daten",
    },
};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState("uk"); // стартуем с украинского

    const value = useMemo(
        () => ({
            lang,
            setLang,
            locale: LOCALE_MAP[lang],
            owmLang: OWM_LANG[lang],
            t: (key) => MESSAGES[lang][key] ?? key,
        }),
        [lang]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
 // eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
