const express = require("express");
const router = express.Router();
const horariosModel = require("../../../models/horariosModel");

router.get("/", async (req, res, next) => {
  var horarios = await horariosModel.getHorarios();
  res.render("admin/components/horarios", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    horarios,
  });
});

router.get("/modificar/:id_horario", async (req, res, next) => {
  let id = req.params.id_horario;
  let horarioData = await horariosModel.getHorarioById(id);
  let horario = true;
  console.log(horarioData);
  res.render("admin/components/modificar", {
    layout: "admin/layout",
    horario,
    usuario: req.session.nombre,
    horarioData,
  });
});

router.get("/eliminar/:id_horario", async (req, res, next) => {
  var id = req.params.id_horario;
  await horariosModel.deleteHorarioById(id);
  res.redirect("/admin/horarios");
});

router.post("/agregar", async (req, res, next) => {
  try {
    await horariosModel.insertHorario(req.body);
    res.redirect("/admin/horarios");
  } catch (error) {
    console.log(error);
    res.render("admin/components/horarios", {
      layout: "admin/layout",
      usuario: req.session.nombre,
    });
  }
});

router.post("/modificar", async (req, res, next) => {
  let horario = true;
  try {
    let obj = {
      dias_dbcol: req.body.dias_dbcol,
      horarios_dbcol: req.body.horarios_dbcol,
      modificado_por: req.body.modificado_por,
    };

    await horariosModel.modificarHorarioById(obj, req.body.id_horario);
    console.log(obj);
    console.log(req.body.id_horario);
    res.redirect("/admin/horarios");
  } catch (error) {
    console.log(error);
    res.render("admin/components/modificar", {
      layout: "admin/layout",
      usuario: req.session.nombre,
      horario,
      error: true,
      message: "No se pudo modificar el registro",
    });
  }
});

module.exports = router;
