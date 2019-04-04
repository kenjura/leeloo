const cache = require('memory-cache');
const debug = require('debug')('leeloo:cache');

const DEFAULT_TIMEOUT = 30 * 1000;

module.exports = { get, put, wrap };

function get(key) {
	return cache.get(key);
}

function put(key, value) {
	return cache.put(key, Object.assign({}, value, { cached:true, cacheTime:Date.now() }), DEFAULT_TIMEOUT);
}

function wrap(getterFn, keyFn) {
	return async function(...args) {
		const key = keyFn(...args);
		const storedValue = get(key);
		if (storedValue) {
			debug(`cache hit on key "${key}". returning stored value.`);
			return storedValue;
		}

		const result = await getterFn(...args);
		if (result) {
			debug(`cache miss on key "${key}". storing value.`);
			put(key, result);
			return result;
		} else {
			debug(`cache miss on key "${key}" but result is falsy. Not storing value.`);
			return result;
		}
	}
}