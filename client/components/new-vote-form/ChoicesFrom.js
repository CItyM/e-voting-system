import React from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useFormContext } from "../../context/FormContext";
import styles from "../../styles/NewVote.module.css";

export default function ChoicesFrom() {
  const {
    choices,
    handleOnInputChange,
    handleOnRemoveFields,
    handleOnAddFields,
  } = useFormContext();

  return (
    <Form.Group>
      <Container>
        {choices.map((item, i) => (
          <Row className={styles.container} key={`${item}~${i}`}>
            <Container>
              <Row>
                <Col>
                  <Form.Label className="mt-3">{`Choice ${i}`}</Form.Label>
                </Col>
              </Row>
            </Container>
            <Container className={styles.container}>
              <Row>
                <Col xs="auto">
                  <Form.Control
                    type="text"
                    name="choice"
                    placeholder={`Choice ${i}`}
                    value={item.choice}
                    onChange={(e) => handleOnInputChange(i, e)}
                  />
                </Col>
                {choices.length > 1 ? (
                  <Col>
                    <Button
                      variant="danger"
                      onClick={() => handleOnRemoveFields(i)}
                    >
                      X
                    </Button>
                  </Col>
                ) : (
                  <></>
                )}
              </Row>
            </Container>
          </Row>
        ))}
        <Row className={styles.container}>
          <Col xs="auto">
            <Button variant="success" onClick={handleOnAddFields}>
              +
            </Button>
          </Col>
        </Row>
      </Container>
    </Form.Group>
  );
}
