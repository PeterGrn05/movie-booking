const dateButtonsContainer = document.getElementById('dateButtonsContainer');
const timeButtonsContainer = document.getElementById('timeButtonsContainer');

// Получаем даты на неделю вперёд
const today = new Date();
const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  return date;
});

// Отображаем кнопки с датами
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
    sessionTime.setHours(11, 0); // начало с 11:00

    const endTime = new Date(date);
    endTime.setHours(23, 0); // конец в 23:00

    while (sessionTime <= endTime) {
      const timeStr = sessionTime.toTimeString().slice(0, 5); // "HH:MM"

      const timeBtn = document.createElement('button');
      timeBtn.className = 'time-btn';
      timeBtn.textContent = timeStr;

      // Проверка на прошлое время
      const isPastSession = isToday && sessionTime <= now;

      if (isPastSession) {
        timeBtn.disabled = true;
        timeBtn.classList.add('past');
      } else {
        timeBtn.onclick = () => openSeatModal(`Кинотеатр №${i}`, timeStr);
      }

      sessionTimes.appendChild(timeBtn);
      sessionTime.setMinutes(sessionTime.getMinutes() + 150); // шаг 2ч30м
    }

    cinemaCard.appendChild(sessionTimes);
    timeButtonsContainer.appendChild(cinemaCard);
  }
}

// Инициализация
loadSessions(days[0]);

// ========== Модалка выбора мест ==========
const seatModal = document.getElementById('seatModal');
const seatsGrid = document.getElementById('seatsGrid');
const confirmSeatsBtn = document.getElementById('confirmSeats');

// Хранилище выбранных мест
let selectedSeats = [];
let currentSessionInfo = null;

// Отображение попапа
function openSeatModal(cinema, time) {
  currentSessionInfo = { cinema, time };
  selectedSeats = [];

  // Очистка и генерация мест (10 рядов по 10 мест)
  seatsGrid.innerHTML = '';
  for (let row = 1; row <= 5; row++) {
    for (let seat = 1; seat <= 10; seat++) {
      const seatDiv = document.createElement('div');
      seatDiv.className = 'seat';
      seatDiv.dataset.seat = `R${row}S${seat}`;

      // Тут можно добавить проверку брони с localStorage
      const isBooked = false; // (заглушка)

      if (isBooked) {
        seatDiv.classList.add('booked');
      } else {
        seatDiv.onclick = () => toggleSeat(seatDiv);
      }

      seatsGrid.appendChild(seatDiv);
    }
  }

  seatModal.classList.remove('hidden');
}

// Переключение мест
function toggleSeat(seatDiv) {
  const seatId = seatDiv.dataset.seat;
  const index = selectedSeats.indexOf(seatId);
  if (index >= 0) {
    selectedSeats.splice(index, 1);
    seatDiv.classList.remove('selected');
  } else {
    selectedSeats.push(seatId);
    seatDiv.classList.add('selected');
  }
}

// Закрытие и подтверждение
confirmSeatsBtn.onclick = () => {
  if (selectedSeats.length === 0) {
    alert('Пожалуйста, выберите места');
    return;
  }

  // Тут можно добавить сохранение в localStorage или отправку на сервер
  alert(`Вы забронировали: ${selectedSeats.join(', ')} для ${currentSessionInfo.time} в ${currentSessionInfo.cinema}`);

  seatModal.classList.add('hidden');
};