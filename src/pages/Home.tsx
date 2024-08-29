import { useEffect, useState, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import { AuthContext } from "./Auth";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// const user = JSON.parse(localStorage.getItem("user")!);

function TotalRecharge() {
  const [user] = useContext(AuthContext);
  const [flexyOperations, setFlexyOperations] = useState<any>();
  const [flexyLoading, setFlexyLoading] = useState<boolean>(true);

  const [historyOperations, setHistoryOperations] = useState<any>();
  const [operationsLoading, setOperationsLoading] = useState<boolean>(true);

  const [date, setDate] = useState<Date>(new Date(Date.now()));

  const [filteredUser, setFiltredUser] = useState<String>();
  // const [sum,setSum] = useState<any>(0)

  const MySwal = withReactContent(Swal);

  const auth_token = user.token;
  const username = user.username;

  function generateColorFromName(name: string): string {
    let hash = 0;

    // Generate a hash from the input name
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // XOR the hash with a large prime number to spread the bits
    hash = hash ^ 0xbadc0de;

    // Extract RGB components by shifting and masking bits
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    // Convert the RGB components to a hex string
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }

  // Example usage
  const color = generateColorFromName("John Doe");
  console.log(color); // Output will be a unique color for "John Doe"

  const getFlexy = async () => {
    let toReturn;
    let error;
    axios
      .post(`${BASE_URL}/getflexy.php`, {
        user: username,
        auth_token,
      })
      .then((response: AxiosResponse) => {
        if (response.data.status !== "success")
          throw new Error(`${response.data.message}`);
        toReturn = response.data.message;
        setFlexyOperations(toReturn);
        setFlexyLoading(false);
      })
      .catch((e) => {
        error = e;
        setFlexyOperations(error);
        setFlexyLoading(false);
      });
    if (error) throw new Error(error);
    return toReturn;
  };

  const getOperations = async () => {
    let toReturn;
    let error;
    axios
      .post(`${BASE_URL}/getoperations.php`, {
        user: username,
        auth_token,
        date: `${format(date, "yyyy-MM-dd")}`,
      })
      .then((response: AxiosResponse) => {
        if (response.data.status !== "success")
          throw new Error(`${response.data.message}`);
        toReturn = response.data.message;
        setHistoryOperations(toReturn);
        setOperationsLoading(false);
      })
      .catch((e) => {
        error = e;
        setHistoryOperations(error);
        setOperationsLoading(false);
      });
    if (error) throw new Error(error);
    return toReturn;
  };
  const saveFlexy = async (operation_number: String) => {
    let toReturn;
    let error;
    await axios
      .post(`${BASE_URL}/saveflexy.php`, {
        user: username,
        auth_token,
        operation_number,
      })
      .then((response: AxiosResponse) => {
        if (response.data.status !== "success") {
          toReturn = response.data.message;
          throw new Error(`${response.data.message}`);
        }
        return response.data.message;
      })
      .catch((e) => {
        error = e;
      });
    if (await error) {
      throw new Error(error!.message);
    }
    return await toReturn;
  };

  const handleChangeDate = async () => {
    setOperationsLoading(true);
    await getOperations();
  };

  const handleSaveFlexy = async (operation_number: string) => {
    await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm Flexy!",
      allowOutsideClick: () => !MySwal.isLoading(),
      preConfirm: async () => {
        MySwal.showLoading();
        try {
          await saveFlexy(operation_number);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          getFlexy();
          getOperations();
          MySwal.fire({
            title: "Confirmed!",
            text: "Your Flexy has been Confirmed.",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        getFlexy();
        MySwal.fire({
          title: "Cancelled",
          text: `${error.message}`,
          icon: "error",
        });
      });
  };

  const sumCredit = () => {
    if (!historyOperations) return 0;
    let sum = 0;
    if (!filteredUser || filteredUser.length < 1) {
      historyOperations.forEach((operation: any) => {
        sum += parseFloat(operation.credit) || 0;
      });
      return sum;
    }

    historyOperations
      .filter((operation: any) => filteredUser === operation?.user)
      .forEach((operation: any) => {
        sum += parseFloat(operation.credit) || 0;
      });
    return sum;
  };

  useEffect(() => {
    getFlexy();
    getOperations();
  }, []);

  // useEffect(() => {
  //   if (historyOperations) {
  //     console.log(sumCredit());
  //     sumCredit();
  //   }
  // }, [historyOperations, filteredUser]);

  return (
    <>
      <Helmet>
        <title>SIM Recharge | Flexy Panel</title>
      </Helmet>
      <h2 className="display-5 text-center mb-2">SIM Recharge</h2>
      <h4 className=" text-center mb-1 fst-italic fw-light">{user.phone}</h4>
      <span className="text-success" style={{ fontSize: "larger" }}>
        <i className="bi bi-sim-fill"></i>
      </span>
      <span className="badge text-dark">3G</span>
      <span className="text-success" style={{ fontSize: "larger" }}>
        <i className="bi bi-reception-4"></i>{" "}
      </span>

      <Row>
        <h4 className="mt-5  mb-4">
          Active Flexy Operations To Confirm for the Past Three Days:
          {/* <span className="text-primary">
            {`${format(Date.now(), "yyyy-MM-dd")}`}
          </span> */}
        </h4>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th># Operation Number</th>
            <th>Credit</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {flexyOperations && !flexyLoading && flexyOperations?.length > 0 ? (
            flexyOperations.map((flexy: any) => (
              <tr key={flexy.operation_number} className="fw-bold ">
                <td>
                  <span className="text-dark ">{`# ${
                    flexy.operation_number || 0
                  }`}</span>
                </td>
                <td>
                  <span className="text-success ">
                    {`${
                      (flexy.credit &&
                        Intl.NumberFormat().format(parseFloat(flexy.credit))) ||
                      "0"
                    }  `}
                  </span>

                  <sub>DA</sub>
                </td>
                <td className="text-center">
                  <Badge className="fw-semibold fs-6 " bg="danger">
                    {`${(flexyOperations && flexy.time) || "00:00:00"}`}
                  </Badge>
                  {/* <span className=" fw-semibold text-danger ">
                    {`${(flexyOperations && flexy.date) || "00:00:00"}`}
                  </span> */}
                </td>
                <td className="text-center">
                  <Button
                    id={flexy.operation_number}
                    onClick={async (e) => {
                      await handleSaveFlexy(e.currentTarget.id);
                    }}
                    variant="outline-success"
                  >
                    {`Confirm It's Mind `}
                    <i className="bi bi-clipboard2-check"></i>{" "}
                  </Button>
                  <span className="ms-2">
                    <Spinner
                      className="text-warning"
                      role="status"
                      size="sm"
                      animation="grow"
                    ></Spinner>
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <>
              {!flexyLoading ? (
                <>
                  <tr className="fw-semibold ">
                    <td colSpan={5} className="p-3">
                      <span className="text-secondary ">
                        No Operations To Handle
                      </span>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="fw-semibold  ">
                    <td colSpan={5} className="p-4  text-secondary">
                      <div className="d-flex gap-3 justify-content-center">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <span className="text-secondary ">
                          Loading Information ...
                        </span>
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </>
          )}
        </tbody>
      </Table>

      <h5
        className=" mt-5 mx-3 mb-3"
        style={{
          textAlign: "left",
        }}
      >
        Operation History :{" "}
        {/* <span className="text-primary">{`${
          historyOperations[0]?.date
            ? format(historyOperations[0].date, "yyyy-MM-dd")
            : format(Date.now(), "yyyy-MM-dd")
        }`}</span> */}
        <span className="text-primary">{`${
          date && format(date, "yyyy-MM-dd")
        }`}</span>
      </h5>

      <Row>
        <Form>
          <Form.Group
            as={Row}
            className="mb-3 d-flex "
            controlId="formPlaintextBeginDate"
          >
            <Col xs={2} className="mb-4">
              <Form.Label column>Date :</Form.Label>
            </Col>
            <Col xs={4}>
              <Form.Control
                onChange={(e) => {
                  setDate(new Date(e.target.value));
                }}
                type="date"
                value={`${format(date, "yyyy-MM-dd")}`}
              />
            </Col>
            <Col xs={4} md={2} className="mb-4 d-flex justify-content-center">
              <Button
                onClick={handleChangeDate}
                disabled={operationsLoading}
                className="d-flex gap-2 align-items-center mb-3 px-4"
                variant="primary"
              >
                {operationsLoading ? (
                  <>
                    <Spinner
                      as="span"
                      size="sm"
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    Loading
                  </>
                ) : (
                  <>
                    {" "}
                    <i className="bi bi-calendar-check"></i> Apply
                  </>
                )}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Row>
      <Card className="mb-4" border="warning">
        <Card.Header className="border-warning fw-bold ">
          Total Credit
        </Card.Header>
        <Card.Body className="fs-4">
          Total Credit for Selected Users is:{" "}
          <Badge bg="success">
            {`${
              Intl.NumberFormat().format(parseFloat(sumCredit() + "")) || "0"
            }  `}

            <sub>DA</sub>
          </Badge>
        </Card.Body>
      </Card>
      <Row className="mb-3 d-flex  align-items-center">
        <Col xs={2}>
          <Form.Label>Select User:</Form.Label>
        </Col>
        <Col xs={4}>
          {operationsLoading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {!operationsLoading &&
            (!historyOperations || historyOperations.length <= 0) && (
              <Form.Control
                type="text"
                value="No User To Select "
                readOnly
                disabled
              />
            )}
          {!operationsLoading &&
            historyOperations &&
            historyOperations.length > 0 && (
              <Form.Select onChange={(e) => setFiltredUser(e.target.value)}>
                <option value="">Select User</option>
                {Array.from(
                  new Set(
                    historyOperations.map((operation: any) => operation.user)
                  )
                )
                  .filter((user) => user && user !== "")
                  .map((user: any) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
              </Form.Select>
            )}
        </Col>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th># Operation Number</th>
            <th>Credit</th>
            <th>Date and Time</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {historyOperations &&
          !operationsLoading &&
          historyOperations?.length > 0 ? (
            historyOperations
              .filter((operation: any) => {
                if (!filteredUser || filteredUser == "") return true;
                return operation?.user === filteredUser;
              })
              .map((operation: any) => (
                <tr key={operation.operation_number} className="fw-bold ">
                  <td>
                    <span className="text-dark ">{`# ${
                      operation.operation_number || 0
                    }`}</span>
                  </td>
                  <td>
                    <span className="text-success ">
                      {`${
                        (operation.credit &&
                          Intl.NumberFormat().format(
                            parseFloat(operation.credit)
                          )) ||
                        "0"
                      }  `}
                    </span>

                    <sub>DA</sub>
                  </td>
                  <td>
                    <span className=" fw-light text-dark ">
                      {`${
                        (historyOperations && operation.date) || "0000-00-0000"
                      }`}
                    </span>
                  </td>
                  <td>
                    <span
                      className=" badge text-light fw-bold"
                      style={{
                        backgroundColor: `${generateColorFromName(
                          operation?.user || "User Unknown"
                        )}`,
                      }}
                    >
                      {`${
                        (historyOperations &&
                          String(operation.user).toUpperCase()) ||
                        "User Unknown"
                      }`}
                    </span>
                  </td>
                </tr>
              ))
          ) : (
            <>
              {!operationsLoading ? (
                <>
                  <tr className="fw-semibold ">
                    <td colSpan={5} className="p-3">
                      <span className="text-secondary ">
                        No Operations History
                      </span>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="fw-semibold  ">
                    <td colSpan={5} className="p-4  text-secondary">
                      <div className="d-flex gap-3 justify-content-center">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <span className="text-secondary ">
                          Loading Information ...
                        </span>
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </>
          )}
        </tbody>
      </Table>
    </>
  );
}

export default TotalRecharge;
