const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./main.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to the SQLite database successfully.');
});

const sqlCreatePlayersTable = `
CREATE TABLE IF NOT EXISTS loggedPlayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    puuid TEXT NOT NULL UNIQUE,
    region TEXT,
    tagline TEXT
);`;

db.run(sqlCreatePlayersTable, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('loggedPlayers Table Created Successfully.');
});

function playerExists(puuid, callback) {
    db.get('SELECT puuid FROM loggedPlayers WHERE puuid = ?', [puuid], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row ? true : false);
    });
}

function insertPlayer(username, puuid, region, tagline, callback) {
    playerExists(puuid, (err, exists) => {
        if (err) {
            return callback(err);
        }
        if (exists) {
            return callback(null, false); 
        }
        db.run(
            'INSERT INTO loggedPlayers (username, puuid, region, tagline) VALUES (?, ?, ?, ?)',
            [username, puuid, region, tagline],
            function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, true); 
            }
        );
    });
}

function close() {
    db.close();
}

module.exports = { close, insertPlayer };
