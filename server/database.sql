CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) not NULL UNIQUE,
    passhashed VARCHAR(150) not NULL);

    INSERT INTO users(username, passhashed) values ($1, $2);