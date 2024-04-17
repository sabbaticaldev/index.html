// queries.js
import { readFileSync } from "fs";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

let db;

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./whatsapp.db",
      driver: sqlite3.Database
    });
  }
  return db;
}

async function setupDb() {
  const db = await openDb();
  const checkTableExists = "SELECT name FROM sqlite_master WHERE type='table' AND name='Groups';";

  const table = await db.get(checkTableExists);

  if (!table) {
    const dbSql = readFileSync("./server/db.sql").toString();
    await db.exec(dbSql);
    console.log("Database setup completed.");
  } else {
    console.log("Database already set up.");
  }
}

export async function createGroup(groupData) {
  console.log({groupData});
  await openDb(); 
  const { id, subject, status, size, url, desc: description } = groupData;
  const result = await db.run(
    `INSERT INTO Groups (group_id, name, url, status, size, description) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(group_id) DO UPDATE SET name = ?, status = ?, size = ?
     RETURNING id`,
    [id, subject, url, status, size, description, subject, status, size]
  );
  return result.lastID;
}

export async function createOrUpdateParticipant(participant, groupId) {
  await openDb(); // Ensure db is initialized
  const { number, name, admin } = participant;
  const personResult = await db.run(
    `INSERT INTO Persons (number, name) VALUES (?, ?)
     ON CONFLICT(number) DO UPDATE SET number = ?
     RETURNING id`,
    [number, name || number, number]
  );
  const personId = personResult.lastID;

  await db.run(
    `INSERT INTO Group_Participants (group_id, person_id, admin, status) VALUES (?, ?, ?, 'active')
     ON CONFLICT(group_id, person_id) DO UPDATE SET admin = ?, status = 'active'`,
    [groupId, personId, admin, admin]
  );

  return personId;
}

// Initialize DB and set up tables when module is loaded
setupDb().catch(console.error);

export { setupDb };  // Exporting if you need to call it explicitly elsewhere
