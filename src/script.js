import {
  generateSessionKey,
  loadBookedSeats,
  saveBookedSeats,
  toggleSeatState
} from './seats.js';

const dateButtonsContainer = document.getElementById('dateButtonsContainer');
const timeButtonsContainer = document.getElementById('timeButtonsContainer');
const seatModal = document.getElementById('seatModal');
const seatsGrid = document.getElementById('seatsGrid');
const confirmSeatsBtn = document.getElementById('confirmSeats');
const closeModalBtn = document.getElementById('closeModal');
const seatSelectionSection = document.getElementById('seatSelectionSection');
const confirmationMessage = document.getElementById('confirmationMessage');

let selectedDate = new Date();
let selectedSeats = [];
let currentSessionKey = '';

const cinemas = [
  {
    name: 'Синема Стар Авеню',
    times: ['12:00', '14:30', '17:00', '19:30', '22:00']
  },
  {
    name: 'Каро 8 Спектр',
    times: ['10:00', '13:30', '17:00', '20:30', '23:00']
  },
  {
    name: 'Синема Парк Принз Плаза',
    times: ['10:00', '13:00', '16:00', '19:00', '22:00']
  }
];

function renderDateButtons() {
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const btn = document.createElement('button');
    btn.className = 'day-btn';
    btn.textContent = date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
    if (i === 0) btn.classList.add('selected');

    btn.addEventListener('click', () => {
      selectedDate = date;
      document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      renderTimeButtons();
      console.log('Selected date:', date);
    });

    dateButtonsContainer.appendChild(btn);
  }
}

function renderTimeButtons() {
  timeButtonsContainer.innerHTML = '';
  cinemas.forEach(cinema => {
    const card = document.createElement('div');
    card.className = 'cinema-card';

    const title = document.createElement('h3');
    title.textContent = cinema.name;
    card.appendChild(title);

    const sessionWrap = document.createElement('div');
    sessionWrap.className = 'session-times';

    cinema.times.forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'time-btn';
      btn.textContent = time;

      btn.onclick = () => {
        // eslint-disable-next-line no-undef
        openSeatModal(cinema.name, selectedDate, time);
      };

      sessionWrap.appendChild(btn);
    });

    card.appendChild(sessionWrap);
    timeButtonsContainer.appendChild(card);
  });
}

window.openSeatModal = function (cinema, date, time) {
  seatModal.classList.remove('hidden');
  selectedSeats = [];
  currentSessionKey = generateSessionKey(cinema, date, time);
  renderSeats();
  seatSelectionSection.classList.remove('hidden');
  confirmationMessage.classList.add('hidden');
};

function renderSeats() {
  seatsGrid.innerHTML = '';
  const booked = loadBookedSeats(currentSessionKey);

  for (let i = 0; i < 50; i++) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.dataset.index = i;

    if (booked.includes(i)) {
      seat.classList.add('booked');
    } else {
      if (selectedSeats.includes(i)) seat.classList.add('selected');

      seat.addEventListener('click', () => {
        selectedSeats = toggleSeatState(selectedSeats, i);
        renderSeats();
      });
    }

    seatsGrid.appendChild(seat);
    console.log('Rendering seats. Booked:', loadBookedSeats(currentSessionKey));
  }
}

confirmSeatsBtn.onclick = () => {
  if (selectedSeats.length === 0) {
    alert('Пожалуйста, выберите места');
    return;
  }
  console.log('Confirming seats:', selectedSeats);
  saveBookedSeats(currentSessionKey, selectedSeats);
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

renderDateButtons();
renderTimeButtons();
