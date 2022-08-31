const expreess = require("express");
const router = expreess.Router();
const docentesModel = require("./../models/docentesModel");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

router.get("/docentes", async function (req, res, next) {
  let docentes = await docentesModel.getDocentes();

  docentes = docentes.map((docentes) => {
    if (docentes.foto) {
      const foto = cloudinary.url(docentes.foto, {
        width: 220,
        height: 320,
        crop: "fill",
      });
      return {
        ...docentes,
        foto,
      };
    } else {
      return {
        ...docentes,
        foto: "https://res.cloudinary.com/atlasair/image/upload/v1661037957/craneo_black_igfvsz.png",
      };
    }
  });

  res.json(docentes);
});

router.post("/contacto", async (req, res) => {
  const mail = {
    to: "gab.maglia@gmail.com",
    subject: "Contacto Web",
    html: `${req.body.nombre} ${req.body.apellido} se contacto a travez de la web y quiere mas informacion a este correo: 
    ${req.body.mail} <br> Ademas, hizo el siguiente comentario:
    ${req.body.mensaje} <br>`,
  };

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },

    
  });
  await transport.sendMail(mail);

  res.status(201).json({
    error: false,
    MessageChannel: "Mensaje enviado",
  });
});

module.exports = router;
