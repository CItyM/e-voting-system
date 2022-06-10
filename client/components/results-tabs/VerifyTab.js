import { Form, Button, Container, Row, Col } from "react-bootstrap";
import verifyVote from "../../actions/voter/verify-vote";
import { useAppContext } from "../../context/AppContext";
import styles from "../../styles/NewVote.module.css";

export default function VerifyTab({ contract }) {
  const { keys, handleOnFileChange } = useAppContext();

  const handleOnVerifyClick = async () => {
    try {
      await verifyVote(contract, keys);
    } catch (error) {
      alert(error);
    }
  };

  try {
    return (
      <Form>
        <Row className="mt-3">
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
          <Row className="mt-3">
            <Col>
              <Button onClick={async () => await handleOnVerifyClick()}>
                Verify
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
    );
  } catch (error) {
    console.error(error);
    return <></>;
  }
}
