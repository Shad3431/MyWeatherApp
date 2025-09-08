
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";

import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import {store} from "./configStore/Store.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </Provider>
    </StrictMode>
);

