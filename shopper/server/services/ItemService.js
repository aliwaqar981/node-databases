const ItemModel = require('../models/mongoose/Item');

class ItemService {
  static async getAll() {
    return ItemModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(itemId) {
    return ItemModel.findById(itemId).exec();
  }

  static async create(body) {
    const item = new ItemModel(body);
    return item.save();
  }

  static async update(itemId, body) {
    return ItemModel.findByIdAndUpdate(itemId, body).exec();
  }

  static async remove(itemId) {
    return ItemModel.deleteOne({ _id: itemId }).exec();
  }
}

module.exports = ItemService;
