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
    likes INTEGER DEFAULT (1) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
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
VALUES ("u001", "Mayara", "mayara@labook.com", "1234", "normal"),
        ("u002", "Thiago", "thiago@labook.com", "5678", "normal"),
        ("u003", "Belinha", "belinha@labook.com", "0910", "normal");

INSERT INTO posts (id, creator_id, content, likes, dislikes)
VALUES ("p001", "u002", "Segundou", 8, 0),
        ("p002", "u001", "No pain no gain", 9, 0),
        ("p003", "u003", "Preguiçaaa", 25, 0),
        ("p004", "u001", "Bora, que hoje é só o começo!", 11, 0),
        ("p005", "u003", "Pra que eu acordei?!", 21, 3);

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES ("u001", "p002", 9),
        ("u002", "p001", 8),
        ("u003", "p003", 25), 
        ("u001", "p004", 11),
        ("u003", "p005", 21); 


SELECT * from likes_dislikes
INNER JOIN users
ON likes_dislikes.user_id = users.id
RIGHT JOIN posts
ON likes_dislikes.post_id = posts.id;

SELECT * FROM posts
LEFT JOIN likes_dislikes
ON likes_dislikes.post_id = posts.id
LEFT JOIN users
ON likes_dislikes.user_id = users.id;