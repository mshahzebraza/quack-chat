import React, { /* useContext, */ useState } from "react";
import fallbackImageURL from "../assets/shahzeb.jpg";
import "../styles/Search.scss";
import "../styles/UserChat.scss";


const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);


  const handleSearch = () => {
    console.log("Search.jsx not working");
  };
  const handleSelect = () => {
    console.log("Search.jsx not working");
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };


  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user?.photoURL || fallbackImageURL} alt="Contact's Image" />
          <div className="userChatInfo">
            <span>{user?.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
