import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const publicPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
  ];

  const isPublicPage = publicPages.includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Student Registration Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto">
            {token && !isPublicPage ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-light me-2 mt-2 mt-lg-0"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className="btn btn-light me-2 mt-2 mt-lg-0"
                >
                  Profile
                </Link>

                <button
                  className="btn btn-danger mt-2 mt-lg-0"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-light me-2 mt-2 mt-lg-0"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-warning mt-2 mt-lg-0"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;