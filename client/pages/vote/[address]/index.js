import { useRouter } from "next/router";
import { useState } from "react";
import { Nav, Container } from "react-bootstrap";
import RegisterTab from "../../../components/vote-tabs/RegisterTab";
import VoteTab from "../../../components/vote-tabs/VoteTab";
import { useAppContext } from "../../../context/AppContext";
import styles from "../../../styles/NewVote.module.css";

export default function vote() {
  const router = useRouter();
  const { address } = router.query;
  const { contracts } = useAppContext();
  const contract = contracts.filter(
    (contract) => contract.address == address
  )[0];
  const [tab, setTab] = useState("register");

  return (
    <div>
      <Nav fill variant="tabs" defaultActiveKey="register">
        <Nav.Item onClick={() => setTab("register")}>
          <Nav.Link eventKey="register">Register</Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={() => setTab("vote")}>
          <Nav.Link eventKey="vote">Vote</Nav.Link>
        </Nav.Item>
      </Nav>
      <Container className={styles.main}>
        {tab === "register" ? <RegisterTab contract={contract} /> : <></>}
        {tab === "vote" ? <VoteTab contract={contract} /> : <></>}
      </Container>
    </div>
  );
}
