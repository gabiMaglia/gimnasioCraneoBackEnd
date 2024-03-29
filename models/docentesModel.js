var pool = require("./db");

async function getDocentes() {
  try {
    const query = "select * from docentes_db order by id_docente ASC";
    const rows = await pool.query(query);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getDocenteById(id) {
  try {
    const query = "select * from docentes_db where id_docente = ?";
    const rows = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insertDocente(obj) {
  try {
    const query = "insert into docentes_db set ?";
    const rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insertDocenteUser(obj) {
  try {
    const query = "insert into usuarios_db set ?";
    const rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function modificarDocenteById(obj, id) {
  try {
    const query = "update docentes_db set ? where id_docente = ?";
    const rows = await pool.query(query, [obj, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function modificarDocenteUserByDni(obj, dni) {
  try {
    const query = "update usuarios_db set permiso = ? where dni = ?";
    const rows = await pool.query(query, [obj, dni]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function deleteDocenteById(id) {
  try {
    const query = "delete from docentes_db where id_docente = ?";
    const rows = await pool.query(query, [id]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteDocenteUserByDni(dni) {
  try {
    const query = "delete from usuarios_db where dni = ?";
    const rows = await pool.query(query, [dni]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getDocentes,
  insertDocente,
  insertDocenteUser,
  deleteDocenteById,
  deleteDocenteUserByDni,
  modificarDocenteById,
  modificarDocenteUserByDni,
  getDocenteById,
};
