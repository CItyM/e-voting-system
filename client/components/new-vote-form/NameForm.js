import { Container } from "react-bootstrap";
import { Col, Row, Form } from "react-bootstrap";
import { useFormContext } from "../../context/FormContext";
import styles from "../../styles/NewVote.module.css";

export default function NameForm() {
  const { handleOnInputChange, name } = useFormContext();

  return (
    <Form.Group>
      <Container className={styles.container}>
        <Row>
          <Col>
            <Form.Label>Vote Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Vote Name"
              value={name}
              onChange={(e) => handleOnInputChange(0, e)}
            />
          </Col>
        </Row>
      </Container>
    </Form.Group>
  );
}
