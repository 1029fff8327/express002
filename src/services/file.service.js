const FileAdapter = require('./../lib/file.adapter');
const { getDirectorySize } = require('./../lib/utils');

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

      console.log('File created with ID:', id);

      // Log additional details after creating the file
      const size = await this.getDirectorySize();
      console.log(`Current directory size after create: ${size} bytes`);

      return this.fileAdapter.create(id, file, meta);
    } catch (err) {
      console.error('Error creating file:', err);
      throw err;
    }
  }

  async update(id, file, meta) {
    try {
      // Log additional details for debugging
      console.log('Updating file in FileService with ID:', id);
      console.log('File metadata in FileService:', meta);

      // Use findByIdAndUpdate for simplicity
      const updatedFile = await this.model.findByIdAndUpdate(id, {
        $set: { size: meta.size, mimetype: meta.mimetype },
      }, { new: true });

      if (!updatedFile) {
        throw new Error('File not found');
      }

      console.log('File updated in FileService successfully with ID:', id);

      // Log additional details after the update
      const size = await this.getDirectorySize();
      console.log(`Current directory size after update: ${size} bytes`);

      return this.fileAdapter.update(id, file, meta);
    } catch (err) {
      console.error('Error updating file in FileService:', err);
      throw err;
    }
  }

  // ... (existing methods remain unchanged)

  async getDirectorySize() {
    try {
      return await getDirectorySize();
    } catch (err) {
      console.error('Error getting directory size in FileService:', err);
      throw err;
    }
  }
}

module.exports = FileService;