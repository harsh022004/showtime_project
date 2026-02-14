import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const toggleAuthMode = () => setIsSignup(!isSignup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      if (!isSignup) {
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful!");
        navigate("/");
      } else {
        alert("Signup successful! Please login.");
        setIsSignup(false);
      }
    } catch (err) {
      alert(err.response?.data || "Authentication failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ marginBottom: "20px" }}>{isSignup ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="btn btn-primary" type="submit">Proceed</button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "var(--text-dim)" }}>
          {isSignup ? "Already have an account? " : "New user? "}
          <span onClick={toggleAuthMode} style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;