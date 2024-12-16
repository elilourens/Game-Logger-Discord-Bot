const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./main.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to the SQLite database successfully.');
});


const sqlCreatePlayersTable = `
CREATE TABLE IF NOT EXISTS allPlayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    puuid TEXT NOT NULL,
    region TEXT,
    tagline TEXT,
    guild_id TEXT NOT NULL
);`;

const sqlCreateLoggingChannelsTable = `
CREATE TABLE IF NOT EXISTS loggingChannels (
    guild_id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL
);`;

db.run(sqlCreatePlayersTable, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('allPlayers Table Created Successfully.');
});

db.run(sqlCreateLoggingChannelsTable, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('loggingChannels Table Created Successfully.');
});

function setLoggingChannel(guildId, channelId, callback) {
    db.run(
        'INSERT INTO loggingChannels (guild_id, channel_id) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET channel_id = ?',
        [guildId, channelId, channelId],
        (err) => {
            if (err) {
                return callback(err);
            }
            callback(null);
        }
    );
}

function getLoggingChannels(callback) {
    db.all('SELECT * FROM loggingChannels', [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
}

function playerExists(puuid, callback) {
    db.get('SELECT puuid FROM allPlayers WHERE puuid = ?', [puuid], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row ? true : false);
    });
}

function getAllPlayers(guildId) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM allPlayers WHERE guild_id = ?',
            [guildId],
            (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            }
        );
    });
}

function insertPlayer(username, puuid, region, tagline, guildId, callback) {
    playerExists(puuid, (err, exists) => {
        if (err) {
            return callback(err);
        }
        if (exists) {
            return callback(null, false); 
        }
        db.run(
            'INSERT INTO allPlayers (username, puuid, region, tagline, guild_id) VALUES (?, ?, ?, ?, ?)',
            [username, puuid, region, tagline, guildId],
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

module.exports = { close, insertPlayer, getAllPlayers, setLoggingChannel, getLoggingChannels };
