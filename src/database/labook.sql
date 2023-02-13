-- Active: 1676297565411@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);
SELECT * FROM users;
DROP TABLE users;

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL, 
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);
SELECT * FROM posts;
DROP TABLE posts;

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);
SELECT * FROM likes_dislikes;
DROP TABLE likes_dislikes;

INSERT INTO users(id, name, email, password, role)
VALUES ("u001", "Mayara", "mayara@labook.com", "1234", "n"),
        ("u002", "Thiago", "thiago@labook.com", "5678", "n"),
        ("u003", "Belinha", "belinha@labook.com", "0910", "n");

INSERT INTO posts (id, creator_id, content, likes, dislikes)
VALUES ("p001", "u002", "Segundou", 8, 0),
        ("p002", "u001", "No pain no gain", 9, 0),
        ("p003", "u003", "Preguiçaaa", 25, 0);

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES ("u001", "p002", 9),
        ("u002", "p001", 8),
        ("u003", "p003", 25); 