const debug = require('debug')('leeloo:redis');
const redis = require('redis');

const TTL = 5 * 60; // TTL of all keys in seconds
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let client, ready = false;

module.exports = { get, ready, set, start };


function get(key) {
	if (!client || !ready) throw new Error('redis is not ready');
	const val = client.get(key);
	return JSON.parse(val);
}

function set(key, val) {
	if (!client || !ready) throw new Error('redis is not ready');
	const value = typeof(val) === 'string' ? val : JSON.stringify(val);

	client.set(key, value, 'EX', TTL);
}

function start() {
	return new Promise((resolve, reject) => {
		debug('creating redis client...');
		client = redis.createClient(REDIS_URL);
		client.on('error', err => {
			reject(err);
		});
		client.on('connect', () => {
			ready = true;
			debug('redis client is ready');
			resolve();
		})
	})
}


// TODO: eliminate global "client" and "ready" variables
// TODO: make all functions async / non-blocking