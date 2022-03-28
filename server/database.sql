CREATE DATABASE borrowit;
DELETE borrowit;


\c borrowit;

INSERT INTO users(username, passhashed) values ($1, $2);



INSERT INTO users(username, passhashed, userid, userrole) values('BorrowitAdmin', '$2b$10$V.R2Z3RhuM5hus6lfDLAZuQfiTAho0WM.CZtHVjmAUYMhmmEyux6q', 1, 'admin');

DROP TABLE reviews;
DROP TABLE items;
DROP TABLE offers;
DROP TABLE users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) not NULL UNIQUE,
    email VARCHAR(70),
    firstname VARCHAR(70),
    surname VARCHAR(70),
    home VARCHAR(70),
    userrole VARCHAR(70),
    passhashed VARCHAR(150) not NULL,
    userid VARCHAR NOT NULL UNIQUE);

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    itemname VARCHAR(50) not NULL,
    descr VARCHAR(250) not NULL,
    condition VARCHAR(15) not NULL,
    lendlength VARCHAR(20) not NULL,
    photo VARCHAR,
    imageAlt VARCHAR,
    giveaway VARCHAR(8) not NULL,
    itemowner VARCHAR NOT NULL,
    CONSTRAINT fk_items
      FOREIGN KEY(itemowner) 
      REFERENCES users(userid));

CREATE TABLE offers(
    id SERIAL PRIMARY KEY,
    itemid INTEGER NOT NULL,
    lenderid VARCHAR NOT NULL,
    offerstatus VARCHAR NOT NULL,
    borrowerid VARCHAR NOT NULL,
    CONSTRAINT fk_items
      FOREIGN KEY(borrowerid) 
      REFERENCES users(userid));

CREATE TABLE reviews(
    id SERIAL PRIMARY KEY NOT NULL,
    reviewee VARCHAR NOT NULL,
    reviewer VARCHAR NOT NULL,
    itemborrowed VARCHAR NOT NULL,
    review VARCHAR,
    outcome VARCHAR NOT NULL,
    CONSTRAINT fk_items
      FOREIGN KEY(reviewer) 
      REFERENCES users(userid));

SELECT * FROM items;
SELECT * FROM users;