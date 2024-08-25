import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import TotalRecharge from "./pages/TotalRecharge.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Protected from "./components/Protected.tsx";
import Auth from "./pages/Auth.tsx";
import axios from "axios";

function App() {
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
