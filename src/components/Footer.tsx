import { Row } from "react-bootstrap";

function Footer() {
  return (
    <footer className="pt-5 my-5 border-top">
      <Row>
        <div className="d-flex justify-content-center align-items-center ">
          <p className="text-muted m-2">
            Ich7en &copy; {`${new Date().getFullYear()}`} <br />
            <span>
              <i className="bi bi-github"></i>
            </span>
            <span>
              <a
                href="https://github.com/azerazerty"
                target="_blank"
                style={{ textDecoration: "none" }}
              >{` @azerazerty`}</a>
            </span>
          </p>
        </div>
      </Row>
    </footer>
  );
}

export default Footer;
