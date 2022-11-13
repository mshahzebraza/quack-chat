import React from "react";
import { Link } from "react-router-dom";

import "./Error.scss";

const Error = () => {
  return (
    <section>
      <div className="mediaBox">
        <h1>404</h1>
        <div className="media" />
      </div>
      <div className="contentBox">
        <h3 className="h2">Look like you're lost</h3>
        <p>the page you are looking for not available!</p>
        <Link className="toHome" to="/">
          Go to Home
        </Link>
      </div>
    </section>
  );
};

export default Error;
