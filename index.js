var fs = require('fs');
var http = require('http');
var https = require('https');

var config;

/**
 * Read config file and call getEntities method for each 
 * entity defined in config file.
 */
fs.readFile('config.json', 'utf-8', function(err, data) {
	if (err) {
		return console.log(err);
	}

	config = JSON.parse(data);
	protocol = config.port != '443' ? http : https;
	
	for (var i = 0; i < config.entities.length; i++) {		
		getEntities(config.entities[i])		
	}
});

/**
 * Make GET requests to the API endpoint and fetch a list of entities.
 * Then call the createClass function to generate the class file.
 */
function getEntities(entity) {
	var options = {}
	options.host = config.host;
	options.port = config.port;
	options.method = config.method;
	options.headers = config.headers;
	protocol = config.port != '443' ? http : https;

	var request = protocol.request(
		{
			'host': config.host,
			'port': config.port,
			'path': config.apiRoot + entity,
			'method': config.method,
			'headers': config.headers,				
		}, 
		function(response) {
			response.setEncoding('utf8');
			var responseData = '';
			response.on('data', function (chunk) {
				responseData += chunk;
			});

			response.on('end', function() {			
				if (responseData != '') {
					var obj = JSON.parse(responseData);
					if (obj.length >= 0 ) {
						createClassFile(obj[0], entity);
					} else {
						console.log(`Empty object recieved for entity ${entity}`);
					}
				} else {
					console.log(`Empty string recieved for entity ${entity}`)
				}								
			});

		}
	);

	request.on('error', function(err) {
		console.log('Error: ' + err.message);
	});

	request.end();
}

/**
 * Create a .ts class off the entity blueprint recieved from the API call
 */
function createClassFile(obj, path) {
	var className = path.charAt(0).toUpperCase() + path.slice(1,path.length-1);
	var type;
	var camelCasedKey = ''
	var classContent = `export class ${className} {`;

	for (var key in obj) {
		camelCasedKey = key.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); }) // Convert to camelCase
		if (obj[key] == null) {
			type = 'string';
		} else if (obj[key] instanceof Array) {
			type = 'string[]';
		} else {
			type = typeof obj[key];
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
}
