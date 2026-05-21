const baseRepository = require("./base.repository");

async function findAll() {
  return baseRepository.findAll("genres");
}

async function findById(id) {
  return baseRepository.findById("genres", id);
}

module.exports = {
  findAll,
  findById
};
