const fs = require('node:fs');
const path = require('node:path');

const getFilePaths = dir => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	const paths = files.map(file => {
		const filePath = path.join(dir, file.name);
		if (file.isDirectory()) {
			return getFilePaths(filePath);
		}
		// Shouldn't need to worry about any non-js files here
		return path;
	});

	return paths.flat(Infinity);
}

module.exports = {
	getFilePaths
}