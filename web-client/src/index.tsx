import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import Inquiry from "./components/Inquiry";
import firebase from "firebase/app";
import "firebase/firestore"
import "firebase/functions"
import firebaseConfig from "./secrets/firebaseConfig.json"
import "./index.css";


const Root = () => {
    return <StyletronProvider value={new Styletron()} debug={
        process.env.NODE_ENV === "development" ? new DebugEngine() : undefined
    }>
        <BaseProvider theme={LightTheme} overrides={{ AppContainer: {
             style: { height: "100%" }
        } }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/inquiry/:inquiryId" element={<Inquiry />} />
                </Routes>
            </BrowserRouter>
        </BaseProvider>
    </StyletronProvider>
}

firebase.initializeApp(firebaseConfig)
if (process.env.NODE_ENV === "development") {
    firebase.functions().useFunctionsEmulator("http://localhost:5001")
}
ReactDOM.render(<Root />, document.getElementById("app-root"));
