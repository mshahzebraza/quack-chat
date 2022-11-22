import { useAtom } from "jotai";
import { logOutUser } from "../../firebase/auth";
import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/Navbar.scss";
import { authUserAtom } from "../App";

/**
 * The top
 */
const Navbar = () => {
  const [authUser] = useAtom(authUserAtom);
  return (
    <div className="navbar">
      <span className="logo">React Chat App</span>
      <div className="user">
        <img src={authUser?.photoURL || fallbackImageURL} alt="User's Image" />
        <span>{authUser.displayName || "unauthorized"}</span>
        <button onClick={() => logOutUser()}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
