import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useFormContext } from "../../context/FormContext";
import styles from "../../styles/NewVote.module.css";

export default function SubmitButtonForm() {
  const { handleOnSubmit } = useFormContext();
  return (
    <Form.Group className={styles.main}>
      <Container className={styles.container}>
        <Row>
          <Col>
            <Button onClick={async () => await handleOnSubmit()}>Submit</Button>
          </Col>
        </Row>
      </Container>
    </Form.Group>
  );
}
