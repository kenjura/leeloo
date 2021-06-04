const debug = require('debug')('leeloo:dropboxSync');

const { getFileByPath, getFileList } = require('../api/services/dropbox');
const { get, ready, set } = require('../api/services/redis');
const { state } = require('../api/model/repo');
const { Sema } = require('async-sema');

const MAX_CACHE_FAILS = 5; // how many cache failures to tolerate before terminating sync
const MAX_SIMULTANEOUS_DOWNLOADS = 5;
const PULSE_INTERVAL = 1 * 1000; // frequency of cache checks in ms

let busy = false;
let cacheFails = 0;
let interval;
let syncControl = {
	active: true,
	healthy: true,
}
let sema = new Sema(MAX_SIMULTANEOUS_DOWNLOADS);

module.exports = { start }

async function start() {
	debug('starting dropbox sync...');

	// let's wait for a full file list sync before starting anything else
	// await syncFileList();

	// okay, let's start pulsing
	interval = setInterval(() => {
		pulse();
	}, PULSE_INTERVAL);
}

function isExpired(timestamp) {
	const TTL = 5 * 60 * 1000;
	const now = Date.now();
	return (now - timestamp) > TTL;
}

function unpulse(msg='') {
	debug(`Terminating pulse${msg?`: "${msg}"`:'.'}`);
	clearInterval(interval);
}

function pulse() {
	if (!syncControl.active) return unpulse('pulse is set to inactive');
	if (!syncControl.healthy) return unpulse('failing health check');
	if (state.pulsing) return debug('pulse aborted; too busy');

	// health check
	if (!Array.isArray(state.fileList)) unpulse('state.fileList is corrupted');
	if (!Array.isArray(state.files)) unpulse('state.files is corrupted');

	// if (!ready) {
	// 	if (++cacheFails > MAX_CACHE_FAILS) {
	// 		debug('terminating sync');
	// 		clearInterval(interval);
	// 	} else {
	// 		debug(`pulse aborted; client is not ready (${cacheFails} of ${MAX_CACHE_FAILS})`);
	// 	}
	// }

	debug('pulse starting...');
	state.pulsing = true;

	// check fileList
	const fileListNeedsUpdate = !state.fileList.timestamp || isExpired(state.fileList.timestamp);
	debug(fileListNeedsUpdate ? 'file list needs update' : 'file list is fine');
	if (fileListNeedsUpdate) updateFileList();
	else {
		state.fileList.forEach(path => {
			const existingFile = state.files.find(f => f.path === path);
			if (!existingFile) state.files.push({ path });
		});
		state.files.forEach(file => {
			const fileNeedsUpdate = !file.timestamp || isExpired(file.timestamp);
			debug(fileNeedsUpdate ? `file with path "${file.path}" needs update` : `file with path "${file.path}" is fine`);
			if (fileNeedsUpdate) updateFile(file);
		});
	}


	// check files
	// if (!Array.isArray(state.fileList)) {
	// 	state.healthy = false;
	// 	unpulse('state.files is corrupted');
	// }
	// state.files.forEach(file => {
	// 	const fileNeedsUpdate = !file.timestamp
	// })

	// done with pulse
	state.pulsing = false;
	debug('pulse complete');

	// 	// invalid
	// const fileList = get('fileList');
	// if (!fileList) {
	// 	debug('no fileList in cache, retrieving fresh. will check up in future sync...');
	// 	getFileList('5e')
	// 		.then(data => {
	// 			set('fileList', data);
	// 			busy = false;
	// 		})
	// 		.catch(handleFatalError);
	// } else {
	// 	debug('fileList found. yay!');
	// }
}

async function updateFileList() {
	if (state.fileList.failed) {
		debug('fileList failed to load! aborting doomed load.');
		return;
	}
	if (state.fileList.loading) {
		debug('fileList already loading! aborting redundant load.');
		return;
	}

	debug('updating fileList');
	state.fileList.loading = true;
	try {
		const fileList = await getFileList('leeloo-test', { noCache:true });
		state.fileList = fileList;
		state.fileList.loading = false;
		state.fileList.timestamp = Date.now();
		debug('done updating fileList');
	} catch(err) {
		state.fileList = { loading:false, failed: true, err };
		console.error('dropboxSync > updateFileList > fatal error: ', err);
	}
}

const UPDATE_FILE_THROTTLE_DELAY = 500;

function getExtensionFromPath(path) {
	return path.substr(path.lastIndexOf('.')+1);
}

async function updateFile(file) {
	debug(`getting file from path: ${file.path} (queued)`);
	await sema.acquire();
	debug(`getting file from path: ${file.path} (ACTIVE)`);
	try {
		const newFile = await getFileByPath({ articlePath:file.path }, { filesOnly:true, noCache:true });

		file.extension = getExtensionFromPath(file.path);
		file.type = newFile.type;
		file.content = newFile.content;
		debug(`got file from path: ${file.path}`);
		file.timestamp = Date.now();
		sema.release();
	} catch(err) {
		console.error(err);
		unpulse('error in updateFile, check logs');
		sema.release();
	} // TODO: require node 10+ and use try...finally
}

function fileIsATextDocument(file) {
	switch(file.extension) {
		case 'html':
		case 'md':
		case 'txt':
			return true;
		default:
			return false;
	}
}

function handleFatalError(err) {
	console.error(err);
	debug('fatal error in sync. canceling sync...');
	busy = true;
	cacheFails = Infinity;
	clearInterval(interval);
}


// TODO: eliminate global variables