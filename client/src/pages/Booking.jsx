import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie;
  const showtime = location.state?.showtime;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]); 
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (movie && showtime) {
      axios.get(`http://localhost:5000/api/bookings/booked-seats?movie=${movie.title}&showtime=${showtime}`)
        .then(res => setBookedSeats(res.data))
        .catch(err => console.error("Error fetching seats", err));
    }
  }, [movie, showtime]);

  if (!movie || !showtime) {
    return <div className="page">Invalid Booking Request</div>;
  }

  const toggleSeat = (seatId, price) => {
    
    if (bookedSeats.includes(seatId)) return;

    let updatedSeats;
    if (selectedSeats.find((s) => s.id === seatId)) {
      updatedSeats = selectedSeats.filter((s) => s.id !== seatId);
    } else {
      updatedSeats = [...selectedSeats, { id: seatId, price }];
    }
    setSelectedSeats(updatedSeats);
    setTotal(updatedSeats.reduce((sum, seat) => sum + seat.price, 0));
  };

  const renderSeats = (rows, cols, price, prefix) => {
    const seats = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const seatId = `${prefix}${String.fromCharCode(65 + r)}${c}`;
        const isSelected = selectedSeats.find((s) => s.id === seatId);
        const isBooked = bookedSeats.includes(seatId); 

        seats.push(
          <div
            key={seatId}
            className={`seat ${isSelected ? "selected" : ""} ${isBooked ? "booked" : ""}`}
            style={isBooked ? { backgroundColor: "#334155", cursor: "not-allowed", opacity: 0.5 } : {}}
            onClick={() => toggleSeat(seatId, price)}
          >
            {seatId}
          </div>
        );
      }
    }
    return seats;
  };

  const confirmFinalBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book tickets!");
      navigate("/login");
      return;
    }

    if (!selectedSeats.length) {
      alert("Please select seats.");
      return;
    }

    try {
      const newBooking = {
        movie: movie.title,
        showtime,
        seats: selectedSeats.map((s) => s.id),
        total,
      };

      await axios.post("http://localhost:5000/api/bookings", newBooking, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("🎉 Booking Successful!");
      navigate("/history");
    } catch (err) {
      
      alert(err.response?.data || "Booking failed. Try again.");
      window.location.reload();
    }
  };

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h2>Select Your Seats</h2>
      <h3 style={{ marginBottom: "10px", color: "var(--primary)" }}>
        {movie.title} - {showtime}
      </h3>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="screen">SCREEN THIS WAY</div>
        <p style={{ marginBottom: "10px", color: "#ffd700", fontWeight: 600 }}>PRIME - ₹350</p>
        <div className="row">{renderSeats(2, 8, 350, "P")}</div>
        <p style={{ margin: "30px 0 10px", color: "#94a3b8", fontWeight: 600 }}>CLASSIC - ₹150</p>
        <div className="row">{renderSeats(4, 10, 150, "C")}</div>
      </div>
      <div className="price-tag" style={{ fontWeight: 700, fontSize: "28px" }}>
        Total: <span style={{ color: "var(--primary)" }}>₹{total}</span>
      </div>
      <button className="btn btn-primary" onClick={confirmFinalBooking} style={{ marginTop: "30px", width: "250px" }}>
        Confirm & Pay
      </button>
    </div>
  );
};

export default Booking;