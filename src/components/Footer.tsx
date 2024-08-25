import { Row } from "react-bootstrap";

function Footer() {
  return (
    <footer className="pt-5 my-5 border-top">
      <Row>
        <div className="d-flex justify-content-center align-items-center ">
          <p className="text-muted m-2">
            Ich7en &copy; {`${new Date().getFullYear()}`}
          </p>
        </div>
      </Row>
    </footer>
  );
}

export default Footer;
