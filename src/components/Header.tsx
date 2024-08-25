import Logo from "../assets/Logo1.png";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Image,
  Row,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user")!);

function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <header>
        <Row className="p-1 border-bottom mb-5">
          <Col>
            <div className="d-flex justify-content-center justify-content-md-start mb-3 mb-md-0 ">
              <a href="/">
                <Image className="logo mx-4" src={Logo} rounded />
              </a>
            </div>
          </Col>
          <Col
            className="d-flex justify-content-center justify-content-md-end mb-3 mb-md-0"
            xs={12}
            md
          >
            <Stack
              direction="horizontal"
              gap={3}
              className="justify-content-center justify-content-md-end align-items-center "
            >
              <Button href="/totalRecharge" variant="outline-secondary">
                Total Recharge
              </Button>
              <DropdownButton
                title={`${user.username}`}
                variant="outline-danger"
              >
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </DropdownButton>
            </Stack>
          </Col>
        </Row>
      </header>
    </>
  );
}

export default Header;
