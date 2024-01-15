const FileAdapter = require('./../lib/file.adapter');
const { getDirectorySize } = require('./../lib/utils');
const shortid = require('shortid');

class FileService {
  constructor(fileAdapter, fileModel) {
    this.fileAdapter = fileAdapter;
    this.model = fileModel;
  }

  async create(file, meta) {
    const newFile = new this.model({
      name: meta.originalname,
      size: meta.size,
      mimetype: meta.mimetype,
      createDate: new Date(),
    });

    const savedFile = await newFile.save();
    const id = savedFile._id.toString(); // Преобразование ObjectId в строку

    console.log('File created with ID:', id); // Выводим ID в консоль

    return this.fileAdapter.create(id, file, meta);
  }

  async update(id, file, meta) {
    // Проверьте, используется ли ObjectId правильно
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid ObjectId format');
    }

    await this.model.updateOne({ _id: id }, { $set: { size: meta.size, mimetype: meta.mimetype } });

    console.log('File updated with ID:', id); // Выводим ID в консоль

    return this.fileAdapter.update(id, file, meta);
  }

  async getById(id) {
    // Проверьте, используется ли ObjectId правильно
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid ObjectId format');
    }

    const fileMeta = await this.model.findOne({ _id: id });
    return {
      meta: fileMeta,
      stream: this.fileAdapter.getById(id),
    };
  }

  async getDirectorySize() {
    return await getDirectorySize();
  }
}

module.exports = FileService;
