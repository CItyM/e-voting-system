import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from "../../styles/NewVote.module.css";
import { useAppContext } from "../../context/AppContext";
import register from "../../actions/voter/register";
import update from "../../actions/voter/update";

export default function RegisterTab({ contract }) {
  const { keys, handleOnFileChange } = useAppContext();

  const handleOnRegisterClick = async () => {
    try {
      await register(contract);
    } catch (error) {
      alert(error);
    }
  };

  const handleOnUpdateKeys = () => {
    try {
      update(contract, keys);
    } catch (error) {
      alert(error);
    }
  };

  try {
    return (
      <Container className={styles.container}>
        {contract.isAVoter ? (
          <Container className={styles.container}>
            {contract.voter.signedBlindedUUID.toString() !== "0" ? (
              <Form>
                <Row>
                  <Col>
                    <Form.Label>Signing Keys</Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <input
                      type="file"
                      name="file"
                      onChange={handleOnFileChange}
                    />
                  </Col>
                </Row>
                <Container className={styles.container}>
                  <Row className="mt-3">
                    <Col>
                      <Button onClick={handleOnUpdateKeys}>Update keys</Button>
                    </Col>
                  </Row>
                </Container>
              </Form>
            ) : (
              <Form>
                <Row>
                  <Col>
                    <Button
                      disabled={contract.voter.registered}
                      onClick={async () => await handleOnRegisterClick()}
                    >
                      Register
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Container>
        ) : (
          <h1>Not Eligible For Registration</h1>
        )}
      </Container>
    );
  } catch (error) {
    console.error(error);
    return <></>;
  }
}
