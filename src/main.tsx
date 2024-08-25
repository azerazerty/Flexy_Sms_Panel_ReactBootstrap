import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer.tsx";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container className="mt-4 text-center">
      <App />
      <Footer />
    </Container>
  </StrictMode>
);
