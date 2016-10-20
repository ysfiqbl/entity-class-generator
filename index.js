var fs = require('fs');

var outlet = {
	"id": 1,
	"name": "Lightsaber",
	"created_on": "2015-05-01"
}

var className = 'Item';
var type;
var camelCasedKey = 'cale'.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
var classContent = `export class ${className} {`;

for (var key in outlet) {
	camelCasedKey = key.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); }) // Convert to camelCase
	if (outlet[key] == null) {
		type = 'string';
	} else if (outlet[key] instanceof Array) {
		type = 'string[]';
	} else {
		type = typeof outlet[key];
	}
	classContent+=`\n\t${camelCasedKey}: ${type};`
}

classContent+='\n}';

fs.writeFile(`generated-classes/${className.toLowerCase()}.ts`, classContent, function (err) {
	if (err) {
		console.log(err);
	}
	console.log(`${className} class file successfully created.`);
});
