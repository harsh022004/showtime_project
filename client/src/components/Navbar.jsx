import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminAuth");
    
    alert("Logged out successfully!");
    
    
    navigate("/login");
  };
  

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/?search=${query}`);
    setQuery("");
  };

  return (
    <nav>
      <div className="logo">🎬 SHOWTIME</div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </form>

      <div className="navb">
        <Link to="/"><span>Movies</span></Link>
        <Link to="/history"><span>My Bookings</span></Link>
        
        
        {isLoggedIn ? (
          <span 
            className="login-btn" 
            onClick={handleLogout} 
            style={{ cursor: "pointer" }}
          >
            Logout
          </span>
        ) : (
          <Link to="/login">
            <span className="login-btn">Login</span>
          </Link>
        )}

        <Link to="/admin"><span>Admin</span></Link>
      </div>
    </nav>
  );
};

export default Navbar;