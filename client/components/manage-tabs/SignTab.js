import InputForm from "./InputForm";
import styles from "../../styles/NewVote.module.css";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import sign from "../../actions/operator/sign";

export default function SignTab({ contract }) {
  const { keys, voters, handleOnFileChange } = useAppContext();

  const handleOnSignClick = async () => {
    try {
      await sign(contract, keys, voters);
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
                  <Button onClick={async () => await handleOnSignClick()}>
                    Sign
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form.Group>
        </Form>
      </Container>
    );
  } catch (error) {
    console.error(error);
    return <></>;
  }
}
