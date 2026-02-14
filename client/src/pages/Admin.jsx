import { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminAuth") === "true"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState([]);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: username,
        password: password,
      });

     
      if (res.data.user.role === "admin") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("adminAuth", "true");
        setIsAuthenticated(true);
      } else {
        alert("Access Denied: You are not an Admin");
      }
    } catch (err) {
      alert(err.response?.data || "Invalid Admin Credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  
  useEffect(() => {
    if (isAuthenticated) {
      axios.get("http://localhost:5000/api/bookings/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(res => setBookings(res.data))
      .catch(err => console.log(err));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Admin Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const revenue = bookings.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <button className="btn" onClick={handleLogout} style={{ float: "right", marginBottom: "20px" }}>
        Logout
      </button>

      <h3>Total Bookings: {bookings.length}</h3>
      <h3>Total Revenue: ₹{revenue}</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie</th>
            <th>Seats</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b._id.slice(-6).toUpperCase()}</td>
              <td>{b.movie}</td>
              <td>{b.seats.join(", ")}</td>
              <td>₹{b.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;