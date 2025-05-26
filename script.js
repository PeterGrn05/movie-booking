const dateButtonsContainer = document.getElementById('dateButtonsContainer');
const timeButtonsContainer = document.getElementById('timeButtonsContainer');

const today = new Date();
const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  return date;
});

days.forEach((date, index) => {
  const btn = document.createElement('button');
  btn.className = 'day-btn' + (index === 0 ? ' selected' : '');

  btn.textContent = date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  btn.onclick = () => {
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    loadSessions(date);
  };

  dateButtonsContainer.appendChild(btn);
});

loadSessions(days[0]);

function loadSessions(date) {
  timeButtonsContainer.innerHTML = '';

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  for (let i = 1; i <= 3; i++) {
    const cinemaCard = document.createElement('div');
    cinemaCard.className = 'cinema-card';

    const title = document.createElement('h3');
    title.textContent = `Кинотеатр №${i}`;
    cinemaCard.appendChild(title);

    const addr = document.createElement('p');
    addr.textContent = `Адрес ${i}`;
    cinemaCard.appendChild(addr);

    const sessionTimes = document.createElement('div');
    sessionTimes.className = 'session-times';

    let sessionTime = new Date(date);
    sessionTime.setHours(11, 0);

    const endTime = new Date(date);
    endTime.setHours(23, 0);

    while (sessionTime <= endTime) {
      const timeStr = sessionTime.toTimeString().slice(0, 5);

      const timeBtn = document.createElement('button');
      timeBtn.className = 'time-btn';
      timeBtn.textContent = timeStr;

      const isPastSession = isToday && sessionTime <= now;

      if (isPastSession) {
        timeBtn.disabled = true;
        timeBtn.classList.add('past');
      } else {
        timeBtn.onclick = () => openSeatModal(`Кинотеатр №${i}`, date, timeStr);
      }

      sessionTimes.appendChild(timeBtn);
      sessionTime.setMinutes(sessionTime.getMinutes() + 150);
    }

    cinemaCard.appendChild(sessionTimes);
    timeButtonsContainer.appendChild(cinemaCard);
  }
}

const seatModal = document.getElementById('seatModal');
const seatsGrid = document.getElementById('seatsGrid');
const confirmSeatsBtn = document.getElementById('confirmSeats');
const closeModalBtn = document.getElementById('closeModal');

const seatSelectionSection = document.getElementById('seatSelectionSection');
const confirmationMessage = document.getElementById('confirmationMessage');

let selectedSeats = [];
let currentSessionKey = '';

function openSeatModal(cinema, date, time) {
  seatModal.classList.remove('hidden');
  selectedSeats = [];
  currentSessionKey = generateSessionKey(cinema, date, time);
  renderSeats();
  seatSelectionSection.classList.remove('hidden');
  confirmationMessage.classList.add('hidden');
}

function generateSessionKey(cinema, date, time) {
  const dateStr = date.toISOString().split('T')[0];
  return `${cinema}_${dateStr}_${time}`;
}

function renderSeats() {
  seatsGrid.innerHTML = '';
  const bookedSeats = JSON.parse(localStorage.getItem(currentSessionKey)) || [];

  for (let i = 0; i < 50; i++) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.dataset.index = i;

    if (bookedSeats.includes(i)) {
      seat.classList.add('booked');
    } else if (selectedSeats.includes(i)) {
      seat.classList.add('selected');
      seat.addEventListener('click', () => toggleSeat(i, seat));
    } else {
      seat.addEventListener('click', () => toggleSeat(i, seat));
    }

    seatsGrid.appendChild(seat);
  }
}

function toggleSeat(index, element) {
  const isSelected = selectedSeats.includes(index);
  if (isSelected) {
    selectedSeats = selectedSeats.filter(seat => seat !== index);
    element.classList.remove('selected');
  } else {
    selectedSeats.push(index);
    element.classList.add('selected');
  }
}

function saveSelectedSeats() {
  const bookedSeats = JSON.parse(localStorage.getItem(currentSessionKey)) || [];
  const newBooked = [...new Set([...bookedSeats, ...selectedSeats])];
  localStorage.setItem(currentSessionKey, JSON.stringify(newBooked));
}

confirmSeatsBtn.onclick = () => {
  if (selectedSeats.length === 0) {
    alert('Пожалуйста, выберите места');
    return;
  }

  saveSelectedSeats();

  selectedSeats.forEach(index => {
    const seatElem = seatsGrid.querySelector(`.seat[data-index='${index}']`);
    if (seatElem) {
      seatElem.classList.remove('selected');
      seatElem.classList.add('booked');
      seatElem.replaceWith(seatElem.cloneNode(true));
    }
  });

  selectedSeats = [];

  seatSelectionSection.classList.add('hidden');
  confirmationMessage.classList.remove('hidden');
};

closeModalBtn.onclick = () => {
  seatModal.classList.add('hidden');

  seatSelectionSection.classList.remove('hidden');
  confirmationMessage.classList.add('hidden');
  selectedSeats = [];
};
