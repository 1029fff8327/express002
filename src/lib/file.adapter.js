const fs = require('fs');
const { promisify } = require('util');
const logger = require('./logger');
const { getDirectorySize } = require('./utils');
const path = require('path');

const createReadStreamAsync = promisify(fs.createReadStream);

class FileAdapter {
  constructor() {
    this.dir = (id) => path.join(__dirname, '../data', `${id}`);
    this.logger = logger;
  }

  async create(id, data, meta) {
    const directoryPath = path.join(__dirname, '../data');

    try {
      await fs.promises.writeFile(this.dir(id), data);
      const size = await getDirectorySize(directoryPath);
      this.logger.info(`End writing the file (data directory size ${size + meta.size} bytes)`);
      return true; // Return true on successful creation
    } catch (err) {
      this.logger.error(`Error creating file (ID: ${id}): ${err.message}`);
      throw err;
    }
  }

  async update(id, data, meta) {
    const directoryPath = path.join(__dirname, '../data');

    try {
      await fs.promises.writeFile(this.dir(id), data);
      const size = await getDirectorySize(directoryPath);
      this.logger.info(`End updating the file (data directory size ${size} bytes)`);
      return true;
    } catch (err) {
      this.logger.error(`Error updating file (ID: ${id}): ${err.message}`);
      throw err;
    }
  }

  async getById(id) {
    try {
      const filePath = this.dir(id);
      const fileStats = await fs.promises.stat(filePath);

      if (!fileStats.isFile()) {
        // File not found
        return { stream: null, meta: null };
      }

      const stream = createReadStreamAsync(filePath, { highWaterMark: 16 * 1024 });
      const fileMeta = {
        mimetype: 'application/octet-stream', // Set a default mimetype if needed
        size: fileStats.size,
      };

      return { stream, meta: fileMeta };
    } catch (err) {
      this.logger.error(`Error getting file by ID (FileAdapter): ${err.message}`);
      throw err;
    }
  }
}

module.exports = FileAdapter;
