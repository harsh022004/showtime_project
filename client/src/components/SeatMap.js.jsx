import { useState } from "react";

const SeatMap = ({ price, onSeatChange }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNo) => {
    let updated;

    if (selectedSeats.includes(seatNo)) {
      updated = selectedSeats.filter((s) => s !== seatNo);
    } else {
      updated = [...selectedSeats, seatNo];
    }

    setSelectedSeats(updated);
    onSeatChange(updated.length * price, updated);
  };

  return (
    <div className="row">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className={`seat ${selectedSeats.includes(i) ? "selected" : ""}`}
          onClick={() => toggleSeat(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default SeatMap;