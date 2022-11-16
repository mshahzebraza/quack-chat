import { authUserAtom, logOutUser } from "../../firebase/auth";
import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/Navbar.scss";
import { useAtom } from "jotai";

/**
 * The top toola
 */
const Navbar = () => {
  const [authUser] = useAtom(authUserAtom);
  console.log("authUser: ", authUser);
  return (
    <div className="navbar">
      <span className="logo">React Chat App</span>
      <div className="user">
        <img src={authUser?.photoURL || fallbackImageURL} alt="User's Image" />
        <span>{authUser.displayName || "Dummy"}</span>
        <button onClick={() => logOutUser()}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
