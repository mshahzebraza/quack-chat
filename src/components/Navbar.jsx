import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/Navbar.scss";

const Navbar = () => {

  const currentUser = {}; // TODO: temporary
  const handleLogout = () => {
    console.log("Navbar.jsx not working");
  };

  return (
    <div className="navbar">
      <span className="logo">React Chat App</span>
      <div className="user">
        <img
          src={currentUser?.photoURL || fallbackImageURL}
          alt="User's Image"
        />
        <span>{currentUser.displayName || "Dummy"}</span>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
