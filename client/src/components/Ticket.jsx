import { useState, useEffect } from "react";

const Ticket = ({ booking }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      
      const createdTime = new Date(booking.createdAt).getTime();
      
      const expiryTime = createdTime + 5 * 60 * 60 * 1000;
      const now = new Date().getTime();
      
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [booking.createdAt]);

  return (
    <div className="ticket" style={{ position: 'relative' }}>
      <div className="ticket-left">
        <small style={{ color: timeLeft === "EXPIRED" ? "#64748b" : "#f84464", fontWeight: "700" }}>
          {timeLeft === "EXPIRED" ? "INVALID / EXPIRED" : "CONFIRMED"}
        </small>
        <h3>{booking.movie}</h3>
        <p><strong>Showtime:</strong> {booking.showtime}</p>
        <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>
        <p><strong>Amount:</strong> ₹{booking.total}</p>
        
        
        <div style={{ 
          marginTop: "10px", 
          padding: "5px 10px", 
          background: "rgba(255,255,255,0.05)", 
          borderRadius: "5px",
          display: "inline-block",
          fontSize: "12px"
        }}>
          <span style={{ color: "var(--text-dim)" }}>Expires in: </span>
          <span style={{ color: timeLeft === "EXPIRED" ? "red" : "#ffd700", fontWeight: "bold" }}>
            {timeLeft}
          </span>
        </div>
      </div>
      <div className="ticket-right">#{booking.id}</div>
    </div>
  );
};

export default Ticket;