import { useEffect, useState } from "react";
import axios from "axios";
import Ticket from "../components/Ticket";

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem("token");
      
     
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/bookings/history", {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  if (loading) return <div className="page">Loading your tickets...</div>;

  return (
    <div className="page">
      <h2>My Bookings</h2>
      <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '20px' }}>
        Note: Tickets are valid for 5 hours from the time of booking.
      </p>

      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <p>No active bookings found.</p>
        </div>
      ) : (
        bookings.map((b) => (
          
          <Ticket key={b._id} booking={{ ...b, id: b._id.slice(-6).toUpperCase() }} />
        ))
      )}
    </div>
  );
};

export default History;