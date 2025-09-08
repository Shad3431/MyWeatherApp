import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LanguageSwitcher() {
    const { lang, setLang } = useLanguage();

    return (
        <div className="d-flex align-items-center gap-2">
            <select
                className="form-select form-select-sm"
                style={{ width: "160px" }}
                value={lang}
                onChange={(e) => setLang(e.target.value)}
            >
                <option value="uk">Українська</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
            </select>
        </div>
    );
}
