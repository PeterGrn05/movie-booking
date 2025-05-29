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
const closeModalCross = document.getElementById('closeModalCross');

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

      const [hours, minutes] = time.split(':').map(Number);
      const sessionDate = new Date(selectedDate);
      sessionDate.setHours(hours, minutes, 0, 0);

      const now = new Date();
      const isPast = sessionDate < now;

      if (isPast) {
        btn.classList.add('past');
        btn.disabled = true;
      } else {
        btn.onclick = () => {
          // eslint-disable-next-line no-undef
          openSeatModal(cinema.name, selectedDate, time);
        };
      }

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

  const rows = 5;
  const cols = 10;
  const booked = loadBookedSeats(currentSessionKey);

  // Добавим верхнюю строку с номерами мест
  const topRow = document.createElement('div');
  topRow.className = 'seat-row label-row';
  topRow.innerHTML = '<div class="corner-cell"></div>'; // уголок

  for (let c = 1; c <= cols; c++) {
    const label = document.createElement('div');
    label.className = 'seat-label';
    label.textContent = c;
    topRow.appendChild(label);
  }

  seatsGrid.appendChild(topRow);

  for (let r = 0; r < rows; r++) {
    const row = document.createElement('div');
    row.className = 'seat-row';

    // Добавим номер ряда слева
    const rowLabel = document.createElement('div');
    rowLabel.className = 'seat-label';
    rowLabel.textContent = r + 1;
    row.appendChild(rowLabel);

    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;
      const seat = document.createElement('div');
      seat.className = 'seat';
      seat.dataset.index = index;

      if (booked.includes(index)) {
        seat.classList.add('booked');
      } else {
        if (selectedSeats.includes(index)) seat.classList.add('selected');

        seat.addEventListener('click', () => {
          selectedSeats = toggleSeatState(selectedSeats, index);
          renderSeats();
        });
      }

      row.appendChild(seat);
    }

    seatsGrid.appendChild(row);
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

  // Скрываем выбор, показываем сообщение
  seatSelectionSection.classList.add('hidden');
  confirmationMessage.classList.remove('hidden');
  closeModalCross.classList.add('hidden-cross'); // Скрываем крестик
};

closeModalBtn.onclick = () => {
  seatModal.classList.add('hidden');
  seatSelectionSection.classList.remove('hidden');
  confirmationMessage.classList.add('hidden');
  closeModalCross.classList.remove('hidden-cross'); // Показываем крестик снова
  selectedSeats = [];
};

closeModalCross.onclick = () => {
  seatModal.classList.add('hidden');
  seatSelectionSection.classList.remove('hidden');
  confirmationMessage.classList.add('hidden');
  closeModalCross.classList.remove('hidden-cross');
  selectedSeats = [];
};

renderDateButtons();
renderTimeButtons();
