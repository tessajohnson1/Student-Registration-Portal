import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setStudent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">

        <h2 className="text-primary mb-4">
          Student Dashboard
        </h2>

        {student ? (
          <>
            <h4>Welcome, {student.name} 👋</h4>

            <hr />

            <p><strong>Email:</strong> {student.email}</p>

            <p><strong>Phone:</strong> {student.phone}</p>

            <p><strong>Department:</strong> {student.department}</p>

            <p><strong>Year:</strong> {student.year}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}

      </div>
    </div>
  );
}

export default Dashboard;