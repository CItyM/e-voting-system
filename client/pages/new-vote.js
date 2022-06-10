import { Form, Col, Row, Button, Container } from "react-bootstrap";
import ChoicesFrom from "../components/new-vote-form/ChoicesFrom";
import NameForm from "../components/new-vote-form/NameForm";
import FormContextProvider from "../components/context-providers/FormContextProvider";
import DateTimeForm from "../components/new-vote-form/DateTimeForm";
import SubmitButtonForm from "../components/new-vote-form/SubmitButtonForm";
import styles from "../styles/NewVote.module.css";

export default function NewVote() {
  return (
    <FormContextProvider>
      <Container className={styles.main}>
        <Row>
          <Col>
            <Form>
              <NameForm />
              <ChoicesFrom />
              <DateTimeForm />
              <SubmitButtonForm />
            </Form>
          </Col>
        </Row>
      </Container>
    </FormContextProvider>
  );
}
