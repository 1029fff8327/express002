const fs = require('fs');
const path = require('path'); 
const MB = 1e+6;
const FileService = require('../services/file.service');
const { getDirectorySize } = require('./../lib/utils');

class FileController {
  constructor(fileService = new FileService()) {
    this.service = fileService;
  }

  async create(req, res) {
    const directoryPath = './data';  
    const fullPath = path.resolve(__dirname, directoryPath); 
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }

    try {
      const { data, ...meta } = req.file;
      await this.service.create(req.params.id, req.file.data, req.file.meta);

      getDirectorySize().then(size => {
        if (Number(req.file.size) + Number(size) > MB * 10) {
          res.json({ status: 'ok', Warning: 'Attention, the directory size is more than 10 megabytes' });
        } else {
          res.json({ status: 'ok' });
        }
      });
    } catch (err) {
      console.log(err);
      res.json({ status: 'error' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { data, ...meta } = req.file;
      await this.service.update(id, data, meta);

      res.json({ status: 'ok' });
    } catch (err) {
      console.log(err);
      res.json({ status: 'error' });
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;
      const { stream, meta } = await this.service.getById(id);

      res.setHeader('content-type', meta.mimetype);
      res.setHeader('content-length', meta.size);
      stream.pipe(res);
    } catch (err) {
      res.json({ status: 'error', description: 'file not found' });
    }
  }
}

module.exports = FileController;
