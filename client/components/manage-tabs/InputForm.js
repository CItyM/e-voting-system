import styles from "../../styles/NewVote.module.css";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";

export default function InputForm() {
  const { voters, setVoters } = useAppContext();

  const handleOnAddFieldClick = () => {
    const values = [...voters];
    values.push({ address: "" });
    setVoters(values);
  };

  const handleOnRemoveFieldClick = (index) => {
    const values = [...voters];
    values.splice(index, 1);
    setVoters(values);
  };

  const handleOnInputChange = (index, event) => {
    if (event.target.name === "address") {
      const values = [...voters];
      values[index].address = event.target.value;
      setVoters(values);
    }
  };

  try {
    return (
      <Form>
        <Form.Group>
          <Container>
            {voters.map((item, i) => (
              <Row className={styles.container} key={`${item}~${i}`}>
                <Container>
                  <Row>
                    <Col>
                      <Form.Label className="mt-1">{`Voter ${i}`}</Form.Label>
                    </Col>
                  </Row>
                </Container>
                <Container className={styles.container}>
                  <Row>
                    <Col xs="auto">
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder={`Voter ${i}`}
                        value={item.address}
                        onChange={(e) => handleOnInputChange(i, e)}
                      />
                    </Col>
                    {voters.length > 1 ? (
                      <Col>
                        <Button
                          variant="danger"
                          onClick={() => handleOnRemoveFieldClick(i)}
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
                <Button variant="success" onClick={handleOnAddFieldClick}>
                  +
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
