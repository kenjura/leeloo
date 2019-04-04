export { read };


async function read() {
	const url = '/user';
	const result = await fetch(url);
	if (result.status >= 400) return { status:result.status };
	const json = await result.json();
	return json;
}

