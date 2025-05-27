export function generateSessionKey(cinema, date, time) {
  const dateStr = date.toISOString().split('T')[0];
  return `${cinema}_${dateStr}_${time}`;
}

export function loadBookedSeats(sessionKey) {
  return JSON.parse(localStorage.getItem(sessionKey)) || [];
}

export function saveBookedSeats(sessionKey, selectedSeats) {
  const current = loadBookedSeats(sessionKey);
  const updated = [...new Set([...current, ...selectedSeats])];
  console.log('Saving booked seats for', sessionKey, ':', updated);
  localStorage.setItem(sessionKey, JSON.stringify(updated));
}

export function toggleSeatState(selectedSeats, index) {
  console.log('Toggling seat:', index, 'Current selection:', selectedSeats);
  const idx = selectedSeats.indexOf(index);
  if (idx >= 0) {
    return selectedSeats.filter(i => i !== index);
  } else {
    return [...selectedSeats, index];
  }
}
