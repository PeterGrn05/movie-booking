CREATE TABLE Movie (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT,
  poster_url VARCHAR(255)
);

CREATE TABLE Cinema (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255)
);

CREATE TABLE Auditorium (
  id SERIAL PRIMARY KEY,
  cinema_id INT REFERENCES Cinema(id) ON DELETE CASCADE,
  name VARCHAR(100),
  rows INT,
  cols INT
);

CREATE TABLE Seat (
  id SERIAL PRIMARY KEY,
  auditorium_id INT REFERENCES Auditorium(id) ON DELETE CASCADE,
  row_number INT,
  seat_number INT
);

CREATE TABLE Session (
  id SERIAL PRIMARY KEY,
  movie_id INT REFERENCES Movie(id) ON DELETE CASCADE,
  auditorium_id INT REFERENCES Auditorium(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL
);

CREATE TABLE Booking (
  id SERIAL PRIMARY KEY,
  session_id INT REFERENCES Session(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE BookingSeat (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES Booking(id) ON DELETE CASCADE,
  seat_id INT REFERENCES Seat(id) ON DELETE CASCADE
);