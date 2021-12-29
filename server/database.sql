CREATE DATABASE borrowit;
DELETE borrowit;


\c borrowit;

INSERT INTO users(username, passhashed) values ($1, $2);

DROP TABLE items;
DROP TABLE users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) not NULL UNIQUE,
    passhashed VARCHAR(150) not NULL,
    userid VARCHAR NOT NULL UNIQUE);


CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    itemname VARCHAR(30) not NULL,
    descr VARCHAR(30) not NULL,
    condition VARCHAR(30) not NULL,
    lendlength VARCHAR(20) not NULL,
    photo VARCHAR(30),
    giveaway BOOLEAN not NULL,
    itemowner VARCHAR NOT NULL,
    CONSTRAINT fk_items
      FOREIGN KEY(itemowner) 
      REFERENCES users(userid));

SELECT * FROM items;
SELECT * FROM users;