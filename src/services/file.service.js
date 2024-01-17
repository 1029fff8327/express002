const path = require('path');
const FileAdapter = require('./../lib/file.adapter');
const { getDirectorySize, writeFileAsync } = require('./../lib/utils');
const { logFileOperation } = require('./../lib/logger');

class FileService {
  constructor(fileAdapter, fileModel) {
    this.fileAdapter = fileAdapter;
    this.model = fileModel;
  }

  async create(file, meta) {
    try {
      const newFile = new this.model({
        name: meta.originalname,
        size: meta.size,
        mimetype: meta.mimetype,
        createDate: new Date(),
      });

      const savedFile = await newFile.save();
      const id = savedFile._id.toString();

      logFileOperation('Create', id, await this.getDirectorySize());

      const result = await this.fileAdapter.create(id, file, meta);

      if (result) {
        return id;
      } else {
        throw new Error('File creation failed in FileAdapter');
      }
    } catch (err) {
      console.error(`Error creating file: ${err.message}`);
      throw err;
    }
  }

  async update(id, file, meta) {
    try {
      logFileOperation('Update', id, await this.getDirectorySize());

      const updatedFile = await this.model.findByIdAndUpdate(id, {
        $set: { size: meta.size, mimetype: meta.mimetype },
      }, { new: true });

      if (!updatedFile) {
        throw new Error('File not found');
      }

      const updateResult = await this.fileAdapter.update(id, file, meta);

      if (updateResult) {
        return updateResult;
      } else {
        throw new Error('File update failed in FileAdapter');
      }
    } catch (err) {
      console.error(`Error updating file in FileService: ${err.message}`);
      throw err;
    }
  }

  async getById(id) {
    try {
      const { stream, meta } = await this.fileAdapter.getById(id);
      logFileOperation('Retrieve', id, await this.getDirectorySize());
      return { stream, meta };
    } catch (err) {
      console.error(`Error getting file by ID ${id} in FileService: ${err.message}`);
      throw err;
    }
  }

  async getDirectorySize() {
    try {
      const directoryPath = path.join(__dirname, '../data');
      return await getDirectorySize(directoryPath);
    } catch (err) {
      console.error(`Error getting directory size in FileService: ${err.message}`);
      throw err;
    }
  }
}

module.exports = FileService;
