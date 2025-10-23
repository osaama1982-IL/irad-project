-- SQL Code to be run in pgAdmin on the osamadb database
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  city TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
);