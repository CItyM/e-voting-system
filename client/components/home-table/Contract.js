import Link from "next/link";
import { Button } from "react-bootstrap";
import shortAddr from "../../helpers/short-address";
import tableTime from "../../helpers/table-time";
import { useAppContext } from "../../context/AppContext";
import { utils } from "web3";

export default function Contract({ contract }) {
  const { loggedAccount } = useAppContext();
  const timeNow = (new Date().valueOf() / 1000) | 0;
  const copy = (field) => {
    const res = contract[field];
    navigator.clipboard.writeText(res);
    alert(`${res} copied to clipboard`);
  };

  return (
    <tr>
      <td style={{ cursor: "pointer" }} onClick={() => copy("address")}>
        {shortAddr(contract.address)}
      </td>
      <td style={{ cursor: "pointer" }} onClick={() => copy("owner")}>
        {shortAddr(contract.owner)}
      </td>
      <td>{contract.name}</td>
      <td>{tableTime(contract.registrationTime)}</td>
      <td>{tableTime(contract.votingTime)}</td>
      <td>
        {contract.tallied ? (
          <Link href={`/results/${contract.address}`}>
            <Button>Results</Button>
          </Link>
        ) : (
          <Link href={`/vote/${contract.address}`}>
            <Button>Vote</Button>
          </Link>
        )}
        {loggedAccount !== "" &&
        contract.owner === utils.toChecksumAddress(loggedAccount) ? (
          <Link href={`/manage/${contract.address}`}>
            <Button className="ms-2">Manage</Button>
          </Link>
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
}
