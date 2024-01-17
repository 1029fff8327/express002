module.exports = (req, res, next) => {
	let file = Buffer.from('');
	
	req.on('data', chunk => {
	  file = Buffer.concat([file, chunk]);
	});
	
	req.on('end', () => {
	  req.file = {
		data: file,
		mimetype: req.headers['content-type'],
		size: req.headers['content-length'],
		meta: {
		  originalname: 'your_default_filename.txt' 
		}
	  };
	  next();
	});
  };  