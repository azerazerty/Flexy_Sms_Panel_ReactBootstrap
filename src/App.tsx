import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import TotalRecharge from "./pages/TotalRecharge.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Protected from "./components/Protected.tsx";
import Auth from "./pages/Auth.tsx";
import axios from "axios";

function App() {
  const url = `https://flexy-sms-panel-reactbootsrap.onrender.com`; // Replace with your Render URL
  const interval = 30000; // Interval in milliseconds (30 seconds)

  function reloadWebsite() {
    axios
      .get(url)
      .then((response) => {
        console.log(
          `Reloaded at ${new Date().toISOString()}: Status Code ${
            response.status
          }`
        );
      })
      .catch((error) => {
        console.error(
          `Error reloading at ${new Date().toISOString()}:`,
          error.message
        );
      });
  }

  setInterval(reloadWebsite, interval);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Protected />}>
            <Route path="totalRecharge" element={<TotalRecharge />} />
            <Route index element={<Home />} />
          </Route>
          <Route path="/login" element={<Auth />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
