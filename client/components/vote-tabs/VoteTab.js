import { useState } from "react";
import {
  Form,
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import styles from "../../styles/NewVote.module.css";
import { useAppContext } from "../../context/AppContext";
import vote from "../../actions/voter/vote";

export default function VoteTab({ contract }) {
  const { keys, handleOnFileChange } = useAppContext();
  const [selectedChoice, setSelectedChoice] = useState({ text: "Choices" });

  const handleOnVoteClick = async () => {
    try {
      await vote(contract, keys, selectedChoice.index);
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
        <DropdownButton
          className="mt-3"
          variant="outline-secondary"
          title={selectedChoice.text}
          id="input-group-dropdown-1"
        >
          {contract.choices.map((choice, i) => (
            <Dropdown.Item
              key={i}
              onClick={() =>
                setSelectedChoice({
                  text: choice.choice,
                  index: i,
                })
              }
            >
              {choice.choice}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Container className={styles.container}>
          <Row>
            <Col>
              <Button
                className="mt-3"
                onClick={async () => await handleOnVoteClick()}
              >
                Vote
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
