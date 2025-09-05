import "./App.css";

import Data from "./components/Data.jsx";
import {useSelector} from "react-redux";

function App() {
    const theme= useSelector(state => state.theme);
    return (
        <div className={`app-shell ${theme}`}>
            <header className="app-header">
                <h1>Weather application</h1>
                <p>Your city weather / Погода вашего города</p>
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
