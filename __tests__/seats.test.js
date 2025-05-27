import {
  generateSessionKey,
  loadBookedSeats,
  saveBookedSeats,
  toggleSeatState
} from '../src/seats.js';

beforeEach(() => {
  localStorage.clear();
});

describe('Ключ Сессии - Генерация', () => {
  it('должен корректно генерировать ключ сессии', () => {
    const date = new Date('2025-01-01');
    const key = generateSessionKey('Кинотеатр', date, '18:00');
    expect(key).toBe('Кинотеатр_2025-01-01_18:00');
  });
});

describe('Состояние сидения - переключение', () => {
  it('добавляет сиденье, если его не было', () => {
    const result = toggleSeatState([], 5);
    expect(result).toEqual([5]);
  });

  it('удаляет сиденье, если оно уже было выбрано', () => {
    const result = toggleSeatState([5], 5);
    expect(result).toEqual([]);
  });

  it('не изменяет другие сиденья при удалении', () => {
    const result = toggleSeatState([3, 5, 7], 5);
    expect(result).toEqual([3, 7]);
  });
});

describe('Сохранение и загрузка бронирования', () => {
  it('сохраняет и загружает бронированные места', () => {
    const key = 'testSession';
    saveBookedSeats(key, [1, 2]);
    expect(loadBookedSeats(key)).toEqual([1, 2]);
  });

  it('не дублирует уже сохраненные места', () => {
    const key = 'testSession';
    saveBookedSeats(key, [1, 2]);
    saveBookedSeats(key, [2, 3]);
    expect(loadBookedSeats(key)).toEqual([1, 2, 3]);
  });
});