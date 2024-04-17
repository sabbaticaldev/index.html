CREATE TABLE Groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT UNIQUE,
    size INTEGER,
    status TEXT
);

CREATE TABLE Persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    number TEXT UNIQUE
);

CREATE TABLE Messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    sender_id INTEGER,
    content TEXT,
    timestamp DATETIME,
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (sender_id) REFERENCES Persons(id)
);

CREATE TABLE Group_Participants (
    group_id INTEGER,
    person_id INTEGER,
    joined_date DATETIME,
    admin BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    PRIMARY KEY (group_id, person_id),
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (person_id) REFERENCES Persons(id)
);

CREATE TABLE Reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER,
    person_id INTEGER,
    type TEXT,
    timestamp DATETIME,
    FOREIGN KEY (message_id) REFERENCES Messages(message_id),
    FOREIGN KEY (person_id) REFERENCES Persons(person_id)
);
