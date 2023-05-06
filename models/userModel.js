var pool = require("./db");
var md5 = require("md5");

async function getUserByUsernameAndPassword(user, password) {
  try {
    const query =
      "select * from users where usuario = ? and password = ? limit 1";
    const rows = await pool.query(query, [user, md5(password)]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function getAll() {
  try {
    const query = "select * from users ";
    const rows = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const query = "select * from users where id_usuario = ?";
    const rows = await pool.query(query, [id]);
    console.log(rows);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUserCredential(user, password) {
  try {
    const query =
      "select permiso from users  where usuario = ? and password = ? limit 1";
    const rows = await pool.query(query, [user, md5(password)]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function checkPassword(id, password) {
  try {
    const query =
      "select password from users where id_usuario = ? and password = ? ";
    const rows = await pool.query(query, [id, password]);
    // console.log(rows);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function modificarUsuario(obj, id) {
  try {
    const query = "update users set ? where id_usuario = ?";
    const rows = await pool.query(query, [obj, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUserByUsernameAndPassword,
  getUserCredential,
  getUserById,
  modificarUsuario,
  checkPassword,
  getAll,
};
