var url = require('url');
var http = require('http');
 
var sizeOf = require('image-size');
 

function getUploadedImageSize (imageUrl) {

	const url = url.parse (imageUrl);

	http.get(options, function (response) {
		var chunks = [];
		response.on('data', function (chunk) {
		  chunks.push(chunk);
		}).on('end', function() {
		  var buffer = Buffer.concat(chunks);
		  console.log(sizeOf(buffer));
		});
	  });
}

module.exports.getUploadedImageSize = getUploadedImageSize;