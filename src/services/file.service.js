const path = require('path');
const FileAdapter = require('./../lib/file.adapter');
const { getDirectorySize } = require('./../lib/utils');

class FileService {
  constructor(fileAdapter, fileModel) {
    this.fileAdapter = fileAdapter;
    this.model = fileModel;
  }

  async create(file, meta) {
    try {
      // Create a new document in the database
      const newFile = new this.model({
        name: meta.originalname,
        size: meta.size,
        mimetype: meta.mimetype,
        createDate: new Date(),
      });

      // Save the document and extract the ID
      const savedFile = await newFile.save();
      const id = savedFile._id.toString();

      // Log the ID and additional details after creating the file
      console.log('File created with ID:', id);
      const size = await this.getDirectorySize();
      console.log(`Current directory size after create: ${size} bytes`);

      // Pass the correct parameters to fileAdapter.create
      const result = await this.fileAdapter.create(id, file, meta);

      if (result) {
        console.log('File created successfully in FileAdapter');
        return id; // Return the ID after successful creation
      } else {
        console.error('Error creating file in FileAdapter');
        throw new Error('File creation failed in FileAdapter');
      }
    } catch (err) {
      console.error(`Error creating file: ${err.message}`);
      throw err;
    }
  }

  async update(id, file, meta) {
    try {
      // Log additional details for debugging
      console.log(`Updating file in FileService with ID: ${id}`);
      console.log('File metadata in FileService:', meta);

      // Use findByIdAndUpdate for simplicity
      const updatedFile = await this.model.findByIdAndUpdate(id, {
        $set: { size: meta.size, mimetype: meta.mimetype },
      }, { new: true });

      if (!updatedFile) {
        throw new Error('File not found');
      }

      // Log additional details after the update
      console.log(`File updated in FileService successfully with ID: ${id}`);
      const size = await this.getDirectorySize();
      console.log(`Current directory size after update: ${size} bytes`);

      // Call fileAdapter.update and log the result
      const updateResult = await this.fileAdapter.update(id, file, meta);

      if (updateResult) {
        console.log('File updated successfully in FileAdapter');
      } else {
        console.error('Error updating file in FileAdapter');
        throw new Error('File update failed in FileAdapter');
      }

      return updateResult;
    } catch (err) {
      console.error(`Error updating file in FileService: ${err.message}`);
      throw err;
    }
  }

  async getById(id) {
    try {
      // Retrieve file data and metadata from the file adapter
      const { stream, meta } = await this.fileAdapter.getById(id);

      // Log additional details or perform other operations if needed
      console.log(`File retrieved successfully with ID: ${id} and meta:`, meta);

      // Return an object with the file stream and metadata
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
