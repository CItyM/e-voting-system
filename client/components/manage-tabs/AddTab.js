import React from "react";
import InputForm from "./InputForm";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import styles from "../../styles/NewVote.module.css";
import { useAppContext } from "../../context/AppContext";
import add from "../../actions/operator/add";

export default function AddTab({ contract }) {
  const { voters } = useAppContext();

  const handleOnAddClick = async () => {
    try {
      await add(contract, voters);
    } catch (error) {
      alert(error);
    }
  };

  try {
    return (
      <Container className={styles.container}>
        <InputForm />
        <Form>
          <Form.Group>
            <Row className="mt-2">
              <Col>
                <Button onClick={async () => await handleOnAddClick()}>
                  Add
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Container>
    );
  } catch (error) {
    console.error(error);
    return <></>;
  }
}
