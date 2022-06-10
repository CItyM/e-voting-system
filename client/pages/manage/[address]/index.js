import { useRouter } from "next/router";
import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import styles from "../../../styles/NewVote.module.css";
import { Nav, Container } from "react-bootstrap";
import TallyTab from "../../../components/manage-tabs/TallyTab";
import SignTab from "../../../components/manage-tabs/SignTab";
import AddTab from "../../../components/manage-tabs/AddTab";

export default function manage() {
  const router = useRouter();
  const { address } = router.query;
  const { contracts } = useAppContext();
  const contract = contracts.filter(
    (contract) => contract.address === address
  )[0];
  const [tab, setTab] = useState("add");

  return (
    <div>
      <Nav fill variant="tabs" defaultActiveKey="add">
        <Nav.Item onClick={() => setTab("add")}>
          <Nav.Link eventKey="add">Add Voters</Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={() => setTab("sign")}>
          <Nav.Link eventKey="sign">Sign Voters</Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={() => setTab("tally")}>
          <Nav.Link eventKey="tally">Tally Votes</Nav.Link>
        </Nav.Item>
      </Nav>
      <Container className={styles.main}>
        {tab === "add" ? <AddTab contract={contract} /> : <></>}
        {tab === "sign" ? <SignTab contract={contract} /> : <></>}
        {tab === "tally" ? <TallyTab contract={contract} /> : <></>}
      </Container>
    </div>
  );
}
