const baseRepository = require("./base.repository");

async function findAll() {
  return baseRepository.findAll("tags");
}

async function findById(id) {
  return baseRepository.findById("tags", id);
}

module.exports = {
  findAll,
  findById
};
