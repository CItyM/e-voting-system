import Link from "next/link";
import { Navbar, Button } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import shortAddr from "../helpers/short-address";
import { connect, disconnect } from "../web3/connection";

const Header = () => {
  const { isLogged, loggedAccount, handleOnLogOut, handleOnLogIn } =
    useAppContext();

  return (
    <Navbar bg="dark" className="justify-content-between" variant="dark">
      <Link href="/">
        <Navbar.Brand id="app-name" style={{ cursor: "pointer" }}>
          <h4 className="d-inline-block align-top ms-3">E-Voting</h4>
        </Navbar.Brand>
      </Link>
      <div>
        <Link href="/new-vote">
          <Button style={{ marginRight: 10 }} className="mr-5">
            New Vote
          </Button>
        </Link>
        <Button
          style={{ marginRight: isLogged ? 0 : 10 }}
          onClick={async () => await connect(handleOnLogIn)}
          variant="primary"
        >
          {isLogged ? shortAddr(loggedAccount) : "Connect"}
        </Button>
        {isLogged ? (
          <Button
            onClick={() => disconnect(handleOnLogOut)}
            style={{
              marginRight: 10,
            }}
            variant="danger"
          >
            X
          </Button>
        ) : (
          <></>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
