import React from "react";
import styles from "../../styles/NewVote.module.css";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import tally from "../../actions/operator/tally";

export default function TallyTab({ contract }) {
  const { keys, handleOnFileChange } = useAppContext();

  const handleOnTallyVotesClick = async () => {
    try {
      await tally(contract, keys);
    } catch (error) {
      alert(error);
    }
  };

  try {
    return (
      <Form>
        <Form.Group>
          <Row>
            <Col>
              <Form.Label>Signing Keys</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <input type="file" name="file" onChange={handleOnFileChange} />
            </Col>
          </Row>
          <Container className={styles.container}>
            <Row className="mt-2">
              <Col>
                <Button onClick={async () => await handleOnTallyVotesClick()}>
                  Tally Votes
                </Button>
              </Col>
            </Row>
          </Container>
        </Form.Group>
      </Form>
    );
  } catch (error) {
    console.error(error);
    return <></>;
  }
}
