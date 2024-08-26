import { useEffect, useState, useContext } from "react";
import axios, { AxiosResponse } from "axios";

import { Helmet } from "react-helmet";

import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { format } from "date-fns";
import { AuthContext } from "./Auth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const day = 60 * 60 * 24 * 1000;

// const user = JSON.parse(localStorage.getItem("user")!);

type DateRange = {
  begin_date: Date;
  end_date: Date;
};

function TotalRecharge() {
  const [user] = useContext(AuthContext);

  const [summary, setSummary] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    begin_date: new Date(Date.now()),
    end_date: new Date(Date.now() + day),
  });

  const auth_token = user.token;
  const username = user.username;

  const getSummary = async () => {
    let toReturn;
    let error;
    axios
      .post(`${BASE_URL}/total.php`, {
        user: username,
        auth_token,
        begin_date: `${format(dateRange.begin_date, "yyyy-MM-dd")} `,
        end_date: `${format(dateRange.end_date, "yyyy-MM-dd")} `,
      })
      .then((response: AxiosResponse) => {
        if (response.data.status !== "success")
          throw new Error(`${response.data.message}`);
        toReturn = response.data.message;
        setSummary(toReturn);
        setLoading(false);
      })
      .catch((e) => {
        error = e;
        setSummary(error);
        setLoading(false);
      });
    if (error) throw new Error(error);
    return toReturn;
  };
  const handleChangeDate = async () => {
    setLoading(true);
    await getSummary();
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <>
      <Helmet>
        <title>Total Recharge | Flexy Panel</title>
      </Helmet>
      <Form className="m-2">
        <Form.Group
          as={Row}
          className="mb-3 d-flex "
          controlId="formPlaintextBeginDate"
        >
          <Col xs={4} md={2} className="mb-4">
            <Form.Label column>Date begin :</Form.Label>
          </Col>
          <Col xs md className="mb-4">
            <Form.Control
              onChange={(e) => {
                setDateRange((prev: DateRange) => {
                  return {
                    ...prev,
                    begin_date: new Date(e.target.value),
                  };
                });
              }}
              type="date"
              value={`${format(dateRange.begin_date, "yyyy-MM-dd")}`}
            />
          </Col>
          <Col xs={4} md={2} className="mb-4">
            <Form.Label column>Date end :</Form.Label>
          </Col>
          <Col xs md className="mb-4">
            <Form.Control
              onChange={(e) => {
                setDateRange((prev: DateRange) => {
                  return {
                    ...prev,
                    end_date: new Date(e.target.value),
                  };
                });
              }}
              type="date"
              value={`${format(dateRange.end_date, "yyyy-MM-dd")}`}
            />
          </Col>
          <Col xs={12} md className="mb-4 d-flex justify-content-center">
            <Button
              onClick={handleChangeDate}
              disabled={loading}
              className="d-flex gap-2 align-items-center mb-3 px-4"
              variant="primary"
            >
              {loading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status">
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
      <Row>
        <h4 className="mt-4 mb-3">Recharge And Payment Summary </h4>
      </Row>
      <Table responsive striped>
        <thead className="table-dark">
          <tr>
            <th>Total Flexy</th>
            <th>User Percentage</th>
            <th>Total Amount To Pay</th>
            <th>Total Paid Amount</th>
            <th>Total Rest Payment</th>
          </tr>
        </thead>
        <tbody>
          <tr className="fw-bold">
            <td>
              <span className="text-primary ">
                {!loading ? (
                  `${
                    (summary &&
                      Intl.NumberFormat().format(
                        parseFloat(summary?.summarey["total Flexy"])
                      )) ||
                    "0"
                  } `
                ) : (
                  <>
                    <Spinner
                      as="span"
                      size="sm"
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                )}
              </span>
              <sub>DA</sub>
            </td>
            <td>
              <span className="fw-semibold text-dark ">
                {" "}
                {` % ${
                  (summary &&
                    Intl.NumberFormat().format(
                      parseFloat(summary?.summarey["percentage"])
                    )) ||
                  "1"
                }  `}
              </span>
            </td>
            <td>
              <span className="text-secondary ">
                {!loading ? (
                  `${
                    (summary &&
                      Intl.NumberFormat().format(
                        parseFloat(summary?.summarey["total amount to pay"])
                      )) ||
                    "0"
                  } `
                ) : (
                  <>
                    <Spinner
                      as="span"
                      size="sm"
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                )}
              </span>
              <sub>DA</sub>
            </td>
            <td>
              <span className="text-success ">
                {!loading ? (
                  `${
                    (summary &&
                      Intl.NumberFormat().format(
                        parseFloat(summary?.summarey["total paid amount"])
                      )) ||
                    "0"
                  } `
                ) : (
                  <>
                    <Spinner
                      as="span"
                      size="sm"
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                )}
              </span>
              <sub>DA</sub>
            </td>
            <td>
              <span className="text-danger ">
                {!loading ? (
                  `${
                    (summary &&
                      Intl.NumberFormat().format(
                        parseFloat(summary?.summarey["total rest paiment"])
                      )) ||
                    "0"
                  } `
                ) : (
                  <>
                    <Spinner
                      as="span"
                      size="sm"
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                )}
              </span>
              <sub>DA</sub>
            </td>
          </tr>
        </tbody>
      </Table>
      {/* payment history */}
      <Row>
        <h4 className="mt-4 mb-3">Payment History </h4>
      </Row>
      <Table responsive striped>
        <thead className="table-dark">
          <tr>
            <th>#Id</th>
            <th>Paid Amount</th>
            <th>Percentage %</th>
            <th>Flexy Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {summary && !loading && summary?.paiments_history.length > 0 ? (
            summary.paiments_history.map((payment: any) => (
              <tr key={payment.id} className="fw-bold ">
                <td>
                  <span className="text-dark ">{`# ${payment.id || 0}`}</span>
                </td>
                <td>
                  <span className="text-success ">
                    {`${
                      (summary &&
                        Intl.NumberFormat().format(
                          parseFloat(payment.paid_amount)
                        )) ||
                      "0"
                    }  `}
                  </span>

                  <sub>DA</sub>
                </td>
                <td>
                  <span className="fw-semibold text-dark ">
                    {" "}
                    {` % ${
                      (summary &&
                        Intl.NumberFormat().format(
                          parseFloat(payment.percentage)
                        )) ||
                      "1"
                    }  `}
                  </span>
                </td>
                <td>
                  <span className="text-primary ">
                    {`${
                      (summary &&
                        Intl.NumberFormat().format(
                          parseFloat(payment.flexy_amount)
                        )) ||
                      "0"
                    }  `}
                  </span>
                  <sub>DA</sub>
                </td>
                <td>
                  <span className=" fw-light text-dark ">
                    {`${(summary && payment.date) || "0000-00-0000"}`}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <>
              {!loading ? (
                <>
                  <tr className="fw-semibold ">
                    <td colSpan={5} className="p-3">
                      <span className="text-secondary ">No History</span>
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
