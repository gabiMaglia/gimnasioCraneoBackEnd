const express = require("express");
const router = express.Router();
const md5 = require('md5');
const usuarioModel = require('../../../models/userModel');

router.get("/", async (req, res, next) => {
    id = req.session.id_usuario 
    console.log(id)
    infoUsuario = await usuarioModel.getUserById(id)

  res.render("admin/components/panelUsuario", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    infoUsuario
  });
});

router.post('/modificar', async (req, res, next) => {
    id = req.session.id_usuario
    oldPass = md5(req.body.oldPass)
    obj = {
        usuario: req.body.usuario,
        password: md5(req.body.newPass)
    }
        try{
        const respuesta = await usuarioModel.checkPassword(id, oldPass)        
        if (respuesta) {
            await usuarioModel.modificarUsuario(obj, id)
                res.render("admin/components/panelUsuario", {
                    layout: "admin/layout",
                    usuario: req.session.nombre,
                    infoUsuario,
                    msj: 'El registro se actualizo con exito'
                });
        }else{
            res.render("admin/components/panelUsuario", {
                layout: "admin/layout",
                usuario: req.session.nombre,
                infoUsuario,
                msj: 'Debe escribir correctamente su contraseña antes de hacer cambios'
            });
        }
            
        }catch(error){
            console.log(error)
        }
   

})

module.exports = router;