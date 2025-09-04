import "./App.css";
import {useState} from "react";
import Data from "./components/Data.jsx";

function App() {
    const [theme, setTheme] = useState("default");
    return (
        <div className={`app-shell ${theme}`}>
            <header className="app-header">
                <h1>Weather application</h1>
                <p>Your city weather / Погода вашего города</p>
            </header>

            <main className="app-main">
                <section className="panel">
                    <Data setTheme={setTheme}/>
                </section>
            </main>
        </div>
    );
}
export default App;
