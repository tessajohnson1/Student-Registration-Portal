import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");

      setFormData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        department: res.data.department,
        year: res.data.year,
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put("/profile", {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
      });

      alert("Profile Updated Successfully!");
    } catch (err) {
      console.log(err);
      alert("Profile Update Failed");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete("/profile");

      localStorage.removeItem("token");

      alert("Account deleted successfully!");

      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow p-4">

        <h1 className="text-center text-primary mb-4">
          My Profile
        </h1>

        <form onSubmit={handleUpdate}>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={formData.email}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              className="form-control"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Year</label>
            <input
              className="form-control"
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <button
  type="submit"
  className="btn btn-primary w-100"
>
  Update Profile
</button>

<Link
  to="/change-password"
  className="btn btn-warning w-100 mt-3"
>
  Change Password
</Link>

<button
  type="button"
  className="btn btn-danger w-100 mt-3"
  onClick={handleDelete}
>
  Delete Account
</button>

        </form>

      </div>
    </div>
  );
}

export default Profile;