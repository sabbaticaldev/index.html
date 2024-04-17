CREATE TABLE Groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT UNIQUE,
    image TEXT,
    users INTEGER,
    frequency INTEGER,
    size INTEGER,
    description TEXT,
    status TEXT,
    featured BOOLEAN
);

CREATE TABLE Tags (
    id TEXT PRIMARY KEY,
    city BOOLEAN,
    country BOOLEAN
);

CREATE TABLE GroupTags (
    group_id INTEGER,
    tag_id TEXT,
    PRIMARY KEY (group_id, tag_id),
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (tag_id) REFERENCES Tags(id)
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
