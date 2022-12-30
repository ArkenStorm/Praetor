const fs = require('node:fs');
const path = require('node:path');

const getFilepaths = dir => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	const paths = files.map(file => {
		const filepath = path.join(dir, file.name);
		if (file.isDirectory()) {
			return getFilepaths(filepath);
		}
		// Shouldn't need to worry about any non-js files here
		return filepath;
	});

	return paths.flat(Infinity);
};

module.exports = {
	getFilepaths
};