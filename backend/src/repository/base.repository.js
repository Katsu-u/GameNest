const { pool } = require("../config/db");

async function query(sql, params = []) {
  const result = await pool.query(sql, params);

  return result;
}

async function findAll(tableName) {
  const result = await query(`SELECT * FROM ${tableName} ORDER BY id ASC`);

  return result.rows;
}

async function findById(tableName, id) {
  const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);

  return result.rows[0] || null;
}

module.exports = {
  query,
  findAll,
  findById
};
