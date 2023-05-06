var pool = require("./db");

async function getAlumnos() {
  try {
    const query = "select * from alumnos_db order by id_alumno ASC limit 10 ";
    const rows = await pool.query(query);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAlumnosById(id) {
  try {
    const query = "select * from alumnos_db where id_alumno = ?";
    const rows = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insertAlumno(obj) {
  try {
    const query = "insert into alumnos_db set ?";
    const rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insertAlumnoUser(obj) {
  try {
    const query = "insert into usuarios_db set ?";
    const rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function modificarAlumnoById(obj, id) {
  try {
    const query = "update alumnos_db set ? where id_alumno = ?";
    const rows = await pool.query(query, [obj, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function deleteAlumnoById(id) {
  try {
    const query = "delete from alumnos_db where id_alumno = ?";
    const rows = await pool.query(query, [id]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteAlumnoUserByDni(dni) {
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
  getAlumnos,
  getAlumnosById,
  insertAlumno,
  insertAlumnoUser,
  deleteAlumnoById,
  deleteAlumnoUserByDni,
  modificarAlumnoById,
};
