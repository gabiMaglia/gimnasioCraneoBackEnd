const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render("admin/proximamente", {
    layout: "admin/layout",
    usuario: req.session.nombre
  });
});

module.exports = router;