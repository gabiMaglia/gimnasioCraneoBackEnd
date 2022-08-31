var pool = require("./db");
var md5 = require("md5");

async function getUserByUsernameAndPassword(user, password) {
  try {
    const query =
      "select * from usuarios_db   where usuario = ? and password = ? limit 1";
    const rows = await pool.query(query, [user, md5(password)]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try{
    const query = "select * from usuarios_db where id_usuario = ?";
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
      "select permiso from usuarios_db  where usuario = ? and password = ? limit 1";
    const rows = await pool.query(query, [user, md5(password)]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function checkPassword(id, password)  {
  try{
    const query = "select password from usuarios_db where id_usuario = ? and password = ? ";
    const rows = await pool.query(query, [id, password]);
    // console.log(rows);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function modificarUsuario(obj, id){
  try{
    const query = 'update usuarios_db set ? where id_usuario = ?'
    const rows = await pool.query(query, [obj, id]);
    return rows;
  }catch (error) {
    throw error;
  }
}

module.exports = { getUserByUsernameAndPassword, getUserCredential, getUserById, modificarUsuario, checkPassword };
