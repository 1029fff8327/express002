const FileAdapter = require('./../lib/file.adapter');
const { getDirectorySize } = require('./../lib/utils');

class FileService {
  constructor(fileAdapter, fileModel) {
    this.fileAdapter = fileAdapter;
    this.model = fileModel;
  }

  async create(id, file, meta) {
    await this.model.create({ _id: id, name: meta.originalname, size: meta.size, mimetype: meta.mimetype, createDate: new Date() });
    return this.fileAdapter.create(id, file, meta);
  }

  async update(id, file, meta) {
    await this.model.updateOne({ _id: id }, { $set: { size: meta.size, mimetype: meta.mimetype } });
    return this.fileAdapter.update(id, file, meta);
  }

  async getById(id) {
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
