const fs = require('fs').promises;
const logger = require('./logger');
const { getDirectorySize } = require('./utils');
const path = require('path');

class FileAdapter {
  constructor() {
    // Absolute path to the directory
    this.dir = (id) => path.join(__dirname, '../data', `${id}`);
    this.logger = logger;
  }

  async create(id, data, meta) {
    try {
      await fs.writeFile(this.dir(id), data);
      const size = await getDirectorySize(this.dir());
      this.logger.info(`End writing the file (data directory size ${size + meta.size} bytes)`);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async update(id, data, meta) {
    try {
      await fs.writeFile(this.dir(id), data);
      const size = await getDirectorySize(this.dir());
      this.logger.info(`End updating the file (data directory size ${size} bytes)`);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  getById(id) {
    return fs.createReadStream(this.dir(id));
  }
}

module.exports = FileAdapter;
