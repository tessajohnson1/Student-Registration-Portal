import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary">
        Student Registration Portal
      </h1>

      <p className="lead mt-3">
        Welcome to the Student Registration Portal built using the MERN Stack.
      </p>

      <Link to="/login" className="btn btn-success btn-lg mt-3">
        Get Started
      </Link>
    </div>
  );
}

export default Home;