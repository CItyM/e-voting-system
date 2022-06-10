import { useRouter } from "next/router";
import { useAppContext } from "../../../context/AppContext";
import { useState } from "react";
import styles from "../../../styles/NewVote.module.css";
import { Table, Nav, Form, Container, Row, Col, Button } from "react-bootstrap";
import VerifyTab from "../../../components/results-tabs/VerifyTab";

export default function results() {
  const router = useRouter();
  const { address } = router.query;
  const { contracts } = useAppContext();
  const contract = contracts.filter(
    (contract) => contract.address === address
  )[0];
  const [tab, setTab] = useState("results");
  try {
    return (
      <div>
        <Nav fill variant="tabs" defaultActiveKey="results">
          <Nav.Item onClick={() => setTab("results")}>
            <Nav.Link eventKey="add">Results</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setTab("verify")}>
            <Nav.Link eventKey="sign">Verify vote</Nav.Link>
          </Nav.Item>
        </Nav>
        <Container className={styles.container}>
          {tab === "results" ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Choice</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                {contract.choices.map((choices, index) => (
                  <tr key={index}>
                    <td>{choices.choice}</td>
                    <td>{choices.votes}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <></>
          )}
          {tab === "verify" ? <VerifyTab contract={contract} /> : <></>}
        </Container>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <></>;
  }
}
