import { Container } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { useFormContext } from "../../context/FormContext";
import styles from "../../styles/NewVote.module.css";

export default function DateTimeForm() {
  const {
    registrationStartDate,
    registrationEndDate,
    votingStartDate,
    votingEndDate,
    handleOnRegistrationStartDateChange,
    handleOnRegistrationEndDateChange,
    handleOnVotingStartDateChange,
    handleOnVotingEndDateChange,
  } = useFormContext();

  return (
    <Form.Group>
      <Container className={styles.container}>
        <Row>
          <Col>
            <Form.Label>Registration Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={registrationStartDate}
              onChange={(e) => handleOnRegistrationStartDateChange(e)}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Form.Label>Registration End Date</Form.Label>{" "}
            <Form.Control
              type="datetime-local"
              value={registrationEndDate}
              onChange={(e) => handleOnRegistrationEndDateChange(e)}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs="auto">
            <Form.Label>Voting Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={votingStartDate}
              onChange={(e) => handleOnVotingStartDateChange(e)}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs="auto">
            <Form.Label>Voting End Date</Form.Label>{" "}
            <Form.Control
              type="datetime-local"
              value={votingEndDate}
              onChange={(e) => handleOnVotingEndDateChange(e)}
            />
          </Col>
        </Row>
      </Container>
    </Form.Group>
  );
}
