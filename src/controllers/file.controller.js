const fs = require('fs');
const path = require('path');
const MB = 1e+6;
const FileService = require('../services/file.service');
const { getDirectorySize } = require('./../lib/utils');
const { logFileOperation } = require('../lib/logger');

class FileController {
  constructor(fileService = new FileService()) {
    this.service = fileService;
  }

  async create(req, res) {
    try {
      const directoryPath = '../data';
      const fullPath = path.resolve(__dirname, directoryPath);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }

      const { data, ...meta } = req.file;
      const id = await this.service.create(data, meta);

      const size = await getDirectorySize();
      logFileOperation('Create', id, Number(size) + Number(meta.size));

      if (Number(meta.size) + Number(size) > MB * 10) {
        console.log('Attention, the directory size is more than 10 megabytes');
        res.json({ status: 'ok', Warning: 'Attention, the directory size is more than 10 megabytes' });
      } else {
        console.log('File created successfully with ID:', id);
        res.json({ status: 'ok', id });
      }
    } catch (err) {
      console.error('Error creating file:', err);
      res.json({ status: 'error' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { data, ...meta } = req.file;
      const updateResult = await this.service.update(id, data, meta);

      if (updateResult) {
        logFileOperation('Update', id, await this.service.getDirectorySize());
        console.log('File updated successfully with ID:', id);
        res.json({ status: 'ok' });
      } else {
        console.error('Error updating file with ID:', id);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
    } catch (err) {
      console.error('Error updating file:', err);

      if (err.message === 'File not found') {
        res.status(404).json({ status: 'error', description: 'File not found' });
      } else {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;
      const { stream, meta } = await this.service.getById(id);

      if (!meta) {
        console.error('Meta information is undefined. File not found.');
        res.status(404).json({ status: 'error', description: 'File not found' });
        return;
      }

      logFileOperation('Retrieve', id, await this.service.getDirectorySize());
      console.log('File retrieved successfully with ID:', id, 'and meta:', meta);

      res.setHeader('content-type', meta.mimetype);
      res.setHeader('content-length', meta.size);

      if (stream && typeof stream.pipe === 'function') {
        stream.pipe(res);
      } else {
        console.error('Stream is not valid. File not found or cannot be streamed.');
        res.status(404).json({ status: 'error', description: 'File not found or cannot be streamed' });
      }
    } catch (err) {
      console.error('Error getting file by ID:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
}

module.exports = FileController;
