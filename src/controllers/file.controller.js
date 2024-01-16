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
    try {
      const directoryPath = './data';
      const fullPath = path.resolve(__dirname, directoryPath);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }

      const { data, ...meta } = req.file;
      const id = await this.service.create(data, meta);

      getDirectorySize().then(size => {
        console.log('Current directory size after create:', size, 'bytes');

        if (Number(meta.size) + Number(size) > MB * 10) {
          console.log('Attention, the directory size is more than 10 megabytes');
          res.json({ status: 'ok', Warning: 'Attention, the directory size is more than 10 megabytes' });
        } else {
          console.log('File created successfully with ID:', id);
          res.json({ status: 'ok', id });
        }
      });
    } catch (err) {
      console.error('Error creating file:', err);
      res.json({ status: 'error' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { data, ...meta } = req.file;
      await this.service.update(id, data, meta);

      console.log('File updated successfully with ID:', id);
      res.json({ status: 'ok' });
    } catch (err) {
      console.error('Error updating file:', err);
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
      console.error('Error getting file by ID:', err);
      res.json({ status: 'error', description: 'file not found' });
    }
  }
}

module.exports = FileController;
