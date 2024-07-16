-- Guardar todas las tablas en un schema exclusivo para el TFG
SET search_path TO tfg;
CREATE SCHEMA IF NOT EXISTS tfg;

DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Teams CASCADE;
DROP TABLE IF EXISTS Projects CASCADE;
DROP TABLE IF EXISTS Tasks CASCADE;
DROP TABLE IF EXISTS Chats CASCADE;
DROP TABLE IF EXISTS Messages CASCADE;
DROP TABLE IF EXISTS User_Team CASCADE;
DROP TABLE IF EXISTS User_Project CASCADE;
DROP TABLE IF EXISTS User_Task CASCADE;



CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    auth0_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE Teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT REFERENCES Users(id)
);

CREATE TABLE Projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    user_id INT REFERENCES Users(id),
    team_id INT REFERENCES Teams(id)
);

CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(255) NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP,
    user_id INT REFERENCES Users(id),
    project_id INT REFERENCES Projects(id)
);

CREATE TABLE Chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    project_id INT REFERENCES Projects(id)
);

CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    _timestamp TIMESTAMP,
    user_id INT REFERENCES Users(id),
    chat_id INT REFERENCES Chats(id)
);

CREATE TABLE User_Team (
    user_id INT REFERENCES Users(id),
    team_id INT REFERENCES Teams(id),
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE User_Project (
    user_id INT REFERENCES Users(id),
    project_id INT REFERENCES Projects(id),
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE User_Task (
    user_id INT REFERENCES Users(id),
    task_id INT REFERENCES Tasks(id),
    PRIMARY KEY (user_id, task_id)
);
