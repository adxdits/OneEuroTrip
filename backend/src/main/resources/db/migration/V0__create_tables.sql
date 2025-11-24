-- Create user table
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo VARCHAR(255) NOT NULL
);

-- Create poi table
CREATE TABLE poi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_url VARCHAR(500)
);

-- Create poi_image table
CREATE TABLE poi_image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poi_id INTEGER NOT NULL,
    embedding BLOB,
    image_url VARCHAR(500),
    FOREIGN KEY (poi_id) REFERENCES poi(id) ON DELETE CASCADE
);

-- Create search table
CREATE TABLE search (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination VARCHAR(255),
    start_date DATE,
    end_date DATE,
    budget REAL,
    persons INTEGER,
    transport_mode VARCHAR(50)
);

-- Create ticket table
CREATE TABLE ticket (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poi_id INTEGER NOT NULL,
    price REAL NOT NULL,
    transport_mode VARCHAR(50),
    start_date DATE,
    end_date DATE,
    flight_url VARCHAR(500),
    FOREIGN KEY (poi_id) REFERENCES poi(id) ON DELETE CASCADE
);

-- Create history table
CREATE TABLE history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ticket_id INTEGER NOT NULL,
    purchase_date DATE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE
);
