const express = require("express");
const router = express.Router();

const checkCredential = (permiso) => {
  if (permiso == 'admin'){
    return true
  }else {
    return false
  }
}  

router.get("/", (req, res, next) => {
  permiso = req.session.permiso

  res.render("admin/components/panelPrincipal", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    permiso: checkCredential(permiso)
  });
});

module.exports = router;
