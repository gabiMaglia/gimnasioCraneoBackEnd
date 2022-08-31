const express = require("express");
const router = express.Router();
var md5 = require("md5");

const util = require("util");
const cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

const alumnosModel = require("../../../models/alumnosModel");
const horariosModel = require("../../../models/horariosModel");

const mostrarHorarios = (horarios) => {
  let arrayHorarios = [];
  for (const horario in horarios) {
    arrayHorarios.push(
      horarios[horario].dias_dbcol + horarios[horario].horarios_dbcol
    );
  }
  return arrayHorarios;
};

router.get("/", async (req, res, next) => {
  const alumnos = await alumnosModel.getAlumnos();
  res.render("admin/components/alumnos", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    alumnos,
  });
});

router.get("/agregar", async (req, res, next) => {
  const horarios = await horariosModel.getHorarios();
  const alumno = true;
  arrayHorarios = mostrarHorarios(horarios);

  res.render("admin/components/agregar", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    alumno,
    arrayHorarios,
  });
});

router.get("/modificar/:id_alumno", async (req, res, next) => {
  const id = req.params.id_alumno;
  let alumnoData = await alumnosModel.getAlumnosById(id);
  const alumno = true;

  const horarios = await horariosModel.getHorarios();
  arrayHorarios = mostrarHorarios(horarios);

  res.render("admin/components/modificar", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    alumno,
    alumnoData,
    arrayHorarios,
  });
});

router.get("/eliminar/:id_alumno", async (req, res, next) => {
  const id = req.params.id_alumno;

  const alumno = await alumnosModel.getAlumnosById(id);
  if (alumno.foto) {
    await destroy(alumno.foto);
  }

  await alumnosModel.deleteAlumnoUserByDni(alumno.dni);
  await alumnosModel.deleteAlumnoById(id);
  res.redirect("/admin/alumnos");
});

router.get("/perfilPersonal/:id_alumno", async (req, res, next) => {
  const id = req.params.id_alumno;
  let alumnoData = await alumnosModel.getAlumnosById(id);
  const alumno = true;
  let pic =
    "<img src = 'https://res.cloudinary.com/atlasair/image/upload/v1661037957/craneo_black_igfvsz.png' alt={{alumnoData.nombre}}  height='150' width='150'>";
  if (alumnoData.foto) {
    pic = cloudinary.image(alumnoData.foto, {
      width: 150,
      height: 150,
      alt: alumnoData.nombre,
      crop: "fill",
    });
  }
  res.render("admin/components/perfilPersonal", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    alumno,
    pic,
    alumnoData,
  });
});

router.post("/agregar", async (req, res, next) => {
  let alumno = true;
  try {
    let foto = "";

    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.foto;
      foto = (await uploader(imagen.tempFilePath)).public_id;
    }
    if (
      req.body.nombre != "" &&
      req.body.fecha_inscripcion != "" &&
      req.body.dni != ""
    ) {
      let obj = {
        dni: req.body.dni,
        usuario: req.body.dni,
        password: md5(req.body.dni),
        permisos: "alumno",
      };
      await alumnosModel.insertAlumnoUser(obj);

      await alumnosModel.insertAlumno({
        ...req.body,
        foto,
      });

      res.redirect("/admin/alumnos");
    } else {
      const horarios = await horariosModel.getHorarios();
      arrayHorarios = mostrarHorarios(horarios);

      res.render("admin/components/agregar", {
        layout: "admin/layout",
        usuario: req.session.nombre,
        arrayHorarios,
        alumno,
        error: true,
        message: "Completa todos los campos obligatorios",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("admin/components/agregar", {
      layout: "admin/layout",
      usuario: req.session.nombre,
      arrayHorarios,
      alumno,
      error: true,
      message: "No se pudo cargar el registro",
    });
  }
});

router.post("/modificar", async (req, res, next) => {
  const alumno = true;
  try {
    // manejo de imagenes
    let foto = req.body.img_original;
    let borrar_img_vieja = false;

    if (req.body.img_delete === "1") {
      foto = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.foto;
        foto = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await destroy(req.body.img_original);
    }

    // fin de manejo de imagenes

    let obj = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      email: req.body.email,
      fecha_inscripcion: req.body.fecha_inscripcion,
      horario: req.body.horario,
      facebookAdd: req.body.facebookAdd,
      instagramAdd: req.body.instagramAdd,
      foto,
      observaciones: req.body.observaciones,
      modificado_por: req.body.modificado_por,
    };

    await alumnosModel.modificarAlumnoById(obj, req.body.alumno_id);
    res.redirect("/admin/alumnos");
  } catch (error) {
    console.log(error);

    res.render("admin/components/modificar", {
      layout: "admin/layout",
      usuario: req.session.nombre,
      alumno,
      alumnoData,
      error: true,
      message: "No se pudo modificar el registro",
    });
  }
});

module.exports = router;
