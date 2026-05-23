const baseRepository = require("./base.repository");

async function findAll() {
  return baseRepository.findAll("platforms");
}

async function findById(id) {
  return baseRepository.findById("platforms", id);
}

module.exports = {
  findAll,
  findById
};
