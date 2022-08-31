const express = require("express");
const router = express.Router();
var md5 = require("md5");

const util = require("util");
const cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

var docentesModel = require("../../../models/docentesModel");


router.get("/", async function (req, res, next) {
  const docentes = await docentesModel.getDocentes();
  res.render("admin/components/docentes", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    docentes,
  });
});

router.get("/agregar", (req, res, next) => {
  const docente = true;
  res.render("admin/components/agregar", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    docente,
  });
});

router.get("/modificar/:id_docente", async (req, res, next) => {
  const id = req.params.id_docente;
  const docenteData = await docentesModel.getDocenteById(id);
  const docente = true;
  res.render("admin/components/modificar", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    docente,
    docenteData,
  });
});

router.get("/perfilPersonal/:id_docente", async (req, res, next) => {
  const id = req.params.id_docente;
  const docenteData = await docentesModel.getDocenteById(id);
  const docente = true;
  let pic =
  "<img src = 'https://res.cloudinary.com/atlasair/image/upload/v1661037957/craneo_black_igfvsz.png' alt={{docenteData.nombre}}  height='150' width='150'>";

  if (docenteData.foto){
    pic = cloudinary.image(docenteData.foto, {
      width: 150,
      height: 150,
      alt: docenteData.nombre,
      crop: "fill",
    });

  }

  res.render("admin/components/perfilPersonal", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    docente,
    docenteData,
    pic
  });
});

router.get("/eliminar/:id_docente", async (req, res, next) => {
  const id = req.params.id_docente;

  const docente = await docentesModel.getDocenteById(id);
  if (docente.foto) {
    await(destroy(docente.foto))
  }
  await docentesModel.deleteDocenteUserByDni(docente.dni);
  await docentesModel.deleteDocenteById(id);
  res.redirect("/admin/docentes");
});

router.post("/agregar", async (req, res, next) => {
  const docente = true;
  try {
    
    let foto = '';
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.foto;
        foto = (await uploader(imagen.tempFilePath)).public_id
      }

    if (req.body.nombre != "" && req.body.dni != "") {
      await docentesModel.insertDocente({
        ...req.body,
           foto
      });
      // Esto agregara tambien el usuario de ingreso para el usuario en cuestion
      let obj = {
        dni: req.body.dni ,
        usuario: req.body.dni,
        password: md5(req.body.dni), 
        permiso: req.body.permiso
      }
      await docentesModel.insertDocenteUser(obj)
      // Fin

      res.redirect("/admin/docentes");
    } else {
      res.render("admin/components/agregar", {
        layout: "admin/layout",
        usuario: req.session.nombre,
        docente,
        error: true,
        message: "Completa todos los campos obligatorios",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("admin/components/agregar", {
      layout: "admin/layout",
      usuario: req.session.nombre,
      docente,
      error: true,
      message: "No se pudo cargar el registro",
    });
  }
});

router.post("/modificar", async (req, res, next) => {
  const docente = true;
  try {
    let foto = req.body.img_original
    let borrar_img_vieja = false
    
    if (req.body.img_delete === '1') {
      foto = null
      borrar_img_vieja = true
    }else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.foto
        foto = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original))
    }
    

    let obj = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      titulo: req.body.titulo,
      dni: req.body.dni,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      email: req.body.email,
      instagramAdd: req.body.instagramAdd,
      facebookAdd: req.body.facebookAdd,
      permiso: req.body.permiso,
      horario: req.body.horario,
      foto,
      modificado_por: req.body.modificado_por
    };

    await docentesModel.modificarDocenteById(obj, req.body.id_docente);
    await docentesModel.modificarDocenteUserByDni(req.body.permiso, req.body.dni, )
   
    res.redirect("/admin/docentes");
  } catch (error) {
    console.log(error);

    res.render("admin/components/modificar", {
      layout: "admin/layout",
      usuario: req.session.nombre,
      docente,
      docenteData,
      error: true,
      message: "No se pudo modificar el registro",
    });
  }
});

module.exports = router;
