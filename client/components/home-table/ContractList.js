import React from "react";
import { Table, Container } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import Contract from "./Contract";

export default function ContractList() {
  const { contracts, isLogged } = useAppContext();
  return (
    <Container>
      {isLogged ? (
        <Table responsive>
          <thead>
            <tr>
              <th>Address</th>
              <th>Owner</th>
              <th>Name</th>
              <th>Registration Time</th>
              <th>Voting Time</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, i) => (
              <Contract key={contract.address} contract={contract} />
            ))}
          </tbody>
        </Table>
      ) : (
        <></>
      )}
    </Container>
  );
}
