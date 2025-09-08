import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import { useLanguage } from "./i18n/LanguageContext.jsx";

import "./App.css";

import Data from "./components/Data.jsx";
import {useSelector} from "react-redux";

function App() {
    const { t } = useLanguage();
    const theme= useSelector(state => state.theme);
    return (
        <div className={`app-shell ${theme}`}>
            <header className="app-header d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1>{t("appTitle")}</h1>
                    <p>{t("appSubtitle")}</p>
                </div>
                <LanguageSwitcher />
            </header>

            <main className="app-main">
                <section className="panel">
                    <Data/>
                </section>
            </main>
        </div>

    );
}
export default App;
