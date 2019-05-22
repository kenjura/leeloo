let success = true;

if (!process.env.DROPBOX_ACCESS_TOKEN) fail('Environment variable DROPBOX_ACCESS_TOKEN not found.');
if (!process.env.DROPBOX_ROOT) fail('Environment variable DROPBOX_ROOT not found.');
if (!process.env.DOCROOT) fail('Environment variable DOCROOT not found.');
if (!process.env.AUTH0_DOMAIN) fail('Environment variable AUTH0_DOMAIN not found.');
if (!process.env.AUTH0_CLIENT_ID) fail('Environment variable AUTH0_CLIENT_ID not found.');
if (!process.env.AUTH0_CLIENT_SECRET) fail('Environment variable AUTH0_CLIENT_SECRET not found.');
// if (!process.env.STATICFILE_ROOT) fail('Environment variable STATICFILE_ROOT not found.');

if (!success) process.exit();

function fail(msg) {
	console.error('validate-env > FAIL > ', msg);
	success = false;
}
