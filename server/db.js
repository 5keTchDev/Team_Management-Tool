const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'dev.sqlite'));

const run = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const get = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const all = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const initDb = async () => {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    createdAt TEXT NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    ownerId INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(ownerId) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS project_members (
    projectId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    PRIMARY KEY(projectId, userId),
    FOREIGN KEY(projectId) REFERENCES projects(id),
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'To Do',
    dueDate TEXT,
    projectId INTEGER NOT NULL,
    assigneeId INTEGER,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(projectId) REFERENCES projects(id),
    FOREIGN KEY(assigneeId) REFERENCES users(id)
  )`);
};

module.exports = { db, run, get, all, initDb };
