import getDbFromPath from '../helpers/getDbFromPath';

export { read, update };


async function read(db, path) {
	const url = `/api/article/${db}/${path}?db=${db}`;
	const result = await fetch(url);
	if (result.status >= 400) return { status:result.status };
	const json = await result.json();
	return json;
}


async function update(db, path, body) {
	console.log('updating...', { db, path, body });
	return { status:200 };
}