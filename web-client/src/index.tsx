import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import Inquiry from "./components/Inquiry";
import "./index.css";

const Root = () =>
    <StyletronProvider value={new Styletron()} debug={
        process.env.NODE_ENV === "development" ? new DebugEngine() : undefined
    }>
        <BaseProvider theme={LightTheme} overrides={{ AppContainer: {
             style: { height: "100%" }
        } }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/inquiry/:identifier" element={<Inquiry />} />
                </Routes>
            </BrowserRouter>
        </BaseProvider>
    </StyletronProvider>


ReactDOM.render(<Root />, document.getElementById("app-root"));
